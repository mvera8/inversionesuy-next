# Contexto del Proyecto: Tracker de Inversiones (UY)

## Descripción

El proyecto es un tracker de inversiones en Uruguay. Permite a los usuarios registrar sus inversiones y hacer seguimiento de su rendimiento. 

No se hacen pagos en la plataforma, es solo un tracker de inversiones.

## Stack Tecnológico

- **Framework:** Next.js (App Router)
- **UI Library:** Mantine Dev (v7+)
- **Base de Datos & Auth:** Supabase
- **Configuración:** Variables de entorno vía `process.env` (Next.js standard).

## Origen de Datos Estáticos

- **Archivo:** `data/data.json`
- **Contenido:** - Listado de Bancos (BROU, Itaú, Santander, BBVA, etc.).
  - Comisiones estándar por institución.
  - Tipos de instrumentos (Plazos Fijos, Letras, Bonos).
  - Reglas de IRPF por tipo de activo.
  - Respuestas claras y concisas.
- **Archivo:** `data/tools.json`
- **Contenido:** - Herramientas de simulación de inversiones en Uruguay.
  - Calculadoras de rendimientos.
  - Comparadores de opciones de inversión.
  - Preguntas frecuentes sobre inversiones en Uruguay.

## Estructura de Base de Datos (Supabase)

### Tabla: `investments`

- `id`: uuid (PK)
- `user_id`: uuid (FK a auth.users)
- `name`: text
- `type`: enum ('letra', 'plazo_fijo', 'crypto', 'bono', 'ahorro_sueldo')
- `subtype`: text (NULL para letras/bonos; Ej: 'BTC', 'ETH' para crypto; Ej: 'vencimiento', 'mensual' para plazo fijo)
- `institution`: text (Referencia a data/data.json si aplica, Binance u otro si es crypto)
- `currency`: enum ('UYU', 'USD', 'UI')
- `amount_nominal`: numeric (Cantidad de tokens si es crypto, o monto principal si es fiat)
- `purchase_price`: numeric (Precio del activo al momento de la compra en USD/UYU)
- `purchase_date`: date
- `rate`: numeric (TEA - Tasa Efectiva Anual)
- `expiration_date`: string (can be days, months, years and null for crypto)
- `renewable`: boolean (can be true or false for crypto, false default)

### Tabla: `daily_values`

Esta tabla centraliza los valores del mercado para simulaciones y reportes.

- `key`: text (PK - Ej: 'USD', 'UI')
- `value`: numeric

## Lógica de Negocio (Uruguay)

1. **Dólar:** El sistema debe usar los valores de `daily_values` para convertir carteras de USD a UYU en el Dashboard.
2. **Unidad Indexada:** Para instrumentos en UI, se calculará el valor proyectado basado en el último `UI_VALUE` registrado.
3. **Simulador:** Utilizará los datos de `data/data.json` y `data/tools.json` para sugerir tasas promedio según el banco seleccionado antes de guardar la inversión real.

## No Negociables

- Siempre pensa en la Performance y rendimiento del sitio y querys.
- No cometa errores de seguridad.
