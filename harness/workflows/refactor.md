# Workflow: Refactorización Controlada

> Este playbook guía al agente principal en refactorizaciones seguras y progresivas en IRON TRACK.
> Todo el código, commits, documentación y comunicación con el usuario debe ser en **español**, salvo términos técnicos estándar (handler, repository, service, controller, etc.).

---

## 0. Preámbulo Obligatorio

Antes de iniciar cualquier paso:

1. Leer `harness/AGENTS.md` completo.
2. Si el refactor afecta a un módulo específico, leer `planning/modules/module-XX/AGENTS.md`.
3. Verificar que las skills propias estén activas (`iron-track-architecture-guardian`, `iron-track-design-guardian`).

---

## 1. Análisis

### Objetivo
Comprender la deuda técnica y el código afectado antes de proponer cambios.

### Pasos

1.1. **Identificar deuda técnica.** Clarificar qué problema resuelve el refactor:
- Duplicación de código.
- Violación de capas (lógica de negocio en controller, queries en service, etc.).
- Nombres confusos o inconsistentes.
- Acoplamiento excesivo.
- Complejidad ciclomática alta.
- Falta de tipado o tipos incorrectos.

1.2. **Leer código afectado completo.**
- Usar `read` para cargar todos los archivos que serán tocados.
- Usar `grep` para encontrar todos los consumidores (imports, llamadas) de las funciones/clases a refactorizar.
- No hacer suposiciones sobre el alcance; confirmar con búsqueda real en el codebase.

1.3. **Identificar el módulo afectado.** Determinar a qué `module-XX` pertenece el refactor para organizar la documentación.

1.4. **Documentar motivo.** Crear y escribir el archivo:
```
planning/modules/module-XX/refactors/<nombre-refactor>/proposal.md
```
Contenido mínimo:
```markdown
# Propuesta de Refactor: <Nombre del Refactor>

## Motivación
¿Por qué es necesario este refactor? ¿Qué problema resuelve?

## Alcance
- Archivos a modificar.
- Archivos potencialmente afectados (consumidores).

## Deuda Técnica Identificada
Lista concreta de problemas encontrados.

## Objetivo del Refactor
Estado deseado después del refactor.

## Riesgos
- Posibles breaking changes.
- Dependencias con otros módulos.
```

---

## 2. Validación de Contrato

### Objetivo
Garantizar que el refactor no rompe la superficie pública del sistema, o documentar explícitamente los breaking changes.

### Pasos

2.1. **Listar interfaces públicas.** Para cada archivo a refactorizar, documentar:
- Funciones exportadas (signatures completas: nombres, parámetros, tipos de retorno).
- Clases exportadas y sus métodos públicos.
- Props de componentes React exportados.
- Endpoints de API Routes (URLs, métodos HTTP, shape de request/response).
- Tipos / interfaces exportadas desde `models/`.

2.2. **Confirmar inmutabilidad de contratos.**
- Si el refactor NO cambia contratos: marcar como "sin breaking changes".
- Si el refactor SÍ cambia contratos: documentar cada cambio en `proposal.md` bajo una sección `## Breaking Changes`.

2.3. **Plan de compatibilidad (si aplica).**
- Si hay breaking changes, definir si se aplican directamente o si se requiere un periodo de deprecación.
- Para APIs: considerar versionado o adaptadores.
- Para componentes: considerar props de transición.

---

## 3. Plan de Migración

### Objetivo
Descomponer el refactor en pasos pequeños, seguros y reversibles.

### Pasos

3.1. **Diseñar pasos atómicos.** El plan debe tener tareas pequeñas que se puedan verificar individualmente.

3.2. **Orden de migración obligatorio:**
```
Models → Repositories → Services → Controllers → Components
```
Refactorizar de adentro hacia afuera para que las capas externas siempre consuman contratos estables.

3.3. **Generar `plan.md`.** Crear el archivo:
```
planning/modules/module-XX/refactors/<nombre-refactor>/plan.md
```

Estructura:
```markdown
# Plan de Migración: <Nombre del Refactor>

## Etapas

### Etapa 1: Models
- Cambios en tipos/interfaces.
- Verificación: `npm run typecheck`.

### Etapa 2: Repositories
- Cambios en acceso a datos.
- Verificación: `npm run typecheck`.

### Etapa 3: Services
- Cambios en lógica de negocio.
- Verificación: `npm run typecheck`.

### Etapa 4: Controllers
- Cambios en API Routes.
- Verificación: endpoints funcionan.

### Etapa 5: Components
- Cambios en UI.
- Verificación: visual y de flujo.

## Checkpoints
- Tras cada etapa, ejecutar `npm run lint` y `npm run typecheck`.
- Si falla, corregir antes de pasar a la siguiente etapa.

## Rollback
- Cómo revertir si algo falla en producción.
```

