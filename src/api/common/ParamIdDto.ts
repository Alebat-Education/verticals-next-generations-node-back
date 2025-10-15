import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { VALIDATION_MESSAGES } from '@constants/errors/validation/messages.js';

export class ParamIdDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_INTEGER('ID') })
  @Min(1, { message: VALIDATION_MESSAGES.FIELD_MIN_VALUE('ID', 1) })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.FIELD_REQUIRED('ID') })
  id!: number;
}

export class ParamDocumentIdDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_INTEGER('documentId') })
  @Min(1, { message: VALIDATION_MESSAGES.FIELD_MIN_VALUE('documentId', 1) })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.FIELD_REQUIRED('documentId') })
  documentId!: number;
}

export class ParamIdAndDocumentIdDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_INTEGER('ID') })
  @Min(1, { message: VALIDATION_MESSAGES.FIELD_MIN_VALUE('ID', 1) })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.FIELD_REQUIRED('ID') })
  id!: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: VALIDATION_MESSAGES.FIELD_MUST_BE_INTEGER('documentId') })
  @Min(1, { message: VALIDATION_MESSAGES.FIELD_MIN_VALUE('documentId', 1) })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.FIELD_REQUIRED('documentId') })
  documentId!: number;
}
