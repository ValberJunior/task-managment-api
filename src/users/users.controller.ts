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
import { UsersService } from './users.service';
import { GetAllUserParams, UserDto } from './user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: Omit<UserDto, 'id'>) {
    await this.usersService.create(user);
  }

  @Get()
  async listAllUsers(@Query() params: GetAllUserParams): Promise<UserDto[]> {
    return await this.usersService.listAllUsers(params);
  }

  @Get('/:id')
  async getUserById(@Param() id: string): Promise<UserDto> {
    return await this.usersService.getUserById(id);
  }

  @Patch('/:id')
  async updateUser(
    @Param() id: string,
    @Body() userData: Partial<UserDto>,
  ): Promise<UserDto> {
    return await this.usersService.updateUser(id, userData);
  }

  @Delete('/:id')
  async deleteUser(@Param() id: string): Promise<void> {
    return await this.usersService.deleteUser(id);
  }
}
