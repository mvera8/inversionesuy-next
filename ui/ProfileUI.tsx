'use client';

import { Text, Stack, Group, Avatar, ThemeIcon, Button, Modal, SimpleGrid, Title } from "@mantine/core";
import { IconMail, IconCalendar, IconFingerprint, IconShield, IconDeviceLaptop, IconChevronLeft } from "@tabler/icons-react";
import { User } from "@supabase/supabase-js";
import { DashboardButton } from "@/components/DashboardButton";
import { ShellNavbar } from "@/components/ShellNavbar";
import { ShellMain } from "@/components/ShellMain";
import { useRouter } from 'next/navigation';
import { DashboardTitle } from "@/components/DashboardTitle";
import { DashboardCard } from "@/components/DashboardCard";
import dayjs from "dayjs";
import { useDisclosure } from "@mantine/hooks";

interface ProfileUIProps {
    user: User;
}

export function ProfileUI({ user }: ProfileUIProps) {
    const [opened, { open, close }] = useDisclosure(false);
    const router = useRouter();
    const metadata = user.user_metadata;
    console.log('metadata', metadata);
    const userName = metadata?.full_name || metadata?.name || metadata?.user_name || metadata?.email || "Usuario";
    const createdAt = dayjs(user.created_at).format("DD/MM/YYYY HH:mm");

    return (
        <>
            <ShellNavbar>
                <DashboardButton
                    label="Back"
                    onClick={() => router.back()}
                    icon={<IconChevronLeft />}
                    size="sm"
                />
            </ShellNavbar>
            <ShellMain
                size="xs"
            >

                <Group>
                    <Avatar
                        src={user?.user_metadata?.avatar_url || false}
                        alt={userName}
                        name={userName}
                        radius={80}
                        mb="md"
                        size={80}
                    />
                    <DashboardTitle
                        title="Usuario"
                        subtitle={userName}
                    />
                </Group>

                <DashboardCard
                    title="Información de la Cuenta"
                >
                    <Stack gap="md">
                        <Group wrap="nowrap" align="flex-start">
                            <ThemeIcon variant="light" size="lg" radius="md">
                                <IconFingerprint size={20} />
                            </ThemeIcon>
                            <div>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">ID de Usuario</Text>
                                <Text size="sm">{user.id}</Text>
                            </div>
                        </Group>

                        <Group wrap="nowrap" align="flex-start">
                            <ThemeIcon variant="light" size="lg" radius="md" color="teal">
                                <IconMail size={20} />
                            </ThemeIcon>
                            <div>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Correo Electrónico</Text>
                                <Text size="sm">{user.email}</Text>
                            </div>
                        </Group>

                        <Group wrap="nowrap" align="flex-start">
                            <ThemeIcon variant="light" size="lg" radius="md" color="orange">
                                <IconCalendar size={20} />
                            </ThemeIcon>
                            <div>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Miembro desde</Text>
                                <Text size="sm">{createdAt}</Text>
                            </div>
                        </Group>

                        <Group wrap="nowrap" align="flex-start">
                            <ThemeIcon variant="light" size="lg" radius="md" color="indigo">
                                <IconShield size={20} />
                            </ThemeIcon>
                            <div>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Estado</Text>
                                <Text size="sm">{user.aud || "Authenticated"}</Text>
                            </div>
                        </Group>

                        <Group wrap="nowrap" align="flex-start">
                            <ThemeIcon variant="light" size="lg" radius="md" color="yellow">
                                <IconDeviceLaptop size={20} />
                            </ThemeIcon>
                            <div>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Último inicio de sesión</Text>
                                <Text size="sm">{user.last_sign_in_at ? dayjs(user.last_sign_in_at).format("DD/MM/YYYY HH:mm") : "N/A"}</Text>
                            </div>
                        </Group>
                    </Stack>
                </DashboardCard>
                <DashboardCard
                    title="Eliminar Cuenta"
                >
                    <Group justify="space-between">
                        <Text>
                            Esta acción no tiene vuelta atrás.
                        </Text>
                        <Button
                            variant="outline"
                            color="red"
                            onClick={open}
                        >
                            Eliminar Cuenta
                        </Button>
                    </Group>
                </DashboardCard>
            </ShellMain>

            <Modal
                opened={opened}
                onClose={close}
                title="Eliminar Cuenta"
            >
                <Stack>
                    <Title order={3}>
                        ¿Estás seguro de que quieres eliminar tu cuenta?
                    </Title>
                    <Text>
                        Esta acción no tiene vuelta atrás. Estas seguro que deseas continuar?
                    </Text>
                    <SimpleGrid cols={2}>
                        <Button
                            variant="light"
                            color="gray"
                            onClick={close}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="light"
                            color="red"
                            onClick={close}
                        >
                            Eliminar Cuenta
                        </Button>
                    </SimpleGrid>
                </Stack>
            </Modal>
        </>
    );
}
