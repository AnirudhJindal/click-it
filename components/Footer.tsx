'use client';

export default function Footer() {
  return (
    <footer className="relative z-10 mt-[30vh] border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-8 py-16 text-white/60 text-[12px] font-mono tracking-wider">

        {/* Left */}
        <div className="space-y-4 max-w-md">
          <div className="text-white">CLICKC</div>
          <p className="leading-relaxed">
            A UGC and clipping platform.
            Built for creators.
            Designed to redirect attention into income.
          </p>
          <p className="text-white/40">
            People buy from people.
          </p>
        </div>

        {/* Right */}
        <div className="grid grid-cols-2 gap-8">
          
          <div className="space-y-2">
            <div className="text-white/40">PLATFORM</div>
            <a className="block hover:text-white transition" href="#">Post a Bounty</a>
            <a className="block hover:text-white transition" href="#">Start Clipping</a>
            <a className="block hover:text-white transition" href="#">Creators</a>
          </div>

          <div className="space-y-2">
            <div className="text-white/40">COMPANY</div>
            <a className="block hover:text-white transition" href="#">Manifesto</a>
            <a className="block hover:text-white transition" href="#">Privacy</a>
            <a className="block hover:text-white transition" href="#">Terms</a>
          </div>

        </div>

      </div>

      {/* Bottom strip */}
      <div className="px-8 pb-6 flex justify-between text-[10px] text-white/30 font-mono">
        <span>© {new Date().getFullYear()} Clickc</span>
        <span>BUILT ON THE INTERNET</span>
      </div>
    </footer>
  );
}
