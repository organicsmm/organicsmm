import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Rocket, Target, Users, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function About() {
  return (
    <div className="min-h-screen bg-white text-[#1a1025] font-sans selection:bg-purple-100">
      {/* Background Accents */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-50 blur-[120px] rounded-full opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-fuchsia-50 blur-[120px] rounded-full opacity-60" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 relative z-10">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-12 gap-2 text-purple-900/40 hover:text-purple-900 hover:bg-purple-50 rounded-xl">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>

        <header className="mb-16">
          <h1 className="text-5xl md:text-6xl font-[1000] tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-900 to-fuchsia-600 mb-6">
            About OrganicSMM
          </h1>
          <p className="text-xl text-purple-950/60 font-medium leading-relaxed max-w-2xl">
            We are a next-generation digital marketing consultancy focused on creating authentic growth through advanced simulation technology.
          </p>
        </header>

        <div className="space-y-20">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-[900] text-purple-950 mb-4 tracking-tight">Our Mission</h2>
              <p className="text-purple-900/70 leading-relaxed font-medium">
                In an era of cluttered digital spaces, standing out requires more than just numbers. Our mission is to provide businesses, creators, and brands with the tools and strategies they need to simulate organic growth surges that actually stick. 
                <br /><br />
                We don't just "deliver engagement"—we design social proof systems that help you build credibility and reach your true target audience.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-purple-50 rounded-3xl p-6 flex flex-col justify-end group hover:bg-purple-600 transition-colors">
                <Target className="w-8 h-8 text-purple-600 mb-3 group-hover:text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-950/40 group-hover:text-white/60">Strategy</span>
              </div>
              <div className="aspect-square bg-fuchsia-50 rounded-3xl p-6 flex flex-col justify-end group hover:bg-fuchsia-600 transition-colors">
                <Rocket className="w-8 h-8 text-fuchsia-600 mb-3 group-hover:text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-950/40 group-hover:text-white/60">Growth</span>
              </div>
              <div className="aspect-square bg-indigo-50 rounded-3xl p-6 flex flex-col justify-end group hover:bg-indigo-600 transition-colors">
                <Users className="w-8 h-8 text-indigo-600 mb-3 group-hover:text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-950/40 group-hover:text-white/60">Authenticity</span>
              </div>
              <div className="aspect-square bg-emerald-50 rounded-3xl p-6 flex flex-col justify-end group hover:bg-emerald-600 transition-colors">
                <ShieldCheck className="w-8 h-8 text-emerald-600 mb-3 group-hover:text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-950/40 group-hover:text-white/60">Security</span>
              </div>
            </div>
          </section>

          <section className="bg-purple-900 text-white rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-32 -mt-32" />
            <div className="relative z-10">
              <h2 className="text-4xl font-[1000] tracking-tighter mb-6">Why Choose Us?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-fuchsia-400" />
                    <h3 className="font-black text-lg">Sophisticated Tech</h3>
                  </div>
                  <p className="text-white/60 text-sm font-bold leading-relaxed">
                    We utilize proprietary residential proxy rotation and device spoofing to ensure every interaction looks and feels completely natural to platform algorithms.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-black text-lg">Operational Safety</h3>
                  </div>
                  <p className="text-white/60 text-sm font-bold leading-relaxed">
                    Your account security is our top priority. We use staggered delivery systems and encrypted trails to protect your digital assets.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <footer className="text-center pt-8 border-t border-purple-50">
            <p className="text-sm font-bold text-purple-900/30">
              OrganicSMM.pro — Part of the OrganicFlow Marketing Network.
              <br />
              Established 2026.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
