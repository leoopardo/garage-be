import { PartialType } from '@nestjs/mapped-types';
import { CreateMechanicalDto } from './create-mechanical.dto';

export class UpdateMechanicalDto extends PartialType(CreateMechanicalDto) {}
