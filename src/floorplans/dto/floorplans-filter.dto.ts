import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";

export class FloorPlansFilters {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    projectId: string
    
    @ApiProperty()
    @IsOptional()
    name: string
}