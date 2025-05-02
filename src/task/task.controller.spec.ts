import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { AuthGuard } from '../auth/auth.guard';
import { ExecutionContext } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('TaskController', () => {
  let app: INestApplication;
  const taskService = {
    create: jest.fn(),
    getAllTasks: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [{ provide: TaskService, useValue: taskService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          if (context) return true;
          return false;
        },
      })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a task', async () => {
    const newTask = { title: 'Test Task', description: 'Desc' };
    const createdTask = { id: '1', ...newTask };
    taskService.create.mockResolvedValue(createdTask);

    await request(app.getHttpServer())
      .post('/tasks')
      .send(newTask)
      .expect(201)
      .expect(createdTask);
  });

  it('should get all tasks', async () => {
    const tasks = [{ id: '1', title: 'Task 1', description: 'Desc' }];
    taskService.getAllTasks.mockResolvedValue(tasks);

    await request(app.getHttpServer()).get('/tasks').expect(200).expect(tasks);
  });

  it('should get a task by id', async () => {
    const task = { id: '1', title: 'Task 1', description: 'Desc' };
    taskService.getById.mockResolvedValue(task);

    await request(app.getHttpServer()).get('/tasks/1').expect(200).expect(task);
  });

  it('should update a task', async () => {
    const updatedTask = { id: '1', title: 'Updated Task' };
    taskService.update.mockResolvedValue(updatedTask);

    await request(app.getHttpServer())
      .patch('/tasks/1')
      .send({ title: 'Updated Task' })
      .expect(200)
      .expect(updatedTask);
  });

  it('should delete a task', async () => {
    taskService.delete.mockResolvedValue(undefined);

    await request(app.getHttpServer()).delete('/tasks/1').expect(200);
  });
});
