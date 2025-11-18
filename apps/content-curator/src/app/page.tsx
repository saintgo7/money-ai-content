import { Button } from '@repo/ui';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl font-bold mb-6">AI Content Curator</h1>
        <p className="text-xl text-gray-600 mb-8">
          Automatically discover, analyze, and curate content.
          <br />
          Generate newsletters with AI-powered insights.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg">Start Curating</Button>
          </Link>
          <Link href="/sources">
            <Button variant="outline" size="lg">Add Sources</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
