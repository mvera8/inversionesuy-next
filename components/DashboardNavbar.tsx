"use client";

import { Avatar, Button, Container, Group } from "@mantine/core";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { CurrencySwitcher } from "./CurrencySwitcher";
import Link from "next/link";

const links = [
    {
        href: "/dashboard",
        label: "Dashboard",
    },
    {
        href: "/add-investment",
        label: "Add Investment",
    },
];

export function DashboardNavbar({ user }: { user: User | null }) {
    const supabase = createClient();
    const router = useRouter();

    return (
        <Container size="xl" py="md">
            <Group justify="space-between">
                <Group gap="xs">
                    {links.map((link) => (
                        <Button
                            key={link.href}
                            component="a"
                            href={link.href}
                            variant="subtle"
                            size="sm"
                        >
                            {link.label}
                        </Button>
                    ))}
                </Group>
                <Group gap="xs">
                    <CurrencySwitcher />
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
                    <Link href="/profile">
                        <Avatar
                            src={user?.user_metadata?.avatar_url || false}
                            alt={user?.email || "user avatar"}
                            name={user?.email || "user avatar"}
                            radius="xl"
                        />
                    </Link>
                </Group>
            </Group>
        </Container>
    );
}