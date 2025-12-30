import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '@core/ports/repositories/user-repository.port';
import { User } from '@core/domain/entities/user.entity';

/**
 * Adaptador de repositorio para User
 * En producción, aquí implementarías la lógica de persistencia real (BD, API, etc.)
 * Por ahora, usamos un almacenamiento en memoria para demostración
 */
@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async create(entity: Partial<User>): Promise<User> {
    const user = new User(entity);
    this.users.set(user.id, user);
    return user;
  }

  async update(id: string, entity: Partial<User>): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    const updatedUser = new User({
      ...existingUser,
      ...entity,
      id: existingUser.id,
    });
    updatedUser.updateTimestamp();

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = Array.from(this.users.values());
    return users.find((u) => u.email === email) || null;
  }

  async findActiveUsers(): Promise<User[]> {
    const users = Array.from(this.users.values());
    return users.filter((u) => u.isActive);
  }
}

