import React, { useEffect, useState } from 'react';
import { BadgeCheck, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Breadcrumb from '../components/UI/Breadcrumb';
import Modal from '../components/UI/Modal';
import { FormInput, FormTextarea } from '../../components/ui';

const STATUS_LABELS = {
  pending: 'قيد الانتظار',
  accepted: 'مقبول',
  rejected: 'مرفوض',
};
const STATUS_COLORS = {
  pending: 'badge-ghost',
  accepted: 'badge-success',
  rejected: 'badge-error',
};

interface UpgradeRequest {
  _id: string;
  user: {
    name: { first: string; last: string };
    phone: string;
    email: string;
    profile?: { location?: { address: string } };
  };
  status: 'pending' | 'accepted' | 'rejected';
  attachments?: string[];
  rejectionComment?: string;
  adminExplanation?: string; // Added for explanations
}

const AdminUpgradeRequests: React.FC = () => {
  const { accessToken } = useAuth();
  const [requests, setRequests] = useState<UpgradeRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<UpgradeRequest | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionComment, setRejectionComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [adminExplanation, setAdminExplanation] = useState('');
  const [acceptingRequestId, setAcceptingRequestId] = useState<string | null>(null);

  // Fetch upgrade requests
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (statusFilter !== 'all') params.append('status', statusFilter);
        if (search) params.append('search', search);
        const res = await fetch(`/api/admin/upgrade-requests?${params.toString()}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error?.message || 'فشل التحميل');
        setRequests(data.data.requests);
      } catch {
        setError('فشل تحميل طلبات الترقية');
      }
      setLoading(false);
    };
    fetchRequests();
  }, [accessToken, statusFilter, search]);

  // Accept request (with explanation)
  const handleAccept = (id: string) => {
    setAcceptingRequestId(id);
    setAdminExplanation('');
    setShowAcceptModal(true);
  };
  const handleAcceptConfirm = async () => {
    if (!acceptingRequestId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/upgrade-requests/${acceptingRequestId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ adminExplanation }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || 'فشل القبول');
      setRequests((prev) => prev.map((r) => r._id === acceptingRequestId ? { ...r, status: 'accepted', adminExplanation } : r));
      setShowAcceptModal(false);
      setAdminExplanation('');
      setAcceptingRequestId(null);
    } catch {
      alert('فشل قبول الطلب');
    }
    setActionLoading(false);
  };

  // Reject request (with explanation)
  const handleReject = async () => {
    if (!selectedRequest) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/upgrade-requests/${selectedRequest._id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ adminExplanation }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || 'فشل الرفض');
      setRequests((prev) => prev.map((r) => r._id === selectedRequest._id ? { ...r, status: 'rejected', adminExplanation } : r));
      setShowRejectModal(false);
      setAdminExplanation('');
    } catch {
      alert('فشل رفض الطلب');
    }
    setActionLoading(false);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <Breadcrumb items={[{ label: 'طلبات الترقية' }]} />
      <h2 className="text-3xl font-bold text-deep-teal">طلبات الترقية</h2>
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex gap-2 items-center">
          <select
            className="select select-bordered select-sm rounded-lg"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            title="تصفية حسب الحالة"
            aria-label="تصفية حسب الحالة"
          >
            <option value="all">الكل</option>
            <option value="pending">قيد الانتظار</option>
            <option value="accepted">مقبول</option>
            <option value="rejected">مرفوض</option>
          </select>
          <FormInput
            type="text"
            placeholder="بحث بالاسم أو البريد أو الهاتف"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-light-cream rounded-2xl shadow-md overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-warm-cream border-b border-light-cream">
            <tr>
              <th className="px-4 py-3 text-xs font-medium text-deep-teal uppercase">المستخدم</th>
              <th className="px-4 py-3 text-xs font-medium text-deep-teal uppercase">الهاتف</th>
              <th className="px-4 py-3 text-xs font-medium text-deep-teal uppercase">البريد الإلكتروني</th>
              <th className="px-4 py-3 text-xs font-medium text-deep-teal uppercase">العنوان</th>
              <th className="px-4 py-3 text-xs font-medium text-deep-teal uppercase">المرفقات</th>
              <th className="px-4 py-3 text-xs font-medium text-deep-teal uppercase">الحالة</th>
              <th className="px-4 py-3 text-xs font-medium text-deep-teal uppercase">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-cream text-deep-teal">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8">جاري التحميل...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="text-center py-8 text-red-600">{error}</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8">لا توجد طلبات</td></tr>
            ) : requests.map((req) => (
              <tr key={req._id} className="hover:bg-bright-orange/10">
                <td className="px-4 py-3 font-medium">{req.user?.name?.first} {req.user?.name?.last}</td>
                <td className="px-4 py-3">{req.user?.phone}</td>
                <td className="px-4 py-3">{req.user?.email}</td>
                <td className="px-4 py-3">{req.user?.profile?.location?.address || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    {req.attachments?.map((url, i) => (
                      url.match(/\.(jpg|jpeg|png)$/i)
                        ? <a key={i} href={url} target="_blank" rel="noopener noreferrer"><img src={url} alt="مرفق" className="h-10 w-10 rounded object-cover border" /></a>
                        : <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-xs underline text-blue-600">عرض ملف</a>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${STATUS_COLORS[req.status] || 'badge-ghost'} text-xs px-3 py-1 rounded-full`}>{STATUS_LABELS[req.status]}</span>
                  {(req.status === 'accepted' || req.status === 'rejected') && req.adminExplanation && (
                    <div className="text-xs mt-1 text-blue-700" title={req.adminExplanation}>
                      <span className="font-semibold">شرح الإدارة:</span> {req.adminExplanation}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    {req.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-xs bg-bright-orange text-white hover:bg-orange-600 rounded"
                          onClick={() => handleAccept(req._id)}
                          disabled={actionLoading}
                        >
                          <BadgeCheck className="inline h-4 w-4 mr-1" /> قبول
                        </button>
                        <button
                          className="btn btn-xs bg-red-500 text-white hover:bg-red-700 rounded"
                          onClick={() => { setSelectedRequest(req); setShowRejectModal(true); setAdminExplanation(''); }}
                          disabled={actionLoading}
                        >
                          <XCircle className="inline h-4 w-4 mr-1" /> رفض
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Accept Modal */}
      <Modal isOpen={showAcceptModal} onClose={() => setShowAcceptModal(false)} title="شرح الإدارة للموافقة">
        <div className="space-y-4">
          <FormTextarea
            rows={3}
            placeholder="يرجى كتابة شرح سبب الموافقة"
            value={adminExplanation}
            onChange={e => setAdminExplanation(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <button
              className="btn btn-outline"
              onClick={() => setShowAcceptModal(false)}
              disabled={actionLoading}
            >إلغاء</button>
            <button
              className="btn bg-bright-orange text-white hover:bg-orange-600"
              onClick={handleAcceptConfirm}
              disabled={actionLoading || !adminExplanation.trim()}
            >تأكيد الموافقة</button>
          </div>
        </div>
      </Modal>
      {/* Reject Modal */}
      <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} title="شرح الإدارة للرفض">
        <div className="space-y-4">
          <FormTextarea
            rows={3}
            placeholder="يرجى كتابة شرح سبب الرفض"
            value={adminExplanation}
            onChange={e => setAdminExplanation(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <button
              className="btn btn-outline"
              onClick={() => setShowRejectModal(false)}
              disabled={actionLoading}
            >إلغاء</button>
            <button
              className="btn bg-red-500 text-white hover:bg-red-700"
              onClick={handleReject}
              disabled={actionLoading || !adminExplanation.trim()}
            >رفض الطلب</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUpgradeRequests; 