import { Button } from '@repo/ui';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl font-bold mb-6">AI Localization Hub</h1>
        <p className="text-xl text-gray-600 mb-8">
          Translate and adapt content for global markets.
          <br />
          Context-aware translation with cultural sensitivity.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg">Start Translating</Button>
          </Link>
          <Link href="/languages">
            <Button variant="outline" size="lg">View Languages</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
