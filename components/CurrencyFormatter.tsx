import { NumberFormatter } from "@mantine/core";

export const CurrencyFormatter = ({ value, currency }: { value: number; currency: string }) => {
    const symbol = currency === 'UYU' ? '$ ' : 'U$S ';
    return (
        <NumberFormatter
            value={value}
            prefix={symbol}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={1}
            fixedDecimalScale
        />
    );
};