'use client';

import { useState } from 'react';
import { Button, Input, Card, Spinner } from '@repo/ui';

export default function CuratePage() {
  const [url, setUrl] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  const handleSummarize = async () => {
    if (!url) return;

    setSummarizing(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/curate/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Article Title',
          url: url,
          content: 'Sample content... In a real implementation, this would fetch the actual content from the URL.',
        }),
      });

      if (!response.ok) throw new Error('Summarization failed');

      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to summarize content. Please try again.');
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Curate Content</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Add Content to Curate</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content URL
                </label>
                <Input
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              <Button onClick={handleSummarize} className="w-full" disabled={summarizing}>
                {summarizing ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Summarizing...
                  </>
                ) : (
                  'Summarize Content'
                )}
              </Button>

              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-3">Or collect from topics</h3>
                <div className="space-y-2">
                  <Input placeholder="Topics (comma-separated)" />
                  <Button variant="outline" className="w-full">
                    Collect Content
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Summary */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Content Summary</h2>
            {summarizing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Spinner size="lg" />
                <p className="text-gray-600 mt-4">Analyzing content...</p>
              </div>
            ) : summary ? (
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">One-Line Summary</div>
                  <div className="mt-1 font-medium">{summary.one_liner}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-600">Key Points</div>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                    {summary.key_points?.map((point: string, index: number) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-600">Summary</div>
                  <div className="mt-1 text-sm">{summary.summary}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-600">Key Takeaway</div>
                  <div className="mt-1 text-sm italic">{summary.takeaway}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-600">Tags</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {summary.tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t flex gap-2">
                  <Button variant="outline" className="flex-1">Save</Button>
                  <Button className="flex-1">Add to Newsletter</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Content summary will appear here</p>
                <p className="text-sm mt-2">Enter a URL and click Summarize</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
