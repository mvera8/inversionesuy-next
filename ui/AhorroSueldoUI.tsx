'use client';

import { Investment } from "@/types/investment";
import { resolveInstitutionName } from "@/utils/banks";
import dayjs from "dayjs";
import {
    Badge,
    Group,
    NumberFormatter,
    Progress,
    SimpleGrid,
    Stack,
    Text,
    Tooltip,
} from "@mantine/core";
import { calculateAhorroSueldo } from "@/utils/ahorroSueldo-calculator";
import { CardNumber } from "@/components/CardNumber";
import { StatCard } from "@/components/StatCard";
import { DashboardCard } from "@/components/DashboardCard";
import { useCurrency } from "@/context/currency";

const AHORRO_CURRENCY = 'UYU' as const;

function InvestmentCard({ investment }: { investment: Investment }) {
    const { usdRate } = useCurrency();
    const currency = AHORRO_CURRENCY;

    const institutionName = resolveInstitutionName(String(investment.institution));
    const montoMensual = Number(investment.amount_nominal);
    const rate = Number(investment.rate);
    const purchaseDate = dayjs(investment.purchase_date);
    const expirationDate = dayjs(investment.expiration_date);

    const calc = calculateAhorroSueldo({
        montoMensual,
        fechaInicio: investment.purchase_date,
        tasaEA: rate,
        fechaActual: dayjs().toDate(),
        mesesTotales: 12,
    });

    return (
        <DashboardCard
            title={investment.name}
            description={`${purchaseDate.format("DD/MM/YYYY")} → ${expirationDate.format("DD/MM/YYYY")} · Tasa ${rate.toFixed(2)}% EA`}
        >
            <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                    <Badge variant="light" color="teal" size="sm">
                        {institutionName}
                    </Badge>
                    <Stack gap={2} align="flex-end">
                        <Text size="xs" c="dimmed">cuota mensual</Text>
                        <NumberFormatter
                            prefix="$ "
                            value={montoMensual}
                            thousandSeparator="."
                            decimalSeparator=","
                            decimalScale={0}
                        />
                    </Stack>
                </Group>

                <Stack gap={6}>
                    <Group justify="space-between">
                        <Text size="xs" c="dimmed">
                            {calc.cuotasPagadas} de {calc.cuotasTotales} cuotas
                        </Text>
                        <Text size="xs" c="dimmed" fw={600}>{calc.progreso}%</Text>
                    </Group>
                    <Tooltip label={`${calc.progreso}% completado`} position="top">
                        <Progress value={calc.progreso} color="teal" size="md" radius="xl" />
                    </Tooltip>
                </Stack>

                <SimpleGrid cols={{ base: 1, xs: 3 }}>
                    <StatCard
                        label="Ahorrado"
                        value={calc.ahorradoHastaHoy}
                        currency={AHORRO_CURRENCY}
                    />
                    <StatCard
                        label="Ganancia"
                        value={calc.gananciaHastaHoy}
                        currency={AHORRO_CURRENCY}
                    />
                    <StatCard
                        label="Total"
                        value={calc.totalHastaHoy}
                        currency={AHORRO_CURRENCY}
                    />
                </SimpleGrid>
            </Stack>
        </DashboardCard>
    );
}

export const AhorroSueldoUI = ({ investments }: { investments: Investment[] }) => {
    const ahorroSueldo = investments.filter((i) => i.type === "ahorro_sueldo");

    const totales = ahorroSueldo.reduce(
        (acc, inv) => {
            const c = calculateAhorroSueldo({
                montoMensual: Number(inv.amount_nominal),
                fechaInicio: inv.purchase_date,
                tasaEA: Number(inv.rate),
                fechaActual: dayjs().toDate(),
                mesesTotales: 12,
            });
            return {
                ahorrado: acc.ahorrado + c.ahorradoHastaHoy,
                ganancia: acc.ganancia + c.gananciaHastaHoy,
                total: acc.total + c.totalHastaHoy,
            };
        },
        { ahorrado: 0, ganancia: 0, total: 0 }
    );

    return (
        <>
            {ahorroSueldo.length > 1 && (
                <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="xs">
                    <CardNumber
                        title="Ahorrado"
                        value={totales.ahorrado}
                        currency={AHORRO_CURRENCY}
                    />
                    <CardNumber
                        title="Ganancia"
                        value={totales.ganancia}
                        currency={AHORRO_CURRENCY}
                    />
                    <CardNumber
                        title="Total"
                        value={totales.total}
                        currency={AHORRO_CURRENCY}
                    />
                </SimpleGrid>
            )}
            <Stack gap="lg">

                Simular?
                Info?

                <Text size="sm" c="dimmed">
                    {ahorroSueldo.length} inversión{ahorroSueldo.length !== 1 ? "es" : ""} activa{ahorroSueldo.length !== 1 ? "s" : ""}
                </Text>
                {ahorroSueldo.length === 0 ? (
                    <DashboardCard>
                        <Text ta="center" c="dimmed" size="sm">
                            No hay inversiones de Ahorro en Sueldo registradas.
                        </Text>
                    </DashboardCard>
                ) : (
                    <Stack gap="md">
                        {ahorroSueldo.map((inv) => (
                            <InvestmentCard key={String(inv.id)} investment={inv} />
                        ))}
                    </Stack>
                )}
            </Stack>
        </>
    );
};