import { useEffect, useState } from 'react';

interface CountdownTimerProps {
    targetDate: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
    const calculateTimeLeft = (): TimeLeft => {
        const difference = +new Date(targetDate) - +new Date();

        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const pad = (num: number) => num.toString().padStart(2, '0');

    return (
        <div className="flex items-center gap-3 text-sm tracking-wide" style={{ color: 'hsl(var(--primary) / 0.9)' }}>
            <div className="flex items-baseline gap-0.5">
                <span className="font-bold text-lg">{timeLeft.days}</span>
                <span className="text-xs font-bold opacity-70" style={{ color: 'hsl(var(--primary))' }}>d</span>
            </div>
            <div className="flex items-baseline gap-0.5">
                <span className="font-bold text-lg">{pad(timeLeft.hours)}</span>
                <span className="text-xs font-bold opacity-70" style={{ color: 'hsl(var(--primary))' }}>h</span>
            </div>
            <div className="flex items-baseline gap-0.5">
                <span className="font-bold text-lg">{pad(timeLeft.minutes)}</span>
                <span className="text-xs font-bold opacity-70" style={{ color: 'hsl(var(--primary))' }}>m</span>
            </div>
            <div className="flex items-baseline gap-0.5">
                <span className="font-bold text-lg min-w-[24px] text-center">{pad(timeLeft.seconds)}</span>
                <span className="text-xs font-bold opacity-70" style={{ color: 'hsl(var(--primary))' }}>s</span>
            </div>
        </div>
    );
}
