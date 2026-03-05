// src/utils/month-calculator.js

/**
 * Calcula el ahorro mensual acumulado desde una fecha de inicio
 * Asume transferencias el día 1 de cada mes
 */
export const calculateAhorroMensual = ({
	montoMensual,
	fechaInicio,
	fechaActual = new Date(),
}) => {
	if (!montoMensual || !fechaInicio) {
		return {
			totalAhorrado: 0,
			mesesTranscurridos: 0,
			proximaTransferencia: "-",
			diasProximaTransferencia: 0,
		};
	}

	const inicio = new Date(fechaInicio);
	const actual = new Date(fechaActual);

	// Si la fecha de inicio es futura, no hay ahorro
	if (inicio > actual) {
		return {
			totalAhorrado: 0,
			mesesTranscurridos: 0,
			proximaTransferencia: "-",
			diasProximaTransferencia: 0,
		};
	}

	// Calcular meses transcurridos desde la fecha de inicio
	let mesesTranscurridos = 0;
	let fecha = new Date(inicio);

	// Ajustar al primer día del mes de inicio
	fecha.setDate(1);

	// Contar cuántas veces el día 1 ha pasado desde el inicio hasta hoy
	while (fecha <= actual) {
		mesesTranscurridos++;
		fecha.setMonth(fecha.getMonth() + 1);
	}

	// El total ahorrado es el monto mensual por los meses transcurridos
	const totalAhorrado = Number((montoMensual * mesesTranscurridos).toFixed(2));

	// Calcular próxima transferencia (siguiente día 1)
	const proximaFecha = new Date(actual);

	// Si ya pasó el día 1 de este mes, la próxima es el mes siguiente
	if (actual.getDate() >= 1) {
		proximaFecha.setMonth(proximaFecha.getMonth() + 1);
	}

	proximaFecha.setDate(1);
	proximaFecha.setHours(0, 0, 0, 0);

	// Calcular días hasta la próxima transferencia
	const diferenciaMilisegundos = proximaFecha - actual;
	const diasProximaTransferencia = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

	// Formatear fecha de próxima transferencia
	const proximaTransferencia = proximaFecha.toLocaleDateString("es-UY", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

	return {
		totalAhorrado,
		mesesTranscurridos,
		proximaTransferencia,
		diasProximaTransferencia,
	};
};