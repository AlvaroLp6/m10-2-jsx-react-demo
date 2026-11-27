# M10.2. JSX con React — Proyecto de Demostración para el Aula

**Alumno/a:** Álvaro Lucía (completa aquí tus apellidos) · **Módulo:** Desarrollo de Interfaces (DAM2)
**Aplicación desplegada:** _pendiente de añadir el enlace de Vercel_ (`https://tu-proyecto.vercel.app`)
**Repositorio:** _pendiente de añadir el enlace del repositorio público de GitHub_

## Mejoras implementadas (backlog de 10 tickets)

| Ticket | Archivo | Mejora |
| --- | --- | --- |
| 01 | `App.jsx`, `index.css` | Botón de tema claro/oscuro en el `<header>` (cambia una clase CSS del contenedor principal) y `<footer>` con nombre, módulo y año dinámico. |
| 02 | `01_SintaxisYFragmentos.jsx` | Input controlado con `useState`; error con `role="alert"` si hay menos de 3 caracteres y saludo en tiempo real a partir de 3. |
| 03 | `02_ExpresionesYEstilos.jsx` | Calculadora fiscal: IVA 21/10/4 %, descuento 0–50 %, desglose a 2 decimales y total en verde si hay descuento. |
| 04 | `03_RenderizadoCondicional.jsx` | Corregida la "trampa del 0" (`notificaciones > 0 &&`), botón "Marcar todas como leídas" deshabilitado a 0 y mensaje de estado vacío. |
| 05 | `04_ListasYKeys.jsx` | Control de duplicados sin distinguir mayúsculas, buscador en tiempo real por nombre o código y contador "Mostrando X de Y módulos". |
| 06 | `05_EventosYSeguridadXSS.jsx` | Historial de los últimos 5 eventos con `.map()` y `key` única, botón "Limpiar historial" y 3 payloads XSS de prueba. También se corrigió un error de sintaxis (comillas) en el payload inicial. |
| 07 | `06_DemoIntegradora.jsx` | Buscador por nombre combinable con "Solo aprobados", ordenación (nota ↑/↓, nombre A–Z) y estado vacío. |
| 08 | `06_DemoIntegradora.jsx` | `EXPEDIENTES` pasa a estado; formulario controlado de alta con validación e id único. |
| 09 | `ResumenKPIs.jsx` | Componente con props: total de alumnos, nota media (2 decimales) y % de aprobados, sobre la lista visible. |
| 10 | `06_DemoIntegradora.jsx` | Persistencia en `localStorage`, botón "Restablecer datos iniciales" y `npm run build` sin errores. |

Proyecto educativo en **React 18 + Vite** diseñado para explicar paso a paso todas las características de **JSX (JavaScript XML)** directamente desde Visual Studio Code.

## Puesta en marcha rápida (3 pasos)

1. Abre esta carpeta en **Visual Studio Code**.
2. Abre una terminal integrada (`Ctrl + ñ` o `Ctrl + \``) y ejecuta:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Se abrirá automáticamente en `http://localhost:5173`.

## Guion sugerido para la exposición en clase

Cada pestaña de la aplicación corresponde a un archivo numerado dentro de `src/components/`, con comentarios guiados (`[CLAVE EXPOSICIÓN]`):

1. `01_SintaxisYFragmentos.jsx` — Nodo raíz único, Fragmentos (`<>...</>`), cierre obligatorio, `className`, `htmlFor` y componentes en Mayúscula.
2. `02_ExpresionesYEstilos.jsx` — Llaves `{ }` (expresiones vs. sentencias), estilos en línea `style={{ }}` en `camelCase` y valores ignorados por React.
3. `03_RenderizadoCondicional.jsx` — *Early return*, operador ternario (`? :`), operador `&&` y demostración en vivo de la **trampa del `0`**.
4. `04_ListasYKeys.jsx` — Transformación de arrays con `.map()` y la importancia real de la prop `key` en el algoritmo de reconciliación.
5. `05_EventosYSeguridadXSS.jsx` — Eventos `onClick={fn}` vs. `onClick={() => fn(arg)}` y demostración práctica de protección automática contra **XSS**.
6. `06_DemoIntegradora.jsx` — Ejemplo completo integrando todas las reglas de JSX en un mini-panel de módulos.
