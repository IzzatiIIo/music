import React from 'react'
import { SongCard } from './SongCard'
import { Music2, HeartCrack, Plus } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

export const SongList = ({
  songs,
  loading,
  error,
  currentSong,
  isPlaying,
  onPlay,
  isLiked,
  getLikesCount,
  onToggleLike,
  getCommentsCount,
  onOpenComments,
  onRemoveCustomSong,
  onlyLiked,
  onOpenAddModal,
  onResetFilters,
}) => {
  const { t } = useTranslation()

  // Yuklanish holati (Skeleton)
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-3.5 bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 animate-pulse"
          >
            <div className="aspect-square w-full rounded-xl bg-slate-200 dark:bg-slate-700 mb-3" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          </div>
        ))}
      </div>
    )
  }

  // Xatolik holati
  if (error && songs.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white dark:bg-slate-800/40 rounded-3xl border border-red-200 dark:border-red-900/40">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
          <Music2 className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          {t('songList.serverErrorTitle')}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          {t('songList.serverErrorDesc', error)}
        </p>
        <button
          onClick={onOpenAddModal}
          className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all"
        >
          {t('songList.addNewMusic')}
        </button>
      </div>
    )
  }

  // Bo'sh ro'yxat (Musiqa topilmadi)
  if (songs.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center">
          {onlyLiked ? <HeartCrack className="w-8 h-8 text-rose-500" /> : <Music2 className="w-8 h-8" />}
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {onlyLiked ? t('songList.noLikedTitle') : t('songList.noSongsTitle')}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          {onlyLiked ? t('songList.noLikedDesc') : t('songList.noSongsDesc')}
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          {onlyLiked ? (
            <button
              onClick={onResetFilters}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-200"
            >
              {t('songList.viewAllSongs')}
            </button>
          ) : (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t('songList.addNewMusic')}</span>
            </button>
          )}
        </div>
      </div>
    )
  }

  // Musiqalar ro'yxati katakchalari (Grid)
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-6">
      {songs.map((song) => (
        <SongCard
          key={song.id}
          song={song}
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlay={onPlay}
          isLiked={isLiked}
          likesCount={getLikesCount(song)}
          onToggleLike={onToggleLike}
          commentsCount={getCommentsCount(song.id)}
          onOpenComments={onOpenComments}
          onRemoveCustomSong={onRemoveCustomSong}
        />
      ))}
    </div>
  )
}

export default SongList
