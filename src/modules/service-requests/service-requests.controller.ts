import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';
import type { JwtUser } from '../auth/types/jwt-user.type';
import { AssignMechanicDto } from './dto/assign-mechanic.dto';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { ServiceRequestQueryDto } from './dto/service-request-query.dto';
import { UpdateRemarksDto } from './dto/update-remarks.dto';
import { UpdateServiceStatusDto } from './dto/update-service-status.dto';
import { ServiceRequestsService } from './service-requests.service';

@Controller('service-requests')
export class ServiceRequestsController {
  constructor(
    private readonly serviceRequestsService: ServiceRequestsService,
  ) {}

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR)
  @Post()
  create(@Body() dto: CreateServiceRequestDto, @CurrentUser() user: JwtUser) {
    return this.serviceRequestsService.create(dto, user);
  }

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR, Role.MECHANIC, Role.CUSTOMER)
  @Get()
  findAll(
    @Query() query: ServiceRequestQueryDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.serviceRequestsService.findAll(query, user);
  }

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR, Role.MECHANIC, Role.CUSTOMER)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.serviceRequestsService.findById(id, user);
  }

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR)
  @Patch(':id/assign-mechanic')
  assignMechanic(
    @Param('id') id: string,
    @Body() dto: AssignMechanicDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.serviceRequestsService.assignMechanic(id, dto, user);
  }

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateServiceStatusDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.serviceRequestsService.updateStatus(id, dto, user);
  }

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR, Role.MECHANIC)
  @Patch(':id/remarks')
  updateRemarks(
    @Param('id') id: string,
    @Body() dto: UpdateRemarksDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.serviceRequestsService.updateRemarks(id, dto, user);
  }

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR, Role.MECHANIC, Role.CUSTOMER)
  @Get(':id/timeline')
  getTimeline(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.serviceRequestsService.getTimeline(id, user);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  cancel(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.serviceRequestsService.cancel(id, user);
  }
}
