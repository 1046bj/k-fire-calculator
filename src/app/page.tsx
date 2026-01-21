'use client';

import { useState } from 'react';
import InputSection from '@/components/InputSection';
import ResultChart from '@/components/ResultChart';
import AiAnalysis from '@/components/AiAnalysis';
import { UserInput, Portfolio, SimulationResult, AIReportData } from '@/types';
import { runSimulation, generateAIReport } from '@/lib/simulation';
import { Target, Zap } from 'lucide-react';

export default function Home() {
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [aiReportData, setAIReportData] = useState<AIReportData | null>(null);
  const [userInput, setUserInput] = useState<UserInput | null>(null);

  const handleCalculate = (input: UserInput, portfolio: Portfolio) => {
    const result = runSimulation(input, portfolio);
    
    // User Plan의 잔여 현금 계산
    const portfolioTotal = Object.values(portfolio).reduce((sum, val) => sum + val, 0);
    const remainingCash = Math.max(0, input.monthlySavings - portfolioTotal);
    
    const report = generateAIReport(result, remainingCash);
    
    setSimulationResult(result);
    setAIReportData(report);
    setUserInput(input);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  한국형 파이어(FIRE) 계산기
                  <span className="text-blue-600">: 연금저축·IRP·ISA 절세 최적화</span>
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  내 저축 습관 vs AI 알고리즘 비교 — <strong className="text-gray-800">비과세·복리·세액공제로 은퇴 시기 10년 앞당기기</strong>
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                AI 최적화 플랜
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Input Section */}
          <div className="lg:col-span-1">
            <InputSection onCalculate={handleCalculate} />
          </div>

          {/* Right Side - Results */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart */}
            <ResultChart result={simulationResult} />

            {/* AI Analysis */}
            {aiReportData && simulationResult && userInput && (
              <AiAnalysis 
                reportData={aiReportData} 
                simulationResult={simulationResult}
                userInput={userInput}
              />
            )}
          </div>
        </div>

        {/* Info Section */}
        {!simulationResult && (
          <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📊 시뮬레이터 사용 방법
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  1
                </div>
                <h3 className="font-semibold text-gray-800">기본 정보 입력</h3>
                <p className="text-sm text-gray-600">
                  현재 나이, 목표 나이, 현재 자산, 월 저축액, 예상 수익률을 입력하세요.
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  2
                </div>
                <h3 className="font-semibold text-gray-800">포트폴리오 배분</h3>
                <p className="text-sm text-gray-600">
                  연금저축, IRP, ISA, 국내주식, 해외주식에 월 저축액을 배분하세요. 한국 법정 한도를 준수해야 합니다.
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  3
                </div>
                <h3 className="font-semibold text-gray-800">결과 비교</h3>
                <p className="text-sm text-gray-600">
                  시뮬레이션을 실행하면 사용자 플랜과 AI 최적화 플랜을 비교하여 절세 효과를 확인할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-3">⚖️ 한국 법정 한도</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>연금저축 + IRP:</strong> 월 150만원 (연 1,800만원) 한도
                </li>
                <li>
                  <strong>ISA:</strong> 월 166만원 (연 2,000만원) 한도
                </li>
                <li>
                  <strong>세액공제:</strong> 연금저축/IRP 납입액의 13.2% (연 최대 237.6만원)
                </li>
                <li>
                  <strong>ISA 만기:</strong> 3년 만기 시 순수익 200만원 비과세, 초과분 9.9% 분리과세
                </li>
                <li>
                  <strong>ISA 전환:</strong> 만기 자금을 연금저축으로 전환 시 전환 금액의 10% (최대 300만원) 추가 세액공제
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          <p>
            한국형 FIRE 시뮬레이터 © 2024 | 
            <span className="ml-2">본 시뮬레이터는 참고용이며, 실제 투자 결정은 전문가와 상담하시기 바랍니다.</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
