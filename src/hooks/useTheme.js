import { useState, useEffect } from 'react'

/**
 * useTheme - Dark va Light rejimni boshqaruvchi maxsus custom hook
 */
export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // 1. LocalStorage dan tekshirish
    const savedTheme = localStorage.getItem('musicuz_theme')
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme
    }
    // 2. Tizim sozlamasini tekshirish
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    // 3. Standart holat - dark
    return 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('musicuz_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  }
}

export default useTheme
