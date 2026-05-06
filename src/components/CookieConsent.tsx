'use client'

import { useEffect } from 'react'
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import * as CookieConsent from 'vanilla-cookieconsent'

type Props = {
  lang: string
}

function updateConsent(categories: string[]) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  if (!w.gtag) return

  const hasAnalytics = categories.includes('analytics')
  const hasMarketing = categories.includes('marketing')

  w.gtag('consent', 'update', {
    ad_storage: hasMarketing ? 'granted' : 'denied',
    analytics_storage: hasAnalytics ? 'granted' : 'denied',
    ad_user_data: hasMarketing ? 'granted' : 'denied',
    ad_personalization: hasMarketing ? 'granted' : 'denied',
  })
}

function handleConsent(cookie: { categories?: string[] }) {
  // Sauvegarder dans localStorage au cas où le cookie est perdu
  try {
    if (cookie.categories && cookie.categories.length > 0) {
      localStorage.setItem('cc_backup', JSON.stringify(cookie))
    }
  } catch {}
  updateConsent(cookie.categories || [])
}

export default function CookieConsentBanner({ lang }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      CookieConsent.run({
        cookie: {
          name: 'cc_cookie',
          path: '/',
          expiresAfterDays: 365,
          secure: window.location.protocol === 'https:',
          sameSite: 'Lax',
        },
        guiOptions: {
          consentModal: {
            layout: 'cloud inline',
            position: 'bottom center',
            equalWeightButtons: true,
            flipButtons: false,
          },
        },
        categories: {
          necessary: {
            enabled: true,
            readOnly: true,
          },
          analytics: {
            autoClear: {
              cookies: [
                { name: /_ga/ },
                { name: '_gid' },
                { name: '_gat' },
              ],
            },
            services: {
              ga: {
                label: 'Google Analytics',
              },
            },
          },
          marketing: {
            enabled: false,
            readOnly: false,
            autoClear: {
              cookies: [
                { name: /_gcl/ },
                { name: '_fbp' },
              ],
            },
            services: {
              google_ads: {
                label: lang === 'fr' ? 'Publicité Google' : 'Google Ads',
              },
            },
          },
        },
        onFirstConsent: ({ cookie }) => {
          handleConsent(cookie)
        },
        onConsent: ({ cookie }) => {
          handleConsent(cookie)
        },
        onChange: ({ cookie }) => {
          handleConsent(cookie)
        },
        language: {
          default: lang === 'en' ? 'en' : 'fr',
          translations: {
            fr: {
              consentModal: {
                title: 'Gestion des cookies',
                description:
                  "Mentivis utilise des cookies pour faire fonctionner le site et améliorer votre navigation. Vous pouvez les accepter ou les configurer librement.",
                acceptAllBtn: 'Tout accepter',
                acceptNecessaryBtn: 'Tout refuser',
                showPreferencesBtn: 'Configurer',
                footer:
                  '<a href="/fr/privacy">Politique de confidentialité</a>',
              },
              preferencesModal: {
                title: 'Gestion des cookies',
                acceptAllBtn: 'Tout accepter',
                acceptNecessaryBtn: 'Tout refuser',
                savePreferencesBtn: 'Enregistrer',
                closeIconLabel: 'Fermer',
                sections: [
                  {
                    description:
                      "Nous utilisons des cookies pour faire fonctionner le site et analyser son usage. Les cookies nécessaires sont toujours actifs. Les autres sont optionnels et configurables selon vos préférences.",
                  },
                  {
                    title: 'Cookies nécessaires',
                    description:
                      "Ces cookies sont essentiels au bon fonctionnement du site et ne peuvent pas être désactivés.",
                    linkedCategory: 'necessary',
                  },
                  {
                    title: 'Analyse et performance',
                    description:
                      "Ces cookies nous permettent de mesurer l'audience et d'améliorer notre site.",
                    linkedCategory: 'analytics',
                  },
                  {
                    title: 'Marketing et publicité personnalisée',
                    description:
                      "Ces cookies permettent de mesurer l'efficacité de nos campagnes publicitaires et de proposer des contenus personnalisés.",
                    linkedCategory: 'marketing',
                  },
                ],
              },
            },
            en: {
              consentModal: {
                title: 'Cookie management',
                description:
                  "Mentivis uses cookies to operate the site and improve your browsing experience. You can accept them or configure them freely.",
                acceptAllBtn: 'Accept all',
                acceptNecessaryBtn: 'Reject all',
                showPreferencesBtn: 'Configure',
                footer:
                  '<a href="/en/privacy">Privacy Policy</a>',
              },
              preferencesModal: {
                title: 'Cookie management',
                acceptAllBtn: 'Accept all',
                acceptNecessaryBtn: 'Reject all',
                savePreferencesBtn: 'Save',
                closeIconLabel: 'Close',
                sections: [
                  {
                    description:
                      "We use cookies to operate the site and analyze usage. Necessary cookies are always active. Others are optional and configurable.",
                  },
                  {
                    title: 'Necessary cookies',
                    description:
                      "These cookies are essential for the site to function properly and cannot be disabled.",
                    linkedCategory: 'necessary',
                  },
                  {
                    title: 'Analytics & performance',
                    description:
                      "These cookies allow us to measure audience and improve our site.",
                    linkedCategory: 'analytics',
                  },
                  {
                    title: 'Marketing & personalized advertising',
                    description:
                      "These cookies help measure the effectiveness of our advertising campaigns and provide personalized content.",
                    linkedCategory: 'marketing',
                  },
                ],
              },
            },
          },
        },
        onModalReady: ({ modalName, modal }) => {
          if (modalName === 'preferencesModal' && modal) {
            const body = modal.querySelector('.pm__body')
            if (body && !body.querySelector('.cc-logo')) {
              const logo = document.createElement('img')
              logo.src = '/logo-noir.svg'
              logo.alt = 'Mentivis'
              logo.className = 'cc-logo'
              logo.style.cssText = 'height:48px;width:auto;margin-bottom:16px;display:block;'
              body.insertBefore(logo, body.firstChild)
            }
          }
        },
      })
    }, 1500)

    ;(window as unknown as { CookieConsent: typeof CookieConsent }).CookieConsent = CookieConsent

    return () => {
      clearTimeout(timer)
      // Don't reset cookie consent on unmount — it causes the banner
      // to reappear on every route change in Next.js App Router.
      // The cookie itself persists via the browser's cookie store.
    }
  }, [lang])

  return null
}
