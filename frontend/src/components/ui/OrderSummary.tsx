import React from 'react';
import { Receipt, CreditCard, Calculator } from 'lucide-react';
import BaseCard from './BaseCard';

interface OrderSummaryProps {
  jobTitle: string;
  amount: number;
  commission: number;
  totalAmount: number;
  currency: string;
  className?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  jobTitle,
  amount,
  commission,
  totalAmount,
  currency,
  className = ''
}) => {
  return (
    <BaseCard className={`p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Receipt className="w-5 h-5 text-deep-teal" />
        <h3 className="text-lg font-semibold text-text-primary">ملخص الطلب</h3>
      </div>

      <div className="space-y-4">
        {/* Job Title */}
        <div className="p-3 bg-warm-cream rounded-lg">
          <h4 className="font-medium text-text-primary mb-1">الخدمة المطلوبة</h4>
          <p className="text-sm text-gray-600">{jobTitle}</p>
        </div>

        {/* Amount Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">تفاصيل المبالغ</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">مبلغ الخدمة:</span>
              <span className="font-medium">{amount.toLocaleString()} {currency}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">عمولة المنصة (10%):</span>
              <span className="font-medium">{commission.toLocaleString()} {currency}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-text-primary">الإجمالي:</span>
                <span className="font-bold text-lg text-deep-teal">
                  {totalAmount.toLocaleString()} {currency}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Info */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Calculator className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">معلومات العمولة</p>
              <p className="text-blue-700">
                عمولة المنصة 10% تغطي رسوم المعاملات والخدمات المقدمة
              </p>
            </div>
          </div>
        </div>

        {/* Payment Security */}
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-green-800">
              الدفع آمن ومشفر
            </span>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default OrderSummary; 