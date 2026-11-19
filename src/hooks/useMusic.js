import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchSongs, fetchGenres, addSongApi } from '../api/axiosClient'

const CUSTOM_SONGS_KEY = 'musicuz_custom_songs'

/**
 * useMusic - Musiqalarni yuklash, qidirish, janrlar bo'yicha filtrlash,
 * saralash va yangi musiqa qo'shish Custom Hook
 */
export const useMusic = () => {
  const [backendSongs, setBackendSongs] = useState([])
  const [customSongs, setCustomSongs] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_SONGS_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [genres, setGenres] = useState(['Barchasi'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filtrlash va qidiruv holatlari
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('Barchasi')
  const [sortBy, setSortBy] = useState('new') // 'new' | 'popular' | 'likes' | 'title'
  const [onlyLiked, setOnlyLiked] = useState(false)

  // Custom musiqalarni localStorage ga saqlash
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_SONGS_KEY, JSON.stringify(customSongs))
    } catch (e) {
      console.error('Custom songs storage error:', e)
    }
  }, [customSongs])

  // Backenddan musiqalarni yuklash funksiyasi
  const loadSongs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchSongs()
      if (Array.isArray(data)) {
        setBackendSongs(data)
      }
    } catch (err) {
      console.error('Qo\'shiqlarni yuklashda xatolik:', err)
      setError(err.response?.data?.detail || err.message || 'Musiqalarni yuklab bo\'lmadi')
    } finally {
      setLoading(false)
    }
  }, [])

  // Janrlarni yuklash
  const loadGenres = useCallback(async () => {
    try {
      const data = await fetchGenres()
      if (Array.isArray(data)) {
        setGenres(['Barchasi', ...data])
      }
    } catch {
      // Standart janrlar fallback
      setGenres(['Barchasi', 'Pop', 'Rock', 'Electronic', 'Lo-Fi', 'Jazz', 'Ethno', 'Chill'])
    }
  }, [])

  useEffect(() => {
    loadSongs()
    loadGenres()
  }, [loadSongs, loadGenres])

  // Barcha musiqalarni birlashtirish (Yangi qo'shilgan custom qo'shiqlar avval keladi)
  const allSongs = useMemo(() => {
    const customIds = new Set(customSongs.map((s) => s.id))
    const filteredBackend = backendSongs.filter((s) => !customIds.has(s.id))
    return [...customSongs, ...filteredBackend]
  }, [customSongs, backendSongs])

  // Yangi musiqa qo'shish funksiyasi
  const addSong = useCallback(
    async (songData) => {
      // 1. Yangi qo'shiq obyekti tayyorlash
      const newSong = {
        id: Date.now(),
        title: songData.title.trim(),
        artist: songData.artist.trim(),
        genre: songData.genre || 'Pop',
        audio_url: songData.audio_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        cover_url: songData.cover_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
        plays: 0,
        likes: 0,
        liked: false,
        saved: false,
        created_at: new Date().toISOString(),
        isCustom: true,
      }

      // 2. Mahalliy ro'yxatga qo'shish (foydalanuvchi darhol ko'rishi va eshitishi uchun)
      setCustomSongs((prev) => [newSong, ...prev])

      // 3. Backend API ga ham jo'natishga urinib ko'rish
      try {
        await addSongApi(songData)
        // Muvaffaqiyatli bo'lsa yangilash
        loadSongs()
      } catch (backendErr) {
        console.info('Backendga saqlash (foydalanuvchi guest rejimida):', backendErr.response?.data?.detail || backendErr.message)
      }

      return newSong
    },
    [loadSongs]
  )

  // Musiqani o'chirish (faqat lokal qo'shilganlar uchun)
  const removeCustomSong = useCallback((songId) => {
    setCustomSongs((prev) => prev.filter((s) => s.id !== songId))
  }, [])

  return {
    songs: allSongs,
    rawBackendSongs: backendSongs,
    customSongs,
    genres,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
    onlyLiked,
    setOnlyLiked,
    refreshSongs: loadSongs,
    addSong,
    removeCustomSong,
  }
}

export default useMusic
