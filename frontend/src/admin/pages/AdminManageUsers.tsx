import React, { useState } from 'react';
import { Shield, User, UserCheck } from 'lucide-react';
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

// Define types for API response
interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string | Date;
}
interface UsersApiResponse {
  users: User[];
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Utility to map backend user to frontend
function mapUser(raw: unknown): User {
  if (typeof raw !== 'object' || raw === null) throw new Error('Invalid user object');
  const obj = raw as Record<string, unknown>;
  return {
    id: String(obj._id || obj.id),
    name: obj.name && typeof obj.name === 'object' ? `${(obj.name as Record<string, unknown>).first} ${(obj.name as Record<string, unknown>).last}` : String(obj.name),
    email: String(obj.email),
    phone: String(obj.phone),
    address: obj.profile && typeof obj.profile === 'object' && (obj.profile as Record<string, unknown>).location && typeof (obj.profile as Record<string, unknown>).location === 'object' ? String(((obj.profile as Record<string, unknown>).location as Record<string, unknown>).address || '') : '',
    isVerified: typeof obj.isVerified === 'boolean' ? obj.isVerified : false,
    isBlocked: Boolean(obj.isBlocked),
    createdAt: String(obj.createdAt),
  };
}

const fetchUsers = async ({ page, search, filter, token }: { page: number; search: string; filter: string; token: string | null; }): Promise<UsersApiResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (search) params.append('search', search);
  if (filter && filter !== 'all') params.append('filter', filter);
  console.debug('[fetchUsers] token:', token);
  const res = await fetch(`/api/users?${params.toString()}`, {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('فشل تحميل المستخدمين');
  const raw = await res.json();
  // Debug log
  console.debug('[fetchUsers] response:', raw);
  // Support both { users, total, ... } and { data: { users, total, ... } }
  const data = raw.users ? raw : raw.data;
  return {
    users: (data.users || []).map(mapUser),
    totalPages: data.totalPages || Math.ceil((data.total || 0) / (data.limit || 10)),
    totalItems: data.total || 0,
    itemsPerPage: data.limit || 10,
  };
};

const blockUser = async (userId: string, block: boolean, token: string | null) => {
  const endpoint = block ? `/api/users/${userId}/block` : `/api/users/${userId}/unblock`;
  console.debug('[blockUser] token:', token, 'userId:', userId, 'block:', block);
  const res = await fetch(endpoint, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('فشل تحديث حالة المستخدم');
  return res.json();
};

const USER_STATUS_VARIANT_MAP: Record<string, 'status' | 'category' | 'premium' | 'top-rated' | 'urgency'> = {
  blocked: 'urgency',
  verified: 'category',
  unverified: 'status',
};

const AdminManageUsers: React.FC = () => {
  const { accessToken, user: currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof User>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<UsersApiResponse, Error>({
    queryKey: ['users', currentPage, searchTerm, filterValue, accessToken],
    queryFn: () => fetchUsers({ page: currentPage, search: searchTerm, filter: filterValue, token: accessToken }),
    // keepPreviousData: true, // Not supported in object syntax in React Query v5+
  });

  const queryClient = useQueryClient();
  const blockMutation = useMutation({
    mutationFn: ({ userId, block }: { userId: string; block: boolean }) => blockUser(userId, block, accessToken),
    onSuccess: (_, { block }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showSuccess(
        block ? 'تم حظر المستخدم بنجاح' : 'تم إلغاء حظر المستخدم بنجاح'
      );
    },
    onError: (error) => {
      showError('فشل تحديث حالة المستخدم', error.message);
    },
  });

  const handleToggleUserBlock = (user: User) => {
    // Prevent admin from blocking themselves
    if (currentUser && user.id === currentUser.id) {
      showError('لا يمكنك حظر نفسك', 'لا يمكن للمدير حظر حسابه الخاص');
      return;
    }
    
    setSelectedUser(user);
    setIsConfirmModalOpen(true);
  };

  const confirmToggleBlock = () => {
    if (selectedUser) {
      blockMutation.mutate({ userId: selectedUser.id, block: !selectedUser.isBlocked });
    }
    setIsConfirmModalOpen(false);
    setSelectedUser(null);
  };

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItems || 0;
  const itemsPerPage = data?.itemsPerPage || 10;

  const filterOptions = [
    { value: 'all', label: 'جميع المستخدمين' },
    { value: 'verified', label: 'موثق' },
    { value: 'unverified', label: 'غير موثق' },
    { value: 'blocked', label: 'محظور' }
  ];

  const getUserStatus = (user: User) => {
    if (user.isBlocked) {
      return (
        <Badge variant={USER_STATUS_VARIANT_MAP['blocked']} size="sm" icon={Shield}>
          محظور
        </Badge>
      );
    }
    if (user.isVerified) {
      return (
        <Badge variant={USER_STATUS_VARIANT_MAP['verified']} size="sm" icon={UserCheck}>
          موثق
        </Badge>
      );
    }
    return (
      <Badge variant={USER_STATUS_VARIANT_MAP['unverified']} size="sm" icon={User}>
        غير موثق
      </Badge>
    );
  };

  const tableColumns = [
    {
      key: 'name' as keyof User,
      label: 'الاسم',
      sortable: true,
      render: (value: unknown, user: User) => (
        <span className={`font-medium ${user.isBlocked ? 'text-red-600' : 'text-deep-teal'}`}>
          {String(value)}
        </span>
      )
    },
    {
      key: 'email' as keyof User,
      label: 'البريد الإلكتروني',
      sortable: true,
      render: (value: unknown, user: User) => (
        <span className={user.isBlocked ? 'text-red-600' : 'text-deep-teal'}>
          {String(value)}
        </span>
      )
    },
    {
      key: 'phone' as keyof User,
      label: 'رقم الهاتف',
      sortable: false,
      render: (value: unknown, user: User) => (
        <span className={user.isBlocked ? 'text-red-600' : 'text-deep-teal'}>
          {String(value)}
        </span>
      )
    },
    {
      key: 'address' as keyof User,
      label: 'العنوان',
      sortable: false,
      render: (value: unknown, user: User) => (
        <span className={user.isBlocked ? 'text-red-600' : 'text-deep-teal'}>
          {String(value) || 'غير محدد'}
        </span>
      )
    },
    {
      key: 'isVerified' as keyof User,
      label: 'الحالة',
      sortable: true,
      render: (value: unknown, user: User) => getUserStatus(user)
    },
    {
      key: 'id' as keyof User,
      label: 'الإجراء',
      sortable: false,
      render: (value: unknown, user: User) => {
        const isCurrentUser = currentUser && user.id === currentUser.id;
        return (
          <Button
            variant={user.isBlocked ? 'danger' : 'secondary'}
            size="md"
            leftIcon={user.isBlocked ? <UserCheck className="h-4 w-4 mr-1" /> : <Shield className="h-4 w-4 mr-1" />}
            onClick={() => handleToggleUserBlock(user)}
            loading={blockMutation.isPending && selectedUser?.id === user.id}
            disabled={isCurrentUser || false}
            title={isCurrentUser ? 'لا يمكنك حظر نفسك' : undefined}
          >
            {isCurrentUser ? 'حسابك' : (user.isBlocked ? 'إلغاء الحظر' : 'حظر المستخدم')}
          </Button>
        );
      }
    }
  ];

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[300px] text-lg text-deep-teal">جاري التحميل...</div>
  );
  
  if (isError) return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'إدارة المستخدمين' }]} />
      <h1 className="text-3xl font-bold text-deep-teal">إدارة المستخدمين</h1>
      <div className="text-center py-8 text-red-600">{(error as Error).message}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'إدارة المستخدمين' }]} />
      <h1 className="text-3xl font-bold text-deep-teal">إدارة المستخدمين</h1>
      
      <div className="bg-light-cream rounded-2xl p-8 shadow-md">
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterValue={filterValue}
          onFilterChange={setFilterValue}
          filterOptions={filterOptions}
          placeholder="ابحث عن المستخدمين بالاسم أو البريد الإلكتروني أو رقم الهاتف"
        />

        <SortableTable
          data={users}
          columns={tableColumns}
          onSort={(key, direction) => {
            setSortKey(key);
            setSortDirection(direction);
          }}
          sortKey={sortKey}
          sortDirection={sortDirection}
          className="mt-8"
          emptyMessage="لا توجد مستخدمين"
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmToggleBlock}
        title={selectedUser?.isBlocked ? 'إلغاء حظر المستخدم' : 'حظر المستخدم'}
        message={`هل أنت متأكد من ${selectedUser?.isBlocked ? 'إلغاء حظر' : 'حظر'} المستخدم "${selectedUser?.name}"؟`}
        confirmText={selectedUser?.isBlocked ? 'إلغاء الحظر' : 'حظر'}
        type="warning"
        isLoading={blockMutation.isPending}
      />
    </div>
  );
};

export default AdminManageUsers;