import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateFloorPlanDto{
    @ApiProperty()
    @IsNotEmpty()
    projectId: string;

    @ApiProperty()
    @IsNotEmpty()
    name: string;
}