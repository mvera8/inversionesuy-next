// app/(protected)/layout.tsx
import { DashboardShell } from "@/components/DashboardShell";
import { CurrencyProvider } from "@/context/currency";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <CurrencyProvider>
            <DashboardShell>
                {children}
            </DashboardShell>
        </CurrencyProvider>
    );
}