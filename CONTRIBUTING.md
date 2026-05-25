# Contributing to IRON TRACK

Gracias por tu interés en contribuir. Seguí este flujo para mantener la calidad y consistencia del proyecto.

---

## Flujo de trabajo (GitHub Flow)

No se hace push directo a `main`. Todo cambio pasa por una Pull Request.

### 1. Crear una rama desde `main`

```bash
git checkout main
git pull origin main
git checkout -b <tipo>/<descripcion-corta>
```

**Tipos de rama:**

- `feature/` — nueva funcionalidad
- `fix/` — corrección de un bug
- `refactor/` — mejora de código sin cambiar comportamiento
- `style/` — cambios de formato, CSS, sin lógica
- `docs/` — documentación
- `chore/` — tareas de mantenimiento (deps, configs)
- `test/` — agregar o modificar tests

Ejemplos:

```bash
git checkout -b feature/add-auth-page
git checkout -b fix/button-responsive-padding
git checkout -b refactor/api-types
git checkout -b docs/readme-update
```

### 2. Commits con Conventional Commits

Cada commit debe seguir el formato:

```
<tipo>(<scope>): <descripcion>
```

**Tipos permitidos:**

| Tipo       | Uso                                                           |
| ---------- | ------------------------------------------------------------- |
| `feat`     | Nueva funcionalidad                                           |
| `fix`      | Corrección de un bug                                          |
| `refactor` | Cambio de código que no altera comportamiento                 |
| `style`    | Cambios de formato, CSS, espacios, sin lógica de negocio      |
| `docs`     | Cambios en documentación                                      |
| `chore`    | Tareas de mantenimiento (dependencias, configuraciones, etc.) |
| `test`     | Agregar o modificar tests                                     |
| `perf`     | Mejora de rendimiento                                         |
| `build`    | Cambios que afectan el build o dependencias externas          |
| `ci`       | Cambios en archivos de CI/CD                                  |
| `revert`   | Revertir un commit anterior                                   |

**Scope (obligatorio):**

Debe ser una palabra en minúscula que indique el área afectada:

- `ui` — componentes visuales
- `page` — páginas de Astro
- `style` — estilos globales, Tailwind
- `api` — endpoints o lógica de datos
- `config` — configuraciones del proyecto
- `deps` — dependencias
- `readme`, `docs` — documentación
- `vercel` — configuración de deploy

Ejemplos de commits válidos:

```
feat(ui): add Card component with glass effect
fix(page): reduce mobile paddings in design-system index
refactor(style): move btn-primary classes into Button component
style(page): adjust hero font sizes for mobile
chore(config): add commitlint and husky hooks
docs(readme): add installation instructions
```

Reglas:

- El `scope` no puede estar vacío.
- La descripción no puede estar vacía.
- No puede terminar con punto.
- Máximo 100 caracteres en la línea completa.

> **Nota:** La convención es una guía de estilo. No hay hooks que la obliguen, pero se recomienda seguirla para mantener el historial limpio.

### 3. Subir la rama y abrir Pull Request

```bash
git push -u origin <rama>
```

Luego abrí una Pull Request en GitHub hacia `main`.

**Título del PR:** usá el mismo formato que los commits.

```
feat(ui): add Button component with href support
```

**Descripción del PR:**

- Explicá qué cambió y por qué.
- Si hay un diseño o issue relacionado, mencionalo.
- Marcá si hay breaking changes.

### 4. Merge

- El merge solo se hace cuando el build pasa (local y en Vercel preview).
- Preferentemente usá **"Squash and merge"** para mantener `main` limpia.
- Borrá la rama después del merge.

---

## Hooks locales (Husky)

El proyecto usa Husky para correr validaciones antes de cada commit.

- **`pre-commit`** — corre `lint-staged` (format + lint fix en archivos staged).

Si un commit falla, revisá el error en la consola, corregí y volvé a intentar.

---

## Deploy con Vercel

### Configuración

El archivo `vercel.json` en la raíz define la configuración de build del proyecto:

- **Framework:** Astro
- **Output directory:** `dist`
- **Build command:** `npm run build`

### Rama de producción

Vercel usa automáticamente la rama default del repositorio (`main`) como **Production Branch**. No es necesario configurar nada extra en el dashboard.

### Flujo de deploy

| Acción                     | Resultado                        |
| -------------------------- | -------------------------------- |
| Push a `main`              | Deploy de producción automático  |
| Push a cualquier otra rama | Preview deployment con URL única |
| Merge de PR a `main`       | Deploy de producción automático  |

### Deploy manual desde consola

Si querés deployar manualmente (por ejemplo, para preview de una rama local):

```bash
# Deploy preview de la rama actual
npx vercel

# Deploy a producción (solo desde main)
npx vercel --prod
```

> **Recomendación:** no hagas `npx vercel --prod` desde una rama que no sea `main`. El flujo correcto es mergear a `main` y dejar que Vercel deploye solo.

---

## Estructura de ramas

```
main
  ├── feature/login-page
  ├── feature/responsive-paddings
  ├── fix/button-types
  ├── refactor/ui-components
  └── docs/contributing
```

Nunca pushees directamente a `main`. Siempre usá Pull Requests.

---

## Preguntas frecuentes

**¿Puedo saltear los hooks de Husky?**

El único hook activo es `pre-commit`, que corre `lint-staged` (format + lint fix). Si necesitás forzar un commit de emergencia, podés usar `--no-verify`, pero preferentemente corregí los errores de lint primero.

**¿Qué hago si el build falla en Vercel?**

Corré `npm run build` localmente, arreglá los errores, commiteá y pusheá de nuevo.

**¿Necesito crear issues antes de cada PR?**

Para cambios grandes o features nuevas, sí. Para fixes menores o refactors pequeños, no es obligatorio.
