import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateUpdateProjectDto } from './dto/create-update-project.dto';
import { FilterProjectDto } from './dto/get-projects-filter.dto';

@Injectable()
export class ProjectRepository extends Repository<Project> {
  constructor(private dataSource: DataSource) {
    super(Project, dataSource.createEntityManager());
  }

  async createProject(createProjectDto: CreateUpdateProjectDto) {
    const { name } = createProjectDto;

    let project = this.create({
      name,
    });

    await this.save(project);
    return project;
  }

  async getProjects(filterProjectDto: FilterProjectDto) {
    const { name } = filterProjectDto;

    let query = this.createQueryBuilder('project');

    if (name) {
      query.andWhere('LOWER(project.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    let projects = await query
      .leftJoinAndSelect('project.floorPlans', 'floor_plan')
      .select([
        'project.id',
        'project.name',
        'floor_plan.id',
        'floor_plan.name',
      ])
      .getMany();
    return projects;
  }

  async getProjectById(projectId: string): Promise<Project> {
    let query = this.createQueryBuilder('project');

    let project = await this.createQueryBuilder('project')
      .andWhere('project.id = :projectId', { projectId })
      .leftJoinAndSelect('project.floorPlans', 'floor_plan')
      .select([
        'project.id',
        'project.name',
        'floor_plan.id',
        'floor_plan.name',
      ])
      .getOne();

    return project;
  }
}
