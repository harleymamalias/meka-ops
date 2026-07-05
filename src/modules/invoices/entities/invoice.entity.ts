import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvoiceStatus } from '../../../shared/enums/invoice-status.enum';
import { ServiceRequest } from '../../service-requests/entities/service-request.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'service_request_id', unique: true })
  serviceRequestId: string;

  @ManyToOne(() => ServiceRequest, { onDelete: 'RESTRICT' })
  serviceRequest: ServiceRequest;

  @Column({ name: 'labor_cost', type: 'decimal', precision: 10, scale: 2 })
  laborCost: string;

  @Column({ name: 'parts_cost', type: 'decimal', precision: 10, scale: 2 })
  partsCost: string;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: string;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.UNPAID })
  status: InvoiceStatus;

  @Column({ name: 'payment_proof_url', nullable: true })
  paymentProofUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
