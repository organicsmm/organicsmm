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
    <Card className="overflow-hidden border-border/50">
      {/* Gradient header */}
      <CardHeader className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Pay & Verify</h2>
          </div>
          <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Only USDT on BNB Smart Chain (BEP20)
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        {/* Wallet address + QR */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* QR Code */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <img
              src={qrSrc}
              alt="USDT BEP20 QR Code"
              className="w-28 h-28 rounded-xl border border-border/50"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>

          {/* Address */}
          <div className="flex-1 space-y-2">
            <p className="text-sm text-muted-foreground font-medium">Send USDT (BEP20) to:</p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
              <code className="text-xs text-foreground break-all flex-1 font-mono">{DEPOSIT_WALLET}</code>
              <button onClick={copyAddress} className="p-1.5 hover:bg-secondary rounded-lg transition-colors flex-shrink-0">
                {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Network: <span className="text-foreground font-medium">BNB Smart Chain (BEP20)</span>
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                placeholder="Min $1.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
                min="1"
                step="0.01"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Transaction Hash</label>
            <Input
              placeholder="0x..."
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              className="font-mono text-xs"
            />
          </div>
        </div>

        <Button
          onClick={handleVerify}
          disabled={verifying || !amount || !txHash}
          variant="gradient"
          className="w-full gap-2"
          size="lg"
        >
          {verifying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying on BSC...
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              Verify & Add Funds
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
