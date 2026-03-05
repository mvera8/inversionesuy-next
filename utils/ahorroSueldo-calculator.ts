/**
 * Simulación Ahorro en Sueldo BROU
 * - Aportes mensuales fijos
 * - Tasa EA en base de datos como porcentaje (ej: 9.2 → 9.2%)
 * - Desglose mes a mes exportable
 */

export type AhorroSueldoMes = {
	mes: number;           // número de cuota (1, 2, 3...)
	fecha: string;         // "YYYY-MM"
	ahorrado: number;      // capital acumulado hasta ese mes
	ganancia: number;      // interés acumulado hasta ese mes
	total: number;         // ahorrado + ganancia
};

export type AhorroSueldoResult = {
	// Hasta hoy
	ahorradoHastaHoy: number;
	gananciaHastaHoy: number;
	totalHastaHoy: number;

	// Progreso
	cuotasPagadas: number;
	cuotasTotales: number;
	progreso: number;

	// Desglose mes a mes (solo los meses transcurridos)
	detalleMeses: AhorroSueldoMes[];
};

export const calculateAhorroSueldo = ({
	montoMensual,
	fechaInicio,
	tasaEA,
	fechaActual = new Date(),
	mesesTotales = 12,
}: {
	montoMensual: number;
	fechaInicio: string;
	tasaEA: number;
	fechaActual?: Date;
	mesesTotales?: number;
}): AhorroSueldoResult => {
	const empty: AhorroSueldoResult = {
		ahorradoHastaHoy: 0,
		gananciaHastaHoy: 0,
		totalHastaHoy: 0,
		cuotasPagadas: 0,
		cuotasTotales: mesesTotales,
		progreso: 0,
		detalleMeses: [],
	};

	if (!montoMensual || !fechaInicio || !tasaEA) return empty;

	// Tasa EA viene como porcentaje (9.2) → decimal (0.092)
	const tasaDecimal = tasaEA / 100;

	// Tasa mensual equivalente: (1 + TEA)^(1/12) - 1
	const tasaMensual = Math.pow(1 + tasaDecimal, 1 / 12) - 1;

	// Cuotas pagadas hasta hoy
	const inicio = new Date(fechaInicio);
	const actual = new Date(fechaActual);

	let cuotasPagadas = 0;
	const cursor = new Date(inicio);
	cursor.setDate(1);

	while (cursor <= actual && cuotasPagadas < mesesTotales) {
		cuotasPagadas++;
		cursor.setMonth(cursor.getMonth() + 1);
	}

	// Desglose mes a mes
	const detalleMeses: AhorroSueldoMes[] = [];

	for (let mesActual = 1; mesActual <= cuotasPagadas; mesActual++) {
		const fechaMes = new Date(inicio);
		fechaMes.setDate(1);
		fechaMes.setMonth(fechaMes.getMonth() + mesActual - 1);
		const fechaStr = `${fechaMes.getFullYear()}-${String(fechaMes.getMonth() + 1).padStart(2, '0')}`;

		// Capital acumulado hasta este mes
		const ahorrado = montoMensual * mesActual;

		// Ganancia acumulada: cada cuota i lleva (mesActual - i + 1) meses invertida
		let ganancia = 0;
		for (let i = 1; i <= mesActual; i++) {
			const mesesInvertidos = mesActual - i + 1;
			ganancia += montoMensual * (Math.pow(1 + tasaMensual, mesesInvertidos) - 1);
		}

		detalleMeses.push({
			mes: mesActual,
			fecha: fechaStr,
			ahorrado: Number(ahorrado.toFixed(2)),
			ganancia: Number(ganancia.toFixed(2)),
			total: Number((ahorrado + ganancia).toFixed(2)),
		});
	}

	const ultimo = detalleMeses[detalleMeses.length - 1];

	return {
		ahorradoHastaHoy: ultimo?.ahorrado ?? 0,
		gananciaHastaHoy: ultimo?.ganancia ?? 0,
		totalHastaHoy: ultimo?.total ?? 0,
		cuotasPagadas,
		cuotasTotales: mesesTotales,
		progreso: Number(((cuotasPagadas / mesesTotales) * 100).toFixed(1)),
		detalleMeses,
	};
};