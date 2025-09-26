## 🔗 Issue vinculado

<!-- Por favor asegúrate de que hay un issue abierto y menciona su número como - #123 -->

## 📋 Descripción

Breve descripción de los cambios realizados y el problema que resuelve.

## 📄✏️ Archivos modificados

<!-- Describe tus cambios en detalle -->

## 🔧 Tipo de Cambio

- [ ] 🐛 Bug fix (corrección que no rompe funcionalidad existente)
- [ ] ✨ Nueva feature (cambio que añade funcionalidad )
- [ ] 💥 Breaking change (corrección o feature que causaría que funcionalidad existente no funcione como se esperaba)
- [ ] 📚 Documentación (actualización de documentación)
- [ ] 🎪 Refactorización (acciones de boy scout)
- [ ] 🧪 Tests de integración o unitarios (verificando interacciones entre múltiples componentes o módulos)
- [ ] ⚙️ Configuración (actualizaciones o cambios a archivos de configuración, variables de entorno, o ajustes)

## 🧪 Testing

- [ ] Tests unitarios añadidos/actualizados
- [ ] Tests de integración añadidos/actualizados
- [ ] Todas las pruebas pasan localmente

## 📝 Checklist Backend

### TypeScript & Node.js

- [ ] Todos los tipos están definidos explícitamente
- [ ] Se usan path aliases (@controllers, @services, etc.)
- [ ] Sin magic strings/numbers (usar constantes de `/constants/`)

### Express.js & API

- [ ] Controladores solo manejan lógica HTTP
- [ ] Lógica de negocio está en servicios
- [ ] Middleware de validación implementado
- [ ] Códigos de estado HTTP apropiados
- [ ] Manejo de errores centralizado

### TypeORM & Base de Datos

- [ ] Se usa QueryBuilder/Repository (no SQL directo)
- [ ] Entidades con decoradores apropiados
- [ ] Relaciones definidas correctamente
- [ ] Transacciones implementadas donde corresponde

## 📎 Screenshots/Logs

<!-- Si aplica, incluir capturas o logs relevantes -->
