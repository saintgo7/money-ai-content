'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Input, Textarea, Select, Card, Spinner } from '@repo/ui';

function GenerateForm() {
  const searchParams = useSearchParams();
  const defaultType = searchParams.get('type') || 'social';

  const [formData, setFormData] = useState({
    type: defaultType,
    topic: '',
    platform: 'instagram',
    tone: 'professional',
    length: 'medium',
    keywords: '',
  });

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          topic: formData.topic,
          platform: formData.platform,
          tone: formData.tone,
          length: formData.length,
          keywords: formData.keywords.split(',').map((k) => k.trim()).filter(Boolean),
        }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();
      setResult(data.content);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Generate Content</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Content Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <Select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  <option value="social">Social Post</option>
                  <option value="blog">Blog Post</option>
                  <option value="email">Email</option>
                  <option value="ad">Ad Copy</option>
                  <option value="video">Video Script</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic *
                </label>
                <Input
                  placeholder="What's your content about?"
                  value={formData.topic}
                  onChange={(e) => handleChange('topic', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform
                </label>
                <Select
                  value={formData.platform}
                  onChange={(e) => handleChange('platform', e.target.value)}
                >
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="facebook">Facebook</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="blog">Blog</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tone
                </label>
                <Select
                  value={formData.tone}
                  onChange={(e) => handleChange('tone', e.target.value)}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="humorous">Humorous</option>
                  <option value="inspirational">Inspirational</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Length
                </label>
                <Select
                  value={formData.length}
                  onChange={(e) => handleChange('length', e.target.value)}
                >
                  <option value="short">Short (100-200 words)</option>
                  <option value="medium">Medium (300-500 words)</option>
                  <option value="long">Long (800-1200 words)</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (comma-separated)
                </label>
                <Input
                  placeholder="AI, automation, productivity"
                  value={formData.keywords}
                  onChange={(e) => handleChange('keywords', e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={generating}>
                {generating ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Generating...
                  </>
                ) : (
                  'Generate Content'
                )}
              </Button>
            </form>
          </Card>

          {/* Result */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Generated Content</h2>
            {generating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Spinner size="lg" />
                <p className="text-gray-600 mt-4">Creating your content...</p>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <Textarea
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigator.clipboard.writeText(result)}
                    variant="outline"
                  >
                    Copy to Clipboard
                  </Button>
                  <Button variant="outline">Save Draft</Button>
                  <Button>Publish</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Your generated content will appear here</p>
                <p className="text-sm mt-2">Fill in the form and click Generate</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GenerateForm />
    </Suspense>
  );
}
