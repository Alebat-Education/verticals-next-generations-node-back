import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class ParamIdDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'The ID must be an integer' })
  @Min(1, { message: 'The ID must be greater than or equal to 1' })
  @IsNotEmpty({ message: 'The ID is required' })
  id!: number;
}

export class ParamDocumentIdDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'The documentId must be an integer' })
  @Min(1, { message: 'The documentId must be greater than or equal to 1' })
  @IsNotEmpty({ message: 'The documentId is required' })
  documentId!: number;
}

export class ParamIdAndDocumentIdDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'The ID must be an integer' })
  @Min(1, { message: 'The ID must be greater than or equal to 1' })
  @IsNotEmpty({ message: 'The ID is required' })
  id!: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'The documentId must be an integer' })
  @Min(1, { message: 'The documentId must be greater than or equal to 1' })
  @IsNotEmpty({ message: 'The documentId is required' })
  documentId!: number;
}
