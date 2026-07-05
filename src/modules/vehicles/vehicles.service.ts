import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../shared/enums/role.enum';
import { JwtUser } from '../auth/types/jwt-user.type';
import { UsersService } from '../users/users.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleQueryDto } from './dto/vehicle-query.dto';
import { Vehicle } from './entities/vehicle.entity';
import {
  paginate,
  paginationOptions,
} from '../../common/utils/pagination.util';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateVehicleDto, currentUser: JwtUser): Promise<Vehicle> {
    const plateNumber = this.normalizePlate(dto.plateNumber);
    const existing = await this.vehiclesRepository.findOne({
      where: { plateNumber },
    });

    if (existing) {
      throw new ConflictException('Plate number is already registered.');
    }

    const ownerId =
      currentUser.role === Role.CUSTOMER ? currentUser.sub : dto.ownerId;

    if (!ownerId) {
      throw new ForbiddenException('ownerId is required for this role.');
    }

    const owner = await this.usersService.findById(ownerId);
    if (owner.role !== Role.CUSTOMER) {
      throw new ForbiddenException('Vehicle owner must be a customer.');
    }

    const vehicle = this.vehiclesRepository.create({
      ownerId,
      plateNumber,
      brand: dto.brand,
      model: dto.model,
      year: dto.year,
      engineType: dto.engineType,
      mileage: dto.mileage ?? 0,
    });

    return this.vehiclesRepository.save(vehicle);
  }

  async findAll(query: VehicleQueryDto) {
    const { page, limit, skip, take } = paginationOptions(query);
    const qb = this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.owner', 'owner');

    if (query.ownerId) {
      qb.andWhere('vehicle.ownerId = :ownerId', { ownerId: query.ownerId });
    }

    if (query.search) {
      qb.andWhere(
        '(vehicle.plateNumber ILIKE :search OR vehicle.brand ILIKE :search OR vehicle.model ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const [vehicles, total] = await qb
      .orderBy('vehicle.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return paginate(vehicles, total, page, limit);
  }

  async findMine(currentUser: JwtUser, query: VehicleQueryDto) {
    return this.findAll({ ...query, ownerId: currentUser.sub });
  }

  async findById(id: string, currentUser?: JwtUser): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.');
    }

    if (
      currentUser?.role === Role.CUSTOMER &&
      vehicle.ownerId !== currentUser.sub
    ) {
      throw new ForbiddenException('You can only access your own vehicles.');
    }

    return vehicle;
  }

  async update(id: string, dto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.findById(id);

    if (dto.plateNumber) {
      const plateNumber = this.normalizePlate(dto.plateNumber);
      const existing = await this.vehiclesRepository.findOne({
        where: { plateNumber },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Plate number is already registered.');
      }
      vehicle.plateNumber = plateNumber;
    }

    vehicle.ownerId = dto.ownerId ?? vehicle.ownerId;
    vehicle.brand = dto.brand ?? vehicle.brand;
    vehicle.model = dto.model ?? vehicle.model;
    vehicle.year = dto.year ?? vehicle.year;
    vehicle.engineType = dto.engineType ?? vehicle.engineType;
    vehicle.mileage = dto.mileage ?? vehicle.mileage;

    return this.vehiclesRepository.save(vehicle);
  }

  private normalizePlate(plateNumber: string): string {
    return plateNumber.trim().toUpperCase();
  }
}
