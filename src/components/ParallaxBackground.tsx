import { useRef, useEffect, useState } from 'react';
import mainBg from '@/assets/download_6.jpg';

export function ParallaxBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<any[]>([]);

  useEffect(() => {
    // Generate beautiful static pink-peach stars that sit quietly like delicate pattern details
    const newStars = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.25,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-[100svh] z-0 overflow-hidden bg-white" ref={ref}>
      {/* Soft pastel dawn sky gradient alignment to blend beautifully first */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF1E6] via-[#FCF6F0] to-white" />

      {/* Background Image - Set to your uploaded custom image on top of gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-100"
        style={{ backgroundImage: `url("${mainBg}")` }}
      />

      {/* Smooth blending gradient fade to transparent to reveal the underlying background smoothly */}
      <div className="absolute bottom-0 left-0 right-0 h-[35vh] bg-gradient-to-t from-[#E8D9CF] via-[#E8D9CF]/40 to-transparent pointer-events-none z-10 opacity-0" />

      {/* Static Celestial Stars */}
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="absolute rounded-full bg-[#EBA19F] pointer-events-none"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
        />
      ))}
      
      {/* Cinematic Fine Paper Texture Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-15 pointer-events-none mix-blend-screen" />
    </div>
  );
}
