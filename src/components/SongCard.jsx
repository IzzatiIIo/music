import React from 'react'
import { Play, Pause, Heart, MessageCircle, Headphones, Sparkles, Trash2 } from 'lucide-react'
import { getCoverImage } from '../utils/formatters'
import { API_BASE_URL } from '../api/axiosClient'
import { useTranslation } from '../hooks/useTranslation'

export const SongCard = ({
  song,
  currentSong,
  isPlaying,
  onPlay,
  isLiked,
  likesCount,
  onToggleLike,
  commentsCount,
  onOpenComments,
  onRemoveCustomSong,
}) => {
  const { t } = useTranslation()
  const isCurrent = currentSong && currentSong.id === song.id
  const isPlayingNow = isCurrent && isPlaying
  const liked = isLiked(song.id)
  const coverUrl = getCoverImage(song.cover_url, song.id, API_BASE_URL)

  return (
    <div
      className={`group relative flex flex-col rounded-2xl p-3.5 transition-all duration-300 border ${
        isCurrent
          ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
          : 'bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Rasm va Play qoplamasi */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-200 dark:bg-slate-700">
        <img
          src={coverUrl}
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Hoverda yoki Ijroda Play tugmasi */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-200 ${
            isPlayingNow ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <button
            onClick={() => onPlay(song)}
            className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl transform active:scale-90 transition-all hover:scale-110"
            title={isPlayingNow ? t('songCard.pause') : t('songCard.play')}
          >
            {isPlayingNow ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Agar ayni damda ijro etilayotgan bo'lsa - burchakda animatsiyali to'lqin */}
        {isPlayingNow && (
          <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg flex items-end gap-0.5">
            <span className="w-1 bg-emerald-400 rounded-full animate-wave-1" />
            <span className="w-1 bg-emerald-400 rounded-full animate-wave-2" />
            <span className="w-1 bg-emerald-400 rounded-full animate-wave-3" />
          </div>
        )}

        {/* Foydalanuvchi qo'shgan musiqa belgisi */}
        {song.isCustom && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>{t('songCard.yours')}</span>
          </div>
        )}

        {/* Janr nishoni */}
        {song.genre && !song.isCustom && (
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
            {song.genre}
          </div>
        )}
      </div>

      {/* Qo'shiq ma'lumotlari */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onPlay(song)}
            className={`font-bold text-sm sm:text-base line-clamp-1 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
              isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-slate-100'
            }`}
            title={song.title}
          >
            {song.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-medium mt-0.5">
            {song.artist}
          </p>
        </div>

        {/* Pastki qator: Eshitishlar soni, Like va Kommentariyalar */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
          
          {/* Eshitishlar soni */}
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400" title={t('songCard.playsCount')}>
            <Headphones className="w-3.5 h-3.5" />
            <span className="font-medium">{song.plays || 0}</span>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Kommentariya tugmasi */}
            <button
              onClick={() => onOpenComments(song)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title={t('songCard.comments')}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="font-semibold text-[11px]">{commentsCount}</span>
            </button>

            {/* Like tugmasi */}
            <button
              onClick={() => onToggleLike(song)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all active:scale-125 ${
                liked
                  ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                  : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title={liked ? t('songCard.unlike') : t('songCard.like')}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  liked ? 'fill-rose-500 text-rose-500 scale-110' : ''
                }`}
              />
              <span className={`font-semibold text-[11px] ${liked ? 'text-rose-500' : ''}`}>
                {likesCount}
              </span>
            </button>

            {/* O'chirish (faqat foydalanuvchi o'zi qo'shgan bo'lsa) */}
            {song.isCustom && onRemoveCustomSong && (
              <button
                onClick={() => onRemoveCustomSong(song.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                title={t('songCard.deleteSong')}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}

export default SongCard
