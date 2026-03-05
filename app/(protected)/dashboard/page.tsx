import { createClient } from "@/utils/supabase/server";
import { getInvestments } from "@/lib/actions/investments";
import { DashboardUI } from "@/ui/DashboardUI";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const response = await getInvestments();
    const investments = response.success && response.data ? response.data : null;

    return (
        <DashboardUI user={user} investments={investments} />
    );
}