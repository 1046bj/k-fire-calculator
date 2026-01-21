'use client';

import { AIReportData } from '@/types';
import { Sparkles, Shield, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

interface AIReportProps {
  reportData: AIReportData | null;
}

export default function AIReport({ reportData }: AIReportProps) {
  if (!reportData) {
    return null;
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
        <h2 className="text-2xl font-bold text-gray-800">AI가 이긴 이유 분석</h2>
      </div>

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
