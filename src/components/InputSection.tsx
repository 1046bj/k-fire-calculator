'use client';

import { useState, useEffect } from 'react';
import { UserInput, Portfolio, LEGAL_LIMITS } from '@/types';
import { Calculator, AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface InputSectionProps {
  onCalculate: (input: UserInput, portfolio: Portfolio) => void;
}

// 천 단위 구분 기호 포맷팅 유틸리티 (정수로 반올림)
const formatNumberWithCommas = (value: number | string): string => {
  if (value === '' || value === null || value === undefined) return '';
  const numStr = typeof value === 'string' ? value.replace(/,/g, '') : value.toString();
  if (numStr === '') return '';
  const num = parseFloat(numStr);
  if (isNaN(num) || num < 0) return '';
  return Math.floor(num).toLocaleString('ko-KR');
};

const parseFormattedNumber = (value: string): number => {
  if (!value || value === '') return 0;
  const cleaned = value.replace(/,/g, '').trim();
  if (cleaned === '') return 0;
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.max(0, num);
};

export default function InputSection({ onCalculate }: InputSectionProps) {
  const [userInput, setUserInput] = useState<UserInput>({
    currentAge: 30,
    targetAge: 55,
    targetAssets: 0,
    currentAssets: 0,
    monthlySavings: 100,
    expectedReturnRate: 7,
  });

  const [portfolio, setPortfolio] = useState<Portfolio>({
    pension: 0,
    irp: 0,
    isa: 0,
    domestic: 0,
    overseas: 0,
  });

  // 포맷팅 상태 제거 - 직접 숫자 값 사용

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [showReturnRateTooltip, setShowReturnRateTooltip] = useState(false);

  // 잔여 금액 계산
  useEffect(() => {
    const total = Object.values(portfolio).reduce((sum, val) => sum + val, 0);
    const remaining = userInput.monthlySavings - total;
    setRemainingAmount(remaining);
  }, [portfolio, userInput.monthlySavings]);

  // 유효성 검사
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 기본 정보 검증
    if (userInput.currentAge < 0 || userInput.currentAge > 100) {
      newErrors.currentAge = '나이는 0-100 사이여야 합니다.';
    }
    if (userInput.targetAge <= userInput.currentAge) {
      newErrors.targetAge = '목표 나이는 현재 나이보다 커야 합니다.';
    }
    if (userInput.targetAssets < 0) {
      newErrors.targetAssets = '목표 자산은 0 이상이어야 합니다.';
    }
    if (userInput.currentAssets < 0) {
      newErrors.currentAssets = '현재 자산은 0 이상이어야 합니다.';
    }
    if (userInput.monthlySavings <= 0) {
      newErrors.monthlySavings = '월 저축액은 0보다 커야 합니다.';
    }
    if (userInput.expectedReturnRate < 0 || userInput.expectedReturnRate > 50) {
      newErrors.expectedReturnRate = '예상 수익률은 0-50% 사이여야 합니다.';
    }

    // 포트폴리오 검증
    const pensionIrpTotal = portfolio.pension + portfolio.irp;
    if (pensionIrpTotal > LEGAL_LIMITS.PENSION_IRP_MONTHLY) {
      newErrors.pensionIrp = `연금저축 + IRP는 월 ${LEGAL_LIMITS.PENSION_IRP_MONTHLY}만원을 초과할 수 없습니다.`;
    }

    if (portfolio.isa > LEGAL_LIMITS.ISA_MONTHLY) {
      newErrors.isa = `ISA는 월 ${LEGAL_LIMITS.ISA_MONTHLY}만원을 초과할 수 없습니다.`;
    }

    // Surplus 검증: 합계가 월 저축액보다 크면 차단
    const portfolioTotal = Object.values(portfolio).reduce((sum, val) => sum + val, 0);
    if (portfolioTotal > userInput.monthlySavings) {
      newErrors.portfolioTotal = `포트폴리오 합계(${portfolioTotal.toLocaleString()}만원)가 월 저축액(${userInput.monthlySavings.toLocaleString()}만원)을 초과할 수 없습니다.`;
    }

    // 개별 항목 음수 검증
    Object.entries(portfolio).forEach(([key, value]) => {
      if (value < 0) {
        newErrors[key] = '0 이상의 값을 입력해주세요.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UserInput, value: number) => {
    setUserInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormattedInputChange = (
    field: 'targetAssets' | 'currentAssets' | 'monthlySavings',
    value: string
  ) => {
    // 숫자만 추출
    const numValue = value === '' ? 0 : Number(value.replace(/[^0-9]/g, '')) || 0;
    handleInputChange(field, numValue);
  };

  const handlePortfolioChange = (field: keyof Portfolio, value: number) => {
    setPortfolio((prev) => ({ ...prev, [field]: Math.max(0, value) }));
  };

  const handleFormattedPortfolioChange = (
    field: keyof Portfolio,
    value: string
  ) => {
    // 숫자만 추출
    const numValue = value === '' ? 0 : Number(value.replace(/[^0-9]/g, '')) || 0;
    handlePortfolioChange(field, numValue);
  };

  const handleCalculate = () => {
    if (validate()) {
      onCalculate(userInput, portfolio);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">입력 정보</h2>
      </div>

      {/* 기본 정보 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">기본 정보</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">
              현재 나이
            </label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={userInput.currentAge}
              onChange={(e) => handleInputChange('currentAge', Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.currentAge && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.currentAge}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">
              목표 나이 (FIRE)
            </label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={userInput.targetAge}
              onChange={(e) => handleInputChange('targetAge', Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.targetAge && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.targetAge}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">
              목표 자산 (만원)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={userInput.targetAssets}
              onChange={(e) => handleInputChange('targetAssets', Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.targetAssets && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.targetAssets}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">
              현재 자산 (만원)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={userInput.currentAssets}
              onChange={(e) => handleInputChange('currentAssets', Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.currentAssets && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.currentAssets}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">
              월 저축액 (만원)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={userInput.monthlySavings}
              onChange={(e) => handleInputChange('monthlySavings', Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.monthlySavings && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.monthlySavings}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1 mb-1">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                예상 연수익률 (%)
              </label>
              <div className="relative">
                <Info 
                  className="w-4 h-4 text-gray-400 hover:text-blue-600 cursor-help flex-shrink-0"
                  onMouseEnter={() => setShowReturnRateTooltip(true)}
                  onMouseLeave={() => setShowReturnRateTooltip(false)}
                />
                {showReturnRateTooltip && (
                  <div className="absolute left-0 top-6 z-10 w-64 bg-gray-100 border border-gray-300 rounded-md p-2 text-xs text-gray-700 shadow-lg">
                    <p className="font-semibold mb-1">역사적 벤치마크:</p>
                    <ul className="space-y-0.5">
                      <li>• SPY (S&P500): 평균 ~10% /년</li>
                      <li>• QQQ (Nasdaq100): 평균 ~14% /년</li>
                      <li>• SCHD (Dividend): 평균 ~11% /년</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={userInput.expectedReturnRate}
              onChange={(e) => handleInputChange('expectedReturnRate', Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.expectedReturnRate && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.expectedReturnRate}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 포트폴리오 배분 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
          사용자 포트폴리오 배분 (월 납입액, 만원)
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              연금저축 (월 한도: {LEGAL_LIMITS.PENSION_IRP_MONTHLY}만원)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={portfolio.pension}
              onChange={(e) => handlePortfolioChange('pension', Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-blue-600 mt-1">
              연 한도: 1,800만원 (세액공제 한도: 600만원)
            </p>
            {errors.pension && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.pension}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IRP (연금저축 + IRP 합계 한도: {LEGAL_LIMITS.PENSION_IRP_MONTHLY}만원)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={portfolio.irp}
              onChange={(e) => handlePortfolioChange('irp', Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-blue-600 mt-1">
              연 한도: 1,800만원 (합산 세액공제 최대: 900만원)
            </p>
            {errors.irp && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.irp}
              </p>
            )}
            {errors.pensionIrp && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.pensionIrp}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISA (월 한도: {LEGAL_LIMITS.ISA_MONTHLY}만원)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={portfolio.isa}
              onChange={(e) => handlePortfolioChange('isa', Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-blue-600 mt-1">
              연 한도: 2,000만원 (총 누적 한도: 10,000만원)
            </p>
            {errors.isa && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.isa}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              국내주식
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={portfolio.domestic}
              onChange={(e) => handlePortfolioChange('domestic', Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.domestic && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.domestic}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              해외주식
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={portfolio.overseas}
              onChange={(e) => handlePortfolioChange('overseas', Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.overseas && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.overseas}
              </p>
            )}
          </div>
        </div>

        {/* 잔여 금액 표시 */}
        {remainingAmount > 0 ? (
          <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800 mb-1">
                  잔여 금액: {remainingAmount.toLocaleString()}만원
                </p>
                <p className="text-xs text-yellow-700">
                  이 금액은 일반 현금 계좌(높은 세금 부과)로 가정됩니다. AI 최적화 플랜은 이 잔여 금액도 효율적으로 투자합니다.
                </p>
              </div>
            </div>
          </div>
        ) : remainingAmount < 0 ? (
          <div className="p-3 rounded-md bg-red-50 border border-red-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm font-medium text-red-700">
                포트폴리오 합계가 월 저축액을 초과합니다. ({Math.abs(remainingAmount).toLocaleString()}만원 초과)
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-md bg-green-50 border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                완벽하게 배분되었습니다!
              </span>
            </div>
          </div>
        )}

        {errors.portfolioTotal && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.portfolioTotal}
          </p>
        )}
      </div>

      {/* 계산 버튼 */}
      <button
        onClick={handleCalculate}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <Calculator className="w-5 h-5" />
        시뮬레이션 실행
      </button>
    </div>
  );
}
