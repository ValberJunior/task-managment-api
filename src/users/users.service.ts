import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GetAllUserParams, UserDto } from './user.dto';
import { v4 as uuid } from 'uuid';
import { hashSync as bcryptHashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  private users: UserDto[] = [];

  private userExists(id: string): boolean {
    return this.users.some((user) => user.id === id);
  }

  usernameExists(username: string): UserDto | undefined {
    return this.users.find((user) => user.username === username);
  }

  create(user: Omit<UserDto, 'id'>) {
    if (!user.username || !user.password) {
      throw new HttpException(
        'Fields required* {usename:string, password: string}',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (this.usernameExists(user.username)) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = {
      ...user,
      id: uuid(),
      password: bcryptHashSync(user.password, 10),
    };
    this.users.push(newUser);

    return newUser;
  }

  listAllUsers(params: GetAllUserParams): UserDto[] {
    return this.users.filter((user) => {
      let match = true;
      if (
        params.username !== undefined &&
        !user.username.includes(params.username)
      ) {
        match = false;
      }
      return match;
    });
  }

  getUserById(id: string): UserDto {
    const userFound = this.users.find((user) => user.id === id);
    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userFound;
  }

  updateUser(id: string, userData: Partial<UserDto>): UserDto[] {
    if (!this.userExists(id)) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    this.users = this.users.map((user) =>
      user.id === id ? { ...user, ...userData } : user,
    );
    return this.users;
  }

  deleteUser(id: string): UserDto[] {
    if (!this.userExists(id)) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    this.users = this.users.filter((user) => user.id !== id);
    return this.users;
  }
}
