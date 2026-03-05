"use client";

import { Button, Drawer, Modal, Table, Text, Group, ActionIcon, Tooltip } from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InvestmentForm } from "./InvestmentForm";
import { Investment } from "@/types/investment";
import { deleteInvestment } from "@/lib/actions/investments";
import { IconEdit, IconTrash } from "@tabler/icons-react";

export interface InvestmentColumn {
    label: string;
    render: (investment: Investment) => React.ReactNode;
}

interface TableInvestmentsProps {
    dataInvestments: Investment[];
    columns: InvestmentColumn[];
}

export function TableInvestments({ dataInvestments, columns }: TableInvestmentsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [openedModal, setOpenedModal] = useState(false);
    const [openedDrawer, setOpenedDrawer] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedName, setSelectedName] = useState<string | null>(null);
    const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);

    const handleDeleteInvestment = async () => {
        if (!selectedId) return;
        setLoading(true);
        try {
            const result = await deleteInvestment(selectedId);
            if (result.success) {
                setOpenedModal(false);
                setSelectedId(null);
                router.refresh();
            } else {
                alert(result.error || "Ocurrió un error al eliminar");
            }
        } catch (err) {
            alert("Error inesperado");
        } finally {
            setLoading(false);
        }
    };

    const rowsInvestments = dataInvestments.map((investment) => (
        <Table.Tr key={String(investment.id)}>
            {columns.map((col, i) => (
                <Table.Td key={i}>{col.render(investment)}</Table.Td>
            ))}
            <Table.Td>
                <Group gap="xs" justify="flex-end">
                    <Tooltip label="Editar">
                        <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => {
                                setSelectedInvestment(investment);
                                setOpenedDrawer(true);
                            }}
                        >
                            <IconEdit size={18} />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Eliminar">
                        <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => {
                                setSelectedId(investment.id);
                                setSelectedName(investment.name);
                                setOpenedModal(true);
                            }}
                        >
                            <IconTrash size={18} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <Table highlightOnHover verticalSpacing="xs">
                <Table.Thead>
                    <Table.Tr>
                        {columns.map((col, i) => (
                            <Table.Th key={i}>{col.label}</Table.Th>
                        ))}
                        <Table.Th>Acciones</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rowsInvestments.length > 0 ? (
                        rowsInvestments
                    ) : (
                        <Table.Tr>
                            <Table.Td colSpan={columns.length + 1}>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase" ta="center">
                                    No hay inversiones
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>

            <Drawer
                opened={openedDrawer}
                onClose={() => setOpenedDrawer(false)}
                title="Editar Inversión"
                position="right"
                size="md"
            >
                {selectedInvestment && (
                    <InvestmentForm
                        investment={selectedInvestment}
                        onSuccess={() => {
                            setOpenedDrawer(false);
                            setSelectedInvestment(null);
                            router.refresh();
                        }}
                    />
                )}
            </Drawer>

            <Modal
                opened={openedModal}
                onClose={() => setOpenedModal(false)}
                title="Eliminar Inversión"
            >
                <Text mb="xs">
                    ¿Estás seguro de que deseas eliminar la inversión{' '}
                    <Text span fw={700}>{selectedName}</Text>? Esta acción no se puede deshacer.
                </Text>
                <Group justify="flex-end" mt="xl">
                    <Button variant="default" onClick={() => setOpenedModal(false)}>Cancelar</Button>
                    <Button color="red" onClick={handleDeleteInvestment} loading={loading}>
                        Eliminar Inversión
                    </Button>
                </Group>
            </Modal>
        </>
    );
}