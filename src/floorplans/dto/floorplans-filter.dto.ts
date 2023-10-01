import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class FloorPlansFilters {
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  projectId: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  name: string;
}
