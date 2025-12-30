import { Injectable, Inject } from '@nestjs/common';
import { BaseUseCase } from '../base.use-case';
import { UserRepositoryPort } from '@core/ports/repositories/user-repository.port';
import { User } from '@core/domain/entities/user.entity';

export interface ListUsersInput {
  activeOnly?: boolean;
}

export interface ListUsersOutput {
  users: User[];
}

@Injectable()
export class ListUsersUseCase extends BaseUseCase<ListUsersInput, ListUsersOutput> {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {
    super();
  }

  async execute(input: ListUsersInput): Promise<ListUsersOutput> {
    if (input.activeOnly) {
      const users = await this.userRepository.findActiveUsers();
      return { users };
    }

    const users = await this.userRepository.findAll();
    return { users };
  }
}

