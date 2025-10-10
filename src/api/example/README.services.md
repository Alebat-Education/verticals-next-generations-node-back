# Services

Contienen la lógica de negocio. **Todos los services deben extender `BaseService`** para heredar operaciones CRUD.

## Para qué sirve

- Separar responsabilidades (Controllers = HTTP, Services = lógica)
- Reutilizar código en múltiples controllers
- Validaciones de negocio, cálculos y algoritmos complejos
- Operaciones con base de datos

## Arquitectura

**BaseService** proporciona 10+ métodos CRUD listos: `findAll`, `findById`, `findBy`, `findOneBy`, `create`, `update`, `delete`, `exists`, `count`, `existsBy`.

## Cómo se hace

```typescript
// api/students/StudentService.ts
import { BaseService } from '@common/GlobalService.js';
import { AppDataSource } from '@config/connection.js';
import { Student } from './studentModel.js';

class StudentService extends BaseService<Student> {
  constructor() {
    if (!AppDataSource?.isInitialized) {
      throw new Error('DataSource not initialized');
    }
    super(AppDataSource.getRepository(Student));
  }

  // Métodos específicos del dominio
  async findByEmail(email: string): Promise<Student | null> {
    return this.findOneBy({ email });
  }

  async findActiveStudents(): Promise<Student[]> {
    return this.findBy({ isActive: true });
  }

  async createWithValidation(data: Partial<Student>): Promise<Student> {
    // Validaciones de negocio
    const existing = await this.findByEmail(data.email!);
    if (existing) {
      throw new ValidationError('Email already exists');
    }

    if (data.age && (data.age < 16 || data.age > 65)) {
      throw new ValidationError('Age must be between 16 and 65');
    }

    return this.create(data);
  }
}

export const studentService = new StudentService();
```

## Uso en Controllers

```typescript
// Solo llamar métodos del service
const student = await studentService.findById(1);
const students = await studentService.findActiveStudents();
const newStudent = await studentService.createWithValidation(data);
```

## Diferencia Clave: Controller vs Service

**Controller (HTTP)**

- Recibe requests y devuelve responses
- Valida parámetros básicos de entrada
- Llama a métodos del service
- Maneja errores con `next(error)`

**Service (Lógica de Negocio)**

- Validaciones complejas de negocio
- Operaciones con base de datos
- Cálculos y transformaciones
- Queries complejas con QueryBuilder

## Tipos de Métodos en Services

1. **Consultas**: `findByEmail()`, `findActiveStudents()`
2. **Validaciones**: `validateEmailUnique()`, `validateAge()`
3. **Operaciones**: `createWithValidation()`, `deactivateStudent()`
4. **Cálculos**: `calculateStats()`, `generateReport()`

## Mejores Prácticas

✅ **SÍ hacer**

- Extender `BaseService<T>`
- Validar `AppDataSource.isInitialized` en constructor
- Validaciones de negocio en el service
- Exportar instancia única del service

❌ **NO hacer**

- Crear services sin extender BaseService
- Validaciones de negocio en el controller
- Operaciones directas en controllers
- Queries complejas en controllers
