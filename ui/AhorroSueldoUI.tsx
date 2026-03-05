import { Investment } from "@/types/investment";
import { resolveInstitutionName } from "@/utils/banks";
import dayjs from "dayjs";
import {
    Badge,
    Card,
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

function InvestmentCard({ investment }: { investment: Investment }) {
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
        <Card>
            <Stack gap="md">
                {/* header */}
                <Group justify="space-between" align="flex-start">
                    <Stack gap={4}>
                        <Group gap="xs">
                            <Text fw={700} size="md">
                                {investment.name || "Ahorro Sueldo"}
                            </Text>
                            <Badge variant="light" color="teal" size="sm">
                                {institutionName}
                            </Badge>
                        </Group>
                        <Text size="xs" c="dimmed">
                            {purchaseDate.format("DD/MM/YYYY")} → {expirationDate.format("DD/MM/YYYY")} · Tasa {rate.toFixed(2)}% EA
                        </Text>
                    </Stack>

                    <Stack gap={2} align="flex-end">
                        <Text size="xs" c="dimmed">cuota mensual</Text>
                        <NumberFormatter prefix="UYU " value={montoMensual} />
                    </Stack>
                </Group>

                {/* progress */}
                <Stack gap={6}>
                    <Group justify="space-between">
                        <Text size="xs" c="dimmed">
                            {calc.cuotasPagadas} de {calc.cuotasTotales} cuotas
                        </Text>
                        <Text size="xs" c="dimmed" fw={600}>{calc.progreso}%</Text>
                    </Group>
                    <Tooltip label={`${calc.progreso}% completado`} position="top">
                        <Progress value={calc.progreso} color="teal" size="sm" radius="xl" />
                    </Tooltip>
                </Stack>

                {/* stats */}
                <SimpleGrid cols={{ base: 1, xs: 3 }}>
                    <CardNumber
                        title="Ahorrado"
                        value={calc.ahorradoHastaHoy}
                        currency="UYU"
                    />
                    <CardNumber
                        title="Ganancia"
                        value={calc.gananciaHastaHoy}
                        currency="UYU"
                    />
                    <CardNumber
                        title="Total"
                        value={calc.totalHastaHoy}
                        currency="UYU"
                    />
                </SimpleGrid>
            </Stack>
        </Card>
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
        <Stack gap="lg">
            <Text size="sm" c="dimmed">
                {ahorroSueldo.length} inversión{ahorroSueldo.length !== 1 ? "es" : ""} activa{ahorroSueldo.length !== 1 ? "s" : ""}
            </Text>

            {/* resumen global (solo si hay más de 1) */}
            {ahorroSueldo.length > 1 && (
                <Card withBorder radius="md" p="md">
                    <Stack gap="xs">
                        <Text size="xs" tt="uppercase" c="dimmed" fw={600} lts={1}>
                            Resumen total
                        </Text>
                        <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="xs">
                            <CardNumber
                                title="Ahorrado"
                                value={totales.ahorrado}
                                currency="UYU"
                            />
                            <CardNumber
                                title="Ganancia"
                                value={totales.ganancia}
                                currency="UYU" />
                            <CardNumber
                                title="Total"
                                value={totales.total}
                                currency="UYU"
                            />
                        </SimpleGrid>
                    </Stack>
                </Card>
            )}

            {ahorroSueldo.length === 0 ? (
                <Card withBorder radius="md" p="xl">
                    <Text ta="center" c="dimmed" size="sm">
                        No hay inversiones de Ahorro en Sueldo registradas.
                    </Text>
                </Card>
            ) : (
                <Stack gap="md">
                    {ahorroSueldo.map((inv) => (
                        <InvestmentCard key={String(inv.id)} investment={inv} />
                    ))}
                </Stack>
            )}
        </Stack>
    );
};