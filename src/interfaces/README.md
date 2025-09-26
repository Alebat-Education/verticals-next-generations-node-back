# Interfaces

Define qué forma deben tener los datos. Como un "molde" que dice: "esto debe tener un name, email y age".

## Regla simple

Si escribes la misma estructura 2+ veces → créale una interface

## Para qué sirve

- **TypeScript te avisa**: Si falta algo o está mal, error inmediato
- **Autocompletado**: El editor sabe qué propiedades existen
- **Menos errores**: No puedes poner un número donde va texto

## Cómo se hace

```typescript
// interfaces/Student.ts

// Para crear estudiante
interface CreateStudentData {
  name: string;
  email: string;
  age: number;
}

// Para respuestas
interface StudentResponse {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}
```

## Cómo usarlas

````

## Ejemplos comunes

```typescript
// Para requests
interface CreateStudentData {
  name: string;
  email: string;
  age: number;
}

interface UpdateStudentData {
  name?: string;
  email?: string;
  age?: number;
}

// Para responses
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// Para config
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
}
````
