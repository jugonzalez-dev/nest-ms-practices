import { Injectable, Inject } from '@nestjs/common';
import { BaseUseCase } from '../base.use-case';
import { ProductRepositoryPort } from '@core/ports/repositories/product-repository.port';
import { Product } from '@core/domain/entities/product.entity';

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

export interface CreateProductOutput {
  product: Product;
}

@Injectable()
export class CreateProductUseCase extends BaseUseCase<CreateProductInput, CreateProductOutput> {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort,
  ) {
    super();
  }

  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    // TODO: Add business validations
    // - Validate that price is positive
    // - Validate that stock is >= 0
    // - Validate that category exists

    const product = new Product(input);
    const createdProduct = await this.productRepository.create(product);

    return { product: createdProduct };
  }
}

