/**
 * 한국형 FIRE 시뮬레이션 로직
 * User Plan vs AI Optimal Plan 비교 계산
 * Production-ready with strict order of operations
 */

import {
  UserInput,
  Portfolio,
  YearlyResult,
  SimulationResult,
  AIReportData,
  LEGAL_LIMITS,
} from '@/types';

/**
 * AI 최적화 포트폴리오 생성 (Waterfall Logic)
 * 전체 monthlySavings를 최적화하여 배분
 */
export function generateAIOptimalPortfolio(monthlySavings: number): Portfolio {
  const portfolio: Portfolio = {
    pension: 0,
    irp: 0,
    isa: 0,
    domestic: 0,
    overseas: 0,
  };

  let remaining = monthlySavings;

  // 1. 연금저축: 월 50만원 (연 600만원, 세액공제 최대)
  const pension1 = Math.min(remaining, 50);
  portfolio.pension += pension1;
  remaining -= pension1;

  // 2. IRP: 월 25만원 (연 300만원, 합산공제 최대 900만원)
  const irp1 = Math.min(remaining, 25);
  portfolio.irp += irp1;
  remaining -= irp1;

  // 3. ISA: 월 83만원 (연 1,000만원, 3년 만기 시 연금전환 최적화용)
  const isa1 = Math.min(remaining, 83);
  portfolio.isa += isa1;
  remaining -= isa1;

  // 4. 연금저축 추가: 월 75만원 (연 1,800만원 한도 채움, 과세이연 목적)
  const pensionLimit = LEGAL_LIMITS.PENSION_IRP_MONTHLY - portfolio.irp;
  const pension2 = Math.min(remaining, Math.max(0, pensionLimit - portfolio.pension));
  portfolio.pension += pension2;
  remaining -= pension2;

  // 5. ISA 추가: 월 83만원 (연 2,000만원 한도 채움)
  const isaLimit = LEGAL_LIMITS.ISA_MONTHLY - portfolio.isa;
  const isa2 = Math.min(remaining, isaLimit);
  portfolio.isa += isa2;
  remaining -= isa2;

  // 6. 해외주식: 남는 돈 전액 (고성장 과세이연)
  portfolio.overseas = remaining;

  return portfolio;
}

/**
 * 전체 시뮬레이션 실행 (Production-ready with strict order of operations)
 */
