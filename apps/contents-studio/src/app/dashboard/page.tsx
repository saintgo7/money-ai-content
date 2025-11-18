'use client';

import { useState } from 'react';
import { Button, Card } from '@repo/ui';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats] = useState({
    contentsGenerated: 45,
    totalViews: 12500,
    engagement: 8.5,
    monthlyLimit: 100,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">AI Contents Studio</h1>
            <div className="flex gap-4">
              <Link href="/brand">
                <Button variant="outline">Brand Settings</Button>
              </Link>
              <Link href="/generate">
                <Button>+ New Content</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-sm text-gray-600">Contents Generated</div>
            <div className="text-3xl font-bold mt-2">{stats.contentsGenerated}</div>
            <div className="text-sm text-gray-500 mt-1">
              of {stats.monthlyLimit} this month
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm text-gray-600">Total Views</div>
            <div className="text-3xl font-bold mt-2">{stats.totalViews.toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-1">↑ 12% from last month</div>
          </Card>

          <Card className="p-6">
            <div className="text-sm text-gray-600">Engagement Rate</div>
            <div className="text-3xl font-bold mt-2">{stats.engagement}%</div>
            <div className="text-sm text-green-600 mt-1">↑ 2.3% from last month</div>
          </Card>

          <Card className="p-6">
            <div className="text-sm text-gray-600">Brand Profiles</div>
            <div className="text-3xl font-bold mt-2">3</div>
            <div className="text-sm text-gray-500 mt-1">Active profiles</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Create</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/generate?type=social">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-4xl mb-2">📱</div>
                <h3 className="font-semibold">Social Post</h3>
                <p className="text-sm text-gray-600 mt-1">Instagram, Twitter, LinkedIn</p>
              </Card>
            </Link>

            <Link href="/generate?type=blog">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-4xl mb-2">📝</div>
                <h3 className="font-semibold">Blog Post</h3>
                <p className="text-sm text-gray-600 mt-1">SEO-optimized articles</p>
              </Card>
            </Link>

            <Link href="/generate?type=video">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-4xl mb-2">🎬</div>
                <h3 className="font-semibold">Video Script</h3>
                <p className="text-sm text-gray-600 mt-1">YouTube, TikTok, Reels</p>
              </Card>
            </Link>

            <Link href="/generate?type=email">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-4xl mb-2">✉️</div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm text-gray-600 mt-1">Newsletters, campaigns</p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Contents */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Contents</h2>
            <Link href="/contents">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>

          <Card>
            <div className="divide-y">
              {[
                {
                  id: 1,
                  title: 'Instagram Post: Product Launch',
                  type: 'Social Post',
                  platform: 'Instagram',
                  date: '2 hours ago',
                  status: 'Published',
                },
                {
                  id: 2,
                  title: 'Blog: AI Content Generation Guide',
                  type: 'Blog Post',
                  platform: 'Website',
                  date: '5 hours ago',
                  status: 'Draft',
                },
                {
                  id: 3,
                  title: 'LinkedIn: Thought Leadership',
                  type: 'Social Post',
                  platform: 'LinkedIn',
                  date: '1 day ago',
                  status: 'Published',
                },
              ].map((content) => (
                <div key={content.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">{content.title}</h3>
                      <div className="flex gap-4 mt-1 text-sm text-gray-600">
                        <span>{content.type}</span>
                        <span>•</span>
                        <span>{content.platform}</span>
                        <span>•</span>
                        <span>{content.date}</span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        content.status === 'Published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {content.status}
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
