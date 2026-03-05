'use client';

import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { resolveToolColor, resolveToolName } from "@/utils/tools";
import { Investment } from "@/types/investment";
import { InvestmentTabs } from "@/components/InvestmentTabs";
import { InvestmentColumn, TableInvestments } from "@/components/TableInvestments";
import { ShellMain } from "@/components/ShellMain";
import { ShellNavbar } from "@/components/ShellNavbar";
import { DashboardTitle } from "@/components/DashboardTitle";
import { DashboardButton } from "@/components/DashboardButton";
import { AhorroSueldoUI } from "./AhorroSueldoUI";
import { Badge, NumberFormatter, Text } from "@mantine/core";
import { resolveInstitutionName } from "@/utils/banks";
import dayjs from "dayjs";
import { CurrencyFormatter } from "@/components/CurrencyFormatter";
import { getInvestmentResult } from "@/utils/investment";
import { DashboardCard } from "@/components/DashboardCard";


interface InvestmentTypeUIProps {
    type: string;
    investments: Investment[];
}

const columns: InvestmentColumn[] = [
    { label: "Inversión", render: inv => <Text fw={500}>{inv.name}</Text> },
    { label: "Tipo", render: inv => <Badge color={resolveToolColor(inv.type)} variant="light">{resolveToolName(inv.type)}</Badge> },
    { label: "Institución", render: inv => resolveInstitutionName(inv.institution) },
    { label: "Moneda", render: inv => inv.currency },
    { label: "Tasa", render: inv => inv.rate ? <NumberFormatter value={Number(inv.rate)} suffix="%" decimalScale={2} /> : '-' },
    { label: "Fecha Compra", render: inv => dayjs(inv.purchase_date).format('DD/MM/YYYY') },
    { label: "Fecha Vencimiento", render: inv => inv.expiration_date ? dayjs(inv.expiration_date).format('DD/MM/YYYY') : '-' },
    { label: "Invertido", render: inv => <CurrencyFormatter value={getInvestmentResult(inv).invested} currency={inv.currency} /> },
    { label: "Ganancia", render: inv => <Text c="green"><CurrencyFormatter value={getInvestmentResult(inv).gain} currency={inv.currency} /></Text> },
];

export function InvestmentTypeUI({ type, investments }: InvestmentTypeUIProps) {
    return (
        <>
            <ShellNavbar>
                <CurrencySwitcher />
                <DashboardButton
                    label="Dashboard"
                    link="/dashboard"
                />
            </ShellNavbar>

            <ShellMain>
                <DashboardTitle
                    title={resolveToolName(type)}
                />

                <DashboardCard>
                    {type === 'ahorro_sueldo' ? (
                        <AhorroSueldoUI
                            investments={investments}
                        />
                    ) : (
                        <InvestmentTabs
                            investmentsContent={<TableInvestments dataInvestments={investments} columns={columns} />}
                        />
                    )}
                </DashboardCard>


            </ShellMain>
        </>
    );
}
