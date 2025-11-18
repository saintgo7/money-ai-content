'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card } from '@repo/ui';
import Link from 'next/link';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for trying out AI content generation',
    features: [
      '10,000 tokens/month',
      'Basic content generation',
      'All 5 platforms access',
      '1 brand profile',
      'Email support',
    ],
    cta: 'Current Plan',
    popular: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    description: 'For individuals and small teams',
    features: [
      '100,000 tokens/month',
      'Advanced AI models',
      'Brand voice learning',
      '3 brand profiles',
      '5 team members',
      'Priority support',
      'API access',
    ],
    cta: 'Upgrade to Starter',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    description: 'For growing businesses and agencies',
    features: [
      '500,000 tokens/month',
      'Premium AI models',
      'Custom brand voices',
      '10 brand profiles',
      '20 team members',
      'Priority support',
      'Advanced analytics',
      'White-label options',
    ],
    cta: 'Upgrade to Pro',
    popular: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    description: 'For large teams and organizations',
    features: [
      'Unlimited tokens',
      'Custom AI training',
      'Unlimited brand profiles',
      'Unlimited team members',
      'Dedicated support',
      'SLA guarantee',
      'Custom integrations',
      'On-premise deployment option',
    ],
    cta: 'Upgrade to Enterprise',
    popular: false,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    if (planId === 'free') return;

    if (!session) {
      router.push('/auth/signin?callbackUrl=/pricing');
      return;
    }

    setLoading(planId);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
      setLoading(null);
    }
  };

  const handleManageBilling = async () => {
    setLoading('billing');

    try {
      const response = await fetch('/api/billing-portal', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Billing portal error:', error);
      alert('Failed to open billing portal. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-gray-900">AI Contents Studio</h1>
            </Link>
            <div className="flex gap-4">
              {session ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                  <Button variant="ghost" onClick={handleManageBilling}>
                    {loading === 'billing' ? 'Loading...' : 'Manage Billing'}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Success/Cancel Messages */}
        {searchParams.get('success') && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            ✓ Payment successful! Your subscription is now active.
          </div>
        )}
        {searchParams.get('canceled') && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            Payment was canceled. You can try again anytime.
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that's right for you. Scale as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`p-8 relative ${
                plan.popular
                  ? 'border-2 border-blue-600 shadow-xl'
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                  {plan.price > 0 && (
                    <span className="text-gray-600 ml-2">/month</span>
                  )}
                </div>
              </div>

              <Button
                className="w-full mb-6"
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => handleCheckout(plan.id)}
                disabled={loading === plan.id || (plan.id === 'free' && !!session)}
              >
                {loading === plan.id ? 'Loading...' : plan.cta}
              </Button>

              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect
                immediately, and we'll prorate the charges.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">What are tokens?</h3>
              <p className="text-gray-600">
                Tokens are units of AI processing. On average, 1,000 tokens equals about 750
                words. Your monthly limit refreshes on your billing date.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                Yes! Our Free plan lets you try all features with 10,000 tokens per month. No
                credit card required.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards through Stripe. Enterprise plans can pay via
                invoice.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Content Creation?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of creators using AI to scale their content.
          </p>
          <Link href="/auth/signup">
            <Button size="lg">Get Started Free</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
