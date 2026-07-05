import { Controller, Get, Param } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';
import { InvoicesService } from './invoices.service';

@Controller('service-requests/:serviceRequestId/invoice')
export class ServiceRequestInvoiceController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR)
  @Get()
  findForServiceRequest(@Param('serviceRequestId') serviceRequestId: string) {
    return this.invoicesService.findByServiceRequest(serviceRequestId);
  }
}
