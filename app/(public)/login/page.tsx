'use client'
import { useState } from 'react';
import { Button, TextInput, PasswordInput, Paper, Title, Container, Text, Anchor, Alert, Divider } from '@mantine/core';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { IconAlertCircle } from '@tabler/icons-react';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [loadingGithub, setLoadingGithub] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    async function signInWithGithub() {
        setLoadingGithub(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
            },
        });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
        }
    }

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
            router.refresh();
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center">¡Hola de nuevo!</Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                ¿No tienes una cuenta aún?{' '}
                <Anchor size="sm" component={Link} href="/register">
                    Crear cuenta
                </Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                {errorMsg && (
                    <Alert variant="light" color="red" title="Error" icon={<IconAlertCircle />} mb="md">
                        {errorMsg}
                    </Alert>
                )}

                <Text>tincho@gmail.com</Text>
                <form onSubmit={handleLogin}>
                    <TextInput name="email" label="Email" placeholder="tu@email.com" required />
                    <PasswordInput name="password" label="Contraseña" placeholder="Tu contraseña" required mt="md" />
                    <Button type="submit" fullWidth mt="xl" loading={loading}>Ingresar</Button>
                </form>

                <Divider />
                <Button
                    color='black'
                    onClick={signInWithGithub}
                    loading={loadingGithub}
                >
                    Login with Github
                </Button>
            </Paper>
        </Container>
    );
}