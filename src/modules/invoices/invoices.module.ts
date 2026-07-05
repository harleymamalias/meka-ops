import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModule } from '../inventory/inventory.module';
import { ServiceRequestsModule } from '../service-requests/service-requests.module';
import { Invoice } from './entities/invoice.entity';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { ServiceRequestInvoiceController } from './service-request-invoice.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    ServiceRequestsModule,
    InventoryModule,
  ],
  controllers: [InvoicesController, ServiceRequestInvoiceController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
