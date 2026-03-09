// app/(protected)/dashboard/page.tsx
import { createClient } from "@/utils/supabase/server";
import { getInvestments } from "@/lib/actions/investments";
import { DashboardUI } from "@/ui/DashboardUI";
import { getUSDRate } from "@/lib/actions/dailyValues";

export default async function DashboardPage() {
    // app/(protected)/layout.tsx
    const usdRate = await getUSDRate();
    console.log('usdRate from DB:', usdRate); // log server-side, aparece en terminal

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const response = await getInvestments();
    const investments = response.success && response.data ? response.data : null;

    return (
        <DashboardUI user={user} investments={investments} />
    );
}