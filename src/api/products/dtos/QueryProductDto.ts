import { IsEnum, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ProductType } from '@enums/product.js';
import { Verticals } from '@enums/global.js';
import { VALIDATION_MESSAGES } from '@constants/errors/validation/messages.js';

export class QueryProductDto {
  @IsEnum(ProductType, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_VALID_ENUM('Product type') })
  @IsOptional()
  type?: ProductType;

  @IsEnum(Verticals, { message: VALIDATION_MESSAGES.FIELD_MUST_BE_VALID_ENUM('Vertical') })
  @IsOptional()
  vertical?: Verticals;

  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('SKU') })
  @IsOptional()
  SKU?: string;

  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Slug') })
  @IsOptional()
  slug?: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_INTEGER('Page') })
  @Min(1, { message: VALIDATION_MESSAGES.FIELD_MIN_VALUE('Page', 1) })
  @IsOptional()
  page?: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_INTEGER('Limit') })
  @Min(1, { message: VALIDATION_MESSAGES.FIELD_MIN_VALUE('Limit', 1) })
  @Max(100, { message: VALIDATION_MESSAGES.FIELD_MAX_VALUE('Limit', 100) })
  @IsOptional()
  limit?: number;

  @IsString({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_STRING('Sort by') })
  @IsOptional()
  sortBy?: string;

  @IsEnum(['ASC', 'DESC'], { message: VALIDATION_MESSAGES.ORDER_DIRECTION_ENUM })
  @IsOptional()
  order?: 'ASC' | 'DESC';
}
