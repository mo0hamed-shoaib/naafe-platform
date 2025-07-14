import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import SearchAndFilter from '../components/UI/SearchAndFilter';
import Pagination from '../components/UI/Pagination';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';

// Define types for API response
interface User {
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
  const obj = raw as Record<string, any>;
  return {
    id: obj._id || obj.id,
    name: obj.name && typeof obj.name === 'object' ? `${obj.name.first} ${obj.name.last}` : obj.name,
    email: obj.email,
    phone: obj.phone,
    address: obj.profile?.location?.address || '',
    isVerified: typeof obj.isVerified === 'boolean' ? obj.isVerified : false, // fallback if not present
    isBlocked: obj.isBlocked,
    createdAt: obj.createdAt,
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

const AdminManageUsers: React.FC = () => {
  const { accessToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const toggleUserBlock = (userId: string, isBlocked: boolean) => {
    blockMutation.mutate({ userId, block: !isBlocked });
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
        <span className="inline-flex items-center rounded-full bg-bright-orange px-3 py-1 text-xs font-medium text-white">
          محظور
        </span>
      );
    }
    
    if (user.isVerified) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-deep-teal px-3 py-1 text-xs font-medium text-white">
          <CheckCircle className="h-3 w-3" />
          موثق
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center rounded-full bg-warm-cream px-3 py-1 text-xs font-medium text-soft-teal">
        غير موثق
      </span>
    );
  };

  if (isLoading) return <div className="text-center py-8">جاري التحميل...</div>;
  if (isError) return <div className="text-center py-8 text-error">{(error as Error).message}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-deep-teal">إدارة المستخدمين</h1>
      
      <div className="bg-light-cream rounded-2xl p-6 shadow-md">
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterValue={filterValue}
          onFilterChange={setFilterValue}
          filterOptions={filterOptions}
          placeholder="ابحث عن المستخدمين بالاسم أو البريد الإلكتروني أو رقم الهاتف"
        />

        <div className="overflow-hidden rounded-xl bg-warm-cream shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-warm-cream border-b border-light-cream">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-medium text-deep-teal uppercase tracking-wider">
                    الاسم
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-deep-teal uppercase tracking-wider">
                    رقم الهاتف
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-deep-teal uppercase tracking-wider">
                    البريد الإلكتروني
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-deep-teal uppercase tracking-wider">
                    العنوان
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-deep-teal uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-deep-teal uppercase tracking-wider">
                    الإجراء
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-cream text-deep-teal">
                {users.map((user: User) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-bright-orange/10 transition-colors ${
                      user.isBlocked ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className={`px-6 py-4 whitespace-nowrap font-medium ${
                      user.isBlocked ? 'text-bright-orange' : 'text-deep-teal'
                    } text-right`}>
                      {user.name}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${
                      user.isBlocked ? 'text-bright-orange' : 'text-deep-teal'
                    } text-right`}>
                      {user.phone}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${
                      user.isBlocked ? 'text-bright-orange' : 'text-deep-teal'
                    } text-right`}>
                      {user.email}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${
                      user.isBlocked ? 'text-bright-orange' : 'text-deep-teal'
                    } text-right`}>
                      {user.address}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getUserStatus(user)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={user.isBlocked}
                          onChange={() => toggleUserBlock(user.id, user.isBlocked)}
                          className="sr-only peer"
                          aria-label="تبديل حالة الحظر"
                        />
                        <div className="w-11 h-6 bg-warm-cream peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bright-orange"></div>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AdminManageUsers;