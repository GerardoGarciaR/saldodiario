# Fix MoneyInput en iPhone

Problema:
- En Safari y Chrome de iPhone, el campo sólo aceptaba el primer dígito.
- Backspace tampoco funcionaba.

Causa:
`MoneyInput` controlaba la propiedad `selection` y la forzaba antes de `.00`
después de cada render. React Native Web + WebKit/iOS no mantiene esa selección
de forma fiable con el teclado táctil.

Solución:
- En web táctil (iPhone/iPad), no se controla `selection`.
- Mientras se edita, el campo muestra la máscara sin ceros decimales forzados:
  `$1` → `$10` → `$100` → `$1,000`.
- Si el usuario escribe decimal: `$100.` → `$100.5` → `$100.50`.
- Al perder el foco vuelve a mostrar siempre dos decimales: `$100.00`.
- En escritorio se conserva la visualización normal con dos decimales.
