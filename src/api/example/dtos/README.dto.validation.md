DTOs y validación

Los DTOs (Data Transfer Objects) definen la estructura y las reglas de validación de los datos que llegan a los endpoints. Usamos `class-validator` para declarar reglas por medio de decoradores y `class-transformer` para convertir objetos planos a instancias de clases.

Ejemplo básico de DTO con `class-validator`:

```typescript
import { IsString, IsOptional, Length, IsIn, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateExampleDto {
  @IsString()
  @Length(3, 50)
  name!: string;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
}
```

Ejemplo real de `CreateStudentDto` recomendado (archivo: `src/api/example/dtos/CreateStudentDto.ts`):

```typescript
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
```

Buenas prácticas:

- Usa clases en lugar de interfaces para entrada porque `class-transformer` necesita clases para instanciar.
- Separa DTOs para create/update: `CreateStudentDto` vs `UpdateStudentDto` (en el update marca `@IsOptional()` en los campos que no son obligatorios).
- Evita incluir propiedades sensibles (ej: `password`) en DTOs de salida; usa `ResponseDto` para controlar lo que devuelves.
- Para arrays y objetos anidados usa `@ValidateNested()`, `@Type(() => ChildDto)` y `@IsArray()`.

Ejemplo de nested/array:

```typescript
import { Type } from 'class-transformer';
import { IsString, ValidateNested, IsArray } from 'class-validator';

class TagDto {
  @IsString()
  name!: string;
}

export class CreateArticleDto {
  @IsString()
  title!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  tags!: TagDto[];
}
```

Observación sobre mensajes de error:

- Los mensajes pueden declararse directamente en los decoradores y/o mapearse en el `ValidationPipe` para producir una respuesta consistente y localizada.
