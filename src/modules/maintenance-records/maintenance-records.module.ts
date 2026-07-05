import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRequest } from '../service-requests/entities/service-request.entity';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { MaintenanceRecord } from './entities/maintenance-record.entity';
import { MaintenanceRecordsController } from './maintenance-records.controller';
import { MaintenanceRecordsService } from './maintenance-records.service';
import { VehicleMaintenanceRecordsController } from './vehicle-maintenance-records.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([MaintenanceRecord, ServiceRequest]),
    VehiclesModule,
  ],
  controllers: [
    MaintenanceRecordsController,
    VehicleMaintenanceRecordsController,
  ],
  providers: [MaintenanceRecordsService],
  exports: [MaintenanceRecordsService, TypeOrmModule],
})
export class MaintenanceRecordsModule {}
