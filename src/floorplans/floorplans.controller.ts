import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseFilePipeBuilder,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FloorplansService } from './floorplans.service';
import { FloorPlan } from './floorplans.entity';
import { FloorPlansFilters } from './dto/floorplans-filter.dto';
import { CreateFloorPlanDto } from './dto/create-floorplan.dto';
import { UpdateFloorPlansDto } from './dto/update-floorplan.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { Response } from 'express';
import { ApiBody, ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('floorplans')
@Controller('floorplans')
export class FloorplansController {
  constructor(private floorplansService: FloorplansService) {}

  @Get()
  getFloorPlans(
    @Query() floorPlansFilters: FloorPlansFilters,
  ): Promise<FloorPlan[]> {
    return this.floorplansService.getFloorPlans(floorPlansFilters);
  }

  @Get('/:id')
  getFloorPlanById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) floorPlanID: string,
  ): Promise<FloorPlan> {
    return this.floorplansService.getFloorPlansById(floorPlanID);
  }

  @Get('/:id/image')
  async getFloorPlanOriginalImage(
    @Param('id', new ParseUUIDPipe({ version: '4' })) floorPlanID: string,
    @Res({ passthrough: true }) response: Response
  ): Promise<StreamableFile> {
    const floorPlan = await this.floorplansService.getFloorPlan(floorPlanID);
    
    const stream = Readable.from(floorPlan.originalFile);
    
    response.set({
        'Content-Disposition': `inline; filename="${floorPlan.name}"`,
        'Content-Type': 'image'
    })
 
    return new StreamableFile(stream);
  }

  @Get('/:id/image/bigger')
  async getFloorPlanOriginalImageBiggerVersion(
    @Param('id', new ParseUUIDPipe({ version: '4' })) floorPlanID: string,
    @Res({ passthrough: true }) response: Response
  ): Promise<StreamableFile> {
    const floorPlan = await this.floorplansService.getFloorPlan(floorPlanID);
    
    const stream = Readable.from(floorPlan.biggerVersionOfOriginalFile);
    
    response.set({
        'Content-Disposition': `inline; filename="${floorPlan.name}"`,
        'Content-Type': 'image'
    })
 
    return new StreamableFile(stream);
  }

  @Get('/:id/image/small')
  async getFloorPlanOriginalImageSmallerVersion(
    @Param('id', new ParseUUIDPipe({ version: '4' })) floorPlanID: string,
    @Res({ passthrough: true }) response: Response
  ): Promise<StreamableFile> {
    const floorPlan = await this.floorplansService.getFloorPlan(floorPlanID);
    
    const stream = Readable.from(floorPlan.smallerVersionOfOriginalFile);
    
    response.set({
        'Content-Disposition': `inline; filename="${floorPlan.name}"`,
        'Content-Type': 'image'
    })
 
    return new StreamableFile(stream);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        projectId: { type: 'string' },
        name: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  createFloorPlan(
    @Body() createFloorPlanDto: CreateFloorPlanDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: new RegExp('.(jpe?g|svg)$'),
        })
        .build(),
    )
    file: Express.Multer.File,
  ): Promise<FloorPlan> {
    return this.floorplansService.createFloorPlan(
      createFloorPlanDto,
      file.buffer,
    );
  }

  @Patch('/:id/name')
  updateFloorPlanName(
    @Param('id', new ParseUUIDPipe({ version: '4' })) floorPlanId: string,
    @Body() updateFloorPlanDto: UpdateFloorPlansDto,
  ): Promise<FloorPlan> {
    const { name: newName } = updateFloorPlanDto;
    return this.floorplansService.updateFloorPlanName(floorPlanId, newName);
  }

  @Delete('/:id')
  deleteFloorPlan(
    @Param('id', new ParseUUIDPipe({ version: '4' })) floorPlanId: string,
  ): Promise<void> {
    return this.floorplansService.deleteFloorPlan(floorPlanId);
  }
}
