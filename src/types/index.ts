/**
 * 한국형 FIRE 시뮬레이터 타입 정의
 */

// 사용자 기본 정보
export interface UserInput {
  currentAge: number;
  targetAge: number;
  targetAssets: number; // 목표 자산 (만원 단위)
  currentAssets: number; // 만원 단위
  monthlySavings: number; // 만원 단위
  expectedReturnRate: number; // 연 수익률 (%)
}

// 포트폴리오 배분 (월 납입액, 만원 단위)
export interface Portfolio {
  pension: number; // 연금저축
  irp: number; // IRP
  isa: number; // ISA
  domestic: number; // 국내주식
  overseas: number; // 해외주식
}

// 연도별 시뮬레이션 결과
export interface YearlyResult {
  age: number;
  year: number; // 시뮬레이션 시작 후 경과 연수
  totalAssets: number; // 총 자산 (만원)
  breakdown: {
    pension: number;
    irp: number;
    isa: number;
    domestic: number;
    overseas: number;
    remainingCash?: number; // 잔여 현금 (일반 과세 계좌, 만원)
  };
  taxBenefits: {
    taxDeduction: number; // 세액공제 금액 (만원)
    taxDeferred: number; // 과세이연 효과 (만원)
    dividendTax: number; // 배당소득세 (만원)
    cashAccountTax?: number; // 잔여 현금 계좌 세금 (만원)
  };
}

// 시나리오별 전체 결과
export interface SimulationResult {
  userPlan: YearlyResult[];
  aiPlan: YearlyResult[];
  summary: {
    finalAssetDifference: number; // 최종 자산 차이 (만원)
    totalTaxDeductionDifference: number; // 총 세액공제 차이 (만원)
    totalTaxDeferredDifference: number; // 총 과세이연 효과 차이 (만원)
  };
}

// AI 리포트 분석 데이터
export interface AIReportData {
  taxDeductionBenefit: number; // 세액공제 재투자 효과 (만원)
  taxDeferredBenefit: number; // 과세이연 효과 (만원)
  isaOptimizationBenefit: number; // ISA 만기 전환 최적화 효과 (만원)
  overseasStockBenefit: number; // 해외주식 과세이연 효과 (만원)
  surplusOpportunityCost: number; // 잔여 현금 기회비용 (만원)
  totalBenefit: number; // 총 효과 (만원)
}

// 한국 법정 한도 상수
export const LEGAL_LIMITS = {
  PENSION_IRP_MONTHLY: 150, // 연금저축 + IRP 월 한도 (만원)
  PENSION_IRP_YEARLY: 1800, // 연금저축 + IRP 연 한도 (만원)
  ISA_MONTHLY: 166, // ISA 월 한도 (만원, 연 2000만원 기준)
  ISA_YEARLY: 2000, // ISA 연 한도 (만원)
  TAX_DEDUCTION_RATE: 0.132, // 세액공제율 13.2%
  ISA_MATURITY_TAX_FREE: 200, // ISA 만기 비과세 한도 (만원)
  ISA_MATURITY_TAX_RATE: 0.099, // ISA 만기 초과분 세율 9.9%
  ISA_TRANSFER_TAX_DEDUCTION_RATE: 0.10, // ISA 전환 시 세액공제율 10%
  ISA_TRANSFER_TAX_DEDUCTION_MAX: 300, // ISA 전환 시 최대 세액공제 (만원)
  DIVIDEND_TAX_RATE: 0.154, // 배당소득세율 15.4%
  DIVIDEND_YIELD: 0.015, // 배당 수익률 1.5%
  ISA_MATURITY_YEARS: 3, // ISA 만기 기간 (년)
  CASH_ACCOUNT_TAX_RATE: 0.154, // 일반 현금 계좌 세율 15.4% (수익에 대한 세금)
} as const;
