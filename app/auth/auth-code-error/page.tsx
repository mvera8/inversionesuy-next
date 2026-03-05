import { Container, Title, Text, Button, Paper } from '@mantine/core';
import Link from 'next/link';

export default function AuthCodeErrorPage() {
    return (
        <Container size={420} my={40}>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Title ta="center" order={2} c="red">¡Error de Autenticación!</Title>
                <Text ta="center" mt="md">
                    Hubo un problema al procesar tu inicio de sesión. Por favor, intenta de nuevo.
                </Text>
                <Button component={Link} href="/login" fullWidth mt="xl">
                    Volver al login
                </Button>
            </Paper>
        </Container>
    );
}
