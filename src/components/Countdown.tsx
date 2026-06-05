import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target date: July 30, 2026 5:00 PM
    const targetDate = new Date('2026-07-30T17:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
         clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeElRef = (val: number, label: string) => (
     <div className="flex flex-col items-center py-3 px-4 bg-[#FCFAF6] backdrop-blur-md rounded-xl border border-[#EADEC9]/80 shadow-[0_8px_24px_rgba(234,213,191,0.25)] min-w-[64px] sm:min-w-[78px]">
        <span className="font-serif text-2xl sm:text-3xl text-[#B37A6B] tracking-wider font-light">{val.toString().padStart(2, '0')}</span>
        <span className="text-[9px] tracking-[0.2em] font-medium text-[#8F7C73] mt-1 uppercase">{val === 1 ? label.slice(0, -1) : label}</span>
     </div>
  );

  return (
    <div 
      className="flex gap-2 sm:gap-6 justify-center"
    >
       {timeElRef(timeLeft.days, 'Days')}
       {timeElRef(timeLeft.hours, 'Hours')}
       {timeElRef(timeLeft.minutes, 'Mins')}
       {timeElRef(timeLeft.seconds, 'Secs')}
    </div>
  );
}
