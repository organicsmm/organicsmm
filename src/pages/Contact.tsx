import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageSquare, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Contact() {
  return (
    <div className="min-h-screen bg-white text-[#1a1025] font-sans selection:bg-purple-100">
      {/* Background Accents */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[-5%] w-[40vw] h-[40vw] bg-purple-50 blur-[100px] rounded-full opacity-60" />
        <div className="absolute bottom-[20%] right-[-5%] w-[40vw] h-[40vw] bg-sky-50 blur-[100px] rounded-full opacity-60" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 relative z-10">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-12 gap-2 text-purple-900/40 hover:text-purple-900 hover:bg-purple-50 rounded-xl">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>

        <header className="mb-16">
          <h1 className="text-5xl md:text-6xl font-[1000] tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-900 to-sky-600 mb-6 font-sans">
            Contact Support
          </h1>
          <p className="text-xl text-purple-950/60 font-medium leading-relaxed max-w-2xl">
            Have questions about our growth systems? Our technical team is available 24/7 to provide assistance.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100/50 space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-purple-600 transition-colors">
                <Mail className="w-6 h-6 text-purple-600 group-hover:text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-purple-950/30 mb-1">Email Us</h3>
                <p className="text-xl font-[900] text-purple-950">support@organicsmm.pro</p>
                <p className="text-sm font-bold text-purple-900/50 mt-1">Typical response time: Under 2 hours.</p>
              </div>
            </div>

            <div className="p-6 bg-sky-50 rounded-3xl border border-sky-100/50 space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-sky-600 transition-colors">
                <MessageSquare className="w-6 h-6 text-sky-600 group-hover:text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[#1a1025]/30 mb-1">Live Chat</h3>
                <p className="text-xl font-[900] text-[#1a1025]">Dashboard Chat</p>
                <p className="text-sm font-bold text-sky-900/50 mt-1">Available to logged in users 24/7.</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 text-purple-950/60 font-medium">
                <MapPin className="w-5 h-5 text-purple-400" />
                <p className="text-sm leading-relaxed">
                  <strong>Registered Address:</strong><br />
                  Digital Hub One, High-Tech Area<br />
                  Bangalore, Karnataka, 560001<br />
                  India
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-purple-50 shadow-[0_40px_80px_rgba(147,51,234,0.05)]">
            <h3 className="text-2xl font-[900] text-purple-950 mb-6 tracking-tight">Direct Message</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-purple-950/30 px-1">Full Name</label>
                <input type="text" placeholder="Your Name" className="w-full h-14 bg-purple-50/50 border border-purple-100 rounded-2xl px-5 text-sm font-bold outline-none focus:border-purple-300 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-purple-950/30 px-1">Email Address</label>
                <input type="email" placeholder="you@gmail.com" className="w-full h-14 bg-purple-50/50 border border-purple-100 rounded-2xl px-5 text-sm font-bold outline-none focus:border-purple-300 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-purple-950/30 px-1">Message</label>
                <textarea rows={4} placeholder="How can we help?" className="w-full bg-purple-50/50 border border-purple-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-purple-300 transition-colors resize-none"></textarea>
              </div>
              <Button className="w-full h-14 bg-purple-900 hover:bg-purple-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-purple-900/20 group">
                SEND MESSAGE
                <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </form>
          </div>
        </section>

        <footer className="text-center pt-16 border-t border-purple-50 mt-16">
          <p className="text-xs font-bold text-purple-900/20 tracking-wider">
            ORGANICSMM GLOBAL SUPPORT • AVAILABLE MON-SUN • 24 HOURS
          </p>
        </footer>
      </div>
    </div>
  );
}
