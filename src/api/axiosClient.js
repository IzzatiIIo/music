import axios from 'axios'

// API Base URL muhit o'zgaruvchisidan (.env) olinadi
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://music-l8kd.onrender.com'

// Axios instansiyasi yaratilmoqda
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
  },
})

// Request Interceptor: Agar foydalanuvchi tokeni mavjud bo'lsa, Authorization sarlavhasi ulanadi
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('musicuz_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Xatoliklarni qulay formatda qaytarish
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized holatida tokenni tozalash
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('musicuz_token')
      localStorage.removeItem('musicuz_user')
    }
    return Promise.reject(error)
  }
)

/* ==================== API XIZMATLARI ==================== */

// Qo'shiqlarni olish (qidiruv, janr, saralash parametrlari bilan)
export const fetchSongs = async ({ q = '', genre = '', sort = 'new' } = {}) => {
  const params = {}
  if (q) params.q = q
  if (genre && genre !== 'Barchasi') params.genre = genre
  if (sort) params.sort = sort

  const response = await axiosClient.get('/api/songs', { params })
  return response.data
}

// Janrlarni olish
export const fetchGenres = async () => {
  const response = await axiosClient.get('/api/genres')
  return response.data
}

// Qo'shiq eshitilganligini hisoblash (Play count)
export const recordPlay = async (songId) => {
  try {
    const response = await axiosClient.post(`/api/songs/${songId}/play`)
    return response.data
  } catch (err) {
    console.warn(`Play count error for song ${songId}:`, err.message)
    return null
  }
}

// Qo'shiqqa like bosish / olib tashlash
export const toggleLikeApi = async (songId) => {
  const response = await axiosClient.post(`/api/songs/${songId}/like`)
  return response.data
}

// Qo'shiqni saqlash (Saved)
export const toggleSaveApi = async (songId) => {
  const response = await axiosClient.post(`/api/songs/${songId}/save`)
  return response.data
}

// Yangi musiqa qo'shish (Admin / Creator)
export const addSongApi = async (songData) => {
  let payload = songData

  // Agar oddiy obyekt bo'lsa, FormData ga aylantiramiz
  if (!(songData instanceof FormData)) {
    const fd = new FormData()
    if (songData.title) fd.append('title', songData.title)
    if (songData.artist) fd.append('artist', songData.artist)
    if (songData.genre) fd.append('genre', songData.genre)
    if (songData.audio_url) fd.append('audio_url', songData.audio_url)
    if (songData.cover_url) fd.append('cover_url', songData.cover_url)
    if (songData.audio) fd.append('audio', songData.audio)
    if (songData.cover) fd.append('cover', songData.cover)
    payload = fd
  }

  const response = await axiosClient.post('/api/admin/songs', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// Joriy foydalanuvchi ma'lumotlarini olish
export const getMe = async () => {
  const response = await axiosClient.get('/api/me')
  return response.data
}

// SMS / Telegram kod so'rash
export const requestCode = async (phone, mode = 'login') => {
  const response = await axiosClient.post('/api/auth/request-code', { phone, mode })
  return response.data
}

// Kodni tasdiqlash
export const verifyCode = async (phone, code, name = '') => {
  const response = await axiosClient.post('/api/auth/verify', { phone, code, name })
  return response.data
}

// Konfiguratsiya ma'lumotlari (bot, donate, etc.)
export const getConfig = async () => {
  const response = await axiosClient.get('/api/config')
  return response.data
}

export default axiosClient
