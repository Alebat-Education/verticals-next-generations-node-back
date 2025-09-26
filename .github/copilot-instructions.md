# Copilot Instructions - Revisión de Pull Requests Backend API

## Configuración de Respuestas

- **Idioma**: Responder SIEMPRE en español
- **Ubicación**: Todos los comentarios DEBEN aparecer en la pestaña `Files Changed`
- **Formato**: Incluir los dos botones de implementación automática para cada sugerencia
- **Referencias**: Proporcionar enlaces a documentación oficial cuando sea aplicable
- **Severidad**: Clasificar cada issue como `🚨 Crítico`, `⚠️ Importante` o `💡 Sugerencia`

## Stack Tecnológico del Proyecto

- **Runtime**: Node.js con ES Modules
- **Lenguaje**: TypeScript estricto
- **Framework**: Express.js
- **Base de datos**: MySQL + TypeORM
- **Herramientas**: tsx, pnpm, ESLint, Prettier
- **Arquitectura**: API REST con path mapping aliases
- **Seguridad**: JWT, CORS, Rate Limiting
- **Logging**: Morgan + custom loggers

## Reglas Críticas - Revisión Obligatoria

### Node.js y TypeScript

#### 🚨 Prohibido (Error crítico)

- `var` - Usar `const` o `let` exclusivamente
- `console.log()` - Usar logger apropiado (Morgan, Winston) o eliminar en producción
- Comentarios `//` - Solo permitidos si son JSDoc (`/** */`)
- **Magic Strings/Numbers** - Usar constantes del directorio `/constants/` o enums
- **Violaciones SOLID** - Detectar y reportar problemas de principios SOLID
- **any como tipo** - Usar tipos específicos o unknown/generic cuando sea apropiado
- **require()** - Usar import ES6 exclusivamente
- **Imports relativos largos** - Usar path aliases (@controllers, @services, etc.)

#### ⚠️ Mejoras obligatorias

- **Código duplicado**: Identificar y refactorizar en servicios reutilizables
- **Variables no utilizadas**: Eliminar imports y variables sin uso
- **Legibilidad**: Simplificar expresiones complejas y mejorar nombres de variables
- **Tipos TypeScript**: Agregar tipos explícitos en Request, Response, interfaces
- **Principios SOLID**: Verificar Single Responsibility, Open/Closed, Dependency Inversion
- **Constantes**: Extraer valores hardcodeados a `/constants/` con nombres descriptivos
- **Servicios**: Mover lógica de negocio de controladores a servicios
- **Error Handling**: Implementar manejo de errores consistente con try/catch
- **Async/Await**: Preferir sobre Promises .then()

#### 💡 Sugerencias de mejora

- **Performance**: Implementar paginación en consultas grandes
- **Caching**: Considerar cache para consultas frecuentes
- **Type guards**: Usar para validación de entrada y mejor inferencia

### Express.js y API REST

#### 🚨 Prohibido (Error crítico)

- **Rutas sin middleware de validación** - Validar entrada de datos siempre
- **Credenciales hardcodeadas** - Usar variables de entorno exclusivamente
- **SQL queries directas** - Usar TypeORM para todas las consultas
- **Endpoints sin autenticación** - Verificar JWT cuando sea necesario
- **Responses sin status codes** - Siempre especificar códigos HTTP apropiados

#### ⚠️ Mejoras obligatorias

- **Controladores**: Separar lógica HTTP de lógica de negocio
- **Middlewares**: Implementar validación, autenticación, y logging apropiados
- **Error Handling**: Usar middleware de manejo de errores centralizado
- **Tipos Request/Response**: Definir interfaces para req.body, res.json()
- **Status Codes**: Usar constantes para códigos HTTP (200, 201, 400, 401, 500)
- **Validación**: Implementar validación de esquemas de entrada
- **Rate Limiting**: Aplicar límites de velocidad en endpoints públicos
- **CORS**: Configurar CORS apropiadamente para el entorno

#### 💡 Sugerencias de mejora

