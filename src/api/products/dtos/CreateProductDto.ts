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
  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Document ID') })
  @Length(1, 255, { message: VALIDATION_MESSAGES.FIELD_LENGTH_BETWEEN('Document ID', 1, 255) })
  documentId?: string;

  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Title') })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.FIELD_REQUIRED('Title') })
  @Length(1, 255, { message: VALIDATION_MESSAGES.FIELD_LENGTH_BETWEEN('Title', 1, 255) })
  title!: string;

  @IsOptional()
  @IsEnum(SubjectDataType, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_VALID_ENUM('Subject data') })
  subjectData?: SubjectDataType;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Slug') })
  @Length(1, 255, { message: VALIDATION_MESSAGES.FIELD_LENGTH_BETWEEN('Slug', 1, 255) })
  slug?: string;

  @IsOptional()
  @IsInt({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_INTEGER('Order') })
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

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Stripe ID') })
  @Length(1, 255, { message: VALIDATION_MESSAGES.FIELD_LENGTH_BETWEEN('Stripe ID', 1, 255) })
  stripeID?: string;

  @IsEnum(StripeCrm, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_VALID_ENUM('Stripe CRM') })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.FIELD_REQUIRED('Stripe CRM') })
  stripeCrm!: StripeCrm;

  @IsOptional()
  @IsEnum(PurchaseType, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_VALID_ENUM('Purchase type') })
  purchaseType?: PurchaseType;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_BOOLEAN('Enrol button') })
  enrolButton?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_BOOLEAN('Form button') })
  formButton?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_BOOLEAN('Is soon') })
  isSoon?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_BOOLEAN('Instalments price') })
  instalmentsPrice?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_BOOLEAN('Contract') })
  contract?: boolean;

  @IsOptional()
  @IsEnum(AcronymType, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_VALID_ENUM('Acronym') })
  acronym?: AcronymType;

  @IsOptional()
  @IsEnum(PresencialType, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_VALID_ENUM('Presencial type') })
  presencialType?: PresencialType;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_BOOLEAN('Limited places') })
  limitedPlaces?: boolean;

  @IsOptional()
  @IsEnum(SubscriptionType, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_VALID_ENUM('Subscription type') })
  subscriptionType?: SubscriptionType;

  @IsOptional()
  @IsInt({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_INTEGER('Trial period days') })
  @Min(0, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_POSITIVE('Trial period days') })
  trialPeriodDays?: number;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Stripe description') })
  stripeDescription?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Card subscription') })
  cardSubscription?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Syllabus') })
  syllabus?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Presentation') })
  presentation?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Objectives') })
  objectives?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Directed') })
  directed?: string;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_BOOLEAN('Has LAAB connection') })
  hasLaabConnection?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_BOOLEAN('Is premium') })
  isPremium?: boolean;

  @IsOptional()
  @IsDateString({}, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_VALID_DATE('Published at') })
  publishedAt?: Date;
}
