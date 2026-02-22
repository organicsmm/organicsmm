import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Mail, Lock, User, Loader2, ArrowLeft, Shield, Zap,
  Activity, Shuffle, Clock, Moon, Timer, BarChart3,
  Eye, EyeOff, KeyRound, Fingerprint, Globe, CheckCircle2, Star
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import logo from '@/assets/logo.png';


const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters'),
});


// Logo component using actual OrganicSMM brand asset
function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <img
      src={logo}
      alt="OrganicSMM"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: 'contain', borderRadius: 10 }}
    />
  );
}


const features = [
  { icon: Activity, title: 'S-Curve Delivery', desc: 'Mimics natural viral growth patterns', badge: 'EXCLUSIVE' },
  { icon: Shuffle, title: '±50% Random Variance', desc: 'Unpredictable quantities like real users', badge: 'UNIQUE' },
  { icon: Clock, title: 'Peak Hour Boost', desc: '1.5× during 6PM–10PM IST automatically', badge: 'SMART' },
  { icon: Moon, title: 'Night Mode Slowdown', desc: 'Reduces at 2AM–6AM like real behavior', badge: 'NATURAL' },
  { icon: Timer, title: '±5 Min Random Jitter', desc: 'Execution times vary — bot-proof', badge: 'STEALTH' },
  { icon: BarChart3, title: 'Live Preview Timeline', desc: 'See delivery schedule before ordering', badge: 'PREMIUM' },
];

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn, signUp, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/engagement-order');
    }
  }, [user, isLoading, navigate]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccessMessage(''); setIsSubmitting(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail || !z.string().email().safeParse(trimmedEmail).success) {
        setError('Please enter a valid email address');
        setIsSubmitting(false); return;
      }
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) setError(error.message || 'Failed to send reset email.');
      else setSuccessMessage('Password reset email sent! Check your inbox.');
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setIsSubmitting(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccessMessage(''); setIsSubmitting(true);
    try {
      if (isLogin) {
        const v = loginSchema.safeParse({ email, password });
        if (!v.success) { setError(v.error.errors[0].message); setIsSubmitting(false); return; }
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message?.toLowerCase().includes('invalid login credentials')) setError('Invalid email or password.');
          else if (error.message?.toLowerCase().includes('email not confirmed')) setError('Email not verified. Check your inbox.');
          else setError(error.message || 'Login failed.');
          setIsSubmitting(false); return;
        }
        navigate('/engagement-order', { replace: true });
      } else {
        const v = signupSchema.safeParse({ email, password, fullName });
        if (!v.success) { setError(v.error.errors[0].message); setIsSubmitting(false); return; }
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message?.toLowerCase().includes('already registered')) setError('Email already registered.');
          else setError(error.message || 'Signup failed.');
          setIsSubmitting(false); return;
        }
        navigate('/engagement-order', { replace: true });
      }
    } catch (err: any) {
      if (!err?.message?.includes('abort')) setError('Something went wrong.');
    } finally { setIsSubmitting(false); }
  };

  const reset = () => { setError(''); setSuccessMessage(''); };

  return (
    <div className="min-h-screen bg-[hsl(0,0%,2%)] flex">

      {/* ───── LEFT PANEL — Brand ───── */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-12 xl:p-16 border-r border-white/[0.06] relative overflow-hidden">

        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <LogoMark size={44} />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">OrganicSMM</h1>
              <p className="text-[11px] text-white/30 font-medium tracking-[0.15em] uppercase">World's First AI-Organic Panel</p>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-10">
            <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-3">
              Features No Other<br />
              <span className="text-white/35">SMM Panel Has</span>
            </h2>
            <p className="text-sm text-white/40 leading-relaxed max-w-sm">
              The only panel with AI-organic delivery — human-like patterns, IST peak hours, and zero detection risk.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-2">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                  <f.icon className="h-4 w-4 text-white/60" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-semibold text-white/90">{f.title}</span>
                    <span className="text-[9px] font-bold text-white/30 tracking-widest">{f.badge}</span>
                  </div>
                  <p className="text-[11px] text-white/30 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 flex items-center justify-between px-5 py-4 rounded-xl border border-white/[0.06] bg-white/[0.015] mt-8">
          {[
            { value: '50K+', label: 'Orders' },
            { value: '0', label: 'Bans' },
            { value: '99.9%', label: 'Uptime' },
            { value: '24/7', label: 'Support' },
          ].map((s, i, arr) => (
            <div key={i} className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xl font-black text-white">{s.value}</div>
                <div className="text-[10px] text-white/25 uppercase tracking-widest mt-0.5">{s.label}</div>
              </div>
              {i < arr.length - 1 && <div className="w-px h-7 bg-white/[0.06]" />}
            </div>
          ))}
        </div>
      </div>

      {/* ───── RIGHT PANEL — Form ───── */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-[420px]">

          {/* Back to home */}
          <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 mb-8 text-sm font-medium">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <LogoMark size={36} />
            <span className="text-lg font-bold text-white">OrganicSMM</span>
          </div>

          {/* Form card */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-7 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">

            {/* Top accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-full" />

            {/* Header */}
            <div className="mb-7">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] mx-auto mb-5">
                {isForgotPassword
                  ? <KeyRound className="h-5 w-5 text-white/60" />
                  : isLogin
                    ? <Fingerprint className="h-5 w-5 text-white/60" />
                    : <Star className="h-5 w-5 text-white/60" />
                }
              </div>
              <h2 className="text-2xl font-black text-white text-center tracking-tight">
                {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Start Free Trial'}
              </h2>
              <p className="text-sm text-white/35 text-center mt-1">
                {isForgotPassword
                  ? 'Enter your email for a reset link'
                  : isLogin
                    ? 'Sign in to your account'
                    : 'Get 7 days free — all features unlocked'}
              </p>
              {!isLogin && !isForgotPassword && (
                <div className="mt-3 flex items-center justify-center gap-2 py-1.5 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit mx-auto">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[11px] font-bold text-emerald-400 tracking-wide">7 DAYS FREE · NO CARD NEEDED</span>
                </div>
              )}
            </div>

            {/* ──── Forgot Password Form ──── */}
            {isForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="h-3 w-3" /> Email
                  </Label>
                  <Input id="email" type="email" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="h-11 bg-white/[0.04] border-white/[0.08] focus:border-white/25 rounded-xl text-sm text-white placeholder:text-white/20" />
                </div>

                {error && <ErrorBox msg={error} />}
                {successMessage && <SuccessBox msg={successMessage} />}

                <Button type="submit" disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-white text-black hover:bg-white/90 font-bold text-sm">
                  {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</> : <><Mail className="h-4 w-4 mr-2" />Send Reset Link</>}
                </Button>

                <div className="text-center">
                  <button type="button" onClick={() => { setIsForgotPassword(false); reset(); }}
                    className="text-xs text-white/30 hover:text-white/60 font-medium">
                    ← Back to Sign In
                  </button>
                </div>
              </form>

            ) : (
              /* ──── Main Login / Signup Form ──── */
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="h-3 w-3" /> Full Name
                    </Label>
                    <Input id="fullName" type="text" placeholder="Your name"
                      value={fullName} onChange={e => setFullName(e.target.value)} autoComplete="name"
                      className="h-11 bg-white/[0.04] border-white/[0.08] focus:border-white/25 rounded-xl text-sm text-white placeholder:text-white/20" />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="h-3 w-3" /> Email
                  </Label>
                  <Input id="email" type="email" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"
                    className="h-11 bg-white/[0.04] border-white/[0.08] focus:border-white/25 rounded-xl text-sm text-white placeholder:text-white/20" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="h-3 w-3" /> Password
                    </Label>
                    {isLogin && (
                      <button type="button" onClick={() => { setIsForgotPassword(true); reset(); }}
                        className="text-[10px] text-white/30 hover:text-white/60 font-medium uppercase tracking-wider">
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                      value={password} onChange={e => setPassword(e.target.value)}
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                      className="h-11 bg-white/[0.04] border-white/[0.08] focus:border-white/25 rounded-xl text-sm text-white placeholder:text-white/20 pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && <ErrorBox msg={error} />}

                <Button type="submit" disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-white text-black hover:bg-white/90 font-bold text-sm disabled:opacity-50">
                  {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Please wait...</> : isLogin ? 'Sign In' : 'Create Account'}
                </Button>

                <div className="pt-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-white/[0.06]" />
                    <span className="text-[10px] text-white/20 uppercase tracking-widest">or</span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                  </div>
                  <div className="text-center">
                    <button type="button" onClick={() => { setIsLogin(!isLogin); reset(); }}
                      className="text-sm text-white/35 hover:text-white/60 font-medium">
                      {isLogin ? "Don't have an account? " : 'Already have an account? '}
                      <span className="text-white/80 font-bold">{isLogin ? 'Sign up free' : 'Sign in'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex items-center justify-center gap-5 text-[10px] text-white/20 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Shield className="h-3 w-3 text-white/30" />Secured</span>
            <span className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-white/30" />Instant</span>
            <span className="flex items-center gap-1.5"><Globe className="h-3 w-3 text-white/30" />Global</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400/80 text-xs font-medium flex items-start gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1 shrink-0" />
      {msg}
    </div>
  );
}

function SuccessBox({ msg }: { msg: string }) {
  return (
    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400/80 text-xs font-medium flex items-start gap-2">
      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
      {msg}
    </div>
  );
}
