import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUpdateProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}