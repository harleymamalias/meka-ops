# Best Practices — meka-ops

> These are the rules. Follow them consistently. Inconsistency is what makes codebases unmaintainable.

---

## Table of Contents

1. [Naming Conventions](#naming-conventions)
2. [File & Folder Structure](#file--folder-structure)
3. [DTOs](#dtos)
4. [Entities](#entities)
5. [Services](#services)
6. [Controllers](#controllers)
7. [Error Handling](#error-handling)
8. [Response Format](#response-format)
9. [TypeORM Patterns](#typeorm-patterns)
10. [Security Checklist](#security-checklist)
11. [Testing Rules](#testing-rules)
12. [Git & Commits](#git--commits)

---

## Naming Conventions

### Files
```
kebab-case for all files

users.controller.ts
users.service.ts
users.module.ts
create-user.dto.ts
update-user.dto.ts
user.entity.ts
user-query.dto.ts
jwt-auth.guard.ts
roles.decorator.ts
```

### Classes
```typescript
// PascalCase for all classes
export class UsersController {}
export class UsersService {}
export class CreateUserDto {}
export class UserEntity {}
export class JwtAuthGuard {}
```

### Variables & Methods
```typescript
// camelCase
const userId = '...';
async findUserById(id: string) {}
```

### Enums
```typescript
// PascalCase enum name, SCREAMING_SNAKE_CASE values
export enum UserRole {
  ADMIN = 'ADMIN',
  SERVICE_ADVISOR = 'SERVICE_ADVISOR',
  MECHANIC = 'MECHANIC',
  CUSTOMER = 'CUSTOMER',
}

export enum ServiceRequestStatus {
  PENDING = 'PENDING',
  INSPECTING = 'INSPECTING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
```

### Constants
```typescript
// SCREAMING_SNAKE_CASE
const MAX_FILE_SIZE_MB = 5;
const DEFAULT_PAGE_SIZE = 20;
```

### Interfaces
```typescript
// PascalCase with descriptive name — no "I" prefix
interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
```

---

## File & Folder Structure

### Module Structure — Always This Layout

```
modules/
└── vehicles/
    ├── controllers/
    │   └── vehicles.controller.ts
    ├── services/
    │   └── vehicles.service.ts
    ├── entities/
    │   └── vehicle.entity.ts
    ├── dto/
    │   ├── create-vehicle.dto.ts
    │   ├── update-vehicle.dto.ts
    │   └── vehicle-query.dto.ts
    ├── interfaces/          # (if needed)
    │   └── vehicle.interface.ts
    └── vehicles.module.ts
```

### Rules
- One file per class — no multiple exports in one file
- DTOs only in `dto/` — never inline in controllers
- Entities only in `entities/` — never inline anywhere
- No business logic in controllers — ever
- No database calls in controllers — ever
- No HTTP concerns in services (HttpException is OK, but no `@Req()`)

---

## DTOs

### Always Use class-validator + class-transformer

```typescript
import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'SecurePass123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.CUSTOMER })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.CUSTOMER;
}
```

### Update DTOs — Always Use PartialType

```typescript
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// All fields become optional
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'email'] as const), // can't change email/pw via update
) {}
```

### Query DTOs — Always Extend PaginationQueryDto

```typescript
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class VehicleQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  plateNumber?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  ownerId?: string;
}
```

### DTO Rules
- Always decorate every field with at least one `class-validator` decorator
- Always add `@ApiProperty()` for Swagger — every field, every DTO
- Sanitize string inputs: `@Transform(({ value }) => value?.trim())`
- Never pass raw DTO objects directly to the database — extract what you need
- Use `@Type(() => Number)` for numeric query params (query strings are always strings)

---

## Entities

### Base Entity — Extend This Always

```typescript
// src/common/entities/base.entity.ts
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export abstract class SoftDeleteBaseEntity extends BaseEntity {
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
```

### Entity Rules
- Always extend `BaseEntity` or `SoftDeleteBaseEntity`
- Always specify `name` in `@Column()` for explicit DB column names (snake_case)
- Always define `@Index()` on columns you filter/search by
- Nullable columns must be `{ nullable: true }` AND the TypeScript type must include `| null`
- Never use `synchronize: true` in production — use migrations
- Always specify `onDelete` behavior on foreign keys

```typescript
@Entity('vehicles')
export class VehicleEntity extends SoftDeleteBaseEntity {
  @Column({ name: 'plate_number', unique: true, length: 20 })
  plateNumber: string;

  @Column({ name: 'brand', length: 100 })
  brand: string;

  @Column({ name: 'model', length: 100 })
  model: string;

  @Column({ name: 'year', type: 'smallint' })
  year: number;

  @Column({ name: 'mileage', type: 'int', default: 0 })
  mileage: number;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;

  @OneToMany(() => ServiceRequestEntity, (sr) => sr.vehicle)
  serviceRequests: ServiceRequestEntity[];
}
```

---

## Services

### Service Rules

```typescript
@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehiclesRepository: Repository<VehicleEntity>,
    private readonly usersService: UsersService, // inject other services, not repositories
  ) {}

  // ✅ Find or throw — never return null silently
  async findByIdOrFail(id: string): Promise<VehicleEntity> {
    const vehicle = await this.vehiclesRepository.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID "${id}" not found`);
    }
    return vehicle;
  }

  // ✅ Check business rules BEFORE touching the DB
  async assignOwner(vehicleId: string, ownerId: string): Promise<VehicleEntity> {
    const vehicle = await this.findByIdOrFail(vehicleId);
    const owner = await this.usersService.findByIdOrFail(ownerId);

    if (owner.role !== UserRole.CUSTOMER) {
      throw new BadRequestException('Vehicle owner must have CUSTOMER role');
    }

    vehicle.ownerId = owner.id;
    return this.vehiclesRepository.save(vehicle);
  }
}
```

### Rules
- Every `findOne` that is expected to exist must throw `NotFoundException` if not found
- Business rule violations throw `BadRequestException` or `UnprocessableEntityException`
- Duplicate/conflict throw `ConflictException`
- Unauthorized ownership access throws `ForbiddenException`
- Services never return raw TypeORM entities with sensitive fields — use response DTOs or exclude columns
- Use `@InjectRepository()` only in the module that owns the entity

---

## Controllers

### Controller Rules

```typescript
@ApiTags('vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SERVICE_ADVISOR)
  @ApiOperation({ summary: 'Register a new vehicle' })
  @ApiCreatedResponse({ description: 'Vehicle registered successfully' })
  async create(
    @Body() createVehicleDto: CreateVehicleDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.vehiclesService.create(createVehicleDto, user.sub);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SERVICE_ADVISOR, UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Get vehicle by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiclesService.findByIdOrFail(id);
  }
}
```

### Rules
- Controllers are **thin** — validate input, call service, return result. That's all.
- Always use `ParseUUIDPipe` for UUID path params
- Always decorate with `@ApiTags`, `@ApiOperation`, `@ApiResponse` for Swagger
- Always use `@ApiBearerAuth()` on protected controllers
- Group routes logically — don't mix concerns in one controller

---

## Error Handling

### Standard Error Response

All errors return this shape (enforced by GlobalExceptionFilter):

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Vehicle with ID \"abc\" not found",
  "error": "Not Found",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

Validation errors (400):
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "email must be an email" },
    { "field": "password", "message": "password must be at least 8 characters" }
  ]
}
```

### Which Exception to Use

| Situation | Exception |
|---|---|
| Resource not found | `NotFoundException` (404) |
| Invalid business rule | `UnprocessableEntityException` (422) |
| Duplicate/conflict | `ConflictException` (409) |
| Bad input | `BadRequestException` (400) |
| Not authenticated | `UnauthorizedException` (401) |
| No permission | `ForbiddenException` (403) |
| Internal error | Let it bubble — filter catches it (500) |

---

## Response Format

### Success Responses — Always Wrapped

The `ResponseInterceptor` automatically wraps all controller returns:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Vehicle retrieved successfully",
  "data": { "id": "...", "plateNumber": "ABC-123" },
  "timestamp": "2025-01-01T00:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

Paginated:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Vehicles retrieved successfully",
  "data": [...],
  "meta": {
    "total": 100,
    "page": 2,
    "limit": 20,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": true
  }
}
```

---

## TypeORM Patterns

### Use QueryBuilder for Complex Queries

```typescript
// ✅ QueryBuilder for filters + pagination
async findAll(query: VehicleQueryDto): Promise<PaginatedResult<VehicleEntity>> {
  const qb = this.vehiclesRepository.createQueryBuilder('vehicle')
    .leftJoinAndSelect('vehicle.owner', 'owner');

  if (query.plateNumber) {
    qb.andWhere('vehicle.plateNumber ILIKE :plate', { plate: `%${query.plateNumber}%` });
  }

  if (query.brand) {
    qb.andWhere('vehicle.brand ILIKE :brand', { brand: `%${query.brand}%` });
  }

  qb.orderBy('vehicle.createdAt', 'DESC')
    .skip((query.page - 1) * query.limit)
    .take(query.limit);

  const [data, total] = await qb.getManyAndCount();
  return paginate(data, total, query);
}
```

### Always Use Transactions for Multi-Step Writes

```typescript
async completeServiceRequest(id: string): Promise<void> {
  await this.dataSource.transaction(async (manager) => {
    const sr = await manager.findOneOrFail(ServiceRequestEntity, { where: { id } });
    sr.status = ServiceRequestStatus.COMPLETED;
    await manager.save(sr);

    // Create maintenance record in same transaction
    const record = manager.create(MaintenanceRecordEntity, { ... });
    await manager.save(record);
  });
}
```

### Never Load Relations Unless Needed

```typescript
// ❌ Don't do this blindly
const vehicle = await this.repo.findOne({
  where: { id },
  relations: ['owner', 'serviceRequests', 'serviceRequests.mechanic'], // N+1 risk
});

// ✅ Load what you need
const vehicle = await this.repo.findOne({
  where: { id },
  relations: ['owner'], // only if you need owner data
});
```

---

## Security Checklist

- [ ] Passwords hashed with bcrypt (cost factor 12) — never stored plain
- [ ] JWT access token: 15m TTL, minimal payload (sub, email, role)
- [ ] Refresh tokens: stored as hash in DB — raw token only sent to client once
- [ ] All routes protected by default — use `@Public()` to opt out
- [ ] `ValidationPipe` with `whitelist: true, forbidNonWhitelisted: true` — strips unknown fields
- [ ] Sensitive columns (`passwordHash`) excluded from serialization
- [ ] Rate limiting on auth endpoints (stricter than global)
- [ ] Helmet enabled in main.ts
- [ ] CORS configured with explicit origin whitelist
- [ ] Env vars validated with Joi at startup
- [ ] Never log sensitive data (passwords, tokens, PII)
- [ ] Database errors sanitized before returning to client
- [ ] UUID primary keys (no sequential ID enumeration)

---

## Testing Rules

### What to Test

| Module | Test |
|---|---|
| auth.service | register, login, token refresh, logout |
| service-requests | status transitions (valid + invalid) |
| inventory.service | stock decrement, negative stock prevention |
| invoices.service | total calculation logic |
| guards | JwtAuthGuard, RolesGuard behavior |

### Test File Naming
```
users.service.spec.ts       ← unit test (same folder as file)
test/auth.e2e-spec.ts       ← e2e test (in /test folder)
```

### Unit Test Pattern
```typescript
describe('VehiclesService', () => {
  let service: VehiclesService;
  let repo: jest.Mocked<Repository<VehicleEntity>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: getRepositoryToken(VehicleEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(VehiclesService);
    repo = module.get(getRepositoryToken(VehicleEntity));
  });

  it('should throw NotFoundException if vehicle not found', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.findByIdOrFail('bad-id')).rejects.toThrow(NotFoundException);
  });
});
```

### Rules
- Don't chase 100% coverage — test business rules and edge cases
- Mock repositories and external services in unit tests
- E2E tests use a real test database (separate DB or transactions rolled back after each test)
- Never commit a failing test

---

## Git & Commits

See [CONTRIBUTING.md](CONTRIBUTING.md) for full conventions.

### Quick Reference

```bash
feat(auth): add refresh token rotation
fix(vehicles): prevent duplicate plate registration
chore(deps): upgrade typeorm to 0.3.28
refactor(users): extract pagination helper to common util
test(service-requests): add status transition unit tests
docs(readme): update setup instructions
```

### Rules
- One logical change per commit
- Never commit `node_modules`, `.env`, `dist/`
- Branches: `feat/auth-module`, `fix/plate-validation`, `chore/docker-setup`
- Always run `pnpm run lint` before committing
