import { Injectable } from '@nestjs/common';
import { ProductRepositoryPort } from '@core/ports/repositories/product-repository.port';
import { Product } from '@core/domain/entities/product.entity';

/**
 * Repository adapter for Product
 * TODO: Implement real persistence (DB, API, etc.)
 * For now, only base structure with in-memory storage
 */
@Injectable()
export class ProductRepositoryAdapter implements ProductRepositoryPort {
  private products: Map<string, Product> = new Map();

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async create(entity: Partial<Product>): Promise<Product> {
    const product = new Product(entity);
    this.products.set(product.id, product);
    return product;
  }

  async update(id: string, entity: Partial<Product>): Promise<Product> {
    // TODO: Implement complete update logic
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    const updatedProduct = new Product({
      ...existingProduct,
      ...entity,
      id: existingProduct.id,
    });
    updatedProduct.updateTimestamp();

    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async delete(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // TODO: Implement repository-specific methods
  // async findByCategory(category: string): Promise<Product[]> { ... }
  // async findLowStock(threshold: number): Promise<Product[]> { ... }
}

