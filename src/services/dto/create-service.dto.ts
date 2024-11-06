import { ObjectId } from 'mongoose';

export class CreateServiceDto {
  vehicleId: ObjectId;
  clientId: string;
  quote: string;
  board?: string;
  steps: string[];
  endDate?: Date;
}
