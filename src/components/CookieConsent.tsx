'use client'

import { useEffect } from 'react'
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import * as CookieConsent from 'vanilla-cookieconsent'

import { GTM_ID } from '@/lib/config'


function initDataLayer() {
  const w = window as unknown as {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
  w.dataLayer = w.dataLayer || []
  function gtag(...args: unknown[]) {
    w.dataLayer.push(args)
  }
  w.gtag = gtag
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  })
}

function loadGTMScript() {
  if (document.getElementById('gtm-script-loaded')) return
  const script = document.createElement('script')
  script.id = 'gtm-script-loaded'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  document.head.appendChild(script)
}

function updateConsent(accepted: boolean) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  if (!w.gtag) return
  w.gtag('consent', 'update', {
    ad_storage: accepted ? 'granted' : 'denied',
    analytics_storage: accepted ? 'granted' : 'denied',
    ad_user_data: accepted ? 'granted' : 'denied',
    ad_personalization: accepted ? 'granted' : 'denied',
  })
}

function handleConsent(cookie: { categories?: string[] }) {
  const hasAnalytics = cookie.categories?.includes('analytics') ?? false
  if (hasAnalytics) {
    loadGTMScript()
    const w = window as unknown as { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] }
    if (w.gtag) {
      w.gtag('js', new Date())
    }
  }
  updateConsent(hasAnalytics)
}

export default function CookieConsentBanner() {
  useEffect(() => {
    initDataLayer()

    CookieConsent.run({
      cookie: {
        name: 'cc_cookie',
        expiresAfterDays: 365,
        secure: true,
        sameSite: 'Strict',
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
        default: 'fr',
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
              ],
            },
          },
        },
      },
      onModalReady: ({ modalName, modal }) => {
        if (modalName === 'preferencesModal') {
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

    ;(window as unknown as { CookieConsent: typeof CookieConsent }).CookieConsent = CookieConsent
  }, [])

  return null
}