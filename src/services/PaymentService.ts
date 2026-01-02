import { initStripe, useStripe } from '@stripe/stripe-react-native';
import * as paymentsAPI from '@/api/endpoints/payments';

class PaymentService {
  async initialize() {
    await initStripe({
      publishableKey: "STRIPE_PUBLISHABLE_KEY",
      merchantIdentifier: 'merchant.com.mediqueue',
    });
  }

  async processPayment(appointmentId: string, amount: number) {
    try {
      // 1. Create payment intent on server
      const { clientSecret } = await paymentsAPI.createPaymentIntent({
        appointmentId,
        amount,
        currency: 'USD',
      });

      // 2. Present payment sheet
      const { confirmPayment } = useStripe();
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        throw new Error(error.message);
      }

      // 3. Confirm payment on server
      await paymentsAPI.confirmPayment({
        paymentIntentId: paymentIntent.id,
      });

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}

export default new PaymentService();