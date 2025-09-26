# Migrations

Las migraciones manejan los cambios en el esquema de la base de datos de forma controlada.

## Para qué sirve

- **Control de versiones**: Cada cambio en la DB tiene su migración
- **Sincronización**: Todos los entornos tienen la misma estructura
- **Rollback**: Puedes deshacer cambios si algo sale mal

## Cómo funciona

### Generar migración

```bash
npm run migration:generate -- --name CreateStudentTable
```

### Ejecutar migraciones

```bash
npm run migration:run
```

### Revertir migración

```bash
npm run migration:revert
```

## Estructura de migración

```typescript
// src/migrations/1234567890-CreateStudentTable.ts
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateStudentTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'students',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '150',
            isUnique: true,
          },
          {
            name: 'age',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('students');
  }
}
```

## Reglas importantes

- **Nunca edites** una migración ya ejecutada en producción
- **Siempre incluye down()** para poder hacer rollback
- **Ejecuta en orden** - las migraciones se ejecutan por timestamp
- **Revisa antes de ejecutar** - especialmente en producción
