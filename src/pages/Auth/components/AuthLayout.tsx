import React from 'react';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex h-dvh w-full items-center justify-center bg-slate-50 overflow-hidden">
    <div className="flex h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-275 overflow-hidden rounded-[22px] bg-white shadow-xl lg:shadow-none">
     <section className="relative hidden w-[47%] overflow-hidden flex-col rounded-[22px] bg-[#0f62fe] text-white lg:flex">
  {/* Fine Grid with Wider Spread */}
  <div 
    className="absolute inset-0 opacity-30"
    style={{
      // Tiny 12px squares
      backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
      backgroundSize: '12px 12px', 
      
      // "spread" further by increasing the 10% to 30% and 70% to 90%
      maskImage: 'radial-gradient(circle at center, black 30%, transparent 90%)',
      WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 90%)'
    }}
  />

  {/* Subtle Glow to make the center grid pop */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_80%)]" />

  {/* Content Layer */}
  <div className="relative z-10 flex h-full flex-col items-center justify-between px-10 py-12 text-center">
    <div className="pt-12">
      <h1 className="text-3xl font-medium leading-tight">
        Take Charge <br /> of Your <span className="font-bold">Investments with Us</span>
      </h1>
      <p className="mt-4 text-sm text-blue-100 opacity-80 italic">"Secure your future with Nest"</p>
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