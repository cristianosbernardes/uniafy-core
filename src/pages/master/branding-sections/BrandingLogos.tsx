import { UiAssetUploader } from "@/components/ui/branding-uploader";

interface BrandingLogosProps {
    faviconUrl: string;
    setFaviconUrl: (url: string) => void;
    logoUrl: string;
    setLogoUrl: (url: string) => void;
    loginLogoUrl: string;
    setLoginLogoUrl: (url: string) => void;
}

export function BrandingLogos({
    faviconUrl,
    setFaviconUrl,
    logoUrl,
    setLogoUrl,
    loginLogoUrl,
    setLoginLogoUrl
}: BrandingLogosProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
            <div>
                <h2 className="text-lg font-bold text-white mb-1 tracking-tight">Ativos de Marca</h2>
                <p className="text-xs text-zinc-500">Configure os logos e ícones visíveis no sistema.</p>
            </div>

            <div className="space-y-6">
                <UiAssetUploader
                    label="Ícone do Site (Favicon)"
                    value={faviconUrl}
                    onChange={setFaviconUrl}
                />
                <UiAssetUploader
                    label="Logo do Header (Dashboard)"
                    value={logoUrl}
                    onChange={setLogoUrl}
                />
                <UiAssetUploader
                    label="Logo da Tela de Login"
                    value={loginLogoUrl}
                    onChange={setLoginLogoUrl}
                />
            </div>
        </div>
    );
}
