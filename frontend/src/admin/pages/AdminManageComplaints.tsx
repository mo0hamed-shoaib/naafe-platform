import React, { useState } from 'react';
import { AlertTriangle, Eye, CheckCircle, XCircle, Clock, User, MessageSquare } from 'lucide-react';
import SearchAndFilter from '../components/UI/SearchAndFilter';
import Pagination from '../components/UI/Pagination';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Breadcrumb from '../components/UI/Breadcrumb';
import SortableTable, { SortDirection } from '../components/UI/SortableTable';
import ConfirmationModal from '../components/UI/ConfirmationModal';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { getAdminComplaints, updateComplaint } from '../../services/complaintService';

// Define types for API response
interface Complaint extends Record<string, unknown> {
  _id: string;
  reporterId: string;
  reportedUserId: string;
  jobRequestId: string;
  problemType: string;
  problemTypeLabel: string;
  description: string;
  status: string;
  statusLabel: string;
  adminNotes?: string;
  adminAction: string;
  adminActionLabel: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  reporter: {
    _id: string;
    name: { first: string; last: string };
    email: string;
  };
  reportedUser: {
    _id: string;
    name: { first: string; last: string };
    email: string;
  };
  jobRequest: {
    _id: string;
    title: string;
  };
}

interface ComplaintsApiResponse {
  complaints: Complaint[];
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const fetchComplaints = async ({ page, search, filter, token }: { page: number; search: string; filter: string; token: string | null; }): Promise<ComplaintsApiResponse> => {
  const data = await getAdminComplaints(page, search, filter, token);
  return {
    complaints: data.data.complaints,
    totalPages: data.data.totalPages,
    totalItems: data.data.total,
    itemsPerPage: data.data.limit,
  };
};

const COMPLAINT_STATUS_VARIANT_MAP: Record<string, 'status' | 'category' | 'premium' | 'top-rated' | 'urgency'> = {
  pending: 'urgency',
  investigating: 'category',
  resolved: 'status',
  dismissed: 'status',
};

const COMPLAINT_ACTION_VARIANT_MAP: Record<string, 'status' | 'category' | 'premium' | 'top-rated' | 'urgency'> = {
  warning: 'category',
  suspension: 'urgency',
  ban: 'urgency',
  refund: 'status',
  none: 'status',
};

const AdminManageComplaints: React.FC = () => {
  const { accessToken } = useAuth();
  const { showSuccess, showError } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof Complaint>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'investigate' | 'resolve' | 'dismiss' | null>(null);

  const {
    data,
  } = useQuery<ComplaintsApiResponse, Error>({
    queryKey: ['complaints', currentPage, searchTerm, filterValue, accessToken],
    queryFn: () => fetchComplaints({ page: currentPage, search: searchTerm, filter: filterValue, token: accessToken }),
  });

  const queryClient = useQueryClient();
  const updateComplaintMutation = useMutation({
    mutationFn: ({ complaintId, updateData }: { complaintId: string; updateData: { status?: string; adminAction?: string; adminNotes?: string } }) => 
      updateComplaint(complaintId, updateData, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      showSuccess('تم تحديث البلاغ بنجاح');
      setIsConfirmModalOpen(false);
      setSelectedComplaint(null);
      setActionType(null);
    },
    onError: (error) => {
      showError('فشل تحديث البلاغ', error.message);
    },
  });

  const handleAction = (complaint: Complaint, action: 'investigate' | 'resolve' | 'dismiss') => {
    setSelectedComplaint(complaint);
    setActionType(action);
    setIsConfirmModalOpen(true);
  };

  const confirmAction = () => {
    if (!selectedComplaint || !actionType) return;

    let updateData: { status?: string; adminAction?: string; adminNotes?: string } = {};
    
    switch (actionType) {
      case 'investigate':
        updateData = { status: 'investigating' };
        break;
      case 'resolve':
        updateData = { status: 'resolved' };
        break;
      case 'dismiss':
        updateData = { status: 'dismissed' };
        break;
    }

    updateComplaintMutation.mutate({ complaintId: selectedComplaint._id, updateData });
  };

  const complaints = data?.complaints || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItems || 0;
  const itemsPerPage = data?.itemsPerPage || 10;

  const filterOptions = [
    { value: 'all', label: 'جميع البلاغات' },
    { value: 'pending', label: 'قيد الانتظار' },
    { value: 'investigating', label: 'قيد التحقيق' },
    { value: 'resolved', label: 'تم الحل' },
    { value: 'dismissed', label: 'مرفوض' }
  ];

  const getStatusBadge = (complaint: Complaint) => {
    return (
      <Badge variant={COMPLAINT_STATUS_VARIANT_MAP[complaint.status]} size="sm">
        {complaint.statusLabel}
      </Badge>
    );
  };

  const getActionBadge = (complaint: Complaint) => {
    if (complaint.adminAction === 'none') return null;
    
    return (
      <Badge variant={COMPLAINT_ACTION_VARIANT_MAP[complaint.adminAction]} size="sm">
        {complaint.adminActionLabel}
      </Badge>
    );
  };

  const tableColumns = [
    {
      key: 'reporter' as keyof Complaint,
      label: 'المبلغ',
      sortable: false,
      render: (value: unknown, complaint: Record<string, unknown>) => (
        <div className="text-right">
          <div className="font-medium text-text-primary">
            {(complaint.reporter as any).name.first} {(complaint.reporter as any).name.last}
          </div>
          <div className="text-sm text-text-secondary">{(complaint.reporter as any).email}</div>
        </div>
      )
    },
    {
      key: 'reportedUser' as keyof Complaint,
      label: 'المبلغ عنه',
      sortable: false,
      render: (value: unknown, complaint: Record<string, unknown>) => (
        <div className="text-right">
          <div className="font-medium text-text-primary">
            {(complaint.reportedUser as any).name.first} {(complaint.reportedUser as any).name.last}
          </div>
          <div className="text-sm text-text-secondary">{(complaint.reportedUser as any).email}</div>
        </div>
      )
    },
    {
      key: 'jobRequest' as keyof Complaint,
      label: 'الخدمة',
      sortable: false,
      render: (value: unknown, complaint: Record<string, unknown>) => (
        <div className="text-right">
          <div className="font-medium text-text-primary max-w-md">
            {(complaint.jobRequest as any).title}
          </div>
        </div>
      )
    },
    {
      key: 'problemType' as keyof Complaint,
      label: 'نوع المشكلة',
      sortable: true,
      render: (value: unknown, complaint: Record<string, unknown>) => (
        <div className="text-right">
          <div className="font-medium text-text-primary">{complaint.problemTypeLabel as string}</div>
        </div>
      )
    },
    {
      key: 'status' as keyof Complaint,
      label: 'الحالة',
      sortable: true,
      render: (value: unknown, complaint: Record<string, unknown>) => (
        <div className="flex flex-wrap gap-1 min-w-0">
          {getStatusBadge(complaint as Complaint)}
          {getActionBadge(complaint as Complaint)}
        </div>
      )
    },
    {
      key: 'createdAt' as keyof Complaint,
      label: 'تاريخ البلاغ',
      sortable: true,
      render: (value: unknown, complaint: Record<string, unknown>) => (
        <div className="text-right">
          <div className="text-sm text-text-primary">
            {new Date(complaint.createdAt as string).toLocaleDateString('ar-EG')}
          </div>
          <div className="text-xs text-text-secondary">
            {new Date(complaint.createdAt as string).toLocaleTimeString('ar-EG')}
          </div>
        </div>
      )
    },
    {
      key: 'actions' as keyof Complaint,
      label: 'الإجراءات',
      sortable: false,
      render: (value: unknown, complaint: Record<string, unknown>) => (
        <div className="flex items-center gap-2 justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedComplaint(complaint as Complaint);
              setIsDetailsModalOpen(true);
            }}
            className="p-2"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {complaint.status === 'pending' && (
            <>
              <Button
                variant="secondary"
                size="md"
                leftIcon={<Clock className="h-4 w-4 mr-1" />}
                onClick={() => handleAction(complaint as Complaint, 'investigate')}
              >
                تحقيق
              </Button>
              <Button
                variant="secondary"
                size="md"
                leftIcon={<CheckCircle className="h-4 w-4 mr-1" />}
                onClick={() => handleAction(complaint, 'resolve')}
              >
                حل
              </Button>
              <Button
                variant="secondary"
                size="md"
                leftIcon={<XCircle className="h-4 w-4 mr-1" />}
                onClick={() => handleAction(complaint, 'dismiss')}
              >
                رفض
              </Button>
            </>
          )}
          {complaint.status === 'investigating' && (
            <>
              <Button
                variant="secondary"
                size="md"
                leftIcon={<CheckCircle className="h-4 w-4 mr-1" />}
                onClick={() => handleAction(complaint, 'resolve')}
              >
                حل
              </Button>
              <Button
                variant="secondary"
                size="md"
                leftIcon={<XCircle className="h-4 w-4 mr-1" />}
                onClick={() => handleAction(complaint, 'dismiss')}
              >
                رفض
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  const breadcrumbItems = [
    { label: 'إدارة البلاغات' }
  ];

  const getActionTitle = () => {
    switch (actionType) {
      case 'investigate': return 'بدء التحقيق';
      case 'resolve': return 'حل البلاغ';
      case 'dismiss': return 'رفض البلاغ';
      default: return 'تأكيد الإجراء';
    }
  };

  const getActionMessage = () => {
    switch (actionType) {
      case 'investigate': return 'هل أنت متأكد من بدء التحقيق في هذا البلاغ؟';
      case 'resolve': return 'هل أنت متأكد من حل هذا البلاغ؟';
      case 'dismiss': return 'هل أنت متأكد من رفض هذا البلاغ؟';
      default: return 'هل أنت متأكد من تنفيذ هذا الإجراء؟';
    }
  };

  return (
    <div className="space-y-6 max-w-none">
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="text-3xl font-bold text-deep-teal">إدارة البلاغات</h1>
      
      <div className="bg-light-cream rounded-2xl p-8 shadow-md">
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterValue={filterValue}
          onFilterChange={setFilterValue}
          filterOptions={filterOptions}
          placeholder="البحث في البلاغات..."
        />

        <SortableTable
          data={complaints}
          columns={tableColumns}
          onSort={(key, direction) => {
            setSortKey(key);
            setSortDirection(direction);
          }}
          sortKey={sortKey}
          sortDirection={sortDirection}
          emptyMessage="لا توجد بلاغات"
          className="mt-8"
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setSelectedComplaint(null);
          setActionType(null);
        }}
        onConfirm={confirmAction}
        title={getActionTitle()}
        message={getActionMessage()}
        confirmText="تأكيد"
        cancelText="إلغاء"
        isLoading={updateComplaintMutation.isPending}
      />

      {/* Details Modal */}
      {selectedComplaint && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isDetailsModalOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">تفاصيل البلاغ</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedComplaint(null);
                }}
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Status and Action */}
              <div className="flex items-center gap-4">
                {getStatusBadge(selectedComplaint)}
                {getActionBadge(selectedComplaint)}
              </div>

              {/* Users Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    المبلغ
                  </h4>
                  <p className="text-sm text-text-primary">
                    {selectedComplaint.reporter.name.first} {selectedComplaint.reporter.name.last}
                  </p>
                  <p className="text-xs text-text-secondary">{selectedComplaint.reporter.email}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    المبلغ عنه
                  </h4>
                  <p className="text-sm text-text-primary">
                    {selectedComplaint.reportedUser.name.first} {selectedComplaint.reportedUser.name.last}
                  </p>
                  <p className="text-xs text-text-secondary">{selectedComplaint.reportedUser.email}</p>
                </div>
              </div>

              {/* Service Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  الخدمة
                </h4>
                <p className="text-sm text-text-primary">{selectedComplaint.jobRequest.title}</p>
              </div>

              {/* Problem Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-text-primary mb-2">تفاصيل المشكلة</h4>
                <div className="space-y-2">
                  <p className="text-sm text-text-primary">
                    <span className="font-medium">النوع:</span> {selectedComplaint.problemTypeLabel}
                  </p>
                  <p className="text-sm text-text-primary">
                    <span className="font-medium">الوصف:</span>
                  </p>
                  <p className="text-sm text-text-secondary bg-white p-3 rounded-lg border">
                    {selectedComplaint.description}
                  </p>
                </div>
              </div>

              {/* Admin Notes */}
              {selectedComplaint.adminNotes && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">ملاحظات الإدارة</h4>
                  <p className="text-sm text-blue-700">{selectedComplaint.adminNotes}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-text-primary">تاريخ البلاغ:</span>
                  <p className="text-text-secondary">
                    {new Date(selectedComplaint.createdAt).toLocaleDateString('ar-EG')} {new Date(selectedComplaint.createdAt).toLocaleTimeString('ar-EG')}
                  </p>
                </div>
                {selectedComplaint.resolvedAt && (
                  <div>
                    <span className="font-medium text-text-primary">تاريخ الحل:</span>
                    <p className="text-text-secondary">
                      {new Date(selectedComplaint.resolvedAt).toLocaleDateString('ar-EG')} {new Date(selectedComplaint.resolvedAt).toLocaleTimeString('ar-EG')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageComplaints; 