import React, { useState, useEffect } from 'react'
import { X, MessageCircle, Send, Trash2, Heart } from 'lucide-react'
import { formatRelativeTime, getCoverImage } from '../utils/formatters'
import { API_BASE_URL } from '../api/axiosClient'
import { useTranslation } from '../hooks/useTranslation'

const QUICK_EMOJIS = ['🔥', '❤️', '👏', '🎵', '🎧', '🌧️', '✨', '🚀']

export const CommentsModal = ({
  isOpen,
  onClose,
  song,
  comments,
  onAddComment,
  onDeleteComment,
  isLiked,
  onToggleLike,
}) => {
  const { lang, t } = useTranslation()
  const [text, setText] = useState('')
  const [authorName, setAuthorName] = useState(() => {
    return localStorage.getItem('musicuz_author_name') || ''
  })

  // Ismni saqlab borish
  useEffect(() => {
    if (authorName) {
      localStorage.setItem('musicuz_author_name', authorName)
    }
  }, [authorName])

  if (!isOpen || !song) return null

  const coverUrl = getCoverImage(song.cover_url, song.id, API_BASE_URL)
  const liked = isLiked(song.id)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return

    onAddComment(song.id, {
      author: authorName || t('commentsModal.defaultAuthor'),
      text: text.trim(),
    })

    setText('')
  }

  const handleAddEmoji = (emoji) => {
    setText((prev) => prev + emoji)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Tepa sarlavha va qo'shiq ma'lumoti */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={coverUrl}
              alt={song.title}
              className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                {song.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {song.artist} • <span className="font-semibold text-indigo-600 dark:text-indigo-400">{t('commentsModal.commentsCount', comments.length)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleLike(song)}
              className={`p-2 rounded-xl transition-all ${
                liked ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' : 'text-slate-400 hover:text-rose-500'
              }`}
              title={t('commentsModal.like')}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sharhlar ro'yxati (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {t('commentsModal.noComments')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('commentsModal.beFirst')}
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="group flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
              >
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className="w-9 h-9 rounded-full object-cover shrink-0 bg-indigo-100 dark:bg-slate-700"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {comment.author}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {formatRelativeTime(comment.createdAt, lang)}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-wrap break-words leading-relaxed">
                    {comment.text}
                  </p>
                </div>

                {/* O'chirish tugmasi */}
                <button
                  onClick={() => onDeleteComment(song.id, comment.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
                  title={t('commentsModal.deleteComment')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Sharh yozish qismi */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
          
          {/* Tezkor emojilar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider shrink-0 mr-1">
              {t('commentsModal.emojis')}
            </span>
            {QUICK_EMOJIS.map((emoji) => (
              <button
                type="button"
                key={emoji}
                onClick={() => handleAddEmoji(emoji)}
                className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm hover:scale-110 active:scale-95 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Ism kiritish */}
          <input
            type="text"
            placeholder={t('commentsModal.namePlaceholder')}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:border-indigo-500 outline-none transition-all"
          />

          {/* Sharh matni va Jo'natish tugmasi */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={t('commentsModal.writePlaceholder')}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:border-indigo-500 outline-none transition-all"
            />

            <button
              type="submit"
              disabled={!text.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 shadow-md shadow-indigo-600/25 active:scale-95 transition-all"
              title={t('commentsModal.send')}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}

export default CommentsModal
