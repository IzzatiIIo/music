import React from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  MessageCircle,
} from 'lucide-react'
import { formatTime, getCoverImage } from '../utils/formatters'
import { API_BASE_URL } from '../api/axiosClient'
import { useTranslation } from '../hooks/useTranslation'

export const MusicPlayer = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isLoop,
  isShuffle,
  onTogglePlay,
  onSeek,
  onSetVolume,
  onToggleMute,
  onToggleLoop,
  onToggleShuffle,
  onPlayNext,
  onPlayPrev,
  isLiked,
  onToggleLike,
  onOpenComments,
}) => {
  const { t } = useTranslation()
  if (!currentSong) return null

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const liked = isLiked(currentSong.id)
  const coverUrl = getCoverImage(currentSong.cover_url, currentSong.id, API_BASE_URL)

  const handleProgressChange = (e) => {
    const newPercent = parseFloat(e.target.value)
    const newTime = (newPercent / 100) * duration
    onSeek(newTime)
  }

  const handleVolumeChange = (e) => {
    onSetVolume(parseFloat(e.target.value))
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl bg-white/90 dark:bg-slate-900/95 border-t border-slate-200/90 dark:border-slate-800/90 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] transition-colors duration-200">
      
      {/* Yupqa tepa progress liniyasi (mobil uchun qulay indikator) */}
      <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 cursor-pointer sm:hidden relative">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* 1. Chap qism: Trek haqida ma'lumot */}
          <div className="flex items-center gap-3 min-w-0 sm:w-1/4">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 shadow-md bg-slate-200 dark:bg-slate-800">
              <img
                src={coverUrl}
                alt={currentSong.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isPlaying ? 'scale-105 rotate-1' : ''
                }`}
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="flex items-end gap-0.5 h-4">
                    <span className="w-0.5 bg-white rounded-full animate-wave-1" />
                    <span className="w-0.5 bg-white rounded-full animate-wave-2" />
                    <span className="w-0.5 bg-white rounded-full animate-wave-3" />
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate" title={currentSong.title}>
                {currentSong.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5" title={currentSong.artist}>
                {currentSong.artist}
              </p>
            </div>

            {/* Like & Comments tugmalari */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => onToggleLike(currentSong)}
                className={`p-2 rounded-xl transition-transform active:scale-125 ${
                  liked ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title={t('player.addToLiked')}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                onClick={() => onOpenComments(currentSong)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={t('player.comments')}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. O'rta qism: Asosiy boshqaruv tugmalari va vaqt qatori */}
          <div className="flex flex-col items-center flex-1 max-w-xl">
            
            {/* Boshqaruv tugmalari */}
            <div className="flex items-center gap-3 sm:gap-6">
              
              {/* Shuffle */}
              <button
                onClick={onToggleShuffle}
                className={`p-2 rounded-xl hidden sm:block transition-colors ${
                  isShuffle
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title={t('player.shuffle')}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              {/* Prev */}
              <button
                onClick={onPlayPrev}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95 transition-all"
                title={t('player.previous')}
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              {/* Play / Pause */}
              <button
                onClick={onTogglePlay}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all"
                title={isPlaying ? t('player.pause') : t('player.play')}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={onPlayNext}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95 transition-all"
                title={t('player.next')}
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              {/* Loop */}
              <button
                onClick={onToggleLoop}
                className={`p-2 rounded-xl hidden sm:block transition-colors ${
                  isLoop
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title={t('player.repeat')}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Vaqt va Progress scrubber qatori (Planshet va Kompyuterda to'liq) */}
            <div className="w-full hidden sm:flex items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="w-10 text-right">{formatTime(currentTime)}</span>
              
              <div className="relative flex-1 flex items-center group py-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={isNaN(progressPercent) ? 0 : progressPercent}
                  onChange={handleProgressChange}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                />
              </div>

              <span className="w-10">{formatTime(duration)}</span>
            </div>

          </div>

          {/* 3. O'ng qism: Ovoz sozlamasi */}
          <div className="hidden md:flex items-center justify-end gap-2.5 sm:w-1/4">
            <button
              onClick={onToggleMute}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title={isMuted ? t('player.volumeUnmute') : t('player.volumeMute')}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 text-rose-500" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
              title={t('player.volumeTitle', Math.round((isMuted ? 0 : volume) * 100))}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default MusicPlayer
