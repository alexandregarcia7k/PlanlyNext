import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white text-gray-900">
      <div className="max-w-md w-full px-6 py-10 rounded-xl shadow-lg bg-white/80 border border-gray-200">
        <h1 className="text-3xl font-bold mb-4 text-center">Planly</h1>
        <p className="mb-8 text-center text-lg text-gray-600">
          Organize suas notas e tarefas de forma simples e segura.
          <br />
          Crie uma conta ou faça login para começar!
        </p>
        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center font-medium transition"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="bg-gray-100 text-blue-700 py-2 px-4 rounded hover:bg-blue-200 text-center font-medium border border-blue-200 transition"
          >
            Criar conta
          </Link>
        </div>
      </div>
      <footer className="mt-10 text-xs text-gray-400 text-center">
        &copy; {new Date().getFullYear()} Planly. Todos os direitos reservados.
      </footer>
    </main>
  );
}
