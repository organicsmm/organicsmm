import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Zap,
  Shield,
  Target,
  Users,
  CheckCircle2,
  Sparkles,
  Award,
  Clock
} from 'lucide-react';

const Index = () => {
  return (
    <main className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-10 px-4 md:px-10 font-sans selection:bg-[#9b87f5]/20 overflow-x-hidden">

      {/* Main Rounded Container - HERO & NAV */}
      <div className="bg-white w-full max-w-[1200px] rounded-[3.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.04)] overflow-hidden relative border border-white/50 mb-12">

        {/* Navbar */}
        <nav className="flex items-center justify-between px-10 py-8 relative z-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] rounded-2xl flex items-center justify-center shadow-lg shadow-[#9b87f5]/30">
              <Zap className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="text-2xl font-[1000] text-[#1a1a2e] tracking-tight">OrganicSMM</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['Services', 'Features', 'Pricing', 'Reviews'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="font-extrabold text-[#1a1a2e]/40 hover:text-[#1a1a2e] transition-all text-xs uppercase tracking-widest">
                {item}
              </a>
            ))}
          </div>

          <Link to="/auth">
            <Button className="rounded-2xl px-8 py-6 bg-[#1a1a2e] text-white hover:bg-[#2e2e4a] transition-all font-black text-xs uppercase tracking-wider group shadow-xl hover:shadow-[#1a1a2e]/20">
              Sign In
            </Button>
          </Link>
        </nav>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-10 px-10 pb-20 pt-10 relative">

          {/* Left Content */}
          <div className="flex flex-col justify-center relative z-10">
            <div className="inline-flex items-center gap-3 bg-[#ffdeed]/80 backdrop-blur-sm px-5 py-2 rounded-full mb-10 w-fit">
              <div className="w-2 h-2 rounded-full bg-[#d946ef]" />
              <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#d946ef]">Console v2.0 Live</span>
            </div>

            <h1 id="features" className="text-6xl md:text-[5.5rem] font-[1000] text-[#1a1a2e] leading-[0.9] mb-10 tracking-[-0.05em]" style={{ textShadow: '0 10px 30px rgba(155, 135, 245, 0.2)' }}>
              Viral.<br />
              <span className="text-[#9b87f5]">Organic.</span><br />
              Instant.
            </h1>

            <p className="text-xl text-[#1a1a2e]/50 font-bold mb-14 max-w-sm leading-tight tracking-tight">
              The elite console for social dominance. AI-simulated growth that platforms can't detect.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link to="/auth">
                <Button className="h-[4.5rem] px-12 rounded-[2rem] bg-[#9b87f5] hover:bg-[#8b76e5] text-white font-black text-2xl shadow-[0_20px_40px_rgba(155,135,245,0.4)] hover:scale-[1.03] transition-all active:scale-95">
                  Launch Console <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-zinc-100">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white bg-white flex items-center justify-center text-[10px] font-black text-[#1a1a2e]/40">
                  +5k
                </div>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-[600px] group">
              {/* Decorative background aura */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-[#9b87f5]/20 to-[#ffdeed]/20 rounded-full blur-[120px] opacity-100 transition-transform duration-1000" />

              <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                {/* Floating Glass Platform */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#9b87f5]/10 to-white/50 backdrop-blur-2xl rounded-[4rem] border border-white/40 shadow-[0_40px_80px_rgba(0,0,0,0.03)] overflow-hidden">
                  <img
                    src="/hero-3d.png"
                    alt="Organic Growth Terminal"
                    className="w-full h-full object-cover mix-blend-multiply opacity-90 scale-110"
                  />
                  {/* Inner Glow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/60 pointer-events-none" />
                </div>

                {/* Decorative 3D elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#9b87f5]/20 blur-[60px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#d946ef]/10 blur-[80px] rounded-full pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Navigation Bar */}
        <div className="px-10 py-10 flex items-center justify-between bg-[#fbfcfd] border-t border-[#f1f5f9]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button className="w-12 h-12 rounded-2xl bg-[#9b87f5] flex items-center justify-center text-white shadow-lg shadow-[#9b87f5]/25">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 rounded-2xl bg-white border-2 border-[#f1f5f9] flex items-center justify-center text-[#1a1a2e]">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="h-6 w-px bg-[#e2e8f0] mx-2" />
            <div className="flex flex-col">
              <span className="text-[12px] font-[1000] text-[#9b87f5] uppercase tracking-[0.2em] mb-0.5">Console System</span>
              <span className="text-[13px] font-black text-[#161b22]/70">Organic Growth Engine v2</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {[
              { icon: Target, text: '99.9% Retention' },
              { icon: Shield, text: 'Safety Protocol v3' },
              { icon: Users, text: '50,000 Nodes' }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-white px-5 py-3 rounded-2xl border border-[#f1f5f9] shadow-sm">
                <stat.icon className="w-4 h-4 text-[#9b87f5]" />
                <span className="font-extrabold text-[12px] text-[#1a1a2e]/60 tracking-tight">{stat.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRICING SECTION ── */}
      <section id="pricing" className="w-full max-w-[1200px] mb-20 px-4 md:px-0">
        <div className="text-center mb-16">
          <div id="services" className="inline-flex items-center gap-2 bg-[#9b87f5]/10 px-4 py-2 rounded-xl mb-6 border border-[#9b87f5]/20">
            <Sparkles className="w-4 h-4 text-[#9b87f5]" />
            <span className="text-[11px] font-[900] uppercase tracking-widest text-[#9b87f5]">Flexible Access</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-[1000] text-[#1a1a2e] mb-4" style={{ textShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>Choose Your Growth Path.</h2>
          <p className="text-[#1a1a2e]/40 font-bold max-w-sm mx-auto">No free trials. Only high-performance organic growth for serious builders.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

          {/* Monthly Plan */}
          <div className="bg-white rounded-[3rem] p-10 border-2 border-transparent hover:border-[#9b87f5]/30 transition-all shadow-xl shadow-zinc-200/50 flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-3xl bg-zinc-50 flex items-center justify-center mb-8 group-hover:bg-[#9b87f5]/5 transition-colors">
              <Clock className="w-8 h-8 text-zinc-400 group-hover:text-[#9b87f5]" />
            </div>
            <h3 className="text-2xl font-[1000] text-[#1a1a2e] mb-2 tracking-tight">Monthly Pro</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-5xl font-[1000] text-[#9b87f5]">$10</span>
              <span className="text-sm font-bold text-zinc-400">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 text-zinc-500 font-bold text-sm w-full">
              <li className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#9b87f5]" /> All 5,000+ Services</li>
              <li className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#9b87f5]" /> 25% Growth Variance</li>
              <li className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#9b87f5]" /> API Key Access</li>
              <li className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#9b87f5]" /> Standard Support</li>
            </ul>
            <Link to="/auth" className="w-full">
              <Button className="w-full h-16 rounded-2xl bg-[#1a1a2e] text-white font-black">
                Subscribe Now
              </Button>
            </Link>
          </div>

          {/* Lifetime Plan */}
          <div className="bg-white rounded-[3rem] p-10 border-4 border-[#9b87f5] relative shadow-2xl shadow-[#9b87f5]/20 flex flex-col items-center text-center scale-105 transform">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#9b87f5] text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">
              Best Value
            </div>
            <div className="w-16 h-16 rounded-3xl bg-[#9b87f5]/10 flex items-center justify-center mb-8">
              <Award className="w-8 h-8 text-[#9b87f5]" />
            </div>
            <h3 className="text-2xl font-[1000] text-[#1a1a2e] mb-2 tracking-tight">Lifetime King</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-6xl font-[1000] text-[#1a1a2e] tracking-tighter">$99</span>
              <span className="text-sm font-bold text-zinc-400">/one-time</span>
            </div>
            <ul className="space-y-4 mb-10 text-[#1a1a2e]/60 font-bold text-sm w-full">
              <li className="flex items-center justify-center gap-2 font-black transition-all hover:scale-105"><Sparkles className="w-4 h-4 text-amber-500 fill-current" /> Priority Peak Access</li>
              <li className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#9b87f5]" /> Zero-Fees Deposits</li>
              <li className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#9b87f5]" /> Priority Support 24/7</li>
              <li className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#9b87f5]" /> Lifetime Console Updates</li>
            </ul>
            <Link to="/auth" className="w-full">
              <Button className="w-full h-16 rounded-2xl bg-[#9b87f5] text-white font-black shadow-lg shadow-[#9b87f5]/30">
                Get Lifetime License
              </Button>
            </Link>
          </div>

        </div>

        {/* Simple Reviews Section Placeholder */}
        <div id="reviews" className="mt-24 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1a1a2e]/20 mb-4">Trusted by 5,000+ Agents</p>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} className="w-4 h-4 text-amber-400 fill-current" />)}
          </div>
        </div>
      </section>

    </main>
  );
};

export default Index;
