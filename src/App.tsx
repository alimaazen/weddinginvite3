import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  animate,
} from "motion/react";
import { Envelope } from "./components/Envelope";
import { ParallaxBackground } from "./components/ParallaxBackground";
import { Countdown } from "./components/Countdown";
import { Venue } from "./components/Venue";
import { FallingPetals } from "./components/FallingPetals";
import { Sparkles, Heart, ChevronDown } from "lucide-react";
import cloud3 from "../assets/cloud3.png";
import cloud4 from "../assets/cloud4.png";
import thanksFlowers from "../assets/thanks flowers.png";
import thanksImage from "../assets/thanks.png";
import contentBg from "../assets/download (12).jpg";
import countdownBg from "../assets/download (19).jpg";
import dateBg from "../assets/download (15).jpg";
import venueBg from "../assets/download (21).jpg";
import chandelierImg from "../assets/chandelier.png";
import inshaAllahImage from "../assets/inshaAllah.png";

interface AnimatedTextProps {
  text: string;
  className?: string;
}

function AnimatedLetters({ text, className = "" }: AnimatedTextProps) {
  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 25,
      rotate: 4,
      filter: "blur(3px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 18,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap justify-center ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
    >
      {words.map((word, wordIdx) => (
        <span
          key={wordIdx}
          className="inline-block whitespace-nowrap mr-[0.25em]"
        >
          {word.split("").map((char, charIdx) => (
            <motion.span
              key={charIdx}
              className="inline-block"
              variants={childVariants}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
}

function AnimatedWords({ text, className = "" }: AnimatedTextProps) {
  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(5px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap justify-center ${className}`}
      style={{ direction: "rtl" }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
    >
      {words.map((word, wordIdx) => (
        <motion.span
          key={wordIdx}
          className="inline-block ml-2 last:ml-0"
          variants={childVariants}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

interface SwayingWrapperProps {
  children: React.ReactNode;
  delay?: number;
  speed?: number;
  amplitudeX?: number;
  amplitudeY?: number;
  amplitudeRotate?: number;
}

// Simplified SwayingWrapper to render children statically with NO drift, sway, or float animations
function SwayingWrapper({ children }: SwayingWrapperProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-1">
      {children}
    </div>
  );
}

// A reusable wrapper for smooth fade-up sections
const Section = ({
  children,
  className = "",
  bgImage,
  decorations,
}: {
  children: React.ReactNode;
  className?: string;
  swaySpeed?: number;
  swayDelay?: number;
  swayAmpX?: number;
  swayAmpY?: number;
  swayAmpRotate?: number;
  bgImage?: string;
  decorations?: React.ReactNode;
}) => (
  <section
    className={`min-h-[100svh] flex flex-col items-center justify-center py-16 px-4 relative ${className} overflow-hidden`}
  >
    {bgImage && (
      <div className="absolute inset-0 z-[-1] pointer-events-none">
        <img src={bgImage} className="w-full h-full object-cover" alt="" />
      </div>
    )}
    {decorations}
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex flex-col items-center"
    >
      <SwayingWrapper>{children}</SwayingWrapper>
    </motion.div>
  </section>
);

export default function App() {
  const [isOpened, setIsOpened] = useState(false);

  const countdownSectionRef = useRef<HTMLDivElement>(null);

  // Motion values to drive the clouds smoothly without trigger re-renders
  const revealProgress = useMotionValue(0);

  const cloud1X = useTransform(revealProgress, [0, 100], ["0%", "-160%"]);
  const cloud2X = useTransform(revealProgress, [0, 100], ["0%", "160%"]);

  const containerInView = useInView(countdownSectionRef, {
    amount: "all",
    once: true,
  });
  
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      setIsAtBottom(bottom);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (containerInView) {
      setIsRevealed(true);
      // Automatically move to reveal fully without delay, using an elegant easeOutExpo curve
      animate(revealProgress, 100, {
        duration: 16.0,
        ease: [0.16, 1, 0.3, 1],
      });
    }
  }, [containerInView, revealProgress]);

  useEffect(() => {
    if (!isOpened) {
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => {
        document.body.style.overflow = "";
      }, 2300); // Allow scrolling earlier since website appears quicker
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpened]);

  const dateTitleRef = useRef<HTMLParagraphElement>(null);

  return (
    <div className="min-h-screen w-full relative">
      {/* Centered background image stretched to perfectly fit the whole portrait screen */}
      <div className="fixed inset-y-0 left-0 right-0 max-w-[430px] w-full mx-auto pointer-events-none" style={{ zIndex: 0 }}>
        <img src={contentBg} className="w-full h-full object-fill" alt="" />
      </div>
      
      <div className="relative z-10 w-full max-w-[430px] mx-auto text-[#4A3E39] antialiased font-serif font-light selection:bg-[#EBA19F]/30 min-h-screen shadow-[0_12px_60px_rgba(118,97,80,0.15)] overflow-x-hidden bg-transparent">
        <ParallaxBackground />
        <Envelope isOpen={isOpened} onOpen={() => setIsOpened(true)} />

        <main className="relative z-10 w-full">
          <FallingPetals />

          {/* Scroll Down Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isAtBottom ? 0 : 1, y: 0 }}
            transition={{ delay: 2.0, duration: 1.0 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer group pointer-events-auto z-40 ${isAtBottom ? 'pointer-events-none' : ''}`}
            onClick={() => {
              window.scrollTo({
                top: window.scrollY + window.innerHeight,
                behavior: "smooth"
              });
            }}
          >
            <span className="text-[8px] md:text-[9.5px] uppercase tracking-[0.25em] text-[#8F7C73]/90 font-sans font-semibold group-hover:text-[#B37A6B] drop-shadow-md transition-colors duration-300">
              Scroll Down
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{
                duration: 2.0,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="w-4 h-4 text-[#B37A6B]/90 drop-shadow-md group-hover:text-[#B37A6B] transition-colors duration-300" />
            </motion.div>
          </motion.div>

          {/* Section 1: Intro (Bismillah, Invitation, and Names) merged into one cohesive section */}
          <Section className="!min-h-[100svh] !h-[100svh] !py-0 flex flex-col justify-center pt-[6vh] pb-[4vh]">
            {/* Bismillah Header */}
            <div className="flex flex-col items-center w-full mb-[1.5vh]">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/24/Basmala-wiki.svg"
                alt="Bismillah"
                referrerPolicy="no-referrer"
                className="w-[100px] md:w-[130px] h-auto object-contain"
                style={{
                  filter:
                    "opacity(0.85) sepia(0.3) saturate(1.5) hue-rotate(-20deg) brightness(0.4) drop-shadow(0 2px 4px rgba(0,0,0,0.06))",
                }}
              />
              <p className="mt-2 text-[6.5px] md:text-[7.5px] tracking-[0.3em] uppercase text-[#7C665A] font-sans text-center px-4 font-medium leading-relaxed">
                In the name of Allah, the Most
                <br />
                Gracious, the Most Merciful
              </p>
            </div>

            <div className="w-1 h-1 rounded-full bg-[#B37A6B]/40 my-[1.5vh]"></div>

            {/* Invitation text */}
            <div className="text-center w-full mb-[1.5vh] px-4">
              <p className="text-[10px] md:text-xs leading-normal tracking-wide max-w-xs md:max-w-md text-[#52443C] mx-auto font-light">
                We cordially invite your esteemed presence
                <br />
                <span className="italic text-[#8F7C73] text-[8px] md:text-[9.5px] mt-0.5 inline-block font-sans">
                  on the auspicious occasion{" "}
                </span>
                <br />
                of the wedding ceremony of
              </p>
            </div>

            <div className="w-1 h-1 rounded-full bg-[#B37A6B]/40 my-[1.5vh]"></div>

            {/* Bride and Groom Names */}
            <div className="flex flex-col items-center space-y-[1vh] w-full max-w-4xl">
              {/* Bride */}
              <div className="flex flex-col items-center">
                <AnimatedLetters
                  text="Manal Abdulla"
                  className="font-serif italic text-[15px] md:text-[18px] text-[#4A3E39] tracking-wide drop-shadow-sm text-center font-normal mb-0"
                />
                <AnimatedWords
                  text="منال عبد الله"
                  className="font-arabic-alt text-sm md:text-base text-[#B37A6B] -mt-0.5"
                />
              </div>

              {/* Separator & Ampersand */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 100,
                  delay: 0.2,
                }}
                className="flex items-center justify-center w-full my-0 py-0"
              >
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#B37A6B]/50"></div>
                <span className="font-serif italic text-sm md:text-lg text-[#B37A6B] mx-2">
                  &
                </span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#B37A6B]/50"></div>
              </motion.div>

              {/* Groom */}
              <div className="flex flex-col items-center">
                <AnimatedLetters
                  text="Mohamed Abshir"
                  className="font-serif italic text-[15px] md:text-[18px] text-[#4A3E39] tracking-wide drop-shadow-sm text-center font-normal mb-0"
                />
                <AnimatedWords
                  text="محمد أبشر"
                  className="font-arabic-alt text-sm md:text-base text-[#B37A6B] -mt-0.5"
                />
              </div>
            </div>
          </Section>

          {/* Section 2: Date */}
          <Section bgImage={dateBg}>
            <div className="relative p-6 pt-8 mt-2 text-center flex flex-col items-center w-full">
              <p ref={dateTitleRef} className="font-script text-4xl md:text-5xl text-[#B37A6B] mb-0.5 z-10 w-full text-center font-bold">
                The Date
              </p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.8 }}
                className="mt-8 flex flex-col items-center gap-6 z-10 w-full"
              >
                {/* Simplified Text Date layout */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl md:text-4xl text-[#4A3E39] font-serif font-medium">30th July 2026</span>
                  <span className="text-sm md:text-base text-[#8F7C73] font-sans tracking-wider uppercase font-medium">Thursday</span>
                </div>
                
                <div className="flex flex-col items-center gap-3 mt-6">
                  <p className="text-[10px] md:text-xs tracking-[0.4em] text-[#B37A6B] uppercase text-center w-full font-sans font-medium">
                    Nikkah
                  </p>
                  <div className="flex flex-col items-center justify-center gap-2 text-[#A5685A] font-serif italic text-lg opacity-90">
                    <div className="flex items-center justify-center gap-3">
                      <span className="w-8 h-[2px] bg-[#A5685A]/40 rounded-full"></span>
                      <span className="font-sans not-italic text-xs md:text-sm tracking-[0.2em] font-medium uppercase mt-0.5">at 4:30 PM</span>
                      <span className="w-8 h-[2px] bg-[#A5685A]/40 rounded-full"></span>
                    </div>
                    <span>Reception to follow</span>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="font-script text-3xl md:text-4xl text-[#B37A6B] mt-2 font-bold"
                  >
                    You're invited!
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </Section>

          {/* Section 4: Venue */}
          <Section 
            bgImage={venueBg} 
            decorations={
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-32 md:w-48 z-10 origin-top flex flex-col items-center pointer-events-none"
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src={chandelierImg} alt="" className="w-full h-auto drop-shadow-2xl" />
              </motion.div>
            }
          >
            <Venue />
          </Section>

          {/* Section 5: Countdown */}
          <Section className="pb-[20vh]" bgImage={countdownBg}>
            {/* Wrapper for scroll tracking and cloud overlay */}
            <div
              ref={countdownSectionRef}
              className="relative w-full max-w-[420px] mx-auto flex flex-col items-center select-none overflow-visible py-4"
            >
              {/* The countdown is always visible below the clouds */}
              <div className="w-full relative z-10 flex flex-col items-center">
                <p className="text-[10px] md:text-xs tracking-[0.4em] text-[#B37A6B] uppercase mb-8 text-center w-full font-sans font-medium">
                  Until The Day
                </p>
                <Countdown />
              </div>

              {/* Cloud 1 (moving left dynamically on slider drag) */}
              <motion.div
                style={{ x: cloud1X }}
                className="absolute inset-y-0 left-0 w-[100%] z-20 pointer-events-none flex items-center justify-end"
              >
                <img
                  src={cloud4}
                  alt="Cloud Left"
                  className="w-[230%] max-w-none h-auto object-contain translate-x-[42%] -translate-y-[28px]"
                />
              </motion.div>

              {/* Cloud 2 (moving right dynamically on slider drag) */}
              <motion.div
                style={{ x: cloud2X }}
                className="absolute inset-y-0 right-0 w-[100%] z-20 pointer-events-none flex items-center justify-start"
              >
                <img
                  src={cloud3}
                  alt="Cloud Right"
                  className="w-[230%] max-w-none h-auto object-contain -translate-x-[42%] translate-y-[28px]"
                />
              </motion.div>
            </div>

            <div className="mt-8 flex flex-col items-center group">
              <div className="w-px h-8 bg-gradient-to-b from-[#B37A6B]/40 to-transparent mb-4 font-medium"></div>
              <svg
                viewBox="0 0 500 160"
                className="w-[280px] md:w-[380px] h-auto drop-shadow-md opacity-90 transition-opacity duration-700 group-hover:opacity-100"
              >
                <defs>
                  <linearGradient
                    id="goldGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#8E5A4E" />
                    <stop offset="25%" stopColor="#B37A6B" />
                    <stop offset="50%" stopColor="#CD8D7A" />
                    <stop offset="75%" stopColor="#A86A5B" />
                    <stop offset="100%" stopColor="#8E5A4E" />
                  </linearGradient>
                  <filter
                    id="softGlow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite
                      in="SourceGraphic"
                      in2="blur"
                      operator="over"
                    />
                  </filter>
                </defs>

                <image
                  href={inshaAllahImage}
                  x="50%"
                  y="50%"
                  width="600"
                  height="240"
                  transform="translate(-300, -120)"
                  preserveAspectRatio="xMidYMid meet"
                />
              </svg>
            </div>
          </Section>

          {/* Section 6: Thank You */}
          <Section className="!min-h-[110svh] !pb-[10vh] !py-0 flex flex-col items-center justify-center gap-0" bgImage={contentBg}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <img 
                src={thanksFlowers} 
                alt="Decorative Flowers" 
                className="w-full max-w-[280px] md:max-w-[380px] drop-shadow-md"
              />
            
              <div className="-mt-8 md:-mt-12 flex flex-col items-center">
                <img 
                  src={thanksImage} 
                  alt="Thank You" 
                  className="w-full max-w-[320px] md:max-w-[420px] drop-shadow-sm"
                />
                <p className="mt-3 text-[11px] md:text-[13px] font-sans tracking-[0.12em] text-[#8F7C73]/90 uppercase text-center w-full whitespace-nowrap drop-shadow-sm font-medium">
                  Your presence gives us joy and happiness
                </p>
              </div>
            </motion.div>
          </Section>
        </main>
      </div>
    </div>
  );
}
