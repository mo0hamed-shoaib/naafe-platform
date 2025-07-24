import React, { useState } from 'react';
import { NegotiationHistoryEntry } from '../../contexts/OfferContext';

interface NegotiationHistoryProps {
  negotiationHistory: NegotiationHistoryEntry[];
  userMap?: Record<string, string>; // userId to name
  isMobile?: boolean;
}

const fieldLabels: Record<string, string> = {
  price: 'السعر',
  date: 'التاريخ',
  time: 'الوقت',
  materials: 'المواد',
  scope: 'نطاق العمل',
  confirmation: 'تأكيد الاتفاق',
};

const NegotiationHistory: React.FC<NegotiationHistoryProps> = ({ negotiationHistory, userMap = {}, isMobile }) => {
  const [collapsed, setCollapsed] = useState(isMobile);
  if (!negotiationHistory || negotiationHistory.length === 0) {
    return <div className="text-gray-400 text-sm text-center">لا يوجد تغييرات في التفاوض بعد</div>;
  }
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-deep-teal/10 mb-4" dir="rtl">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-deep-teal">سجل التفاوض</h3>
        {isMobile && (
          <button
            className="text-xs text-deep-teal underline focus:outline-none"
            onClick={() => setCollapsed((c) => !c)}
            // aria-expanded={!collapsed}
          >
            {collapsed ? 'عرض السجل' : 'إخفاء السجل'}
          </button>
        )}
      </div>
      {(!isMobile || !collapsed) && (
        <ul className="space-y-3 mt-2">
          {negotiationHistory.slice().reverse().map((entry, idx) => (
            <li key={idx} className="bg-warm-cream rounded p-2 border border-deep-teal/10 text-sm">
              <div className="flex flex-wrap gap-2 items-center mb-1">
                <span className="font-semibold">{fieldLabels[entry.field] || entry.field}:</span>
                <span className="text-gray-700">{entry.oldValue !== undefined && entry.oldValue !== null ? `من "${entry.oldValue}"` : ''}</span>
                <span className="text-gray-700">{entry.newValue !== undefined && entry.newValue !== null ? `إلى "${entry.newValue}"` : ''}</span>
              </div>
              <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500">
                <span>بواسطة: <span className="font-semibold">{userMap[entry.changedBy] || entry.changedBy}</span></span>
                <span>في: {new Date(entry.timestamp).toLocaleString('ar-EG')}</span>
                {entry.note && <span className="text-orange-600">{entry.note}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NegotiationHistory; 