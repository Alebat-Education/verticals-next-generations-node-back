# Common - Clases Base del Proyecto

Contiene las clases abstractas base que todos los módulos heredan para operaciones CRUD estándar.

## 📁 Archivos

- **GlobalService.ts** - Servicio base con operaciones de base de datos
- **GlobalController.ts** - Controlador base con endpoints HTTP estándar

---

## 🔧 BaseService

Clase abstracta que proporciona métodos CRUD genéricos para TypeORM.

### Métodos heredados

- `findAll()` - Obtener todos los registros
- `findById()` - Buscar por ID
- `findBy()` - Buscar múltiples por condiciones
- `findOneBy()` - Buscar uno por condiciones
- `create()` - Crear nuevo registro
- `update()` - Actualizar existente
- `delete()` - Eliminar registro
- `exists()` - Verificar existencia por ID
- `count()` - Contar registros
- `existsBy()` - Verificar existencia por condiciones

### Cómo usar

```typescript
// api/products/ProductService.ts
import { BaseService } from '@common/GlobalService.js';
import { AppDataSource } from '@config/connection.js';
import { Product } from './productModel.js';

class ProductService extends BaseService<Product> {
  constructor() {
    if (!AppDataSource?.isInitialized) {
      throw new Error('DataSource not initialized');
    }
    super(AppDataSource.getRepository(Product));
  }

  // Agrega métodos específicos
  async findByCategory(category: string): Promise<Product[]> {
    return this.findBy({ category });
  }
}

export const productService = new ProductService();
```

---

## 🎮 BaseController

Clase abstracta que proporciona endpoints HTTP estándar.

### Endpoints heredados

- `GET /` - Obtener todos (findAll)
- `GET /:id` - Obtener uno (findOne)
- `POST /` - Crear (create)
- `PUT /:id` - Actualizar (update)
- `DELETE /:id` - Eliminar (delete)

### Cómo usar

```typescript
// api/products/productController.ts
import { BaseController } from '@common/GlobalController.js';
import { productService } from './ProductService.js';
import { MODELS_NAMES } from '@constants/common/models.js';

export class ProductController extends BaseController<Product> {
  constructor() {
    super(productService, MODELS_NAMES.PRODUCT);
  }

  // Agrega endpoints específicos
  async findByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category } = req.params;
      const products = await productService.findByCategory(category);
      res.status(HTTP_STATUS.OK).json({
        message: 'Products retrieved successfully',
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
```

### Rutas

```typescript
// api/products/ProductRoutes.ts
import { Router } from 'express';
import { productController } from './productController.js';

const router = Router();

// Rutas CRUD (heredadas)
router.get('/', productController.findAll.bind(productController));
router.get('/:id', productController.findOne.bind(productController));
router.post('/', productController.create.bind(productController));
router.put('/:id', productController.update.bind(productController));
router.delete('/:id', productController.delete.bind(productController));

// Rutas específicas
router.get('/category/:category', productController.findByCategory.bind(productController));

export default router;
```

---

## 📝 Notas Importantes

- Siempre validar `AppDataSource.isInitialized` en el constructor del service
- Usar `.bind(controller)` al asignar métodos a rutas
- Usar `next(error)` en controllers para manejo centralizado de errores
- Registrar todas las entidades en `constants/common/models.ts`

## 🎮 BaseController (GlobalController.ts)

Clase abstracta que proporciona endpoints HTTP estándar para operaciones CRUD.

### Para qué sirve

- ✅ **Endpoints CRUD automáticos**: GET, POST, PUT, DELETE sin escribir código
- ✅ **Validaciones incorporadas**: IDs, recursos no encontrados, errores
- ✅ **Respuestas consistentes**: Todas las respuestas usan el mismo formato
- ✅ **Error handling**: Manejo de errores centralizado con `next(error)`

### Endpoints disponibles

```typescript
export abstract class BaseController<T extends EntityWithId> {
  // GET / - Obtener todos los registros
  async findAll(req, res, next): Promise<void>;

  // GET /:id - Obtener un registro por ID
  async findOne(req, res, next): Promise<void>;

  // POST / - Crear nuevo registro
  async create(req, res, next): Promise<void>;

  // PUT /:id - Actualizar registro existente
  async update(req, res, next): Promise<void>;

  // DELETE /:id - Eliminar registro
  async delete(req, res, next): Promise<void>;
}
```

### Cómo se usa

#### 1. Crear un Controller que extienda BaseController

```typescript
// api/products/productController.ts
import { BaseController } from '@common/GlobalController.js';
import { productService } from './ProductService.js';
import { MODELS_NAMES } from '@constants/common/models.js';
import type { Product } from './productModel.js';

export class ProductController extends BaseController<Product> {
  constructor() {
    // Pasar el service y el nombre del recurso
    super(productService, MODELS_NAMES.PRODUCT);
  }

  // ✅ Ya tienes estos endpoints automáticamente:
  // GET /api/products         -> findAll()
  // GET /api/products/:id     -> findOne()
  // POST /api/products        -> create()
  // PUT /api/products/:id     -> update()
  // DELETE /api/products/:id  -> delete()

  // Agrega endpoints específicos aquí
  async findByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category } = req.params;
      const products = await productService.findByCategory(category);

      res.status(HTTP_STATUS.OK).json({
        message: `Products in category ${category} retrieved successfully`,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
```

