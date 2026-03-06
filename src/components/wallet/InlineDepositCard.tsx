import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Copy, CheckCircle2, AlertTriangle, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

const DEPOSIT_WALLET = '0xA07b34C582F31e70110C59faD70C0395a5BD339f';

export default function InlineDepositCard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(DEPOSIT_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (!amount || Number(amount) < 1) {
      toast({ title: 'Invalid amount', description: 'Minimum deposit is $1', variant: 'destructive' });
      return;
    }
    if (!txHash || !/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      toast({ title: 'Invalid TX hash', description: 'Enter a valid BSC transaction hash (0x + 64 hex chars)', variant: 'destructive' });
      return;
    }

    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-usdt-deposit', {
        body: { txHash, claimedAmount: Number(amount) },
      });

      // Extract actual error: check response body first, then fallback
      let actualError: string | null = data?.error || null;
      if (!actualError && error) {
        // Try to parse the actual body from the error context
        try {
          const body = await (error as any).context?.json?.();
          actualError = body?.error || null;
        } catch { }
        actualError = actualError || error.message;
      }
      if (actualError) throw new Error(actualError);

      toast({
        title: '✅ Deposit Verified!',
        description: `$${Number(data.amount).toFixed(2)} USDT added to your wallet.`,
      });

      setAmount('');
      setTxHash('');
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    } catch (err: any) {
      const msg = err.message || 'Could not verify transaction';
      // Map technical errors to friendly messages
      const friendly = msg.includes('Invalid transaction hash')
        ? '❌ Invalid TX hash. Must start with 0x followed by 64 characters.'
        : msg.includes('Amount must be at least')
          ? '❌ Minimum deposit is $1.'
          : msg.includes('already processed')
            ? '⚠️ This transaction has already been credited.'
            : msg.includes('not found on BSC')
              ? '⏳ Transaction not found yet. Wait 1-2 minutes for confirmation and try again.'
              : msg.includes('failed on chain')
                ? '❌ This transaction failed on BSC chain. Only successful txns can be credited.'
                : msg.includes('Amount mismatch')
                  ? `❌ ${msg}`
                  : msg.includes('No USDT BEP20 transfer')
                    ? '❌ No USDT transfer to our wallet found. Make sure you sent USDT (BEP20) to the correct address.'
                    : `❌ ${msg}`;

      toast({
        title: 'Verification Failed',
        description: friendly,
        variant: 'destructive',
      });
    } finally {
      setVerifying(false);
    }
  };

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(DEPOSIT_WALLET)}&bgcolor=ffffff&color=000000&margin=10`;

  return (
    <div className="glass-premium overflow-hidden">
      {/* Premium Header */}
      <div className="p-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Deposit Vault</h2>
              <p className="text-xs text-muted-foreground">Automated BSC Verification</p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] bg-amber-500/5 text-amber-500 border-amber-500/20 py-1.5 px-3 rounded-lg font-bold uppercase tracking-widest h-fit">
            <AlertTriangle className="h-3 w-3 mr-1.5" />
            USDT BEP20 ONLY
          </Badge>
        </div>
      </div>

      <div className="p-8 pt-4 space-y-6">
        {/* Wallet address + QR */}
        <div className="flex flex-col md:flex-row gap-8 p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.05]">
          {/* QR Code */}
          <div className="flex-shrink-0 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <img
              src={qrSrc}
              alt="QR"
              className="w-32 h-32 rounded-2xl relative z-10 border border-white/10 p-2 bg-white"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Recipient Address</p>
              <div className="flex items-center gap-2">
                <code className="text-sm text-foreground break-all flex-1 font-mono font-bold">{DEPOSIT_WALLET}</code>
                <button onClick={copyAddress} className="p-2 hover:bg-primary/10 rounded-xl transition-colors flex-shrink-0 border border-transparent hover:border-primary/20">
                  {copied ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Copy className="h-5 w-5 text-muted-foreground" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10">Network: <span className="text-primary">BEP20</span></span>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10">Currency: <span className="text-primary">USDT</span></span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Arrival Amount</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">$</span>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 bg-white/[0.02] border-white/10 focus:border-primary/40 rounded-xl h-14 font-bold text-lg"
                min="1"
                step="0.01"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">TX Hash Signature</label>
            <Input
              placeholder="0x..."
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              className="font-mono text-xs bg-white/[0.02] border-white/10 focus:border-primary/40 rounded-xl h-14"
            />
          </div>
        </div>

        <Button
          onClick={handleVerify}
          disabled={verifying || !amount || !txHash}
          className="w-full h-16 rounded-2xl gap-3 text-lg font-black bg-primary text-background shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 disabled:grayscale"
        >
          {verifying ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              Scanning Chain...
            </>
          ) : (
            <>
              <ShieldCheck className="h-6 w-6" />
              Inject Funds to Vault
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
