'use server'

import { createClient } from '@/utils/supabase/server'

export async function getUSDRate(): Promise<number> {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('daily_values')
            .select('value')
            .eq('key', 'USD')
            .single()

        if (error || !data) return 1
        return Number(data.value)
    } catch {
        return 1
    }
}
