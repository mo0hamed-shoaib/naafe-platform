import React, { useState } from 'react';
import { NegotiationState, NegotiationTerms } from '../../contexts/OfferContext';
import { ServiceRequest } from '../../types';
import type { Offer } from '../../contexts/OfferContext';
import UnifiedInput from '../ui/FormInput';
// import UnifiedSelect from '../ui/FormSelect';
import { DatePicker, TimePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import arEG from 'antd/locale/ar_EG';

interface NegotiationSummaryProps {
  negotiation: NegotiationState;
  isProvider: boolean;
  isSeeker: boolean;
  jobRequest: ServiceRequest;
  offer: Offer;
  onEditSave?: (terms: NegotiationTerms) => void;
  onConfirm?: () => void;
  onReset?: () => void;
  isConfirming?: boolean;
}

const NegotiationSummary: React.FC<NegotiationSummaryProps> = ({
  negotiation,
  isProvider,
  isSeeker,
  // jobRequest, // Remove if not used
  offer,
  onEditSave,
  onConfirm,
  onReset,
  isConfirming
}) => {
  // Debug log for offer
  console.debug('NegotiationSummary offer:', offer);

  const [isEditing, setIsEditing] = useState(false);
  const [editTerms, setEditTerms] = useState<NegotiationTerms>({ ...negotiation.currentTerms });

  // Defensive: Warn if offer is missing or empty
  if (!offer || Object.keys(offer).length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center text-yellow-800">
        ⚠️ لم يتم العثور على بيانات العرض الخاصة بمقدم الخدمة. يرجى التأكد من تحميل البيانات بشكل صحيح.
      </div>
    );
  }

  if (!negotiation || !negotiation.currentTerms || !negotiation.confirmationStatus) {
    return (
      <div className="bg-white rounded-lg shadow p-4 border border-deep-teal/10 text-center text-text-secondary">لا توجد بيانات تفاوض متاحة بعد.</div>
    );
  }
  const { currentTerms, confirmationStatus, canAcceptOffer, lastUpdatedBy } = negotiation;

  const handleEditClick = () => {
    setEditTerms({ ...currentTerms });
    setIsEditing(true);
    if (onReset) onReset(); // Reset confirmations on edit
  };

  const handleSave = () => {
    if (onEditSave) onEditSave(editTerms);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTerms({ ...currentTerms });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-deep-teal/10 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-deep-teal">تفاصيل التفاوض</h3>
        {!isEditing && (
          <button className="bg-warm-cream text-deep-teal px-3 py-1 rounded font-medium text-sm hover:bg-deep-teal/10 transition-colors" onClick={handleEditClick}>تعديل الشروط</button>
        )}
      </div>
      <div className="space-y-2 text-right">
        {/* Read-only fields */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-secondary min-w-[160px]">السعر المقترح من مقدم الخدمة</span>
          <span className="text-text-primary">{offer?.price ? `${offer.price} جنيه` : <span className="text-red-500">⚠️ غير محدد (offer.price مفقود)</span>}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-secondary min-w-[160px]">التواريخ المتاحة لمقدم الخدمة</span>
          <span className="text-text-primary">{(offer?.availableDates ?? []).length > 0 ? (offer.availableDates ?? []).map((d: string, i: number, arr: string[]) => <span key={i}>{dayjs(d).format('YYYY-MM-DD')}{i < arr.length - 1 ? ', ' : ''}</span>) : <span className="text-red-500">⚠️ غير محدد (offer.availableDates مفقود)</span>}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-secondary min-w-[160px]">تفضيلات الوقت لمقدم الخدمة</span>
          <span className="text-text-primary">{(offer?.timePreferences ?? []).length > 0 ? (offer.timePreferences ?? []).map((t: string, i: number, arr: string[]) => <span key={i}>{t}{i < arr.length - 1 ? ', ' : ''}</span>) : <span className="text-red-500">⚠️ غير محدد (offer.timePreferences مفقود)</span>}</span>
        </div>
        {/* Editable fields: price agreed, date/time agreed, materials, scope */}
        {isEditing ? (
          <form className="space-y-2" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-secondary min-w-[160px]">السعر المتفق عليه</span>
              <UnifiedInput
                type="number"
                value={editTerms.price ?? ''}
                onChange={e => setEditTerms((t: NegotiationTerms) => ({ ...t, price: Number(e.target.value) }))}
                placeholder="أدخل السعر النهائي"
                size="sm"
                className="max-w-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-secondary min-w-[160px]">التاريخ المتفق عليه</span>
              <ConfigProvider locale={arEG}>
                <DatePicker
                  format="YYYY-MM-DD"
                  value={editTerms.date ? dayjs(editTerms.date) : null}
                  onChange={val => setEditTerms((t: NegotiationTerms) => ({ ...t, date: val ? val.toISOString() : '' }))}
                  className="max-w-xs"
                  placeholder="اختر التاريخ"
                  style={{ direction: 'rtl' }}
                  classNames={{ popup: { root: "custom-datepicker-dropdown" } }}
                  disabledDate={current => current && current < dayjs().startOf('day')}
                />
              </ConfigProvider>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-secondary min-w-[160px]">الوقت المتفق عليه</span>
              <ConfigProvider locale={arEG}>
                <TimePicker
                  use12Hours
                  showSecond={false}
                  format={(value) => {
                    if (!value) return '';
                    const hour = value.hour();
                    const minute = value.minute();
                    const period = hour < 12 ? 'ص' : 'م';
                    const hour12 = hour % 12 || 12;
                    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
                  }}
                  value={editTerms.time ? dayjs(editTerms.time, 'HH:mm') : null}
                  onChange={val => setEditTerms((t: NegotiationTerms) => ({ ...t, time: val ? val.format('HH:mm') : '' }))}
                  className="max-w-xs"
                  placeholder="اختر الوقت"
                  style={{ direction: 'rtl' }}
                  classNames={{ popup: { root: "custom-datepicker-dropdown" } }}
                />
              </ConfigProvider>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-secondary min-w-[160px]">الخامات المطلوبة</span>
              <UnifiedInput
                type="text"
                value={editTerms.materials ?? ''}
                onChange={e => setEditTerms((t: NegotiationTerms) => ({ ...t, materials: e.target.value }))}
                placeholder="أدخل المواد"
                size="sm"
                className="max-w-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-secondary min-w-[160px]">وصف نطاق العمل</span>
              <UnifiedInput
                type="text"
                value={editTerms.scope ?? ''}
                onChange={e => setEditTerms((t: NegotiationTerms) => ({ ...t, scope: e.target.value }))}
                placeholder="أدخل النطاق"
                size="sm"
                className="max-w-xs"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-deep-teal text-white px-4 py-1 rounded">حفظ</button>
              <button type="button" className="bg-warm-cream text-deep-teal px-4 py-1 rounded" onClick={handleCancel}>إلغاء</button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-secondary min-w-[160px]">السعر المتفق عليه</span>
              <span className="text-text-primary">{currentTerms.price ? `${currentTerms.price} جنيه` : <span className="text-red-500">⚠️ غير محدد (currentTerms.price مفقود)</span>}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-secondary min-w-[160px]">التاريخ المتفق عليه</span>
              <span className="text-text-primary">{currentTerms.date ? dayjs(currentTerms.date).format('YYYY-MM-DD') : <span className="text-red-500">⚠️ غير محدد (currentTerms.date مفقود)</span>}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-secondary min-w-[160px]">الوقت المتفق عليه</span>
              <span className="text-text-primary">{currentTerms.time ? dayjs(currentTerms.time, 'HH:mm').format('hh:mm A').replace('AM', 'ص').replace('PM', 'م') : <span className="text-red-500">⚠️ غير محدد (currentTerms.time مفقود)</span>}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-secondary min-w-[160px]">الخامات المطلوبة</span>
              <span className="text-text-primary">{currentTerms.materials || <span className="text-red-500">⚠️ غير محدد (currentTerms.materials مفقود)</span>}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-secondary min-w-[160px]">وصف نطاق العمل</span>
              <span className="text-text-primary">{currentTerms.scope || <span className="text-red-500">⚠️ غير محدد (currentTerms.scope مفقود)</span>}</span>
            </div>
          </>
        )}
      </div>
      {/* Confirm/Reset Buttons */}
      {/* Remove old confirm buttons */}
      {/* Accepted badge if both confirmed */}
      {canAcceptOffer && <div className="flex justify-end mt-2"><span className="bg-green-600 text-white px-4 py-1 rounded">تم قبول العرض</span></div>}
      <div className="text-xs text-text-secondary mt-2">آخر تعديل: {lastUpdatedBy}</div>
      {/* Negotiation confirmation status badges and actions (moved below 'آخر تعديل') */}
      <div className="flex flex-col items-end gap-2 mt-2">
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${confirmationStatus.seeker ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>المشترك أكد</span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${confirmationStatus.provider ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>المزود أكد</span>
        </div>
        {/* Show confirm button for current user if not confirmed */}
        {((isSeeker && !confirmationStatus.seeker) || (isProvider && !confirmationStatus.provider)) && (
          <button className="bg-green-600 text-white px-6 py-2 rounded mt-1" onClick={onConfirm} disabled={isConfirming}>تأكيد الإتفاق</button>
        )}
        {/* Reset button if either confirmed */}
        {(confirmationStatus.seeker || confirmationStatus.provider) && (
          <button className="bg-red-500 text-white px-6 py-2 rounded mt-1" onClick={onReset}>إعادة تعيين التأكيدات</button>
        )}
      </div>
    </div>
  );
};

export default NegotiationSummary; 