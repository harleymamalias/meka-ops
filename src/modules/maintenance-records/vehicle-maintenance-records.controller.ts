import { Controller, Get, Param, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';
import type { JwtUser } from '../auth/types/jwt-user.type';
import { MaintenanceRecordQueryDto } from './dto/maintenance-record-query.dto';
import { MaintenanceRecordsService } from './maintenance-records.service';

@Controller('vehicles/:vehicleId/maintenance-records')
export class VehicleMaintenanceRecordsController {
  constructor(
    private readonly maintenanceRecordsService: MaintenanceRecordsService,
  ) {}

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR, Role.CUSTOMER)
  @Get()
  findForVehicle(
    @Param('vehicleId') vehicleId: string,
    @Query() query: MaintenanceRecordQueryDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.maintenanceRecordsService.findAll(
      { ...query, vehicleId },
      user,
    );
  }
}
