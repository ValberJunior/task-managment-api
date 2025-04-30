import { Body, Controller, Post } from '@nestjs/common';
import { TaskDto } from './task.dto';

@Controller('task')
export class TaskController {
  @Post()
  create(@Body() task: TaskDto) {
    console.log(task);
  }
}
