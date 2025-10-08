# Configuration

Configuración de la aplicación, base de datos y variables de entorno.

## Para qué sirve

- Conectar a la base de datos
- Configurar TypeORM
- Centralizar configuraciones
- Manejar variables de entorno

## Cómo se hace

```typescript
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Student } from '@api/students/models/Student';
import { Professor } from '@api/professors/models/Professor';
import { Course } from '@api/courses/models/Course';

if (!process.env.DB_USER || !process.env.DB_NAME) {
  throw new Error('Missing DB_USER or DB_NAME in environment (.env not loaded or variables absent)');
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
