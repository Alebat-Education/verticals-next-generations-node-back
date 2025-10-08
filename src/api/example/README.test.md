# Tests

Los tests verifican que tu código funciona correctamente y no se rompe cuando cambias algo.

## Para qué sirve

- **Detectar errores**: Antes de que lleguen a producción
- **Confianza al cambiar**: Si cambias código, los tests te dicen si rompiste algo
- **Documentar código**: Los tests muestran cómo usar las funciones
- **Mejor calidad**: Código testeado es más confiable

## Tipos de tests

### Unit tests (pruebas unitarias)

Prueban funciones individuales en aislamiento.

```typescript
// __tests__/utils/validation.test.ts
import { isValidEmail } from '@utils/validation';

describe('isValidEmail', () => {
  it('debe retornar true para emails válidos', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
  });

  it('debe retornar false para emails inválidos', () => {
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});
```

### Integration tests (pruebas de integración)

Prueban cómo funcionan múltiples partes juntas.

```typescript
// __tests__/services/StudentsService.test.ts
import { StudentsService } from '@services/StudentsService';

describe('StudentsService', () => {
  let service: StudentsService;

  beforeEach(() => {
    service = new StudentsService();
  });

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
```

## Cómo ejecutar tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (se ejecutan automáticamente al cambiar archivos)
npm run test:watch

# Ejecutar tests con coverage (reporte de qué porcentaje del código está testeado)
npm run test:coverage
```

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
