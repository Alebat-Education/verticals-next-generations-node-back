import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre!: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email!: string;

  @IsOptional()
  @IsString()
  grupo?: string;
}
