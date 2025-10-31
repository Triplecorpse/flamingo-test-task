import Image from 'next/image';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
      <Image src="/logo512.png" alt="logo" width={128} height={128} priority />
      <p style={{ marginTop: 16 }}>This page is a React Server Component.</p>
      <p>
        Try the API: <a href="/api/hello" style={{ color: '#61dafb' }}>GET /api/hello</a>
      </p>
      <p>
        Edit <code>app/page.tsx</code> and save to reload.
      </p>
    </main>
  );
}


