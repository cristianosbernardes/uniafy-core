import { toast } from "sonner";

// TODO: O usuário deve definir a URL correta do Webhook N8N aqui ou no .env
// Sugestão: VITE_N8N_GHUNTER_WEBHOOK
const N8N_WEBHOOK_URL = "https://webhook.site/YOUR-WEBHOOK-URL-HERE"; // Placeholder

export interface GHunterParams {
    nicho: string;
    cidade: string;
    userId?: string;
}

export const triggerGHunterScrape = async (params: GHunterParams) => {
    try {
        console.log("🚀 Disparando G-Hunter para:", params);

        // Simulação temporária até o usuário colocar a URL real
        if (N8N_WEBHOOK_URL.includes("YOUR-WEBHOOK-URL-HERE")) {
            console.warn("⚠️ URL do N8N não configurada!");
            // Vamos simular sucesso para não quebrar a UI, mas avisar
            return { success: true, message: "Simulação: Webhook não configurado." };
        }

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nicho: params.nicho,
                cidade: params.cidade,
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            throw new Error(`Erro N8N: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Erro ao chamar N8N:", error);
        throw error;
    }
};
