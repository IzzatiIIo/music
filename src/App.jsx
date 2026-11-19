import React, { useState, useMemo } from 'react'
import { useTheme } from './hooks/useTheme'
import { useLikes } from './hooks/useLikes'
import { useComments } from './hooks/useComments'
import { useMusic } from './hooks/useMusic'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useTranslation } from './hooks/useTranslation'

import { Navbar } from './components/Navbar'
import { HeroBanner } from './components/HeroBanner'
import { GenreFilter } from './components/GenreFilter'
import { SongList } from './components/SongList'
import { MusicPlayer } from './components/MusicPlayer'
import { AddSongModal } from './components/AddSongModal'
import { CommentsModal } from './components/CommentsModal'
import { AuthModal } from './components/AuthModal'

export function App() {
  const { t } = useTranslation()

  // 1. Maxsus Custom Hooklar
  const { theme, isDark, toggleTheme } = useTheme()
  const { likedSongIds, isLiked, getLikesCount, toggleLike, likedCount } = useLikes()
  const { getSongComments, getCommentsCount, addComment, deleteComment } = useComments()
  const {
    songs,
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
    addSong,
    removeCustomSong,
  } = useMusic()

  // 2. Modallar holati
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [activeCommentsSong, setActiveCommentsSong] = useState(null)

  // 3. Foydalanuvchi holati (Backend Auth)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('musicuz_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // 4. Filtrlangan va saralangan musiqalar ro'yxati
  const filteredSongs = useMemo(() => {
    let result = [...songs]

    // Qidiruv bo'yicha filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (s) =>
          (s.title && s.title.toLowerCase().includes(q)) ||
          (s.artist && s.artist.toLowerCase().includes(q)) ||
          (s.genre && s.genre.toLowerCase().includes(q))
      )
    }

    // Janr bo'yicha filter
    if (selectedGenre && selectedGenre !== 'Barchasi' && selectedGenre !== 'All') {
      result = result.filter(
        (s) => s.genre && s.genre.toLowerCase() === selectedGenre.toLowerCase()
      )
    }

    // Faqat yoqqanlar (Liked)
    if (onlyLiked) {
      result = result.filter((s) => isLiked(s.id))
    }

    // Saralash (Sort)
    result.sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.plays || 0) - (a.plays || 0)
      }
      if (sortBy === 'likes') {
        return getLikesCount(b) - getLikesCount(a)
      }
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '')
      }
      // 'new' - standart holatda eng yangi
      return (b.id || 0) - (a.id || 0)
    })

    return result
  }, [songs, searchQuery, selectedGenre, onlyLiked, sortBy, isLiked, getLikesCount])

  // 5. Audio pleyer boshqaruvi
  const player = useAudioPlayer(filteredSongs.length > 0 ? filteredSongs : songs)

  // Qo'shiqni qo'shgandan so'ng darhol ijro etish
  const handleAddNewSong = async (songData) => {
    const created = await addSong(songData)
    if (created) {
      player.playSong(created)
    }
  }

  // Tizimdan chiqish
  const handleLogout = () => {
    localStorage.removeItem('musicuz_token')
    localStorage.removeItem('musicuz_user')
    setUser(null)
    setIsAuthModalOpen(false)
  }

  // Bugungi eng sara featured musiqa (birinchi yoki eng ko'p tinglangan)
  const featuredSong = useMemo(() => {
    if (songs.length === 0) return null
    return [...songs].sort((a, b) => (b.plays || 0) - (a.plays || 0))[0]
  }, [songs])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0c1017] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Tepa navigatsiya paneli */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onlyLiked={onlyLiked}
        setOnlyLiked={setOnlyLiked}
        likedCount={likedCount}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        user={user}
      />

      {/* Asosiy sahifa konteyneri */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-32">
        
        {/* Faqat barcha musiqalar ko'rilganda va qidiruv bo'lmaganda Hero Banner chiqadi */}
        {!searchQuery && !onlyLiked && (selectedGenre === 'Barchasi' || selectedGenre === 'All') && (
          <HeroBanner
            featuredSong={featuredSong}
            isPlaying={player.isPlaying}
            currentSong={player.currentSong}
            onPlay={player.playSong}
          />
        )}

        {/* Sahifa sarlavhasi (agar Yoqqanlar bosilgan bo'lsa) */}
        {onlyLiked && (
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-rose-500">
                <span>{t('likedSection.title')}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {t('likedSection.subtitle', likedCount)}
              </p>
            </div>
            <button
              onClick={() => setOnlyLiked(false)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {t('likedSection.backToAll')}
            </button>
          </div>
        )}

        {/* Janrlar filtri va saralash */}
        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
          sortBy={sortBy}
          onSelectSort={setSortBy}
          totalCount={filteredSongs.length}
        />

        {/* Musiqalar ro'yxati (Katakchalar) */}
        <SongList
          songs={filteredSongs}
          loading={loading}
          error={error}
          currentSong={player.currentSong}
          isPlaying={player.isPlaying}
          onPlay={player.playSong}
          isLiked={isLiked}
          getLikesCount={getLikesCount}
          onToggleLike={toggleLike}
          getCommentsCount={getCommentsCount}
          onOpenComments={(song) => setActiveCommentsSong(song)}
          onRemoveCustomSong={removeCustomSong}
          onlyLiked={onlyLiked}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onResetFilters={() => {
            setOnlyLiked(false)
            setSelectedGenre('Barchasi')
            setSearchQuery('')
          }}
        />

      </main>

      {/* Pastki doimiy audio pleyer paneli */}
      <MusicPlayer
        currentSong={player.currentSong}
        isPlaying={player.isPlaying}
        currentTime={player.currentTime}
        duration={player.duration}
        volume={player.volume}
        isMuted={player.isMuted}
        isLoop={player.isLoop}
        isShuffle={player.isShuffle}
        onTogglePlay={player.togglePlay}
        onSeek={player.seek}
        onSetVolume={player.setVolume}
        onToggleMute={player.toggleMute}
        onToggleLoop={player.toggleLoop}
        onToggleShuffle={player.toggleShuffle}
        onPlayNext={player.playNext}
        onPlayPrev={player.playPrev}
        isLiked={isLiked}
        onToggleLike={toggleLike}
        onOpenComments={(song) => setActiveCommentsSong(song)}
      />

      {/* 1-Modal: Musiqa qo'shish */}
      <AddSongModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSong={handleAddNewSong}
      />

      {/* 2-Modal: Sharhlar va fikrlar */}
      <CommentsModal
        isOpen={Boolean(activeCommentsSong)}
        onClose={() => setActiveCommentsSong(null)}
        song={activeCommentsSong}
        comments={activeCommentsSong ? getSongComments(activeCommentsSong.id) : []}
        onAddComment={addComment}
        onDeleteComment={deleteComment}
        isLiked={isLiked}
        onToggleLike={toggleLike}
      />

      {/* 3-Modal: Tizimga kirish / Profil */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onLoginSuccess={(u) => setUser(u)}
        onLogout={handleLogout}
      />

    </div>
  )
}

export default App
