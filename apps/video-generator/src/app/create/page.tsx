'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Textarea, Select, Card, Spinner } from '@repo/ui';

function CreateForm() {
  const searchParams = useSearchParams();
  const template = searchParams.get('template');

  const [formData, setFormData] = useState({
    script: '',
    format: 'youtube',
    style: 'professional',
    voice: 'alloy',
    musicStyle: 'upbeat',
  });

  const [generating, setGenerating] = useState(false);
  const [scenes, setScenes] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();
      setScenes(data.scenes);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate video. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Create Video {template && `- ${template} Template`}
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Video Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Script *
                </label>
                <Textarea
                  placeholder="Enter your video script here... Describe what you want to say in the video."
                  value={formData.script}
                  onChange={(e) => setFormData({ ...formData, script: e.target.value })}
                  rows={10}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Be specific about what you want in each scene
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format
                </label>
                <Select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                >
                  <option value="youtube">YouTube (16:9)</option>
                  <option value="tiktok">TikTok (9:16)</option>
                  <option value="reels">Instagram Reels (9:16)</option>
                  <option value="shorts">YouTube Shorts (9:16)</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style
                </label>
                <Select
                  value={formData.style}
                  onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="cinematic">Cinematic</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="energetic">Energetic</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice
                </label>
                <Select
                  value={formData.voice}
                  onChange={(e) => setFormData({ ...formData, voice: e.target.value })}
                >
                  <option value="alloy">Alloy (Male)</option>
                  <option value="echo">Echo (Male)</option>
                  <option value="fable">Fable (Male)</option>
                  <option value="nova">Nova (Female)</option>
                  <option value="shimmer">Shimmer (Female)</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Music
                </label>
                <Select
                  value={formData.musicStyle}
                  onChange={(e) => setFormData({ ...formData, musicStyle: e.target.value })}
                >
                  <option value="upbeat">Upbeat</option>
                  <option value="calm">Calm</option>
                  <option value="dramatic">Dramatic</option>
                  <option value="corporate">Corporate</option>
                  <option value="none">No Music</option>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={generating}>
                {generating ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Generating Scenes...
                  </>
                ) : (
                  'Generate Video'
                )}
              </Button>
            </form>
          </Card>

          {/* Preview */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Scene Preview</h2>
            {generating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Spinner size="lg" />
                <p className="text-gray-600 mt-4">Analyzing your script...</p>
              </div>
            ) : scenes.length > 0 ? (
              <div className="space-y-4">
                {scenes.map((scene, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">Scene {index + 1}</h3>
                      <span className="text-sm text-gray-600">{scene.duration}s</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{scene.text}</p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Visual: {scene.visual_description}</p>
                      <p>Type: {scene.visual_type}</p>
                      <p>Movement: {scene.camera_movement}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">Edit Scenes</Button>
                  <Button className="flex-1">Process Video</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Scene breakdown will appear here</p>
                <p className="text-sm mt-2">Enter your script and click Generate</p>
              </div>
            )}
          </Card>
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
