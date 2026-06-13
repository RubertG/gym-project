# IRON TRACK - Stack Tecnológico

## Lista Completa de Tecnologías y Versiones

| Tecnología                         | Versión                     | Ámbito                               |
| ---------------------------------- | --------------------------- | ------------------------------------ |
| Astro                              | `^6.3.7`                    | Framework principal                  |
| React                              | `^19.2.6`                   | Interactividad (islas)               |
| React DOM                          | `^19.2.6`                   | Renderizado React                    |
| Tailwind CSS                       | `^4.3.0`                    | Estilos                              |
| @tailwindcss/vite                  | `^4.3.0`                    | Integración Tailwind + Vite          |
| TypeScript                         | `6.0.3` (bundled con Astro) | Tipado estricto                      |
| @astrojs/react                     | `^5.0.5`                    | Adapter React para Astro             |
| @types/react                       | `^19.2.15`                  | Tipos React                          |
| @types/react-dom                   | `^19.2.3`                   | Tipos React DOM                      |
| Zustand                            | `^5.0.13`                   | Estado global (workout activo)       |
| date-fns                           | `^4.3.0`                    | Manipulación de fechas               |
| recharts                           | `^3.8.1`                    | Gráficos de progreso                 |
| browser-image-compression          | `^2.0.2`                    | Compresión de imágenes en cliente    |
| lucide-react                       | `^1.16.0`                   | Iconos                               |
| @aws-sdk/client-s3                 | `^3.1053.0`                 | Cliente S3 para Cloudflare R2        |
| Prettier                           | `^3.8.3`                    | Formateo de código                   |
| prettier-plugin-astro              | `^0.14.1`                   | Soporte Astro para Prettier          |
| prettier-plugin-tailwindcss        | `^0.8.0`                    | Orden de clases Tailwind en Prettier |
| ESLint                             | `^10.4.0`                   | Linting                              |
| @typescript-eslint/eslint-plugin   | `^8.59.4`                   | Reglas TypeScript para ESLint        |
| @typescript-eslint/parser          | `^8.59.4`                   | Parser TypeScript para ESLint        |
| eslint-plugin-astro                | `^1.7.0`                    | Reglas Astro para ESLint             |
| eslint-plugin-react-hooks          | `^7.1.1`                    | Reglas React Hooks para ESLint       |
| Husky                              | `^9.1.7`                    | Git hooks                            |
| lint-staged                        | `^17.0.5`                   | Linting en archivos staged           |
| Supabase (`@supabase/supabase-js`) | _Pendiente de instalación_  | Auth, Base de datos, RLS             |
| Vitest                             | _No instalado (Fase 4)_     | Testing unitario                     |

> **Nota sobre Supabase:** El cliente de Supabase (`@supabase/supabase-js`) aún no está en `package.json`. Se instalará y configurará en la fase de implementación del módulo **Auth**.

## Justificación de Cada Elección

- **Astro (`^6.3.7`)**: Elegido por su arquitectura de islas, que permite entregar HTML estático por defecto e hidratar solo los componentes interactivos necesarios (como el dashboard y los formularios de entrenamiento). Ofrece un rendimiento excepcional y una experiencia híbrida SSR/SSG perfecta para una app con landing pública y dashboard privado.
- **React (`^19.2.6`)**: Utilizado exclusivamente en las "islas" interactivas del dashboard, el constructor de rutinas y el tracker de workouts en tiempo real. No se usa para páginas estáticas como la landing.
- **Tailwind CSS (`^4.3.0`)**: Permite un desarrollo rápido de UI con utility classes, un sistema de design tokens personalizable y soporte nativo para dark mode, que es el modo por defecto de IRON TRACK.
- **TypeScript (`6.0.3`)**: Proporciona tipado estricto en todo el proyecto, reduciendo errores en tiempo de ejecución y mejorando la experiencia de desarrollo con autocompletado y refactorización segura.
- **Supabase**: Servicio backend todo-en-uno. Proporciona autenticación con OAuth y magic links, PostgreSQL con Row Level Security (RLS) para proteger datos, y potencial real-time para futuras funcionalidades colaborativas.
- **Zustand (`^5.0.13`)**: Estado global ligero y minimalista. Ideal para gestionar el estado del workout activo (sesión en curso, descansos, sets completados) sin la boilerplate de Redux o Context API.
- **date-fns (`^4.3.0`)**: Librería modular para manipulación de fechas. Perfecta para calcular rangos de historial, formatear fechas de sesiones y manejar calendarios sin cargar toda una librería monolítica.
- **recharts (`^3.8.1`)**: Librería de gráficos declarativa y amigable con React. Utilizada para visualizar el progreso de levantamiento, volumen semanal y consistencia de entrenamientos.
- **browser-image-compression (`^2.0.2`)**: Permite comprimir imágenes de ejercicios en el navegador antes de subirlas, reduciendo ancho de banda y costos de almacenamiento.
- **lucide-react (`^1.16.0`)**: Set de iconos consistente, ligero y altamente personalizable. Mantiene la identidad visual limpia en toda la aplicación.
- **Cloudflare R2 (vía `@aws-sdk/client-s3`)**: Almacenamiento de objetos compatible con S3, significativamente más económico que AWS S3 y sin costos de salida. Reemplaza a Supabase Storage para las imágenes de ejercicios.
- **Prettier + ESLint + Husky + lint-staged**: Pipeline de calidad de código que asegura consistencia de estilo, detecta errores comunes y ejecuta verificaciones automáticamente en cada commit.
- **Vitest**: _(Planificado para Fase 4)_ Framework de testing unitario rápido y compatible con Vite. Se usará para testear Services, Repositories y utilidades.

## Nota Explícita sobre R2

> ⚠️ Cloudflare R2 SDK (`@aws-sdk/client-s3`) está instalado, pero **la configuración del cliente, el setup del bucket y las variables de entorno están diferidos** al módulo de **Ejercicios (Exercises)** en la Fase 5. **No crear archivos de cliente R2 ni entradas `.env` para R2 todavía.**

## Links a Documentación Oficial

- [Astro Docs](https://docs.astro.build/)
- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Supabase Docs](https://supabase.com/docs)
- [date-fns Docs](https://date-fns.org/docs/Getting-Started)
- [recharts Docs](https://recharts.org/en-US/)
- [browser-image-compression Docs](https://github.com/Donaldcwl/browser-image-compression#readme)
- [lucide-react Docs](https://lucide.dev/guide/packages/lucide-react)
- [AWS SDK for JavaScript v3 - S3 Client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Prettier Docs](https://prettier.io/docs/en/)
- [ESLint Docs](https://eslint.org/docs/latest/)
- [Husky Docs](https://typicode.github.io/husky/)
- [Vitest Docs](https://vitest.dev/)
