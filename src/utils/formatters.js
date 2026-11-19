// Time formatter: seconds to MM:SS
export const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === null || seconds === undefined) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

// Relative date formatter in Uzbek or English
export const formatRelativeTime = (dateString, lang = 'uz') => {
  if (!dateString) return lang === 'en' ? 'Recently' : 'Yaqinda'
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return lang === 'en' ? 'Just now' : 'Hozirgina'
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return lang === 'en' ? `${diffInMinutes}m ago` : `${diffInMinutes} daqiqa oldin`
  }
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return lang === 'en' ? `${diffInHours}h ago` : `${diffInHours} soat oldin`
  }
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return lang === 'en' ? `${diffInDays}d ago` : `${diffInDays} kun oldin`
  }

  return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'uz-UZ', { day: 'numeric', month: 'short' })
}

// Fallback cover images with artistic gradients & music vibes
export const FALLBACK_COVERS = [
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80'
]

export const getCoverImage = (coverUrl, id = 0, baseUrl = '') => {
  if (!coverUrl || coverUrl === '/uploads/default-cover.svg' || coverUrl.includes('default-cover')) {
    const index = Math.abs(id || 0) % FALLBACK_COVERS.length
    return FALLBACK_COVERS[index]
  }

  if (coverUrl.startsWith('http://') || coverUrl.startsWith('https://') || coverUrl.startsWith('blob:') || coverUrl.startsWith('data:')) {
    return coverUrl
  }

  if (coverUrl.startsWith('/') && baseUrl) {
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
    return `${cleanBase}${coverUrl}`
  }

  return coverUrl
}
