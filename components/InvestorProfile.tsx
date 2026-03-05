'use client';

import { Badge, Group, Progress, Stack, Text } from "@mantine/core";
import { Investment } from "@/types/investment";
import tools from "@/data/tools";
import { TextDimmed } from "./TextDimmed";

const RIESGO_ORDER = ["Bajo", "Medio", "Alto", "-"];
const RIESGO_COLOR: Record<string, string> = {
    "Bajo": "teal",
    "Medio": "yellow",
    "Alto": "red",
    "-": "gray",
};

export function InvestorProfile({ investments }: { investments: Investment[] }) {
    if (!investments.length) {
        return (
            <Text size="xs" c="dimmed" fw={700} tt="uppercase" ta="center">
                Sin datos suficientes
            </Text>
        );
    }

    // Contar cuántas inversiones hay por tipo
    const countByType = investments.reduce<Record<string, number>>((acc, inv) => {
        acc[inv.type] = (acc[inv.type] || 0) + 1;
        return acc;
    }, {});

    // Agrupar por riesgo
    const countByRiesgo = investments.reduce<Record<string, number>>((acc, inv) => {
        const tool = tools.find(t => t.value === inv.type);
        const riesgo = tool?.riesgo ?? "-";
        acc[riesgo] = (acc[riesgo] || 0) + 1;
        return acc;
    }, {});

    const total = investments.length;

    // Perfil dominante
    const dominantRiesgo = Object.entries(countByRiesgo).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

    const profileLabel: Record<string, string> = {
        "Bajo": "Conservador",
        "Medio": "Moderado",
        "Alto": "Agresivo",
        "-": "Sin clasificar",
    };

    return (
        <Stack gap="sm">
            {/* Perfil label */}
            <Group gap="xs" justify="space-between">
                <Text size="xl" fw={600}>{profileLabel[dominantRiesgo]}</Text>
                <Badge color={RIESGO_COLOR[dominantRiesgo]} variant="light" size="sm">
                    Riesgo {dominantRiesgo}
                </Badge>
            </Group>

            {/* Barra por nivel de riesgo */}
            {RIESGO_ORDER.filter(r => countByRiesgo[r]).map(riesgo => {
                const count = countByRiesgo[riesgo] ?? 0;
                const pct = Math.round((count / total) * 100);
                return (
                    <Stack key={riesgo} gap={4}>
                        <Group justify="space-between">
                            <TextDimmed>{riesgo}</TextDimmed>
                            <TextDimmed>{count} inv. · {pct}%</TextDimmed>
                        </Group>
                        <Progress
                            value={pct}
                            color={RIESGO_COLOR[riesgo]}
                            size="sm"
                            radius="xl"
                            h={10}
                        />
                    </Stack>
                );
            })}

            {/* Tipos presentes */}
            <Group gap="xs" mt="xs">
                {Object.keys(countByType).map(type => {
                    const tool = tools.find(t => t.value === type);
                    if (!tool) return null;
                    return (
                        <Badge key={type} color={tool.color} variant="light">
                            {tool.label}
                        </Badge>
                    );
                })}
            </Group>
        </Stack>
    );
}