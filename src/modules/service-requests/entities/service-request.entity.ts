import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServiceRequestStatus } from '../../../shared/enums/service-request-status.enum';
import { User } from '../../users/entities/user.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { ServiceRequestTimeline } from './service-request-timeline.entity';

@Entity('service_requests')
export class ServiceRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'vehicle_id' })
  vehicleId: string;

  @ManyToOne(() => Vehicle, { onDelete: 'RESTRICT' })
  vehicle: Vehicle;

  @Column({ name: 'advisor_id' })
  advisorId: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  advisor: User;

  @Column({ name: 'mechanic_id', nullable: true })
  mechanicId?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  mechanic?: User;

  @Column({
    type: 'enum',
    enum: ServiceRequestStatus,
    default: ServiceRequestStatus.PENDING,
  })
  status: ServiceRequestStatus;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ name: 'estimated_completion', type: 'timestamptz', nullable: true })
  estimatedCompletion?: Date;

  @OneToMany(() => ServiceRequestTimeline, (timeline) => timeline.serviceRequest)
  timeline: ServiceRequestTimeline[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
