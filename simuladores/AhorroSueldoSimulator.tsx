'use client';

import { useState } from "react";
import { Card, NumberInput, Stack, Text, Title, Group, Divider } from "@mantine/core";
import { calculateAhorroSueldo } from "@/utils/ahorroSueldo-calculator";

const fmt = (n: number) =>
    new Intl.NumberFormat("es-UY", {
        style: "currency",
        currency: "UYU",
        maximumFractionDigits: 2,
    }).format(n);

export const AhorroSueldoSimulator = () => {
    const [monto, setMonto] = useState<number | string>(9000);

    // Simulamos 12 meses completos usando una fecha de inicio 12 meses atrás
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 12);

    const calc = calculateAhorroSueldo({
        montoMensual: Number(monto) || 0,
        fechaInicio: fechaInicio.toISOString(),
        tasaEA: 9.2,
        mesesTotales: 12,
    });

    return (
        <Card withBorder radius="md" p="xl" maw={400}>
            <Stack gap="lg">
                <Title order={4}>Simulador Ahorro Sueldo</Title>

                <NumberInput
                    label="¿Cuánto ahorrás por mes?"
                    placeholder="Ej: 9000"
                    prefix="$ "
                    thousandSeparator="."
                    decimalSeparator=","
                    min={0}
                    value={monto}
                    onChange={setMonto}
                />

                <Divider />

                <Stack gap="xs">
                    <Text size="sm" c="dimmed">En 12 meses tendrías</Text>

                    <Group justify="space-between">
                        <Text size="sm">Lo que ahorraste</Text>
                        <Text ff="monospace" fw={600}>{fmt(calc.ahorradoHastaHoy)}</Text>
                    </Group>

                    <Group justify="space-between">
                        <Text size="sm">Intereses ganados</Text>
                        <Text ff="monospace" fw={600} c="teal">{fmt(calc.gananciaHastaHoy)}</Text>
                    </Group>

                    <Divider />

                    <Group justify="space-between">
                        <Text fw={700}>Total</Text>
                        <Text ff="monospace" fw={700} size="xl">{fmt(calc.totalHastaHoy)}</Text>
                    </Group>

                    <Text size="xs" c="dimmed">Tasa 9.2% EA · BROU Ahorro Sueldo</Text>
                </Stack>
            </Stack>
        </Card>
    );
};
