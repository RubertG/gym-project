# Workflow: Corrección de Errores (Bug Fix)

> Este playbook guía al agente principal en el ciclo completo de corrección de un bug en IRON TRACK.
> Todo el código, commits, documentación y comunicación con el usuario debe ser en **español**, salvo términos técnicos estándar (handler, repository, service, controller, etc.).

---

## 0. Preámbulo Obligatorio

Antes de iniciar cualquier paso:

1. Leer `harness/AGENTS.md` completo.
2. Si el bug pertenece a un módulo específico, leer `planning/modules/module-XX/AGENTS.md`.
3. Verificar que las skills propias estén activas (`iron-track-architecture-guardian`, `iron-track-design-guardian`).

---

## 1. Investigación (Rol: Investigador)

### Objetivo

Comprender el bug, su contexto y su alcance antes de proponer una solución.

### Pasos

1.1. **Recopilar evidencia.**

- Solicitar al usuario logs, stack traces, mensajes de error o pasos de reproducción.
- Si hay screenshots o videos, analizarlos.

    1.2. **Reproducir el bug.**

- Seguir los pasos de reproducción exactos.
- Confirmar si el bug es consistente o intermitente.
- Identificar entorno (dev, staging, producción) y navegador/sistema operativo si aplica.

    1.3. **Buscar en el codebase.**

- Usar `grep` para buscar el mensaje de error, la función fallida o el componente afectado.
- Usar `grep` para buscar patrones similares en otros módulos (¿el mismo error existe en otra parte?).
- Revisar `git log` reciente del archivo afectado para identificar cambios recientes que puedan haberlo introducido.

    1.4. **Identificar el módulo afectado.** Determinar a qué `module-XX` pertenece el bug para organizar la documentación.

    1.5. **Documentar hallazgos.** Crear y escribir el archivo:

```
planning/modules/module-XX/refresh/<bug-name>/investigation.md
```

Contenido mínimo:

```markdown
# Investigación de Bug: <Nombre del Bug>

## Síntoma

Descripción clara de lo que falla.

## Evidencia

- Logs / stack trace (copiar texto relevante).
- Pasos de reproducción exactos.

## Análisis Preliminar

Qué crees que está pasando.

## Archivos Sospechosos

- path/to/file1.ts
- path/to/file2.tsx

## Notas

Observaciones adicionales.
```

---

## 2. Hipótesis y Prueba

### Objetivo

Identificar la causa raíz con certeza, no con suposiciones.

### Pasos

2.1. **Formular hipótesis.** Proponer 1-3 hipótesis de causa raíz basadas en la investigación.

2.2. **Verificar hipótesis.**

- Si es lógica de negocio: revisar el Service correspondiente.
- Si es acceso a datos: revisar el Repository y la query.
- Si es UI: revisar el componente React y el flujo de estado.
- Usar logs adicionales (`console.log` temporales) o breakpoints si es posible.

    2.3. **Confirmar causa raíz.** Documentar cuál hipótesis fue validada y por qué.

---

## 3. Planificación

### Objetivo

Definir el fix más pequeño y seguro posible. Evitar over-engineering.

### Pasos

3.1. **Generar plan mínimo.** Crear o actualizar en la misma carpeta del bug:

```
planning/modules/module-XX/refresh/<bug-name>/plan.md
```

Estructura:

```markdown
# Plan de Fix: <Nombre del Bug>

## Causa Raíz

Descripción precisa de por qué ocurre el bug.

## Archivos a Modificar

- path/to/file1.ts (cambio X)
- path/to/file2.ts (cambio Y)

## Fix Propuesto

Descripción técnica del cambio. Sin código todavía, solo la idea.

## Verificación

- Cómo confirmar que el bug se resuelve.
- Tests relevantes a ejecutar.

## Riesgo de Regresión

- ¿Qué otras partes del sistema podrían verse afectadas?
- ¿Se necesita validar algún flujo adicional?
```

3.2. **Priorizar fix mínimo viable.** La solución debe resolver el bug sin reescribir módulos enteros.

---

## 4. Implementación (Rol: Implementador)

### Objetivo

Aplicar el fix de forma quirúrgica y segura.

### Pasos

4.1. **Aplicar el fix.** Modificar únicamente los archivos identificados en el plan.

4.2. **Validar tipo de fix según capa:**

- Si toca Models: verificar que no se rompen interfaces usadas por Repositories o Services.
- Si toca Repositories: verificar que Services y Controllers siguen compilando.
- Si toca Services: verificar que Controllers y componentes clientes no se ven afectados.
- Si toca UI: verificar que no hay props rotas ni estado inconsistente.

    4.3. **Evitar regresiones.** No introducir cambios de comportamiento en funciones no relacionadas.

---

## 5. Verificación

### Objetivo

Confirmar que el bug está muerto y que no se mató nada más.

### Pasos

5.1. **Verificar que el bug se resuelve.**

- Repetir los pasos de reproducción exactos.
- Confirmar que el comportamiento esperado ahora ocurre.

    5.2. **Verificar que no hay regresiones.**

- Ejecutar `npm run typecheck` en todo el proyecto.
- Ejecutar `npm run lint`.
- Si hay tests: ejecutar los tests del módulo afectado y los tests globales.
- Revisar visualmente (si aplica) que componentes cercanos no se rompieron.

    5.3. **Revisar capas adyacentes.** Si el fix fue en un Service, revisar que los Controllers que lo usan siguen funcionando. Si fue en un Repository, revisar que otros Services que lo consumen no se ven afectados.

---

## 6. Entrega

### Objetivo

Cerrar el ciclo de forma documentada y comunicada.

### Pasos

6.1. **Documentar el fix.** Crear un archivo en:

```
harness/changes/
```

Nombre: `YYYY-MM-DD-fix-<bug-name>.md`
Contenido mínimo:

```markdown
# Fix: <Nombre del Bug>

## Fecha

YYYY-MM-DD

## Descripción

Resumen del error y la corrección aplicada.

## Causa Raíz

Explicación técnica de por qué ocurría.

## Archivos Modificados

- path/to/file1.ts
- path/to/file2.ts

## Verificación

- Pasos de reproducción ejecutados: OK / FAIL
- Regresiones detectadas: Sí / No
- Tests pasan: Sí / No
```

6.2. **Commit.** Si el usuario lo autoriza:

```bash
git add .
git commit -m "fix(<modulo>): corrige <descripción corta del bug>"
```

Mensaje en español, formato convencional.

6.3. **Reportar al usuario.** Mensaje estructurado:

- Descripción del bug corregido.
- Causa raíz encontrada.
- Archivos modificados.
- Resultado de verificación (sin regresiones / con observaciones).
- Próximos pasos si aplica.

---

## Checklist Final del Workflow

- [ ] `harness/AGENTS.md` leído.
- [ ] Bug reproducido y documentado en `investigation.md`.
- [ ] Causa raíz identificada y validada.
- [ ] Plan mínimo generado.
- [ ] Fix aplicado sin tocar archivos innecesarios.
- [ ] Bug verificado como resuelto.
- [ ] Sin regresiones detectadas (`npm run lint`, `npm run typecheck`, tests).
- [ ] Cambio registrado en `harness/changes/`.
- [ ] Usuario informado con resumen claro.
