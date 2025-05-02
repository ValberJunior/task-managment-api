/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(() => {
    jwtService = new JwtService({});
    configService = new ConfigService();
    jest.spyOn(configService, 'get').mockReturnValue('test-secret');
    authGuard = new AuthGuard(jwtService, configService);
  });

  it('should return true if token is valid', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { authorization: 'Bearer valid-token' },
        }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ userId: 1 });

    const result = await authGuard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException if token is missing', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {},
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { authorization: 'Bearer invalid-token' },
        }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error());

    await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should extract token from header correctly', () => {
    const mockRequest = {
      headers: { authorization: 'Bearer test-token' },
    } as any;

    const token = (authGuard as any).extractTokenFromHeader(mockRequest);
    expect(token).toBe('test-token');
  });

  it('should return undefined if authorization header is malformed', () => {
    const mockRequest = {
      headers: { authorization: 'MalformedHeader' },
    } as any;

    const token = (authGuard as any).extractTokenFromHeader(mockRequest);
    expect(token).toBeUndefined();
  });
});
