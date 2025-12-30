import { BaseRepositoryPort } from './base-repository.port';
import { User } from '@core/domain/entities/user.entity';

export interface UserRepositoryPort extends BaseRepositoryPort<User> {
  findByEmail(email: string): Promise<User | null>;
  findActiveUsers(): Promise<User[]>;
}

