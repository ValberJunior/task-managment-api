import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskDto } from './task.dto';

@Injectable()
export class TaskService {
  private tasks: TaskDto[] = [];

  create(task: TaskDto) {
    this.tasks.push(task);
  }

  getAllTasks() {
    return this.tasks;
  }

  getById(id: string): TaskDto {
    const foundTask = this.tasks.filter((task) => task.id === id);
    if (foundTask.length) {
      return foundTask[0];
    }
    throw new HttpException(`Task ${id} not found`, HttpStatus.NOT_FOUND);
  }

  update(id: string, taskUpdate: Partial<TaskDto>) {
    const taskFound = this.tasks.some((t) => t.id === id);
    if (taskFound) {
      this.tasks = this.tasks.map((t) =>
        t.id === id ? { ...t, ...taskUpdate } : t,
      );
      return this.tasks;
    }
    throw new HttpException(`Task ${id} not found`, HttpStatus.BAD_REQUEST);
  }

  delete(id: string) {
    const taskFound = this.tasks.some((t) => t.id === id);
    if (taskFound) {
      this.tasks = this.tasks.filter((t) => t.id !== id);
      return this.tasks;
    }
    throw new HttpException(`Task ${id} not found`, HttpStatus.BAD_REQUEST);
  }
}
