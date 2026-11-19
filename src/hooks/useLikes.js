import { useState, useEffect, useCallback } from 'react'
import { toggleLikeApi } from '../api/axiosClient'

const STORAGE_KEY = 'musicuz_liked_songs'
const LIKES_COUNT_KEY = 'musicuz_likes_counts'

/**
 * useLikes - Musiqalarga like bosish funksionalligi uchun Custom Hook
 * Backend bilan sinxronlashadi va mahalliy (offline) holatda ham ishonchli ishlaydi.
 */
export const useLikes = () => {
  // Saqlangan like bosilgan qo'shiqlar ID ro'yxati
  const [likedSongIds, setLikedSongIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Mahalliy qo'shilgan like hisoblagichlari (optimistic UI)
  const [likesCountMap, setLikesCountMap] = useState(() => {
    try {
      const saved = localStorage.getItem(LIKES_COUNT_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // LocalStorage ga saqlash
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(likedSongIds))
    } catch (e) {
      console.error('LocalStorage write error:', e)
    }
  }, [likedSongIds])

  useEffect(() => {
    try {
      localStorage.setItem(LIKES_COUNT_KEY, JSON.stringify(likesCountMap))
    } catch (e) {
      console.error('LikesCount write error:', e)
    }
  }, [likesCountMap])

  // Qo'shiq like qilinganligini tekshirish
  const isLiked = useCallback(
    (songId) => {
      return likedSongIds.includes(Number(songId)) || likedSongIds.includes(String(songId))
    },
    [likedSongIds]
  )

  // Qo'shiqning umumiy like lar sonini hisoblash
  const getLikesCount = useCallback(
    (song) => {
      if (!song) return 0
      const baseLikes = song.likes || 0
      const localDelta = likesCountMap[song.id] || 0
      return Math.max(0, baseLikes + localDelta)
    },
    [likesCountMap]
  )

  // Like ni almashtirish (Toggle like)
  const toggleLike = useCallback(
    async (song) => {
      if (!song || !song.id) return

      const songId = song.id
      const currentlyLiked = isLiked(songId)
      const nextLiked = !currentlyLiked

      // 1. Optimistik yangilash: likedSongIds ro'yxatini yangilash
      setLikedSongIds((prev) => {
        const numId = Number(songId)
        if (currentlyLiked) {
          return prev.filter((id) => Number(id) !== numId)
        } else {
          return [...prev, numId]
        }
      })

      // 2. Like hisoblagichini optimistik yangilash
      setLikesCountMap((prev) => ({
        ...prev,
        [songId]: (prev[songId] || 0) + (nextLiked ? 1 : -1),
      }))

      // 3. Backend API ga so'rov jo'natish (tizimga kirgan bo'lsa serverda saqlanadi)
      try {
        await toggleLikeApi(songId)
      } catch (err) {
        // Agar foydalanuvchi tizimga kirmagan bo'lsa ham, lokal tajriba saqlanadi
        console.info('Backend like sync info (guest or auth required):', err.response?.data?.detail || err.message)
      }

      return nextLiked
    },
    [isLiked]
  )

  return {
    likedSongIds,
    isLiked,
    getLikesCount,
    toggleLike,
    likedCount: likedSongIds.length,
  }
}

export default useLikes