3.4. **Checkpoint humano obligatorio.** Antes de ejecutar cualquier cambio, presentar el `plan.md` y la `proposal.md` al usuario:
> "He preparado la propuesta de refactor y el plan de migración en `planning/modules/module-XX/refactors/<nombre>/`. El refactor afecta a X archivos y tiene/sin breaking changes. ¿Procedo con la migración por etapas?"

---

## 4. Ejecución por Etapas (Rol: Implementador)

### Objetivo
Aplicar el refactor de forma progresiva, verificando en cada paso.

### Pasos

4.1. **Seguir el orden de capas.** Models → Repositories → Services → Controllers → Components.

4.2. **Ejecutar una etapa a la vez.** No mezclar cambios de múltiples capas en un solo paso.

4.3. **Verificar compilación y lint después de cada etapa.**
```bash
npm run typecheck
npm run lint
```
Si falla, corregir antes de continuar.

4.4. **No cambiar comportamiento externo.** El refactor debe ser transparente para los consumidores. Si un test existente falla por un cambio de comportamiento (y no por un ajuste de import), revisar el refactor.

4.5. **Documentar progreso.** Actualizar `plan.md` marcando etapas como `[completed]` o `[in_progress]`.

---

## 5. Verificación Post-Migración

### Objetivo
Confirmar que el sistema funciona igual (o mejor) después del refactor.

### Pasos

5.1. **Tests pasan.**
- Ejecutar `npm test` (si está disponible).
- Ejecutar tests específicos del módulo afectado.
- Si no hay tests, realizar validación manual de los flujos principales.

5.2. **No hay imports rotos.**
- Verificar que no existen imports a archivos eliminados o renombrados.
- `npm run typecheck` debe pasar limpio en todo el proyecto.

5.3. **Interfaces públicas intactas.**
- Revisar que todas las funciones exportadas siguen existiendo con las mismas signatures (salvo breaking changes documentados).
- Revisar que los endpoints de API Routes responden correctamente.

5.4. **Revisión de Calidad.**
- Cargar `harness/prompts/code-quality-reviewer.md` y validar que el refactorizado cumple con las reglas del proyecto.

---

## 6. Entrega

### Objetivo
Cerrar el ciclo de forma documentada y comunicada.

### Pasos

6.1. **Documentar en `harness/changes/`.** Crear archivo:
```
harness/changes/YYYY-MM-DD-refactor-<nombre-refactor>.md
```
Contenido:
```markdown
# Refactor: <Nombre del Refactor>

## Fecha
YYYY-MM-DD

## Motivación
Resumen de la deuda técnica resuelta.

## Archivos Modificados
- path/to/file1.ts
- path/to/file2.ts

## Estado
Completado / Con observaciones

## Breaking Changes
Sí / No. Si sí, listar cuáles.
```

6.2. **Documentar post-mortem.** Crear archivo:
```
planning/modules/module-XX/refactors/<nombre-refactor>/post-mortem.md
```
Contenido mínimo:
```markdown
# Post-mortem: <Nombre del Refactor>

## Qué se hizo
Resumen de las etapas ejecutadas.

## Qué funcionó bien
Lecciones positivas.

## Qué fue difícil
Obstáculos encontrados.

## Métricas (si aplica)
- Líneas de código cambiadas.
- Complejidad reducida.
- Tests añadidos.

## Lecciones aprendidas
Recomendaciones para futuros refactors.
```

6.3. **Commit.** Si el usuario lo autoriza:
```bash
git add .
git commit -m "refactor(<modulo>): <descripción corta del refactor>"
```
Mensaje en español, formato convencional.

6.4. **Reportar al usuario.** Mensaje estructurado:
- Resumen de la deuda técnica resuelta.
- Archivos refactorizados.
- Estado final (sin breaking changes / con cambios documentados).
- Recomendaciones para el futuro.

---

## Checklist Final del Workflow

- [ ] `harness/AGENTS.md` leído.
- [ ] `proposal.md` creado con motivación y alcance.
- [ ] Interfaces públicas listadas y validadas.
- [ ] `plan.md` creado con orden de capas y checkpoint humano confirmado.
- [ ] Refactor ejecutado etapa por etapa.
- [ ] `npm run typecheck` y `npm run lint` pasan tras cada etapa.
- [ ] Tests pasan / flujos manuales validados.
- [ ] No hay imports rotos.
- [ ] Interfaces públicas intactas (salvo breaking changes documentados).
- [ ] Cambio registrado en `harness/changes/`.
- [ ] `post-mortem.md` escrito.
- [ ] Usuario informado con resumen claro.
