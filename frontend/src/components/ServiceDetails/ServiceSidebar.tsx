import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../ui/Button';

interface ServiceSidebarProps {
  service: any; // TODO: type
  onInterested?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onReport?: () => void;
}

const ServiceSidebar: React.FC<ServiceSidebarProps> = ({
  service,
  onInterested,
  onShare,
  onBookmark,
  onReport
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  if (!service) return null;
  return (
    <aside className="bg-white rounded-lg shadow p-4 mb-6 sticky top-24 text-right">
      <div className="mb-4">
        <div className="font-bold text-lg mb-2">ملخص الطلب</div>
        <div className="text-sm text-gray-700 mb-1">الحالة: {service.status === 'open' ? 'مفتوح' : service.status === 'assigned' ? 'مُسند' : service.status === 'completed' ? 'مكتمل' : 'غير معروف'}</div>
        <div className="text-sm text-gray-700 mb-1">الميزانية: {service.budget?.min} - {service.budget?.max} جنيه</div>
        {service.deadline && (
          <div className="text-sm text-gray-700 mb-1">
            الموعد النهائي: {new Date(service.deadline).toLocaleDateString('ar-EG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Button variant="primary" onClick={() => navigate(`/requests/${id}/respond`)}>أنا مهتم</Button>
        <Button variant="outline" onClick={onShare}>مشاركة</Button>
        <Button variant="outline" onClick={onBookmark}>حفظ</Button>
        <Button variant="danger" onClick={onReport}>إبلاغ</Button>
      </div>
    </aside>
  );
};

export default ServiceSidebar; 