'use client';

import { useState, useMemo } from "react";
import { Button, Text, SimpleGrid, Group, Badge, Card, Stack, NumberFormatter } from "@mantine/core";
import { Investment } from "@/types/investment";
import { resolveToolColor, resolveToolName } from "@/utils/tools";
import { IconPlus } from "@tabler/icons-react";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { CardNumber } from "@/components/CardNumber";
import { InvestmentColumn, TableInvestments } from "@/components/TableInvestments";
import { DashboardButton } from "@/components/DashboardButton";
import { ShellNavbar } from "@/components/ShellNavbar";
import { ShellMain } from "@/components/ShellMain";
import { DashboardCard } from "@/components/DashboardCard";
import { DashboardTitle } from "@/components/DashboardTitle";
import dayjs from "dayjs";
import { useCurrency } from "@/context/currency";
import { InvestorProfile } from "@/components/InvestorProfile";
import { getInvestmentResult } from "@/utils/investment";
import { resolveInstitutionName } from "@/utils/banks";
import { CurrencyFormatter } from "@/components/CurrencyFormatter";

interface DashboardClientProps {
    user: any;
    investments: Investment[] | null;
}

const columns: InvestmentColumn[] = [
    { label: "Inversión", render: inv => <Text fw={500}>{inv.name}</Text> },
    { label: "Tipo", render: inv => <Badge color={resolveToolColor(inv.type)} variant="light">{resolveToolName(inv.type)}</Badge> },
    { label: "Institución", render: inv => resolveInstitutionName(inv.institution) },
    { label: "Moneda", render: inv => inv.currency },
    { label: "Invertido", render: inv => <CurrencyFormatter value={getInvestmentResult(inv).invested} currency={inv.currency} /> },
    { label: "Ganancia", render: inv => <Text c="green"><CurrencyFormatter value={getInvestmentResult(inv).gain} currency={inv.currency} /></Text> },
];

export function DashboardUI({ user, investments }: DashboardClientProps) {
    const currency = useCurrency();
    const metadata = user.user_metadata;
    const [filterType, setFilterType] = useState<string | 'ALL'>('ALL');

    const types = useMemo(() => {
        if (!investments) return [];
        return Array.from(new Set(investments.map(inv => inv.type))).filter(Boolean);
    }, [investments]);

    const nextPayments = useMemo(() => {
        if (!investments) return [];
        return investments
            .filter(inv => inv.expiration_date)
            .sort((a, b) =>
                new Date(a.expiration_date!).getTime() - new Date(b.expiration_date!).getTime()
            );
    }, [investments]);

    const filteredInvestments = useMemo(() => {
        if (!investments) return [];
        if (filterType === 'ALL') return investments;
        return investments.filter(inv => inv.type === filterType);
    }, [investments, filterType]);

    const totalInvestments = useMemo(() => {
        return filteredInvestments.reduce((acc, inv) => {
            return acc + getInvestmentResult(inv).invested;
        }, 0);
    }, [filteredInvestments]);

    const totalGains = useMemo(() => {
        return filteredInvestments.reduce((acc, inv) => {
            return acc + getInvestmentResult(inv).gain;
        }, 0);
    }, [filteredInvestments]);

    return (
        <>
            <ShellNavbar>
                <CurrencySwitcher />
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                    menu
                </Text>
                <DashboardButton
                    label="Agregar inversión"
                    link="/add-investment"
                    justify="center"
                    size="lg"
                    icon={<IconPlus />}

                />
                {types.length > 0 && (
                    <>
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                            Inversiones
                        </Text>
                        {types.map(type => (
                            <DashboardButton
                                key={type}
                                label={resolveToolName(type)}
                                link={`/dashboard/${type}`}
                            />
                        ))}
                    </>
                )}
            </ShellNavbar>

            <ShellMain>
                <DashboardTitle
                    title="Dashboard"
                    subtitle={metadata?.full_name || metadata?.name || metadata?.user_name || metadata?.email || "Usuario"}
                    buttonLabel="Agregar inversión"
                    buttonLink="/add-investment"
                />

                <SimpleGrid cols={2} mb="md">
                    <CardNumber
                        title="Monto invertido:"
                        value={totalInvestments}
                        currency={currency.currency}
                    />
                    <CardNumber
                        title="Ganancia estimada:"
                        value={totalGains}
                        currency={currency.currency}
                    />
                </SimpleGrid>

                <Group gap="xs">
                    <Button
                        radius="xl"
                        variant="transparent"
                        px="xs"
                        size="sm"
                        color={filterType === 'ALL' ? "gray.9" : "gray.4"}
                        onClick={() => setFilterType('ALL')}
                    >
                        <Group gap="xs">
                            <Text inherit>Todos</Text>
                            <Badge>{investments?.length || 0}</Badge>
                        </Group>
                    </Button>
                    {types.map(type => (
                        <Button
                            key={type}
                            radius="xl"
                            variant="transparent"
                            px="xs"
                            size="sm"
                            color={filterType === type ? "gray.9" : "gray.4"}
                            onClick={() => setFilterType(type)}
                        >
                            {resolveToolName(type)}
                        </Button>
                    ))}
                </Group>

                <DashboardCard>
                    <TableInvestments
                        dataInvestments={filteredInvestments}
                        columns={columns}
                    />
                </DashboardCard>

                <SimpleGrid cols={3}>
                    <DashboardCard title="Perfil Inversor">
                        <InvestorProfile investments={investments ?? []} />
                    </DashboardCard>

                    <DashboardCard title="Próximos vencimientos">
                        {nextPayments.length > 0 ? (
                            nextPayments.map((inv) => {
                                const daysLeft = dayjs(inv.expiration_date).diff(dayjs(), "day");
                                return (
                                    <Card key={inv.id} p={0}>
                                        <Group justify="space-between">
                                            <Stack gap={0}>
                                                <Text fw={500}>{inv.name}</Text>
                                                <Text c={daysLeft <= 0 ? "red" : daysLeft <= 7 ? "orange" : "green"}>
                                                    {daysLeft <= 0 ? "Vencido" : `${daysLeft} días restantes`}
                                                </Text>
                                            </Stack>
                                            <Badge
                                                color={resolveToolColor(inv.type)}
                                                variant="light"
                                            >
                                                {resolveToolName(inv.type)}
                                            </Badge>
                                        </Group>

                                    </Card>
                                );
                            })
                        ) : (
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase" ta="center">No hay próximos vencimientos</Text>
                        )}
                    </DashboardCard>

                    <DashboardCard title="Blog">
                        <Text>Como maximizar tus inversiones</Text>
                        <Text>Que tipo de inversor sos?</Text>
                        <Text>Mejores Inversiones (Letras, Bonos, acciones)</Text>
                    </DashboardCard>
                </SimpleGrid>
            </ShellMain >
        </>
    );
}