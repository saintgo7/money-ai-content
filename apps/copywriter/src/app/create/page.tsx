'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Input, Select, Card, Spinner } from '@repo/ui';

function CreateForm() {
  const searchParams = useSearchParams();
  const copyType = searchParams.get('type') || 'ad_copy';

  const [formData, setFormData] = useState({
    copyType,
    productName: '',
    category: '',
    features: '',
    usp: '',
    targetAge: '25-45',
    interests: '',
    painPoints: '',
    tone: 'professional',
    framework: 'PAS',
    variations: 3,
  });

  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/copy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          copyType: formData.copyType,
          productInfo: {
            name: formData.productName,
            category: formData.category,
            features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
            usp: formData.usp,
          },
          targetAudience: {
            ageRange: formData.targetAge,
            interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
            painPoints: formData.painPoints.split(',').map(p => p.trim()).filter(Boolean),
            desiredOutcome: 'Better results with less effort',
          },
          tone: formData.tone,
          framework: formData.framework,
          variations: formData.variations,
        }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();
      setResults(data.variations);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate copy. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Marketing Copy</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Copy Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Copy Type
                </label>
                <Select
                  value={formData.copyType}
                  onChange={(e) => setFormData({ ...formData, copyType: e.target.value })}
                >
                  <option value="ad_copy">Ad Copy</option>
                  <option value="email">Email</option>
                  <option value="product">Product Description</option>
                  <option value="landing">Landing Page</option>
                  <option value="social">Social Media</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <Input
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Features (comma-separated) *
                </label>
                <Input
                  placeholder="Fast, Easy to use, Affordable"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unique Selling Proposition (USP) *
                </label>
                <Input
                  placeholder="What makes your product unique?"
                  value={formData.usp}
                  onChange={(e) => setFormData({ ...formData, usp: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience Interests
                </label>
                <Input
                  placeholder="technology, productivity, business"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pain Points
                </label>
                <Input
                  placeholder="too slow, too expensive, too complex"
                  value={formData.painPoints}
                  onChange={(e) => setFormData({ ...formData, painPoints: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Copywriting Framework
                </label>
                <Select
                  value={formData.framework}
                  onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
                >
                  <option value="AIDA">AIDA</option>
                  <option value="PAS">PAS</option>
                  <option value="BAB">BAB</option>
                  <option value="4Ps">4Ps</option>
                  <option value="FAB">FAB</option>
                  <option value="QUEST">QUEST</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tone
                </label>
                <Select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="urgent">Urgent</option>
                  <option value="friendly">Friendly</option>
                  <option value="luxury">Luxury</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Variations
                </label>
                <Select
                  value={formData.variations}
                  onChange={(e) => setFormData({ ...formData, variations: Number(e.target.value) })}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={generating}>
                {generating ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Generating...
                  </>
                ) : (
                  'Generate Copy'
                )}
              </Button>
            </form>
          </Card>

          {/* Results */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Generated Variations</h2>
            {generating ? (
              <Card className="p-12 flex flex-col items-center">
                <Spinner size="lg" />
                <p className="text-gray-600 mt-4">Crafting your copy...</p>
              </Card>
            ) : results.length > 0 ? (
              results.map((variation, index) => (
                <Card key={index} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold">Variation {index + 1}</h3>
                    <Button size="sm" variant="outline">Copy</Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Headline</div>
                      <div className="text-lg font-semibold mt-1">{variation.headline}</div>
                    </div>
                    {variation.subheadline && (
                      <div>
                        <div className="text-sm font-medium text-gray-600">Subheadline</div>
                        <div className="mt-1">{variation.subheadline}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-600">Body</div>
                      <div className="mt-1">{variation.body}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Call to Action</div>
                      <div className="mt-1 font-medium text-blue-600">{variation.cta}</div>
                    </div>
                    {variation.angle && (
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        Angle: {variation.angle}
                      </div>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center text-gray-500">
                <p>Your copy variations will appear here</p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateForm />
    </Suspense>
  );
}
