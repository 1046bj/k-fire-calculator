'use client';

import { AIReportData, UserInput, SimulationResult } from '@/types';
import { Sparkles, Shield, TrendingUp, DollarSign, AlertTriangle, Target, PiggyBank, CheckCircle2 } from 'lucide-react';

interface AiAnalysisProps {
  reportData: AIReportData | null;
  simulationResult: SimulationResult | null;
  userInput: UserInput | null;
}

/**
 * PMT 공식으로 필요한 월 저축액 계산
 * PMT = (Gap * r) / ((1+r)^n - 1)
 */
function calculateRequiredMonthlySavings(
  gap: number,
  monthlyRate: number,
  months: number
): number {
  if (monthlyRate === 0) {
    // 이자율이 0이면 단순히 갭을 개월수로 나눔
    return gap / months;
  }
  
  const numerator = gap * monthlyRate;
  const denominator = Math.pow(1 + monthlyRate, months) - 1;
  
  if (denominator === 0) {
    return gap / months;
  }
  
  return numerator / denominator;
}

export default function AiAnalysis({ reportData, simulationResult, userInput }: AiAnalysisProps) {
  if (!reportData || !simulationResult || !userInput) {
    return null;
  }

  // 목표 달성 분석
  const targetAssets = userInput.targetAssets;
  const aiTotal = simulationResult.aiPlan[simulationResult.aiPlan.length - 1]?.totalAssets || 0;
  const achievementRate = targetAssets > 0 ? (aiTotal / targetAssets) * 100 : 0;
  
  let achievementStatus: 'success' | 'close' | 'gap';
  if (achievementRate >= 100) {
    achievementStatus = 'success';
  } else if (achievementRate >= 80) {
    achievementStatus = 'close';
  } else {
    achievementStatus = 'gap';
  }

  // 필요한 월 저축액 계산 (목표 미달성 시)
  let requiredMonthlySavings: number | null = null;
  let returnRateAdvice: string | null = null;
  
  if (achievementStatus !== 'success' && targetAssets > 0) {
    const gap = targetAssets - aiTotal;
    const months = (userInput.targetAge - userInput.currentAge) * 12;
    const monthlyRate = userInput.expectedReturnRate / 12 / 100;
    
    requiredMonthlySavings = calculateRequiredMonthlySavings(gap, monthlyRate, months);
    
    // 수익률 조언
    if (userInput.expectedReturnRate < 8) {
      returnRateAdvice = `현재 목표 수익률(${userInput.expectedReturnRate}%)이 보수적입니다. S&P500(평균 10%) 또는 나스닥(평균 14%)에 노출을 늘리면 목표 달성에 도움이 될 수 있습니다.`;
    } else if (userInput.expectedReturnRate >= 10) {
      returnRateAdvice = `현재 수익률 목표(${userInput.expectedReturnRate}%)는 이미 공격적입니다. 저축액을 늘리거나 은퇴 시기를 늦추는 것을 고려해보세요.`;
    } else {
      returnRateAdvice = `수익률 목표를 ${Math.ceil((targetAssets / aiTotal) ** (1 / (userInput.targetAge - userInput.currentAge)) * 100 - 100)}%로 높이면 목표 달성에 도움이 될 수 있습니다.`;
    }
  }

  const benefits = [
    {
      icon: AlertTriangle,
      title: '잔여 현금 기회비용',
      value: reportData.surplusOpportunityCost,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: '일반 현금 계좌에 남겨둔 돈이 AI 최적화 플랜에서 얻을 수 있었던 수익',
      highlight: true,
    },
    {
      icon: DollarSign,
      title: '세액공제 재투자 효과',
      value: reportData.taxDeductionBenefit,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: '연금저축 및 IRP 세액공제를 재투자하여 얻은 수익',
    },
    {
      icon: Shield,
      title: '과세이연 효과',
      value: reportData.taxDeferredBenefit,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: '해외주식 Buy & Hold 전략으로 양도소득세 과세이연 효과',
    },
    {
      icon: Sparkles,
      title: 'ISA 만기 전환 최적화',
      value: reportData.isaOptimizationBenefit,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'ISA 만기 시 연금저축 전환으로 추가 세액공제 획득',
    },
    {
      icon: TrendingUp,
      title: '해외주식 과세이연',
      value: reportData.overseasStockBenefit,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: '해외주식 장기 보유로 인한 과세이연 효과',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">AI 분석 리포트</h2>
      </div>

      {/* 목표 달성 분석 - Progress Bar */}
      {targetAssets > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">목표 달성 분석</h3>
            </div>
            <span className={`text-lg font-bold ${
              achievementStatus === 'success' ? 'text-green-600' :
              achievementStatus === 'close' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {achievementRate.toFixed(1)}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-6 mb-3">
            <div
              className={`h-6 rounded-full transition-all duration-500 ${
                achievementStatus === 'success' ? 'bg-green-500' :
                achievementStatus === 'close' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(achievementRate, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>AI 예상 자산: {aiTotal.toLocaleString()}만원</span>
            <span>목표 자산: {targetAssets.toLocaleString()}만원</span>
          </div>

          {/* 성공 메시지 */}
          {achievementStatus === 'success' && (
            <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-lg font-bold text-green-800">FIRE 목표 달성 예상! 🔥</p>
                  <p className="text-sm text-green-700 mt-1">
                    AI 최적화 플랜으로 목표 자산을 달성할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Strategic Advisor - 목표 미달성 시 */}
      {achievementStatus !== 'success' && targetAssets > 0 && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">전략 조언</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option 1: 월 저축액 증가 */}
            {requiredMonthlySavings !== null && requiredMonthlySavings > 0 && (
              <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
                <div className="flex items-start gap-3">
                  <PiggyBank className="w-6 h-6 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">💰 옵션 1: 월 저축액 증가</h4>
                    <p className="text-2xl font-bold text-blue-600 mb-2">
                      +{Math.ceil(requiredMonthlySavings).toLocaleString()}만원/월
                    </p>
                    <p className="text-sm text-gray-600">
                      목표 달성을 위해 매월 <strong>{Math.ceil(requiredMonthlySavings).toLocaleString()}만원</strong>을 추가로 저축하시면 됩니다.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Option 2: 수익률 조정 */}
            {returnRateAdvice && (
              <div className="bg-white p-4 rounded-lg border-2 border-purple-300">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-purple-600 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">📈 옵션 2: 포트폴리오 조정</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {returnRateAdvice}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 잔여 현금 기회비용 강조 */}
      {reportData.surplusOpportunityCost > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 p-6 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-8 h-8 text-red-600 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-800 mb-2">
                💸 잔여 현금 기회비용
              </h3>
              <p className="text-3xl font-bold text-red-600 mb-3">
                -{reportData.surplusOpportunityCost.toLocaleString()}만원
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                사용자 플랜에서 포트폴리오에 배분하지 않은 잔여 현금이 일반 계좌(15.4% 세금)에 남아있었습니다. 
                AI 최적화 플랜은 이 잔여 현금을 해외주식 등 세금 혜택이 있는 상품에 투자하여 
                <strong className="text-red-700"> {reportData.surplusOpportunityCost.toLocaleString()}만원</strong>의 
                추가 수익을 얻었습니다.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div
              key={index}
              className={`${benefit.bgColor} p-5 rounded-lg border-2 ${
                benefit.highlight ? 'border-red-300' : 'border-transparent'
              } hover:border-gray-300 transition-all duration-200`}
            >
              <div className="flex items-start gap-3">
                <div className={`${benefit.color} bg-white p-2 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{benefit.title}</h3>
                  <p className={`text-2xl font-bold ${benefit.color} mb-2`}>
                    {benefit.highlight ? '-' : '+'}{benefit.value.toLocaleString()}만원
                  </p>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 총 효과 */}
      <div className="mt-6 pt-6 border-t-2 border-gray-200">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">AI 최적화 플랜 총 효과</p>
              <p className="text-4xl font-bold">
                +{reportData.totalBenefit.toLocaleString()}만원
              </p>
              <p className="text-blue-100 text-sm mt-2">
                절세 전략으로 추가로 얻은 자산
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-sm text-blue-100">증가율</p>
                <p className="text-2xl font-bold">
                  {reportData.totalBenefit > 0 
                    ? `+${((reportData.totalBenefit / (reportData.totalBenefit + Math.abs(reportData.totalBenefit))) * 100).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 핵심 인사이트 */}
      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <h3 className="font-semibold text-gray-800 mb-2">💡 핵심 인사이트</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {reportData.surplusOpportunityCost > 0 && (
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span>
                <strong>잔여 현금 최적화:</strong> 포트폴리오에 배분하지 않은 잔여 현금도 효율적으로 투자하면 
                일반 계좌의 높은 세금(15.4%)을 피하고 추가 수익을 얻을 수 있습니다.
              </span>
            </li>
          )}
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold">•</span>
            <span>
              <strong>세액공제 재투자:</strong> 연금저축과 IRP의 세액공제를 매년 재투자하면 복리 효과로 자산이 크게 증가합니다.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold">•</span>
            <span>
              <strong>ISA 만기 전환:</strong> ISA 3년 만기 시 연금저축으로 전환하면 추가 세액공제(최대 300만원)를 받을 수 있습니다.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold">•</span>
            <span>
              <strong>해외주식 과세이연:</strong> 해외주식을 매도하지 않고 보유하면 양도소득세를 나중에 내게 되어 과세이연 효과가 발생합니다.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
