import { NumberFormatter } from "@mantine/core";

const SYMBOL: Record<string, string> = {
    UYU: '$ ',
    USD: 'U$S ',
    UI: 'UI ',
};

export const CurrencyFormatter = ({ value, currency }: { value: number; currency: string }) => {
    const symbol = SYMBOL[currency] ?? '$ ';
    return (
        <NumberFormatter
            value={value}
            prefix={symbol}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale
        />
    );
};