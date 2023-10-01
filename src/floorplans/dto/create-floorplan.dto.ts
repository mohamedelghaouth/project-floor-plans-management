import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFloorPlanDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  name: string;
}
