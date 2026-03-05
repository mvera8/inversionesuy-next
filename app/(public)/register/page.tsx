'use client'
import { useState } from 'react';
import { Button, TextInput, PasswordInput, Paper, Title, Container, Text, Anchor, Alert, Stack } from '@mantine/core';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setErrorMsg('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
        } else {
            setSuccessMsg('¡Registro exitoso! Por favor verifica tu email.');
            setLoading(false);
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center">Crear cuenta</Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                ¿Ya tienes una cuenta?{' '}
                <Anchor size="sm" component={Link} href="/login">
                    Iniciar sesión
                </Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                {errorMsg && (
                    <Alert variant="light" color="red" title="Error" icon={<IconAlertCircle />} mb="md">
                        {errorMsg}
                    </Alert>
                )}
                {successMsg && (
                    <Alert variant="light" color="green" title="Éxito" icon={<IconCheck />} mb="md">
                        {successMsg}
                    </Alert>
                )}

                <form onSubmit={handleRegister}>
                    <Stack>
                        <TextInput name="email" label="Email" placeholder="tu@email.com" required />
                        <PasswordInput name="password" label="Contraseña" placeholder="Tu contraseña" required />
                        <PasswordInput name="confirmPassword" label="Confirmar contraseña" placeholder="Repite tu contraseña" required />
                        <Button type="submit" fullWidth mt="xl" loading={loading}>Registrarse</Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}