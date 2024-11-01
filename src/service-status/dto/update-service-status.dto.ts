import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceStatusDto } from './create-service-status.dto';

export class UpdateServiceStatusDto extends PartialType(CreateServiceStatusDto) {}
