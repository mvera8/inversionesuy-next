import Ads from "@/components/Ads";
import { AhorroSueldoSimulator } from "@/simuladores/AhorroSueldoSimulator";
import { PlazoFijoSimulator } from "@/simuladores/PlazoFijoSimulador";
import { resolveToolName } from "@/utils/tools";
import { Container, Title } from "@mantine/core";

export default function ToolPage({ params }: { params: { investment: string } }) {
    const { investment: type } = params;

    return (
        <Container size="lg">
            <Ads />
            <Title order={1} mb="md">{resolveToolName(type)}</Title>
            {type === "ahorro_sueldo" && <AhorroSueldoSimulator />}
            {type === "plazo_fijo" && <PlazoFijoSimulator />}
        </Container>
    )
}