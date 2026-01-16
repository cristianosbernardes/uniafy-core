
import { ClientOnboardingWizard } from "@/components/agency/ClientOnboardingWizard";
import { PageHeader } from "@/components/ui/PageHeader";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { agencyService } from "@/services/agencyService";
import { useAuth } from "@/contexts/AuthContext";

export default function AgencyOnboarding() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleOnboardingComplete = async (data: any) => {
        if (!user) return;
        try {
            await agencyService.createClient(user.id, data);
            toast.success("Client Onboarding initiated successfully!");
            // Redirect to clients list after successful onboarding
            setTimeout(() => {
                navigate("/agency/clients");
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to start onboarding process.");
        }
    };

    const handleCancel = () => {
        navigate("/agency/clients");
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="ONBOARDING"
                titleAccent="MÁGICO"
                subtitle="Sistema de entrada inteligente"
            />

            <div className="flex justify-center items-start min-h-[60vh] pt-8">
                <ClientOnboardingWizard
                    onComplete={handleOnboardingComplete}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}
