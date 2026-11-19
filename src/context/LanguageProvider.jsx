import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { LanguageContext } from './LanguageContext.js'
import { translations } from '../i18n/translations'

const LANGUAGE_KEY = 'musicuz_language'

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY)
      if (saved === 'uz' || saved === 'en') return saved
      const browserLang = (navigator.language || '').toLowerCase()
      if (browserLang.startsWith('uz')) return 'uz'
      if (browserLang.startsWith('en')) return 'en'
      return 'uz'
    } catch {
      return 'uz'
    }
  })

  const setLang = useCallback((newLang) => {
    if (newLang === 'uz' || newLang === 'en') {
      setLangState(newLang)
      try {
        localStorage.setItem(LANGUAGE_KEY, newLang)
      } catch (e) {
        console.error('Failed to save language to localStorage:', e)
      }
    }
  }, [])

  const toggleLang = useCallback(() => {
    setLang(lang === 'uz' ? 'en' : 'uz')
  }, [lang, setLang])

  // Synchronize <html> lang and page title
  useEffect(() => {
    document.documentElement.lang = lang
    const appTitle = translations[lang]?.app?.title || 'MusicUz'
    document.title = appTitle
  }, [lang])

  // Translation helper function
  const t = useCallback(
    (path, ...args) => {
      const keys = path.split('.')
      let current = translations[lang]

      for (const k of keys) {
        if (current && current[k] !== undefined) {
          current = current[k]
        } else {
          // Fallback to 'uz'
          let fallback = translations['uz']
          for (const fbKey of keys) {
            if (fallback && fallback[fbKey] !== undefined) {
              fallback = fallback[fbKey]
            } else {
              fallback = undefined
              break
            }
          }
          current = fallback !== undefined ? fallback : path
          break
        }
      }

      if (typeof current === 'function') {
        return current(...args)
      }
      return current !== undefined ? current : path
    },
    [lang]
  )

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      t,
    }),
    [lang, setLang, toggleLang, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export default LanguageProvider
