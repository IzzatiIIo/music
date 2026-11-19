import React, { useState, useRef, useEffect } from 'react'
import { Music, Sun, Moon, Plus, Heart, Search, X, User, Globe, Check } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

export const Navbar = ({
  searchQuery,
  setSearchQuery,
  onlyLiked,
  setOnlyLiked,
  likedCount,
  isDark,
  toggleTheme,
  onOpenAddModal,
  onOpenAuthModal,
  user,
}) => {
  const { lang, setLang, t } = useTranslation()
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const langMenuRef = useRef(null)

  // Tashqariga bosilganda til menyusini yopish
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-white/75 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* Logo va Brend */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setOnlyLiked(false)}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                MusicUz
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
                PRO
              </span>
            </div>
          </div>

          {/* Qidiruv qutisi */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('navbar.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 sm:py-2.5 text-sm rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* O'ng tomon amallar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Yoqqanlar filtri tugmasi */}
            <button
              onClick={() => setOnlyLiked(!onlyLiked)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                onlyLiked
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title={t('navbar.liked')}
            >
              <Heart className={`w-4 h-4 ${onlyLiked ? 'fill-white' : 'text-rose-500'}`} />
              <span className="hidden sm:inline">{t('navbar.liked')}</span>
              {likedCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 text-[11px] rounded-full font-bold ${
                    onlyLiked ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                  }`}
                >
                  {likedCount}
                </span>
              )}
            </button>

            {/* Musiqa qo'shish modal tugmasi */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/25 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t('navbar.add')}</span>
            </button>

            {/* Tilni almashtirish dropdown (UZ / EN) */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all text-xs font-bold"
                title={t('navbar.changeLanguage')}
                aria-label={t('navbar.changeLanguage')}
              >
                <Globe className="w-4 h-4 text-indigo-500" />
                <span className="uppercase tracking-wider">{lang}</span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-fade-in text-xs font-semibold">
                  <button
                    onClick={() => {
                      setLang('uz')
                      setIsLangMenuOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      lang === 'uz' ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">🇺🇿</span>
                      <span>O'zbekcha</span>
                    </span>
                    {lang === 'uz' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => {
                      setLang('en')
                      setIsLangMenuOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      lang === 'en' ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">🇬🇧</span>
                      <span>English</span>
                    </span>
                    {lang === 'en' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Dark / Light rejim tugmasi */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
              title={isDark ? t('navbar.switchToLight') : t('navbar.switchToDark')}
              aria-label={t('navbar.toggleTheme')}
            >
              {isDark ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              )}
            </button>

            {/* Profil / Kirish tugmasi */}
            <button
              onClick={onOpenAuthModal}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center"
              title={t('navbar.profileAndSettings')}
            >
              {user?.name ? (
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold">
                  {user.name[0].toUpperCase()}
                </span>
              ) : (
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>

        </div>

        {/* Mobil qidiruv qatori */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('navbar.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  )
}

export default Navbar
