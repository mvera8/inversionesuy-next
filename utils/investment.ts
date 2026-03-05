import { Investment } from "@/types/investment";
import { calculatePlazoFijo } from "./plazoFijo-calculator";
import dayjs from "dayjs";
import { calculateAhorroSueldo } from "./ahorroSueldo-calculator";

export type InvestmentResult = {
    invested: number;  // lo que pusiste
    gain: number;      // lo que ganaste
    total: number;     // invested + gain
};

export function getInvestmentResult(investment: Investment): InvestmentResult {
    const purchaseDate = dayjs(investment.purchase_date);
    const expirationDate = dayjs(investment.expiration_date);
    const dias = expirationDate.diff(purchaseDate, 'day');

    if (investment.type === 'ahorro_sueldo') {
        const calc = calculateAhorroSueldo({
            montoMensual: Number(investment.amount_nominal),
            fechaInicio: investment.purchase_date,
            tasaEA: Number(investment.rate),
            fechaActual: dayjs().toDate(),
            mesesTotales: 12,
        });
        return {
            invested: calc.ahorradoHastaHoy,
            gain: calc.gananciaHastaHoy,
            total: calc.totalHastaHoy,
        };
    }

    if (investment.type === 'plazo_fijo') {
        const calc = calculatePlazoFijo({
            capital: Number(investment.amount_nominal),
            tasaAnual: Number(investment.rate),
            dias: dias > 0 ? dias : 0,
        });
        return {
            invested: Number(investment.amount_nominal),
            gain: calc.interes,
            total: calc.total,
        };
    }

    return { invested: 0, gain: 0, total: 0 };
}

// Compatibilidad: si algún lugar todavía usa getInvestmentGain, sigue funcionando
export function getInvestmentGain(investment: Investment): number {
    return getInvestmentResult(investment).gain;
}

export function getTotalGains(investments: Investment[]): number {
    return investments.reduce((acc, inv) => acc + getInvestmentGain(inv), 0);
}

export function getTotalInvested(investments: Investment[]): number {
    return investments.reduce((acc, inv) => acc + getInvestmentResult(inv).invested, 0);
}