import React from 'react';
import RetroGridBackground from './RetroGridBackground';

const BootLoader = () => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 overflow-hidden">
      <RetroGridBackground />
      <div className="absolute inset-0 bg-slate-900/45"></div>

      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="text-center">
          <div className="loader-pulse-ring mx-auto mb-10">
            <div className="loader-pulse-core"></div>
          </div>
          <div className="font-mono tracking-[0.2em] text-cyan-300 text-sm loader-fade-line">
            SYNTHESIZING GRID
          </div>
          <div className="font-mono tracking-[0.14em] text-slate-400 text-xs mt-3 loader-fade-line delay-150">
            ROUTING SIGNALS
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootLoader;
