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
import { PRODUCT_VALIDATION_MESSAGES, VALIDATION_RULES } from '@constants/validation/index.js';

const { STRING_LENGTH, NUMERIC, ARRAY } = VALIDATION_RULES;
const MSG = PRODUCT_VALIDATION_MESSAGES;

export class UpdateProductDto {
  @IsString({ message: MSG.DOCUMENT_ID.MUST_BE_STRING })
  @IsOptional()
  @Length(STRING_LENGTH.DOCUMENT_ID.MIN, STRING_LENGTH.DOCUMENT_ID.MAX, { message: MSG.DOCUMENT_ID.LENGTH })
  documentId?: string;

  @IsString({ message: MSG.TITLE.MUST_BE_STRING })
  @IsOptional()
  @Length(STRING_LENGTH.TITLE.MIN, STRING_LENGTH.TITLE.MAX, { message: MSG.TITLE.LENGTH })
  title?: string;

  @IsEnum(SubjectDataType, { message: MSG.SUBJECT_DATA.MUST_BE_VALID })
  @IsOptional()
  subjectData?: SubjectDataType;

  @IsString({ message: MSG.SLUG.MUST_BE_STRING })
  @IsOptional()
  @Length(STRING_LENGTH.SLUG.MIN, STRING_LENGTH.SLUG.MAX, { message: MSG.SLUG.LENGTH })
  slug?: string;

  @IsInt({ message: MSG.ORDER.MUST_BE_INTEGER })
  @IsOptional()
  @Min(NUMERIC.ORDER_MIN, { message: MSG.ORDER.MUST_BE_POSITIVE })
  order?: number;

  @IsString({ message: MSG.SKU.MUST_BE_STRING })
  @IsOptional()
  @Length(STRING_LENGTH.SKU.MIN, STRING_LENGTH.SKU.MAX, { message: MSG.SKU.LENGTH })
  SKU?: string;

  @IsArray({ message: MSG.VERTICAL.MUST_BE_ARRAY })
  @IsOptional()
  @ArrayMinSize(ARRAY.VERTICAL_MIN_SIZE, { message: MSG.VERTICAL.MIN_SIZE })
  @IsEnum(Verticals, { each: true, message: MSG.VERTICAL.EACH_VALID })
  vertical?: Verticals[];

  @IsEnum(ProductType, { message: MSG.TYPE.MUST_BE_VALID })
  @IsOptional()
  type?: ProductType;

  @IsString({ message: MSG.STRIPE_ID.MUST_BE_STRING })
  @IsOptional()
  @Length(STRING_LENGTH.STRIPE_ID.MIN, STRING_LENGTH.STRIPE_ID.MAX, { message: MSG.STRIPE_ID.LENGTH })
  stripeID?: string;

  @IsEnum(StripeCrm, { message: MSG.STRIPE_CRM.MUST_BE_VALID })
  @IsOptional()
  stripeCrm?: StripeCrm;

  @IsEnum(PurchaseType, { message: MSG.PURCHASE_TYPE.MUST_BE_VALID })
  @IsOptional()
  purchaseType?: PurchaseType;

  @IsBoolean({ message: MSG.ENROL_BUTTON.MUST_BE_BOOLEAN })
  @IsOptional()
  enrolButton?: boolean;

  @IsBoolean({ message: MSG.FORM_BUTTON.MUST_BE_BOOLEAN })
  @IsOptional()
  formButton?: boolean;

  @IsBoolean({ message: MSG.IS_SOON.MUST_BE_BOOLEAN })
  @IsOptional()
  isSoon?: boolean;

  @IsBoolean({ message: MSG.INSTALMENTS_PRICE.MUST_BE_BOOLEAN })
  @IsOptional()
  instalmentsPrice?: boolean;

  @IsBoolean({ message: MSG.CONTRACT.MUST_BE_BOOLEAN })
  @IsOptional()
  contract?: boolean;

  @IsEnum(AcronymType, { message: MSG.ACRONYM.MUST_BE_VALID })
  @IsOptional()
  acronym?: AcronymType;

  @IsEnum(PresencialType, { message: MSG.PRESENCIAL_TYPE.MUST_BE_VALID })
  @IsOptional()
  presencialType?: PresencialType;

  @IsBoolean({ message: MSG.LIMITED_PLACES.MUST_BE_BOOLEAN })
  @IsOptional()
  limitedPlaces?: boolean;

  @IsEnum(SubscriptionType, { message: MSG.SUBSCRIPTION_TYPE.MUST_BE_VALID })
  @IsOptional()
  subscriptionType?: SubscriptionType;

  @IsInt({ message: MSG.TRIAL_PERIOD_DAYS.MUST_BE_INTEGER })
  @IsOptional()
  @Min(NUMERIC.TRIAL_PERIOD_DAYS_MIN, { message: MSG.TRIAL_PERIOD_DAYS.MUST_BE_POSITIVE })
  trialPeriodDays?: number;

  @IsString({ message: MSG.STRIPE_DESCRIPTION.MUST_BE_STRING })
  @IsOptional()
  stripeDescription?: string;

  @IsString({ message: MSG.CARD_SUBSCRIPTION.MUST_BE_STRING })
  @IsOptional()
  cardSubscription?: string;

  @IsString({ message: MSG.SYLLABUS.MUST_BE_STRING })
  @IsOptional()
  syllabus?: string;

  @IsString({ message: MSG.PRESENTATION.MUST_BE_STRING })
  @IsOptional()
  presentation?: string;

  @IsString({ message: MSG.OBJECTIVES.MUST_BE_STRING })
  @IsOptional()
  objectives?: string;

  @IsString({ message: MSG.DIRECTED.MUST_BE_STRING })
  @IsOptional()
  directed?: string;

  @IsBoolean({ message: MSG.HAS_LAAB_CONNECTION.MUST_BE_BOOLEAN })
  @IsOptional()
  hasLaabConnection?: boolean;

  @IsBoolean({ message: MSG.IS_PREMIUM.MUST_BE_BOOLEAN })
  @IsOptional()
  isPremium?: boolean;

  @IsDateString({}, { message: MSG.PUBLISHED_AT.MUST_BE_VALID_DATE })
  @IsOptional()
  publishedAt?: Date;
}
