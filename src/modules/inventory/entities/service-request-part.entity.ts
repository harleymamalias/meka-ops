import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceRequest } from '../../service-requests/entities/service-request.entity';
import { InventoryItem } from './inventory-item.entity';

@Entity('service_request_parts')
export class ServiceRequestPart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'service_request_id' })
  serviceRequestId: string;

  @ManyToOne(() => ServiceRequest, { onDelete: 'CASCADE' })
  serviceRequest: ServiceRequest;

  @Column({ name: 'inventory_item_id' })
  inventoryItemId: string;

  @ManyToOne(() => InventoryItem, (item) => item.usageHistory, {
    onDelete: 'RESTRICT',
  })
  inventoryItem: InventoryItem;

  @Column({ name: 'quantity_used' })
  quantityUsed: number;

  @Column({
    name: 'unit_price_at_use',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  unitPriceAtUse: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
