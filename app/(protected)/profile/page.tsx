import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProfileUI } from "@/ui/ProfileUI";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return <ProfileUI user={user} />;
}