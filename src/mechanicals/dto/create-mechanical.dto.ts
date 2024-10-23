import { registerStatus } from 'src/types/common.types';

export class CreateMechanicalDto {
  firstName: string;
  lastName: string;
  profilePicture: string;
  cellphone: string;
  startCompanyDate: Date;
  servicesHistory: string[];
  status: registerStatus;
}
