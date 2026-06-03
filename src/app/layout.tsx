import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { getMetadataBaseUrl } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "테스트/사주/유형 - 통합 플랫폼",
    template: "%s | 테스트/사주/유형",
  },
  description:
    "심리 테스트, 사주/운세, MBTI·성격 유형 검사를 한 곳에서 즐기는 반응형 플랫폼",
  metadataBase: getMetadataBaseUrl(),
  openGraph: {
    locale: "ko_KR",
    type: "website",
    siteName: "테스트/사주/유형",
  },
};

const themeScript = `
(function(){
  try {
    var k='theme-preference';
    var t=localStorage.getItem(k);
    var dark=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
    var c=dark?'dark':'light';
    document.documentElement.classList.remove('light','dark');
    document.documentElement.classList.add(c);
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
