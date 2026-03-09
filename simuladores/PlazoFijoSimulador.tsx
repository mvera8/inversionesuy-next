'use client';

import { useEffect, useState } from "react";
import { NumberInput, NumberFormatter, Text, Title, Group, SimpleGrid, Select, Button, Stack, SegmentedControl } from "@mantine/core";
import { calculatePlazoFijo } from "@/utils/plazoFijo-calculator";
import { DashboardCard } from "@/components/DashboardCard";
import { IconInfoCircle } from "@tabler/icons-react";
import { CardNumber } from "@/components/CardNumber";
import { TableInfo } from "@/components/TableInfo";
import { Currency } from "@/context/currency";
import data from "../data/data.json";

type CurrencyView = 'pesos' | 'dolares' | 'ui';

const CURRENCY_OPTIONS = [
    { value: 'pesos', label: 'Pesos uruguayos' },
    { value: 'dolares', label: 'Dólares' },
    { value: 'ui', label: 'Unidades Indexadas' },
];

const CURRENCY_SYMBOL: Record<CurrencyView, string> = {
    pesos: '$',
    dolares: 'U$S',
    ui: 'UI',
};

// CurrencyView → Currency (para CardNumber y CurrencyFormatter)
const CURRENCY_MAP: Record<CurrencyView, Currency> = {
    pesos: 'UYU',
    dolares: 'USD',
    ui: 'UYU', // UI no tiene tipo propio, usamos UYU como base
};

export const PlazoFijoSimulator = () => {

    const [currency, setCurrency] = useState<CurrencyView>('pesos');
    const symbol = CURRENCY_SYMBOL[currency];
    const currencyCode = CURRENCY_MAP[currency];

    const [montoInvertir, setMontoInvertir] = useState<number>(5000);
    const [plazoTipo, setPlazoTipo] = useState<string | null>(null);
    const [tna, setTna] = useState<number | null>(null);
    const [periodo, setPeriodo] = useState<number | string>('');
    const [entidad, setEntidad] = useState<string | null>(null);

    /* ---------------- helpers ---------------- */

    const bancoSeleccionado = data.bancos.find(b => b.id === entidad);
    const plazoFijoData = bancoSeleccionado?.plazo_fijo?.[0];
    const monedaData = plazoFijoData?.[currency as 'pesos' | 'dolares'];

    const bancosDisponibles = data.bancos.filter(
        b => b.plazo_fijo?.[0]?.[currency as 'pesos' | 'dolares']
    );

    const minimo = monedaData?.minimo;
    const disclaimer = monedaData?.disclaimer;

    const tiposDisponibles = monedaData
        ? Object.keys(monedaData).filter(key => Array.isArray((monedaData as Record<string, unknown>)[key]))
        : [];

    const { interes, total } = calculatePlazoFijo({
        capital: montoInvertir,
        dias: Number(periodo) || 0,
        tasaAnual: tna ?? 0,
    });

    /* ---------------- efectos ---------------- */

    useEffect(() => {
        setEntidad(null);
        setPlazoTipo(null);
        setPeriodo('');
        setTna(null);
    }, [currency]);

    useEffect(() => {
        setPlazoTipo(null);
        setPeriodo('');
        setTna(null);
    }, [entidad]);

    useEffect(() => {
        setPeriodo('');
        setTna(null);
    }, [plazoTipo]);

    useEffect(() => {
        if (!monedaData || !plazoTipo || !periodo) {
            setTna(null);
            return;
        }

        const tipoData = (monedaData as Record<string, unknown>)[plazoTipo];
        if (!Array.isArray(tipoData)) return;

        const tasaSeleccionada = (tipoData as { desde: number; hasta: number; tasa: number }[]).find(
            t => Number(periodo) >= t.desde && Number(periodo) <= t.hasta
        );

        setTna(tasaSeleccionada?.tasa ?? null);
    }, [monedaData, plazoTipo, periodo]);

    return (
        <SimpleGrid cols={2}>
            <DashboardCard>
                <Stack>
                    <SegmentedControl
                        data={CURRENCY_OPTIONS}
                        value={currency}
                        onChange={(val) => setCurrency((val as CurrencyView) ?? 'pesos')}
                    />

                    <Select
                        label="Banco"
                        placeholder="Buscar Bancos"
                        value={entidad}
                        onChange={setEntidad}
                        searchable
                        data={bancosDisponibles.map(b => ({
                            label: b.label,
                            value: b.id,
                        }))}
                    />

                    {disclaimer && (
                        <Group gap={4}>
                            <IconInfoCircle size={14} />
                            <Text size="xs" c="dimmed">{disclaimer}</Text>
                        </Group>
                    )}

                    <NumberInput
                        label="Monto a invertir"
                        description={minimo ? `Mínimo: ${symbol} ${minimo}` : undefined}
                        value={montoInvertir}
                        onChange={(val) => setMontoInvertir(Number(val))}
                        min={0}
                    />

                    <Select
                        label="Tipo de Plazo Fijo"
                        value={plazoTipo}
                        onChange={setPlazoTipo}
                        disabled={!tiposDisponibles.length}
                        data={tiposDisponibles.map(tipo => ({
                            value: tipo,
                            label: tipo === "vencimiento" ? "Al vencimiento" : "Mensual",
                        }))}
                    />

                    <NumberInput
                        label="Días de Inversión"
                        value={periodo}
                        onChange={setPeriodo}
                        disabled={!tiposDisponibles.length}
                        min={1}
                        max={366}
                    />

                    <Text size="xs" c="dimmed">
                        El interés se calcula según los días exactos ingresados. Algunos bancos agrupan plazos en rangos (ej: 270-366 días con la misma tasa).
                    </Text>
                </Stack>


            </DashboardCard>

            <DashboardCard>
                <SimpleGrid cols={2} mb="md">
                    <CardNumber
                        title="Total Invertido"
                        value={montoInvertir}
                        currency={currencyCode}
                    />
                    <CardNumber
                        title="Ganancia estimada"
                        value={interes}
                        currency={currencyCode}
                    />
                </SimpleGrid>

                <TableInfo
                    data={[
                        { label: "Entidad", value: data.bancos.find(b => b.id === entidad)?.label ?? "-" },
                        { label: "Tipo", value: plazoTipo ?? "-" },
                        { label: "Periodo", value: <NumberFormatter suffix=" días" value={Number(periodo) || 0} /> },
                        { label: "Moneda", value: symbol },
                        { label: "Tasa E.A.", value: tna ? `${tna}%` : "-" },
                        { label: "Total al vencimiento", value: <NumberFormatter prefix={`${symbol} `} value={total} decimalScale={2} thousandSeparator /> },
                    ]}
                />

                <Group justify="flex-end">
                    <Button
                        variant="gradient"
                        gradient={{ from: "lime.2", to: "cyan.1", deg: 90 }}
                        c="black"
                        size="lg"
                        component="a"
                        href="/add"
                    >
                        Agregar Simulación
                    </Button>
                </Group>
            </DashboardCard>
        </SimpleGrid>
    );
};