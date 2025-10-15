import {
  IsString,
  IsNotEmpty,
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
import { VALIDATION_MESSAGES } from '@constants/errors/validation/messages.js';

export class CreateProductDto {
  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Document ID') })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.FIELD_REQUIRED('Document ID') })
  @Length(1, 255, { message: VALIDATION_MESSAGES.FIELD_LENGTH_BETWEEN('Document ID', 1, 255) })
  documentId!: string;

  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Title') })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.FIELD_REQUIRED('Title') })
  @Length(1, 255, { message: VALIDATION_MESSAGES.FIELD_LENGTH_BETWEEN('Title', 1, 255) })
  title!: string;

  @IsEnum(SubjectDataType, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_VALID_ENUM('Subject data') })
  @IsOptional()
  subjectData?: SubjectDataType;

  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Slug') })
  @IsOptional()
  @Length(1, 255, { message: VALIDATION_MESSAGES.FIELD_LENGTH_BETWEEN('Slug', 1, 255) })
  slug?: string;

  @IsInt({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_INTEGER('Order') })
  @IsOptional()
  @Min(0, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_POSITIVE('Order') })
  order?: number;

  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('SKU') })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.FIELD_REQUIRED('SKU') })
  @Length(1, 100, { message: VALIDATION_MESSAGES.FIELD_LENGTH_BETWEEN('SKU', 1, 100) })
  SKU!: string;

  @IsArray({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_ARRAY('Vertical') })
  @ArrayMinSize(1, { message: VALIDATION_MESSAGES.ARRAY_MIN_SIZE('Vertical', 1) })
  @IsEnum(Verticals, { each: true, message: VALIDATION_MESSAGES.FIELD_MUST_BE_VALID_ENUM('Each vertical') })
  vertical!: Verticals[];

  @IsEnum(ProductType, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_VALID_ENUM('Product type') })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.FIELD_REQUIRED('Product type') })
  type!: ProductType;

  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Stripe ID') })
  @IsOptional()
  @Length(1, 255, { message: VALIDATION_MESSAGES.FIELD_LENGTH_BETWEEN('Stripe ID', 1, 255) })
  stripeID?: string;

  @IsEnum(StripeCrm, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_VALID_ENUM('Stripe CRM') })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.FIELD_REQUIRED('Stripe CRM') })
  stripeCrm!: StripeCrm;

  @IsEnum(PurchaseType, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_VALID_ENUM('Purchase type') })
  @IsOptional()
  purchaseType?: PurchaseType;

  @IsBoolean({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_BOOLEAN('Enrol button') })
  @IsOptional()
  enrolButton?: boolean;

  @IsBoolean({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_BOOLEAN('Form button') })
  @IsOptional()
  formButton?: boolean;

  @IsBoolean({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_BOOLEAN('Is soon') })
  @IsOptional()
  isSoon?: boolean;

  @IsBoolean({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_BOOLEAN('Instalments price') })
  @IsOptional()
  instalmentsPrice?: boolean;

  @IsBoolean({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_BOOLEAN('Contract') })
  @IsOptional()
  contract?: boolean;

  @IsEnum(AcronymType, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_VALID_ENUM('Acronym') })
  @IsOptional()
  acronym?: AcronymType;

  @IsEnum(PresencialType, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_VALID_ENUM('Presencial type') })
  @IsOptional()
  presencialType?: PresencialType;

  @IsBoolean({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_BOOLEAN('Limited places') })
  @IsOptional()
  limitedPlaces?: boolean;

  @IsEnum(SubscriptionType, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_VALID_ENUM('Subscription type') })
  @IsOptional()
  subscriptionType?: SubscriptionType;

  @IsInt({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_INTEGER('Trial period days') })
  @IsOptional()
  @Min(0, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_POSITIVE('Trial period days') })
  trialPeriodDays?: number;

  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Stripe description') })
  @IsOptional()
  stripeDescription?: string;

  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Card subscription') })
  @IsOptional()
  cardSubscription?: string;

  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Syllabus') })
  @IsOptional()
  syllabus?: string;

  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Presentation') })
  @IsOptional()
  presentation?: string;

  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Objectives') })
  @IsOptional()
  objectives?: string;

  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Directed') })
  @IsOptional()
  directed?: string;

  @IsBoolean({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_BOOLEAN('Has LAAB connection') })
  @IsOptional()
  hasLaabConnection?: boolean;

  @IsBoolean({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_BOOLEAN('Is premium') })
  @IsOptional()
  isPremium?: boolean;

  @IsDateString({}, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_VALID_DATE('Published at') })
  @IsOptional()
  publishedAt?: Date;
}
