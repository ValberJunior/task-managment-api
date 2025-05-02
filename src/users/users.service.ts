import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GetAllUserParams, UserDto } from './user.dto';
import { v4 as uuid } from 'uuid';
import { hashSync as bcryptHashSync } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  private async userExists(id: string): Promise<boolean> {
    const userExists = await this.usersRepository.findOne({
      where: { id },
    });

    return !!userExists;
  }

  async usernameExists(username: string): Promise<UserDto | null> {
    const userfound = await this.usersRepository.findOne({
      where: { username },
    });

    if (!userfound) return null;

    return {
      id: userfound.id,
      username: userfound.username,
      password: userfound.passwordHash,
    };
  }

  async create(user: Omit<UserDto, 'id'>) {
    if (!user.username || !user.password) {
      throw new HttpException(
        'Fields required* {usename:string, password: string}',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userAlreadyRegistered = await this.usernameExists(user.username);

    if (userAlreadyRegistered) {
      throw new ConflictException(`User ${user.username} already registered`);
    }

    let dbUser = new UserEntity();

    dbUser = {
      ...user,
      id: uuid(),
      passwordHash: bcryptHashSync(user.password, 10),
    };

    await this.usersRepository.save(dbUser);
  }

  async listAllUsers(params: GetAllUserParams): Promise<UserDto[]> {
    const userTable = await this.usersRepository.find();
    const users = userTable.map((user) => ({
      id: user.id,
      username: user.username,
      password: user.passwordHash,
    }));
    return users.filter((user) => {
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

  async getUserById(id: string): Promise<UserDto> {
    const userFound = await this.usersRepository.findOne({
      where: { id },
    });
    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return {
      id: userFound.id,
      username: userFound.username,
      password: userFound.passwordHash,
    };
  }

  async updateUser(id: string, userData: Partial<UserDto>): Promise<UserDto> {
    const userExists = await this.userExists(id);

    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.usersRepository.update(id, {
      ...userData,
      passwordHash: userData.password
        ? bcryptHashSync(userData.password, 10)
        : undefined,
    });

    const updatedUser = await this.getUserById(id);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const userFound = await this.usersRepository.findOne({
      where: { id },
    });
    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const result = await this.usersRepository.delete(id);

    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
