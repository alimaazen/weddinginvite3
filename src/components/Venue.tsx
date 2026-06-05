export function Venue() {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="flex flex-col items-center text-center space-y-6 w-full">
        <div className="flex flex-col items-center pt-24 md:pt-28">
          <p className="text-[10px] md:text-xs tracking-[0.4em] text-[#B37A6B] uppercase mb-4 text-center w-full font-sans font-medium">
            The Venue
          </p>
          <h3 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-[#4A3E39] mb-3">Nayanar Academy</h3>
          <p className="text-xs md:text-sm text-[#7C665A] tracking-widest leading-relaxed max-w-sm font-sans px-4">
              Kannur, Kerala <br/>
              India
          </p>
        </div>
        
        <div className="w-[85%] md:w-[80%] max-w-lg aspect-square md:aspect-video rounded-xl overflow-hidden border border-[#EADEC9] shadow-[0_12px_36px_rgba(218,197,167,0.25)] relative p-2 bg-[#FCFAF6]/80 backdrop-blur-sm mt-2">
          <div className="w-full h-full rounded-lg overflow-hidden relative group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15610.198305886657!2d75.362145398284!3d11.866896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba422c544d9f67b%3A0xeab4bd3fbaec72d!2sNayanar%20Academy%20%2C%20Kannur!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="filter grayscale-[15%] opacity-90 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700 ease-in-out absolute inset-0 w-full h-full"
              ></iframe>
              <div className="absolute inset-0 bg-[#EADEC9]/5 mix-blend-overlay pointer-events-none transition-opacity duration-700 group-hover:opacity-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
