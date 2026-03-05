import { Paper, Text } from "@mantine/core";

export default function Ads({
	h = 100,
}: {
	h?: number;
}) {
	return (
		<Paper
			radius="md"
			p="xs"
			bg="lime.1"
			mb="lg"
			h={h}>
			<Text size="xs" c="dimmed" tt="uppercase" fw={700} ta="center">
				Publicidad
			</Text>
		</Paper>
	);
}