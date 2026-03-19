import React from 'react';
import { AuthCarousel } from './AuthCarousel';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex h-dvh w-full items-center justify-center bg-slate-50 overflow-hidden">
    <div className="flex h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-275 overflow-hidden rounded-[22px] bg-white shadow-xl lg:shadow-none">
      <AuthCarousel />

      <section className="flex flex-1 items-center justify-center px-7 py-10 sm:px-12 lg:px-16">
        <div className="w-full max-w-72">
          <img src="/src/assets/logo.svg" alt="Logo" className="mb-6 h-12 w-auto" />
          {children}
        </div>
      </section>
    </div>
  </div>
);