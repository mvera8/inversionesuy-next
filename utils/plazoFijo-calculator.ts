/**
 * Cálculo de plazo fijo estilo BROU
 * - Base 365
 * - Redondeo final a 2 decimales
 */
export const calculatePlazoFijo = ({
	capital,
	tasaAnual,
	dias,
}: {
	capital: number;
	tasaAnual: number;
	dias: number;
}) => {
	if (!capital || !tasaAnual || !dias) {
		return {
			interes: 0,
			total: capital,
		};
	}

	const interesBruto =
		capital * (tasaAnual / 100) * (dias / 365);

	const interes = Number(interesBruto.toFixed(2));
	const total = Number((capital + interes).toFixed(2));

	return {
		interes,
		total,
	};
};
