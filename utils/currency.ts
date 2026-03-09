/**
 * Convierte un monto de una moneda a otra.
 * @param value   Monto a convertir
 * @param from    Moneda de origen ('UYU', 'USD', 'UI')
 * @param to      Moneda de destino ('UYU' o 'USD')
 * @param usdRate Cuántos UYU vale 1 USD
 * @param uiRate  Cuántos UYU vale 1 UI (opcional, default 0 = sin conversión)
 */
export function convertAmount(
    value: number,
    from: string,
    to: string,
    usdRate: number,
    uiRate: number = 0
): number {
    if (from === to) return value;

    // Primero convertimos todo a UYU como moneda base
    let inUYU: number;
    switch (from) {
        case 'USD': inUYU = value * usdRate; break;
        case 'UI': inUYU = uiRate > 0 ? value * uiRate : value; break; // sin tasa UI, devuelve nominal
        default: inUYU = value; // UYU u otras
    }

    // Luego de UYU al destino
    if (to === 'USD') return inUYU / usdRate;
    if (to === 'UI') return inUYU / uiRate;
    return inUYU; // to === 'UYU'
}