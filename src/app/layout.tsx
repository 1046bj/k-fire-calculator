import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '한국형 파이어(FIRE) 계산기: 연금저축·IRP·ISA 절세 최적화',
  description: '현재 자산, 주식 수익률, 생활비를 기반으로 당신의 조기은퇴 시점을 계산해보세요. 연금저축, IRP, ISA 등 한국식 절세 계좌를 반영한 가장 정확한 파이어족 시뮬레이터입니다.',
  keywords: ['파이어족 계산기', '은퇴 시뮬레이션', '연금저축계좌', 'IRP', 'ISA 절세', '조기은퇴 준비'],
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
    title: '한국형 파이어(FIRE) 계산기: 연금저축·IRP·ISA 절세 최적화',
    description: '현재 자산, 주식 수익률, 생활비를 기반으로 당신의 조기은퇴 시점을 계산해보세요. 연금저축, IRP, ISA 등 한국식 절세 계좌를 반영한 가장 정확한 파이어족 시뮬레이터입니다.',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://fire-simulator-with-stocks.vercel.app',
    siteName: '한국형 FIRE 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '한국형 파이어(FIRE) 계산기: 연금저축·IRP·ISA 절세 최적화',
    description: '현재 자산, 주식 수익률, 생활비를 기반으로 당신의 조기은퇴 시점을 계산해보세요.',
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fire-simulator-with-stocks.vercel.app'
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '한국형 파이어(FIRE) 계산기',
    description: '현재 자산, 주식 수익률, 생활비를 기반으로 당신의 조기은퇴 시점을 계산해보세요. 연금저축, IRP, ISA 등 한국식 절세 계좌를 반영한 가장 정확한 파이어족 시뮬레이터입니다.',
    url: baseUrl,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
    },
    featureList: [
      '연금저축계좌 시뮬레이션',
      'IRP 절세 계산',
      'ISA 절세 최적화',
      '조기은퇴 시점 계산',
      '파이어족 로드맵 제시',
    ],
  }

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
