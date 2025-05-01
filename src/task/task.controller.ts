import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TaskDto } from './task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() task: TaskDto) {
    this.taskService.create(task);
  }

  @Get('/:id')
  getById(@Param('id') id: string): TaskDto {
    return this.taskService.getById(id);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() taskUpdate: Partial<TaskDto>) {
    return this.taskService.update(id, taskUpdate);
  }
}
