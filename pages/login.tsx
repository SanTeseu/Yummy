import { supabase } from '../lib/supabaseClient'

export default function Login() {
  async function login() {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-[420px]">
        <h1 className="text-2xl font-bold mb-4">Entrar — Yummy</h1>
        <p className="mb-6 text-sm text-gray-600">Faça login com sua conta Google para acessar o sistema.</p>
        <button onClick={login} className="w-full p-3 bg-blue-600 text-white rounded">Entrar com Google</button>
      </div>
    </div>
  )
}
