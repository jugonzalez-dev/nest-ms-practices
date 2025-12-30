import { Injectable } from '@nestjs/common';
import { CreateUserUseCase } from '@application/use-cases/users/create-user.use-case';
import { GetUserUseCase } from '@application/use-cases/users/get-user.use-case';
import { ListUsersUseCase } from '@application/use-cases/users/list-users.use-case';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  async findOne(id: string) {
    return this.getUserUseCase.execute({ id });
  }

  async findAll(activeOnly?: boolean) {
    return this.listUsersUseCase.execute({ activeOnly });
  }
}

