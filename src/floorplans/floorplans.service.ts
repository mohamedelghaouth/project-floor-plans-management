import { Injectable, NotFoundException } from '@nestjs/common';
import { FloorPlansRepository } from './floorplans.repository';
import { FloorPlansFilters } from './dto/floorplans-filter.dto';
import { FloorPlan } from './floorplans.entity';
import { CreateFloorPlanDto } from './dto/create-floorplan.dto';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class FloorplansService {
  constructor(
    private floorPlansRepository: FloorPlansRepository,
    private projectService: ProjectService,
  ) {}

  getFloorPlans(floorPlansFilter: FloorPlansFilters): Promise<FloorPlan[]> {
    return this.floorPlansRepository.getFloorPlans(floorPlansFilter);
  }

  async getFloorPlansById(floorPlanId: string): Promise<FloorPlan> {
    let found = await this.floorPlansRepository.findOne({
      where: {
        id: floorPlanId,
      },
      select: {
        id: true,
        name: true,
      },
    });
    if (!found) {
      throw new NotFoundException(
        `floorPlan with ID ${floorPlanId} is not Found`,
      );
    }
    return found;
  }

  async getFloorPlan(floorPlanId: string): Promise<FloorPlan> {
    let found = await this.floorPlansRepository.findOneBy({ id: floorPlanId });

    if (!found) {
      throw new NotFoundException(
        `floorPlan with ID ${floorPlanId} is not Found`,
      );
    }
    return found;
  }

  async createFloorPlan(
    createFloorPlanDto: CreateFloorPlanDto,
    image: Express.Multer.File,
  ): Promise<FloorPlan> {
    const { projectId, name } = createFloorPlanDto;

    const project = await this.projectService.getProjectById(projectId);

    if (!project) {
      throw new NotFoundException(
        `project with ID ${projectId} is not Found. a floor plan should be linked to a project`,
      );
    }

    const imageName = name && name.length !== 0 ? name : image.originalname;

    return this.floorPlansRepository.createFloorPlan(
      project,
      image.buffer,
      imageName,
    );
  }

  async updateFloorPlanName(
    floorPlanId: string,
    newName: string,
  ): Promise<FloorPlan> {
    const floorPlan: FloorPlan = await this.getFloorPlansById(floorPlanId);

    floorPlan.name = newName;

    await this.floorPlansRepository.update(
      { id: floorPlanId },
      { name: newName },
    );

    return floorPlan;
  }

  async deleteFloorPlan(floorPlanId: string): Promise<void> {
    let result = await this.floorPlansRepository.delete(floorPlanId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `floorPlan with ID ${floorPlanId} is not Found`,
      );
    }
  }
}
