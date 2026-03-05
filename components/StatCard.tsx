import { Box, Card, NumberFormatter, Text } from "@mantine/core";
import { TextDimmed } from "./TextDimmed";

export function StatCard({ label, value, accent, currency }: { label: string; value: string | number; accent?: boolean; currency?: string }) {
    return (
        <Card
            p="xs"
            bg="gray.0"
            radius="md"
        >
            <TextDimmed>
                {label}
            </TextDimmed>
            <Text
                size="lg"
                fw={700}
                c={accent ? "teal.4" : "dark"}
                ff="monospace"
                lh={1.3}
                mt={4}
            >
                {currency && typeof value === "number" ? (
                    <NumberFormatter prefix={`${currency} `} value={value} thousandSeparator />
                ) : (
                    value
                )}
            </Text>
        </Card>
    );
}