import { Button } from '@repo/ui';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl font-bold mb-6">AI Copywriter</h1>
        <p className="text-xl text-gray-600 mb-8">
          Generate high-converting marketing copy in seconds.
          <br />
          Ads, emails, product descriptions, and more.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg">Start Writing</Button>
          </Link>
          <Link href="/frameworks">
            <Button variant="outline" size="lg">See Frameworks</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
