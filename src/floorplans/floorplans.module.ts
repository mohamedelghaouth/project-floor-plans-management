import { Module } from '@nestjs/common';
import { FloorplansController } from './floorplans.controller';
import { FloorPlan } from './floorplans.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FloorPlansRepository } from './floorplans.repository';
import { FloorplansService } from './floorplans.service';
import { ProjectRepository } from 'src/project/project.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FloorPlan])],
  controllers: [FloorplansController],
  providers: [FloorPlansRepository, FloorplansService, ProjectRepository]
})
export class FloorplansModule {}
