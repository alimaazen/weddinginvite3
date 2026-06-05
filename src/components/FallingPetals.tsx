import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Petal {
  id: number;
  xStart: number; // percentage width starting from
  xEnd: number;   // percentage width ending at
  size: number;   // size in px
  delay: number;  // animation delay in seconds
  duration: number; // falling duration in seconds
  rotationStart: number;
  rotationEnd: number;
  opacity: number;
  swayAmplitude: number; // how far left/right it drifts
  petalType: number; // different types of petal shapes
}

export function FallingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Generate an initial bunch of petals
    const initialPetals = Array.from({ length: 18 }, (_, idx) => {
      const size = Math.random() * 12 + 8; // 8px to 20px
      const xStart = Math.random() * 110 - 20; // -20% to 90%
      const drift = Math.random() * 25 + 25; // Drift to the right (25% to 50%)
      const xEnd = xStart + drift;
      const duration = Math.random() * 3 + 3.5; // 3.5s to 6.5s is faster
      const delay = Math.random() * -10; // Negative delay so they start pre-falling on mount
      
      return {
        id: idx,
        xStart,
        xEnd,
        size,
        delay,
        duration,
        rotationStart: Math.random() * 360,
        rotationEnd: Math.random() * 360 + 720, // Spin multiple times
        opacity: Math.random() * 0.4 + 0.5, // opacity between 0.5 and 0.9
        swayAmplitude: Math.random() * 25 + 15, // pixels of horizontal sway
        petalType: Math.floor(Math.random() * 3)
      };
    });

    setPetals(initialPetals);

    // Periodically recycle petals that have finished falling
    const interval = setInterval(() => {
      setPetals((prevPetals) =>
        prevPetals.map((petal) => {
          // If delay + duration is past, reset this petal to start from top
          // Since some started with negative delays, this naturally cycles them.
          // However, using simple pure CSS/Motion loop is even more elegant, 
          // or we can randomly re-generate them. Let's do a soft reset for any petal.
          return petal;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Soft peach/pink gradient styles for a wedding petal look
  const getPetalShape = (type: number) => {
    switch (type) {
      case 0:
        // Asymmetric classic petal profile (water drop round)
        return "rounded-[60%_40%_60%_40%]";
      case 1:
        // Elongated elegant petal
        return "rounded-[50%_0_50%_50%]";
      default:
        // Heart-like notched petal shape
        return "rounded-[70%_20%_70%_70%] rounded-tr-[50%] after:content-[''] after:absolute after:bottom-1/2 after:right-1/2 after:w-full after:h-full after:bg-inherit after:rounded-[20%_70%_70%_70%] after:origin-bottom-right after:rotate-12";
    }
  };

  return (
    <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        {petals.map((petal) => {
          const shapeClass = getPetalShape(petal.petalType);
          return (
            <motion.div
              key={petal.id}
              initial={{ 
                top: "-5%", 
                left: `${petal.xStart}%`,
                opacity: 0,
                rotate: petal.rotationStart,
                scale: 0.6
              }}
              animate={{
                top: "105%",
                left: `${petal.xEnd}%`,
                opacity: [0, petal.opacity, petal.opacity, 0],
                rotate: petal.rotationEnd,
                scale: [0.6, 1, 1, 0.8],
                x: [0, petal.swayAmplitude, -petal.swayAmplitude, petal.swayAmplitude / 2, 0]
              }}
              transition={{
                duration: petal.duration,
                delay: petal.delay,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                width: petal.size,
                height: petal.size * 1.3,
                position: 'absolute',
              }}
            >
              <div 
                className={`w-full h-full bg-gradient-to-tr from-[#FAF8F5] via-[#F3EFE9] to-[#E8E3DA] ${shapeClass} shadow-[0_1.5px_4px_rgba(120,110,100,0.1)] border border-white/40`}
                style={{
                  transform: 'rotate(-15deg)', // baseline natural slant
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
