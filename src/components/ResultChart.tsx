'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SimulationResult } from '@/types';
import { TrendingUp } from 'lucide-react';

interface ResultChartProps {
  result: SimulationResult | null;
}

export default function ResultChart({ result }: ResultChartProps) {
  if (!result) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center h-96">
        <div className="text-center text-gray-500">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">시뮬레이션을 실행하면 결과가 표시됩니다.</p>
        </div>
      </div>
    );
  }

  // 차트 데이터 준비 (차이 포함)
  const chartData = result.userPlan.map((userYear, index) => {
    const aiAsset = result.aiPlan[index].totalAssets;
    const userAsset = userYear.totalAssets;
    const difference = aiAsset - userAsset;
    return {
      age: userYear.age,
      '사용자 플랜': Math.round(userAsset),
      'AI 최적화 플랜': Math.round(aiAsset),
      difference: Math.round(difference),
    };
  });

  // 최종 자산 차이
  const finalDifference = result.summary.finalAssetDifference;
  const finalUserAsset = result.userPlan[result.userPlan.length - 1].totalAssets;
  const finalAIAsset = result.aiPlan[result.aiPlan.length - 1].totalAssets;
  
  // 차이를 억 단위로 변환
  const formatDifference = (value: number): string => {
    if (value >= 10000) {
      const eok = Math.floor(value / 10000);
      const man = value % 10000;
      return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억원`;
    }
    return `${value.toLocaleString()}만원`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      {/* Summary Cards - 차이 강조 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* User Plan Card */}
        <div className="bg-gray-50 border-2 border-gray-200 p-1 sm:p-4 rounded-xl shadow-sm flex flex-col items-center justify-center min-w-0 w-full">
          <span className="text-slate-500 font-medium mb-0.5 whitespace-nowrap text-[clamp(0.55rem,1.5vw,0.75rem)] leading-none text-center">
            사용자 플랜 최종 자산
          </span>
          <span className="font-bold text-gray-700 whitespace-nowrap text-[clamp(0.625rem,3vw,1.5rem)] tracking-tighter leading-none text-center">
            {formatDifference(finalUserAsset)}
          </span>
        </div>
        
        {/* AI Plan Card */}
        <div className="bg-blue-50 border-2 border-blue-300 p-1 sm:p-4 rounded-xl shadow-sm flex flex-col items-center justify-center min-w-0 w-full">
          <span className="text-blue-600 font-medium mb-0.5 whitespace-nowrap text-[clamp(0.55rem,1.5vw,0.75rem)] leading-none text-center">
            AI 최적화 플랜 최종 자산
          </span>
          <span className="font-bold text-blue-700 whitespace-nowrap text-[clamp(0.625rem,3vw,1.5rem)] tracking-tighter leading-none text-center">
            {formatDifference(finalAIAsset)}
          </span>
        </div>
        
        {/* Additional Gain Card */}
        <div className={`border-2 p-1 sm:p-4 rounded-xl shadow-sm flex flex-col items-center justify-center min-w-0 w-full ${
          finalDifference >= 0 
            ? 'bg-green-50 border-green-300' 
            : 'bg-red-50 border-red-300'
        }`}>
          <span className={`font-medium mb-0.5 whitespace-nowrap text-[clamp(0.55rem,1.5vw,0.75rem)] leading-none text-center ${
            finalDifference >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            절세 전략으로 추가 획득
          </span>
          <span className={`font-bold whitespace-nowrap text-[clamp(0.625rem,3vw,1.5rem)] tracking-tighter leading-none text-center ${
            finalDifference >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            +{formatDifference(finalDifference)}
          </span>
          {finalDifference > 0 && (
            <span className="text-green-700 mt-1 whitespace-nowrap text-[clamp(0.55rem,1.2vw,0.7rem)] leading-none text-center">
              {((finalDifference / finalUserAsset) * 100).toFixed(1)}% 더 많음
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">자산 성장 비교</h2>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="age" 
            label={{ value: '나이', position: 'insideBottom', offset: -5 }}
            stroke="#6b7280"
          />
          <YAxis 
            label={{ value: '자산 (만원)', angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
            tickFormatter={(value) => `${(value / 10000).toFixed(0)}억`}
          />
          <Tooltip 
            formatter={(value: number, name: string, props: any) => {
              const aiValue = props.payload['AI 최적화 플랜'];
              const userValue = props.payload['사용자 플랜'];
              const diff = aiValue - userValue;
              
              if (name === '사용자 플랜') {
                return `${value.toLocaleString()}만원 (차이: ${diff >= 0 ? '+' : ''}${diff.toLocaleString()}만원)`;
              }
              return `${value.toLocaleString()}만원`;
            }}
            labelFormatter={(label) => {
              const data = chartData.find(d => d.age === label);
              if (data) {
                return `나이: ${label}세 | 차이: +${data.difference.toLocaleString()}만원`;
              }
              return `나이: ${label}세`;
            }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
          />
          <Line 
            type="monotone" 
            dataKey="사용자 플랜" 
            stroke="#ef4444" 
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="AI 최적화 플랜" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}
