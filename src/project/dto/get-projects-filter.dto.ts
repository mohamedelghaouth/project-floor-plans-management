import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterProjectDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
}
