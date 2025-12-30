import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductRepositoryAdapter } from '@infrastructure/persistence/product-repository.adapter';
import { CreateProductUseCase } from '@application/use-cases/products/create-product.use-case';
import { GetProductUseCase } from '@application/use-cases/products/get-product.use-case';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    CreateProductUseCase,
    GetProductUseCase,
    // TODO: Add more use cases when implemented
    {
      provide: 'ProductRepositoryPort',
      useClass: ProductRepositoryAdapter,
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}

