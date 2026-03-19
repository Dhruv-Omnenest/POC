import  { useState, useEffect } from 'react';

const CAROUSEL_DATA = [
  {
    title: <>Take Charge <br /> of Your <span className="font-bold">Investments with Us</span></>,
    quote: '"Secure your future with Nest"',
    image: "/src/assets/auth.svg"
  },
  {
    title: <>Smart Tracking <br /> for Your <span className="font-bold">Portfolio</span></>,
    quote: '"Data-driven insights at your fingertips"',
    image: "/src/assets/auth.svg"
  },
  {
    title: <>Growth Starts <br /> with <span className="font-bold">Better Habits</span></>,
    quote: '"Small steps lead to big returns"',
    image: "/src/assets/auth.svg"
  }
];

export const AuthCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CAROUSEL_DATA.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const current = CAROUSEL_DATA[activeIndex];

  return (
    <section className="relative hidden w-[47%] overflow-hidden flex-col rounded-[22px] bg-[#0f62fe] text-white lg:flex">
      {/* Background Grids & Masks */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px), 
                            linear-gradient(90deg, rgba(255,255,255,0.08) 1.5px, transparent 1.5px)`,
          backgroundSize: '14px 14px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)'
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_40%),linear-gradient(180deg,rgba(0,0,0,0.1)_0%,transparent_100%)]" />

      {/* Slide Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-10 py-12 text-center">
        <div key={`text-${activeIndex}`} className="pt-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <h1 className="text-3xl font-medium leading-tight text-white">
            {current.title}
          </h1>
          <p className="mt-4 text-sm text-blue-100 opacity-70 italic">
            {current.quote}
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <img 
            key={`img-${activeIndex}`}
            src={current.image} 
            alt="Artwork" 
            className="h-auto w-full max-w-70 animate-in fade-in zoom-in duration-700" 
          />
        </div>

        {/* Indicators */}
        <div className="flex items-center gap-2 pb-2">
          {CAROUSEL_DATA.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                activeIndex === idx ? "h-1.5 w-5 bg-white" : "h-2 w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};