import { Injectable, Inject } from '@nestjs/common';
import { BaseUseCase } from '../base.use-case';
import { UserRepositoryPort } from '@core/ports/repositories/user-repository.port';
import { User } from '@core/domain/entities/user.entity';

export interface GetUserInput {
  id: string;
}

export interface GetUserOutput {
  user: User | null;
}

@Injectable()
export class GetUserUseCase extends BaseUseCase<GetUserInput, GetUserOutput> {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {
    super();
  }

  async execute(input: GetUserInput): Promise<GetUserOutput> {
    const user = await this.userRepository.findById(input.id);
    return { user };
  }
}

