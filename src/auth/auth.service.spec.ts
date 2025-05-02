import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthResponseDto } from './auth.dto';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;
  let configService: Partial<ConfigService>;

  beforeEach(async () => {
    usersService = {
      usernameExists: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    configService = {
      get: jest.fn().mockReturnValue('3600'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should throw UnauthorizedException if user does not exist', async () => {
    jest.spyOn(usersService, 'usernameExists').mockResolvedValue(null);

    await expect(authService.signIn('testuser', 'password')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    jest.spyOn(usersService, 'usernameExists').mockResolvedValue({
      id: uuid(),
      username: 'testuser',
      password: 'hashedpassword',
    });

    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

    await expect(
      authService.signIn('testuser', 'wrongpassword'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return a valid token and expiration time if credentials are correct', async () => {
    jest.spyOn(usersService, 'usernameExists').mockResolvedValue({
      id: uuid(),
      username: 'testuser',
      password: 'hashedpassword',
    });

    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
    jest.spyOn(jwtService, 'sign').mockReturnValue('validToken');

    const result: AuthResponseDto = await authService.signIn(
      'testuser',
      'password',
    );

    expect(result).toEqual({
      token: 'validToken',
      expiresIn: 3600,
    });
  });
});
