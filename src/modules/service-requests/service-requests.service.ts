import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, paginationOptions } from '../../common/utils/pagination.util';
import { Role } from '../../shared/enums/role.enum';
import { ServiceRequestStatus } from '../../shared/enums/service-request-status.enum';
import type { JwtUser } from '../auth/types/jwt-user.type';
import { UsersService } from '../users/users.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { AssignMechanicDto } from './dto/assign-mechanic.dto';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { ServiceRequestQueryDto } from './dto/service-request-query.dto';
import { UpdateRemarksDto } from './dto/update-remarks.dto';
import { UpdateServiceStatusDto } from './dto/update-service-status.dto';
import { ServiceRequestTimeline } from './entities/service-request-timeline.entity';
import { ServiceRequest } from './entities/service-request.entity';

@Injectable()
export class ServiceRequestsService {
  private readonly transitions: Record<ServiceRequestStatus, ServiceRequestStatus[]> = {
    [ServiceRequestStatus.PENDING]: [
      ServiceRequestStatus.INSPECTING,
      ServiceRequestStatus.CANCELLED,
    ],
    [ServiceRequestStatus.INSPECTING]: [
      ServiceRequestStatus.IN_PROGRESS,
      ServiceRequestStatus.CANCELLED,
    ],
    [ServiceRequestStatus.IN_PROGRESS]: [
      ServiceRequestStatus.COMPLETED,
      ServiceRequestStatus.CANCELLED,
    ],
    [ServiceRequestStatus.COMPLETED]: [],
    [ServiceRequestStatus.CANCELLED]: [],
  };

  constructor(
    @InjectRepository(ServiceRequest)
    private readonly requestsRepository: Repository<ServiceRequest>,
    @InjectRepository(ServiceRequestTimeline)
    private readonly timelineRepository: Repository<ServiceRequestTimeline>,
    private readonly vehiclesService: VehiclesService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    dto: CreateServiceRequestDto,
    currentUser: JwtUser,
  ): Promise<ServiceRequest> {
    const vehicle = await this.vehiclesService.findById(dto.vehicleId);
    const request = await this.requestsRepository.save(
      this.requestsRepository.create({
        vehicleId: vehicle.id,
        advisorId: currentUser.sub,
        description: dto.description,
        estimatedCompletion: dto.estimatedCompletion,
        status: ServiceRequestStatus.PENDING,
      }),
    );

    await this.addTimeline(
      request.id,
      currentUser.sub,
      undefined,
      ServiceRequestStatus.PENDING,
      'Service request created.',
    );

    return this.findById(request.id, currentUser);
  }

