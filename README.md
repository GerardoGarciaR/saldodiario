# Saldo Diario

App nueva en **Expo + React Native Web + JavaScript + Redux Toolkit + Supabase** para registrar ingresos y gastos por semanas o períodos.

## Qué incluye

- JavaScript (sin TypeScript).
- Expo SDK 57 / React Native Web.
- Responsive Design:
  - escritorio: períodos a la izquierda y detalle a la derecha;
  - móvil/tablet: layout apilado.
- Inter aplicada de forma integral mediante `AppText` y estilos de `TextInput`.
- Login y creación de cuenta con Supabase Auth.
- RLS para que cada usuario sólo pueda ver sus datos.
- Períodos/semanas con:
  - ingreso inicial;
  - concepto del ingreso;
  - fecha inicial y final;
  - saldo calculado.
- Movimientos de tipo `Gasto` o `Ingreso`.
- Cálculo: `Saldo = ingreso inicial + ingresos adicionales - gastos`.
- Selector de fecha propio, sin DatePicker nativo.
- Modales y cambios de módulo con animación Zoom-in.
- Eliminación de movimientos y períodos con confirmación.
- SQL listo para crear las tablas y políticas en Supabase.
- Configuración para exportar Web y desplegar en Vercel.

## 1. Requisitos

Expo SDK 57 requiere Node.js 22.13 o superior.

## 2. Instalar dependencias

```bash
npm install
```

## 3. Crear el proyecto en Supabase

1. Crea un proyecto nuevo en Supabase.
2. Abre **SQL Editor**.
3. Copia y ejecuta todo `supabase/schema.sql`.
4. En **Authentication > Providers > Email**, deja habilitado Email/Password.

## 4. Variables de entorno

Copia:

```bash
cp .env.example .env
```

Y coloca tus valores:

```env
EXPO_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=TU_PUBLISHABLE_KEY
```

Si tu proyecto usa todavía la clave legacy `anon`, la app también admite:

```env
EXPO_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
```

## 5. Ejecutar

### Web

```bash
npm run web
```

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

## 6. Exportar para Vercel

```bash
npm run export:web
```

Expo generará `dist/`. El proyecto incluye `vercel.json` y el script `vercel-build`.

## Estructura importante

```text
src/
  components/
  screens/
  store/
  lib/
  theme/
  utils/
supabase/
  schema.sql
```

## Fuente Inter

No se incluye un archivo de fuente suelto. Se usa el paquete oficial `@expo-google-fonts/inter` y se carga con estos alias:

- `Inter-Regular`
- `Inter-SemiBold`
- `Inter-Bold`

Todos los textos propios usan `AppText` y todos los inputs usan la familia Inter para mantener la tipografía consistente en Web, iOS y Android.
