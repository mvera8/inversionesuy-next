import { Box, Text } from "@mantine/core";

export function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
    return (
        <Box
            p="sm"
        >
            <Text size="xs" tt="uppercase" fw={600} c="dimmed" lts={1}>
                {label}
            </Text>
            <Text
                size="lg"
                fw={700}
                c={accent ? "teal.4" : "dark"}
                ff="monospace"
                lh={1.3}
                mt={4}
            >
                {value}
            </Text>
        </Box>
    );
}