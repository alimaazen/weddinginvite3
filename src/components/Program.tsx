import { motion } from 'motion/react';
import { Clock } from 'lucide-react';

export function Program() {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="flex flex-col items-center text-center space-y-12">
        <div className="flex flex-col items-center">
          <Clock className="w-6 h-6 text-[#B37A6B] mb-4 opacity-90" strokeWidth={1} />
          <h3 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-[#4A3E39] mb-2">Nikkah Ceremony</h3>
          <p className="text-xs md:text-sm text-[#7C665A] tracking-[0.2em] uppercase font-sans font-medium">5:00 PM</p>
        </div>
        
        <div className="flex flex-col items-center">
           <div className="w-1.5 h-1.5 rounded-full bg-[#B37A6B]/80 mb-2"></div>
           <div className="w-1 h-1 rounded-full bg-[#B37A6B]/50 mb-2"></div>
           <div className="w-px h-16 bg-gradient-to-b from-[#B37A6B]/50 to-transparent"></div>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-[#4A3E39] mb-2">Reception</h3>
          <p className="text-xs md:text-sm text-[#7C665A] tracking-[0.2em] uppercase font-sans font-medium">6:00 PM</p>
        </div>
      </div>
    </div>
  );
}
