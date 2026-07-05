import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Vehicle } from './entities/vehicle.entity';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle]), UsersModule],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService, TypeOrmModule],
})
export class VehiclesModule {}