- **API Documentation**: Considerar Swagger/OpenAPI para documentación
- **Paginación**: Implementar paginación consistente en endpoints de listado
- **Filtros**: Permitir filtrado y ordenamiento en consultas

### TypeORM y Base de Datos

#### 🚨 Prohibido (Error crítico)

- **Raw SQL queries** - Usar QueryBuilder o Repository patterns
- **Entidades sin decoradores** - Usar @Entity, @Column, @PrimaryKey apropiadamente
- **Migraciones manuales** - Generar migraciones con TypeORM CLI
- **Conexiones sin pooling** - Configurar connection pooling apropiado
- **Transactions sin manejo de errores** - Siempre hacer rollback en catch

#### ⚠️ Mejoras obligatorias

- **Entidades**: Definir relaciones (@OneToMany, @ManyToOne) correctamente
- **Índices**: Agregar índices en campos consultados frecuentemente
- **Validaciones**: Usar decoradores de validación en entidades
- **Repository Pattern**: Usar repositories customizados para lógica compleja
- **Query Optimization**: Usar eager/lazy loading apropiadamente
- **Transactions**: Implementar transacciones para operaciones críticas
- **Error Handling**: Manejar errores específicos de base de datos

#### 💡 Sugerencias de mejora

- **Query Caching**: Considerar cache de queries frecuentes
- **Soft Delete**: Implementar borrado lógico cuando sea apropiado
- **Audit Fields**: Agregar created_at, updated_at, deleted_at

## Patrones Específicos del Proyecto

### Estructura de Archivos

- **Controladores**: Ubicar en `/src/controllers/` con sufijo `Controller`
- **Servicios**: Ubicar en `/src/services/` con sufijo `Service`
- **Modelos**: Ubicar en `/src/models/` para entidades TypeORM
- **Rutas**: Ubicar en `/src/routes/` agrupadas por recurso
- **Middlewares**: Ubicar en `/src/middleware/` con propósito específico
- **Interfaces**: Ubicar en `/src/interfaces/` con tipos relacionados agrupados
- **Constantes**: Agrupar en `/src/constants/` por categoría funcional
- **Utilidades**: Ubicar en `/src/utils/` funciones helper reutilizables

### Path Mapping Pattern

#### 🚨 Verificaciones obligatorias

- **Imports**: Usar aliases (@controllers, @services, @models, etc.)
- **Consistencia**: No mezclar imports relativos con aliases
- **Organización**: Agrupar imports: externos primero, luego internos
- **Types**: Usar `import type` para tipos TypeScript

### Controladores Pattern

#### 🚨 Verificaciones obligatorias

- **Naming**: Sufijo `Controller` + PascalCase (ej: `UserController`)
- **Responsabilidades**: Solo lógica HTTP, delegar lógica de negocio a servicios
- **Error Handling**: Implementar try/catch y responses apropiados
- **Status Codes**: Usar códigos HTTP correctos (200, 201, 400, 401, 404, 500)

### Servicios Pattern

#### � Verificaciones obligatorias

- **Naming**: Sufijo `Service` + PascalCase (ej: `UserService`)
- **Responsabilidades**: Lógica de negocio, validaciones, operaciones complejas
- **Dependencies**: Inyección de dependencias apropiada
- **Error Handling**: Lanzar errores específicos que controladores puedan manejar

## Ejemplos de Correcciones

### ❌ Incorrecto - Controlador con lógica de negocio

```typescript
// controllers/UserController.ts
export class UserController {
  async create(req: Request, res: Response) {
    const { email, password } = req.body;
    
    // ❌ Validación en controlador
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    
    // ❌ Lógica de hash en controlador
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // ❌ Operación directa de base de datos
    const user = await User.create({ email, password: hashedPassword });
    res.json(user);
  }
}
```

### ✅ Correcto - Controlador delegando a servicio

```typescript
// controllers/UserController.ts
import type { Request, Response } from 'express';
import { UserService } from '@services/UserService';

export class UserController {
  constructor(private userService: UserService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json({ 
        message: 'User created successfully',
        user 
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
```

