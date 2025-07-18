import React, { useState, useCallback } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';
import BaseCard from './BaseCard';

interface PricingGuidanceProps {
  formType: 'service' | 'request';
  category: string;
  location: string;
  userBudget: { min: number; max: number } | null;
  onPricingApply: (min: number, max: number) => void;
  skills?: string[];
  className?: string;
}

interface PricingRecommendation {
  suggestedMin: number;
  suggestedMax: number;
  confidence: number;
  reasoning: string;
}

interface PricingAnalysis {
  isReasonable: boolean;
  marketPosition: 'low' | 'average' | 'high';
  factors: string[];
  tips: string[];
}

interface PricingGuidanceData {
  recommendation: PricingRecommendation | null;
  analysis: PricingAnalysis | null;
  warning?: string;
}

const PricingGuidance: React.FC<PricingGuidanceProps> = ({
  formType,
  category,
  location,
  userBudget,
  onPricingApply,
  skills = [],
  className = ''
}) => {
  const { accessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [guidance, setGuidance] = useState<PricingGuidanceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getPricingGuidance = useCallback(async () => {
    if (!category || category.trim() === '') {
      setError('يرجى اختيار الفئة أولاً');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/pricing-guidance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          category,
          serviceType: formType,
          location,
          userBudget,
          skills,
        })
      });

      const data = await response.json();

      if (data.success) {
        setGuidance(data.data);
      } else {
        setError(data.error?.message || 'فشل في الحصول على التوجيه');
      }
    } catch {
      setError('حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  }, [category, formType, location, userBudget, accessToken, skills]);

  const handleApplyRecommendation = () => {
    if (guidance?.recommendation) {
      onPricingApply(
        guidance.recommendation.suggestedMin,
        guidance.recommendation.suggestedMax
      );
    }
  };

  const getMarketPositionIcon = (position: string) => {
    switch (position) {
      case 'low':
        return <TrendingDown className="w-4 h-4 text-green-600" />;
      case 'high':
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  const getMarketPositionText = (position: string) => {
    switch (position) {
      case 'low':
        return 'منخفض - سعر تنافسي';
      case 'high':
        return 'مرتفع - سعر مميز';
      default:
        return 'متوسط - سعر معقول';
    }
  };

  return (
    <BaseCard className={`p-6 border-l-4 border-[#2D5D4F] ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-[#2D5D4F]" />
        <h3 className="text-lg font-bold text-[#0e1b18]">التوجيه الذكي للتسعير</h3>
      </div>

      <div className="space-y-4">
        {/* Current Budget Display */}
        {userBudget && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-[#0e1b18] text-right mb-1">الميزانية الحالية:</p>
            <p className="text-lg font-semibold text-[#2D5D4F] text-right">
              {userBudget.min} - {userBudget.max} جنيه
            </p>
          </div>
        )}

        {/* Get Guidance Button */}
        <Button
          onClick={getPricingGuidance}
          loading={isLoading}
          disabled={!category || category.trim() === ''}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          <DollarSign className="w-4 h-4 ml-2" />
          احصل على توجيه التسعير
        </Button>
        
        {/* Category Requirement Notice */}
        {(!category || category.trim() === '') && (
          <div className="text-xs text-gray-500 text-right">
            * يجب اختيار الفئة أولاً لاستخدام توجيه التسعير
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-red-600 text-sm">{error}</span>
          </div>
        )}

        {/* Pricing Guidance Results */}
        {guidance && (
          <div className="space-y-4">
            {/* Warning */}
            {guidance.warning && (
              <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-800 text-right">
                <AlertTriangle className="w-4 h-4 inline-block mr-2 text-yellow-600" />
                {guidance.warning}
              </div>
            )}
            {/* Recommendation */}
            {guidance.recommendation ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">التوصية الذكية</h4>
                </div>
                <div className="space-y-2">
                  <div className="text-right">
                    <p className="text-sm text-blue-700 mb-1">النطاق المقترح:</p>
                    <p className="text-xl font-bold text-[#2D5D4F]">
                      {guidance.recommendation.suggestedMin} - {guidance.recommendation.suggestedMax} جنيه
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-700 mb-1">مستوى الثقة:</p>
                    <div className="flex items-center gap-2 justify-end">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#F5A623] h-2 rounded-full" 
                          style={{ width: `${guidance.recommendation.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-blue-700">
                        {Math.round(guidance.recommendation.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-blue-700 text-right mt-3">
                    {guidance.recommendation.reasoning}
                  </p>
                  <Button
                    type="button"
                    onClick={handleApplyRecommendation}
                    variant="primary"
                    size="sm"
                    className="w-full mt-3"
                  >
                    تطبيق
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
                لم يتم اقتراح سعر من الذكاء الاصطناعي. يرجى مراجعة البيانات والمحاولة مرة أخرى.
              </div>
            )}
            {/* Analysis */}
            {guidance.analysis && (
              <div className="space-y-3">
                {/* Reasonableness Check */}
                <div className={`p-3 rounded-lg border ${
                  guidance.analysis.isReasonable 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {guidance.analysis.isReasonable ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    )}
                    <span className={`font-semibold text-sm ${
                      guidance.analysis.isReasonable ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      {guidance.analysis.isReasonable ? 'السعر معقول' : 'السعر يحتاج مراجعة'}
                    </span>
                  </div>
                </div>
                {/* Market Position */}
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {getMarketPositionIcon(guidance.analysis.marketPosition)}
                    <span className="font-semibold text-sm text-[#0e1b18]">
                      {getMarketPositionText(guidance.analysis.marketPosition)}
                    </span>
                  </div>
                </div>
                {/* Factors */}
                {guidance.analysis.factors.length > 0 && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 className="font-semibold text-[#0e1b18] text-right mb-2">العوامل المؤثرة:</h5>
                    <ul className="space-y-1 text-right">
                      {guidance.analysis.factors.map((factor, index) => (
                        <li key={index} className="text-sm text-gray-700">• {factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Tips */}
                {guidance.analysis.tips.length > 0 && (
                  <div className="p-3 bg-[#FDF8F0] border border-[#F5A623] rounded-lg">
                    <h5 className="font-semibold text-[#0e1b18] text-right mb-2">نصائح مفيدة:</h5>
                    <ul className="space-y-1 text-right">
                      {guidance.analysis.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-[#0e1b18]">• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </BaseCard>
  );
};

export default PricingGuidance; 