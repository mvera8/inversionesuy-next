'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Investment } from '@/types/investment'

const dateSchema = z.preprocess((arg) => {
    if (arg instanceof Date) return arg.toISOString();
    if (arg === null) return undefined;
    return arg;
}, z.string().optional());

const investmentSchema = z.object({
    type: z.enum(['letra', 'plazo_fijo', 'crypto', 'bono', 'ahorro_sueldo']),
    subtype: z.string().optional(),
    currency: z.enum(['UYU', 'USD', 'UI']),
    amount_nominal: z.number().positive(),
    purchase_date: dateSchema,
    institution: z.string().min(1),
    name: z.string().min(2),
    rate: z.number().optional(),
    purchase_price: z.number().optional(),
    expiration_date: dateSchema.optional(),
    renewable: z.boolean().optional(),
})

export async function getInvestments(type?: string): Promise<{ success: boolean; data?: Investment[]; error?: string }> {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { success: false, error: 'No autorizado' }

        let query = supabase
            .from('investments')
            .select('*')
            .eq('user_id', user.id)

        if (type) {
            query = query.eq('type', type)
        }

        const { data, error } = await query.order('created_at', { ascending: false })

        if (error) return { success: false, error: error.message }

        return { success: true, data: data as Investment[] }

    } catch (error) {
        return { success: false, error: String(error) }
    }
}

export async function getInvestment(id: string) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { success: false, error: 'No autorizado' } // ✅ return, no throw

        const { data, error } = await supabase
            .from('investments')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) return { success: false, error: error.message }

        return { success: true, data }

    } catch (error) {
        // Captura ZodError u otros errores inesperados
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message }
        }
        return { success: false, error: String(error) }
    }
}

export async function updateInvestment(id: string, formData: unknown) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { success: false, error: 'No autorizado' } // ✅ return, no throw

        const validatedData = investmentSchema.parse(formData) // puede tirar ZodError

        const { data, error } = await supabase
            .from('investments')
            .update([{ ...validatedData, user_id: user.id }])
            .eq('id', id)
            .select()

        if (error) return { success: false, error: error.message }

        revalidatePath('/dashboard')
        return { success: true, data }

    } catch (error) {
        // Captura ZodError u otros errores inesperados
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message }
        }
        return { success: false, error: String(error) }
    }
}

export async function deleteInvestment(id: string) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { success: false, error: 'No autorizado' } // ✅ return, no throw

        const { data, error } = await supabase
            .from('investments')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)
            .select()

        if (error) return { success: false, error: error.message }

        revalidatePath('/dashboard')
        return { success: true, data }

    } catch (error) {
        // Captura ZodError u otros errores inesperados
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message }
        }
        return { success: false, error: String(error) }
    }
}

export async function createInvestment(formData: unknown) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { success: false, error: 'No autorizado' } // ✅ return, no throw

        const validatedData = investmentSchema.parse(formData) // puede tirar ZodError

        const { data, error } = await supabase
            .from('investments')
            .insert([{ ...validatedData, user_id: user.id }])
            .select()

        if (error) return { success: false, error: error.message }

        revalidatePath('/dashboard')
        return { success: true, data }

    } catch (error) {
        // Captura ZodError u otros errores inesperados
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message }
        }
        return { success: false, error: String(error) }
    }
}