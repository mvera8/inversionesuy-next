import tools from '@/data/tools';

export function resolveToolName(toolValue: string): string {
    return tools.find((t) => t.value === toolValue)?.label || toolValue;
}

// tool color
export function resolveToolColor(toolValue: string): string {
    return tools.find((t) => t.value === toolValue)?.color || 'gray';
}