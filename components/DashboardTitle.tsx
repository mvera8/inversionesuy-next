import { Group, Stack, Text, Title } from "@mantine/core";
import { DashboardButton } from "./DashboardButton";

export function DashboardTitle({ title, subtitle, buttonLabel, buttonLink }: { title: string, subtitle?: string, buttonLabel?: string, buttonLink?: string }) {
    return (
        <Group justify="space-between" mb="md">
            <Stack gap={1}>
                <Title order={1}>
                    {title}
                </Title>
                {subtitle && <Text c="dimmed">Hola {subtitle}</Text>}
            </Stack>

            {buttonLabel && buttonLink && (
                <DashboardButton
                    label={buttonLabel}
                    link={buttonLink}
                    size="lg"
                />
            )}
        </Group>
    );
}