'use client';

import { Button, Card } from '@repo/ui';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">AI Localization Hub</h1>
            <div className="flex gap-4">
              <Link href="/glossary">
                <Button variant="outline">Glossaries</Button>
              </Link>
              <Link href="/translate">
                <Button>+ Translate</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-sm text-gray-600">Words Translated</div>
            <div className="text-3xl font-bold mt-2">125K</div>
            <div className="text-sm text-gray-500 mt-1">This month</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">Languages</div>
            <div className="text-3xl font-bold mt-2">24</div>
            <div className="text-sm text-gray-500 mt-1">Active language pairs</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">Translation Memory</div>
            <div className="text-3xl font-bold mt-2">98%</div>
            <div className="text-sm text-gray-500 mt-1">Match rate</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">Quality Score</div>
            <div className="text-3xl font-bold mt-2">9.2/10</div>
            <div className="text-sm text-green-600 mt-1">Excellent quality</div>
          </Card>
        </div>

        {/* Popular Language Pairs */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Popular Language Pairs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { from: 'English', to: 'Spanish', count: 1543 },
              { from: 'English', to: 'French', count: 1234 },
              { from: 'English', to: 'Japanese', count: 987 },
            ].map((pair) => (
              <Card key={`${pair.from}-${pair.to}`} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">
                      {pair.from} → {pair.to}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {pair.count} translations
                    </div>
                  </div>
                  <Link href={`/translate?from=${pair.from}&to=${pair.to}`}>
                    <Button size="sm" variant="outline">
                      Translate
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Translations */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Translations</h2>
            <Link href="/history">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>

          <Card>
            <div className="divide-y">
              {[
                { id: 1, text: 'Product launch announcement...', from: 'en', to: 'es', date: '2 hours ago' },
                { id: 2, text: 'Marketing campaign copy...', from: 'en', to: 'fr', date: '5 hours ago' },
                { id: 3, text: 'Website homepage content...', from: 'en', to: 'ja', date: '1 day ago' },
              ].map((translation) => (
                <div key={translation.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium truncate max-w-lg">{translation.text}</div>
                      <div className="flex gap-4 mt-1 text-sm text-gray-600">
                        <span>{translation.from.toUpperCase()} → {translation.to.toUpperCase()}</span>
                        <span>•</span>
                        <span>{translation.date}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
