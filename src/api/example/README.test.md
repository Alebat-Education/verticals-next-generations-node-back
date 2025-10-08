# Tests

Los tests verifican que tu código funciona correctamente y no se rompe cuando cambias algo.

## Estructura de tests en el proyecto

### Tests dentro de `api/` (tests de módulo)

```
api/example/
├── Student.ts
├── StudentsController.ts
├── StudentsService.ts
├── studentsRoutes.ts
└── studentsController.test.ts    # Tests específicos del módulo
```

### Tests fuera de `api/` (tests generales)

```
src/
├── api/                     # Módulos de la API
├── tests/                   # Tests generales del proyecto
│   ├── integration/         # Tests de integración
│   ├── e2e/                # Tests end-to-end
│   ├── setup.ts            # Configuración de tests
│   └── helpers/            # Helpers para tests
├── utils/
└── config/
```

## Diferencias entre tipos de tests

### 🔸 Tests dentro de `api/`

- **Propósito**: Testear funcionalidad específica del módulo
- **Alcance**: Un solo módulo (students, products, users)
- **Ejemplos**:
  - `studentsController.test.ts` - Tests del controlador
  - `studentsService.test.ts` - Tests del service
  - `Student.test.ts` - Tests del model

### 🔸 Tests en `src/tests/`

- **Propósito**: Tests que abarcan múltiples módulos o la app completa
- **Alcance**: Integración, E2E, configuración general
- **Ejemplos**:
  - Tests de integración entre módulos
  - Tests E2E de flujos completos
  - Tests de configuración de base de datos
  - Tests de middleware globales

## Para qué sirve

- **Detectar errores**: Antes de que lleguen a producción
- **Confianza al cambiar**: Si cambias código, los tests te dicen si rompiste algo
- **Documentar código**: Los tests muestran cómo usar las funciones
- **Mejor calidad**: Código testeado es más confiable

## Tipos de tests

### Unit tests (dentro de cada módulo)

Prueban funciones individuales en aislamiento.

```typescript
// api/example/studentsController.test.ts
import { StudentsController } from './StudentsController';
import { StudentsService } from './StudentsService';

describe('StudentsController', () => {
  it('debe crear un estudiante correctamente', async () => {
    const mockData = { name: 'Juan', email: 'juan@test.com', age: 20 };
    const result = await StudentsController.create(mockData);
    expect(result.name).toBe('Juan');
  });

  it('debe lanzar error con datos inválidos', async () => {
    const invalidData = { name: '', email: 'invalid' };
    await expect(StudentsController.create(invalidData)).rejects.toThrow();
  });
});
```

### Integration tests (en src/tests/)

Prueban cómo funcionan múltiples módulos juntos.

```typescript
// src/tests/integration/students-products.test.ts
import { StudentsService } from '@api/students/StudentsService';
import { ProductsService } from '@api/products/ProductsService';
```

### Integration tests (pruebas de integración)

Prueban cómo funcionan múltiples partes juntas.

```typescript
// __tests__/services/StudentsService.test.ts
import { StudentsService } from '@api/example/services/StudentsService';

describe('Students-Products Integration', () => {
  it('debe asignar productos a estudiantes', async () => {
    const student = await StudentsService.create({ name: 'Ana' });
    const product = await ProductsService.create({ name: 'Curso TypeScript' });

    const assignment = await StudentsService.assignProduct(student.id, product.id);
    expect(assignment).toBeDefined();
  });
});
```

### E2E tests (en src/tests/)

Prueban flujos completos de la aplicación.

```typescript
// src/tests/e2e/students-flow.test.ts
import request from 'supertest';
import { app } from '@/app';

describe('Students Flow E2E', () => {
  it('debe crear, consultar y eliminar un estudiante', async () => {
    // Crear estudiante
    const createResponse = await request(app).post('/api/students').send({ name: 'Pedro', email: 'pedro@test.com' });

    expect(createResponse.status).toBe(201);

    // Consultar estudiante
    const getResponse = await request(app).get(`/api/students/${createResponse.body.data.id}`);

    expect(getResponse.body.data.name).toBe('Pedro');

    // Eliminar estudiante
    const deleteResponse = await request(app).delete(`/api/students/${createResponse.body.data.id}`);

    expect(deleteResponse.status).toBe(204);
  });
});
```

## Configuración de tests

### Para tests de módulo (dentro de api/)

```typescript
// api/example/studentsController.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
// o jest si usas jest
```

### Para tests generales (src/tests/)

```typescript
// src/tests/setup.ts
import { AppDataSource } from '@config/database';

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});
```

it('debe crear estudiante correctamente', async () => {
const studentData = {
name: 'Juan Pérez',
email: 'juan@example.com',
age: 20,
};

    const result = await service.create(studentData);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe(studentData.name);
    expect(result.email).toBe(studentData.email);

});
});

````

## Cómo ejecutar tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (se ejecutan automáticamente al cambiar archivos)
npm run test:watch

# Ejecutar tests con coverage (reporte de qué porcentaje del código está testeado)
npm run test:coverage
````

## Estructura recomendada

```
__tests__/
├── unit/                    # Tests unitarios
│   ├── utils/
│   │   ├── validation.test.ts
│   │   └── formatting.test.ts
│   └── constants/
│       └── httpStatus.test.ts
├── integration/             # Tests de integración
│   ├── services/
│   │   └── StudentsService.test.ts
│   └── routes/
│       └── students.test.ts
└── setup/                   # Configuración de tests
    ├── test-setup.ts
    └── database.ts
```

## Reglas básicas

- **1 test por funcionalidad**: Cada test verifica una cosa específica
- **Tests independientes**: Un test no debe depender de otro
- **Nombres descriptivos**: `it('debe retornar error si email ya existe')`
- **Arrange, Act, Assert**: Prepara datos → Ejecuta función → Verifica resultado
