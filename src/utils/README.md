# Utils

Son funciones pequeñas que resuelven problemas comunes y se pueden usar en cualquier parte del proyecto.

## Para qué sirve

- **Evitar repetir código**: En vez de escribir lo mismo 10 veces, lo haces una vez aquí
- **Funciones útiles**: Validar emails, formatear fechas, generar tokens, etc.
- **Código limpio**: Los controllers y services quedan más ordenados
- **Fácil de testear**: Son funciones simples que reciben algo y devuelven algo

## La diferencia

**Antes:** Copiar y pegar el mismo código de validación en 10 lugares diferentes

**Después:** Escribir la validación una vez en utils y usarla donde necesites

## Tipos de utils comunes

- **validation.ts**: `isValidEmail()`, `isValidAge()`, `cleanText()`
- **formatting.ts**: `capitalize()`, `formatDate()`, `shortText()`
- **generators.ts**: `generateCode()`, `generateId()`, `randomPassword()`

## Regla simple

Si estás escribiendo el mismo código más de 2 veces → mételo en utils

## Cómo se hace

### Ejemplo: Validaciones

```typescript
// utils/validation.ts

// Revisar si un email está bien escrito
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Revisar si una edad es válida (entre 16 y 65)
export const isValidAge = (age: number): boolean => {
  return age >= 16 && age <= 65;
};

// Limpiar texto peligroso
export const cleanText = (text: string): string => {
  return text.replace(/[<>\"'%;()&+]/g, '');
};
```

### Ejemplo: Formatear datos

```typescript
// utils/formatting.ts

// Convertir fecha fea en fecha bonita
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Primera letra en mayúscula
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Cortar texto largo
export const shortText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
```

### Ejemplo: Generar cosas

```typescript
// utils/generators.ts

// Crear un código random para verificación
export const generateCode = (): string => {
  return Math.random().toString().slice(2, 8); // 6 números
};

// Crear ID único
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString().slice(2, 8);
};
```

## Cómo usarlas

```typescript
// En StudentsService - usar las funciones
import { isValidEmail, isValidAge, cleanText } from '@utils/validation';
import { capitalize } from '@utils/formatting';

async create(data: any) {
  // Una línea limpia
  if (!isValidEmail(data.email)) {
    throw new Error('Email no válido');
  }

  if (!isValidAge(data.age)) {
    throw new Error('Edad debe estar entre 16 y 65');
  }

  // Limpiar y formatear
  const student = {
    name: capitalize(cleanText(data.name)),
    email: data.email.toLowerCase(),
    age: data.age
  };

  return await this.studentRepository.save(student);
}
```
