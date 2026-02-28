import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Eye, EyeOff } from 'lucide-react'

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    if (!email || !password) return setError('Remplis tous les champs.')
    if (password.length < 8) return setError('Le mot de passe doit faire au moins 8 caractères.')
    setLoading(true)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setSuccess('Vérifie tes emails pour confirmer ton compte.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Email ou mot de passe incorrect.')
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="animate-pulse-glow absolute top-[-15%] left-[5%] w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }}
        />
        <div
          className="animate-pulse-glow absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)', animationDelay: '2s' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm animate-welcome">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Élémentaire</h1>
          <p className="text-white/40 text-sm mt-2">Un pas. Puis le suivant.</p>
        </div>

        {/* Card */}
        <div className="bg-white/6 border border-white/12 rounded-2xl p-6 space-y-5">

          {/* Tabs */}
          <div className="flex rounded-xl bg-white/5 p-1">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess('') }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${mode === m ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/40 hover:text-white/70'}`}
              >
                {m === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white/8 border border-white/15 text-white/80 hover:bg-white/14 hover:text-white transition-all text-sm font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>

          {/* Separateur */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/25">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs text-white/45 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              className="w-full bg-white/6 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-indigo-400/50 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs text-white/45 font-medium">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="8 caractères minimum"
                className="w-full bg-white/6 border border-white/15 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder:text-white/25 outline-none focus:border-indigo-400/50 transition-colors"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors p-1"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-400/25 rounded-xl px-4 py-3">
              <p className="text-xs text-rose-300">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-400/25 rounded-xl px-4 py-3">
              <p className="text-xs text-emerald-300">{success}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm transition-all mt-1"
          >
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Tes données ne sont partagées avec personne.
        </p>
      </div>
    </div>
  )
}