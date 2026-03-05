'use client';

import { Card, Text } from "@mantine/core";
import { CurrencyFormatter } from "./CurrencyFormatter";
import { TextDimmed } from "./TextDimmed";

export function CardNumber({ title, value, currency }: { title: string, value: number, currency: string }) {
    return (
        <Card withBorder shadow="sm" radius="md" p="md">
            <TextDimmed>
                {title}
            </TextDimmed>
            <Text size="xl" fw={500}>
                <CurrencyFormatter
                    value={value}
                    currency={currency}
                />
            </Text>
        </Card>
    );
}