### ❌ Incorrecto - Imports relativos y sin tipos

```typescript
import express from 'express';
import { UserController } from '../controllers/UserController';
import { validateUser } from '../../middleware/validation';
```

### ✅ Correcto - Imports con aliases y tipos

```typescript
import express from 'express';
import type { Request, Response } from 'express';
import { UserController } from '@controllers/UserController';
import { validateUser } from '@middleware/validation';
```

### ❌ Incorrecto - Magic Strings

```javascript
if (user.role === 'admin') {
  window.location.href = '/dashboard'
}
```

### ✅ Correcto - Constantes

```javascript
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
} as const;

const ROUTES = {
  DASHBOARD: '/dashboard'
} as const;

if (user.role === USER_ROLES.ADMIN) {
  window.location.href = ROUTES.DASHBOARD;
}
```

### ❌ Incorrecto - Violación SOLID (SRP)

```javascript
class UserService {
  saveUser(user) {
    // Lógica de validación
    // Lógica de guardado
    // Lógica de envío de email
    // Lógica de logging
  }
}
```

### ✅ Correcto - Principio de Responsabilidad Única

```javascript
class UserService {
  constructor(
    private validator: UserValidator,
    private repository: UserRepository,
    private emailService: EmailService,
    private logger: Logger
  ) {}

  async saveUser(user: User): Promise<void> {
    this.validator.validate(user);
    await this.repository.save(user);
    await this.emailService.sendWelcomeEmail(user);
    this.logger.log(`User ${user.id} saved successfully`);
  }
}
```

### ❌ Incorrecto - Entidad TypeORM sin validaciones

```typescript
// models/User.ts
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string; // ❌ Sin validaciones

  @Column()
  password: string; // ❌ Sin restricciones
}
```

### ✅ Correcto - Entidad con validaciones apropiadas

```typescript
// models/User.ts
import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false 
  })
  email: string;

  @Column({ 
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false // ❌ No exponer password en selects
  })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### ❌ Incorrecto - Query SQL directo

```typescript
// ❌ SQL directo en servicio
async findUsersByRole(role: string) {
  return await this.connection.query(
    'SELECT * FROM users WHERE role = ?', 
    [role]
  );
}
```

### ✅ Correcto - TypeORM QueryBuilder

```typescript
// ✅ TypeORM QueryBuilder
async findUsersByRole(role: UserRole): Promise<User[]> {
  return await this.userRepository
    .createQueryBuilder('user')
    .where('user.role = :role', { role })
    .select(['user.id', 'user.email', 'user.name']) // Campos específicos
    .getMany();
}
```

## Instrucciones Específicas para Copilot

1. Revisar CADA archivo modificado sin excepción
2. Reportar TODOS los problemas encontrados, no solo los críticos
3. Proporcionar código corregido completo, no solo la línea problemática
4. Incluir explicación breve del por qué del cambio
5. Verificar que no se introduzcan nuevos problemas al corregir
6. **Magic Strings/Numbers**: Detectar y reportar cualquier string o número hardcodeado
7. **Análisis SOLID**: Evaluar si las funciones/clases cumplen los principios SOLID
8. **BEM en SCSS**: Verificar que todas las clases CSS sigan la nomenclatura BEM
9. **Dependencias**: Revisar que las dependencias estén correctamente inyectadas

## Detección Prioritaria

- **Nivel 1 (Crítico)**: Magic strings, violaciones var/console.log, SVG inline
- **Nivel 2 (Importante)**: Violaciones SOLID, nomenclatura no-BEM, imports innecesarios
- **Nivel 3 (Mejora)**: Legibilidad, organización, optimizaciones

## Enlaces de Referencia

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [TypeORM Documentation](https://typeorm.io/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [REST API Design Guidelines](https://github.com/microsoft/api-guidelines)
- [Principios SOLID en JavaScript](https://medium.com/@cramirez92/s-o-l-i-d-los-5-principios-que-te-ayudar%C3%A1n-a-desarrollar-software-de-calidad-8a5b9a39e8d9)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
