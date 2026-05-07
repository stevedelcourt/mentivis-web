'use client'

import { useEffect, useState } from 'react'
import CookieConsentBanner from '@/components/CookieConsent'

export default function CookieConsentDeferred({ lang }: { lang: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <CookieConsentBanner lang={lang} />
}
