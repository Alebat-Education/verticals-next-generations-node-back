## 🔗 Issue vinculado

<!-- Por favor asegúrate de que hay un issue abierto y menciona su número como - #123 -->

## ❓ Tipo de cambio

<!-- ¿Qué tipos de cambios introduce tu código? Marca con una `x` todas las casillas que apliquen. -->

- [ ] 📖 Documentación (actualizaciones a la documentación, readme, o anotaciones JSdoc)
- [ ] 🐞 Corrección de bug (cambio que no rompe funcionalidad y arregla un problema)
- [ ] 🛡️ Seguridad (mejoras de seguridad, autenticación, autorización)
- [ ] ✨ Nueva funcionalidad (cambio que no rompe funcionalidad y añade características)
- [ ] 🗄️ Base de datos (migraciones, entidades, esquemas)
- [ ] 🚀 API Endpoint (nuevos endpoints o modificaciones a endpoints existentes)
- [ ] 🧹 Tareas de mantenimiento (actualizaciones al proceso de build o herramientas auxiliares)
- [ ] ⚠️ Cambio que rompe compatibilidad (arreglo o funcionalidad que causaría que funcionalidad existente cambie)
- [ ] 🎪 Refactorización (mejoras de código sin cambiar funcionalidad)
- [ ] 🧪 Tests (tests unitarios, de integración o end-to-end)
- [ ] 📈 Performance (optimizaciones de rendimiento)
- [ ] ⚙️ Configuración (actualizaciones o cambios a archivos de configuración, variables de entorno, o ajustes)

## 📚 Descripción

## 📄✏️ Archivos modificados

<!-- Describe tus cambios en detalle -->

## 🔍 Checklist de Autorevisión

<!-- Marca las casillas que correspondan antes de crear el PR -->

### Calidad de Código

- [ ] ✅ Eliminé todos los `console.log()` del código de producción (uso logger apropiado)
- [ ] ✅ No uso `var`, solo `const` o `let`
- [ ] ✅ No hay magic strings o magic numbers (uso constantes del directorio `/constants/`)
- [ ] ✅ Eliminé variables e imports no utilizados
- [ ] ✅ No hay comentarios `//` innecesarios (solo JSDoc `/** */`)
- [ ] ✅ Uso tipos TypeScript explícitos, evito `any`
- [ ] ✅ Uso imports ES6 (`import`), no `require()`

### Node.js/Express.js

- [ ] ✅ Uso path aliases (@controllers, @services, @models) en lugar de imports relativos largos
- [ ] ✅ Los controladores solo manejan lógica HTTP, delegan lógica de negocio a servicios
- [ ] ✅ Implemento manejo de errores apropiado con try/catch
- [ ] ✅ Uso códigos de estado HTTP correctos (200, 201, 400, 401, 404, 500)
- [ ] ✅ Implemento middleware de validación y autenticación cuando es necesario
- [ ] ✅ Las rutas están correctamente organizadas y agrupadas por recurso

### TypeORM/Base de Datos

- [ ] ✅ Las entidades tienen decoradores apropiados (@Entity, @Column, @PrimaryKey)
- [ ] ✅ Uso Repository pattern o QueryBuilder, evito queries SQL directas
- [ ] ✅ Implemento validaciones en entidades con decoradores
- [ ] ✅ Uso transacciones para operaciones críticas con manejo de rollback
- [ ] ✅ Implemento índices en campos consultados frecuentemente

### Arquitectura y SOLID

- [ ] ✅ Las funciones/clases tienen una sola responsabilidad (SRP)
- [ ] ✅ No hay código duplicado, refactorizo en servicios reutilizables
- [ ] ✅ Implemento inyección de dependencias apropiada
- [ ] ✅ Separo interfaces y tipos en archivos dedicados

### Seguridad

- [ ] ✅ No hay credenciales hardcodeadas (uso variables de entorno)
- [ ] ✅ Valido entrada de datos en todos los endpoints
- [ ] ✅ Implemento autenticación JWT cuando es necesario
- [ ] ✅ Configuro CORS apropiadamente para el entorno

### 🧪 Testing

<!-- Describe cómo probaste tus cambios -->

- [ ] ✅ Probé los endpoints con herramientas como Postman/Thunder Client
- [ ] ✅ Verifiqué las operaciones de base de datos en entorno de desarrollo
- [ ] ✅ Probé el manejo de errores con datos inválidos
- [ ] ✅ Tests unitarios y de integración pasan localmente

## � Pruebas de API

<!-- Si aplica, incluye ejemplos de requests/responses o capturas de herramientas como Postman -->

### Endpoints modificados/creados:

```
GET/POST/PUT/DELETE /api/endpoint
```

### Ejemplo de request:

```json
{
  "example": "request body"
}
```

### Ejemplo de response:

```json
{
  "example": "response body"
}
```

## 🚀 Notas de despliegue

<!-- Cualquier consideración especial para el despliegue, como:
- Ejecutar migraciones de base de datos: `pnpm run migration:run`
- Actualizar variables de entorno
- Configurar nuevos endpoints en el proxy/nginx
- Considerar actualizaciones de dependencias
- Hay que esperar a que el PR nº #123 esté mergeado -->

<!--
⚠️ IMPORTANTE: Este PR será revisado automáticamente por Copilot siguiendo nuestras reglas de código.
Asegúrate de haber completado el checklist de autorevisión para acelerar el proceso.
-->
