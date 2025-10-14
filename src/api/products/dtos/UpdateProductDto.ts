import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  Length,
  Min,
  IsDateString,
  ArrayMinSize,
} from 'class-validator';
import {
  ProductType,
  PurchaseType,
  AcronymType,
  PresencialType,
  SubscriptionType,
  SubjectDataType,
} from '@enums/product.js';
import { Verticals, StripeCrm } from '@enums/global.js';

export class UpdateProductDto {
  @IsString({ message: 'Document ID must be a string' })
  @IsOptional()
  @Length(1, 255, { message: 'Document ID must be between 1 and 255 characters' })
  documentId?: string;

  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  @Length(1, 255, { message: 'Title must be between 1 and 255 characters' })
  title?: string;

  @IsEnum(SubjectDataType, { message: 'Subject data must be a valid value' })
  @IsOptional()
  subjectData?: SubjectDataType;

  @IsString({ message: 'Slug must be a string' })
  @IsOptional()
  @Length(1, 255, { message: 'Slug must be between 1 and 255 characters' })
  slug?: string;

  @IsInt({ message: 'Order must be an integer' })
  @IsOptional()
  @Min(0, { message: 'Order must be a positive number' })
  order?: number;

  @IsString({ message: 'SKU must be a string' })
  @IsOptional()
  @Length(1, 100, { message: 'SKU must be between 1 and 100 characters' })
  SKU?: string;

  @IsArray({ message: 'Vertical must be an array' })
  @IsOptional()
  @ArrayMinSize(1, { message: 'Vertical must contain at least 1 item' })
  @IsEnum(Verticals, { each: true, message: 'Each vertical must be a valid value' })
  vertical?: Verticals[];

  @IsEnum(ProductType, { message: 'Product type must be a valid value' })
  @IsOptional()
  type?: ProductType;

  @IsString({ message: 'Stripe ID must be a string' })
  @IsOptional()
  @Length(1, 255, { message: 'Stripe ID must be between 1 and 255 characters' })
  stripeID?: string;

  @IsEnum(StripeCrm, { message: 'Stripe CRM must be a valid value' })
  @IsOptional()
  stripeCrm?: StripeCrm;

  @IsEnum(PurchaseType, { message: 'Purchase type must be a valid value' })
  @IsOptional()
  purchaseType?: PurchaseType;

  @IsBoolean({ message: 'Enrol button must be a boolean' })
  @IsOptional()
  enrolButton?: boolean;

  @IsBoolean({ message: 'Form button must be a boolean' })
  @IsOptional()
  formButton?: boolean;

  @IsBoolean({ message: 'Is soon must be a boolean' })
  @IsOptional()
  isSoon?: boolean;

  @IsBoolean({ message: 'Instalments price must be a boolean' })
  @IsOptional()
  instalmentsPrice?: boolean;

  @IsBoolean({ message: 'Contract must be a boolean' })
  @IsOptional()
  contract?: boolean;

  @IsEnum(AcronymType, { message: 'Acronym must be a valid value' })
  @IsOptional()
  acronym?: AcronymType;

  @IsEnum(PresencialType, { message: 'Presencial type must be a valid value' })
  @IsOptional()
  presencialType?: PresencialType;

  @IsBoolean({ message: 'Limited places must be a boolean' })
  @IsOptional()
  limitedPlaces?: boolean;

  @IsEnum(SubscriptionType, { message: 'Subscription type must be a valid value' })
  @IsOptional()
  subscriptionType?: SubscriptionType;

  @IsInt({ message: 'Trial period days must be an integer' })
  @IsOptional()
  @Min(0, { message: 'Trial period days must be a positive number' })
  trialPeriodDays?: number;

  @IsString({ message: 'Stripe description must be a string' })
  @IsOptional()
  stripeDescription?: string;

  @IsString({ message: 'Card subscription must be a string' })
  @IsOptional()
  cardSubscription?: string;

  @IsString({ message: 'Syllabus must be a string' })
  @IsOptional()
  syllabus?: string;

  @IsString({ message: 'Presentation must be a string' })
  @IsOptional()
  presentation?: string;

  @IsString({ message: 'Objectives must be a string' })
  @IsOptional()
  objectives?: string;

  @IsString({ message: 'Directed must be a string' })
  @IsOptional()
  directed?: string;

  @IsBoolean({ message: 'Has LAAB connection must be a boolean' })
  @IsOptional()
  hasLaabConnection?: boolean;

  @IsBoolean({ message: 'Is premium must be a boolean' })
  @IsOptional()
  isPremium?: boolean;

  @IsDateString({}, { message: 'Published at must be a valid date' })
  @IsOptional()
  publishedAt?: Date;
}
