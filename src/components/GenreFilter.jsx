import React from 'react'
import { ArrowUpDown } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

export const GenreFilter = ({
  genres,
  selectedGenre,
  onSelectGenre,
  sortBy,
  onSelectSort,
  totalCount,
}) => {
  const { t } = useTranslation()

  const getGenreDisplay = (genre) => {
    if (genre === 'Barchasi' || genre === 'All') {
      return t('genres.all')
    }
    return genre
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      
      {/* Janrlar ro'yxati (gorizontal skroll) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none no-scrollbar">
        {genres.map((genre) => {
          const isSelected =
            selectedGenre === genre ||
            ((selectedGenre === 'Barchasi' || selectedGenre === 'All') && (genre === 'Barchasi' || genre === 'All'))

          return (
            <button
              key={genre}
              onClick={() => onSelectGenre(genre === 'All' ? 'Barchasi' : genre)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-750'
              }`}
            >
              {getGenreDisplay(genre)}
            </button>
          )
        })}
      </div>

      {/* Saralash va musiqalar soni */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {t('genres.songsCount', totalCount)}
        </span>

        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => onSelectSort(e.target.value)}
            className="bg-transparent outline-none cursor-pointer font-medium text-slate-800 dark:text-slate-200"
          >
            <option value="new" className="dark:bg-slate-800">{t('genres.sort.new')}</option>
            <option value="popular" className="dark:bg-slate-800">{t('genres.sort.popular')}</option>
            <option value="likes" className="dark:bg-slate-800">{t('genres.sort.likes')}</option>
            <option value="title" className="dark:bg-slate-800">{t('genres.sort.title')}</option>
          </select>
        </div>
      </div>

    </div>
  )
}

export default GenreFilter
