import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { InventoryQueryDto } from './dto/inventory-query.dto';
import { RestockItemDto } from './dto/restock-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateInventoryItemDto) {
    return this.inventoryService.create(dto);
  }

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR, Role.MECHANIC)
  @Get()
  findAll(@Query() query: InventoryQueryDto) {
    return this.inventoryService.findAll(query);
  }

  @Roles(Role.ADMIN, Role.SERVICE_ADVISOR, Role.MECHANIC)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findById(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInventoryItemDto) {
    return this.inventoryService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Post(':id/restock')
  restock(@Param('id') id: string, @Body() dto: RestockItemDto) {
    return this.inventoryService.restock(id, dto);
  }
}
