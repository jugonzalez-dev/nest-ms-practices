import { BaseRepositoryPort } from './base-repository.port';
import { Product } from '@core/domain/entities/product.entity';

export interface ProductRepositoryPort extends BaseRepositoryPort<Product> {
  // TODO: Add repository-specific methods
  // findByCategory(category: string): Promise<Product[]>;
  // findLowStock(threshold: number): Promise<Product[]>;
}

