import { Role } from '../../../shared/enums/role.enum';

export interface JwtUser {
  sub: string;
  email: string;
  role: Role;
}
