'use client';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 pointer-events-none">
      <div className="flex justify-between items-start px-8 pt-6 text-[11px] tracking-widest uppercase text-white/70 font-mono">
        
        {/* Left */}
        <div className="space-y-1 pointer-events-auto">
          <div>DUAL WAVE SCROLL SYSTEM</div>
          <div className="text-white/40">
            #UGC&nbsp;&nbsp;#CLIPPING&nbsp;&nbsp;#CREATOR&nbsp;&nbsp;#SCROLL
          </div>
        </div>

        {/* Right */}
        <div className="flex gap-6 pointer-events-auto">
          <a href="#" className="hover:text-white transition">ABOUT</a>
          <a href="#" className="hover:text-white transition">DOCS</a>
          <a href="#" className="hover:text-white transition">GITHUB</a>
        </div>

      </div>
    </header>
  );
}
