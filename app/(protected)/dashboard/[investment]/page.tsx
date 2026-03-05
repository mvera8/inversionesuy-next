import { getInvestments } from "@/lib/actions/investments";
import { InvestmentTypeUI } from "@/ui/InvestmentTypeUI";

export default async function InvestmentPage({ params }: { params: Promise<{ investment: string }> }) {
    const { investment: type } = await params;

    const response = await getInvestments(type);

    if (!response.success) {
        return (
            <>
                <h1>Investment Type: {type}</h1>
                <p>Error: {response.error}</p>
            </>
        );
    }

    return (
        <InvestmentTypeUI
            type={type}
            investments={response.data ?? []}
        />
    );
}