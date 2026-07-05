import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRequestsModule } from '../service-requests/service-requests.module';
import { InventoryItem } from './entities/inventory-item.entity';
import { ServiceRequestPart } from './entities/service-request-part.entity';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { ServiceRequestPartsController } from './service-request-parts.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryItem, ServiceRequestPart]),
    ServiceRequestsModule,
  ],
  controllers: [InventoryController, ServiceRequestPartsController],
  providers: [InventoryService],
  exports: [InventoryService, TypeOrmModule],
})
export class InventoryModule {}
