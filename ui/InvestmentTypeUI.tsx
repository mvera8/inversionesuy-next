'use client';

import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { resolveToolName } from "@/utils/tools";
import { Investment } from "@/types/investment";
import { InvestmentTabs } from "@/components/InvestmentTabs";
import { InvestmentColumn, TableInvestments } from "@/components/TableInvestments";
import { ShellMain } from "@/components/ShellMain";
import { ShellNavbar } from "@/components/ShellNavbar";
import { DashboardTitle } from "@/components/DashboardTitle";
import { DashboardButton } from "@/components/DashboardButton";
import { AhorroSueldoUI } from "./AhorroSueldoUI";
import { NumberFormatter, Text } from "@mantine/core";
import { resolveInstitutionName } from "@/utils/banks";
import { CurrencyFormatter } from "@/components/CurrencyFormatter";
import { getInvestmentResult } from "@/utils/investment";
import { useCurrency } from "@/context/currency";
import dayjs from "dayjs";
import { PlazoFijoSimulator } from "@/simuladores/PlazoFijoSimulador";

interface InvestmentTypeUIProps {
    type: string;
    investments: Investment[];
}

export function InvestmentTypeUI({ type, investments }: InvestmentTypeUIProps) {
    const { currency } = useCurrency();

    const columns: InvestmentColumn[] = [
        { label: "Inversión", render: inv => <Text fw={500}>{inv.name}</Text> },
        { label: "Institución", render: inv => resolveInstitutionName(inv.institution) },
        { label: "Moneda", render: inv => inv.currency },
        { label: "Tasa", render: inv => inv.rate ? <NumberFormatter value={Number(inv.rate)} suffix="%" decimalScale={2} /> : '-' },
        { label: "Fecha Compra", render: inv => dayjs(inv.purchase_date).format('DD/MM/YYYY') },
        { label: "Fecha Vencimiento", render: inv => inv.expiration_date ? dayjs(inv.expiration_date).format('DD/MM/YYYY') : '-' },
        { label: "Invertido", render: inv => <CurrencyFormatter value={getInvestmentResult(inv).invested} currency={inv.currency} /> },
        { label: "Ganancia", render: inv => <Text c="green"><CurrencyFormatter value={getInvestmentResult(inv).gain} currency={currency} /></Text> },
    ];

    return (
        <>
            <ShellNavbar>
                {type !== 'ahorro_sueldo' && (
                    <CurrencySwitcher />
                )}
                <DashboardButton
                    label="Dashboard"
                    link="/dashboard"
                />
            </ShellNavbar>

            <ShellMain>
                <DashboardTitle
                    title={resolveToolName(type)}
                />
                {type === 'ahorro_sueldo' ? (
                    <AhorroSueldoUI
                        investments={investments}
                    />
                ) : (
                    <InvestmentTabs
                        investmentsContent={<TableInvestments dataInvestments={investments} columns={columns} />}
                        simulateContent={<PlazoFijoSimulator />}
                    />
                )}
            </ShellMain>
        </>
    );
}
