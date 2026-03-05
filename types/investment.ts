export interface Investment {
    id: string;
    user_id: string;
    name: string;
    type: 'letra' | 'plazo_fijo' | 'crypto' | 'bono' | 'ahorro_sueldo';
    subtype?: string;
    currency: 'UYU' | 'USD' | 'UI';
    amount_nominal: number;
    purchase_date: string;
    institution: string;
    rate?: number;
    expiration_date?: string;
    renewable?: boolean;
    purchase_price?: number;
    created_at?: string;
}
