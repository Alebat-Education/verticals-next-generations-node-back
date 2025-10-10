import { IsEnum, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ProductType } from '@enums/product.js';
import { Verticals } from '@enums/global.js';
import { PRODUCT_VALIDATION_MESSAGES, VALIDATION_RULES } from '@constants/validation/index.js';

const { NUMERIC } = VALIDATION_RULES;
const MSG = PRODUCT_VALIDATION_MESSAGES;

export class QueryProductDto {
  @IsEnum(ProductType, { message: MSG.TYPE.MUST_BE_VALID })
  @IsOptional()
  type?: ProductType;

  @IsEnum(Verticals, { message: MSG.VERTICAL.EACH_VALID })
  @IsOptional()
  vertical?: Verticals;

  @IsString({ message: MSG.SKU.MUST_BE_STRING })
  @IsOptional()
  SKU?: string;

  @IsString({ message: MSG.SLUG.MUST_BE_STRING })
  @IsOptional()
  slug?: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: MSG.PAGE.MUST_BE_INTEGER })
  @Min(NUMERIC.PAGE_MIN, { message: MSG.PAGE.MIN_VALUE })
  @IsOptional()
  page?: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: MSG.LIMIT.MUST_BE_INTEGER })
  @Min(NUMERIC.LIMIT_MIN, { message: MSG.LIMIT.MIN_VALUE })
  @Max(NUMERIC.LIMIT_MAX, { message: MSG.LIMIT.MAX_VALUE })
  @IsOptional()
  limit?: number;

  @IsString({ message: MSG.SORT_BY.MUST_BE_STRING })
  @IsOptional()
  sortBy?: string;

  @IsEnum(['ASC', 'DESC'], { message: MSG.ORDER_DIRECTION.MUST_BE_VALID })
  @IsOptional()
  order?: 'ASC' | 'DESC';
}
