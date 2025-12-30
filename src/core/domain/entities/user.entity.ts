import { BaseEntity } from './base.entity';

export class User extends BaseEntity {
  email: string;
  name: string;
  roles: string[];
  isActive: boolean;

  constructor(data: Partial<User>) {
    super(data.id);
    this.email = data.email || '';
    this.name = data.name || '';
    this.roles = data.roles || [];
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  activate(): void {
    this.isActive = true;
    this.updateTimestamp();
  }

  deactivate(): void {
    this.isActive = false;
    this.updateTimestamp();
  }
}

