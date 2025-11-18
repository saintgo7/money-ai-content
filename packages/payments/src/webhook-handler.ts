import Stripe from 'stripe';
import { stripe, handleSubscriptionCreated, handleSubscriptionUpdated, handleSubscriptionDeleted } from './stripe-client';

export async function handleStripeWebhook(
  body: string,
  signature: string
): Promise<{ success: boolean; message: string }> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        // Log successful payment
        console.log('Payment succeeded:', event.data.object);
        break;

      case 'invoice.payment_failed':
        // Handle failed payment
        console.log('Payment failed:', event.data.object);
        // TODO: Send email notification
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { success: true, message: 'Webhook processed successfully' };
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    throw error;
  }
}
