import React, { useState } from 'react'
import { X, ShieldCheck, Send, CheckCircle2, AlertCircle, Bot, Key, LogOut } from 'lucide-react'
import { requestCode, verifyCode, API_BASE_URL } from '../api/axiosClient'
import { useTranslation } from '../hooks/useTranslation'

export const AuthModal = ({ isOpen, onClose, user, onLoginSuccess, onLogout }) => {
  const { t } = useTranslation()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [step, setStep] = useState('phone') // 'phone' | 'code' | 'token'
  const [customToken, setCustomToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  // 1-qadam: SMS / Telegram orqali kod so'rash
  const handleRequestCode = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const res = await requestCode(phone.trim(), 'login')
      setMessage(res?.detail?.message || t('authModal.codeSent'))
      setStep('code')
    } catch (err) {
      const errDetail = err.response?.data?.detail
      if (typeof errDetail === 'object' && errDetail?.error) {
        setError(errDetail.error)
      } else {
        setError(errDetail || t('authModal.codeSendError'))
      }
    } finally {
      setLoading(false)
    }
  }

  // 2-qadam: Kodni tasdiqlash
  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const res = await verifyCode(phone.trim(), code.trim(), name.trim())
      if (res?.token) {
        localStorage.setItem('musicuz_token', res.token)
        localStorage.setItem('musicuz_user', JSON.stringify(res.user || { phone }))
        onLoginSuccess(res.user || { phone })
        setMessage(t('authModal.loginSuccess'))
        setTimeout(() => {
          onClose()
        }, 1000)
      } else {
        setError(t('authModal.tokenNotReceived'))
      }
    } catch (err) {
      setError(err.response?.data?.detail || t('authModal.invalidCode'))
    } finally {
      setLoading(false)
    }
  }

  // To'g'ridan-to'g'ri token kiritish (Admin / Test rejimi)
  const handleSaveToken = (e) => {
    e.preventDefault()
    if (!customToken.trim()) return

    localStorage.setItem('musicuz_token', customToken.trim())
    localStorage.setItem('musicuz_user', JSON.stringify({ name: 'Admin User' }))
    onLoginSuccess({ name: 'Admin User' })
    setMessage(t('authModal.tokenSaved'))
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tepa sarlavha */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {user ? t('authModal.profileTitle') : t('authModal.loginTitle')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Backend: <span className="font-mono text-indigo-500">{API_BASE_URL.replace('https://', '')}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Xabarlar */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Agar foydalanuvchi tizimga kirgan bo'lsa */}
        {user ? (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl mb-2">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {user.name || user.phone || t('authModal.guestUser')}
              </h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                {t('authModal.backendConnected')}
              </p>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold text-xs hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('authModal.logout')}</span>
            </button>
          </div>
        ) : (
          /* Kirish formasi */
          <div className="mt-5 space-y-4">
            {step === 'phone' && (
              <form onSubmit={handleRequestCode} className="space-y-3">
                <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-900/40 flex items-start gap-2.5 text-xs text-indigo-800 dark:text-indigo-300">
                  <Bot className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>
                    {t('authModal.botHint')}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    {t('authModal.phoneNumber')}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+998901234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !phone}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? t('authModal.sending') : t('authModal.requestCode')}</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('token')}
                    className="text-xs text-slate-400 hover:text-indigo-500 flex items-center justify-center gap-1 mx-auto"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{t('authModal.haveToken')}</span>
                  </button>
                </div>
              </form>
            )}

            {step === 'code' && (
              <form onSubmit={handleVerify} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    {t('authModal.yourName')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('authModal.namePlaceholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    {t('authModal.verificationCode')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('authModal.codePlaceholder')}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm tracking-widest text-center font-mono font-bold focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  >
                    {t('authModal.back')}
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !code}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md"
                  >
                    {loading ? t('authModal.verifying') : t('authModal.verify')}
                  </button>
                </div>
              </form>
            )}

            {step === 'token' && (
              <form onSubmit={handleSaveToken} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    {t('authModal.bearerToken')}
                  </label>
                  <textarea
                    rows={3}
                    placeholder="eyJhbGciOi..."
                    value={customToken}
                    onChange={(e) => setCustomToken(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  >
                    {t('authModal.back')}
                  </button>
                  <button
                    type="submit"
                    disabled={!customToken.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                  >
                    {t('authModal.saveToken')}
                  </button>
                </div>
              </form>
            )}

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400">
              💡 <strong>{t('authModal.guestMode')}</strong> {t('authModal.guestModeDesc')}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default AuthModal
