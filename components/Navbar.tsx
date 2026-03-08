import { Container } from "@mantine/core";

export function Navbar() {
    return (
        <header>
            <Container>
                <nav>
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            <a href="/dashboard">Dashboard</a>
                        </li>
                        <li>
                            <a href="/add-investment">Agregar inversión</a>
                        </li>
                    </ul>
                </nav>
            </Container>
        </header>
    );
}