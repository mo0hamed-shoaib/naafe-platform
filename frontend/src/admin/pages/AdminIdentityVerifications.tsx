import React, { useEffect, useState } from 'react';
import SortableTable from '../components/UI/SortableTable';
import Modal from '../components/UI/Modal';
import ConfirmationModal from '../components/UI/ConfirmationModal';
import Toast from '../components/UI/Toast';
import Pagination from '../components/UI/Pagination';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';
import { useAuth } from '../../contexts/AuthContext';
import Breadcrumb from '../components/UI/Breadcrumb';
import SearchAndFilter from '../components/UI/SearchAndFilter';
import Button from '../../components/ui/Button';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface AuditTrailEntry {
  action: string;
  explanation?: string;
  at?: string;
}
interface Verification {
  _id: string;
  user: {
    _id: string;
    name: { first: string; last: string };
    email: string;
    phone: string;
    roles: string[];
    isBlocked: boolean;
  };
  status: string;
  explanation?: string;
  idFrontUrl: string;
  idBackUrl: string;
  selfieUrl: string;
  criminalRecordUrl?: string;
  criminalRecordIssuedAt?: string;
  submittedAt: string;
  attempts: number;
  auditTrail?: AuditTrailEntry[];
}

const AdminIdentityVerifications: React.FC = () => {
  const { accessToken } = useAuth();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Verification | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [toastList, setToastList] = useState<{ id: string; type: 'success' | 'error'; title: string; message: string }[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionExplanation, setActionExplanation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchVerifications();
  }, [page, searchTerm, filterStatus]);

  const showToast = (type: 'success' | 'error', title: string, message: string) => {
    const id = uuidv4();
    setToastList((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => setToastList((prev) => prev.filter(t => t.id !== id)), 5000);
  };

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
      const res = await fetch(`/api/verification/pending?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (data.success && data.data && data.data.users) {
        setVerifications(data.data.users);
        setTotalPages(data.data.pagination.pages);
      }
    } catch {
      showToast('error', 'خطأ', 'فشل تحميل طلبات التحقق');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selected) return;
    try {
      const res = await fetch(`/api/verification/${selected.user._id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ notes: actionExplanation, role: selected.user.roles.includes('provider') ? 'provider' : 'seeker' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'تمت الموافقة', 'تمت الموافقة على التحقق');
        setShowModal(false);
        fetchVerifications();
      } else {
        showToast('error', 'خطأ', data.error?.message || 'فشل الموافقة');
      }
    } catch {
      showToast('error', 'خطأ', 'فشل الموافقة');
    }
  };

  const handleReject = async () => {
    if (!selected) return;
    try {
      const res = await fetch(`/api/verification/${selected.user._id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ reason: actionExplanation, role: selected.user.roles.includes('provider') ? 'provider' : 'seeker' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'تم الرفض', 'تم رفض التحقق');
        setShowModal(false);
        fetchVerifications();
      } else {
        showToast('error', 'خطأ', data.error?.message || 'فشل الرفض');
      }
    } catch {
      showToast('error', 'خطأ', 'فشل الرفض');
    }
  };

  const handleBlock = async () => {
    if (!selected) return;
    try {
      const res = await fetch(`/api/verification/${selected.user._id}/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ reason: actionExplanation }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'تم الحظر', 'تم حظر المستخدم');
        setShowBlockModal(false);
        fetchVerifications();
      } else {
        showToast('error', 'خطأ', data.error?.message || 'فشل الحظر');
      }
    } catch {
      showToast('error', 'خطأ', 'فشل الحظر');
    }
  };

  const statusOptions = [
    { value: 'all', label: 'الكل' },
    { value: 'pending', label: 'قيد المراجعة' },
    { value: 'approved', label: 'تم التحقق' },
    { value: 'rejected', label: 'مرفوض' },
  ];

  const columns = [
    { key: 'name' as const, label: 'الاسم' },
    { key: 'email' as const, label: 'البريد الإلكتروني' },
    { key: 'phone' as const, label: 'رقم الهاتف' },
    { key: 'attachments' as const, label: 'المرفقات' },
    { key: 'status' as const, label: 'الحالة' },
    { key: 'actions' as const, label: 'إجراءات' },
  ];

  const rows = verifications.map(v => ({
    name: <span className="font-medium text-deep-teal">{`${v.user.name.first} ${v.user.name.last}`}</span>,
    email: <span className="text-deep-teal">{v.user.email}</span>,
    phone: <span className="text-deep-teal">{v.user.phone}</span>,
    attachments: (
      <div className="flex gap-2 items-center">
        {v.idFrontUrl && <a href={v.idFrontUrl} target="_blank" rel="noopener noreferrer"><img src={v.idFrontUrl} alt="id front" className="w-8 h-8 rounded border hover:ring-2 hover:ring-bright-orange transition" title="بطاقة أمامية" /></a>}
        {v.idBackUrl && <a href={v.idBackUrl} target="_blank" rel="noopener noreferrer"><img src={v.idBackUrl} alt="id back" className="w-8 h-8 rounded border hover:ring-2 hover:ring-bright-orange transition" title="بطاقة خلفية" /></a>}
        {v.selfieUrl && <a href={v.selfieUrl} target="_blank" rel="noopener noreferrer"><img src={v.selfieUrl} alt="selfie" className="w-8 h-8 rounded border hover:ring-2 hover:ring-bright-orange transition" title="سيلفي" /></a>}
        {v.criminalRecordUrl && <a href={v.criminalRecordUrl} target="_blank" rel="noopener noreferrer"><img src={v.criminalRecordUrl} alt="criminal record" className="w-8 h-8 rounded border hover:ring-2 hover:ring-bright-orange transition" title="فيش وتشبيه" /></a>}
        {!v.idFrontUrl && !v.idBackUrl && !v.selfieUrl && !v.criminalRecordUrl && <span className="text-gray-400">-</span>}
      </div>
    ),
    status: <span className={v.status === 'pending' ? 'text-yellow-600' : v.status === 'approved' ? 'text-green-600' : 'text-red-600'}>{v.status === 'pending' ? 'قيد المراجعة' : v.status === 'approved' ? 'تم التحقق' : 'مرفوض'}</span>,
    actions: (
      <Button variant="primary" size="sm" onClick={() => { setSelected(v); setShowModal(true); }}>عرض</Button>
    ),
  }));

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb items={[{ label: 'التحقق من الهوية' }]} />
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-deep-teal">طلبات التحقق من الهوية</h1>
        <p className="text-text-secondary text-base">إدارة ومراجعة طلبات التحقق من الهوية المرفوعة من المستخدمين.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-6 border border-deep-teal/10">
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterValue={filterStatus}
          onFilterChange={setFilterStatus}
          filterOptions={statusOptions}
          placeholder="بحث باسم المستخدم أو البريد الإلكتروني..."
        />
        {toastList.map(t => (
          <Toast key={t.id} id={t.id} type={t.type} title={t.title} message={t.message} onClose={() => setToastList(list => list.filter(toast => toast.id !== t.id))} />
        ))}
        {loading ? <LoadingSkeleton /> : (
          <>
            <SortableTable
              data={rows}
              columns={columns}
            />
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} itemsPerPage={10} totalItems={totalPages * 10} />
          </>
        )}
      </div>
      {/* Modal for review/approve/reject */}
      {showModal && selected && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="مراجعة التحقق">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div>
                <span className="block text-xs text-deep-teal font-semibold">بطاقة أمامية</span>
                <img src={selected.idFrontUrl} alt="id front" className="rounded-lg w-24 border" />
              </div>
              <div>
                <span className="block text-xs text-deep-teal font-semibold">بطاقة خلفية</span>
                <img src={selected.idBackUrl} alt="id back" className="rounded-lg w-24 border" />
              </div>
              <div>
                <span className="block text-xs text-deep-teal font-semibold">سيلفي</span>
                <img src={selected.selfieUrl} alt="selfie" className="rounded-lg w-24 border" />
              </div>
              {selected.criminalRecordUrl && (
                <div>
                  <span className="block text-xs text-deep-teal font-semibold">فيش وتشبيه</span>
                  <img src={selected.criminalRecordUrl} alt="criminal record" className="rounded-lg w-24 border" />
                  <span className="block text-xs mt-1">تاريخ الإصدار: {selected.criminalRecordIssuedAt?.slice(0, 10)}</span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <label className="block font-semibold mb-2">ملاحظات/سبب (إجباري عند الرفض)</label>
              <textarea className="input input-bordered w-full" value={actionExplanation} onChange={e => setActionExplanation(e.target.value)} placeholder="سبب الإجراء" title="سبب الإجراء" />
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="success" onClick={handleApprove}>قبول</Button>
              <Button variant="danger" onClick={handleReject}>رفض</Button>
              <Button variant="outline" onClick={() => { setShowModal(false); setShowBlockModal(true); }}>حظر المستخدم</Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>إغلاق</Button>
            </div>
            {selected.auditTrail && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">سجل الإجراءات</h3>
                <ul className="text-xs bg-gray-50 rounded-lg p-2">
                  {selected.auditTrail.map((a, i) => (
                    <li key={i}>{a.action} - {a.explanation || ''} - {a.at ? new Date(a.at).toLocaleString('ar-EG') : ''}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal>
      )}
      {/* Block user modal */}
      {showBlockModal && selected && (
        <ConfirmationModal
          isOpen={showBlockModal}
          title="تأكيد الحظر"
          message="هل أنت متأكد أنك تريد حظر هذا المستخدم؟"
          confirmText="حظر"
          cancelText="إلغاء"
          onConfirm={handleBlock}
          onClose={() => setShowBlockModal(false)}
        />
      )}
    </div>
  );
};

export default AdminIdentityVerifications; 