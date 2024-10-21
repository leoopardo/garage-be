import { registerStatus } from 'src/types/common.types';
import { userRoles } from '../types/users.types';

export class CreateUserDto {
  name: string;
  role: userRoles;
  email: string;
  password: string;
  status?: registerStatus;
}
