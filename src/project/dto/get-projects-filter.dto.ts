import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterProjectDto {
  @ApiProperty({
    type: 'string',
    required: false
  })
  @IsOptional()
  @IsString()
  name: string;
}