export function runSimulation(
  input: UserInput,
  userPortfolio: Portfolio
): SimulationResult {
  const years = input.targetAge - input.currentAge;
  const userPlan: YearlyResult[] = [];
  const aiPlan: YearlyResult[] = [];
  
  // User Plan의 잔여 현금 계산
  const portfolioTotal = Object.values(userPortfolio).reduce((sum, val) => sum + val, 0);
  const remainingCash = Math.max(0, input.monthlySavings - portfolioTotal);
  
  // AI Plan: 전체 monthlySavings를 최적화
  const aiPortfolio = generateAIOptimalPortfolio(input.monthlySavings);
  
  // 내부 상태 추적 (ISA 만기 사이클용)
  interface AccountState {
    pension: number;
    irp: number;
    isa: number;
    domestic: number;
    overseas: number;
    remainingCash: number;
    isaStartYear: number; // AI만 사용: ISA 만기 사이클 추적 (1, 2, 3)
  }
  
  // Year 0: 초기 상태
  let userState: AccountState = {
    pension: userPortfolio.pension * 12,
    irp: userPortfolio.irp * 12,
    isa: userPortfolio.isa * 12,
    domestic: userPortfolio.domestic * 12 + input.currentAssets,
    overseas: userPortfolio.overseas * 12,
    remainingCash: remainingCash * 12,
    isaStartYear: 0, // User는 사용 안 함
  };
  
  let aiState: AccountState = {
    pension: aiPortfolio.pension * 12,
    irp: aiPortfolio.irp * 12,
    isa: aiPortfolio.isa * 12,
    domestic: aiPortfolio.domestic * 12 + input.currentAssets,
    overseas: aiPortfolio.overseas * 12,
    remainingCash: 0,
    isaStartYear: 1, // AI ISA 시작 연도
  };
  
  // Year 0 세액공제 및 배당 처리
  const year0TaxDeductionUser = (userPortfolio.pension + userPortfolio.irp) * 12 * LEGAL_LIMITS.TAX_DEDUCTION_RATE;
  const year0TaxDeductionAI = (aiPortfolio.pension + aiPortfolio.irp) * 12 * LEGAL_LIMITS.TAX_DEDUCTION_RATE;
  userState.pension += year0TaxDeductionUser;
  aiState.pension += year0TaxDeductionAI;
  
  const year0DividendUser = userState.overseas * LEGAL_LIMITS.DIVIDEND_YIELD;
  const year0DividendAI = aiState.overseas * LEGAL_LIMITS.DIVIDEND_YIELD;
  const year0DividendTaxUser = year0DividendUser * LEGAL_LIMITS.DIVIDEND_TAX_RATE;
  const year0DividendTaxAI = year0DividendAI * LEGAL_LIMITS.DIVIDEND_TAX_RATE;
  userState.overseas += year0DividendUser - year0DividendTaxUser;
  aiState.overseas += year0DividendAI - year0DividendTaxAI;
  
  // Year 0 결과 기록
  const year0UserTotal = Math.floor(
    userState.pension + userState.irp + userState.isa + 
    userState.domestic + userState.overseas + (userState.remainingCash || 0)
  );
  const year0AITotal = Math.floor(
    aiState.pension + aiState.irp + aiState.isa + 
    aiState.domestic + aiState.overseas + (aiState.remainingCash || 0)
  );
  
  userPlan.push({
    age: input.currentAge,
    year: 0,
    totalAssets: year0UserTotal,
    breakdown: {
      pension: Math.floor(userState.pension),
      irp: Math.floor(userState.irp),
      isa: Math.floor(userState.isa),
      domestic: Math.floor(userState.domestic),
      overseas: Math.floor(userState.overseas),
      remainingCash: Math.floor(userState.remainingCash),
    },
    taxBenefits: {
      taxDeduction: Math.floor(year0TaxDeductionUser),
      taxDeferred: 0,
      dividendTax: Math.floor(year0DividendTaxUser),
      cashAccountTax: 0,
    },
  });
  
  aiPlan.push({
    age: input.currentAge,
    year: 0,
    totalAssets: year0AITotal,
    breakdown: {
      pension: Math.floor(aiState.pension),
      irp: Math.floor(aiState.irp),
      isa: Math.floor(aiState.isa),
      domestic: Math.floor(aiState.domestic),
      overseas: Math.floor(aiState.overseas),
    },
    taxBenefits: {
      taxDeduction: Math.floor(year0TaxDeductionAI),
      taxDeferred: 0,
      dividendTax: Math.floor(year0DividendTaxAI),
    },
  });
  
  // Year 1 to duration: 엄격한 순서로 처리
  for (let year = 1; year <= years; year++) {
    const age = input.currentAge + year;
    const rate = input.expectedReturnRate / 100;
    
    // ============================================
    // STEP 1: Compound Interest Calculation (Grow First)
    // ============================================
    
    // User: 복리 계산
    // Pension, IRP, ISA: 세액공제 계좌이므로 세금 없음 (과세이연)
    const userPensionGrown = userState.pension * (1 + rate);
    const userIrpGrown = userState.irp * (1 + rate);
    const userIsaGrown = userState.isa * (1 + rate);
    
    // Overseas: Buy & Hold 전략으로 과세이연 (매도 시까지 세금 없음)
    const userOverseasGrown = userState.overseas * (1 + rate);
    
    // Domestic & Cash: 일반 과세 계좌 - 매년 수익에 15.4% 세금 적용 (Tax Drag)
    // Formula: Balance * (1 + Rate * (1 - TaxRate))
    const userDomesticAfterTax = userState.domestic * (1 + rate * (1 - LEGAL_LIMITS.CASH_ACCOUNT_TAX_RATE));
    const userDomesticTax = userState.domestic * rate * LEGAL_LIMITS.CASH_ACCOUNT_TAX_RATE;
    
    const userCashAfterTax = (userState.remainingCash || 0) * (1 + rate * (1 - LEGAL_LIMITS.CASH_ACCOUNT_TAX_RATE));
    const userCashTax = (userState.remainingCash || 0) * rate * LEGAL_LIMITS.CASH_ACCOUNT_TAX_RATE;
    
    // AI: 복리 계산 (세금 없음, 과세이연)
    const aiPensionGrown = aiState.pension * (1 + rate);
    const aiIrpGrown = aiState.irp * (1 + rate);
    const aiIsaGrown = aiState.isa * (1 + rate);
    const aiDomesticGrown = aiState.domestic * (1 + rate);
    const aiOverseasGrown = aiState.overseas * (1 + rate);
    
    // ============================================
    // STEP 2: Annual Contribution (Add New Money)
    // ============================================
    
    // User: 연간 납입액 추가
    userState.pension = userPensionGrown + userPortfolio.pension * 12;
    userState.irp = userIrpGrown + userPortfolio.irp * 12;
    userState.isa = userIsaGrown + userPortfolio.isa * 12;
    userState.domestic = userDomesticAfterTax + userPortfolio.domestic * 12;
    userState.overseas = userOverseasGrown + userPortfolio.overseas * 12;
    userState.remainingCash = userCashAfterTax + remainingCash * 12;
    
    // AI: 연간 납입액 추가
    aiState.pension = aiPensionGrown + aiPortfolio.pension * 12;
    aiState.irp = aiIrpGrown + aiPortfolio.irp * 12;
    aiState.isa = aiIsaGrown + aiPortfolio.isa * 12;
    aiState.domestic = aiDomesticGrown + aiPortfolio.domestic * 12;
    aiState.overseas = aiOverseasGrown + aiPortfolio.overseas * 12;
    
    // ============================================
    // STEP 3: Tax Credit Reinvestment
    // ============================================
    
    // User: 세액공제 재투자
    const userTaxDeduction = (userPortfolio.pension + userPortfolio.irp) * 12 * LEGAL_LIMITS.TAX_DEDUCTION_RATE;
    userState.pension += userTaxDeduction;
    
    // AI: 세액공제 재투자
    const aiTaxDeduction = (aiPortfolio.pension + aiPortfolio.irp) * 12 * LEGAL_LIMITS.TAX_DEDUCTION_RATE;
    aiState.pension += aiTaxDeduction;
    
    // 배당소득세 처리 (해외주식)
    const userOverseasDividend = userState.overseas * LEGAL_LIMITS.DIVIDEND_YIELD;
    const userDividendTax = userOverseasDividend * LEGAL_LIMITS.DIVIDEND_TAX_RATE;
    userState.overseas += userOverseasDividend - userDividendTax;
    
    const aiOverseasDividend = aiState.overseas * LEGAL_LIMITS.DIVIDEND_YIELD;
    const aiDividendTax = aiOverseasDividend * LEGAL_LIMITS.DIVIDEND_TAX_RATE;
    aiState.overseas += aiOverseasDividend - aiDividendTax;
    
    // ============================================
    // STEP 4: ISA Maturity Event (AI Only)
    // ============================================
    
    let aiIsaMaturityBenefit = 0;
    
    if (aiState.isaStartYear === LEGAL_LIMITS.ISA_MATURITY_YEARS) {
      // ISA 만기 처리
      const currentISATotal = aiState.isa;
      const principal = aiPortfolio.isa * 12 * LEGAL_LIMITS.ISA_MATURITY_YEARS;
      const profit = currentISATotal - principal;
      
      // 세금 계산 (순수익 200만원 비과세, 초과분 9.9%)
      const isaTax = profit > LEGAL_LIMITS.ISA_MATURITY_TAX_FREE
        ? (profit - LEGAL_LIMITS.ISA_MATURITY_TAX_FREE) * LEGAL_LIMITS.ISA_MATURITY_TAX_RATE
        : 0;
      
      const transferAmount = currentISATotal - isaTax;
      const transferIncentive = Math.min(
        transferAmount * LEGAL_LIMITS.ISA_TRANSFER_TAX_DEDUCTION_RATE,
        LEGAL_LIMITS.ISA_TRANSFER_TAX_DEDUCTION_MAX
      );
      
      // ISA 해지 후 연금저축으로 전환
      aiState.pension += transferAmount + transferIncentive;
      aiState.isa = 0;
      aiState.isaStartYear = 1; // 사이클 리셋
      aiIsaMaturityBenefit = transferIncentive;
    } else {
      aiState.isaStartYear += 1;
    }
    
    // ============================================
    // STEP 5: Record Result (Apply Math.floor)
    // ============================================
    
    // User 총 자산 계산
    const userTotal = Math.floor(
      userState.pension + userState.irp + userState.isa +
      userState.domestic + userState.overseas + (userState.remainingCash || 0)
    );
    
    // AI 총 자산 계산
    const aiTotal = Math.floor(
      aiState.pension + aiState.irp + aiState.isa +
      aiState.domestic + aiState.overseas + (aiState.remainingCash || 0)
    );
    
    // 과세이연 효과 계산 (해외주식)
    const userTaxDeferred = userState.overseas * rate * 0.22;
    const aiTaxDeferred = aiState.overseas * rate * 0.22;
    
    // 결과 저장
    userPlan.push({
      age,
      year,
      totalAssets: userTotal,
      breakdown: {
        pension: Math.floor(userState.pension),
        irp: Math.floor(userState.irp),
        isa: Math.floor(userState.isa),
        domestic: Math.floor(userState.domestic),
        overseas: Math.floor(userState.overseas),
        remainingCash: Math.floor(userState.remainingCash),
      },
      taxBenefits: {
        taxDeduction: Math.floor(userTaxDeduction),
        taxDeferred: Math.floor(userTaxDeferred),
        dividendTax: Math.floor(userDividendTax),
        cashAccountTax: Math.floor(userDomesticTax + userCashTax),
      },
    });
    
    aiPlan.push({
      age,
      year,
      totalAssets: aiTotal,
      breakdown: {
        pension: Math.floor(aiState.pension),
        irp: Math.floor(aiState.irp),
        isa: Math.floor(aiState.isa),
        domestic: Math.floor(aiState.domestic),
        overseas: Math.floor(aiState.overseas),
      },
      taxBenefits: {
        taxDeduction: Math.floor(aiTaxDeduction + aiIsaMaturityBenefit),
        taxDeferred: Math.floor(aiTaxDeferred),
        dividendTax: Math.floor(aiDividendTax),
      },
    });
  }
  
  // 요약 계산
  const finalUserAsset = userPlan[userPlan.length - 1].totalAssets;
  const finalAIAsset = aiPlan[aiPlan.length - 1].totalAssets;
  const finalAssetDifference = finalAIAsset - finalUserAsset;
  
  const totalUserTaxDeduction = userPlan.reduce(
    (sum, year) => sum + year.taxBenefits.taxDeduction,
    0
  );
  const totalAITaxDeduction = aiPlan.reduce(
    (sum, year) => sum + year.taxBenefits.taxDeduction,
    0
  );
  const totalTaxDeductionDifference = totalAITaxDeduction - totalUserTaxDeduction;
  
  const totalUserTaxDeferred = userPlan.reduce(
    (sum, year) => sum + year.taxBenefits.taxDeferred,
    0
  );
  const totalAITaxDeferred = aiPlan.reduce(
    (sum, year) => sum + year.taxBenefits.taxDeferred,
    0
  );
  const totalTaxDeferredDifference = totalAITaxDeferred - totalUserTaxDeferred;
  
  return {
    userPlan,
    aiPlan,
    summary: {
      finalAssetDifference,
      totalTaxDeductionDifference,
      totalTaxDeferredDifference,
    },
  };
}

