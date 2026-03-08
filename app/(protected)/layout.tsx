// app/(protected)/layout.tsx
import { DashboardShell } from "@/components/DashboardShell";
import { CurrencyProvider } from "@/context/currency";
import { getUSDRate } from "@/lib/actions/dailyValues";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const usdRate = await getUSDRate();

    return (
        <CurrencyProvider usdRate={usdRate}>
            <DashboardShell>
                {children}
            </DashboardShell>
        </CurrencyProvider>
    );
}