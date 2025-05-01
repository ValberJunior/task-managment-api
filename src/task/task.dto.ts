export class TaskDto {
  id: string;
  title: string;
  description: string;
  status: string;
  expirationData: string;
}

export interface GetAllParams {
  title: string;
  status: string;
}
