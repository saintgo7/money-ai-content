'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input, Textarea } from '@repo/ui';

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    industry: '',
    contentGoals: '',
    targetAudience: '',
    preferredPlatforms: [] as string[],
  });

  const handlePlatformToggle = (platform: string) => {
    setFormData({
      ...formData,
      preferredPlatforms: formData.preferredPlatforms.includes(platform)
        ? formData.preferredPlatforms.filter((p) => p !== platform)
        : [...formData.preferredPlatforms, platform],
    });
  };

  const handleComplete = () => {
    // In a real implementation, save preferences to database
    console.log('Onboarding data:', formData);
    router.push('/dashboard');
  };

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {session.user?.name}!
          </h1>
          <p className="text-gray-600">Let's set up your AI Contents Studio</p>
        </div>

        {/* Progress */}
        <div className="mb-8 flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded ${
                s <= step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Tell us about your business</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What industry are you in?
                  </label>
                  <Input
                    placeholder="e.g., E-commerce, SaaS, Education"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Who is your target audience?
                  </label>
                  <Input
                    placeholder="e.g., Small business owners, Students"
                    value={formData.targetAudience}
                    onChange={(e) =>
                      setFormData({ ...formData, targetAudience: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <Button onClick={() => setStep(2)} className="w-full">
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">What are your content goals?</h2>
              <Textarea
                placeholder="e.g., Increase brand awareness, Drive sales, Educate customers"
                value={formData.contentGoals}
                onChange={(e) => setFormData({ ...formData, contentGoals: e.target.value })}
                rows={4}
              />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Which platforms do you create content for?
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Instagram',
                  'Facebook',
                  'Twitter',
                  'LinkedIn',
                  'TikTok',
                  'YouTube',
                  'Blog',
                  'Email',
                  'Website',
                ].map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => handlePlatformToggle(platform)}
                    className={`p-4 rounded-lg border-2 text-center font-medium transition ${
                      formData.preferredPlatforms.includes(platform)
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleComplete} className="flex-1">
                Get Started
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          Step {step} of 3
        </div>
      </Card>
    </div>
  );
}
