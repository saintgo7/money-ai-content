'use client';

import { useState } from 'react';
import { Button, Input, Textarea, Card, Spinner } from '@repo/ui';

export default function BrandPage() {
  const [formData, setFormData] = useState({
    name: '',
    guidelines: '',
    sample1: '',
    sample2: '',
    sample3: '',
    toneKeywords: '',
  });

  const [learning, setLearning] = useState(false);
  const [brandProfile, setBrandProfile] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLearning(true);
    setBrandProfile(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/brand/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          sampleContents: [formData.sample1, formData.sample2, formData.sample3].filter(Boolean),
          guidelines: formData.guidelines,
          toneKeywords: formData.toneKeywords.split(',').map((k) => k.trim()).filter(Boolean),
        }),
      });

      if (!response.ok) throw new Error('Learning failed');

      const data = await response.json();
      setBrandProfile(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to learn brand voice. Please try again.');
    } finally {
      setLearning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Brand Voice Settings</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Learn Brand Voice</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Name *
                </label>
                <Input
                  placeholder="Your brand name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Guidelines
                </label>
                <Textarea
                  placeholder="Describe your brand's tone, style, and personality..."
                  value={formData.guidelines}
                  onChange={(e) => setFormData({ ...formData, guidelines: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sample Content 1 *
                </label>
                <Textarea
                  placeholder="Paste a sample of your brand's content..."
                  value={formData.sample1}
                  onChange={(e) => setFormData({ ...formData, sample1: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sample Content 2
                </label>
                <Textarea
                  placeholder="Another sample (optional but recommended)..."
                  value={formData.sample2}
                  onChange={(e) => setFormData({ ...formData, sample2: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sample Content 3
                </label>
                <Textarea
                  placeholder="One more sample (optional)..."
                  value={formData.sample3}
                  onChange={(e) => setFormData({ ...formData, sample3: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tone Keywords (comma-separated)
                </label>
                <Input
                  placeholder="innovative, trustworthy, friendly"
                  value={formData.toneKeywords}
                  onChange={(e) => setFormData({ ...formData, toneKeywords: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={learning}>
                {learning ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Learning Brand Voice...
                  </>
                ) : (
                  'Learn Brand Voice'
                )}
              </Button>
            </form>
          </Card>

          {/* Result */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Brand Voice Profile</h2>
            {learning ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Spinner size="lg" />
                <p className="text-gray-600 mt-4">Analyzing your brand voice...</p>
              </div>
            ) : brandProfile ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Brand: {brandProfile.name}</h3>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Writing Style</h4>
                  <div className="bg-gray-50 p-4 rounded space-y-1 text-sm">
                    <p>Sentence Length: <span className="font-medium">{brandProfile.writingStyle?.sentenceLength}</span></p>
                    <p>Complexity: <span className="font-medium">{brandProfile.writingStyle?.complexity}/10</span></p>
                    <p>Vocabulary: <span className="font-medium">{brandProfile.writingStyle?.vocabularyLevel}</span></p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Tone Attributes</h4>
                  <div className="space-y-2">
                    {Object.entries(brandProfile.toneAttributes || {}).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-sm capitalize w-24">{key}:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(value / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{value}/10</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Vocabulary Patterns</h4>
                  <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
                    {brandProfile.vocabularyPatterns?.preferredTerms?.length > 0 && (
                      <div>
                        <span className="font-medium">Preferred: </span>
                        {brandProfile.vocabularyPatterns.preferredTerms.join(', ')}
                      </div>
                    )}
                    {brandProfile.vocabularyPatterns?.avoidedTerms?.length > 0 && (
                      <div>
                        <span className="font-medium">Avoid: </span>
                        {brandProfile.vocabularyPatterns.avoidedTerms.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                <Button className="w-full">Save Brand Profile</Button>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Your brand voice profile will appear here</p>
                <p className="text-sm mt-2">Provide samples to learn your brand voice</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
