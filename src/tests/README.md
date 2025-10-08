# Tests

Configuración y organización de tests para todo el proyecto.

## Estructura de tests

### 🔸 Tests dentro de `api/` (tests de módulo)

```
api/
├── students/
│   ├── Student.ts
│   ├── StudentsController.ts
│   ├── StudentsService.ts
│   ├── studentsRoutes.ts
│   └── studentsController.test.ts    # Tests específicos del módulo
├── products/
│   ├── Product.ts
│   ├── ProductsController.ts
│   └── productsController.test.ts
└── users/
    ├── User.ts
    ├── UsersController.ts
    └── usersController.test.ts
```

### 🔸 Tests generales (src/tests/)

```
tests/
├── integration/             # Tests entre múltiples módulos
│   ├── students-products.test.ts
│   └── users-auth.test.ts
├── e2e/                    # Tests end-to-end
│   ├── auth-flow.test.ts
│   └── complete-user-flow.test.ts
├── helpers/                # Utilities para tests
│   ├── testData.ts
│   └── mockDatabase.ts
├── setup.ts               # Configuración global de tests
└── teardown.ts           # Limpieza después de tests
```

## Diferencias entre tipos de tests

| Tipo                  | Ubicación                | Propósito                            | Ejemplo                       |
| --------------------- | ------------------------ | ------------------------------------ | ----------------------------- |
| **Unit Tests**        | `api/{module}/`          | Testear una función/clase específica | `StudentsController.create()` |
| **Integration Tests** | `src/tests/integration/` | Testear interacción entre módulos    | Students + Products           |
| **E2E Tests**         | `src/tests/e2e/`         | Testear flujos completos de usuario  | Registro → Login → Compra     |

## Configuración global

### setup.ts

```typescript
// src/tests/setup.ts
import { AppDataSource } from '@config/database';
import { beforeAll, afterAll } from 'vitest';

beforeAll(async () => {
  // Conectar a base de datos de test
  await AppDataSource.initialize();

  // Limpiar datos previos
  await AppDataSource.synchronize(true);
});

afterAll(async () => {
  // Cerrar conexión
  await AppDataSource.destroy();
});
```

### Helpers de test

```typescript
// src/tests/helpers/testData.ts
export const mockStudentData = {
  name: 'Juan Test',
  email: 'juan@test.com',
  age: 20,
};

export const mockProductData = {
  name: 'Curso TypeScript',
  price: 99.99,
  description: 'Curso completo de TypeScript',
};
```

## Comandos de test

```bash
# Todos los tests
npm run test

# Solo tests de un módulo
npm run test api/students

# Solo tests de integración
npm run test src/tests/integration

# Solo tests E2E
npm run test src/tests/e2e

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## Buenas prácticas

### ✅ Hacer

- Tests de unidad en cada módulo de API
- Tests de integración para flujos entre módulos
- Tests E2E para flujos críticos de usuario
- Mockear dependencias externas
- Usar datos de test consistentes

### ❌ Evitar

- Tests que dependen de datos reales de producción
- Tests que modifican estado global sin limpiarlo
- Tests que requieren servicios externos
- Tests extremadamente lentos en unit tests

## Estructura recomendada por archivo

```typescript
// api/students/studentsController.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { StudentsController } from './StudentsController';

describe('StudentsController', () => {
  let controller: StudentsController;

  beforeEach(() => {
    controller = new StudentsController();
  });

  describe('create', () => {
    it('debe crear un estudiante con datos válidos', async () => {
      // Arrange
      const studentData = { name: 'Juan', email: 'juan@test.com' };

      // Act
      const result = await controller.create(studentData);

      // Assert
      expect(result.name).toBe('Juan');
      expect(result.email).toBe('juan@test.com');
    });

    it('debe lanzar error con datos inválidos', async () => {
      // Arrange
      const invalidData = { name: '', email: 'invalid' };

      // Act & Assert
      await expect(controller.create(invalidData)).rejects.toThrow();
    });
  });
});
```
