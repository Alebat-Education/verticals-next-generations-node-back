# Services

Contienen la lógica de negocio de la aplicación. Es donde están las operaciones complejas que no van en los controladores.

## Para qué sirve

- **Separar responsabilidades**: Los controladores manejan HTTP, los services manejan la lógica
- **Reutilizar código**: Un service puede ser usado por varios controladores
- **Operaciones complejas**: Validaciones avanzadas, cálculos, algoritmos
- **Mantener orden**: El código queda más organizado y testeable

## Cómo se hace

```typescript
// services/StudentsService.ts
import AppDataSource from '../db/database';
import { Student } from '../models/studentsModel';

export class StudentsService {
  private studentRepository = AppDataSource.getRepository(Student);

  // Buscar con validaciones de negocio
  async findById(id: number) {
    if (id <= 0) {
      throw new Error('ID must be positive');
    }

    const student = await this.studentRepository.findOneBy({ id });
    if (!student) {
      throw new Error('Student not found');
    }

    return student;
  }

  // Crear con validaciones complejas
  async create(data: any) {
    // Validar email único
    const existingStudent = await this.studentRepository.findOne({
      where: { email: data.email },
    });

    if (existingStudent) {
      throw new Error('Email already exists');
    }

    // Validar reglas de negocio
    if (data.age < 16 || data.age > 65) {
      throw new Error('Age must be between 16 and 65');
    }

    // Crear y guardar
    const student = this.studentRepository.create(data);
    return await student.save();
  }

  // Lógica de negocio compleja
  async calculateStats(studentId: number) {
    const student = await this.findById(studentId);
    const courses = await student.courses;

    // Cálculos complejos
    const totalGrades = courses.reduce((sum, course) => sum + course.grade, 0);
    const average = courses.length > 0 ? totalGrades / courses.length : 0;
    const status = average >= 70 ? 'Approved' : 'Needs improvement';

    return {
      studentName: student.name,
      totalCourses: courses.length,
      average: Math.round(average * 100) / 100,
      status,
    };
  }
}
```

## Uso en controladores

```typescript
import { StudentsService } from '../services/StudentsService';

class StudentsController {
  private studentsService = new StudentsService();

  async create(req: Request, res: Response) {
    try {
      // Controller: recibe HTTP, llama service, devuelve HTTP
      const student = await this.studentsService.create(req.body);
      res.status(201).send({ msg: 'Student created', student });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Service hace los cálculos complejos
      const stats = await this.studentsService.calculateStats(parseInt(id));
      res.status(200).send({ stats });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}
```

## La diferencia clave

**Controller (Capa HTTP):**

- Recibe requests
- Valida parámetros básicos
- Llama al service correcto
- Devuelve responses

**Service (Capa Lógica):**

- Validaciones complejas de negocio
- Cálculos y algoritmos
- Operaciones con múltiples tablas
- Reglas del dominio de la aplicación
