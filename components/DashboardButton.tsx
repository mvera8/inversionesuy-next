import { Button } from "@mantine/core";
import Link from "next/link";

export function DashboardButton({
    label,
    link,
    icon,
    justify = "start",
    size = "sm",
    onClick
}: {
    label: string,
    link?: string,
    icon?: React.ReactNode,
    justify?: "start" | "center" | "end",
    size?: "xs" | "sm" | "md" | "lg" | "xl",
    onClick?: () => void
}) {
    return (
        <Button
            component={(link ? Link : "button") as any}
            {...(link ? { href: link } : {})}
            size={size}
            justify={justify}
            leftSection={icon}
            style={{ textTransform: 'capitalize' }}
            onClick={onClick}
        >
            {label}
        </Button>
    );
}