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
      <header className="fixed top-0 left-0 right-0 z-50" style={{
        background: 'hsl(150 25% 4% / 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid hsl(145 72% 52% / 0.08)',
      }}>
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden p-0.5" style={{
              background: 'hsl(150 25% 8%)',
              border: '1px solid hsl(145 72% 52% / 0.15)',
              boxShadow: '0 0 16px -4px hsl(145 72% 52% / 0.2)',
            }}>
              <img src={sitelogo} alt="OrganicSMM" className="h-full w-full object-contain" />
            </div>
            <span className="text-base font-bold tracking-tight" style={{ color: 'hsl(140 60% 95%)' }}>OrganicSMM</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" onClick={scrollTo('features')} className="text-sm" style={{ color: 'hsl(145 15% 50%)' }}>Products</a>
            <a href="#how-it-works" onClick={scrollTo('how-it-works')} className="text-sm" style={{ color: 'hsl(145 15% 50%)' }}>Use Cases</a>
            <a href="#pricing" onClick={scrollTo('pricing')} className="text-sm" style={{ color: 'hsl(145 15% 50%)' }}>Pricing</a>
            <a href="#stats" onClick={scrollTo('stats')} className="text-sm" style={{ color: 'hsl(145 15% 50%)' }}>About</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="outline" size="sm" className="hidden sm:flex rounded-lg text-xs font-semibold" style={{
                borderColor: 'hsl(145 72% 52% / 0.2)',
                color: 'hsl(145 72% 60%)',
              }}>
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="rounded-lg text-xs font-semibold px-4" style={{
                background: 'linear-gradient(135deg, hsl(145 72% 52%), hsl(160 72% 42%))',
                color: 'hsl(152 50% 4%)',
                boxShadow: '0 1px 0 0 hsl(145 80% 62% / 0.3) inset, 0 4px 16px -4px hsl(145 72% 52% / 0.35)',
              }}>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{
          background: 'radial-gradient(ellipse, hsl(145 72% 52% / 0.08) 0%, transparent 70%)',
        }} />

        <div className="container mx-auto px-6 text-center max-w-4xl relative z-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{
            background: 'hsl(145 72% 52% / 0.06)',
            border: '1px solid hsl(145 72% 52% / 0.15)',
            boxShadow: '0 0 20px -6px hsl(145 72% 52% / 0.15)',
          }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(145 72% 52%)', boxShadow: '0 0 8px hsl(145 72% 52% / 0.6)' }} />
            <span className="text-sm font-semibold" style={{ color: 'hsl(145 72% 65%)' }}>7 Days FREE Trial — No Card Required</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.08] tracking-tight" style={{ color: 'hsl(140 60% 95%)' }}>
            Organic Growth<br />
            Made <span style={{ color: 'hsl(145 72% 52%)' }}>Simple</span>
          </h1>

          <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: 'hsl(145 15% 50%)' }}>
            Revolutionary social media growth with natural delivery patterns.{' '}
            <span className="font-medium" style={{ color: 'hsl(145 72% 60%)' }}>100% safe</span> for your accounts.
          </p>

          {/* Pricing pills */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{
              border: '1px solid hsl(145 72% 52% / 0.15)',
              background: 'hsl(145 72% 52% / 0.06)',
            }}>
              <Zap className="h-4 w-4" style={{ color: 'hsl(145 72% 52% / 0.6)' }} />
              <span className="text-sm font-medium" style={{ color: 'hsl(145 15% 55%)' }}>$20 / month</span>
            </div>
            <span className="text-sm" style={{ color: 'hsl(145 15% 30%)' }}>or</span>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{
              border: '1px solid hsl(42 90% 55% / 0.3)',
              background: 'hsl(42 90% 55% / 0.06)',
            }}>
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-amber-400 font-medium">$199 lifetime</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link to="/auth">
              <Button size="lg" className="rounded-xl px-10 py-6 text-base font-bold" style={{
                background: 'linear-gradient(135deg, hsl(145 72% 52%), hsl(160 72% 42%))',
                color: 'hsl(152 50% 4%)',
                boxShadow: '0 1px 0 0 hsl(145 80% 62% / 0.4) inset, 0 -2px 0 0 hsl(150 70% 30% / 0.3) inset, 0 6px 30px -6px hsl(145 72% 52% / 0.45)',
              }}>
                <Zap className="h-5 w-5 mr-2" />
                Start 7-Day Free Trial
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" size="lg" className="rounded-xl px-10 py-6 text-base" style={{
                borderColor: 'hsl(145 72% 52% / 0.2)',
                color: 'hsl(145 72% 60%)',
                boxShadow: '0 4px 16px -4px hsl(150 30% 3% / 0.4)',
              }}>
                View Services
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Trust line */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs" style={{ color: 'hsl(145 15% 40%)' }}>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" style={{ color: 'hsl(145 72% 52% / 0.7)' }} />7 days free trial</span>
            <span style={{ color: 'hsl(145 15% 25%)' }}>•</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" style={{ color: 'hsl(145 15% 45%)' }} />No credit card required</span>
            <span style={{ color: 'hsl(145 15% 25%)' }}>•</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" style={{ color: 'hsl(145 15% 45%)' }} />All features included</span>
          </div>
        </div>
      </section>

      {/* ── UNIQUE FEATURES BANNER ── */}
      <section className="py-16" style={{ borderTop: '1px solid hsl(145 72% 52% / 0.08)', borderBottom: '1px solid hsl(145 72% 52% / 0.08)' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4" style={{
              border: '1px solid hsl(145 72% 52% / 0.15)',
              background: 'hsl(145 72% 52% / 0.06)',
            }}>
              <Sparkles className="h-3.5 w-3.5" style={{ color: 'hsl(145 72% 52%)' }} />
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'hsl(145 72% 60%)' }}>World's First AI-Organic Panel</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'hsl(140 60% 95%)' }}>
              Features <span style={{ color: 'hsl(145 15% 50%)' }}>No Other Panel Has</span>
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
                <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-3" style={{
                  background: 'hsl(145 72% 52% / 0.08)',
                  border: '1px solid hsl(145 72% 52% / 0.15)',
                  boxShadow: '0 0 16px -4px hsl(145 72% 52% / 0.12)',
                }}>
                  <f.icon className="h-5 w-5" style={{ color: 'hsl(145 72% 52%)' }} />
                </div>
                <h3 className="text-xs font-semibold mb-1" style={{ color: 'hsl(140 60% 95%)' }}>{f.title}</h3>
                <p className="text-[11px]" style={{ color: 'hsl(145 15% 45%)' }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Comparison */}
          <div className="mt-8 glass-card p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2" style={{ color: 'hsl(145 15% 45%)' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm" style={{ background: 'hsl(145 72% 52% / 0.06)' }}>✗</div>
                  <span className="font-semibold text-sm">Regular SMM Panels</span>
                </div>
                <ul className="space-y-2">
                  {['Same quantity every batch = Easy detection', 'Fixed intervals = Bot pattern visible', '24/7 delivery = Unnatural behavior', 'Accounts get flagged & banned'].map(t => (
                    <li key={t} className="flex items-center gap-2 text-sm" style={{ color: 'hsl(145 15% 45%)' }}>
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: 'hsl(145 72% 52% / 0.2)' }} />{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2" style={{ color: 'hsl(140 60% 95%)' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm" style={{ background: 'hsl(145 72% 52% / 0.15)', color: 'hsl(145 72% 52%)' }}>✓</div>
                  <span className="font-semibold text-sm">OrganicSMM</span>
                </div>
                <ul className="space-y-2">
                  {['Random variance = Looks like real users', 'Jittered timing = Undetectable patterns', 'Peak hours + night slow = Human behavior', '100% safe, zero bans reported'].map(t => (
                    <li key={t} className="flex items-center gap-2 text-sm" style={{ color: 'hsl(145 15% 50%)' }}>
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: 'hsl(145 72% 52%)' }} />{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-6 flex flex-wrap items-center justify-center gap-6" style={{ borderTop: '1px solid hsl(145 72% 52% / 0.08)' }}>
              <div className="flex items-center gap-2"><Award className="h-4 w-4" style={{ color: 'hsl(145 72% 52%)' }} /><span className="text-sm font-medium" style={{ color: 'hsl(140 60% 90%)' }}>50,000+ Orders Delivered</span></div>
              <div className="flex items-center gap-2"><Shield className="h-4 w-4" style={{ color: 'hsl(145 72% 52%)' }} /><span className="text-sm font-medium" style={{ color: 'hsl(140 60% 90%)' }}>Zero Account Bans</span></div>
              <div className="flex items-center gap-2"><Target className="h-4 w-4" style={{ color: 'hsl(145 72% 52%)' }} /><span className="text-sm font-medium" style={{ color: 'hsl(140 60% 90%)' }}>99.9% Success Rate</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-6" style={{
              border: '1px solid hsl(145 72% 52% / 0.15)',
              background: 'hsl(145 72% 52% / 0.06)',
              color: 'hsl(145 15% 50%)',
            }}>
              <Sparkles className="h-3 w-3" style={{ color: 'hsl(145 72% 52%)' }} />Choose Your Plan
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'hsl(140 60% 95%)' }}>Simple, Transparent Pricing</h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'hsl(145 15% 50%)' }}>
              Start with a <span className="font-semibold" style={{ color: 'hsl(145 72% 60%)' }}>7-day free trial</span>. Then choose the plan that works for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl mb-6" style={{
                border: '1px solid hsl(145 72% 52% / 0.15)',
                background: 'hsl(145 72% 52% / 0.08)',
              }}>
                <Zap className="h-5 w-5" style={{ color: 'hsl(145 72% 52%)' }} />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'hsl(140 60% 95%)' }}>Monthly Plan</h3>
              <p className="text-sm mb-6" style={{ color: 'hsl(145 15% 50%)' }}>Perfect for getting started</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black" style={{ color: 'hsl(145 72% 52%)' }}>$20</span>
                <span style={{ color: 'hsl(145 15% 45%)' }}>/ month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['7-day free trial included', 'Full platform access', 'All organic features', 'Unlimited orders', 'Cancel anytime'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm" style={{ color: 'hsl(145 15% 50%)' }}>
                    <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: 'hsl(145 72% 52% / 0.5)' }} />{f}
                  </li>
                ))}
              </ul>
              <Link to="/auth" className="block">
                <Button variant="outline" className="w-full rounded-xl py-6 font-semibold" style={{
                  borderColor: 'hsl(145 72% 52% / 0.2)',
                  color: 'hsl(145 72% 60%)',
                }}>
                  Get Started <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="glass-card p-8 relative overflow-hidden" style={{ borderColor: 'hsl(42 90% 55% / 0.2)' }}>
              <div className="absolute top-0 right-0 text-[10px] font-black px-4 py-1.5 rounded-bl-xl tracking-wider" style={{
                background: 'linear-gradient(90deg, hsl(42 90% 55%), hsl(25 90% 55%))',
                color: 'white',
              }}>
                BEST VALUE
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl mb-6" style={{
                background: 'hsl(42 90% 55% / 0.12)',
                border: '1px solid hsl(42 90% 55% / 0.2)',
              }}>
                <Star className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'hsl(140 60% 95%)' }}>Lifetime Plan</h3>
              <p className="text-sm mb-6" style={{ color: 'hsl(145 15% 50%)' }}>One-time payment, forever access</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-amber-500">$199</span>
                <span style={{ color: 'hsl(145 15% 45%)' }}>one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Everything in Monthly', 'Forever access', 'All future updates', 'Priority support', 'No recurring fees'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm" style={{ color: 'hsl(145 15% 50%)' }}>
                    <CheckCircle2 className="h-4 w-4 text-amber-500/70 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link to="/auth" className="block">
                <Button className="w-full rounded-xl py-6 font-bold border-0" style={{
                  background: 'linear-gradient(90deg, hsl(42 90% 55%), hsl(25 90% 55%))',
                  color: 'white',
                  boxShadow: '0 1px 0 0 hsl(42 90% 65% / 0.3) inset, 0 4px 20px -4px hsl(42 90% 55% / 0.35)',
                }}>
                  Get Lifetime Access <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          <p className="text-center text-sm mt-8" style={{ color: 'hsl(145 15% 45%)' }}>
            After signup, submit a subscription request and we'll contact you to activate your plan.
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" className="py-20 scroll-mt-20" style={{ borderTop: '1px solid hsl(145 72% 52% / 0.08)', borderBottom: '1px solid hsl(145 72% 52% / 0.08)' }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto">
            {[
              { value: '10M+', label: 'Orders Delivered', icon: Globe },
              { value: '50K+', label: 'Happy Customers', icon: Users },
              { value: '99.9%', label: 'Uptime', icon: Zap },
              { value: '24/7', label: 'Support', icon: Clock },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4" style={{
                  border: '1px solid hsl(145 72% 52% / 0.15)',
                  background: 'hsl(145 72% 52% / 0.08)',
                }}>
                  <s.icon className="h-4 w-4" style={{ color: 'hsl(145 72% 52%)' }} />
                </div>
                <p className="text-3xl md:text-4xl font-black mb-1" style={{ color: 'hsl(140 60% 95%)' }}>{s.value}</p>
                <p className="text-sm" style={{ color: 'hsl(145 15% 50%)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs mb-6" style={{
              border: '1px solid hsl(145 72% 52% / 0.15)',
              background: 'hsl(145 72% 52% / 0.06)',
              color: 'hsl(145 15% 50%)',
            }}>Why OrganicSMM</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'hsl(140 60% 95%)' }}>
              Engineered for <span style={{ color: 'hsl(145 72% 52%)' }}>Authentic Growth</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'hsl(145 15% 50%)' }}>
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
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{
                  border: '1px solid hsl(145 72% 52% / 0.15)',
                  background: 'hsl(145 72% 52% / 0.08)',
                }}>
                  <f.icon className="h-5 w-5" style={{ color: 'hsl(145 72% 52%)' }} />
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: 'hsl(140 60% 95%)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'hsl(145 15% 50%)' }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 scroll-mt-20" style={{ borderTop: '1px solid hsl(145 72% 52% / 0.08)', borderBottom: '1px solid hsl(145 72% 52% / 0.08)' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs mb-6" style={{
              border: '1px solid hsl(145 72% 52% / 0.15)',
              background: 'hsl(145 72% 52% / 0.06)',
              color: 'hsl(145 15% 50%)',
            }}>The Difference</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'hsl(140 60% 95%)' }}>
              See How <span style={{ color: 'hsl(145 72% 52%)' }}>Organic Mode</span> Works
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'hsl(145 15% 50%)' }}>
              Traditional panels deliver flat, robotic patterns. Our system creates natural variance.
            </p>
          </div>

          <div className="max-w-5xl mx-auto glass-card p-8 md:p-12">
            <p className="text-sm mb-10 text-center" style={{ color: 'hsl(145 15% 50%)' }}>Example: 1000 views over 5 hours (10 runs, 30min intervals)</p>
            <div className="grid md:grid-cols-2 gap-10 mb-10">
              <div>
                <p className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: 'hsl(145 15% 45%)' }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(145 72% 52% / 0.2)' }} />Traditional Delivery (Flat)
                </p>
                <div className="flex items-end gap-1.5 h-28 rounded-xl p-3" style={{ background: 'hsl(150 18% 10% / 0.5)' }}>
                  {[100, 100, 100, 100, 100, 100, 100, 100, 100, 100].map((v, i) => (
                    <div key={i} className="flex-1 rounded-t" style={{ height: `${v / 1.5}%`, background: 'hsl(145 72% 52% / 0.15)' }} />
                  ))}
                </div>
                <p className="text-xs mt-3 text-center" style={{ color: 'hsl(145 15% 45%)' }}>Same amount every time</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: 'hsl(140 60% 90%)' }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(145 72% 52%)', boxShadow: '0 0 8px hsl(145 72% 52% / 0.5)' }} />Organic Growth (Natural)
                </p>
                <div className="flex items-end gap-1.5 h-28 rounded-xl p-3" style={{ background: 'hsl(150 18% 10% / 0.5)' }}>
                  {[85, 112, 145, 78, 160, 92, 134, 88, 106, 100].map((v, i) => (
                    <div key={i} className="flex-1 rounded-t" style={{
                      height: `${v / 1.5}%`,
                      background: 'linear-gradient(180deg, hsl(145 72% 52%), hsl(160 72% 42%))',
                      boxShadow: '0 0 8px -2px hsl(145 72% 52% / 0.4)',
                    }} />
                  ))}
                </div>
                <p className="text-xs mt-3 text-center" style={{ color: 'hsl(145 15% 45%)' }}>Natural variance like real users</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '±25%', label: 'Random Variance', icon: Sparkles },
                { value: '1.5×', label: 'Peak Hour Boost', icon: TrendingUp },
                { value: '100%', label: 'Safe & Natural', icon: Shield },
              ].map((s, i) => (
                <div key={i} className="glass-panel p-4 text-center rounded-xl">
                  <s.icon className="h-4 w-4 mx-auto mb-2" style={{ color: 'hsl(145 72% 52%)' }} />
                  <p className="text-2xl font-black mb-1" style={{ color: 'hsl(140 60% 95%)' }}>{s.value}</p>
                  <p className="text-xs" style={{ color: 'hsl(145 15% 45%)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="glass-card p-12 md:p-20 text-center max-w-4xl mx-auto relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse 60% 40% at 50% 50%, hsl(145 72% 52% / 0.04) 0%, transparent 70%)',
            }} />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'hsl(140 60% 95%)' }}>
                Ready to Grow <span style={{ color: 'hsl(145 72% 52%)' }}>Organically</span>?
              </h2>
              <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'hsl(145 15% 50%)' }}>
                Join thousands of creators and businesses using our organic delivery system. No credit card required to start.
              </p>
              <Link to="/auth">
                <Button size="lg" className="rounded-xl px-12 py-6 text-base font-bold" style={{
                  background: 'linear-gradient(135deg, hsl(145 72% 52%), hsl(160 72% 42%))',
                  color: 'hsl(152 50% 4%)',
                  boxShadow: '0 1px 0 0 hsl(145 80% 62% / 0.4) inset, 0 -2px 0 0 hsl(150 70% 30% / 0.3) inset, 0 6px 30px -6px hsl(145 72% 52% / 0.45)',
                }}>
                  Create Free Account <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16" style={{ borderTop: '1px solid hsl(145 72% 52% / 0.08)' }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden p-0.5" style={{
                  background: 'hsl(150 25% 8%)',
                  border: '1px solid hsl(145 72% 52% / 0.15)',
                }}>
                  <img src={sitelogo} alt="OrganicSMM" className="h-full w-full object-contain" />
                </div>
                <span className="font-bold" style={{ color: 'hsl(140 60% 95%)' }}>OrganicSMM</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'hsl(145 15% 50%)' }}>
                Revolutionary organic social media growth platform with natural delivery patterns.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm" style={{ color: 'hsl(140 60% 90%)' }}>Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/auth" style={{ color: 'hsl(145 15% 50%)' }}>Get Started</Link></li>
                <li><Link to="/services" style={{ color: 'hsl(145 15% 50%)' }}>Services</Link></li>
                <li><a href="#pricing" onClick={scrollTo('pricing')} style={{ color: 'hsl(145 15% 50%)' }}>Pricing</a></li>
                <li><a href="#stats" onClick={scrollTo('stats')} style={{ color: 'hsl(145 15% 50%)' }}>About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm" style={{ color: 'hsl(140 60% 90%)' }}>Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/terms" className="flex items-center gap-2" style={{ color: 'hsl(145 15% 50%)' }}><FileText className="h-3 w-3" />Terms of Service</Link></li>
                <li><Link to="/privacy" className="flex items-center gap-2" style={{ color: 'hsl(145 15% 50%)' }}><Shield className="h-3 w-3" />Privacy Policy</Link></li>
                <li><Link to="/refund" className="flex items-center gap-2" style={{ color: 'hsl(145 15% 50%)' }}><FileText className="h-3 w-3" />Refund Policy</Link></li>
                <li><Link to="/cookies" className="flex items-center gap-2" style={{ color: 'hsl(145 15% 50%)' }}><FileText className="h-3 w-3" />Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm" style={{ color: 'hsl(140 60% 90%)' }}>Support</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="flex items-center gap-2" style={{ color: 'hsl(145 15% 50%)' }}><HelpCircle className="h-3 w-3" />Help Center</a></li>
                <li><a href="#" className="flex items-center gap-2" style={{ color: 'hsl(145 15% 50%)' }}><Mail className="h-3 w-3" />Contact Us</a></li>
                <li><a href="#" className="flex items-center gap-2" style={{ color: 'hsl(145 15% 50%)' }}><Globe className="h-3 w-3" />Status Page</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid hsl(145 72% 52% / 0.08)' }}>
            <p className="text-sm" style={{ color: 'hsl(145 15% 45%)' }}>© {new Date().getFullYear()} OrganicSMM. All rights reserved.</p>
            <div className="flex items-center gap-5 text-xs" style={{ color: 'hsl(145 15% 45%)' }}>
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" />SSL Secured</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" />99.9% Uptime</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
