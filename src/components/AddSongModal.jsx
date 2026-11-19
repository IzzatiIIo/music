import React, { useState } from 'react'
import { X, Music, Upload, Image as ImageIcon, Sparkles, Check, AlertCircle } from 'lucide-react'
import { FALLBACK_COVERS } from '../utils/formatters'
import { useTranslation } from '../hooks/useTranslation'

// Namuna sifatida foydalanuvchi sinashi uchun tayyor audio havolalar
const SAMPLE_AUDIOS = [
  {
    title: 'SoundHelix 1',
    artist: 'Sample Beats',
    genre: 'Electronic',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    title: 'SoundHelix 2',
    artist: 'Chillout Vibes',
    genre: 'Chill',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    title: 'SoundHelix 3',
    artist: 'Acoustic Dreams',
    genre: 'Pop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
]

export const AddSongModal = ({ isOpen, onClose, onAddSong }) => {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [genre, setGenre] = useState('Pop')
  const [audioUrl, setAudioUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [audioFile, setAudioFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  // Audio fayl tanlanganda
  const handleAudioFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAudioFile(file)
      // Mahalliy tinglash uchun obyekt URL yaratish
      const localUrl = URL.createObjectURL(file)
      setAudioUrl(localUrl)
      if (!title) {
        // Fayl nomidan trek nomini avtomatik olish
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')
        setTitle(cleanName)
      }
    }
  }

  // Muqova rasmi yuklanganda
  const handleCoverFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverFile(file)
      const localUrl = URL.createObjectURL(file)
      setCoverUrl(localUrl)
    }
  }

  // Namuna to'ldirish (Tezkor sinash uchun)
  const handleUseSample = (sample) => {
    setTitle(sample.title)
    setArtist(sample.artist)
    setGenre(sample.genre)
    setAudioUrl(sample.url)
    setCoverUrl(FALLBACK_COVERS[Math.floor(Math.random() * FALLBACK_COVERS.length)])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !artist.trim()) {
      setError(t('addModal.errorRequired'))
      return
    }

    if (!audioUrl && !audioFile) {
      setError(t('addModal.errorAudioRequired'))
      return
    }

    try {
      setIsSubmitting(true)
      
      const payload = {
        title: title.trim(),
        artist: artist.trim(),
        genre: genre || 'Pop',
        audio_url: audioUrl,
        cover_url: coverUrl || FALLBACK_COVERS[0],
        audio: audioFile,
        cover: coverFile,
      }

      await onAddSong(payload)
      setSuccess(true)

      setTimeout(() => {
        setSuccess(false)
        onClose()
        // Formani tozalash
        setTitle('')
        setArtist('')
        setAudioUrl('')
        setCoverUrl('')
        setAudioFile(null)
        setCoverFile(null)
      }, 1200)

    } catch (err) {
      setError(err.message || t('addModal.errorGeneric'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Tepa sarlavha */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {t('addModal.title')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('addModal.subtitle')}
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

        {/* Forma mazmuni */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <Check className="w-4 h-4 shrink-0" />
              <span>{t('addModal.success')}</span>
            </div>
          )}

          {/* Tezkor namunani tanlash */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t('addModal.samplePrompt')}</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_AUDIOS.map((s, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleUseSample(s)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-indigo-500 transition-all"
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          {/* Qo'shiq nomi */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              {t('addModal.songTitle')}
            </label>
            <input
              type="text"
              required
              placeholder={t('addModal.songTitlePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Ijrochi nomi */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              {t('addModal.artist')}
            </label>
            <input
              type="text"
              required
              placeholder={t('addModal.artistPlaceholder')}
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Janr tanlash */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              {t('addModal.genre')}
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:border-indigo-500 outline-none transition-all"
            >
              <option value="Pop">Pop</option>
              <option value="Rock">Rock</option>
              <option value="Electronic">Electronic</option>
              <option value="Lo-Fi">Lo-Fi</option>
              <option value="Jazz">Jazz</option>
              <option value="Ethno">Ethno</option>
              <option value="Chill">Chill</option>
              <option value="Hip-Hop">Hip-Hop</option>
            </select>
          </div>

          {/* Audio manbasi */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              {t('addModal.audioSource')}
            </label>
            
            <input
              type="url"
              placeholder={t('addModal.audioUrlPlaceholder')}
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:border-indigo-500 outline-none transition-all"
            />

            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300 transition-all">
                <Upload className="w-4 h-4 text-indigo-500" />
                <span>{audioFile ? audioFile.name : t('addModal.uploadAudioFile')}</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Muqova rasmi */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              {t('addModal.coverImage')}
            </label>
            
            <input
              type="url"
              placeholder={t('addModal.coverPlaceholder')}
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:border-indigo-500 outline-none transition-all"
            />

            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-500 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300 transition-all">
                <ImageIcon className="w-4 h-4 text-purple-500" />
                <span>{coverFile ? coverFile.name : t('addModal.uploadCoverFile')}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Tayyor muqovalar palitrasi */}
            <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
              {FALLBACK_COVERS.slice(0, 5).map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setCoverUrl(img)}
                  className={`w-10 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    coverUrl === img ? 'border-indigo-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="cover preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Pastki tugmalar */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t('addModal.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? t('addModal.submitting') : t('addModal.submit')}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}

export default AddSongModal
