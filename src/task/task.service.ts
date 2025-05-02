import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GetAllParams, TaskDto, TaskStatusEnum } from './task.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TaskService {
  private tasks: TaskDto[] = [];

  create(task: Omit<TaskDto, 'id'>) {
    const newTask = { ...task, id: uuid(), status: TaskStatusEnum.TO_DO };
    this.tasks.push(newTask);
  }

  getAllTasks(params: GetAllParams): TaskDto[] {
    return this.tasks.filter((t) => {
      let match = true;
      if (params.title !== undefined && !t.title.includes(params.title)) {
        match = false;
      }
      if (params.status !== undefined && !t.status.includes(params.status)) {
        match = false;
      }
      return match;
    });
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
