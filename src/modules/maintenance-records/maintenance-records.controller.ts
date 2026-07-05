import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';
import type { JwtUser } from '../auth/types/jwt-user.type';
import { CreateMaintenanceRecordDto } from './dto/create-maintenance-record.dto';
import { MaintenanceRecordQueryDto } from './dto/maintenance-record-query.dto';
import { MaintenanceRecordsService } from './maintenance-records.service';

@Controller('maintenance-records')
export class MaintenanceRecordsController {
  constructor(
    private readonly maintenanceRecordsService: MaintenanceRecordsService,
  ) {}

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR, Role.CUSTOMER)
  @Get()
  findAll(
    @Query() query: MaintenanceRecordQueryDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.maintenanceRecordsService.findAll(query, user);
  }

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR, Role.CUSTOMER)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.maintenanceRecordsService.findById(id, user);
  }

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR)
  @Post()
  createManual(@Body() dto: CreateMaintenanceRecordDto) {
    return this.maintenanceRecordsService.createManual(dto);
  }
}
