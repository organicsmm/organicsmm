import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Zap,
  Shield,
  Target,
  Users,
  CheckCircle2,
  Sparkles,
  Award,
  Clock,
  Rocket,
  IndianRupee,
  Crown,
  MousePointer2,
  Cpu,
  Fingerprint
} from 'lucide-react';

const Index = () => {
  return (
    <main className="min-h-screen bg-[#070709] flex flex-col items-center font-sans selection:bg-primary/20 overflow-x-hidden">

      {/* ── IMMERSIVE BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#d946ef]/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="w-full max-w-[1400px] flex items-center justify-between px-6 md:px-12 py-10 relative z-50">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-14 h-14 bg-black border-2 border-white/10 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-primary/50 transition-all duration-500 overflow-hidden">
            <img src="/favicon.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-3xl font-[1000] text-white tracking-tighter">OrganicSMM</span>
        </div>

        <div className="hidden lg:flex items-center gap-10">
          {['Services', 'Features', 'Pricing', 'Reviews'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-[13px] font-black text-white/40 hover:text-white transition-all uppercase tracking-[0.2em] relative group">
              {item}
              <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <Link to="/auth">
          <button className="px-10 py-4 bg-primary/10 hover:bg-primary/20 border-2 border-primary/20 hover:border-primary/40 rounded-2xl text-[12px] font-black text-white uppercase tracking-[0.15em] transition-all hover:scale-[1.03] active:scale-95 shadow-[0_0_40px_rgba(167,139,250,0.1)] backdrop-blur-xl group flex items-center gap-3">
            AGENT LOGIN
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="w-full max-w-[1400px] px-6 md:px-12 pt-10 pb-32 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
        <div className="flex flex-col items-start translate-z-10">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-xl px-6 py-2.5 rounded-2xl mb-12 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(167,139,250,1)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Terminal v2.0 // Multi-Node Active</span>
          </div>

          <h1 className="text-7xl md:text-[7rem] font-[1000] text-white leading-[0.85] mb-10 tracking-[-0.07em]">
            Elite.<br />
            <span className="text-primary italic drop-shadow-[0_0_50px_rgba(167,139,250,0.3)]">Organic.</span><br />
            Simulated.
          </h1>

          <p className="text-xl text-white/30 font-bold mb-16 max-w-lg leading-relaxed italic border-l-2 border-primary/20 pl-8">
            The world's most advanced growth console. We don't just send traffic—we simulate human consciousness on target nodes.
          </p>

          <div className="flex flex-wrap items-center gap-8">
            <Link to="/auth">
              <button className="h-24 px-16 bg-primary text-black rounded-[2.5rem] font-[1000] text-2xl tracking-tighter shadow-[0_20px_50px_rgba(167,139,250,0.3)] hover:shadow-[0_20px_80px_rgba(167,139,250,0.5)] transition-all hover:-translate-y-2 active:translate-y-0 group">
                <span className="flex items-center gap-4">
                  INITIALIZE PANEL <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
            </Link>

            <div className="flex flex-col gap-2">
              <div className="flex -space-x-4">
                {[12, 18, 24, 32].map(img => (
                  <div key={img} className="w-14 h-14 rounded-2xl border-4 border-[#070709] overflow-hidden bg-white/5">
                    <img src={`https://i.pravatar.cc/100?img=${img}`} alt="User" />
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">+122k ACTIVE NODES</span>
            </div>
          </div>
        </div>

        {/* ── 3D FLOATING CONSOLE ── */}
        <div className="relative group">
          <div className="absolute -inset-20 bg-primary/20 blur-[150px] opacity-30 group-hover:opacity-60 transition-opacity duration-1000" />
          <div className="relative aspect-square max-w-[650px] mx-auto perspective-1000">
            <div className="w-full h-full bg-gradient-to-tr from-white/5 to-white/10 backdrop-blur-3xl rounded-[4.5rem] border border-white/20 shadow-[0_80px_160px_rgba(0,0,0,0.5)] overflow-hidden transform rotate-y-[-10deg] rotate-x-[10deg] hover:rotate-0 transition-all duration-1000">
              <img
                src="/hero-3d.png"
                className="w-full h-full object-cover mix-blend-screen opacity-100 scale-125"
                alt="3D Console Illustration"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent opacity-60" />
            </div>

            {/* Floating UI Badges */}
            <div className="absolute -top-10 -left-10 bg-white/10 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/20 shadow-2xl animate-bounce transition-all duration-1000">
              <Cpu className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute bottom-10 -right-10 bg-white/10 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/20 shadow-2xl animate-pulse delay-700">
              <Fingerprint className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FULL WIDTH FEATURES SECTION ── */}
      <section id="features" className="w-full bg-white/[0.02] border-y border-white/5 py-40 flex justify-center">
        <div className="w-full max-w-[1400px] px-6 md:px-12">
          <div className="max-w-3xl mb-32">
            <div className="inline-flex items-center gap-3 bg-primary/10 px-6 py-2 rounded-xl mb-8 border border-primary/20">
              <Rocket className="w-5 h-5 text-primary" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Unfair Advantage Logic</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-[1000] text-white tracking-tighter leading-none mb-10">
              Bypass the <br /><span className="text-white/20 italic">Algorithm.</span>
            </h2>
            <p className="text-2xl text-white/30 font-bold italic leading-relaxed">
              Standard SMM panels send bulk actions. We send behavioral patterns. Our nodes "view" the content, "hesitate" like humans, and "interact" only during peak emotional triggers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-white/5 border border-white/10 rounded-[4rem] overflow-hidden">
            {[
              {
                title: 'Organic Pulse Scheduler',
                desc: 'Delivery speed fluctuates automatically to mimic real trending topics and viral surges.',
                icon: Clock,
                color: 'text-primary'
              },
              {
                title: 'Browser Fingerprinting',
                desc: 'Each engagement comes from a unique device profile with real ISP residential rotation.',
                icon: Shield,
                color: 'text-emerald-400'
              },
              {
                title: 'Recursive Engagement',
                desc: 'Nodes that like your content will actually return to view your next 3 posts automatically.',
                icon: MousePointer2,
                color: 'text-sky-400'
              },
              {
                title: 'AI Caption Extraction',
                desc: 'System reads your post content to ensure the engagement is contextually optimized.',
                icon: Sparkles,
                color: 'text-amber-400'
              },
              {
                title: 'Ghost Mode Privacy',
                desc: 'Encrypted order logs and zero-trail transaction history for total operational security.',
                icon: Target,
                color: 'text-rose-400'
              },
              {
                title: 'Bulk Reseller API',
                desc: 'Institutional grade API for developers who want to power their own white-label growth firms.',
                icon: Zap,
                color: 'text-primary'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-[#070709] p-16 hover:bg-white/[0.02] transition-colors group">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-white/30 font-bold text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (Immersive Full Width) ── */}
      <section id="reviews" className="w-full py-40 px-6 md:px-12 flex justify-center">
        <div className="w-full max-w-[1400px] grid lg:grid-cols-2 gap-32 items-center">
          <div>
            <h2 className="text-6xl md:text-8xl font-[1000] text-white tracking-tighter leading-none mb-12">
              Proven by <span className="text-primary italic">Shadow Agents.</span>
            </h2>
            <div className="flex gap-4 mb-16">
              <div className="flex -space-x-4">
                {[45, 67, 89].map(i => (
                  <div key={i} className="w-16 h-16 rounded-full border-4 border-[#070709] overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-widest">50,000+</span>
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Verified Subscribers</span>
              </div>
            </div>
          </div>

          <div className="grid gap-10">
            {[
              { name: 'Marcus K.', role: 'Agency Partner', text: 'The drip-feed variance is the best in the industry. I have tested over 50 panels, nothing comes close to OrganicFlow\'s retention rates.' },
              { name: 'Sarah V.', role: 'Influencer Manager', text: 'Finally a panel that doesn\'t trigger the "Spam Detected" flag. The 3D scheduling logic is worth the subscription price alone.' }
            ].map((review, i) => (
              <div key={i} className="p-12 bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-xl text-white/60 font-medium italic mb-10 leading-relaxed relative z-10">"{review.text}"</p>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-black text-white uppercase tracking-widest">{review.name}</p>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING SECTION (Immersive) ── */}
      <section id="pricing" className="w-full bg-primary/5 border-t border-primary/10 py-40 flex justify-center">
        <div className="w-full max-w-[1400px] px-6 md:px-12">
          <div className="text-center mb-32">
            <h2 className="text-6xl md:text-9xl font-[1000] text-white tracking-tighter leading-none mb-10">
              Pick Your <span className="text-primary italic">Weapon.</span>
            </h2>
            <p className="text-2xl text-white/30 font-bold max-w-2xl mx-auto italic">High-performance growth console access. Choose your duration and initialize dominance.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Monthly */}
            <div className="bg-[#070709] p-12 rounded-[4rem] border border-white/5 flex flex-col items-center group hover:border-primary/50 transition-all duration-500 hover:-translate-y-4">
              <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center mb-10 group-hover:bg-primary/20 transition-colors">
                <Clock className="w-10 h-10 text-white/20 group-hover:text-primary transition-all" />
              </div>
              <h3 className="text-3xl font-[1000] text-white uppercase tracking-tight mb-4">Monthly Pro</h3>
              <div className="flex items-baseline gap-2 mb-12">
                <span className="text-7xl font-[1000] text-primary tracking-tighter">$10</span>
                <span className="text-xs font-black text-white/20 uppercase tracking-widest">/ Month</span>
              </div>
              <ul className="space-y-4 mb-16 text-center">
                {['Full Console Access', 'Organic Drip-Feed', 'Multi-Node Support', 'Standard API'].map(item => (
                  <li key={item} className="text-sm font-bold text-white/30 flex items-center gap-3 justify-center">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> {item}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em] mb-10 italic">*Panel Unlock Fee. Services Extra.</p>
              <Link to="/auth" className="w-full">
                <button className="w-full h-24 bg-white/5 hover:bg-white text-white hover:text-black rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] transition-all border border-white/10">
                  START SUBSCRIPTION
                </button>
              </Link>
            </div>

            {/* Lifetime */}
            <div className="bg-[#070709] p-12 rounded-[4rem] border-2 border-primary flex flex-col items-center relative overflow-hidden shadow-[0_40px_100px_rgba(167,139,250,0.2)] hover:-translate-y-4 transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute top-10 left-10 bg-primary text-black px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl z-20">
                PLATINUM ACCESS
              </div>
              <div className="w-24 h-24 rounded-[2.5rem] bg-primary flex items-center justify-center mb-10 shadow-2xl relative z-20">
                <Award className="w-12 h-12 text-black" />
              </div>
              <h3 className="text-4xl font-[1000] text-white uppercase tracking-tight mb-4 relative z-20">Lifetime King</h3>
              <div className="flex items-baseline gap-2 mb-12 relative z-20">
                <span className="text-8xl font-[1000] text-white tracking-tighter">$99</span>
                <span className="text-xs font-black text-white/20 uppercase tracking-widest">One-Time</span>
              </div>
              <ul className="space-y-4 mb-16 text-center relative z-20">
                {['Lifetime Node Access', 'Unlimited API Keys', 'Priority Server Load', 'Highest ROI Margin'].map(item => (
                  <li key={item} className="text-sm font-bold text-white flex items-center gap-3 justify-center">
                    <Sparkles className="w-5 h-5 text-amber-400 fill-current" /> {item}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.3em] mb-10 italic relative z-20">*Permanent Unlock. Pay Per Order.</p>
              <Link to="/auth" className="w-full relative z-20">
                <button className="w-full h-24 bg-primary text-black rounded-[2.5rem] font-black text-xl tracking-tighter border-b-8 border-black/20 hover:border-b-4 active:border-b-0 transition-all">
                  ACTIVATE LICENSE
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="w-full py-32 px-6 md:px-12 flex justify-center bg-[#050507]">
        <div className="w-full max-w-[1400px] grid md:grid-cols-4 gap-20">
          <div className="md:col-span-2 space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-black border border-white/20 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl border-primary/20 p-2">
                <img src="/favicon.png" alt="Logo" className="w-full h-full object-cover rounded-xl" />
              </div>
              <span className="text-4xl font-[1000] text-white tracking-tighter">OrganicSMM</span>
            </div>
            <p className="text-xl text-white/20 font-bold max-w-sm italic leading-relaxed">
              Building the future of social agency infrastructure. Anonymous. Fast. Organic.
            </p>
            <div className="flex gap-4">
              {['X', 'TG', 'IG'].map(s => (
                <div key={s} className="w-12 h-12 rounded-2xl border border-white/5 flex items-center justify-center text-[10px] font-black text-white/30 hover:text-primary transition-all cursor-pointer">{s}</div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white">System Index</h4>
            <ul className="space-y-4 text-sm font-bold text-white/20">
              {['Services', 'API Reference', 'Status Check', 'White Label'].map(l => (
                <li key={l} className="hover:text-primary cursor-pointer transition-colors">{l}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-8 text-right">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white">Operational</h4>
            <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,1)]" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Global Grid Online</span>
            </div>
            <p className="text-[10px] font-black text-white/10 uppercase tracking-widest mt-12">
              © 2026 PROJECT ORGANICSMM<br />
              DECRYPTION UNAUTHORIZED.
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
};

export default Index;
