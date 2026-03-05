"use client";

import { SegmentedControl } from '@mantine/core';
import { useCurrency, Currency } from '../context/currency';

export function CurrencySwitcher() {
    const { currency, setCurrency } = useCurrency();

    return (
        <SegmentedControl
            value={currency}
            onChange={(value) => setCurrency(value as Currency)}
            data={[
                { label: 'UYU', value: 'UYU' },
                { label: 'USD', value: 'USD' },
            ]}
            size="sm"
            transitionDuration={500}
            transitionTimingFunction="linear"
            fullWidth
        />
    );
}
