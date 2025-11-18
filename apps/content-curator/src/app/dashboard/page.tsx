'use client';

import { Button, Card } from '@repo/ui';
import Link from 'next/link';

export default function DashboardPage() {
  const curatedItems = [
    { id: 1, title: 'The Future of AI in Content Marketing', source: 'TechCrunch', date: '2 hours ago' },
    { id: 2, title: '10 Best Practices for SEO in 2024', source: 'Moz Blog', date: '5 hours ago' },
    { id: 3, title: 'How Automation is Changing Business', source: 'Forbes', date: '1 day ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">AI Content Curator</h1>
            <div className="flex gap-4">
              <Link href="/sources">
                <Button variant="outline">Manage Sources</Button>
              </Link>
              <Link href="/curate">
                <Button>+ Curate Content</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-sm text-gray-600">Items Curated</div>
            <div className="text-3xl font-bold mt-2">342</div>
            <div className="text-sm text-gray-500 mt-1">This month</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">Active Sources</div>
            <div className="text-3xl font-bold mt-2">18</div>
            <div className="text-sm text-gray-500 mt-1">RSS & APIs</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">Newsletters Sent</div>
            <div className="text-3xl font-bold mt-2">12</div>
            <div className="text-sm text-gray-500 mt-1">This month</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">Open Rate</div>
            <div className="text-3xl font-bold mt-2">45.3%</div>
            <div className="text-sm text-green-600 mt-1">↑ 5.2% from last month</div>
          </Card>
        </div>

        {/* Topics Monitoring */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Topics Monitoring</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['AI & Machine Learning', 'Content Marketing', 'SaaS Business'].map((topic) => (
              <Card key={topic} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{topic}</h3>
                    <p className="text-sm text-gray-600 mt-1">24 new items today</p>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Curated Content */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recently Curated</h2>
            <Link href="/curated">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>

          <Card>
            <div className="divide-y">
              {curatedItems.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="flex gap-4 mt-1 text-sm text-gray-600">
                        <span>{item.source}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">Summarize</Button>
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
