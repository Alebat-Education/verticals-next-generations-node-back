# DTOs (Data Transfer Objects)

Los DTOs definen la estructura de los datos que entran y salen de la API. Son como contratos que dicen "esto es lo que acepto" y "esto es lo que devuelvo".

## Estructura de archivos

```
api/example/
├── Student.ts              # Entity/Model
├── StudentsController.ts   # Controlador
├── StudentsService.ts      # Lógica de negocio
├── studentsRoutes.ts       # Rutas
└── dtos/
    ├── CreateStudentDto.ts
    ├── UpdateStudentDto.ts
    └── StudentResponseDto.ts
```

## Para qué sirve

- **Validar entrada**: Verificar que los datos que llegan están bien
- **Formato de salida**: Controlar qué datos devuelves (sin passwords, etc.)
- **Documentación**: Otros devs saben qué enviar/recibir
- **Seguridad**: No exponer campos internos

## Diferencia con Models/Interfaces

- **Model**: Estructura de la base de datos
- **Interface**: Contratos de TypeScript
- **DTO**: Datos que viajan por HTTP (entrada/salida de API)

## Cómo se hace

### DTOs de entrada (Request)

```typescript
// dtos/CreateStudentDto.ts
export interface CreateStudentDto {
  name: string;
  email: string;
  age: number;
  // No incluye 'id' - se genera automáticamente
}

export interface UpdateStudentDto {
  name?: string;
  email?: string;
  age?: number;
  // Todos opcionales en updates
}
```

### DTOs de salida (Response)

```typescript
// dtos/StudentResponseDto.ts
export interface StudentResponseDto {
  id: number;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
  // No incluye 'password' u otros campos sensibles
}

export interface StudentsListResponseDto {
  students: StudentResponseDto[];
  total: number;
  page: number;
  limit: number;
}
```

### Uso en controladores

```typescript
import type { Request, Response } from 'express';
import type { CreateStudentDto, StudentResponseDto } from '@api/example/dtos/CreateStudentDto';

class StudentsController {
  async create(req: Request<{}, StudentResponseDto, CreateStudentDto>, res: Response) {
    // TypeScript sabe que req.body tiene la estructura de CreateStudentDto
    const { name, email, age } = req.body;

    // ... lógica ...

    // Y que res.json() debe devolver StudentResponseDto
    res.status(201).json({
      id: student.id,
      name: student.name,
      email: student.email,
      age: student.age,
      createdAt: student.createdAt,
    });
  }
}
```

## Reglas importantes

- **Entrada**: Solo campos que el usuario puede enviar
- **Salida**: Solo campos que es seguro devolver
- **Validación**: Usar con middlewares de validación
- **Nombres claros**: `CreateStudentDto`, `UpdateStudentDto`, `StudentResponseDto`
