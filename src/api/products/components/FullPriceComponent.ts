import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('components_products_full_prices')
export class FullPriceComponent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price!: number;

  @Column({ name: 'discount_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountPrice?: number;

  @Column({ name: 'stripe_price_id', type: 'varchar', length: 255, nullable: true })
  stripePriceId?: string;

  @Column({ name: 'tax', type: 'varchar', length: 255, nullable: true })
  tax?: string;

  @Column({ name: 'discount_percentage', type: 'int', nullable: true, unsigned: true })
  discountPercentage?: number;
}
