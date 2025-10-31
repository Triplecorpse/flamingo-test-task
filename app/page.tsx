import Image from 'next/image';
import HealthCheck from './components/HealthCheck';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <div className="mx-auto w-32 h-32 relative">
          <Image src="/logo512.png" alt="logo" width={128} height={128} priority />
        </div>
        <p className="mt-4 text-gray-700">This page is a React Server Component.</p>
        <p className="mt-1">
          Try the API: <a href="/api/hello" className="text-sky-600 hover:underline">GET /api/hello</a>
        </p>
        <p className="mt-1 text-sm text-gray-500">Edit <code>app/page.tsx</code> and save to reload.</p>
      </div>

      <div className="w-full">
        <HealthCheck />
      </div>
    </main>
  );
}


