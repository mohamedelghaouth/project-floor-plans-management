import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { Project } from './project.entity';
import { FilterProjectDto } from './dto/get-projects-filter.dto';
import { CreateUpdateProjectDto } from './dto/create-update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private projectRepository: ProjectRepository) {}

  async getProjectById(projectId: string): Promise<Project> {
    const found = await this.projectRepository.getProjectById(projectId);
    if (!found) {
      throw new NotFoundException(`project with ID ${projectId} is not Found`);
    }
    return found;
  }

  getProjects(filterProjectDto: FilterProjectDto): Promise<Project[]> {
    return this.projectRepository.getProjects(filterProjectDto);
  }

  createProject(createProjectDto: CreateUpdateProjectDto): Promise<Project> {
    return this.projectRepository.createProject(createProjectDto);
  }

  async updateProjectName(
    projectId: string,
    newName: string,
  ): Promise<Project> {
    const project: Project = await this.getProjectById(projectId);

    project.name = newName;

    await this.projectRepository.save(project);

    return project;
  }

  async deleteProjectById(projectId: string): Promise<void> {
    let result = await this.projectRepository.delete(projectId);
    if (result.affected === 0) {
      throw new NotFoundException(`project with ID ${projectId} is not Found`);
    }
  }
}
