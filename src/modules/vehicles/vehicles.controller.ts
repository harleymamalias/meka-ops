import {
  Body,
  Controller,
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
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleQueryDto } from './dto/vehicle-query.dto';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR, Role.CUSTOMER)
  @Post()
  create(@Body() dto: CreateVehicleDto, @CurrentUser() user: JwtUser) {
    return this.vehiclesService.create(dto, user);
  }

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR)
  @Get()
  findAll(@Query() query: VehicleQueryDto) {
    return this.vehiclesService.findAll(query);
  }

  @Roles(Role.CUSTOMER)
  @Get('mine')
  findMine(@Query() query: VehicleQueryDto, @CurrentUser() user: JwtUser) {
    return this.vehiclesService.findMine(user, query);
  }

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR, Role.CUSTOMER)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.vehiclesService.findById(id, user);
  }

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, dto);
  }
}
