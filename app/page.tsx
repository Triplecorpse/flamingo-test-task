import AuthButtons from './components/AuthButtons';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <div className="w-full max-w-xl mx-auto grid gap-3">
        <AuthButtons />
      </div>
    </main>
  );
}


