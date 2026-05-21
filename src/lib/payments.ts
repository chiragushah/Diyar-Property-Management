/**
 * Mock Stripe Integration Library
 * In a real production app, this would use the 'stripe' npm package.
 */

export interface PaymentIntent {
  id: string;
  amount: number;
  status: 'requires_payment_method' | 'succeeded' | 'processing';
  clientSecret: string;
}

export async function createPaymentIntent(amount: number, invoiceId: string): Promise<PaymentIntent> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log(`[Mock Stripe] Creating payment intent for Invoice ${invoiceId} ($${amount})`);

  return {
    id: `pi_mock_${Math.random().toString(36).substring(7)}`,
    amount,
    status: 'requires_payment_method',
    clientSecret: `mock_secret_${Math.random().toString(36).substring(7)}`,
  };
}

export async function confirmPayment(paymentIntentId: string) {
  await new Promise(resolve => setTimeout(resolve, 800));
  console.log(`[Mock Stripe] Payment ${paymentIntentId} confirmed.`);
  return { success: true, transactionId: `txn_mock_${Date.now()}` };
}
