// src/utils/crypto-calculators.js

/**
 * Utilidades para cálculos de inversiones en criptomonedas
 */

import { CRYPTO_OPTIONS } from "../constants/investmentsTypes";

const CRYPTO_CACHE_KEY = "crypto_prices_cache";
const CACHE_TTL = 60 * 1000; // 1 minuto

const getCryptoConfig = (cryptoCode) =>
	CRYPTO_OPTIONS.find(c => c.value === cryptoCode);

export const fetchCryptoPricesBatch = async (
	cryptoNames = [],
	force = false
) => {
	try {
		const now = Date.now();

		if (!force) {
			const cachedRaw = localStorage.getItem(CRYPTO_CACHE_KEY);
			if (cachedRaw) {
				const cached = JSON.parse(cachedRaw);
				if (now - cached.timestamp < CACHE_TTL) {
					const filtered = {};
					cryptoNames.forEach(name => {
						if (cached.prices[name]) {
							filtered[name] = cached.prices[name];
						}
					});
					if (Object.keys(filtered).length) {
						console.log("🧠 usando cache");
						return filtered;
					}
				}
			}
		}

		// 🔑 MAPEAR POR LABEL
		const nameToId = Object.fromEntries(
			CRYPTO_OPTIONS.map(c => [c.label, c.coingeckoId])
		);

		const ids = cryptoNames
			.map(name => nameToId[name])
			.filter(Boolean);

		if (!ids.length) {
			console.warn("⚠️ No se pudo mapear ninguna cripto", cryptoNames);
			return {};
		}

		const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(
			","
		)}&vs_currencies=usd`;

		// console.log('🌐 CoinGecko:', url);

		const res = await fetch(url);
		if (!res.ok) throw new Error("CoinGecko error");

		const data = await res.json();

		const prices = {};
		cryptoNames.forEach(name => {
			const id = nameToId[name];
			if (id && data[id]?.usd) {
				prices[name] = data[id].usd;
			}
		});

		localStorage.setItem(
			CRYPTO_CACHE_KEY,
			JSON.stringify({ prices, timestamp: now })
		);

		return prices;
	} catch (err) {
		console.error("❌ fetchCryptoPricesBatch:", err);
		return {};
	}
};

const getCryptoCodeFromLabel = (investmentName) => {
	const match = CRYPTO_OPTIONS.find(
		c => c.label === investmentName
	);
	return match?.value ?? null;
};

export const getCryptoSymbolFromName = (name) => {
	const match = name.match(/\(([^)]+)\)$/);
	return match ? match[1] : null;
};

/**
 * Obtener cotización actual de una cripto desde CoinGecko API
 * @param {string} cryptoName - Nombre de la cripto (ej: "Bitcoin (BTC)")
 * @returns {Promise<number|null>} - Precio en USD o null si falla
 */
export const fetchCryptoPrice = async (cryptoCode) => {
	try {
		const crypto = getCryptoConfig(cryptoCode);

		if (!crypto?.coingeckoId) {
			console.warn("Cripto no soportada:", cryptoCode);
			return null;
		}

		const response = await fetch(
			`https://api.coingecko.com/api/v3/simple/price?ids=${crypto.coingeckoId}&vs_currencies=usd`
		);

		if (!response.ok) throw new Error("Error fetching crypto price");

		const data = await response.json();
		return data[crypto.coingeckoId]?.usd ?? null;
	} catch (error) {
		console.error("Error fetching crypto price:", error);
		return null;
	}
};

/**
 * Guardar cotización en localStorage con timestamp
 * @param {string} cryptoName - Nombre de la cripto
 * @param {number} price - Precio actual
 */
export const saveCryptoPrice = (cryptoName, price) => {
	const data = {
		price,
		timestamp: new Date().toISOString(),
	};
	localStorage.setItem(`crypto_price_${cryptoName}`, JSON.stringify(data));
};

/**
 * Obtener cotización guardada de localStorage
 * @param {string} cryptoName - Nombre de la cripto
 * @param {number} maxAgeMinutes - Edad máxima en minutos (default: 5)
 * @returns {number|null} - Precio guardado o null si no existe/expiró
 */
export const getCachedCryptoPrice = (cryptoName, maxAgeMinutes = 5) => {
	try {
		const cached = localStorage.getItem(`crypto_price_${cryptoName}`);
		if (!cached) return null;

		const { price, timestamp } = JSON.parse(cached);
		const now = new Date();
		const cacheDate = new Date(timestamp);
		const diffMinutes = (now - cacheDate) / (1000 * 60);

		// Si el cache es muy viejo, retornar null
		if (diffMinutes > maxAgeMinutes) return null;

		return price;
	} catch (error) {
		console.error("Error reading cached crypto price:", error);
		return null;
	}
};

/**
 * Obtener precio de compra en USD desde el monto invertido
 * @param {number} initialValue - Monto invertido
 * @param {string} currency - Moneda de compra ('pesos' o 'dolares')
 * @param {number} exchangeRate - Tasa de cambio USD/ARS (ej: 1050)
 * @returns {number} - Monto en USD
 */
