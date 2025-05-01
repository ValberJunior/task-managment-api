import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GetAllParams, TaskDto } from './task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() task: TaskDto) {
    this.taskService.create(task);
  }

  @Get()
  getAll(@Query() params: GetAllParams): TaskDto[] {
    return this.taskService.getAllTasks(params);
  }

  @Get('/:id')
  getById(@Param('id') id: string): TaskDto {
    return this.taskService.getById(id);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() taskUpdate: Partial<TaskDto>) {
    return this.taskService.update(id, taskUpdate);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.taskService.delete(id);
  }
}
