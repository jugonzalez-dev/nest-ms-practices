import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserRepositoryPort } from '@core/ports/repositories/user-repository.port';
import { Inject } from '@nestjs/common';

/**
 * Service to seed initial data into the repository
 * This runs automatically when the module is initialized
 */
@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async onModuleInit() {
    // Check if we already have users (to avoid duplicates on hot-reload)
    const existingUsers = await this.userRepository.findAll();

    if (existingUsers.length === 0) {
      console.log('🌱 Seeding initial data...');

      // Create sample users
      await this.userRepository.create({
        email: 'admin@example.com',
        name: 'Admin User',
        roles: ['admin', 'user'],
        isActive: true,
      });

      await this.userRepository.create({
        email: 'user@example.com',
        name: 'Regular User',
        roles: ['user'],
        isActive: true,
      });

      await this.userRepository.create({
        email: 'inactive@example.com',
        name: 'Inactive User',
        roles: ['user'],
        isActive: false,
      });

      console.log('✅ Initial data seeded successfully!');
      console.log('📊 Created 3 sample users');
    } else {
      console.log(`📊 Found ${existingUsers.length} existing users, skipping seed`);
    }
  }
}

