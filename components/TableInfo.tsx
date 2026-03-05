import { Table, Title } from "@mantine/core";

export const TableInfo = ({ data }: { data: { label: string; value: React.ReactNode }[] }) => {
	const rows = data.map((item, index) => (
		<Table.Tr key={`${item.label}-${index}`}>
			<Table.Td fw={500}>{item.label}</Table.Td>
			<Table.Td ta="end" tt="capitalize">{item.value}</Table.Td>
		</Table.Tr>
	));

	return (
		<>
			<Title order={4} mb="xs">Resumen de la inversión</Title>
			<Table mb="md">
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</>
	);
};