export const getInitialValueInUSD = (initialValue, currency, exchangeRate = 1050) => {
	if (currency === "dolares") {
		return initialValue;
	}
	// Si es en pesos, convertir a USD
	return initialValue / exchangeRate;
};

/**
 * Calcular ganancia/pérdida de una inversión en cripto
 * @param {number} initialValue - Monto inicial invertido
 * @param {string} currency - Moneda de inversión ('pesos' o 'dolares')
 * @param {number} purchasePrice - Precio de compra de la cripto en USD
 * @param {number} currentPrice - Precio actual de la cripto en USD
 * @param {number} exchangeRate - Tasa de cambio USD/ARS actual
 * @returns {Object} - Detalles del cálculo
 */
export const calculateCryptoInvestment = (
	initialValue,
	currency,
	purchasePrice,
	currentPrice,
	exchangeRate = 1050
) => {
	// Convertir inversión inicial a USD
	const initialValueUSD = getInitialValueInUSD(initialValue, currency, exchangeRate);

	// Calcular cantidad de cripto comprada
	const cryptoAmount = initialValueUSD / purchasePrice;

	// Calcular valor actual en USD
	const currentValueUSD = cryptoAmount * currentPrice;

	// Calcular ganancia/pérdida en USD
	const profitLossUSD = currentValueUSD - initialValueUSD;
	const profitLossPercentage = ((currentValueUSD - initialValueUSD) / initialValueUSD) * 100;

	// Convertir valor actual a la moneda original
	const currentValueInOriginalCurrency = currency === "dolares"
		? currentValueUSD
		: currentValueUSD * exchangeRate;

	// Ganancia/pérdida en moneda original
	const profitLossInOriginalCurrency = currentValueInOriginalCurrency - initialValue;

	return {
		cryptoAmount,
		purchasePrice,
		currentPrice,
		initialValueUSD,
		currentValueUSD,
		profitLossUSD,
		profitLossPercentage,
		currentValueInOriginalCurrency,
		profitLossInOriginalCurrency,
		isProfitable: profitLossUSD > 0,
	};
};

/**
 * Obtener o actualizar precio de cripto (usa cache o fetch)
 * @param {string} cryptoName - Nombre de la cripto
 * @param {boolean} forceUpdate - Forzar actualización desde API
 * @returns {Promise<number|null>} - Precio actual
 */
export const getCryptoPrice = async (investmentName, forceUpdate = false) => {
	const cryptoCode = getCryptoCodeFromLabel(investmentName);
	if (!cryptoCode) {
		console.warn("Cripto no soportada:", investmentName);
		return null;
	}

	if (!forceUpdate) {
		const cached = getCachedCryptoPrice(cryptoCode);
		if (cached !== null) return cached;
	}

	const price = await fetchCryptoPrice(cryptoCode);
	if (price !== null) {
		saveCryptoPrice(cryptoCode, price);
	}

	return price;
};

/**
 * Guardar precio de compra de una inversión en cripto
 * @param {string} investmentId - ID de la inversión
 * @param {number} purchasePrice - Precio de compra en USD
 */
export const savePurchasePrice = (investmentId, purchasePrice) => {
	localStorage.setItem(`crypto_purchase_${investmentId}`, purchasePrice.toString());
};

/**
 * Obtener precio de compra guardado
 * @param {string} investmentId - ID de la inversión
 * @returns {number|null} - Precio de compra o null
 */
export const getPurchasePrice = (investmentId) => {
	const price = localStorage.getItem(`crypto_purchase_${investmentId}`);
	return price ? parseFloat(price) : null;
};

/**
 * Calcular totales de inversiones en cripto
 * @param {Array} cryptoInvestments - Array de inversiones en cripto
 * @param {Object} currentPrices - Objeto con precios actuales {cryptoName: price}
 * @param {number} exchangeRate - Tasa de cambio actual
 * @returns {Object} - Totales calculados
 */
export const calculateCryptoTotals = (cryptoInvestments, currentPrices, exchangeRate = 1050) => {
	let totalInvested = 0;
	let totalCurrentValue = 0;
	let totalProfitLoss = 0;

	cryptoInvestments.forEach(investment => {
		const purchasePrice = Number(investment.price);
		const cryptoCode = getCryptoCodeFromLabel(investment.investmentName);
		if (!cryptoCode) return;

		const currentPrice = currentPrices[cryptoCode];

		if (!purchasePrice || !currentPrice) return;

		const calculation = calculateCryptoInvestment(
			Number(investment.initialValue),
			investment.currency,
			purchasePrice,
			currentPrice,
			exchangeRate
		);

		totalInvested += Number(investment.initialValue);
		totalCurrentValue += calculation.currentValueInOriginalCurrency;
		totalProfitLoss += calculation.profitLossInOriginalCurrency;
	});

	return {
		totalInvested,
		totalCurrentValue,
		totalProfitLoss,
		totalProfitLossPercentage: totalInvested > 0
			? ((totalCurrentValue - totalInvested) / totalInvested) * 100
			: 0,
	};
};