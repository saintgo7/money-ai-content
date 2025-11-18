import { Button } from '@repo/ui';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl font-bold mb-6">AI Video Generator</h1>
        <p className="text-xl text-gray-600 mb-8">
          Transform text scripts into professional videos automatically.
          <br />
          Perfect for YouTube, TikTok, Reels, and Shorts.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg">Start Creating</Button>
          </Link>
          <Link href="/templates">
            <Button variant="outline" size="lg">Browse Templates</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
