# Guía de Contribución

¡Gracias por tu interés en contribuir al proyecto Verticals Next Generations Backend! 🎉

## 🚀 Cómo Contribuir

### 1. Preparar el entorno

1. **Fork** el repositorio
2. **Clona** tu fork localmente:
   ```bash
   git clone https://github.com/tu-usuario/verticals-next-generations-node-back.git
   cd verticals-next-generations-node-back
   ```
3. **Instala** las dependencias:
   ```bash
   pnpm install
   ```
4. **Configura** las variables de entorno:
   ```bash
   cp .env.example .env
   # Edita el archivo .env con tus configuraciones
   ```

### 2. Crear una nueva funcionalidad

1. **Crea una rama** para tu feature:
   ```bash
   git checkout -b feature/nombre-de-la-funcionalidad
   ```
2. **Desarrolla** tu funcionalidad
3. **Sigue** las convenciones del proyecto (ver más abajo)
4. **Prueba** tu código localmente

### 3. Antes de enviar tu PR

1. **Ejecuta el linter**:

   ```bash
   pnpm lint
   pnpm lint:fix  # Para arreglar automáticamente
   ```

2. **Formatea el código**:

   ```bash
   pnpm format
   ```

3. **Compila el proyecto**:

   ```bash
   pnpm build
   ```

4. **Verifica que funcione**:
   ```bash
   pnpm dev
   ```

### 4. Enviar Pull Request

1. **Commit** tus cambios:

   ```bash
   git add .
   git commit -m "feat: descripción clara de tu funcionalidad"
   ```

2. **Push** a tu fork:

   ```bash
   git push origin feature/nombre-de-la-funcionalidad
   ```

3. **Crea un Pull Request** desde GitHub

## 📝 Convenciones de Código

### Estructura de archivos

- Usa las carpetas existentes según su propósito
- Nombra archivos en camelCase: `userController.ts`
- Usa aliases para importaciones: `@controllers/userController`

### TypeScript

- **Siempre** usa tipos explícitos
- **Prefiere** interfaces sobre types cuando sea posible
- **Usa** el modificador `async/await` en lugar de Promises
- **Evita** `any`, usa tipos específicos

```typescript
// ✅ Correcto
interface User {
  id: number;
  name: string;
  email: string;
}

async function createUser(userData: User): Promise<User> {
  // implementación
}

// ❌ Incorrecto
function createUser(userData: any) {
  // implementación
}
```

### Importaciones

- **Usa** aliases configurados
- **Agrupa** importaciones: librerías externas primero, luego internas
- **Usa** `import type` para tipos TypeScript

```typescript
// ✅ Correcto
import express from 'express';
import type { Request, Response } from 'express';

import { CONFIG } from '@config/index';
import type { User } from '@interfaces/User';
import { UserService } from '@services/UserService';

// ❌ Incorrecto
import { UserService } from '../../services/UserService';
import express from 'express';
import { CONFIG } from '../config/index';
```

### Nomenclatura

- **Variables y funciones**: camelCase (`userName`, `getUserById`)
- **Clases e interfaces**: PascalCase (`UserController`, `DatabaseConfig`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)
- **Archivos**: camelCase (`userController.ts`, `databaseConfig.ts`)

### Controladores

```typescript
class UserController {
  private userService = new UserService();

  async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json({ message: 'Usuario creado', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

### Servicios

```typescript
export class UserService {
  async create(userData: CreateUserDto): Promise<User> {
    // Validaciones de negocio
    if (!userData.email) {
      throw new Error('Email es requerido');
    }

    // Lógica de creación
    return await this.userRepository.create(userData);
  }
}
```

## 🧪 Testing (Próximamente)

Cuando se implemente el sistema de testing:

- Escribe tests para nuevas funcionalidades
- Mantén cobertura de código alta
- Usa nombres descriptivos para los tests
- Agrupa tests relacionados con `describe`

## 📋 Checklist para PR

Antes de enviar tu Pull Request, verifica:

- [ ] El código sigue las convenciones del proyecto
- [ ] Se agregaron tipos TypeScript apropiados
- [ ] Se usan los aliases de importación
- [ ] El linter pasa sin errores (`pnpm lint`)
- [ ] El código está formateado (`pnpm format`)
- [ ] El proyecto compila sin errores (`pnpm build`)
- [ ] Los cambios están bien documentados
- [ ] Se actualizó la documentación si es necesario

## 🐛 Reportar Bugs

Para reportar un bug:

1. **Verifica** que no haya un issue similar ya creado
2. **Usa** la plantilla de bug report
3. **Incluye** información detallada:
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Versión de Node.js y pnpm
   - Logs relevantes

## 💡 Sugerir Funcionalidades

Para sugerir una nueva funcionalidad:

1. **Abre** un issue con la etiqueta "enhancement"
2. **Describe** claramente la funcionalidad
3. **Explica** por qué sería útil
4. **Proporciona** ejemplos de uso si es posible

## 📞 Contacto

Si tienes preguntas sobre cómo contribuir:

- **Abre** un issue con tus preguntas
- **Revisa** la documentación existente
- **Consulta** los issues cerrados por si ya se respondió

---

¡Gracias por ayudar a mejorar el proyecto! 🙏
