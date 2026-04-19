# Kawaii Mixer Game

Prototipo mobile-first en HTML/CSS/JS sin dependencias de runtime.

## Ejecutar

```bash
npm start
```

Abre `http://localhost:5173`.

También puedes abrir `dist/kawaii-mixer-standalone.html` después de generar el standalone:

```bash
npm run build
```

## Qué incluye

- Core loop: pedido, memory, Bubble Chart, resultado y siguiente pedido.
- `data/levels.json` con 10 niveles editables.
- Pointer Events con `setPointerCapture` para drag táctil.
- Burbujas con llenado líquido, ojos por nota y mezcla de color en linear-light sRGB.
- Partículas Canvas con `requestAnimationFrame`.
- Música ambiental Forest Bubbles con botón de sonido persistente.
- Maggic contextual: pista, materia extra, solvente obligatorio o cierre sin bonus.
- Perfupedia persistente con `localStorage`.
- Pedidos emocionales con clientes de personalidad propia.
- Aura del perfume, reacciones variadas, riesgo suave, refinado y último toque.
- Eventos sorpresa y secretos de alquimia registrables en colección.
- Tres fases de creación: Fondo, Corazón y Salida, con fusión visual por fase.
- Mixer de Cautivos: recompensas de materia prima, recetas ocultas y cautivos consumibles para el último toque.
- Solvente como Massnota ilimitada: al mezclarse en una burbuja rebaja la nota final de esa burbuja.
- Burbujas numerosas por fase y sobredosificación: pasarse penaliza, tres excesos reinician la ronda.
- Resultado final con frasco por capas y pirámide olfativa.

## Estructura

```text
index.html
css/styles.css
data/levels.json
js/assets.js
js/storage.js
js/colorMix.js
js/particles.js
js/systems.js
js/cautives.js
js/maggic.js
js/main.js
assets/images/*.png
build.js
server.js
```
