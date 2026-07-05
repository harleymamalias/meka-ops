import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { paginate, paginationOptions } from '../../common/utils/pagination.util';
import { Role } from '../../shared/enums/role.enum';
import { ServiceRequestStatus } from '../../shared/enums/service-request-status.enum';
import type { JwtUser } from '../auth/types/jwt-user.type';
import { ServiceRequestsService } from '../service-requests/service-requests.service';
import { AddServiceRequestPartDto } from './dto/add-service-request-part.dto';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { InventoryQueryDto } from './dto/inventory-query.dto';
import { RestockItemDto } from './dto/restock-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { InventoryItem } from './entities/inventory-item.entity';
import { ServiceRequestPart } from './entities/service-request-part.entity';

type InventoryItemResponse = InventoryItem & { lowStock: boolean };

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryRepository: Repository<InventoryItem>,
    @InjectRepository(ServiceRequestPart)
    private readonly partsRepository: Repository<ServiceRequestPart>,
    private readonly serviceRequestsService: ServiceRequestsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateInventoryItemDto): Promise<InventoryItem> {
    const sku = dto.sku.trim().toUpperCase();
    const existing = await this.inventoryRepository.findOne({ where: { sku } });
    if (existing) {
      throw new ConflictException('SKU is already registered.');
    }

    return this.inventoryRepository.save(
      this.inventoryRepository.create({
        ...dto,
        sku,
        lowStockThreshold: dto.lowStockThreshold ?? 5,
      }),
    );
  }

  async findAll(query: InventoryQueryDto) {
    const { page, limit, skip, take } = paginationOptions(query);
    const qb = this.inventoryRepository.createQueryBuilder('item');

    if (query.search) {
      qb.andWhere('(item.name ILIKE :search OR item.sku ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    if (query.lowStock) {
      qb.andWhere('item.quantity <= item.lowStockThreshold');
    }

    const [items, total] = await qb
      .orderBy('item.name', 'ASC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return paginate(
      items.map((item) => this.withLowStock(item)),
      total,
      page,
      limit,
    );
  }

  async findById(id: string): Promise<InventoryItemResponse> {
    const item = await this.inventoryRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Inventory item not found.');
    }
    return this.withLowStock(item);
  }

  async update(id: string, dto: UpdateInventoryItemDto): Promise<InventoryItem> {
    const item = await this.inventoryRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Inventory item not found.');
    }

    if (dto.sku) {
      const sku = dto.sku.trim().toUpperCase();
      const existing = await this.inventoryRepository.findOne({ where: { sku } });
      if (existing && existing.id !== id) {
        throw new ConflictException('SKU is already registered.');
      }
      item.sku = sku;
    }

    item.name = dto.name ?? item.name;
    item.quantity = dto.quantity ?? item.quantity;
    item.unit = dto.unit ?? item.unit;
    item.unitPrice = dto.unitPrice ?? item.unitPrice;
    item.lowStockThreshold = dto.lowStockThreshold ?? item.lowStockThreshold;

    return this.inventoryRepository.save(item);
  }

  async restock(id: string, dto: RestockItemDto): Promise<InventoryItem> {
    const item = await this.inventoryRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Inventory item not found.');
    }

    item.quantity += dto.quantity;
    return this.inventoryRepository.save(item);
  }

  async addPartToServiceRequest(
    serviceRequestId: string,
    dto: AddServiceRequestPartDto,
    currentUser: JwtUser,
  ): Promise<ServiceRequestPart> {
    const request = await this.serviceRequestsService.findById(
      serviceRequestId,
      currentUser,
    );

    if (
      currentUser.role === Role.MECHANIC &&
      request.mechanicId !== currentUser.sub
    ) {
      throw new ForbiddenException('Only the assigned mechanic can add parts.');
    }

    if (
      [ServiceRequestStatus.COMPLETED, ServiceRequestStatus.CANCELLED].includes(
        request.status,
      )
    ) {
      throw new UnprocessableEntityException(
        'Parts cannot be added to completed or cancelled requests.',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const item = await manager.findOne(InventoryItem, {
        where: { id: dto.inventoryItemId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!item) {
        throw new NotFoundException('Inventory item not found.');
      }

      if (item.quantity < dto.quantityUsed) {
        throw new UnprocessableEntityException('Insufficient stock.');
      }

      item.quantity -= dto.quantityUsed;
      await manager.save(item);

      return manager.save(
        manager.create(ServiceRequestPart, {
          serviceRequestId,
          inventoryItemId: item.id,
          quantityUsed: dto.quantityUsed,
          unitPriceAtUse: item.unitPrice,
        }),
      );
    });
  }

  async findPartsForServiceRequest(serviceRequestId: string) {
    return this.partsRepository.find({
      where: { serviceRequestId },
      relations: { inventoryItem: true },
      order: { createdAt: 'ASC' },
    });
  }

  private withLowStock(item: InventoryItem): InventoryItemResponse {
    return Object.assign(item, {
      lowStock: item.quantity <= item.lowStockThreshold,
    });
  }
}
