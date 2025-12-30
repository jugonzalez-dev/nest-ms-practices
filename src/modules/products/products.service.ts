import { Injectable } from '@nestjs/common';
import { CreateProductUseCase } from '@application/use-cases/products/create-product.use-case';
import { GetProductUseCase } from '@application/use-cases/products/get-product.use-case';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    // TODO: Add more use cases when implemented
    // private readonly listProductsUseCase: ListProductsUseCase,
    // private readonly updateProductUseCase: UpdateProductUseCase,
  ) {}

  async create(createProductDto: CreateProductDto) {
    return this.createProductUseCase.execute(createProductDto);
  }

  async findOne(id: string) {
    return this.getProductUseCase.execute({ id });
  }

  async findAll() {
    // TODO: Implement when ListProductsUseCase is created
    throw new Error('Not implemented yet');
  }
}

