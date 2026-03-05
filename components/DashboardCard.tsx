import { Card, Divider, Stack, Title } from "@mantine/core";

export function DashboardCard({ children, title }: { children: React.ReactNode, title?: string }) {
    return (
        <Card
            mb="md"
            radius="md"
            withBorder
        >
            {title && <>
                <Title order={5}>{title}</Title>
                <Divider my="xs" />
            </>}
            <Stack>
                {children}
            </Stack>
        </Card>
    );
}