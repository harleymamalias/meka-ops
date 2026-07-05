import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { ServiceRequestTimeline } from './entities/service-request-timeline.entity';
import { ServiceRequest } from './entities/service-request.entity';
import { ServiceRequestsController } from './service-requests.controller';
import { ServiceRequestsService } from './service-requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceRequest, ServiceRequestTimeline]),
    VehiclesModule,
    UsersModule,
  ],
  controllers: [ServiceRequestsController],
  providers: [ServiceRequestsService],
  exports: [ServiceRequestsService, TypeOrmModule],
})
export class ServiceRequestsModule {}
