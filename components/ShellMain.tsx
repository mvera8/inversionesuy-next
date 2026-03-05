import { AppShell, Container } from "@mantine/core";

export function ShellMain({ children, size = 'xl' }: { children: React.ReactNode, size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' }) {
    return (
        <AppShell.Main pt="var(--app-shell-header-height)">
            <Container
                size={size}
                py="md"
            >
                {children}
            </Container>
        </AppShell.Main>
    );
}