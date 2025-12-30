import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepositoryAdapter } from '@infrastructure/persistence/user-repository.adapter';
import { CreateUserUseCase } from '@application/use-cases/users/create-user.use-case';
import { GetUserUseCase } from '@application/use-cases/users/get-user.use-case';
import { ListUsersUseCase } from '@application/use-cases/users/list-users.use-case';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    {
      provide: 'UserRepositoryPort',
      useClass: UserRepositoryAdapter,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}

