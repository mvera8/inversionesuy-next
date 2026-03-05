import jsonData from '@/data/data.json';
const { exchanges } = jsonData;

export function resolveExchangeName(exchangeId: string): string {
    return exchanges.find((b) => b.id === exchangeId)?.label || exchangeId;
}

export function listExchanges() {
    return exchanges;
}