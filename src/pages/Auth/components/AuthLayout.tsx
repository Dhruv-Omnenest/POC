import React from 'react';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex h-dvh w-full items-center justify-center bg-slate-50 overflow-hidden">
    <div className="flex h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-275 overflow-hidden rounded-[22px] bg-white shadow-xl lg:shadow-none">
     <section className="relative hidden w-[47%] overflow-hidden flex-col rounded-[22px] bg-[#0f62fe] text-white lg:flex">
  {/* The Subtle Dark-White Grid */}
  <div 
    className="absolute inset-0"
    style={{
      // Using 0.08 opacity for the lines makes them look "darker" against the blue
      backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px), 
                        linear-gradient(90deg, rgba(255,255,255,0.08) 1.5px, transparent 1.5px)`,
      backgroundSize: '14px 14px', 
      
      // Wide center-out spread
      maskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)',
      WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)'
    }}
  />

  {/* Your Original Top-Left Glow (Kept for depth) */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_40%),linear-gradient(180deg,rgba(0,0,0,0.1)_0%,transparent_100%)]" />

  {/* Content Layer */}
  <div className="relative z-10 flex h-full flex-col items-center justify-between px-10 py-12 text-center">
    <div className="pt-12">
      <h1 className="text-3xl font-medium leading-tight text-white">
        Take Charge <br /> of Your <span className="font-bold">Investments with Us</span>
      </h1>
      <p className="mt-4 text-sm text-blue-100 opacity-70 italic">"Secure your future with Nest"</p>
    </div>

    <div className="flex flex-1 items-center justify-center">
      <img src="/src/assets/auth.svg" alt="Artwork" className="h-auto w-full max-w-70" />
    </div>

    <div className="flex items-center gap-2 pb-2">
      <span className="h-1.5 w-5 rounded-full bg-white" />
      <span className="h-2 w-2 rounded-full bg-white/40" />
      <span className="h-2 w-2 rounded-full bg-white/20" />
    </div>
  </div>
</section>

      <section className="flex flex-1 items-center justify-center px-7 py-10 sm:px-12 lg:px-16">
        <div className="w-full max-w-72">
          <img src="/src/assets/logo.svg" alt="Logo" className="mb-6 h-12 w-auto" />
          {children}
        </div>
      </section>
    </div>
  </div>
);