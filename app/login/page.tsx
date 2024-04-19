import { Suspense } from 'react';
import LoginForm from './form';

export default function Login() {
  return (
    <div className="h-full flex flex-col w-full px-2 md:px-8 items-center justify-center gap-2">
      <div className="max-w-sm">
        <h1 className="text-center text-6xl font-bold mb-1">Genie</h1>
        <p className="text-center text-7 text-gray-500 mb-4">
          Welcome to Genie, AI-powered Test Generation.
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
