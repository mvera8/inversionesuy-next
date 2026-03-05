'use client';

import { DashboardButton } from "@/components/DashboardButton";
import { DashboardTitle } from "@/components/DashboardTitle";
import { InvestmentForm } from "@/components/InvestmentForm";
import { ShellMain } from "@/components/ShellMain";
import { ShellNavbar } from "@/components/ShellNavbar";

export function AddInvestmentUI() {
    return (
        <>
            <ShellNavbar>
                <DashboardButton
                    label="Dashboard"
                    link="/dashboard"
                />
            </ShellNavbar>
            <ShellMain
                size="xs"
            >
                <DashboardTitle
                    title="Agregar Inversión"
                />
                <InvestmentForm />
            </ShellMain>
        </>
    );
}