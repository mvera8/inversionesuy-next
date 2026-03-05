'use client';

import { AppShell, ScrollArea, Stack } from "@mantine/core";
import Ads from "./Ads";

export function ShellNavbar({ children }: { children: React.ReactNode }) {
    return (
        <AppShell.Navbar>
            <AppShell.Section grow my="md" component={ScrollArea} px="md">
                <Stack gap="sm">
                    {children}
                </Stack>
            </AppShell.Section>


            <AppShell.Section p="md">
                <Ads />
            </AppShell.Section>
        </AppShell.Navbar>
    );
}