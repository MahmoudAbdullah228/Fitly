import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { useAppState } from '../../hooks/useAppState.js';
import { useToast } from '../ui/Toast.jsx';
import { 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  ShieldCheck 
} from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  selectedItem = null, // { type: 'pack'|'plan', title, credits, priceEgp, billingCycle, plan }
  onSuccess,
}) {
  const { addCredits, activatePlan } = useAppState();
  const { showToast } = useToast();

  const [cardName, setCardName] = useState('Omar Tarek');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [expiry, setExpiry] = useState('08/28');
  const [cvc, setCvc] = useState('123');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      if (selectedItem?.type === 'plan' && selectedItem?.plan) {
        activatePlan(selectedItem.plan, selectedItem.billingCycle || 'monthly');
        showToast(`Successfully subscribed to ${selectedItem.title}!`, 'success');
      } else {
        const creditsToAdd = selectedItem?.credits || 16;
        const desc = `Purchased ${selectedItem?.title || 'Credit Pack'} (${creditsToAdd} credits)`;
        addCredits(creditsToAdd, desc);
        showToast(`Added ${creditsToAdd} credits to your account!`, 'success');
      }

      if (onSuccess) {
        onSuccess();
      }
    }, 1600);
  };

  const handleClose = () => {
    if (isProcessing) return;
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSuccess ? 'Payment Successful' : 'Complete Purchase'}
      description={isSuccess ? undefined : 'Mock Payment Gateway for University Demo'}
      maxWidth="max-w-md"
      preventClose={isProcessing}
    >
      {isSuccess ? (
        <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-ink">
              {selectedItem?.type === 'plan' ? 'Subscription Active!' : 'Credits Added to Account!'}
            </h3>
            <p className="text-sm text-body mt-1">
              {selectedItem?.type === 'plan'
                ? `You now have full access to ${selectedItem.title} features & monthly credits.`
                : `${selectedItem?.credits || 16} AI credits have been credited to your balance.`}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-strong border border-hairline font-mono text-xs text-body-strong flex items-center justify-between">
            <span>Amount Charged:</span>
            <span className="font-semibold">{selectedItem?.priceEgp || 399} EGP (Simulated)</span>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleClose}
            >
              Continue to Platform
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Item Summary Card */}
          <div className="p-3.5 rounded-lg bg-canvas-soft border border-hairline-strong flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-primary text-on-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 fill-white stroke-none" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-ink">
                  {selectedItem?.title || 'Active Seeker Pack'}
                </h4>
                <p className="text-xs text-body">
                  {selectedItem?.credits ? `${selectedItem.credits} AI credits` : 'Monthly Subscription'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono font-semibold text-sm text-ink">
                {selectedItem?.priceEgp || 399} EGP
              </span>
              {selectedItem?.billingCycle && (
                <span className="block text-[10px] text-muted">/{selectedItem.billingCycle}</span>
              )}
            </div>
          </div>

          {/* Demo disclaimer notice */}
          <div className="flex items-center gap-2 p-2.5 rounded-md bg-amber-50/80 border border-amber-200/60 text-amber-900 text-xs">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Demo Mode:</strong> No real payment is processed. You can enter any values or leave fields as is.
            </span>
          </div>

          {/* Mock Card Form */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-body-strong mb-1 block">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Omar Tarek"
                className="h-10 w-full rounded-md border border-hairline-strong bg-surface-card px-3 text-sm text-ink focus:border-ink focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-body-strong mb-1 block">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4111 2222 3333 4444"
                  className="h-10 w-full rounded-md border border-hairline-strong bg-surface-card px-3 pl-9 font-mono text-sm text-ink focus:border-ink focus:outline-none"
                />
                <CreditCard className="w-4 h-4 text-muted absolute left-3 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-body-strong mb-1 block">
                  Expires
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="h-10 w-full rounded-md border border-hairline-strong bg-surface-card px-3 font-mono text-sm text-ink focus:border-ink focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-body-strong mb-1 block">
                  CVC
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    className="h-10 w-full rounded-md border border-hairline-strong bg-surface-card px-3 pl-8 font-mono text-sm text-ink focus:border-ink focus:outline-none"
                  />
                  <Lock className="w-3.5 h-3.5 text-muted absolute left-2.5 top-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-hairline">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handlePay}
              disabled={isProcessing}
              className="min-w-[130px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Pay {selectedItem?.priceEgp || 399} EGP</span>
              )}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
