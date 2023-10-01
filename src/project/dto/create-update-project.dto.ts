import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUpdateProjectDto {
  @ApiProperty({
    type: 'string',
    required: true
  })
  @IsNotEmpty()
  name: string;
}