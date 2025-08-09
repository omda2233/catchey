import { getFunctions, httpsCallable } from 'firebase/functions';
import { TEST_PAYMENT_DATA } from '../config/testPaymentData';

export interface PaymentRequest {
  method: 'card' | 'instapay';
  amount: number;
  userId?: string;
  orderId?: string;
  cardDetails?: {
    number: string;
    expiryDate: string;
    cvv: string;
  };
  instapayNumber?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentId?: string;
  status?: string;
  cardType?: string;
  method?: string;
  amount?: number;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaymentLog {
  operation: string;
  timestamp: Date;
  userRole: string;
  userId: string;
  paymentMethod: string;
  amount: number;
  status: 'success' | 'error' | 'pending';
  transactionId?: string;
  errorMessage?: string;
  debugTrace?: string;
}

class PaymentService {
  private functions = getFunctions();

  /**
   * Process payment using unified API
   */
  async processPayment(paymentRequest: PaymentRequest, userRole: string, userId: string): Promise<PaymentResponse> {
    const log: PaymentLog = {
      operation: 'payment_processing',
      timestamp: new Date(),
      userRole,
      userId,
      paymentMethod: paymentRequest.method,
      amount: paymentRequest.amount,
      status: 'pending',
      debugTrace: `Payment initiated for ${paymentRequest.method} - Amount: $${paymentRequest.amount}`
    };

    try {
      let response: PaymentResponse;

      if (paymentRequest.method === 'card') {
        response = await this.processCardPayment(paymentRequest);
      } else if (paymentRequest.method === 'instapay') {
        response = await this.processInstapayPayment(paymentRequest);
      } else {
        throw new Error('Invalid payment method');
      }

      // Update log with success
      log.status = 'success';
      log.transactionId = response.transactionId;
      log.debugTrace = `Payment successful - Transaction ID: ${response.transactionId}`;

      // Log the payment
      await this.logPayment(log);

      return response;

    } catch (error: any) {
      // Update log with error
      log.status = 'error';
      log.errorMessage = error.message;
      log.debugTrace = `Payment failed - Error: ${error.message}`;

      // Log the error
      await this.logPayment(log);

      return {
        success: false,
        error: {
          code: error.code || 'payment_failed',
          message: error.message || 'Payment processing failed'
        }
      };
    }
  }

  /**
   * Process card payment
   */
  private async processCardPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    if (!paymentRequest.cardDetails) {
      throw new Error('Card details are required for card payment');
    }

    const processCardPayment = httpsCallable(this.functions, 'processCardPayment');

    const result = await processCardPayment({
      cardNumber: paymentRequest.cardDetails.number,
      expiryDate: paymentRequest.cardDetails.expiryDate,
      cvv: paymentRequest.cardDetails.cvv,
      amount: paymentRequest.amount,
      userId: paymentRequest.userId,
      orderId: paymentRequest.orderId
    });

    return result.data as PaymentResponse;
  }

  /**
   * Process Instapay payment
   */
  private async processInstapayPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    if (!paymentRequest.instapayNumber) {
      throw new Error('Instapay number is required for Instapay payment');
    }

    const processInstapayPayment = httpsCallable(this.functions, 'processInstapayPayment');

    const result = await processInstapayPayment({
      instapayNumber: paymentRequest.instapayNumber,
      amount: paymentRequest.amount,
      userId: paymentRequest.userId,
      orderId: paymentRequest.orderId
    });

    return result.data as PaymentResponse;
  }

  /**
   * Log payment operation
   */
  private async logPayment(log: PaymentLog): Promise<void> {
    try {
      // This will be handled by Cloud Functions automatically
      // The log will be written to Firestore logs collection
      console.log('Payment Log:', log);
    } catch (error) {
      console.error('Failed to log payment:', error);
    }
  }

  /**
   * Validate test payment credentials
   */
  validateTestCredentials(paymentRequest: PaymentRequest): boolean {
    if (paymentRequest.method === 'card') {
      if (!paymentRequest.cardDetails) return false;

      const { number, expiryDate, cvv } = paymentRequest.cardDetails;
      const cleanNumber = number.replace(/\s+/g, '').replace(/-/g, '');
      const cleanExpiry = expiryDate.replace(/\//g, '');

      // Check against test cards
      const isVisa = cleanNumber === TEST_PAYMENT_DATA.cards.visa.number.replace(/\s+/g, '') &&
                    cleanExpiry === TEST_PAYMENT_DATA.cards.visa.expiry.replace(/\//g, '') &&
                    cvv === TEST_PAYMENT_DATA.cards.visa.cvv;

      const isMasterCard = cleanNumber === TEST_PAYMENT_DATA.cards.mastercard.number.replace(/\s+/g, '') &&
                          cleanExpiry === TEST_PAYMENT_DATA.cards.mastercard.expiry.replace(/\//g, '') &&
                          cvv === TEST_PAYMENT_DATA.cards.mastercard.cvv;

      return isVisa || isMasterCard;

    } else if (paymentRequest.method === 'instapay') {
      return paymentRequest.instapayNumber === TEST_PAYMENT_DATA.instapay.number;
    }

    return false;
  }

  /**
   * Get test payment credentials
   */
  getTestCredentials() {
    return {
      cards: TEST_PAYMENT_DATA.cards,
      instapay: TEST_PAYMENT_DATA.instapay
    };
  }
}

export const paymentService = new PaymentService();
export default paymentService; 