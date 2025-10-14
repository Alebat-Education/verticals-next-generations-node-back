import { IsEnum, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ProductType } from '@enums/product.js';
import { Verticals } from '@enums/global.js';

export class QueryProductDto {
  @IsEnum(ProductType, { message: 'Product type must be a valid value' })
  @IsOptional()
  type?: ProductType;

  @IsEnum(Verticals, { message: 'Vertical must be a valid value' })
  @IsOptional()
  vertical?: Verticals;

  @IsString({ message: 'SKU must be a string' })
  @IsOptional()
  SKU?: string;

  @IsString({ message: 'Slug must be a string' })
  @IsOptional()
  slug?: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  @IsOptional()
  page?: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit must not exceed 100' })
  @IsOptional()
  limit?: number;

  @IsString({ message: 'Sort by must be a string' })
  @IsOptional()
  sortBy?: string;

  @IsEnum(['ASC', 'DESC'], { message: 'Order direction must be ASC or DESC' })
  @IsOptional()
  order?: 'ASC' | 'DESC';
}
