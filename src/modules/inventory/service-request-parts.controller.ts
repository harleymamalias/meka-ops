import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';
import type { JwtUser } from '../auth/types/jwt-user.type';
import { AddServiceRequestPartDto } from './dto/add-service-request-part.dto';
import { InventoryService } from './inventory.service';

@Controller('service-requests/:serviceRequestId/parts')
export class ServiceRequestPartsController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR, Role.MECHANIC)
  @Post()
  addPart(
    @Param('serviceRequestId') serviceRequestId: string,
    @Body() dto: AddServiceRequestPartDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.inventoryService.addPartToServiceRequest(
      serviceRequestId,
      dto,
      user,
    );
  }

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR, Role.MECHANIC)
  @Get()
  findParts(@Param('serviceRequestId') serviceRequestId: string) {
    return this.inventoryService.findPartsForServiceRequest(serviceRequestId);
  }
}
