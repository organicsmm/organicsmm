import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, IndianRupee, ExternalLink, HelpCircle, ArrowLeft, ChevronRight, CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';

// Update with the new approved domain link
const RAZORPAY_PAGE_URL = "https://razorpay.me/@organicsmm";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || ""; // User must add this to .env

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function RazorpayDepositCard() {
    const { user, profile } = useAuth();
    const queryClient = useQueryClient();
    const { rates } = useCurrency();
    const [inrAmount, setInrAmount] = useState('');
    const [usdCredit, setUsdCredit] = useState<number>(0);
    const [paymentId, setPaymentId] = useState('');
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);
    const [showManual, setShowManual] = useState(false);
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Sync user data
    useEffect(() => {
        if (profile?.full_name) setFullName(profile.full_name);
        if (user?.email) setEmail(user.email);
    }, [profile, user]);

    // Conversion logic
    useEffect(() => {
        const val = parseFloat(inrAmount);
        if (!isNaN(val) && val > 0) {
            const inrRate = rates['INR'] || 83.5;
            setUsdCredit(parseFloat((val / inrRate).toFixed(2)));
        } else {
            setUsdCredit(0);
        }
    }, [inrAmount, rates]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleAutoPayment = async () => {
        if (!inrAmount || Number(inrAmount) < 20) {
            toast({ title: 'Invalid amount', description: 'Minimum deposit is ₹20', variant: 'destructive' });
            return;
        }

        if (!RAZORPAY_KEY_ID) {
            toast({ 
                title: 'Configuration Error', 
                description: 'Razorpay Key ID missing. Please use manual method or contact admin.', 
                variant: 'destructive' 
            });
            setShowManual(true);
            return;
        }

        setLoading(true);
        const res = await loadRazorpayScript();

        if (!res) {
            setLoading(false);
            toast({ title: 'System Error', description: 'Failed to load Payment Gateway', variant: 'destructive' });
            return;
        }

        const options = {
            key: RAZORPAY_KEY_ID,
            amount: Number(inrAmount) * 100, // INR in paisa
            currency: "INR",
            name: "OrganicSMMC",
            description: `Deposit for ${email}`,
            image: "https://organicsmm.com/logo.png", // Replace with actual logo
            handler: async function (response: any) {
                const rpPaymentId = response.razorpay_payment_id;
                
                toast({ title: "Verifying...", description: "Please wait while we confirm your payment." });
                
                try {
                    const { data, error } = await supabase.functions.invoke('verify-razorpay-deposit', {
                        body: { paymentId: rpPaymentId, claimedUsdAmount: usdCredit }
                    });

                    if (error || !data.success) throw new Error(data?.error || "Verification failed");

                    toast({ 
                        title: "Success!", 
                        description: `$${usdCredit.toFixed(2)} added to your wallet automatically.`,
                    });
                    
                    setInrAmount('');
                    queryClient.invalidateQueries({ queryKey: ['wallet'] });
                    queryClient.invalidateQueries({ queryKey: ['transactions'] });
                } catch (err: any) {
                    toast({ 
                        title: "Late Verification", 
                        description: "Payment successful but auto-credit failed. Please submit proof manually.",
                        variant: "destructive"
                    });
                    setPaymentId(rpPaymentId);
                    setShowManual(true);
                } finally {
                    setLoading(false);
                }
            },
            prefill: {
                name: fullName,
                email: email,
            },
            theme: {
                color: "#2334AE"
            },
            modal: {
                ondismiss: function() {
                    setLoading(false);
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setScreenshot(e.target.files[0]);
        }
    };

    const handleManualClaim = async () => {
        if (!inrAmount || Number(inrAmount) < 20) {
            toast({ title: 'Invalid amount', description: 'Minimum deposit is ₹20', variant: 'destructive' });
            return;
        }
        if (!paymentId) {
            toast({ title: 'Missing ID', description: 'Please enter Payment ID or Ref No.', variant: 'destructive' });
            return;
        }

        setLoading(true);
        try {
            let screenshotUrl: string | null = null;
            if (screenshot) {
                const ext = screenshot.name.split('.').pop() || 'jpg';
                const path = `${user?.id}/${Date.now()}.${ext}`;
                const { error: uploadErr } = await supabase.storage
                    .from('payment-proofs')
                    .upload(path, screenshot, { upsert: true });
                if (!uploadErr) {
                    const { data: urlData } = supabase.storage.from('payment-proofs').getPublicUrl(path);
                    screenshotUrl = urlData.publicUrl;
                }
            }

            const descriptionObj = {
                text: `Paid: ₹${inrAmount} | Name: ${fullName} | Email: ${email} | Amount: $${usdCredit}`,
                screenshot_url: screenshotUrl,
            };

            const { error } = await supabase.from('transactions').insert({
                user_id: user?.id,
                type: 'deposit',
                amount: usdCredit,
                balance_after: 0,
                status: 'pending',
                payment_method: 'razorpay_manual',
                payment_reference: paymentId,
                description: JSON.stringify(descriptionObj),
            });

            if (error) throw error;

            // Send Telegram Notification
            const appUrl = window.location.origin;
            supabase.functions.invoke('send-telegram-notification', {
                body: {
                    message: `<b>🚨 NEW MANUAL DEPOSIT</b>\n\n` +
                        `👤 <b>Name:</b> ${fullName || 'N/A'}\n` +
                        `📧 <b>Email:</b> ${email || 'N/A'}\n` +
                        `💰 <b>Paid:</b> ₹${inrAmount}\n` +
                        `💵 <b>Credit:</b> $${usdCredit}\n` +
                        `🆔 <b>Ref:</b> <code>${paymentId}</code>\n\n` +
                        `<a href="${appUrl}/admin/deposits">Open Admin Panel</a>`,
                    ...(screenshotUrl ? { photo_url: screenshotUrl } : {}),
                },
            }).catch(console.error);

            setIsSubmitted(true);
            toast({ title: 'Proof Received!', description: 'Review will complete within 10 minutes.' });
        } catch (err: any) {
            toast({ title: 'Failed', description: err.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative group/card perspective-1000">
            <div className="absolute -inset-1 bg-primary/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover/card:opacity-100 transition duration-1000"></div>

            <div className="three-d-card overflow-hidden mt-6 relative border border-white/10">
                <div className="p-8 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#2334AE]/20 flex items-center justify-center border border-[#2334AE]/30 shadow-inner">
                                <IndianRupee className="h-6 w-6 text-[#2334AE]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tighter text-white">UPi / Razorpay</h2>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60 text-blue-400">Auto-Approved Gateway</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20 py-2 px-4 rounded-xl font-black uppercase tracking-[0.2em] shadow-sm">
                            <ShieldCheck className="h-3.5 w-3.5 mr-2" />
                            Instant Crediting
                        </Badge>
                    </div>
                </div>

                {!showManual ? (
                    <div className="p-8 pt-4 space-y-6">
                        <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 space-y-4">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0">
                                    <Zap className="h-6 w-6 text-blue-400" />
                                </div>
                                <div className="text-xs text-blue-200/70 leading-relaxed font-extrabold uppercase tracking-tight">
                                    Top up your wallet instantly. No manual review required for API payments!
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Enter Deposit Amount (INR)</label>
                                <div className="relative group">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-400 font-black text-2xl">₹</span>
                                    <Input
                                        type="number"
                                        value={inrAmount}
                                        onChange={(e) => setInrAmount(e.target.value)}
                                        className="pl-12 input-3d h-20 font-black text-2xl text-white bg-white/5 border-white/10 rounded-[1.5rem]"
                                        placeholder="Min: 20"
                                    />
                                    {usdCredit > 0 && (
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-emerald-400 bg-emerald-500/10 px-4 py-1 rounded-full text-sm">
                                            ≈ ${usdCredit}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Button
                                onClick={handleAutoPayment}
                                disabled={loading || !inrAmount || Number(inrAmount) < 20}
                                className="h-20 rounded-3xl gap-4 text-xl font-black bg-white text-black hover:bg-white/90 btn-3d"
                            >
                                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Zap className="h-6 w-6 fill-black" />}
                                PAY NOW
                            </Button>

                            <Button
                                onClick={() => setShowManual(true)}
                                variant="outline"
                                className="h-20 rounded-3xl gap-4 text-sm font-black border-white/10 hover:bg-white/5 flex flex-col items-center justify-center py-0"
                            >
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 opacity-40" />
                                    MANUAL PROOF
                                </div>
                                <span className="text-[10px] opacity-40 font-bold uppercase tracking-widest">QR / Old Method</span>
                            </Button>
                        </div>

                        <p className="text-[10px] text-center text-muted-foreground font-medium uppercase tracking-[0.2em] opacity-40">
                            Auto Pay: UPI • Cards • NetBanking • Wallets
                        </p>
                    </div>
                ) : isSubmitted ? (
                    <div className="p-12 text-center">
                        <div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                            <CheckCircle2 className="h-12 w-12 text-green-400" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">SUCCESS!</h3>
                        <p className="text-blue-400 font-black uppercase tracking-[0.2em] text-xs mb-6">Request Submitted</p>
                        <Button onClick={() => { setIsSubmitted(false); setShowManual(false); }} className="bg-white text-black font-black px-10 h-14 rounded-2xl">DONE</Button>
                    </div>
                ) : (
                    <div className="p-8 pt-4 space-y-4">
                        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 mb-4">
                            <p className="text-[11px] font-black text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <HelpCircle className="h-4 w-4" /> Manual Method
                            </p>
                            <p className="text-[10px] text-muted-foreground leading-relaxed uppercase font-bold">
                                Use the link below to pay, then return here to paste the Payment ID and upload your screenshot.
                            </p>
                        </div>

                        <Button
                            onClick={() => window.open(RAZORPAY_PAGE_URL, '_blank')}
                            className="w-full h-16 rounded-2xl gap-3 text-lg font-black bg-[#2334AE] hover:bg-[#2334AE]/90"
                        >
                            <ExternalLink className="h-5 w-5" />
                            OPEN PAYMENT PORTAL
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Payment ID (pay_...)</label>
                                <Input
                                    placeholder="Enter Razorpay ID"
                                    value={paymentId}
                                    onChange={(e) => setPaymentId(e.target.value)}
                                    className="input-3d h-14 font-black text-white px-6"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount Paid (₹)</label>
                                <Input
                                    type="number"
                                    value={inrAmount}
                                    onChange={(e) => setInrAmount(e.target.value)}
                                    className="input-3d h-14 font-black text-white px-6"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Screenshot Proof</label>
                            <div className="relative h-14 rounded-xl border border-dashed border-white/20 bg-white/[0.02] flex items-center px-6 cursor-pointer group">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <div className="text-xs font-black text-muted-foreground group-hover:text-white truncate">
                                    {screenshot ? screenshot.name : "Choose File..."}
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleManualClaim}
                            disabled={loading || !paymentId || !inrAmount}
                            className="w-full h-16 rounded-2xl bg-white text-black font-black mt-4"
                        >
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "SUBMIT FOR REVIEW"}
                        </Button>

                        <button
                            onClick={() => setShowManual(false)}
                            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-white transition-colors block mx-auto font-black flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" /> USE AUTO PAY
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
