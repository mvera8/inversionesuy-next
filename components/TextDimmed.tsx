import { Text } from "@mantine/core";

export const TextDimmed = ({ children }: { children: React.ReactNode }) => {
    return (
        <Text size="xs" c="dimmed" fw={700} tt="uppercase">
            {children}
        </Text>
    );
};