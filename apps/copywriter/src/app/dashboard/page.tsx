'use client';

import { Button, Card } from '@repo/ui';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">AI Copywriter</h1>
            <div className="flex gap-4">
              <Link href="/frameworks">
                <Button variant="outline">Frameworks</Button>
              </Link>
              <Link href="/create">
                <Button>+ New Copy</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-sm text-gray-600">Copy Generated</div>
            <div className="text-3xl font-bold mt-2">156</div>
            <div className="text-sm text-gray-500 mt-1">This month</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">Conversion Rate</div>
            <div className="text-3xl font-bold mt-2">12.5%</div>
            <div className="text-sm text-green-600 mt-1">↑ 3.2% from last month</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">A/B Tests</div>
            <div className="text-3xl font-bold mt-2">23</div>
            <div className="text-sm text-gray-500 mt-1">Active tests</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">Best Framework</div>
            <div className="text-3xl font-bold mt-2">PAS</div>
            <div className="text-sm text-gray-500 mt-1">Highest conversion</div>
          </Card>
        </div>

        {/* Quick Create */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Create</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/create?type=google_ads">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="font-semibold">Google Ads</h3>
                <p className="text-sm text-gray-600 mt-1">RSA & Display ads</p>
              </Card>
            </Link>
            <Link href="/create?type=email">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-4xl mb-2">✉️</div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm text-gray-600 mt-1">Sequences & campaigns</p>
              </Card>
            </Link>
            <Link href="/create?type=product">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-4xl mb-2">🛍️</div>
                <h3 className="font-semibold">Product</h3>
                <p className="text-sm text-gray-600 mt-1">Descriptions & features</p>
              </Card>
            </Link>
            <Link href="/create?type=landing">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-4xl mb-2">🚀</div>
                <h3 className="font-semibold">Landing Page</h3>
                <p className="text-sm text-gray-600 mt-1">Sales & conversion</p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Frameworks */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Copywriting Frameworks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'AIDA', desc: 'Attention → Interest → Desire → Action', uses: 45 },
              { name: 'PAS', desc: 'Problem → Agitate → Solve', uses: 67 },
              { name: 'BAB', desc: 'Before → After → Bridge', uses: 32 },
              { name: '4Ps', desc: 'Promise → Picture → Proof → Push', uses: 28 },
              { name: 'FAB', desc: 'Features → Advantages → Benefits', uses: 41 },
              { name: 'QUEST', desc: 'Qualify → Understand → Educate → Stimulate → Transition', uses: 19 },
            ].map((framework) => (
              <Card key={framework.name} className="p-4">
                <h3 className="font-semibold text-lg">{framework.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{framework.desc}</p>
                <p className="text-xs text-gray-500 mt-2">{framework.uses} times used</p>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
