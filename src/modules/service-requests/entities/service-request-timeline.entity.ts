import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceRequestStatus } from '../../../shared/enums/service-request-status.enum';
import { User } from '../../users/entities/user.entity';
import { ServiceRequest } from './service-request.entity';

@Entity('service_request_timelines')
export class ServiceRequestTimeline {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'service_request_id' })
  serviceRequestId: string;

  @ManyToOne(() => ServiceRequest, (request) => request.timeline, {
    onDelete: 'CASCADE',
  })
  serviceRequest: ServiceRequest;

  @Column({ name: 'changed_by_id' })
  changedById: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  changedBy: User;

  @Column({
    name: 'from_status',
    type: 'enum',
    enum: ServiceRequestStatus,
    nullable: true,
  })
  fromStatus?: ServiceRequestStatus;

  @Column({ name: 'to_status', type: 'enum', enum: ServiceRequestStatus })
  toStatus: ServiceRequestStatus;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
