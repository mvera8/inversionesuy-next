import { DashboardShellUI } from "@/ui/DashboardShellUI";
import { createClient } from "@/utils/supabase/server";

export async function DashboardShell({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <DashboardShellUI user={user}>
            {children}
        </DashboardShellUI>
    );
}