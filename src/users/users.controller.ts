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
  create(@Body() user: Omit<UserDto, 'id'>) {
    this.usersService.create(user);
  }

  @Get()
  listAllUsers(@Query() params: GetAllUserParams): UserDto[] {
    return this.usersService.listAllUsers(params);
  }

  @Get('/:id')
  getUserById(@Param() id: string): UserDto {
    return this.usersService.getUserById(id);
  }

  @Patch('/:id')
  updateUser(
    @Param() id: string,
    @Body() userData: Partial<UserDto>,
  ): UserDto[] {
    return this.usersService.updateUser(id, userData);
  }

  @Delete('/:id')
  deleteUser(@Param() id: string): UserDto[] {
    return this.usersService.deleteUser(id);
  }
}
