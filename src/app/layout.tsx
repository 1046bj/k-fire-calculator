import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '한국형 파이어(FIRE) 계산기 | 연금저축·ISA 절세 최적화 시뮬레이터',
  description: '내 저축 습관 vs AI 알고리즘 비교. 연금저축, IRP, ISA, 과세이연 효과를 분석하여 가장 빠른 조기은퇴(FIRE) 로드맵을 제시합니다.',
  keywords: ['연금저축', 'ISA', 'IRP', '파이어족', '조기은퇴', '절세 계산기', '복리 계산기', 'K-FIRE', '파이어 계산기', '조기은퇴 계산기', '절세 시뮬레이터'],
  authors: [{ name: 'Korean FIRE Simulator' }],
  creator: 'Korean FIRE Simulator',
  publisher: 'Korean FIRE Simulator',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://fire-simulator-with-stocks.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '한국형 파이어(FIRE) 계산기 | 연금저축·ISA 절세 최적화 시뮬레이터',
    description: '내 저축 습관 vs AI 알고리즘 비교. 연금저축, IRP, ISA, 과세이연 효과를 분석하여 가장 빠른 조기은퇴(FIRE) 로드맵을 제시합니다.',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://fire-simulator-with-stocks.vercel.app',
    siteName: '한국형 FIRE 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '한국형 파이어(FIRE) 계산기',
    description: '내 저축 습관 vs AI 알고리즘 비교. 절세 전략으로 조기은퇴 시기 10년 앞당기기',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || 'QNd8tgIQzUsrFDrnLwgAj9lZHHnuvE9TIkU1AtTImPI',
    other: {
      'naver-site-verification': process.env.NEXT_PUBLIC_NAVER_VERIFICATION || 'a4fa1bc1f9b35e81bb06d187f36277619fe3f9af',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
