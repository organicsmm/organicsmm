import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useWallet } from '@/hooks/useWallet';
import { useTransactions, type TransactionFilter } from '@/hooks/useTransactions';
import { useCurrency } from '@/hooks/useCurrency';
import InlineDepositCard from '@/components/wallet/InlineDepositCard';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export default function Wallet() {
  const { wallet } = useWallet();
  const { formatPrice } = useCurrency();
  const [filter, setFilter] = useState<TransactionFilter>('all');
  const { data: transactions } = useTransactions(filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="h-5 w-5 text-success" />;
      case 'order': return <ArrowUpRight className="h-5 w-5 text-destructive" />;
      case 'refund': return <RefreshCw className="h-5 w-5 text-primary" />;
      default: return <WalletIcon className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'deposit': return 'bg-success/10';
      case 'order': return 'bg-destructive/10';
      case 'refund': return 'bg-primary/10';
      default: return 'bg-muted';
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'text-success';
      case 'order': return 'text-destructive';
      case 'refund': return 'text-primary';
      default: return 'text-foreground';
    }
  };

  const fmtDate = (d: string) =>
    new Date(d).toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Wallet</h1>
          <p className="text-muted-foreground">Manage your balance and transactions.</p>
        </div>

        {/* Balance Card */}
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
            <p className="text-5xl font-bold gradient-text">{formatPrice(wallet?.balance || 0)}</p>
            <div className="grid grid-cols-2 gap-6 pt-6 mt-6 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground">Total Deposited</p>
                <p className="text-xl font-semibold text-success">{formatPrice(wallet?.total_deposited || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-xl font-semibold text-destructive">{formatPrice(wallet?.total_spent || 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Card */}
        <InlineDepositCard />

        {/* Transaction History */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as TransactionFilter)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="deposit">Deposits</TabsTrigger>
                <TabsTrigger value="order">Orders</TabsTrigger>
                <TabsTrigger value="refund">Refunds</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/30"
                >
                  {/* Left: icon + info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${getIconBg(tx.type)}`}>
                      {getIcon(tx.type)}
                    </div>
                    <div className="min-w-0">
                      {/* Description */}
                      <p className="font-medium text-sm leading-tight truncate max-w-[260px]">
                        {tx.description || tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </p>
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1">
                        {/* Payment method badge */}
                        {tx.payment_method && (
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">
                            {tx.payment_method.replace(/_/g, ' ').toUpperCase()}
                          </Badge>
                        )}
                        {/* Date */}
                        <span className="text-xs text-muted-foreground">{fmtDate(tx.created_at!)}</span>
                        {/* BSCScan link for crypto deposits */}
                        {tx.payment_reference && tx.payment_method === 'usdt_bep20' && (
                          <a
                            href={`https://bscscan.com/tx/${tx.payment_reference}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-0.5"
                          >
                            BSCScan <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: amount + balance after */}
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className={`font-bold text-base ${getAmountColor(tx.type)}`}>
                      {tx.type === 'order' ? '−' : '+'}${Math.abs(Number(tx.amount)).toFixed(2)}
                    </p>
                    {tx.balance_after != null && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Bal: ${Number(tx.balance_after).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <WalletIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">No transactions yet</p>
              <p className="text-sm text-muted-foreground mt-1">Your deposits and spending history will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
