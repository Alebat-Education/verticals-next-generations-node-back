# Types

Define tipos de datos personalizados. Como interfaces pero para cosas más específicas y reutilizables.

## Diferencia con Interfaces

**Interface**: Para objetos con propiedades

```typescript
interface StudentData {
  name: string;
  age: number;
}
```

**Type**: Para uniones, alias y cosas específicas

```typescript
type UserRole = 'admin' | 'student';
type ID = string | number;
```

## Regla simple

- **Interface** → objetos con propiedades
- **Type** → uniones, alias, tipos específicos

## Para qué sirve

- **Tipos específicos**: `UserRole` en vez de `string`
- **Reutilizar tipos**: Los usas en varias partes
- **Uniones de tipos**: `'admin' | 'student'` en vez de cualquier string

## Cómo se hace

```typescript
// types/User.ts

// Tipo para roles específicos
export type UserRole = 'admin' | 'student' | 'professor';

// Tipo para status
export type StudentStatus = 'active' | 'inactive' | 'suspended';

// Tipo que combina otros
export type CreateUserData = {
  name: string;
  email: string;
  role: UserRole;
  status: StudentStatus;
};
```
