/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsDateString,
  IsEnum,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum TaskStatusEnum {
  TO_DO = 'TO DO',
  IN_PROGRESS = 'IN PROGRESS',
  DONE = 'DONE',
}

export class TaskDto {
  @IsUUID()
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(253)
  title: string;

  @IsString()
  @MinLength(5)
  @MaxLength(512)
  description: string;

  @IsEnum(TaskStatusEnum)
  status: string;

  @IsDateString()
  expirationData: string;
}

export interface GetAllParams {
  title: string;
  status: string;
}
