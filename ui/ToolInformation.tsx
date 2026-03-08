import { resolveToolColor, resolveToolName } from "@/utils/tools";
import { Card, Group, Text, ThemeIcon } from "@mantine/core";
import tools from "@/data/tools";

interface ToolInformationProps {
    type: string;
}

export function ToolInformation({ type }: ToolInformationProps) {
    const tool = tools.find((t) => t.value === type);

    if (!tool) {
        return null;
    }

    return (
        <Card withBorder>
            <Group>
                <div>
                    <Text size="lg" fw={700}>
                        {resolveToolName(tool.value)}
                    </Text>
                    <Text size="sm" c="dimmed">
                        {tool.description}
                    </Text>
                </div>
            </Group>
        </Card>
    );
}