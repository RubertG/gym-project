# Workflow: Desarrollo de Nuevas Funcionalidades

> Este playbook guía al agente principal en el ciclo completo de desarrollo de una feature en IRON TRACK.
> Todo el código, commits, documentación y comunicación con el usuario debe ser en **español**, salvo términos técnicos estándar (handler, repository, service, controller, etc.).

---

## 0. Preámbulo Obligatorio

Antes de iniciar cualquier paso:

1. Leer `harness/AGENTS.md` completo.
2. Si trabajas sobre un módulo específico, leer `planning/modules/module-XX/AGENTS.md`.
3. Verificar que las skills propias estén activas (`iron-track-architecture-guardian`, `iron-track-design-guardian`).

---

## 1. Investigación (Rol: Investigador)

### Objetivo
Recopilar contexto suficiente antes de planificar para evitar decisiones a ciegas.

### Pasos

1.1. **Analizar la solicitud del usuario.** Identificar el módulo afectado (`module-XX`) y el nombre de la feature.

1.2. **Buscar patrones existentes.** Usar `grep` y `glob` para encontrar código similar en el codebase (ej. si es un CRUD de rutinas, buscar cómo se hizo el CRUD de ejercicios).

1.3. **Leer skills de terceros instaladas.** Si aplica (ej. `react-best-practices`), cargar la skill con la herramienta `skill` y aplicar sus reglas.

1.4. **Revisar arquitectura de capas.** Confirmar que la feature encaja en el flujo:
```
Controllers (API Routes) → Services → Repositories → Models
```

1.5. **Revisar el Design System.** Verificar paleta, tipografía, border radius, sombras y componentes base en `harness/AGENTS.md` Sección 4.

1.6. **Documentar hallazgos.** Crear y escribir el archivo:
```
planning/modules/module-XX/features/<feature-name>/investigation.md
```
Contenido mínimo:
- Resumen de la feature.
- Patrones existentes relevantes encontrados (paths exactos).
- Decisiones técnicas preliminares.
- Riesgos identificados.

---

## 2. Planificación (Rol: Planificador)

### Objetivo
Generar un plan detallado, atómico y verificable. No escribir código todavía.

### Pasos

2.1. **Leer requerimientos.** Consultar el módulo correspondiente en `planning/modules/module-XX/` para entender alcance y dependencias.

2.2. **Generar `plan.md`.** Crear el archivo:
```
planning/modules/module-XX/features/<feature-name>/plan.md
```

Estructura obligatoria de `plan.md`:

```markdown
# Plan: <Nombre de la Feature>

## Alcance
Breve descripción de qué hace y qué NO hace la feature.

## Requerimientos del Módulo
Referencia a los requerimientos originales (si existen en AGENTS.md del módulo).

## Tareas Atómicas
Para cada tarea, incluir:
- ID (ej. T1, T2…)
- Descripción clara
- Archivos a crear/modificar (paths exactos desde la raíz del proyecto)
- Snippet de código completo o pseudocódigo detallado
- Comando de verificación (ej. `npm run typecheck`, `npm run lint`, test específico)

### T1: Modelo de Dominio
...

### T2: Repository
...

### T3: Service
...

### T4: API Route (Controller)
...

### T5: Componente UI
...

### T6: Integración y Verificación
...

## Riesgos y Mitigaciones
- Riesgo X → Mitigación Y

## Dependencias
- Requiere módulo Y completado
- Requiere tabla Z en Supabase

## Notas de Diseño
- Alineación con Voltage Industrial
- Componentes base reutilizados
```

2.3. **Checkpoint humano.** Antes de ejecutar cualquier código, presentar el `plan.md` al usuario y pedir confirmación explícita:
> "He preparado el plan completo en `planning/modules/module-XX/features/<feature-name>/plan.md`. ¿Procedo con la implementación?"

---

## 3. Implementación (Rol: Implementador)

### Objetivo
Ejecutar el plan paso a paso, marcando progreso y deteniéndose ante cualquier bloqueo.

### Pasos

3.1. **Leer `plan.md`.** Cargar el documento generado en el paso anterior.

3.2. **Cargar prompt del Implementador.** Leer `harness/prompts/implementer.md` para adoptar el rol y reglas de implementación.

3.3. **Ejecutar tareas una por una.** En orden de dependencias (models → repositories → services → controllers → components).

