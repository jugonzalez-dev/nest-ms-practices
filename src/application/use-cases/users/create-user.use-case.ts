import { Injectable, Inject } from '@nestjs/common';
import { BaseUseCase } from '../base.use-case';
import { UserRepositoryPort } from '@core/ports/repositories/user-repository.port';
import { User } from '@core/domain/entities/user.entity';

export interface CreateUserInput {
  email: string;
  name: string;
  roles?: string[];
}

export interface CreateUserOutput {
  user: User;
}

@Injectable()
export class CreateUserUseCase extends BaseUseCase<CreateUserInput, CreateUserOutput> {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {
    super();
  }

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    // Validar que el email no exista
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Crear la entidad de dominio
    const user = new User({
      email: input.email,
      name: input.name,
      roles: input.roles || ['user'],
      isActive: true,
    });

    // Persistir usando el repositorio
    const createdUser = await this.userRepository.create(user);

    return { user: createdUser };
  }
}

