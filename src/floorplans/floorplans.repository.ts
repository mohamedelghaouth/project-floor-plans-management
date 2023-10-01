import { Injectable, NotFoundException } from '@nestjs/common';
import { FloorPlan } from './floorplans.entity';
import { DataSource, Repository } from 'typeorm';
import { FloorPlansFilters } from './dto/floorplans-filter.dto';
import { CreateFloorPlanDto } from './dto/create-floorplan.dto';
import { ProjectRepository } from 'src/project/project.repository';
import sharp from 'sharp';
import { Project } from 'src/project/project.entity';

@Injectable()
export class FloorPlansRepository extends Repository<FloorPlan> {
  constructor(
    private dataSource: DataSource,
    private projectRepository: ProjectRepository,
  ) {
    super(FloorPlan, dataSource.createEntityManager());
  }

  async getFloorPlans(
    floorPlansFilter: FloorPlansFilters,
  ): Promise<FloorPlan[]> {
    const { name, projectId } = floorPlansFilter;

    const query = this.createQueryBuilder('floor_plan');

    if (projectId) {
      query.andWhere('floor_plan.projectId = :projectId', { projectId });
    }
    if (name && name.length !== 0) {
      query.andWhere('LOWER(floor_plan.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    let floorplans = await query
      .select([
        'floor_plan.id',
        'floor_plan.name',
        'project.id',
        'project.name',
      ])
      .leftJoin('floor_plan.project', 'project')
      .getMany();

    return floorplans;
  }

  async createFloorPlan(
    project: Project,
    imageBuffer: Buffer,
    name: string,
  ): Promise<FloorPlan> {
    let floorPlan = this.create({
      name,
      project,
      originalFile: imageBuffer,
      smallerVersionOfOriginalFile: await this.resizeImage(
        imageBuffer,
        100,
        100,
      ),
      biggerVersionOfOriginalFile: await this.resizeImage(
        imageBuffer,
        2000,
        2000,
      ),
    });

    project.floorPlans.push(floorPlan);

    await this.projectRepository.save(project);

    return floorPlan;
  }

  async resizeImage(originalFile: Buffer, width, height): Promise<Buffer> {
    let smallerVersion = await sharp(originalFile)
      .resize(width, height)
      .toBuffer();
    return smallerVersion;
  }
}
