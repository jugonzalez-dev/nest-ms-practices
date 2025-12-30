import { Injectable, Inject } from '@nestjs/common';
import { BaseUseCase } from '../base.use-case';
import { ProductRepositoryPort } from '@core/ports/repositories/product-repository.port';
import { Product } from '@core/domain/entities/product.entity';

export interface GetProductInput {
  id: string;
}

export interface GetProductOutput {
  product: Product | null;
}

@Injectable()
export class GetProductUseCase extends BaseUseCase<GetProductInput, GetProductOutput> {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort,
  ) {
    super();
  }

  async execute(input: GetProductInput): Promise<GetProductOutput> {
    // TODO: Add additional logic if needed
    const product = await this.productRepository.findById(input.id);
    return { product };
  }
}

