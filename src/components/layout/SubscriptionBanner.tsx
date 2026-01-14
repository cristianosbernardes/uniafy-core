import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { differenceInSeconds, addDays } from 'date-fns';

export function SubscriptionBanner() {
    const [isVisible, setIsVisible] = useState(true);
    // Set a fixed deadline for demo purposes (e.g., 3 days from now)
    // In production, this would come from the user's subscription data
    const [deadLine] = useState(() => addDays(new Date(), 2));
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = differenceInSeconds(deadLine, new Date());

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (3600 * 24)),
                    hours: Math.floor((difference % (3600 * 24)) / 3600),
                    minutes: Math.floor((difference % 3600) / 60),
                    seconds: Math.floor(difference % 60)
                };
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        };

        // Initial calc
        setTimeLeft(calculateTimeLeft());

        // Update every second
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [deadLine]);

    if (!isVisible) return null;

    return (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[60] pointer-events-none w-full max-w-4xl flex justify-center">
            {/* 
                Centred Card - Floating above content 
                Pointer events auto on the card itself so buttons work 
            */}
            <div className="pointer-events-auto bg-[#0052FF] text-white rounded-full pl-6 pr-2 py-2 flex items-center shadow-2xl shadow-blue-900/40 border border-white/10 animate-in slide-in-from-top-4 duration-500">

                {/* Message */}
                <span className="text-[13px] font-medium mr-4 hidden md:block">
                    Você já viu o potencial. Agora libere o poder real.
                </span>

                {/* Vertical Divider */}
                <div className="h-4 w-px bg-white/20 mr-4 hidden md:block" />

                {/* Countdown */}
                <div className="flex items-center gap-1.5 font-variant-numeric tabular-nums mr-4">
                    <Clock className="w-4 h-4 text-blue-200" />
                    <div className="flex gap-1 items-center font-bold text-sm">
                        <span>{String(timeLeft.days).padStart(2, '0')} d</span>
                        <span className="opacity-50">:</span>
                        <span>{String(timeLeft.hours).padStart(2, '0')} h</span>
                        <span className="opacity-50">:</span>
                        <span>{String(timeLeft.minutes).padStart(2, '0')} m</span>
                        <span className="opacity-50">:</span>
                        <span>{String(timeLeft.seconds).padStart(2, '0')} s</span>
                    </div>
                </div>

                {/* Action Button */}
                <Button
                    size="sm"
                    className="h-8 bg-white text-[#0052FF] hover:bg-white/90 font-bold rounded-full px-5 text-xs shadow-sm transition-all hover:scale-105"
                >
                    Ver planos
                </Button>
            </div>
        </div>
    );
}
