"use client";

import { AppShell, Avatar, Burger, Button, Group, Text } from "@mantine/core";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

interface DashboardShellUIProps {
    children: React.ReactNode;
    user: User | null;
}

export function DashboardShellUI({ children, user }: DashboardShellUIProps) {
    const metadata = user?.user_metadata;
    const userName = metadata?.full_name || metadata?.name || metadata?.user_name || metadata?.email || "Usuario";
    const supabase = createClient();
    const router = useRouter();

    // mantine
    const pinned = useHeadroom({ fixedAt: 120 });
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    return (
        <AppShell
            header={{
                height: 60,
                collapsed: !pinned,
            }}
            navbar={{
                width: 310,
                breakpoint: 'sm',
                collapsed: {
                    mobile: !mobileOpened,
                    desktop: !desktopOpened
                },
            }}
            padding="md"
        >
            <AppShell.Header px="md">
                <Group h="100%" justify="space-between">
                    <Group>
                        <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                        <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                        <Link href="/">
                            <Text
                                size="lg"
                                fw={700}
                            >LOGO</Text>
                        </Link>
                    </Group>

                    <Group gap="xs">
                        <Button
                            component="a"
                            href="/profile"
                            variant="default"
                        >
                            <Group
                                gap="xs"
                            >
                                <Avatar
                                    src={user?.user_metadata?.avatar_url || false}
                                    alt={userName}
                                    name={userName}
                                    radius={80}
                                    size="sm"
                                />
                                <Text
                                    size="sm"
                                    truncate="end"
                                >{userName}</Text>
                            </Group>
                        </Button>
                        <Button
                            variant="light"
                            color="red"
                            onClick={async () => {
                                await supabase.auth.signOut();
                                router.push('/login');
                                router.refresh();
                            }}
                        >
                            Logout
                        </Button>
                    </Group>
                </Group>
            </AppShell.Header>

            {children}
        </AppShell>
    );
}
