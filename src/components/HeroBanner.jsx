import React from 'react'
import { Play, Pause, Flame, Sparkles } from 'lucide-react'
import { getCoverImage } from '../utils/formatters'
import { API_BASE_URL } from '../api/axiosClient'
import { useTranslation } from '../hooks/useTranslation'

export const HeroBanner = ({ featuredSong, isPlaying, currentSong, onPlay }) => {
  const { t } = useTranslation()
  if (!featuredSong) return null

  const isCurrentFeatured = currentSong && currentSong.id === featuredSong.id
  const isPlayingThis = isCurrentFeatured && isPlaying
  const coverUrl = getCoverImage(featuredSong.cover_url, featuredSong.id, API_BASE_URL)

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white shadow-2xl p-6 sm:p-10 mb-8 border border-white/10">
      
      {/* Orqa fon nur effekti */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        
        {/* Chap qism: Matn va tavsif */}
        <div className="flex-1 text-center md:text-left space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-amber-300">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{t('hero.topRecommendation')}</span>
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {featuredSong.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-medium">
            {t('hero.artistLabel')} <span className="text-white font-bold">{featuredSong.artist}</span> •{' '}
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/30">
              {featuredSong.genre || 'Pop'}
            </span>
          </p>

          <p className="text-xs sm:text-sm text-slate-300/80 max-w-xl line-clamp-2">
            {t('hero.description')}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
            <button
              onClick={() => onPlay(featuredSong)}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold hover:bg-slate-100 hover:scale-105 active:scale-95 shadow-xl transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                {isPlayingThis ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </div>
              <span>{isPlayingThis ? t('hero.pause') : t('hero.listenNow')}</span>
            </button>

            {isPlayingThis && (
              <div className="flex items-end gap-1 h-6 px-3 py-1 bg-white/10 rounded-xl">
                <span className="w-1 bg-emerald-400 rounded-full animate-wave-1" />
                <span className="w-1 bg-emerald-400 rounded-full animate-wave-2" />
                <span className="w-1 bg-emerald-400 rounded-full animate-wave-3" />
                <span className="w-1 bg-emerald-400 rounded-full animate-wave-4" />
                <span className="text-xs text-emerald-300 font-medium ml-2">{t('hero.nowPlaying')}</span>
              </div>
            )}
          </div>
        </div>

        {/* O'ng qism: Muqova rasmi */}
        <div className="relative group shrink-0">
          <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20 transition-transform duration-500 group-hover:scale-105">
            <img
              src={coverUrl}
              alt={featuredSong.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <span className="text-xs font-semibold text-white">{t('app.exclusive')}</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default HeroBanner
