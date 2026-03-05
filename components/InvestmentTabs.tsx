'use client';

import { Tabs } from "@mantine/core";
import { IconBookmarkFilled, IconDashboardFilled, IconTableFilled } from "@tabler/icons-react";
import { ReactNode } from "react";

interface InvestmentTabsProps {
    investmentsContent: ReactNode;
    simulateContent?: ReactNode;
    informationContent?: ReactNode;
}

export function InvestmentTabs({
    investmentsContent,
    simulateContent,
    informationContent
}: InvestmentTabsProps) {
    return (
        <Tabs
            defaultValue="investments"
            variant="pills"
        >
            <Tabs.List>
                <Tabs.Tab
                    value="investments"
                    leftSection={<IconTableFilled size={18} />}
                >
                    Inversiones
                </Tabs.Tab>
                {simulateContent && (
                    <Tabs.Tab
                        value="simulate"
                        leftSection={<IconDashboardFilled size={18} />}
                    >
                        Simular
                    </Tabs.Tab>
                )}
                {informationContent && (
                    <Tabs.Tab
                        value="information"
                        leftSection={<IconBookmarkFilled size={18} />}
                    >
                        Información
                    </Tabs.Tab>
                )}
            </Tabs.List>

            <Tabs.Panel value="investments">
                {investmentsContent}
            </Tabs.Panel>

            {simulateContent && (
                <Tabs.Panel value="simulate">
                    {simulateContent}
                </Tabs.Panel>
            )}

            {informationContent && (
                <Tabs.Panel value="information">
                    {informationContent}
                </Tabs.Panel>
            )}
        </Tabs>
    );
}