  async findAll(query: ServiceRequestQueryDto, currentUser: JwtUser) {
    const { page, limit, skip, take } = paginationOptions(query);
    const qb = this.requestsRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.vehicle', 'vehicle')
      .leftJoinAndSelect('vehicle.owner', 'owner')
      .leftJoinAndSelect('request.advisor', 'advisor')
      .leftJoinAndSelect('request.mechanic', 'mechanic');

    if (currentUser.role === Role.MECHANIC) {
      qb.andWhere('request.mechanicId = :mechanicId', {
        mechanicId: currentUser.sub,
      });
    }

    if (currentUser.role === Role.CUSTOMER) {
      qb.andWhere('vehicle.ownerId = :ownerId', { ownerId: currentUser.sub });
    }

    if (query.status) {
      qb.andWhere('request.status = :status', { status: query.status });
    }
    if (query.mechanicId) {
      qb.andWhere('request.mechanicId = :mechanicId', {
        mechanicId: query.mechanicId,
      });
    }
    if (query.vehicleId) {
      qb.andWhere('request.vehicleId = :vehicleId', { vehicleId: query.vehicleId });
    }
    if (query.dateFrom) {
      qb.andWhere('request.createdAt >= :dateFrom', { dateFrom: query.dateFrom });
    }
    if (query.dateTo) {
      qb.andWhere('request.createdAt <= :dateTo', { dateTo: query.dateTo });
    }

    const [requests, total] = await qb
      .orderBy('request.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return paginate(requests, total, page, limit);
  }

  async findById(id: string, currentUser?: JwtUser): Promise<ServiceRequest> {
    const request = await this.requestsRepository.findOne({
      where: { id },
      relations: {
        vehicle: { owner: true },
        advisor: true,
        mechanic: true,
      },
    });

    if (!request) {
      throw new NotFoundException('Service request not found.');
    }

    if (currentUser) {
      this.assertCanView(request, currentUser);
    }

    return request;
  }

  async assignMechanic(
    id: string,
    dto: AssignMechanicDto,
    currentUser: JwtUser,
  ): Promise<ServiceRequest> {
    const request = await this.findById(id);
    this.assertModifiable(request);

    const mechanic = await this.usersService.findById(dto.mechanicId);
    if (mechanic.role !== Role.MECHANIC) {
      throw new UnprocessableEntityException('Assigned user must be a mechanic.');
    }

    request.mechanicId = mechanic.id;
    await this.requestsRepository.save(request);
    await this.addTimeline(
      request.id,
      currentUser.sub,
      request.status,
      request.status,
      `Mechanic assigned: ${mechanic.id}`,
    );

    return this.findById(id, currentUser);
  }

  async updateStatus(
    id: string,
    dto: UpdateServiceStatusDto,
    currentUser: JwtUser,
  ): Promise<ServiceRequest> {
    const request = await this.findById(id);
    this.assertModifiable(request);

    if (!this.transitions[request.status].includes(dto.status)) {
      throw new UnprocessableEntityException(
        `Invalid status transition from ${request.status} to ${dto.status}.`,
      );
    }

    if (dto.status === ServiceRequestStatus.IN_PROGRESS && !request.mechanicId) {
      throw new UnprocessableEntityException(
        'A mechanic must be assigned before work can start.',
      );
    }

    const fromStatus = request.status;
    request.status = dto.status;
    await this.requestsRepository.save(request);
    await this.addTimeline(
      request.id,
      currentUser.sub,
      fromStatus,
      dto.status,
      dto.note,
    );

    return this.findById(id, currentUser);
  }

  async updateRemarks(
    id: string,
    dto: UpdateRemarksDto,
    currentUser: JwtUser,
  ): Promise<ServiceRequest> {
    const request = await this.findById(id, currentUser);
    this.assertModifiable(request);

    if (
      currentUser.role === Role.MECHANIC &&
      request.mechanicId !== currentUser.sub
    ) {
      throw new ForbiddenException('Only the assigned mechanic can update remarks.');
    }

    request.remarks = dto.remarks;
    return this.requestsRepository.save(request);
  }

  async getTimeline(id: string, currentUser: JwtUser) {
    await this.findById(id, currentUser);
    return this.timelineRepository.find({
      where: { serviceRequestId: id },
      relations: { changedBy: true },
      order: { createdAt: 'ASC' },
    });
  }

  async cancel(id: string, currentUser: JwtUser): Promise<ServiceRequest> {
    return this.updateStatus(
      id,
      { status: ServiceRequestStatus.CANCELLED, note: 'Cancelled.' },
      currentUser,
    );
  }

  private async addTimeline(
    serviceRequestId: string,
    changedById: string,
    fromStatus: ServiceRequestStatus | undefined,
    toStatus: ServiceRequestStatus,
    note?: string,
  ) {
    await this.timelineRepository.save(
      this.timelineRepository.create({
        serviceRequestId,
        changedById,
        fromStatus,
        toStatus,
        note,
      }),
    );
  }

  private assertCanView(request: ServiceRequest, user: JwtUser) {
    if ([Role.ADMIN, Role.SERVICE_ADVISOR].includes(user.role)) {
      return;
    }
    if (user.role === Role.MECHANIC && request.mechanicId === user.sub) {
      return;
    }
    if (user.role === Role.CUSTOMER && request.vehicle.ownerId === user.sub) {
      return;
    }

    throw new ForbiddenException('You cannot access this service request.');
  }

  private assertModifiable(request: ServiceRequest) {
    if (
      [ServiceRequestStatus.COMPLETED, ServiceRequestStatus.CANCELLED].includes(
        request.status,
      )
    ) {
      throw new UnprocessableEntityException(
        'Completed or cancelled service requests cannot be modified.',
      );
    }
  }
}