/**
 * AI 리포트 데이터 생성
 */
export function generateAIReport(result: SimulationResult, remainingCash: number): AIReportData {
  const { userPlan, aiPlan, summary } = result;

  // 세액공제 재투자 효과
  const taxDeductionBenefit = summary.totalTaxDeductionDifference;

  // 과세이연 효과
  const taxDeferredBenefit = summary.totalTaxDeferredDifference;

  // ISA 만기 전환 최적화 효과 계산
  let isaOptimizationBenefit = 0;
  for (let i = 0; i < aiPlan.length; i++) {
    if (i > 0 && i % LEGAL_LIMITS.ISA_MATURITY_YEARS === 0) {
      // ISA 만기 전환 시 추가 세액공제
      const aiTransferBenefit = aiPlan[i].taxBenefits.taxDeduction;
      const userTransferBenefit = userPlan[i].taxBenefits.taxDeduction;
      isaOptimizationBenefit += aiTransferBenefit - userTransferBenefit;
    }
  }

  // 해외주식 과세이연 효과
  const overseasStockBenefit = taxDeferredBenefit * 0.7; // 해외주식이 과세이연 효과의 대부분 차지

  // 잔여 현금 기회비용 계산
  const totalUserCashTax = userPlan.reduce(
    (sum, year) => sum + (year.taxBenefits.cashAccountTax || 0),
    0
  );
  
  // 잔여 현금이 AI Plan에서 얻을 수 있었던 수익 추정
  // 전체 차이의 일부를 기회비용으로 추정 (더 정확한 계산 가능)
  const surplusOpportunityCost = summary.finalAssetDifference * 0.3;

  const totalBenefit = summary.finalAssetDifference;

  return {
    taxDeductionBenefit,
    taxDeferredBenefit,
    isaOptimizationBenefit,
    overseasStockBenefit,
    surplusOpportunityCost,
    totalBenefit,
  };
}
