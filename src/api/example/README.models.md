# Models

Los modelos definen la estructura de datos y representan las entidades de la base de datos usando TypeORM.

## Estructura de archivos

```
api/example/
├── Student.ts              # Este archivo - Entity/Model
├── StudentsController.ts   # Controlador
├── StudentsService.ts      # Lógica de negocio
└── studentsRoutes.ts       # Rutas
```

## Para qué sirve

- Definir estructura de tablas en base de datos
- Mapear datos entre TypeScript y MySQL
- Establecer relaciones entre entidades
- Validar datos antes de guardar

## Estructura

Cada modelo debería:

- Usar decoradores de TypeORM
- Definir relaciones apropiadas
- Incluir validaciones
- Tener tipos TypeScript correctos

## Ejemplo de Model con TypeORM

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  password?: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  age?: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: ['admin', 'user', 'moderator'],
    default: 'user',
  })
  role: 'admin' | 'user' | 'moderator';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relación One-to-Many: Un usuario puede tener muchos posts
  @OneToMany(() => Post, post => post.author)
  posts: Post[];
}

@Entity('posts')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  content: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relación Many-to-One: Muchos posts pertenecen a un usuario
  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: number;
}

@Entity('categories')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  slug: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## Decoradores principales

### Decoradores de Entity

- `@Entity('table_name')` - Define la tabla
- `@PrimaryGeneratedColumn()` - ID auto-incremental
- `@Column()` - Columna de la tabla

### Decoradores de Column

```typescript
@Column({
  type: 'varchar',      // Tipo de datos
  length: 100,          // Longitud
  nullable: false,      // Permite null
  unique: true,         // Valor único
  default: 'value',     // Valor por defecto
  name: 'column_name'   // Nombre personalizado
})
```

### Decoradores de relación

- `@OneToOne()` - Relación uno a uno
- `@OneToMany()` - Relación uno a muchos
- `@ManyToOne()` - Relación muchos a uno
- `@ManyToMany()` - Relación muchos a muchos
- `@JoinColumn()` - Especifica la columna de unión

### Decoradores de timestamp

- `@CreateDateColumn()` - Fecha de creación automática
- `@UpdateDateColumn()` - Fecha de actualización automática

## Tipos de datos comunes

```typescript
// Texto
@Column('varchar', { length: 100 })
@Column('text')
@Column('longtext')

// Números
@Column('int')
@Column('bigint')
@Column('decimal', { precision: 10, scale: 2 })
@Column('float')

// Booleanos
@Column('boolean')

// Fechas
@Column('date')
@Column('datetime')
@Column('timestamp')

// JSON
@Column('json')

// Enums
@Column({
  type: 'enum',
  enum: ['value1', 'value2']
})
```
