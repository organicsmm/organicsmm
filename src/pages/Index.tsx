import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Zap, Shield, TrendingUp, BarChart3, ArrowRight, CheckCircle2,
  Sparkles, Globe, Users, Clock, Star, ChevronRight, Mail, FileText, HelpCircle,
  Activity, Shuffle, Timer, Moon, Target, Award
} from 'lucide-react';
import sitelogo from '@/assets/logo.png';
import { PageMeta } from '@/components/seo/PageMeta';

export default function Index() {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Home"
        description="OrganicSMM - Revolutionary organic social media growth platform. Get natural engagement with variable delivery patterns that simulate real human activity. 100% safe for your accounts."
        canonicalPath="/"
      />

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/95">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black overflow-hidden p-0.5">
              <img src={sitelogo} alt="OrganicSMM" className="h-full w-full object-contain" />
            </div>
            <span className="text-base font-bold text-foreground tracking-tight">OrganicSMM</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" onClick={scrollTo('features')} className="text-sm text-muted-foreground hover:text-foreground">Products</a>
            <a href="#how-it-works" onClick={scrollTo('how-it-works')} className="text-sm text-muted-foreground hover:text-foreground">Use Cases</a>
            <a href="#pricing" onClick={scrollTo('pricing')} className="text-sm text-muted-foreground hover:text-foreground">Pricing</a>
            <a href="#stats" onClick={scrollTo('stats')} className="text-sm text-muted-foreground hover:text-foreground">About</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="outline" size="sm" className="hidden sm:flex rounded-lg border-border text-xs font-semibold">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="rounded-lg bg-white text-black hover:bg-white/90 text-xs font-semibold px-4">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-6 text-center max-w-4xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/15 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-sm font-semibold text-white/80">7 Days FREE Trial — No Card Required</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.08] tracking-tight">
            Organic Growth<br />
            Made <span className="text-white/40">Simple</span>
          </h1>

          <p className="text-lg text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Revolutionary social media growth with natural delivery patterns.{' '}
            <span className="text-white/80 font-medium">100% safe</span> for your accounts.
          </p>

          {/* Pricing pills */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 bg-white/5">
              <Zap className="h-4 w-4 text-white/50" />
              <span className="text-sm text-white/60 font-medium">$20 / month</span>
            </div>
            <span className="text-white/25 text-sm">or</span>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500/30 bg-amber-500/8">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-amber-400 font-medium">$199 lifetime</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link to="/auth">
              <Button size="lg" className="rounded-xl px-10 py-6 text-base font-bold bg-white text-black hover:bg-white/92 shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)]">
                <Zap className="h-5 w-5 mr-2" />
                Start 7-Day Free Trial
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" size="lg" className="rounded-xl px-10 py-6 text-base border-white/20 hover:border-white/35 hover:bg-white/5">
                View Services
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Trust line */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/40">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/70" />7 days free trial</span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-white/50" />No credit card required</span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-white/50" />All features included</span>
          </div>
        </div>
      </section>

      {/* ── UNIQUE FEATURES BANNER ── */}
      <section className="py-16 border-y border-border">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/50 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-foreground" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wide">World's First AI-Organic Panel</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Features <span className="text-muted-foreground">No Other Panel Has</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: Activity, title: 'S-Curve Pattern', desc: 'Natural viral growth' },
              { icon: Shuffle, title: '±50% Variance', desc: 'Random qty each run' },
              { icon: Clock, title: 'Peak Hour Boost', desc: '1.5× during 6–10PM IST' },
              { icon: Moon, title: 'Night Slowdown', desc: 'Realistic sleep hours' },
              { icon: Timer, title: '±5 Min Jitter', desc: 'Anti-detection timing' },
              { icon: BarChart3, title: 'Live Preview', desc: 'See delivery before order' },
            ].map((f, i) => (
              <div key={i} className="glass-card p-4 text-center">
                <div className="w-10 h-10 mx-auto rounded-xl bg-white/8 border border-white/15 flex items-center justify-center mb-3">
                  <f.icon className="h-5 w-5 text-white/80" />
                </div>
                <h3 className="text-xs font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-[11px] text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Comparison */}
          <div className="mt-8 glass-card p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-white/8 flex items-center justify-center text-sm">✗</div>
                  <span className="font-semibold text-sm">Regular SMM Panels</span>
                </div>
                <ul className="space-y-2">
                  {['Same quantity every batch = Easy detection', 'Fixed intervals = Bot pattern visible', '24/7 delivery = Unnatural behavior', 'Accounts get flagged & banned'].map(t => (
                    <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-white/25 shrink-0" />{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-foreground">
                  <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-sm">✓</div>
                  <span className="font-semibold text-sm">OrganicSMM</span>
                </div>
                <ul className="space-y-2">
                  {['Random variance = Looks like real users', 'Jittered timing = Undetectable patterns', 'Peak hours + night slow = Human behavior', '100% safe, zero bans reported'].map(t => (
                    <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-white/70 shrink-0" />{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2"><Award className="h-4 w-4 text-foreground" /><span className="text-sm font-medium text-foreground">50,000+ Orders Delivered</span></div>
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-foreground" /><span className="text-sm font-medium text-foreground">Zero Account Bans</span></div>
              <div className="flex items-center gap-2"><Target className="h-4 w-4 text-foreground" /><span className="text-sm font-medium text-foreground">99.9% Success Rate</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border text-muted-foreground text-xs mb-6 bg-secondary/50">
              <Sparkles className="h-3 w-3" />Choose Your Plan
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Start with a <span className="text-white font-semibold">7-day free trial</span>. Then choose the plan that works for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border mb-6">
                <Zap className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Monthly Plan</h3>
              <p className="text-muted-foreground text-sm mb-6">Perfect for getting started</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-foreground">$20</span>
                <span className="text-muted-foreground">/ month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['7-day free trial included', 'Full platform access', 'All organic features', 'Unlimited orders', 'Cancel anytime'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-white/50 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link to="/auth" className="block">
                <Button variant="outline" className="w-full rounded-xl py-6 font-semibold hover:bg-white/8">
                  Get Started <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="glass-card p-8 border-amber-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-xl tracking-wider">
                BEST VALUE
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 mb-6">
                <Star className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Lifetime Plan</h3>
              <p className="text-muted-foreground text-sm mb-6">One-time payment, forever access</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-amber-500">$199</span>
                <span className="text-muted-foreground">one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Everything in Monthly', 'Forever access', 'All future updates', 'Priority support', 'No recurring fees'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-amber-500/70 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link to="/auth" className="block">
                <Button className="w-full rounded-xl py-6 font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white border-0">
                  Get Lifetime Access <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            After signup, submit a subscription request and we'll contact you to activate your plan.
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" className="py-20 border-y border-border scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto">
            {[
              { value: '10M+', label: 'Orders Delivered', icon: Globe },
              { value: '50K+', label: 'Happy Customers', icon: Users },
              { value: '99.9%', label: 'Uptime', icon: Zap },
              { value: '24/7', label: 'Support', icon: Clock },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-border mb-4 bg-secondary/50">
                  <s.icon className="h-4 w-4 text-foreground" />
                </div>
                <p className="text-3xl md:text-4xl font-black text-foreground mb-1">{s.value}</p>
                <p className="text-muted-foreground text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full border border-border text-muted-foreground text-xs mb-6">Why OrganicSMM</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Engineered for <span className="text-muted-foreground">Authentic Growth</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlike traditional panels that deliver robotic patterns, our system creates natural engagement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {[
              { icon: TrendingUp, title: 'Natural Growth Curves', description: 'Variable delivery quantities that perfectly mimic real organic engagement patterns.' },
              { icon: Zap, title: 'Peak Hour Optimization', description: 'Higher delivery during active hours (6PM–10PM) for realistic engagement timing.' },
              { icon: Shield, title: 'Account Safety', description: 'Randomized patterns prevent detection and keep your accounts 100% secure.' },
              { icon: BarChart3, title: 'Live Preview', description: 'See exactly when and how much will be delivered before placing your order.' },
              { icon: CheckCircle2, title: 'Premium Quality', description: 'High-quality engagement from real-looking accounts with complete profiles.' },
              { icon: Shuffle, title: 'Organic Variance', description: '±25% random variance on each delivery for unpredictable, natural growth.' },
            ].map((f, i) => (
              <div key={i} className="glass-card p-7">
                <div className="w-10 h-10 rounded-xl border border-border flex items-center justify-center mb-5 bg-secondary/50">
                  <f.icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="text-base font-semibold mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 border-y border-border scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full border border-border text-muted-foreground text-xs mb-6">The Difference</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              See How <span className="text-muted-foreground">Organic Mode</span> Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Traditional panels deliver flat, robotic patterns. Our system creates natural variance.
            </p>
          </div>

          <div className="max-w-5xl mx-auto glass-card p-8 md:p-12">
            <p className="text-sm text-muted-foreground mb-10 text-center">Example: 1000 views over 5 hours (10 runs, 30min intervals)</p>
            <div className="grid md:grid-cols-2 gap-10 mb-10">
              <div>
                <p className="text-sm font-medium mb-4 flex items-center gap-2 text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/30" />Traditional Delivery (Flat)
                </p>
                <div className="flex items-end gap-1.5 h-28 bg-secondary/50 rounded-xl p-3">
                  {[100, 100, 100, 100, 100, 100, 100, 100, 100, 100].map((v, i) => (
                    <div key={i} className="flex-1 bg-white/25 rounded-t" style={{ height: `${v / 1.5}%` }} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">Same amount every time ❌</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-4 flex items-center gap-2 text-foreground">
                  <span className="w-2.5 h-2.5 rounded-full bg-white" />Organic Growth (Natural)
                </p>
                <div className="flex items-end gap-1.5 h-28 bg-secondary/50 rounded-xl p-3">
                  {[85, 112, 145, 78, 160, 92, 134, 88, 106, 100].map((v, i) => (
                    <div key={i} className="flex-1 bg-white rounded-t" style={{ height: `${v / 1.5}%` }} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">Natural variance like real users ✅</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '±25%', label: 'Random Variance', icon: Sparkles },
                { value: '1.5×', label: 'Peak Hour Boost', icon: TrendingUp },
                { value: '100%', label: 'Safe & Natural', icon: Shield },
              ].map((s, i) => (
                <div key={i} className="glass-panel p-4 text-center rounded-xl">
                  <s.icon className="h-4 w-4 text-foreground mx-auto mb-2" />
                  <p className="text-2xl font-black text-foreground mb-1">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="glass-card p-12 md:p-20 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Ready to Grow <span className="text-muted-foreground">Organically</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of creators and businesses using our organic delivery system. No credit card required to start.
            </p>
            <Link to="/auth">
              <Button size="lg" className="rounded-xl px-12 py-6 text-base font-bold bg-white text-black hover:bg-white/90">
                Create Free Account <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black overflow-hidden p-0.5">
                  <img src={sitelogo} alt="OrganicSMM" className="h-full w-full object-contain" />
                </div>
                <span className="font-bold text-foreground">OrganicSMM</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Revolutionary organic social media growth platform with natural delivery patterns.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/auth" className="text-muted-foreground hover:text-foreground">Get Started</Link></li>
                <li><Link to="/services" className="text-muted-foreground hover:text-foreground">Services</Link></li>
                <li><a href="#pricing" onClick={scrollTo('pricing')} className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#stats" onClick={scrollTo('stats')} className="text-muted-foreground hover:text-foreground">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground flex items-center gap-2"><FileText className="h-3 w-3" />Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground flex items-center gap-2"><Shield className="h-3 w-3" />Privacy Policy</Link></li>
                <li><Link to="/refund" className="text-muted-foreground hover:text-foreground flex items-center gap-2"><FileText className="h-3 w-3" />Refund Policy</Link></li>
                <li><Link to="/cookies" className="text-muted-foreground hover:text-foreground flex items-center gap-2"><FileText className="h-3 w-3" />Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground flex items-center gap-2"><HelpCircle className="h-3 w-3" />Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground flex items-center gap-2"><Mail className="h-3 w-3" />Contact Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground flex items-center gap-2"><Globe className="h-3 w-3" />Status Page</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} OrganicSMM. All rights reserved.</p>
            <div className="flex items-center gap-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" />SSL Secured</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" />99.9% Uptime</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
