import { BaseEntity } from './base.entity';

export class Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;

  constructor(data: Partial<Product>) {
    super(data.id);
    this.name = data.name || '';
    this.description = data.description || '';
    this.price = data.price || 0;
    this.stock = data.stock || 0;
    this.category = data.category || '';
  }

  // TODO: Implement domain methods
  // hasStock(quantity: number): boolean
  // reduceStock(quantity: number): void
  // increaseStock(quantity: number): void
}

