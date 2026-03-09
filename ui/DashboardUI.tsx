'use client';

import { useState, useMemo } from "react";
import { Button, Text, SimpleGrid, Group, Badge, Card, Stack, ThemeIcon, SegmentedControl } from "@mantine/core";
import { Investment } from "@/types/investment";
import { resolveToolColor, resolveToolName } from "@/utils/tools";
import { IconPlus, IconPointFilled } from "@tabler/icons-react";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { CardNumber } from "@/components/CardNumber";
import { InvestmentColumn, TableInvestments } from "@/components/TableInvestments";
import { DashboardButton } from "@/components/DashboardButton";
import { ShellNavbar } from "@/components/ShellNavbar";
import { ShellMain } from "@/components/ShellMain";
import { DashboardCard } from "@/components/DashboardCard";
import { DashboardTitle } from "@/components/DashboardTitle";
import { useCurrency } from "@/context/currency";
import { InvestorProfile } from "@/components/InvestorProfile";
import { getInvestmentResult } from "@/utils/investment";
import { resolveInstitutionName } from "@/utils/banks";
import { CurrencyFormatter } from "@/components/CurrencyFormatter";
import { convertAmount } from "@/utils/currency";
import dayjs from "dayjs";

interface DashboardClientProps {
    user: any;
    investments: Investment[] | null;
}

type StatusFilter = 'ALL' | 'active' | 'expired';

export function DashboardUI({ user, investments }: DashboardClientProps) {
    const { currency, usdRate, uiRate } = useCurrency();
    const metadata = user.user_metadata;

    const [filterType, setFilterType] = useState<string | 'ALL'>('ALL');
    const [filterMoneda, setFilterMoneda] = useState<string>('ALL');
    const [filterStatus, setFilterStatus] = useState<StatusFilter>('ALL');

    const types = useMemo(() => {
        if (!investments) return [];
        return Array.from(new Set(investments.map(inv => inv.type))).filter(Boolean);
    }, [investments]);

    // Monedas disponibles en las inversiones
    const monedas = useMemo(() => {
        if (!investments) return [];
        return Array.from(new Set(investments.map(inv => String(inv.currency).toUpperCase()))).filter(Boolean);
    }, [investments]);

    const nextPayments = useMemo(() => {
        if (!investments) return [];
        return investments
            .filter(inv => inv.expiration_date && dayjs(inv.expiration_date).isAfter(dayjs()))
            .sort((a, b) => new Date(a.expiration_date!).getTime() - new Date(b.expiration_date!).getTime())
            .slice(0, 4);
    }, [investments]);

    const filteredInvestments = useMemo(() => {
        if (!investments) return [];
        return investments.filter(inv => {
            if (filterType !== 'ALL' && inv.type !== filterType) return false;
            if (filterMoneda !== 'ALL' && String(inv.currency).toUpperCase() !== filterMoneda) return false;
            if (filterStatus === 'active') {
                if (inv.expiration_date && dayjs(inv.expiration_date).isBefore(dayjs())) return false;
            }
            if (filterStatus === 'expired') {
                if (!inv.expiration_date || dayjs(inv.expiration_date).isAfter(dayjs())) return false;
            }
            return true;
        });
    }, [investments, filterType, filterMoneda, filterStatus]);

    const totalInvestments = useMemo(() => {
        return filteredInvestments
            .filter(inv => !inv.expiration_date || dayjs(inv.expiration_date).isAfter(dayjs()))
            .reduce((acc, inv) => {
                const { invested } = getInvestmentResult(inv);
                return acc + convertAmount(invested, inv.currency, currency, usdRate);
            }, 0);
    }, [filteredInvestments, currency, usdRate]);

    const totalGains = useMemo(() => {
        return filteredInvestments
            .filter(inv => !inv.expiration_date || dayjs(inv.expiration_date).isAfter(dayjs()))
            .reduce((acc, inv) => {
                const { gain } = getInvestmentResult(inv);
                return acc + convertAmount(gain, inv.currency, currency, usdRate);
            }, 0);
    }, [filteredInvestments, currency, usdRate]);

    const columns: InvestmentColumn[] = [
        {
            label: "Nombre", render: inv => {
                const vencido = dayjs(inv.expiration_date).isBefore(dayjs());
                return (
                    <Group>
                        <ThemeIcon variant="light" radius="xl" color={vencido ? "red" : "lime"}>
                            <IconPointFilled style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Text fw={500} c={vencido ? "dimmed" : "dark"}>{inv.name}</Text>
                    </Group>
                );
            }
        },
        {
            label: "Tipo",
            render: inv => <Badge color={resolveToolColor(inv.type)} variant="light">
                {resolveToolName(inv.type)}
            </Badge>
        },
        { label: "Institución", render: inv => resolveInstitutionName(inv.institution) },
        {
            label: "Monto",
            description: "Monto invertido o Monto por mes.",
            render: inv => <CurrencyFormatter value={convertAmount(inv.amount_nominal, inv.currency, inv.currency === 'UI' ? 'UYU' : inv.currency, usdRate, uiRate)} currency={inv.currency} />
        },
        { label: "Invertido", render: inv => <CurrencyFormatter value={convertAmount(getInvestmentResult(inv).invested, inv.currency, currency, usdRate, uiRate)} currency={currency} /> },
        { label: "Ganancia", render: inv => <Text c="green"><CurrencyFormatter value={convertAmount(getInvestmentResult(inv).gain, inv.currency, currency, usdRate, uiRate)} currency={currency} /></Text> },
    ];

    return (
        <>
            <ShellNavbar>
                <CurrencySwitcher />
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">menu</Text>
                <DashboardButton
                    label="Agregar inversión"
                    link="/add-investment"
                    justify="center"
                    size="lg"
                    icon={<IconPlus />}
                />
                {types.length > 0 && (
                    <>
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase">Inversiones</Text>
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
                    <CardNumber title="Monto invertido:" value={totalInvestments} currency={currency} />
                    <CardNumber title="Ganancia estimada:" value={totalGains} currency={currency} />
                </SimpleGrid>

                {/* Filtros */}
                <Group gap="xs" mb="xs" wrap="wrap">
                    {/* Por tipo */}
                    <Button
                        radius="xl" variant="transparent" px="xs" size="sm"
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
                            radius="xl" variant="transparent" px="xs" size="sm"
                            color={filterType === type ? "gray.9" : "gray.4"}
                            onClick={() => setFilterType(type)}
                        >
                            {resolveToolName(type)}
                        </Button>
                    ))}
                </Group>

                <Group gap="sm" mb="md" wrap="wrap">
                    {/* Por moneda */}
                    <SegmentedControl
                        size="xs"
                        value={filterMoneda}
                        onChange={setFilterMoneda}
                        data={[
                            { label: 'Todas', value: 'ALL' },
                            ...monedas.map(m => ({ label: m, value: m })),
                        ]}
                    />

                    {/* Por estado */}
                    <SegmentedControl
                        size="xs"
                        value={filterStatus}
                        onChange={(v) => setFilterStatus(v as StatusFilter)}
                        data={[
                            { label: 'Todos', value: 'ALL' },
                            { label: 'Activas', value: 'active' },
                            { label: 'Vencidas', value: 'expired' },
                        ]}
                    />
                </Group>

                <TableInvestments dataInvestments={filteredInvestments} columns={columns} />

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
                                                <Text size="sm" c={daysLeft <= 7 ? "orange" : "green"}>
                                                    {daysLeft} días restantes
                                                </Text>
                                            </Stack>
                                            <Badge color={resolveToolColor(inv.type)} variant="light">
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
            </ShellMain>
        </>
    );
}