import AuthButton from './components/AuthButton';
import AuthCheck from './components/AuthCheck';
import TodoInput from './components/TodoInput';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <AuthCheck />
      <div className="w-full max-w-xl mx-auto grid gap-3">
        <AuthButton />
        <TodoInput />
      </div>
    </main>
  );
}


