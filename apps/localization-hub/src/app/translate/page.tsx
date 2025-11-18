'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Textarea, Select, Card, Spinner } from '@repo/ui';

const LANGUAGES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese (Simplified)',
  ar: 'Arabic',
};

function TranslateForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    text: '',
    sourceLang: searchParams.get('from') || 'en',
    targetLang: searchParams.get('to') || 'es',
    contentType: 'marketing',
  });

  const [translating, setTranslating] = useState(false);
  const [translation, setTranslation] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTranslating(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: formData.text,
          sourceLang: formData.sourceLang,
          targetLang: formData.targetLang,
          contentType: formData.contentType,
        }),
      });

      if (!response.ok) throw new Error('Translation failed');

      const data = await response.json();
      setTranslation(data.translation);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to translate. Please try again.');
    } finally {
      setTranslating(false);
    }
  };

  const handleSwap = () => {
    setFormData({
      ...formData,
      sourceLang: formData.targetLang,
      targetLang: formData.sourceLang,
      text: translation,
    });
    setTranslation(formData.text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Translate Content</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Source */}
            <Card className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Language
                </label>
                <Select
                  value={formData.sourceLang}
                  onChange={(e) => setFormData({ ...formData, sourceLang: e.target.value })}
                >
                  {Object.entries(LANGUAGES).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text to Translate
                </label>
                <Textarea
                  placeholder="Enter text to translate..."
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  rows={15}
                  required
                />
              </div>
            </Card>

            {/* Controls */}
            <div className="lg:hidden flex justify-center">
              <Button type="button" onClick={handleSwap} variant="outline" size="sm">
                ⇄ Swap
              </Button>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <Button type="button" onClick={handleSwap} variant="outline">
                ⇄ Swap Languages
              </Button>
            </div>

            {/* Target */}
            <Card className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Language
                </label>
                <Select
                  value={formData.targetLang}
                  onChange={(e) => setFormData({ ...formData, targetLang: e.target.value })}
                >
                  {Object.entries(LANGUAGES).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Translation
                </label>
                {translating ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <Spinner size="lg" />
                    <p className="text-gray-600 mt-4">Translating...</p>
                  </div>
                ) : (
                  <Textarea
                    value={translation}
                    onChange={(e) => setTranslation(e.target.value)}
                    rows={15}
                    placeholder="Translation will appear here..."
                  />
                )}
              </div>
            </Card>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <Select
                value={formData.contentType}
                onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
              >
                <option value="marketing">Marketing</option>
                <option value="technical">Technical</option>
                <option value="legal">Legal</option>
                <option value="creative">Creative</option>
                <option value="general">General</option>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button type="submit" disabled={translating || !formData.text}>
                {translating ? 'Translating...' : 'Translate'}
              </Button>
              {translation && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(translation)}
                  >
                    Copy
                  </Button>
                  <Button type="button" variant="outline">
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </form>

        {/* Translation Info */}
        {translation && (
          <Card className="mt-6 p-6">
            <h3 className="font-semibold mb-4">Translation Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Word Count</div>
                <div className="font-medium">{formData.text.split(/\s+/).length} words</div>
              </div>
              <div>
                <div className="text-gray-600">Character Count</div>
                <div className="font-medium">{formData.text.length} characters</div>
              </div>
              <div>
                <div className="text-gray-600">Translation Quality</div>
                <div className="font-medium text-green-600">High</div>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

export default function TranslatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TranslateForm />
    </Suspense>
  );
}
