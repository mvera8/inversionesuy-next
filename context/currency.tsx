"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'UYU' | 'USD';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    usdRate: number;
    uiRate: number;
}

const DEFAULT_CURRENCY: Currency = 'UYU';

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children, usdRate, uiRate }: { children: ReactNode; usdRate: number, uiRate: number }) {
    const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);

    useEffect(() => {
        const savedCurrency = localStorage.getItem('app-currency') as Currency;
        if (savedCurrency && ['UYU', 'USD', 'UI'].includes(savedCurrency)) {
            setCurrencyState(savedCurrency);
        }
    }, []);

    const setCurrency = (newCurrency: Currency) => {
        setCurrencyState(newCurrency);
        localStorage.setItem('app-currency', newCurrency);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, usdRate, uiRate }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}