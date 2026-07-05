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
import { ServiceRequest } from '../service-requests/entities/service-request.entity';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CreateMaintenanceRecordDto } from './dto/create-maintenance-record.dto';
import { MaintenanceRecordQueryDto } from './dto/maintenance-record-query.dto';
import { MaintenanceRecord } from './entities/maintenance-record.entity';

@Injectable()
export class MaintenanceRecordsService {
  constructor(
    @InjectRepository(MaintenanceRecord)
    private readonly recordsRepository: Repository<MaintenanceRecord>,
    @InjectRepository(ServiceRequest)
    private readonly serviceRequestsRepository: Repository<ServiceRequest>,
    private readonly vehiclesService: VehiclesService,
  ) {}

  async createManual(dto: CreateMaintenanceRecordDto): Promise<MaintenanceRecord> {
    await this.vehiclesService.findById(dto.vehicleId);
    return this.recordsRepository.save(this.recordsRepository.create(dto));
  }

  async createFromServiceRequest(
    serviceRequestId: string,
  ): Promise<MaintenanceRecord> {
    const existing = await this.recordsRepository.findOne({
      where: { serviceRequestId },
    });

    if (existing) {
      return existing;
    }

    const request = await this.serviceRequestsRepository.findOne({
      where: { id: serviceRequestId },
      relations: { vehicle: true },
    });

    if (!request) {
      throw new NotFoundException('Service request not found.');
    }

    if (request.status !== ServiceRequestStatus.COMPLETED) {
      throw new UnprocessableEntityException(
        'Maintenance records can only be created from completed service requests.',
      );
    }

    return this.recordsRepository.save(
      this.recordsRepository.create({
        serviceRequestId: request.id,
        vehicleId: request.vehicleId,
        serviceType: 'Service Request',
        description: request.description,
        mileageAtService: request.vehicle.mileage,
      }),
    );
  }

  async findAll(query: MaintenanceRecordQueryDto, currentUser: JwtUser) {
    const { page, limit, skip, take } = paginationOptions(query);
    const qb = this.recordsRepository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.vehicle', 'vehicle')
      .leftJoinAndSelect('vehicle.owner', 'owner')
      .leftJoinAndSelect('record.serviceRequest', 'serviceRequest');

    if (currentUser.role === Role.CUSTOMER) {
      qb.andWhere('vehicle.ownerId = :ownerId', { ownerId: currentUser.sub });
    }
    if (query.vehicleId) {
      qb.andWhere('record.vehicleId = :vehicleId', { vehicleId: query.vehicleId });
    }
    if (query.serviceType) {
      qb.andWhere('record.serviceType ILIKE :serviceType', {
        serviceType: `%${query.serviceType}%`,
      });
    }
    if (query.dateFrom) {
      qb.andWhere('record.createdAt >= :dateFrom', { dateFrom: query.dateFrom });
    }
    if (query.dateTo) {
      qb.andWhere('record.createdAt <= :dateTo', { dateTo: query.dateTo });
    }

    const [records, total] = await qb
      .orderBy('record.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return paginate(records, total, page, limit);
  }

  async findById(id: string, currentUser: JwtUser): Promise<MaintenanceRecord> {
    const record = await this.recordsRepository.findOne({
      where: { id },
      relations: { vehicle: { owner: true }, serviceRequest: true },
    });

    if (!record) {
      throw new NotFoundException('Maintenance record not found.');
    }

    if (
      currentUser.role === Role.CUSTOMER &&
      record.vehicle.ownerId !== currentUser.sub
    ) {
      throw new ForbiddenException('You can only access your own records.');
    }

    return record;
  }
}
