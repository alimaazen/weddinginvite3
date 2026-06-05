import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import waxSealImage from '../../assets/beigeseal.png';
import laceImage from '../../assets/whitelace.png';

interface EnvelopeProps {
  onOpen: () => void;
  isOpen: boolean;
}

export function Envelope({ onOpen, isOpen }: EnvelopeProps) {
  const [step, setStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 430, height: 800 });

  // Dynamically measure envelope width and height to position lace decoration along diagonal seams
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStep(1); // Stop pulsing, wax seal fades
      
      const timerFlaps = setTimeout(() => {
        setStep(2); // All 4 flaps slide out
      }, 500); // Graceful 0.5s for the wax seal to fade completely first

      const timerZoom = setTimeout(() => {
        setStep(3); // Whole envelope assembly zooms and fades
      }, 5000); // Wait 5.0 seconds (0.5s seal fade + 4.5s slow slide animation)

      const timerUnmount = setTimeout(() => {
        setStep(4); // Fully unmounted
      }, 5800); // 5000ms + 800ms of final zoom and slide transition

      return () => {
        clearTimeout(timerFlaps);
        clearTimeout(timerZoom);
        clearTimeout(timerUnmount);
      };
    }
  }, [isOpen]);

  if (step === 4) return null;


  // Global helper function to calculate position and rotation styles of lace divs along the seams
  const getLaceStyle = (x1: number, y1: number, x2: number, y2: number, laceHeight = 36) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    return {
      position: 'absolute' as const,
      left: `${x1}px`,
      top: `${y1}px`,
      width: `${length}px`,
      height: `${laceHeight}px`,
      backgroundImage: `url(${laceImage})`,
      backgroundRepeat: 'repeat-x',
      backgroundSize: 'auto 100%',
      backgroundPosition: 'center',
      mixBlendMode: 'normal' as const,
      filter: 'brightness(0.85) sepia(0.3) saturate(0.8)',
      transformOrigin: 'top left',
      transform: `rotate(${angle}deg) translateY(-50%)`,
      pointerEvents: 'none' as const,
      zIndex: 40,
    };
  };

  const W = dimensions.width;
  const H = dimensions.height;

  // Central intersection/pinch points matching the SVG clip polygons
  const C_other_y = H * 0.58;
  const C_top_y = H * 0.65;
  const C_bottom_y = H * 0.32;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-full flex items-center justify-center overflow-hidden pointer-events-auto select-none ${
        step >= 3 ? 'z-40' : 'z-[100]'
      }`}
    >
      {/* Immersive ivory/white backdrop revealed behind the flaps (no black or dark pixels) */}
      <motion.div
        className="absolute inset-0 z-0 bg-[#FCFAF2]"
        animate={{
          backgroundColor: step >= 2 ? "transparent" : "#FCFAF2",
          opacity: step >= 2 ? 0 : 1,
        }}
        transition={{
          backgroundColor: { duration: 0.1, ease: "easeOut" },
          opacity: { duration: 1.5, ease: "easeInOut" },
        }}
        onClick={() => { if (!isOpen) onOpen(); }}
      />

      {/* Fullscreen Envelope Container */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={{
          scale: step === 3 ? 1.05 : 1,
          opacity: step === 3 ? 0 : 1,
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        onClick={() => { if (!isOpen) onOpen(); }}
      >
        {/* Envelope Frame - elegant soft ivory color from the get-go to ensure absolute zero black flashes */}
        <motion.div
          animate={{ backgroundColor: step >= 2 ? "transparent" : "#FCFAF2" }}
          transition={{ duration: 4.5, ease: "easeInOut" }}
          className="absolute w-full h-full max-w-[430px] overflow-hidden flex items-center justify-center bg-[#FCFAF2]"
        >
          
          {/* Overlapping Envelope Flaps Wrapper */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            
            {/* 1. LEFT FLAP (Lowest z-index layer) */}
            <motion.div
              animate={{ x: step >= 2 ? "-100%" : "0%" }}
              transition={{ duration: 4.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-[0.2px] w-full h-full bg-[#EAE5D9] shadow-[inset_-30px_0_60px_rgba(0,0,0,0.03)]"
              style={{
                clipPath: 'polygon(0% 0%, 0% 100%, 50% 58%)',
                zIndex: 11,
              }}
            >
              {/* Luxury textured layers */}
              <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-black/[0.01] to-black/[0.04]" />
              {/* Left Flap Seam Lace Borders - clipped to left flap */}
              <div style={getLaceStyle(0, 0, W / 2, C_other_y)} />
              <div style={getLaceStyle(0, H, W / 2, C_other_y)} />
            </motion.div>

            {/* 2. RIGHT FLAP (Lower z-index layer) */}
            <motion.div
              animate={{ x: step >= 2 ? "100%" : "0%" }}
              transition={{ duration: 4.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-[0.2px] w-full h-full bg-[#EAE5D9] shadow-[inset_30px_0_60px_rgba(0,0,0,0.03)]"
              style={{
                clipPath: 'polygon(100% 0%, 100% 100%, 50% 58%)',
                zIndex: 12,
              }}
            >
              <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-l from-black/0 via-black/[0.01] to-black/[0.04]" />
              {/* Right Flap Seam Lace Borders - clipped to right flap */}
              <div style={getLaceStyle(W, 0, W / 2, C_other_y)} />
              <div style={getLaceStyle(W, H, W / 2, C_other_y)} />
            </motion.div>

            {/* 3. BOTTOM FLAP (Middle layer, overlaps Left and Right) */}
            <motion.div
              animate={{ y: step >= 2 ? "100%" : "0%" }}
              transition={{ duration: 4.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-[0.2px] w-full h-full bg-[#F5F0E6] shadow-[inset_0_-40px_80px_rgba(0,0,0,0.02)] filter drop-shadow-[0_-5px_12px_rgba(0,0,0,0.02)]"
              style={{
                clipPath: 'polygon(0% 100%, 100% 100%, 100% 58%, 50% 32%, 0% 58%)',
                zIndex: 13,
              }}
            >
              <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/[0.01] via-transparent to-transparent" />
              {/* Bottom Flap Seam Lace Borders - clipped to bottom flap */}
              <div style={getLaceStyle(0, H * 0.58, W / 2, C_bottom_y)} />
              <div style={getLaceStyle(W, H * 0.58, W / 2, C_bottom_y)} />
            </motion.div>

            {/* 4. TOP POINTED FLAP (Highest z-index layer, overlaps Left, Right, and Bottom) */}
            <motion.div
              animate={{ y: step >= 2 ? "-100%" : "0%" }}
              transition={{ duration: 4.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-[0.2px] w-full h-full filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.05)]"
              style={{
                zIndex: 14,
                perspective: "1000px",
                transformOrigin: "top",
              }}
            >
              {/* Visible flap container constrained by clip-path for inner contents */}
              <div
                className="absolute inset-0 w-full h-full bg-[#F5F0E6] shadow-[0_12px_32px_rgba(0,0,0,0.05)] backface-visible"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 35%, 50% 65%, 0% 35%)',
                }}
              >
                <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply absolute inset-0" />
                
                {/* Authentic fine drop-shadow gradient along bottom edge of top flap */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/[0.02]" />
                {/* Top Flap Seam Lace Borders - clipped to top flap (extends down beautifully along the peak) */}
                <div style={getLaceStyle(0, H * 0.35, W / 2, C_top_y)} />
                <div style={getLaceStyle(W, H * 0.35, W / 2, C_top_y)} />
              </div>

              {/* Seal attached to the top flap */}
              <motion.div
                animate={{
                  scale: step === 0 ? [1, 1.04, 1] : 0,
                  opacity: step === 0 ? 1 : 0,
                }}
                transition={{
                  scale: step === 0 
                    ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } 
                    : { duration: 0.3, ease: "easeOut" },
                  opacity: { duration: 0.3, ease: "easeOut" },
                }}
                className="absolute z-30 left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                style={{ zIndex: 100 }}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (!isOpen) onOpen(); 
                }}
              >
                <img
                  src={waxSealImage}
                  alt="Wax Seal"
                  className="w-full h-full object-contain rounded-full drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </motion.div>

          </div>

          
        </motion.div>
      </motion.div>
    </div>
  );
}
