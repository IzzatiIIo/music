import { useState, useEffect, useRef, useCallback } from 'react'
import { recordPlay } from '../api/axiosClient'

/**
 * useAudioPlayer - Musiqa pleyerini to'liq boshqaruvchi Custom Hook
 */
export const useAudioPlayer = (songs = []) => {
  const audioRef = useRef(new Audio())
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoop, setIsLoop] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)

  // Audio element sozlamalari
  useEffect(() => {
    const audio = audioRef.current
    audio.volume = volume

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0)
      setIsLoadingAudio(false)
    }

    const handleWaiting = () => {
      setIsLoadingAudio(true)
    }

    const handlePlaying = () => {
      setIsLoadingAudio(false)
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleEnded = () => {
      if (isLoop) {
        audio.currentTime = 0
        audio.play().catch(console.error)
      } else {
        playNext()
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('playing', handlePlaying)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('playing', handlePlaying)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [isLoop])

  // Musiqani boshlash / o'rnatish
  const playSong = useCallback(
    async (song) => {
      if (!song || !song.audio_url) return

      const audio = audioRef.current

      // Agar ayni shu qo'shiq bosilgan bo'lsa, play/pause ni almashtiramiz
      if (currentSong && currentSong.id === song.id) {
        if (isPlaying) {
          audio.pause()
        } else {
          try {
            await audio.play()
          } catch (e) {
            console.error('Play error:', e)
          }
        }
        return
      }

      // Yangi qo'shiq qo'yilmoqda
      setCurrentSong(song)
      setIsLoadingAudio(true)
      audio.src = song.audio_url
      audio.currentTime = 0

      try {
        await audio.play()
        setIsPlaying(true)

        // Backendga eshitildi deb hisobot berish
        recordPlay(song.id)
      } catch (err) {
        console.error('Musiqani chalishda xatolik:', err)
        setIsPlaying(false)
      } finally {
        setIsLoadingAudio(false)
      }
    },
    [currentSong, isPlaying]
  )

  // Play / Pause toggle
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current
    if (!currentSong) {
      if (songs && songs.length > 0) {
        playSong(songs[0])
      }
      return
    }

    if (isPlaying) {
      audio.pause()
    } else {
      try {
        await audio.play()
      } catch (err) {
        console.error('Play resume error:', err)
      }
    }
  }, [currentSong, isPlaying, songs, playSong])

  // To'xtatish (Pause)
  const pause = useCallback(() => {
    audioRef.current.pause()
  }, [])

  // Vaqtni o'zgartirish (Seek)
  const seek = useCallback((seconds) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = seconds
    setCurrentTime(seconds)
  }, [])

  // Ovoz balandligini sozlash
  const setVolume = useCallback((val) => {
    const clamped = Math.max(0, Math.min(1, val))
    audioRef.current.volume = clamped
    setVolumeState(clamped)
    if (clamped > 0 && isMuted) {
      setIsMuted(false)
      audioRef.current.muted = false
    }
  }, [isMuted])

  // Ovozni yoqish / o'chirish (Mute)
  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    const nextMuted = !isMuted
    audio.muted = nextMuted
    setIsMuted(nextMuted)
  }, [isMuted])

  // Takrorlash (Loop)
  const toggleLoop = useCallback(() => {
    setIsLoop((prev) => !prev)
  }, [])

  // Tasodifiy chalish (Shuffle)
  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev)
  }, [])

  // Keyingi musiqa
  const playNext = useCallback(() => {
    if (!songs || songs.length === 0) return
    if (!currentSong) {
      playSong(songs[0])
      return
    }

    const currentIndex = songs.findIndex((s) => s.id === currentSong.id)

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length)
      playSong(songs[randomIndex])
    } else {
      const nextIndex = (currentIndex + 1) % songs.length
      playSong(songs[nextIndex])
    }
  }, [songs, currentSong, isShuffle, playSong])

  // Oldingi musiqa
  const playPrev = useCallback(() => {
    if (!songs || songs.length === 0) return
    if (!currentSong) {
      playSong(songs[0])
      return
    }

    // Agar 3 sekunddan ko'proq chalingan bo'lsa, boshidan boshlaydi
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
      return
    }

    const currentIndex = songs.findIndex((s) => s.id === currentSong.id)
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length
    playSong(songs[prevIndex])
  }, [songs, currentSong, playSong])

  return {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoop,
    isShuffle,
    isLoadingAudio,
    playSong,
    togglePlay,
    pause,
    seek,
    setVolume,
    toggleMute,
    toggleLoop,
    toggleShuffle,
    playNext,
    playPrev,
  }
}

export default useAudioPlayer
