import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import type { User } from '@supabase/supabase-js'
import { Zap, CheckCircle, Timer, Trophy, LogOut, Trash2, Bell, BellOff, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react'

type Props = { user: User; onSyncProfile: () => void }

const DELAYS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 heure', value: 60 },
  { label: '2 heures', value: 120 },
]

export default function ProfilePage({ user, onSyncProfile }: Props) {
  const { elan, history, sessionCount, tasks, resetAll, notifEnabled, notifDelay, checkInTime, setNotifEnabled, setNotifDelay, setCheckInTime } = useStore()

  const totalDone = tasks.filter((t) => t.done).length
  const bestDay = [...history].sort((a, b) => b.elan - a.elan)[0]

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)
  const [showAccount, setShowAccount] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMsg, setPwMsg] = useState('')
  const [pwError, setPwError] = useState('')

  const [newEmail, setNewEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailMsg, setEmailMsg] = useState('')
  const [emailError, setEmailError] = useState('')

  const handleLogout = async () => {
    await supabase.auth.signOut()
    resetAll()
  }

  const handlePasswordChange = async () => {
    if (newPassword.length < 8) return setPwError('8 caractères minimum.')
    setPwLoading(true)
    setPwError('')
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) setPwError(error.message)
    else { setPwMsg('Mot de passe mis à jour.'); setNewPassword('') }
    setPwLoading(false)
  }

  const handleEmailChange = async () => {
    if (!newEmail.includes('@')) return setEmailError('Email invalide.')
    setEmailLoading(true)
    setEmailError('')
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    if (error) setEmailError(error.message)
    else { setEmailMsg('Vérifie ton nouvel email pour confirmer.'); setNewEmail('') }
    setEmailLoading(false)
  }

  const handleDeleteAccount = async () => {
    await supabase.auth.signOut()
    resetAll()
  }

  const handleNotifToggle = async () => {
    if (!notifEnabled) {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return
    }
    setNotifEnabled(!notifEnabled)
    onSyncProfile()
  }

  return (
    <div className="w-full pb-16 animate-fade-up">

      {/* Header */}
      <div className="w-full pt-8 pb-6 border-b border-white/8 mb-8">
        <h1 className="text-3xl font-semibold text-white">Profil</h1>
        <p className="text-sm text-white/35 mt-1.5">{user.email}</p>
      </div>

      {/* Stats clés */}
      <div className="mb-10">
        <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Ton élan</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-amber-500/10 border border-amber-400/20 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-amber-400" />
              <span className="text-xs text-amber-300/60 font-medium uppercase tracking-wider">Élan total</span>
            </div>
            <p className="text-4xl font-bold text-amber-300 tabular-nums">{elan}</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-emerald-400" />
              <span className="text-xs text-emerald-300/60 font-medium uppercase tracking-wider">Terminées</span>
            </div>
            <p className="text-4xl font-bold text-emerald-300 tabular-nums">{totalDone}</p>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Timer size={14} className="text-indigo-400" />
              <span className="text-xs text-indigo-300/60 font-medium uppercase tracking-wider">Sessions</span>
            </div>
            <p className="text-4xl font-bold text-indigo-300 tabular-nums">{sessionCount}</p>
          </div>
          <div className="bg-violet-500/10 border border-violet-400/20 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Trophy size={14} className="text-violet-400" />
              <span className="text-xs text-violet-300/60 font-medium uppercase tracking-wider">Meilleur jour</span>
            </div>
            <p className="text-4xl font-bold text-violet-300 tabular-nums">{bestDay?.elan ?? 0}</p>
            {bestDay && (
              <p className="text-xs text-violet-300/35">
                {new Date(bestDay.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Préférences */}
      <div className="mb-3">
        <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Paramètres</p>
        <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowPrefs(!showPrefs)}
            className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/4 transition-colors"
          >
            <div className="flex items-center gap-3">
              {notifEnabled
                ? <Bell size={16} className="text-amber-400" />
                : <BellOff size={16} className="text-white/35" />}
              <div className="text-left">
                <p className="text-sm font-medium text-white">Notifications</p>
                <p className="text-xs text-white/35 mt-0.5">
                  {notifEnabled ? `Check-in à ${checkInTime}` : 'Désactivées'}
                </p>
              </div>
            </div>
            {showPrefs
              ? <ChevronUp size={15} className="text-white/25" />
              : <ChevronDown size={15} className="text-white/25" />}
          </button>

          {showPrefs && (
            <div className="px-6 pb-6 space-y-6 border-t border-white/8 pt-5">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Activer les notifications</p>
                  <p className="text-xs text-white/35 mt-0.5">Rappels doux et check-in matinal</p>
                </div>
                <button
                  onClick={handleNotifToggle}
                  className={`w-12 h-6 rounded-full border transition-all relative flex-shrink-0 ${notifEnabled
                    ? 'bg-amber-500/30 border-amber-500/50'
                    : 'bg-white/8 border-white/15'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${notifEnabled
                    ? 'left-6 bg-amber-400'
                    : 'left-0.5 bg-white/40'}`}
                  />
                </button>
              </div>

              {notifEnabled && (
                <>
                  <div className="space-y-2.5">
                    <p className="text-xs text-white/45 font-medium">Heure du check-in matinal</p>
                    <input
                      type="time"
                      value={checkInTime}
                      onChange={(e) => { setCheckInTime(e.target.value); onSyncProfile() }}
                      className="w-full bg-white/6 border border-white/15 rounded-xl px-4 py-3 text-sm text-white/80 outline-none focus:border-indigo-400/50 transition-colors [color-scheme:dark]"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-xs text-white/45 font-medium">Rappel si inactif depuis</p>
                    <div className="grid grid-cols-2 gap-2">
                      {DELAYS.map((d) => (
                        <button
                          key={d.value}
                          onClick={() => { setNotifDelay(d.value); onSyncProfile() }}
                          className={`text-sm px-4 py-3 rounded-xl border transition-all
                            ${notifDelay === d.value
                              ? 'border-amber-500/40 text-amber-300 bg-amber-500/10'
                              : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/65'}`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Compte */}
      <div className="mb-8">
        <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowAccount(!showAccount)}
            className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/4 transition-colors"
          >
            <div className="text-left">
              <p className="text-sm font-medium text-white">Modifier le compte</p>
              <p className="text-xs text-white/35 mt-0.5">Email, mot de passe</p>
            </div>
            {showAccount
              ? <ChevronUp size={15} className="text-white/25" />
              : <ChevronDown size={15} className="text-white/25" />}
          </button>

          {showAccount && (
            <div className="px-6 pb-6 space-y-6 border-t border-white/8 pt-5">

              {/* Changer email */}
              <div className="space-y-3">
                <p className="text-xs text-white/45 font-medium uppercase tracking-wider">Nouvel email</p>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => { setNewEmail(e.target.value); setEmailError(''); setEmailMsg('') }}
                  placeholder="nouvel@email.com"
                  className="w-full bg-white/6 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-indigo-400/50 transition-colors"
                />
                {emailError && <p className="text-xs text-rose-400">{emailError}</p>}
                {emailMsg && <p className="text-xs text-emerald-400">{emailMsg}</p>}
                <button
                  onClick={handleEmailChange}
                  disabled={emailLoading || !newEmail}
                  className="w-full py-3 rounded-xl bg-indigo-600/25 border border-indigo-400/25 text-indigo-300 text-sm hover:bg-indigo-600/40 disabled:opacity-40 transition-all font-medium"
                >
                  {emailLoading ? 'Envoi...' : "Mettre à jour l'email"}
                </button>
              </div>

              <div className="h-px bg-white/8" />

              {/* Changer mot de passe */}
              <div className="space-y-3">
                <p className="text-xs text-white/45 font-medium uppercase tracking-wider">Nouveau mot de passe</p>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setPwError(''); setPwMsg('') }}
                    placeholder="8 caractères minimum"
                    className="w-full bg-white/6 border border-white/15 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-white/25 outline-none focus:border-indigo-400/50 transition-colors"
                  />
                  <button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {pwError && <p className="text-xs text-rose-400">{pwError}</p>}
                {pwMsg && <p className="text-xs text-emerald-400">{pwMsg}</p>}
                <button
                  onClick={handlePasswordChange}
                  disabled={pwLoading || !newPassword}
                  className="w-full py-3 rounded-xl bg-indigo-600/25 border border-indigo-400/25 text-indigo-300 text-sm hover:bg-indigo-600/40 disabled:opacity-40 transition-all font-medium"
                >
                  {pwLoading ? 'Mise à jour...' : 'Changer le mot de passe'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions compte */}
      <div className="space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/4 border border-white/10 text-white/55 hover:text-white hover:bg-white/8 transition-all text-sm font-medium"
        >
          <LogOut size={16} />
          Se déconnecter
        </button>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-rose-500/15 text-rose-400/50 hover:text-rose-400 hover:bg-rose-500/8 hover:border-rose-500/30 transition-all text-sm"
          >
            <Trash2 size={15} />
            Supprimer mon compte
          </button>
        ) : (
          <div className="bg-rose-500/8 border border-rose-400/20 rounded-2xl p-5 space-y-4">
            <div className="text-center space-y-1">
              <p className="text-sm text-white/70 font-medium">Tu es sûr ?</p>
              <p className="text-xs text-white/35 leading-relaxed">
                Toutes tes données seront perdues.<br />Cette action est irréversible.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-white/8 text-white/50 hover:text-white text-sm transition-all font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-3 rounded-xl bg-rose-600/25 border border-rose-400/25 text-rose-300 hover:bg-rose-600/40 text-sm transition-all font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}