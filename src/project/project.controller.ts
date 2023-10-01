import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Project } from './project.entity';
import { CreateUpdateProjectDto } from './dto/create-update-project.dto';
import { ProjectService } from './project.service';
import { FilterProjectDto } from './dto/get-projects-filter.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  getProject(@Query() filterProjectDto: FilterProjectDto): Promise<Project[]> {
    return this.projectService.getProjects(filterProjectDto);
  }

  @Get('/:id')
  getProjectById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) projectId: string,
  ): Promise<Project> {
    return this.projectService.getProjectById(projectId);
  }

  @Post()
  createProject(
    @Body() createProjectDto: CreateUpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.createProject(createProjectDto);
  }

  @Patch('/:id/name')
  updateProjectName(
    @Param('id', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Body() updateProjectDto: CreateUpdateProjectDto,
  ): Promise<Project> {
    const { name: newName } = updateProjectDto;
    return this.projectService.updateProjectName(projectId, newName);
  }

  @Delete('/:id')
  deleteProjectById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) projectId: string,
  ): Promise<void> {
    return this.projectService.deleteProjectById(projectId);
  }
}
