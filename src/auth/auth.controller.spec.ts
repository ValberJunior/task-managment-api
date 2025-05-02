import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthResponseDto } from './auth.dto';
import { Server } from 'http';

describe('AuthController', () => {
  let app: INestApplication;
  const authService = {
    signIn: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should sign in and return a token', async () => {
    const username = 'john';
    const password = '123456';
    const authResponse: AuthResponseDto = {
      token: 'fake-jwt-token',
      expiresIn: 3600,
    };

    authService.signIn.mockResolvedValue(authResponse);

    await request(app.getHttpServer() as Server)
      .post('/auth/login')
      .send({ username, password })
      .expect(200)
      .expect(authResponse);
  });
});
