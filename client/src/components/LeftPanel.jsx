export default function LeftPanel() {
  const destinations = ['Tokyo', 'Santorini', 'Maldives', 'Patagonia', 'Kyoto']
  const features = [
    { icon: '✈️', text: 'Upload boarding passes & tickets' },
    { icon: '🤖', text: 'AI generates your perfect itinerary' },
    { icon: '🗺️', text: 'Explore curated local experiences' },
    { icon: '📅', text: 'Day-by-day travel planning' },
  ]

  return (
    <div className="relative hidden lg:flex flex-col justify-between h-full overflow-hidden p-10 xl:p-14">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-aurora absolute -top-32 -left-32 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,211,219,0.15) 0%, transparent 70%)' }} />
        <div className="animate-aurora absolute top-1/3 -right-20 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)', animationDelay: '3s' }} />
        <div className="animate-aurora absolute -bottom-20 left-1/4 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(79,142,247,0.1) 0%, transparent 70%)', animationDelay: '6s' }} />
      </div>

      {/* Grid lines overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(99,211,219,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,211,219,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Logo */}
      <div className="relative z-10 animate-fade-up">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, #63d3db, #4f8ef7)' }}>
            <span className="text-lg">✈</span>
          </div>
          <span className="font-display text-lg font-700 tracking-tight text-white">
            Voyage<span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #63d3db, #a78bfa)' }}>AI</span>
          </span>
        </div>
      </div>

      {/* Central Illustration */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-8">
        <div className="relative">
          {/* Globe */}
          <div className="animate-float relative w-52 h-52 xl:w-64 xl:h-64">
            <div className="absolute inset-0 rounded-full animate-pulse-glow"
              style={{ background: 'radial-gradient(circle at 35% 35%, rgba(99,211,219,0.3), rgba(79,142,247,0.15), rgba(167,139,250,0.1))', boxShadow: 'inset 0 0 40px rgba(99,211,219,0.1)' }}>
            </div>
            {/* Orbit ring */}
            <div className="absolute inset-[-20px] rounded-full border border-cyan-400/15 animate-spin-slow" />
            <div className="absolute inset-[-40px] rounded-full border border-violet-400/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />

            {/* Globe SVG */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="85" stroke="rgba(99,211,219,0.2)" strokeWidth="1"/>
              <ellipse cx="100" cy="100" rx="40" ry="85" stroke="rgba(99,211,219,0.15)" strokeWidth="1"/>
              <ellipse cx="100" cy="100" rx="75" ry="85" stroke="rgba(99,211,219,0.1)" strokeWidth="1"/>
              <line x1="15" y1="100" x2="185" y2="100" stroke="rgba(99,211,219,0.15)" strokeWidth="1"/>
              <line x1="22" y1="65" x2="178" y2="65" stroke="rgba(99,211,219,0.1)" strokeWidth="1"/>
              <line x1="22" y1="135" x2="178" y2="135" stroke="rgba(99,211,219,0.1)" strokeWidth="1"/>
              {/* Continents - simplified blobs */}
              <ellipse cx="80" cy="85" rx="20" ry="14" fill="rgba(99,211,219,0.2)"/>
              <ellipse cx="125" cy="95" rx="15" ry="20" fill="rgba(167,139,250,0.2)"/>
              <ellipse cx="70" cy="120" rx="12" ry="8" fill="rgba(79,142,247,0.2)"/>
              <ellipse cx="140" cy="70" rx="10" ry="7" fill="rgba(99,211,219,0.15)"/>
              {/* Location pins */}
              <circle cx="82" cy="80" r="3" fill="#63d3db" opacity="0.9"/>
              <circle cx="82" cy="80" r="6" fill="#63d3db" opacity="0.2"/>
              <circle cx="128" cy="92" r="3" fill="#a78bfa" opacity="0.9"/>
              <circle cx="128" cy="92" r="6" fill="#a78bfa" opacity="0.2"/>
              <circle cx="68" cy="118" r="3" fill="#4f8ef7" opacity="0.9"/>
              <circle cx="68" cy="118" r="6" fill="#4f8ef7" opacity="0.2"/>
              {/* Connecting lines */}
              <path d="M82,80 Q105,60 128,92" stroke="rgba(99,211,219,0.3)" strokeWidth="1" strokeDasharray="3,3"/>
              <path d="M128,92 Q95,110 68,118" stroke="rgba(167,139,250,0.3)" strokeWidth="1" strokeDasharray="3,3"/>
            </svg>

            {/* Center AI badge */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-card rounded-2xl px-3 py-2 text-center"
                style={{ border: '1px solid rgba(99,211,219,0.2)' }}>
                <div className="text-2xl">🤖</div>
                <div className="text-xs font-display font-semibold text-cyan-400 tracking-wider mt-0.5">AI</div>
              </div>
            </div>
          </div>

          {/* Floating destination chips */}
          {destinations.map((dest, i) => {
            const positions = [
              '-top-4 -right-8', 'top-8 -left-16', 'bottom-16 -right-12',
              '-bottom-4 left-4', 'top-1/2 -right-16'
            ]
            const delays = ['0s', '1s', '2s', '3s', '4s']
            return (
              <div key={dest}
                className={`absolute ${positions[i]} glass-card rounded-full px-3 py-1.5 flex items-center gap-1.5 animate-float`}
                style={{ animationDelay: delays[i], border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs text-slate-300 font-display font-medium whitespace-nowrap">{dest}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom text & features */}
      <div className="relative z-10 space-y-6 animate-fade-up stagger-3">
        <div>
          <h1 className="font-display text-3xl xl:text-4xl font-bold text-white leading-tight">
            Your journey,<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #63d3db 0%, #4f8ef7 50%, #a78bfa 100%)' }}>
              intelligently planned.
            </span>
          </h1>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-xs">
            Upload your travel tickets and let our AI craft a bespoke itinerary tailored to your journey.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {features.map((f, i) => (
            <div key={i} className="glass-card rounded-xl p-3 flex items-start gap-2.5"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-base leading-none mt-0.5">{f.icon}</span>
              <span className="text-xs text-slate-400 leading-relaxed">{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
