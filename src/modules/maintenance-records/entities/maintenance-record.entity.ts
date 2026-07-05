import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceRequest } from '../../service-requests/entities/service-request.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('maintenance_records')
export class MaintenanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'service_request_id', nullable: true })
  serviceRequestId?: string;

  @ManyToOne(() => ServiceRequest, { nullable: true, onDelete: 'SET NULL' })
  serviceRequest?: ServiceRequest;

  @Column({ name: 'vehicle_id' })
  vehicleId: string;

  @ManyToOne(() => Vehicle, { onDelete: 'RESTRICT' })
  vehicle: Vehicle;

  @Column({ name: 'service_type' })
  serviceType: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'mileage_at_service' })
  mileageAtService: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
