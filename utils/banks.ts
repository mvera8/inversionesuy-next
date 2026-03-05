import jsonData from '@/data/data.json';
const { bancos } = jsonData;

export function resolveInstitutionName(institutionId: string): string {
    return bancos.find((b) => b.id === institutionId)?.short || institutionId;
}

export function listBanks() {
    return bancos;
}