import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToMany } from 'typeorm';
import { Product } from '@api/products/productModel.js';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'document_id', type: 'varchar', length: 255, nullable: false })
  documentId!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Index('IDX_CATEGORIES_SLUG', ['slug'], { unique: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  slug?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  locale?: string;

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  publishedAt?: Date;

  @Column({ name: 'created_by_id', type: 'int', nullable: true })
  createdById?: number;

  @Column({ name: 'updated_by_id', type: 'int', nullable: true })
  updatedById?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToMany(() => Product, product => product.categories)
  products!: Product[];
}
