import { Card, Divider, Stack, Text, Title } from "@mantine/core";

export function DashboardCard({ children, title, description }: { children: React.ReactNode, title?: string, description?: string }) {
    return (
        <Card
            mb="md"
            radius="md"
            withBorder
        >
            {title && <>
                <Title order={5}>{title}</Title>
                {description && <Text size="sm" c="dimmed">{description}</Text>}
                <Divider my="xs" />
            </>}
            <Stack>
                {children}
            </Stack>
        </Card>
    );
}