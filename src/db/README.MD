# Database Configuration

Configuración de la base de datos y conexión con TypeORM.

## Para qué sirve

- Conectar a la base de datos
- Configurar TypeORM
- Definir entidades
- Manejar conexiones

## Cómo se hace

```typescript
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Student } from '../models/studentsModel';
import { Professor } from '../models/professorsModel';
import { Course } from '../models/courseModel';

if (!process.env.DB_USER || !process.env.DB_NAME) {
  throw new Error(
    'Missing DB_USER or DB_NAME in environment (.env not loaded or variables absent)',
  );
}

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [Student, Professor, Course],
  migrations: [],
  subscribers: [],
});

export default AppDataSource;
```
