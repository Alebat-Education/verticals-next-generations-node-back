import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { PRODUCT_VALIDATION_MESSAGES, VALIDATION_RULES } from '@constants/validation/index.js';

const { NUMERIC } = VALIDATION_RULES;
const MSG = PRODUCT_VALIDATION_MESSAGES;

export class ParamProductDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: MSG.ID.MUST_BE_INTEGER })
  @Min(NUMERIC.ID_MIN, { message: MSG.ID.MIN_VALUE })
  @IsNotEmpty({ message: MSG.ID.REQUIRED })
  id!: number;
}
