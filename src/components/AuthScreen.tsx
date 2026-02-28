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
    setError(''); setSuccess('')
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
    <div className="min-h-screen bg-[#0d0d1a] flex overflow-hidden">

      {/* ===== Panneau gauche — branding ===== */}
      <div className="hidden md:flex flex-col justify-between w-[46%] relative overflow-hidden p-12">

        {/* Fond dégradé */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-[#0d0d1a] to-violet-950" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(99,102,241,0.25), transparent 65%), radial-gradient(ellipse at 80% 80%, rgba(124,58,237,0.18), transparent 60%)' }}
        />

        {/* Grain texture */}
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '128px' }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Élémentaire</h1>
        </div>

        {/* Texte central */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <p className="text-4xl font-light text-white leading-tight tracking-tight">
              Bienvenue.
            </p>
            <p className="text-4xl font-light leading-tight tracking-tight"
              style={{ color: 'rgba(165,180,252,0.65)' }}>
              Un pas suffit<br/>pour commencer.
            </p>
          </div>
          <p className="text-sm text-white/35 font-light leading-relaxed max-w-xs">
            Une app pensée pour ceux qui ont du mal à démarrer. Sans jugement. Sans pression.
          </p>
        </div>

        {/* Points bas */}
        <div className="relative z-10 space-y-3">
          {[
            'Décompose chaque tâche en micro-étapes',
            'Un timer bougie pour rester dans le flux',
            'L\'élan, pas le streak',
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/60 flex-shrink-0 mt-1.5" />
              <p className="text-xs text-white/40 font-light">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Séparateur vertical */}
      <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-white/8 to-transparent self-stretch" />

      {/* ===== Panneau droit — formulaire ===== */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 md:px-16 relative">

        {/* Orb mobile uniquement */}
        <div className="md:hidden pointer-events-none fixed inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full animate-pulse-glow"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent)' }} />
        </div>

        <div className="relative z-10 w-full max-w-sm animate-fade-up">

          {/* Header mobile */}
          <div className="md:hidden text-center mb-10">
            <h1 className="text-3xl font-semibold text-white">Élémentaire</h1>
            <p className="text-white/35 text-sm mt-2">Un pas. Puis le suivant.</p>
          </div>

          {/* Titre section */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-white">
              {mode === 'login' ? 'Connexion' : 'Créer un compte'}
            </h2>
            <p className="text-sm text-white/35 mt-2">
              {mode === 'login'
                ? <>Pas encore de compte ?{' '}
                    <button onClick={() => { setMode('signup'); setError(''); setSuccess('') }}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors">
                      S'inscrire
                    </button>
                  </>
                : <>Déjà un compte ?{' '}
                    <button onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors">
                      Se connecter
                    </button>
                  </>
              }
            </p>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-white/6 border border-white/12 text-white/75 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all text-sm font-medium mb-8"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" className="flex-shrink-0">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>

          {/* Séparateur */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-white/20 font-medium">ou par email</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Champs */}
          <div className="space-y-5 mb-8">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="w-full bg-transparent border-b border-white/15 pb-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-400/60 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest">
                Mot de passe
              </label>
              <div className="relative border-b border-white/15 focus-within:border-indigo-400/60 transition-colors">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="8 caractères minimum"
                  className="w-full bg-transparent pb-3 text-sm text-white placeholder:text-white/20 outline-none pr-8"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-3 text-white/20 hover:text-white/50 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          {/* Erreur / succès */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-400/20">
              <p className="text-xs text-rose-300">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
              <p className="text-xs text-emerald-300">{success}</p>
            </div>
          )}

          {/* Bouton submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-900/40"
          >
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>

          <p className="text-center text-white/15 text-xs mt-8">
            Tes données ne sont partagées avec personne.
          </p>
        </div>
      </div>
    </div>
  )
}