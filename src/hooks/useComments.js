import { useState, useEffect, useCallback } from 'react'

const COMMENTS_STORAGE_KEY = 'musicuz_song_comments'

// Boshlang'ich qiziqarli izohlar
const INITIAL_COMMENTS = {
  12: [
    {
      id: 'c1',
      author: 'Dilnoza',
      text: 'Ajoyib sokin treck! Yomg\'irli havoda eshitish uchun ayni muddao 🌧️❤️',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'c2',
      author: 'Jamshid',
      text: 'Baslari juda chiroyli chiqqan, Malika Lo-Fi ga rahmat!',
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    },
  ],
  11: [
    {
      id: 'c3',
      author: 'Sardor',
      text: 'Tungi shahar bo\'ylab mashinada tinglash uchun ajoyib ritm 🔥🚀',
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    },
  ],
  9: [
    {
      id: 'c4',
      author: 'Madina',
      text: 'Qo\'shiq so\'zlari juda ta\'sirli. Menga juda yoqdi ✨',
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    },
  ],
}

/**
 * useComments - Har bir musiqa uchun sharhlar (kommentariyalar) Custom Hook
 */
export const useComments = () => {
  const [commentsMap, setCommentsMap] = useState(() => {
    try {
      const saved = localStorage.getItem(COMMENTS_STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
      return INITIAL_COMMENTS
    } catch {
      return INITIAL_COMMENTS
    }
  })

  // LocalStorage ga avtomatik saqlash
  useEffect(() => {
    try {
      localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(commentsMap))
    } catch (e) {
      console.error('Comments LocalStorage error:', e)
    }
  }, [commentsMap])

  // Qo'shiqning kommentlarini olish
  const getSongComments = useCallback(
    (songId) => {
      if (!songId) return []
      return commentsMap[songId] || []
    },
    [commentsMap]
  )

  // Kommentlar sonini olish
  const getCommentsCount = useCallback(
    (songId) => {
      if (!songId) return 0
      return (commentsMap[songId] || []).length
    },
    [commentsMap]
  )

  // Yangi komment qo'shish
  const addComment = useCallback((songId, { author, text, avatar }) => {
    if (!songId || !text?.trim()) return null

    const newComment = {
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      author: author?.trim() || 'Foydalanuvchi',
      text: text.trim(),
      createdAt: new Date().toISOString(),
      avatar:
        avatar ||
        `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(author || 'Guest')}`,
    }

    setCommentsMap((prev) => {
      const currentList = prev[songId] || []
      return {
        ...prev,
        [songId]: [newComment, ...currentList],
      }
    })

    return newComment
  }, [])

  // Kommentni o'chirish
  const deleteComment = useCallback((songId, commentId) => {
    if (!songId || !commentId) return

    setCommentsMap((prev) => {
      const currentList = prev[songId] || []
      return {
        ...prev,
        [songId]: currentList.filter((c) => c.id !== commentId),
      }
    })
  }, [])

  return {
    commentsMap,
    getSongComments,
    getCommentsCount,
    addComment,
    deleteComment,
  }
}

export default useComments
