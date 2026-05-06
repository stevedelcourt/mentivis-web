import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mentivis",
};

const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${ibmPlexSans.variable} ${jetBrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }} />
        {/* Hydration recovery: if React #418 or hydration mismatch is detected,
            hard-reload with a cache-busting query param to bypass stale CDN HTML. */}
        <script dangerouslySetInnerHTML={{ __html: `
(function(){
  if(location.search.includes('__nc='))return;
  var origError=console.error;
  console.error=function(){
    var msg=Array.prototype.slice.call(arguments).join(' ');
    if(msg.indexOf('418')!==-1||msg.indexOf('Hydration')!==-1){
      if(!window.__MENTIVIS_HYDRATION_RELOAD){
        window.__MENTIVIS_HYDRATION_RELOAD=true;
        location.href=location.href.split('?')[0]+'?__nc='+Date.now();
      }
    }
    origError.apply(console,arguments);
  };
})();
        ` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
