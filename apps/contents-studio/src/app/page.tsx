import { Button } from '@repo/ui';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-center">
        <h1 className="text-6xl font-bold mb-6">
          AI Contents Studio
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Create text, images, audio, and video content with AI.
          <br />
          All-in-one content generation platform.
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg">View Pricing</Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Text Generation</h3>
            <p className="text-gray-600">AI-powered content writing with brand voice</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Image Generation</h3>
            <p className="text-gray-600">Create stunning visuals with AI</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Audio Generation</h3>
            <p className="text-gray-600">Natural voice synthesis and music</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Video Generation</h3>
            <p className="text-gray-600">Automated video creation</p>
          </div>
        </div>
      </div>
    </main>
  );
}