3.4. **Marcar estado en `TodoWrite`.** Actualizar cada tarea en el planning como:
- `[in_progress]` mientras se trabaja.
- `[completed]` una vez verificada.
- `[blocked]` si aparece un impedimento.

3.5. **Si BLOCKED:**
- Detener la ejecución inmediatamente.
- No improvisar soluciones que rompan el plan.
- Reportar al usuario: descripción del bloqueo, tarea afectada, y posibles caminos.

3.6. **Verificación intermedia.** Tras cada capa crítica (models, repositories, services, controllers), ejecutar `npm run typecheck` para validar integridad de tipos.

---

## 4. Revisión de Spec (Rol: Spec Reviewer)

### Objetivo
Verificar que lo implementado cumple exactamente con lo planificado.

### Pasos

4.1. **Cargar prompt.** Leer `harness/prompts/spec-reviewer.md`.

4.2. **Validar requerimientos.** Revisar cada requerimiento del `plan.md` y marcar si está cumplido o no.

4.3. **Verificar comportamiento.** Si la feature tiene API Routes, validar endpoints con requests de prueba (usar `curl`, `Invoke-RestMethod` o tests manuales). Si tiene UI, revisar flujo de interacción.

4.4. **Decisión:**
- **PASS:** Continuar al paso 5.
- **FAIL:** Documentar discrepancias. El Implementador corrige y se repite el paso 4 hasta PASS.

---

## 5. Revisión de Calidad (Rol: Code Quality Reviewer)

### Objetivo
Garantizar que el código es robusto, idiomático y alineado con el proyecto.

### Pasos

5.1. **Cargar prompt.** Leer `harness/prompts/code-quality-reviewer.md`.

5.2. **Verificaciones obligatorias:**
- Arquitectura de capas respetada (controllers → services → repositories → models).
- Design System Voltage Industrial aplicado (colores, tipografía, border radius, sin sombras).
- Nombres correctos (PascalCase componentes, camelCase funciones, kebab-case archivos no componente).
- Todos los archivos `.ts` / `.tsx` en strict mode, tipado explícito.
- No hay `var`. `const` por defecto; `let` solo si reasignación es necesaria.
- Uso de `async/await` sobre promises crudos.
- No hay Server Actions; mutaciones pasan por API Routes (`src/pages/api/*`).
- No hay hard deletes (soft deletes obligatorios en datos de usuario).
- Mobile first en componentes UI.

5.3. **Decisión:**
- **PASS:** Continuar al paso 6.
- **FAIL:** Documentar problemas. El Implementador corrige y se repite el paso 5 hasta PASS.

---

## 6. Entrega

### Objetivo
Cerrar el ciclo de forma limpia, documentada y comunicada.

### Pasos

6.1. **Ejecutar verificaciones finales.**
```bash
npm run lint
npm run typecheck
```
Si hay tests disponibles:
```bash
npm test
```
Corregir cualquier error antes de continuar.

6.2. **Registrar el cambio.** Crear un archivo en:
```
harness/changes/
```
Nombre: `YYYY-MM-DD-<feature-name>.md`
Contenido mínimo:
```markdown
# Cambio: <Nombre de la Feature>

## Fecha
YYYY-MM-DD

## Descripción
Resumen de lo implementado.

## Archivos Modificados/Creados
- path/to/file1.ts
- path/to/file2.tsx

## Estado
Completado / En revisión / Parcial

## Notas
Cualquier consideración para el futuro.
```

6.3. **Commit.** Si el usuario lo autoriza:
```bash
git add .
git commit -m "feat(<modulo>): <descripción corta de la feature>"
```
Mensaje en español, formato convencional.

6.4. **Reportar al usuario.** Mensaje estructurado:
- Resumen de lo hecho.
- Lista de archivos modificados/creados.
- Estado final (completado / con pendientes).
- Próximos pasos sugeridos (si aplica).

---

## Checklist Final del Workflow

- [ ] `harness/AGENTS.md` leído.
- [ ] `investigation.md` creado y completo.
- [ ] `plan.md` creado, confirmado por usuario.
- [ ] Tareas implementadas una por una.
- [ ] Revisión de Spec: PASS.
- [ ] Revisión de Calidad: PASS.
- [ ] `npm run lint` y `npm run typecheck` pasan.
- [ ] Cambio registrado en `harness/changes/`.
- [ ] Usuario informado con resumen claro.
