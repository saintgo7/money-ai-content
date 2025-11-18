'use client';

import { Button, Card } from '@repo/ui';
import Link from 'next/link';

export default function DashboardPage() {
  const recentVideos = [
    { id: 1, title: 'Product Launch Video', format: 'YouTube', duration: '2:45', status: 'Completed' },
    { id: 2, title: 'Tutorial: Getting Started', format: 'TikTok', duration: '0:45', status: 'Processing' },
    { id: 3, title: 'Brand Story', format: 'Instagram Reels', duration: '0:30', status: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">AI Video Generator</h1>
            <div className="flex gap-4">
              <Link href="/templates">
                <Button variant="outline">Templates</Button>
              </Link>
              <Link href="/create">
                <Button>+ Create Video</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-sm text-gray-600">Videos Created</div>
            <div className="text-3xl font-bold mt-2">28</div>
            <div className="text-sm text-gray-500 mt-1">This month</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">Total Views</div>
            <div className="text-3xl font-bold mt-2">45.2K</div>
            <div className="text-sm text-green-600 mt-1">↑ 23% from last month</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">Watch Time</div>
            <div className="text-3xl font-bold mt-2">12.5h</div>
            <div className="text-sm text-green-600 mt-1">↑ 15% from last month</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">Engagement</div>
            <div className="text-3xl font-bold mt-2">7.2%</div>
            <div className="text-sm text-gray-500 mt-1">Average rate</div>
          </Card>
        </div>

        {/* Quick Templates */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Start Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/create?template=listicle">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-4xl mb-2">📝</div>
                <h3 className="font-semibold">Listicle</h3>
                <p className="text-sm text-gray-600 mt-1">Top 5, Best 10, etc.</p>
              </Card>
            </Link>
            <Link href="/create?template=tutorial">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-4xl mb-2">🎓</div>
                <h3 className="font-semibold">Tutorial</h3>
                <p className="text-sm text-gray-600 mt-1">Step-by-step guides</p>
              </Card>
            </Link>
            <Link href="/create?template=story">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-4xl mb-2">📖</div>
                <h3 className="font-semibold">Story</h3>
                <p className="text-sm text-gray-600 mt-1">Narrative content</p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Videos */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Videos</h2>
          <Card>
            <div className="divide-y">
              {recentVideos.map((video) => (
                <div key={video.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{video.title}</h3>
                      <div className="flex gap-4 mt-1 text-sm text-gray-600">
                        <span>{video.format}</span>
                        <span>•</span>
                        <span>{video.duration}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      video.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {video.status}
                    </span>
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
