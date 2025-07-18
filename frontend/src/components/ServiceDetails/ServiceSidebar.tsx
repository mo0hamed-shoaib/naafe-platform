import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';

interface ServiceSidebarProps {
  service: {
    postedBy?: { id?: string };
    status?: string;
    budget?: { min?: number; max?: number };
    deadline?: string;
    [key: string]: unknown;
  };
  onShare?: () => void;
  onBookmark?: () => void;
  onReport?: () => void;
  alreadyApplied?: boolean;
}

const ServiceSidebar: React.FC<ServiceSidebarProps> = ({
  service,
  onShare,
  onBookmark,
  onReport,
  alreadyApplied
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth() as { user: User | null };
  
  if (!service) return null;
  const userId = user?.id;
  const ownerId = service.postedBy?.id;
  const isOwner = userId && ownerId && userId === ownerId;
  return (
    <aside className="bg-white rounded-lg shadow p-4 mb-6 sticky top-24 text-right">
      <div className="mb-4">
        <div className="font-bold text-lg mb-2 text-deep-teal">ملخص الطلب</div>
        <div className="text-sm text-text-primary mb-1">الحالة: {service.status === 'open' ? 'مفتوح' : service.status === 'assigned' ? 'مُسند' : service.status === 'completed' ? 'مكتمل' : 'غير معروف'}</div>
        <div className="text-sm text-text-primary mb-1">الميزانية: {service.budget?.min} - {service.budget?.max} جنيه</div>
        {service.deadline && (
          <div className="text-sm text-text-primary mb-1">
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
        {user && user.roles.includes('provider') ? (
          <Button
            variant="primary"
            onClick={() => navigate(`/requests/${id}/respond`)}
            disabled={!!alreadyApplied || !!isOwner}
            title={alreadyApplied ? 'لقد قدمت عرضاً بالفعل لهذا الطلب' : isOwner ? 'لا يمكنك التقديم على طلبك' : undefined}
          >
            {isOwner
              ? 'هذا طلبك'
              : alreadyApplied
                ? 'تم التقديم'
                : 'أنا مهتم'}
          </Button>
        ) : (
          <Button
            variant="outline"
            disabled
            className="cursor-not-allowed"
            title="يجب أن تكون مقدم خدمات للتقديم على هذا الطلب"
          >
            يجب أن تكون مقدم خدمات
          </Button>
        )}
        <Button variant="outline" onClick={onShare}>مشاركة</Button>
        <Button variant="outline" onClick={onBookmark}>حفظ</Button>
        <Button variant="danger" onClick={onReport}>إبلاغ</Button>
      </div>
    </aside>
  );
};

export default ServiceSidebar; 