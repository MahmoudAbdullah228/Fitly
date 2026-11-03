import React, { useState } from 'react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import CheckoutModal from '../components/credits/CheckoutModal.jsx';
import { useAppState } from '../hooks/useAppState.js';
import plansData from '../data/plans.json' with { type: 'json' };
import { 
  Sparkles, 
  CreditCard, 
  History, 
  Check, 
  ArrowUpRight, 
  Zap, 
  Calendar,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

export default function CreditsPage() {
  const { credits, usageHistory, currentPlan } = useAppState();

  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [selectedCheckoutItem, setSelectedCheckoutItem] = useState(null);

  const handleBuyPack = (pack) => {
    setSelectedCheckoutItem({
      type: 'pack',
      title: pack.name,
      credits: pack.credits,
      priceEgp: pack.priceEgp,
    });
  };

  const handleSubscribePlan = (plan) => {
    setSelectedCheckoutItem({
      type: 'plan',
      title: plan.name,
      credits: plan.monthlyCredits,
      priceEgp: billingCycle === 'yearly' ? plan.yearlyPriceEgp : plan.monthlyPriceEgp,
      billingCycle,
      plan,
    });
  };

  return (
    <div className="w-full bg-canvas py-8 md:py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              Credits & Billing Plans
            </h1>
            <p className="text-sm text-body">
              1 Application = 1 Tailored ATS CV + 1 Targeted Cover Letter (2 Credits Total)
            </p>
          </div>

          {/* Current Balance Chip */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-canvas-soft border border-hairline-strong shrink-0">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Sparkles className="w-5 h-5 fill-emerald-600 stroke-none" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted block">
                Available Balance
              </span>
              <span className="font-mono font-bold text-xl text-ink">
                {credits} {credits === 1 ? 'Credit' : 'Credits'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 1: PAY-AS-YOU-GO CREDIT PACKS */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-ink tracking-tight">
              Pay-As-You-Go Credit Packs
            </h2>
            <p className="text-sm text-body">
              One-time purchases in Egyptian Pounds (EGP). Credits never expire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plansData.creditPacks.map((pack) => {
              const isPopular = pack.popular;
              return (
                <Card
                  key={pack.id}
                  className={`p-6 bg-surface-card flex flex-col justify-between space-y-5 relative transition-all duration-200 ${
                    isPopular ? 'border-2 border-black shadow-md' : 'border border-hairline-strong'
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-wider">
                      {pack.badge || 'Most Popular'}
                    </span>
                  )}

                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted">
                      {pack.unitPriceEgp}
                    </span>
                    <h3 className="text-lg font-bold text-ink">
                      {pack.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-mono font-bold text-ink">
                        {pack.priceEgp}
                      </span>
                      <span className="text-xs font-mono text-muted uppercase">EGP</span>
                    </div>
                    <p className="text-xs text-body leading-relaxed">
                      {pack.description}
                    </p>

                    <div className="pt-3 border-t border-hairline space-y-2 text-xs text-body font-mono">
                      <div className="flex items-center justify-between">
                        <span>Total AI Credits:</span>
                        <strong className="text-ink">{pack.credits} Credits</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Full Applications:</span>
                        <strong className="text-emerald-700">{pack.applicationsCount} Applications</strong>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant={isPopular ? 'primary' : 'secondary'}
                    className="w-full"
                    onClick={() => handleBuyPack(pack)}
                  >
                    Purchase {pack.credits} Credits
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: SUBSCRIPTION PLANS (WITH MONTHLY / YEARLY TOGGLE) */}
        <div className="space-y-6 pt-4 border-t border-hairline">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-ink tracking-tight">
                Monthly Subscriptions
              </h2>
              <p className="text-sm text-body">
                Continuous credits and advanced career features for active job seekers.
              </p>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex items-center p-1 rounded-md bg-surface-strong border border-hairline shrink-0">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-ink shadow-xs'
                    : 'text-body hover:text-ink'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-ink shadow-xs'
                    : 'text-body hover:text-ink'
                }`}
              >
                <span>Yearly</span>
                <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plansData.subscriptions.map((plan) => {
              const isFeatured = plan.featured;
              const isCurrent = currentPlan?.planId === plan.id;
              const price = billingCycle === 'yearly' ? plan.yearlyPriceEgp : plan.monthlyPriceEgp;

              return (
                <Card
                  key={plan.id}
                  variant={isFeatured ? 'dark' : 'default'}
                  className={`p-6 sm:p-8 flex flex-col justify-between space-y-6 relative transition-all duration-200 ${
                    isFeatured
                      ? 'bg-surface-dark text-on-dark border border-surface-dark-elevated shadow-xl'
                      : 'bg-surface-card text-ink border border-hairline-strong'
                  }`}
                >
                  {isFeatured && (
                    <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider">
                      {plan.badge || 'Most Popular'}
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className={`text-xl font-bold ${isFeatured ? 'text-white' : 'text-ink'}`}>
                        {plan.name}
                      </h3>
                      <p className={`text-xs mt-1 ${isFeatured ? 'text-on-dark-soft' : 'text-body'}`}>
                        {plan.description}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-3xl font-mono font-bold ${isFeatured ? 'text-white' : 'text-ink'}`}>
                        {price}
                      </span>
                      <span className={`text-xs font-mono uppercase ${isFeatured ? 'text-on-dark-soft' : 'text-muted'}`}>
                        EGP / {billingCycle === 'yearly' ? 'year' : 'month'}
                      </span>
                    </div>

                    <div className={`p-2.5 rounded-lg text-xs font-mono font-semibold ${
                      isFeatured ? 'bg-white/10 text-emerald-300' : 'bg-canvas-soft text-emerald-800 border border-emerald-100'
                    }`}>
                      {plan.monthlyCredits} AI Credits / month
                    </div>

                    <ul className={`space-y-2 text-xs pt-2 border-t ${
                      isFeatured ? 'border-white/10 text-on-dark-soft' : 'border-hairline text-body'
                    }`}>
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 leading-relaxed">
                          <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            isFeatured ? 'text-emerald-400' : 'text-emerald-600'
                          }`} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant={isFeatured ? 'inverted' : 'primary'}
                    className="w-full"
                    disabled={isCurrent}
                    onClick={() => handleSubscribePlan(plan)}
                  >
                    {isCurrent ? 'Current Active Plan' : `Subscribe (${billingCycle})`}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: USAGE HISTORY TABLE */}
        <div className="space-y-4 pt-6 border-t border-hairline">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-ink tracking-tight flex items-center gap-2">
                <History className="w-4 h-4 text-muted" />
                <span>Credits Usage History</span>
              </h2>
              <p className="text-xs text-body">
                Complete audit trail of all starter grants, pack purchases, and application deductions.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-hairline-strong shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-canvas-soft border-b border-hairline-strong text-muted uppercase font-mono tracking-wider">
                  <th className="p-3.5 font-semibold">Date</th>
                  <th className="p-3.5 font-semibold">Description</th>
                  <th className="p-3.5 font-semibold text-right">Credits Change</th>
                  <th className="p-3.5 font-semibold text-right">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {usageHistory.map((tx) => {
                  const isCredit = tx.type === 'credit' || tx.amount > 0;
                  return (
                    <tr key={tx.id} className="hover:bg-canvas-soft/50 transition-colors">
                      <td className="p-3.5 font-mono text-body whitespace-nowrap">
                        {tx.timestamp}
                      </td>
                      <td className="p-3.5 font-medium text-ink">
                        {tx.description}
                      </td>
                      <td className={`p-3.5 font-mono font-bold text-right whitespace-nowrap ${
                        isCredit ? 'text-emerald-600' : 'text-ink'
                      }`}>
                        {isCredit ? `+${tx.amount}` : tx.amount}
                      </td>
                      <td className="p-3.5 font-mono font-semibold text-ink text-right whitespace-nowrap">
                        {tx.balanceAfter} credits
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Mock Checkout Modal */}
      {selectedCheckoutItem && (
        <CheckoutModal
          isOpen={Boolean(selectedCheckoutItem)}
          onClose={() => setSelectedCheckoutItem(null)}
          selectedItem={selectedCheckoutItem}
        />
      )}
    </div>
  );
}
