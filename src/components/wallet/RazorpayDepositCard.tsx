import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, IndianRupee, ExternalLink, HelpCircle, ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';

const RAZORPAY_PAGE_URL = "https://razorpay.me/@trivedihussainmustufabhai";

export default function RazorpayDepositCard() {
    const { user, profile } = useAuth();
    const queryClient = useQueryClient();
    const { rates } = useCurrency();
    const [inrAmount, setInrAmount] = useState(''); // No default value
    const [usdCredit, setUsdCredit] = useState<number>(0);
    const [paymentId, setPaymentId] = useState('');
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);
    const [showManual, setShowManual] = useState(false);
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Sync user data when it's available
    useEffect(() => {
        if (profile?.full_name) setFullName(profile.full_name);
        if (user?.email) setEmail(user.email);
    }, [profile, user]);

    // Conversion logic (INR to USD)
    useEffect(() => {
        const val = parseFloat(inrAmount);
        if (!isNaN(val) && val > 0) {
            const inrRate = rates['INR'] || 83.5;
            setUsdCredit(parseFloat((val / inrRate).toFixed(2)));
        } else {
            setUsdCredit(0);
        }
    }, [inrAmount, rates]);

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

        if (!user?.id) {
            toast({ title: 'Auth Error', description: 'Please login again to continue.', variant: 'destructive' });
            return;
        }

        setLoading(true);
        try {
            // Upload screenshot to Supabase Storage if provided
            let screenshotUrl: string | null = null;
            if (screenshot) {
                const ext = screenshot.name.split('.').pop() || 'jpg';
                const path = `${user.id}/${Date.now()}.${ext}`;
                const { error: uploadErr } = await supabase.storage
                    .from('payment-proofs')
                    .upload(path, screenshot, { upsert: true });
                if (!uploadErr) {
                    const { data: urlData } = supabase.storage.from('payment-proofs').getPublicUrl(path);
                    screenshotUrl = urlData.publicUrl;
                }
            }

            // Build description with screenshot_url embedded
            const descriptionObj = {
                text: `Paid: ₹${inrAmount} | Name: ${fullName} | Email: ${email} | Amount: $${usdCredit}`,
                screenshot_url: screenshotUrl,
            };

            // Create a pending transaction record
            const { error } = await supabase.from('transactions').insert({
                user_id: user.id,
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
                    message: `<b>🚨 NEW DEPOSIT REQUEST</b>\n\n` +
                        `👤 <b>Name:</b> ${fullName || 'N/A'}\n` +
                        `📧 <b>Email:</b> ${email || 'N/A'}\n` +
                        `💰 <b>Paid:</b> ₹${inrAmount}\n` +
                        `💵 <b>Credit:</b> $${usdCredit}\n` +
                        `🆔 <b>Ref:</b> <code>${paymentId}</code>\n\n` +
                        `<a href="${appUrl}/admin/deposits">Open Admin Panel</a>`,
                    // Send screenshot URL to Telegram if available
                    ...(screenshotUrl ? { photo_url: screenshotUrl } : {}),
                },
            }).catch(console.error);

            setIsSubmitted(true);
            toast({
                title: '🎉 Payment Proof Received!',
                description: `Welcome to OrganicSMM! Our team is reviewing your proof now within 10 minutes.`,
            });

            setInrAmount('');
            setPaymentId('');
            setScreenshot(null);
            setShowManual(false);
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        } catch (err: any) {
            toast({
                title: 'Submission Failed',
                description: err.message || 'Could not submit request',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenLink = () => {
        window.open(RAZORPAY_PAGE_URL, '_blank', 'noopener,noreferrer');
        setShowManual(true);
        toast({
            title: 'UPI Portal Opened',
            description: 'Complete your payment in INR and return to submit proof.',
        });
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
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60 text-blue-400">Direct INR Gateway</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-blue-500/20 py-2 px-4 rounded-xl font-black uppercase tracking-[0.2em] shadow-sm">
                            <Zap className="h-3.5 w-3.5 mr-2" />
                            Instant Alert
                        </Badge>
                    </div>
                </div>

                {!showManual ? (
                    <div className="p-8 pt-4 space-y-6">
                        <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0">
                                <Zap className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="text-xs text-blue-200/70 leading-relaxed font-bold uppercase tracking-tight">
                                Open our official UPI/Razorpay portal below. Pay any amount in <b>INR (₹)</b> and upload the proof here.
                            </div>
                        </div>

                        <Button
                            onClick={handleOpenLink}
                            className="w-full h-20 rounded-3xl gap-4 text-xl font-black btn-3d hover:scale-[1.03] duration-300"
                        >
                            <ExternalLink className="h-7 w-7" />
                            Pay via UPI / QR
                            <div className="ml-auto w-10 h-10 rounded-full bg-black/20 flex items-center justify-center border border-white/10 shadow-inner">
                                <ChevronRight className="h-5 w-5" />
                            </div>
                        </Button>

                        <p className="text-[10px] text-center text-muted-foreground font-medium uppercase tracking-[0.2em] opacity-40">
                            GPay • PhonePe • Paytm • WhatsApp • Cards
                        </p>
                    </div>
                ) : isSubmitted ? (
                    <div className="p-12 text-center">
                        <div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                            <CheckCircle2 className="h-12 w-12 text-green-400" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">THANK YOU!</h3>
                        <p className="text-blue-400 font-black uppercase tracking-[0.2em] text-xs mb-6">Payment Proof Submitted</p>

                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 backdrop-blur-xl text-center">
                            <p className="text-white/90 text-sm font-bold leading-relaxed italic">
                                "Our admin is reviewing your payment proof. Your funds will be added to your wallet within <span className="text-blue-400">10 minutes</span>. Welcome to OrganicSMM!"
                            </p>
                        </div>

                        <Button
                            onClick={() => {
                                setIsSubmitted(false);
                                setShowManual(false);
                            }}
                            className="bg-white text-black font-black px-10 h-14 rounded-2xl hover:bg-white/90 transition-all border-none shadow-xl"
                        >
                            DONE
                        </Button>
                    </div>
                ) : (
                    <div className="p-8 pt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Paid Amount (INR)</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00D4FF] font-black text-xl">₹</span>
                                    <Input
                                        type="number"
                                        value={inrAmount}
                                        onChange={(e) => setInrAmount(e.target.value)}
                                        className="pl-8 input-3d h-16 font-black text-xl text-white"
                                        placeholder="Enter Amount"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Payment ID / Ref No</label>
                                <Input
                                    placeholder="pay_... or Ref No."
                                    value={paymentId}
                                    onChange={(e) => setPaymentId(e.target.value)}
                                    className="input-3d h-16 font-black text-white px-6"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                <Input
                                    value={fullName}
                                    readOnly
                                    className="bg-white/5 border-white/10 rounded-xl h-14 font-extrabold text-white/40 cursor-not-allowed border-dashed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email for Receipt</label>
                                <Input
                                    value={email}
                                    readOnly
                                    className="bg-white/5 border-white/10 rounded-xl h-14 font-extrabold text-white/40 cursor-not-allowed border-dashed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Upload Receipt Screenshot</label>
                            <div className="relative h-16 rounded-xl border border-dashed border-white/20 bg-white/[0.02] flex items-center px-6 hover:bg-white/[0.05] transition-colors cursor-pointer group">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <div className="flex items-center gap-3 text-sm font-black text-muted-foreground group-hover:text-white transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                                        <ExternalLink className="h-5 w-5" />
                                    </div>
                                    {screenshot ? <span className="text-blue-400">{screenshot.name}</span> : "Choose Screenshot File..."}
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleManualClaim}
                            disabled={loading || !paymentId || !inrAmount}
                            className="w-full h-20 rounded-[1.5rem] bg-white text-black font-black shadow-2xl hover:bg-white/90 transition-all text-xl mt-4"
                        >
                            {loading ? <Loader2 className="h-7 w-7 animate-spin mr-3" /> : <CheckCircle2 className="h-7 w-7 mr-3 text-[#2334AE]" />}
                            {loading ? "PROCESSING..." : "SUBMIT PROOF"}
                        </Button>

                        <button
                            onClick={() => setShowManual(false)}
                            className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-white transition-colors block mx-auto font-black flex items-center gap-2 pt-4"
                        >
                            <ArrowLeft className="h-4 w-4" /> Cancel Payment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
