export const PLANS_CONFIG = {
    ESSENTIAL: {
        id: 'plan_essential',
        label: 'Essential',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        description: 'Ideal para quem está começando'
    },
    SCALE: {
        id: 'plan_scale',
        label: 'Scale',
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        description: 'Para agências em crescimento'
    },
    BLACK: {
        id: 'plan_black',
        label: 'Black',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        description: 'Alta performance e recursos avançados'
    },
    ENTERPRISE: {
        id: 'plan_enterprise',
        label: 'Enterprise',
        color: 'text-white',
        bgColor: 'bg-white/10',
        description: 'Soluções customizadas para grandes operações'
    }
} as const;

export type PlanId = typeof PLANS_CONFIG[keyof typeof PLANS_CONFIG]['id'];
