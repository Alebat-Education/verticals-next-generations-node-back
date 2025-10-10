import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import {
  ProductType,
  PurchaseType,
  AcronymType,
  PresencialType,
  SubscriptionType,
  SubjectDataType,
} from '@enums/product.js';
import { Verticals, StripeCrm } from '@enums/global.js';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'document_id', type: 'varchar', length: 255, nullable: false })
  documentId!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title!: string;

  @Column({ name: 'subject_data', type: 'enum', enum: SubjectDataType, default: SubjectDataType.MANUAL })
  subjectData!: SubjectDataType;

  @Index('IDX_PRODUCTS_SLUG', ['slug'], { unique: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  slug?: string;

  @Index('IDX_PRODUCTS_ORDER', ['order'], { unique: true })
  @Column({ type: 'int', nullable: true, unsigned: true })
  order?: number;

  @Index('IDX_PRODUCTS_SKU', ['SKU'], { unique: true })
  @Column({ name: 'sku', type: 'varchar', length: 100, nullable: false })
  SKU!: string;

  @Column({ type: 'json', nullable: false })
  vertical!: Verticals[];

  @Column({ type: 'enum', enum: ProductType, nullable: false })
  type!: ProductType;

  @Column({ name: 'stripe_id', type: 'varchar', length: 255, nullable: true })
  stripeID?: string;

  @Column({ name: 'stripe_crm', type: 'enum', enum: StripeCrm, nullable: false })
  stripeCrm!: StripeCrm;

  @Column({ name: 'purchase_type', type: 'enum', enum: PurchaseType, nullable: true })
  purchaseType?: PurchaseType;

  @Column({ name: 'enrol_button', type: 'boolean', default: true })
  enrolButton!: boolean;

  @Column({ name: 'form_button', type: 'boolean', default: true })
  formButton!: boolean;

  @Column({ name: 'is_soon', type: 'boolean', default: false })
  isSoon!: boolean;

  @Column({ name: 'instalments_price', type: 'boolean', default: false })
  instalmentsPrice!: boolean;

  @Column({ type: 'boolean', default: true })
  contract!: boolean;

  @Column({ type: 'enum', enum: AcronymType, nullable: true })
  acronym?: AcronymType;

  @Column({ name: 'presencial_type', type: 'enum', enum: PresencialType, nullable: true })
  presencialType?: PresencialType;

  @Column({ name: 'limited_places', type: 'boolean', nullable: true })
  limitedPlaces?: boolean;

  @Column({ name: 'subscription_type', type: 'enum', enum: SubscriptionType, default: SubscriptionType.PREMIUM })
  subscriptionType!: SubscriptionType;

  @Column({ name: 'trial_period_days', type: 'int', nullable: true, unsigned: true })
  trialPeriodDays?: number;

  @Column({ name: 'stripe_description', type: 'text', nullable: true })
  stripeDescription?: string;

  @Column({ name: 'card_subscription', type: 'text', nullable: true })
  cardSubscription?: string;

  @Column({ type: 'text', nullable: true })
  syllabus?: string;

  @Column({ type: 'text', nullable: true })
  presentation?: string;

  @Column({ type: 'text', nullable: true })
  objectives?: string;

  @Column({ type: 'text', nullable: true })
  directed?: string;

  @Column({ name: 'has_laab_connection', type: 'boolean', default: true })
  hasLaabConnection!: boolean;

  @Column({ name: 'is_premium', type: 'boolean', default: false })
  isPremium!: boolean;

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  publishedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // ...
}