#### 2. Definir las rutas

```typescript
// api/products/ProductRoutes.ts
import { Router } from 'express';
import { productController } from './productController.js';

const router = Router();

// Rutas base (heredadas automáticamente)
router.get('/', productController.findAll.bind(productController));
router.get('/:id', productController.findOne.bind(productController));
router.post('/', productController.create.bind(productController));
router.put('/:id', productController.update.bind(productController));
router.delete('/:id', productController.delete.bind(productController));

// Rutas específicas
router.get('/category/:category', productController.findByCategory.bind(productController));

export default router;
```

### Formato de respuestas

Todas las respuestas siguen el formato `ApiSuccessResponse`:

```typescript
{
  "message": "Products retrieved successfully",
  "data": [...] | {...}
}
```

### Validaciones incluidas

- ✅ **ID válido**: Verifica que el ID sea numérico y positivo
- ✅ **Recurso existe**: Retorna 404 si el recurso no existe
- ✅ **Error handling**: Todos los errores se pasan a `next(error)` para el middleware global

### Ventajas

- ✅ **5 endpoints gratis** - Solo extiendes y ya tienes CRUD completo
- ✅ **Respuestas consistentes** - Mismo formato en toda la API
- ✅ **Validaciones automáticas** - IDs y recursos validados
- ✅ **Error handling robusto** - Errores manejados correctamente

---

## 🚀 Ejemplo Completo de Módulo

### 1. Model (Entity)

```typescript
// api/students/studentModel.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 2. Service

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
}

export const studentService = new StudentService();
```

### 3. Controller

```typescript
// api/students/studentController.ts
import { BaseController } from '@common/GlobalController.js';
import { studentService } from './StudentService.js';
import { MODELS_NAMES } from '@constants/common/models.js';
import type { Student } from './studentModel.js';

export class StudentController extends BaseController<Student> {
  constructor() {
    super(studentService, MODELS_NAMES.STUDENT);
  }

  // Endpoints específicos
  async findByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.params;
      const student = await studentService.findByEmail(email);

      if (!student) {
        throw new NotFoundError(`Student with email ${email} not found`);
      }

      res.status(HTTP_STATUS.OK).json({
        message: 'Student retrieved successfully',
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const studentController = new StudentController();
```

### 4. Routes

```typescript
// api/students/StudentRoutes.ts
import { Router } from 'express';
import { studentController } from './studentController.js';

const router = Router();

// CRUD básico (heredado)
router.get('/', studentController.findAll.bind(studentController));
router.get('/:id', studentController.findOne.bind(studentController));
router.post('/', studentController.create.bind(studentController));
router.put('/:id', studentController.update.bind(studentController));
router.delete('/:id', studentController.delete.bind(studentController));

// Endpoints específicos
router.get('/email/:email', studentController.findByEmail.bind(studentController));

export default router;
```

### 5. Registrar en constants/common/models.ts

```typescript
// constants/common/models.ts
import { Student } from '@/api/students/studentModel.js';

export const EXPORTED_MODELS = [
  Student,
  // ... otros modelos
] as const;

export const MODELS_NAMES = {
  STUDENT: 'Student',
  // ... otros nombres
} as const;
```

---

## ✅ Mejores Prácticas

### ❌ NO hacer esto

```typescript
// ❌ No crear servicios sin extender BaseService
class ProductService {
  async findAll() {
    // Repitiendo código que ya existe en BaseService
    return AppDataSource.getRepository(Product).find();
  }
}

// ❌ No crear controllers sin extender BaseController
class ProductController {
  async getAll(req, res) {
    // Repitiendo lógica de validación y respuestas
    const products = await productService.findAll();
    res.json({ data: products });
  }
}
```

### ✅ SÍ hacer esto

```typescript
// ✅ Extender BaseService
class ProductService extends BaseService<Product> {
  constructor() {
    super(AppDataSource.getRepository(Product));
  }
  // Solo agrega métodos específicos
}

// ✅ Extender BaseController
class ProductController extends BaseController<Product> {
  constructor() {
    super(productService, MODELS_NAMES.PRODUCT);
  }
  // Solo agrega endpoints específicos
}
```

---

## 🔗 Referencias

- **TypeORM**: https://typeorm.io/
- **Express.js**: https://expressjs.com/
- **TypeScript Generics**: https://www.typescriptlang.org/docs/handbook/2/generics.html
- **SOLID Principles**: https://medium.com/@cramirez92/s-o-l-i-d-los-5-principios-que-te-ayudar%C3%A1n-a-desarrollar-software-de-calidad-8a5b9a39e8d9

---

## 📝 Notas Importantes

1. **EntityWithId**: Todas las entidades deben tener una propiedad `id` (number o string)
2. **DataSource**: Siempre verificar que `AppDataSource.isInitialized` sea true
3. **Error Handling**: Usar `next(error)` en controllers para manejo centralizado
4. **Binding**: Usar `.bind(controller)` al asignar métodos a rutas
5. **Extensión .js**: Todos los imports deben incluir `.js` para ES Modules
