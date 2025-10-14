import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseComponentEntity } from '@common/BaseComponentEntity.js';
import { Product } from '../productModel.js';

@Entity('products_cmps')
export class ProductComponent extends BaseComponentEntity {
  @ManyToOne(() => Product, product => product.components, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entity_id' })
  product!: Product;
}
