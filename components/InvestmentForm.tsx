'use client'

import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, NumberInput, Select, Button, Group, Text, SimpleGrid, Switch, Stack, Divider } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { createInvestment, updateInvestment } from '@/lib/actions/investments';
import { DateInput } from '@mantine/dates';
import { listBanks } from '@/utils/banks';
import { listExchanges } from '@/utils/exchanges';
import tools from '@/data/tools';

import { Investment } from '@/types/investment';

interface InvestmentFormProps {
    investment?: Investment;
    onSuccess?: () => void;
}

function ensureDate(date: any): Date | null {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    return isNaN(d.getTime()) ? null : d;
}

function SubtypeField({ type, form }: { type: string; form: any }) {
    switch (type) {
        case 'plazo_fijo':
            return <Select
                label="Frecuencia de pago"
                data={[
                    { value: 'vencimiento', label: 'Pago al vencimiento' },
                    { value: 'mensual', label: 'Mensual' },
                ]}
                defaultValue="Pago al vencimiento"
                {...form.getInputProps('subtype')}
            />;
        case 'crypto':
            return <TextInput
                label="Subtipo (Crypto)"
                placeholder='BTC, ETH, etc...'
                {...form.getInputProps('subtype')}
            />;
        default:
            return null;
    }
}

function ExpirationDateField({ type, form }: { type: string; form: any }) {
    const purchase_date = ensureDate(form.values.purchase_date);
    const oneYearLater = purchase_date
        ? new Date(purchase_date.getFullYear() + 1, purchase_date.getMonth(), purchase_date.getDate())
        : null;

    switch (type) {
        case 'ahorro_sueldo':
            return (
                <DateInput
                    withAsterisk
                    disabled
                    label="Fecha de Vencimiento"
                    value={oneYearLater}
                    onChange={() => { }}
                />
            );
        default:
            return (
                <DateInput
                    label="Fecha de Vencimiento"
                    {...form.getInputProps('expiration_date')}
                />
            );
    }
}

export function InvestmentForm({ investment, onSuccess }: InvestmentFormProps) {
    const router = useRouter();
    const isEdit = !!investment;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const form = useForm({
        initialValues: {
            type: investment?.type || 'plazo_fijo',
            name: investment?.name || '',
            institution: investment?.institution || '',
            subtype: investment?.subtype || 'vencimiento',
            currency: investment?.currency || 'UYU',
            amount_nominal: investment?.amount_nominal || 0,
            purchase_date: investment?.purchase_date ? new Date(investment.purchase_date) : new Date(),
            rate: investment?.rate || 0,
            expiration_date: investment?.expiration_date ? new Date(investment.expiration_date) : null,
            renewable: investment?.renewable || false,
            purchase_price: investment?.purchase_price || 0,
        },
        validate: {
            name: (value) => (value.length < 2 ? 'Name must be at least 2 characters long' : null),
            type: (value) => (value.length < 2 ? 'Type must be at least 2 characters long' : null),
            rate: (value, values) => (values.type !== 'crypto' && values.type !== 'other' && value <= 0 ? 'Rate must be more than 0' : null),
            amount_nominal: (value) => (value <= 0 ? 'Amount must be more than 0' : null),
            institution: (value) => (value.length < 0 ? 'Must select an option' : null),
        },
    });

    // debajo de useForm(...)
    useEffect(() => {
        const d = ensureDate(form.values.purchase_date);
        if (form.values.type === 'ahorro_sueldo' && d) {
            const newExpirationDate = new Date(d.getFullYear() + 1, d.getMonth(), d.getDate());

            // Only update if the value is different to avoid infinite loops
            const currentExpirationDate = ensureDate(form.values.expiration_date);
            if (!currentExpirationDate || currentExpirationDate.getTime() !== newExpirationDate.getTime()) {
                form.setFieldValue('expiration_date', newExpirationDate);
            }
        }
    }, [form.values.purchase_date, form.values.type, form.values.expiration_date]);


    const handleSubmit = async (values: any) => {
        console.log('Enviando formulario con valores:', values);
        setLoading(true);
        setError(null);
        try {
            const result = isEdit
                ? await updateInvestment(investment.id, values)
                : await createInvestment(values);

            console.log('Resultado de la operación:', result);

            if (result.success) {
                if (!isEdit) {
                    form.reset();
                    router.push('/dashboard');
                }
                onSuccess?.();
            } else {
                setError(result.error || 'Ocurrió un error desconocido');
            }
        } catch (error) {
            console.error('Error capturado en handleSubmit:', error);
            setError('Error inesperado: ' + String(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit, (validationErrors) => {
            console.log('Errores de validación del formulario:', validationErrors);
        })}>
            <Stack gap="sm">
                <Select
                    withAsterisk
                    label="Tipo de Inversión"
                    data={tools.map(t => ({ value: t.value, label: t.label }))}
                    {...form.getInputProps('type')}
                />

                <TextInput
                    withAsterisk
                    placeholder='Ej: Patente, Cumpleaños, etc'
                    label="Nombre de la Inversión"
                    {...form.getInputProps('name')}
                />

                <Select
                    withAsterisk
                    label="Institución / Exchange"
                    placeholder='- Select -'
                    data={
                        form.values.type === 'crypto' ?
                            listExchanges().map(e => ({ value: e.id, label: e.label })) :
                            listBanks().map(b => ({ value: b.id, label: b.label }))
                    }
                    {...form.getInputProps('institution')}
                />

                {form.values.type !== 'crypto' && form.values.type !== 'other' && (
                    <NumberInput
                        label="Tasa de Interés"
                        {...form.getInputProps('rate')}
                    />
                )}

                <SubtypeField type={form.values.type} form={form} />

                {form.values.type === 'crypto' && (
                    <NumberInput
                        label="Precio (Crypto)"
                        {...form.getInputProps('purchase_price')}
                    />
                )}

                <SimpleGrid cols={2}>
                    <Select
                        withAsterisk
                        label="Moneda"
                        data={[
                            { value: 'UYU', label: 'UYU' },
                            { value: 'USD', label: 'USD' },
                            { value: 'UI', label: 'UI' },
                        ]}
                        {...form.getInputProps('currency')}
                    />

                    <NumberInput
                        withAsterisk
                        label="Monto"
                        prefix={form.values.currency === 'USD' ? 'U$S ' : '$ '}
                        {...form.getInputProps('amount_nominal')}
                    />
                </SimpleGrid>

                {(form.values.type === 'plazo_fijo' || form.values.type === 'ahorro_sueldo') && (
                    <Switch
                        label="Renovable"
                        checked={form.values.renewable}
                        {...form.getInputProps('renewable')}
                    />
                )}

                <SimpleGrid cols={2}>
                    <DateInput
                        withAsterisk
                        label="Fecha de Compra"
                        {...form.getInputProps('purchase_date')}
                    />

                    {form.values.type !== 'crypto' && form.values.type !== 'other' && (
                        <ExpirationDateField type={form.values.type} form={form} />
                    )}
                </SimpleGrid>


                {error && (
                    <Text c="red" size="sm" mt="sm">
                        {error}
                    </Text>
                )}

                <Group justify="flex-end" mt="md">
                    <Button
                        type="submit"
                        loading={loading}
                        size="lg"
                        fullWidth
                    >
                        {isEdit ? 'Actualizar Inversión' : 'Guardar Inversión'}
                    </Button>
                </Group>
            </Stack>
        </form>
    );
}