/**
 * Base port for repositories
 * Defines the common contract that all repositories must fulfill
 */
export interface BaseRepositoryPort<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Partial<T>): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}

