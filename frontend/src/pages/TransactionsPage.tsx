import React, { useEffect, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import BaseCard from '../components/ui/BaseCard';
import Button from '../components/ui/Button';
import SortableTable, { SortDirection } from '../admin/components/UI/SortableTable';
// Inline Column type from SortableTable
interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  className?: string;
}
import { useAuth } from '../contexts/AuthContext';
import { Search } from 'lucide-react';
import Modal from '../admin/components/UI/Modal';
import FormInput from '../components/ui/FormInput';
import FormSelect from '../components/ui/FormSelect';

interface Transaction extends Record<string, unknown> {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  seekerId: { _id: string; name: { first: string; last: string } };
  providerId: { _id: string; name: { first: string; last: string } };
  serviceTitle: string;
  paymentMethod: string;
  type?: string;
}

const TransactionsPage: React.FC = () => {
  const { accessToken, user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState<keyof Transaction | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [search, setSearch] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/payment/my-transactions?page=${page}&limit=20`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = await res.json();
        if (data.success) {
          setTransactions(data.data.payments);
          setTotalPages(data.data.pagination.pages);
        } else {
          setError(data.message || 'فشل في جلب المعاملات');
        }
      } catch {
        setError('حدث خطأ أثناء جلب المعاملات');
      } finally {
        setLoading(false);
      }
    };
    if (accessToken) fetchTransactions();
  }, [accessToken, page]);

  useEffect(() => {
    // Filter transactions by search, status, type, and date
    let filtered = transactions;
    if (search) {
      filtered = filtered.filter(t =>
        t.serviceTitle?.toLowerCase().includes(search.toLowerCase()) ||
        `${t.seekerId.name.first} ${t.seekerId.name.last}`.includes(search) ||
        `${t.providerId.name.first} ${t.providerId.name.last}`.includes(search)
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(t => t.status === statusFilter);
    }
    if (typeFilter) {
      filtered = filtered.filter(t => {
        if (typeFilter === 'refund') return t.status === 'refunded' || t.status === 'partial_refund';
        if (typeFilter === 'pay') return t.status === 'completed' && t.seekerId._id === user?.id;
        if (typeFilter === 'receive') return t.status === 'completed' && t.providerId._id === user?.id;
        if (typeFilter === 'escrow') return t.status === 'escrowed';
        return true;
      });
    }
    if (dateFrom) {
      filtered = filtered.filter(t => new Date(t.createdAt) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(t => new Date(t.createdAt) <= new Date(dateTo));
    }
    setFilteredTransactions(filtered);
  }, [search, transactions, statusFilter, typeFilter, dateFrom, dateTo, user]);

  const columns: Column<Transaction>[] = [
    {
      key: 'createdAt',
      label: 'التاريخ',
      sortable: true,
      render: (value) => value ? new Date(value as string).toLocaleDateString('ar-EG') : '',
    },
    {
      key: 'serviceTitle',
      label: 'الخدمة',
      sortable: false,
      render: (value) => value as string || '',
    },
    {
      key: 'amount',
      label: 'المبلغ',
      sortable: true,
      render: (value, item) => value !== undefined ? `${value} ${(item.currency === 'egp' ? 'جنيه' : (item.currency as string).toUpperCase())}` : '',
    },
    {
      key: 'status',
      label: 'الحالة',
      sortable: true,
      render: (value) => {
        const statusMap: Record<string, string> = {
          completed: 'مكتمل',
          escrowed: 'في الضمان',
          pending: 'قيد الانتظار',
          failed: 'فشل',
          cancelled: 'ملغي',
          refunded: 'مسترد',
          partial_refund: 'استرداد جزئي',
        };
        const colorMap: Record<string, string> = {
          completed: 'text-green-600',
          escrowed: 'text-blue-600',
          pending: 'text-amber-600',
          failed: 'text-red-600',
          cancelled: 'text-gray-500',
          refunded: 'text-purple-600',
          partial_refund: 'text-purple-500',
        };
        const v = value as string;
        return <span className={colorMap[v] || ''}>{statusMap[v] || v}</span>;
      },
    },
    {
      key: 'paymentMethod',
      label: 'طريقة الدفع',
      sortable: false,
      render: (value) => value === 'card' ? 'بطاقة' : (value as string || ''),
    },
    {
      key: 'seekerId',
      label: 'دافع المبلغ',
      sortable: false,
      render: (_value, item) => `${item.seekerId.name.first} ${item.seekerId.name.last}`,
    },
    {
      key: 'providerId',
      label: 'مستلم المبلغ',
      sortable: false,
      render: (_value, item) => `${item.providerId.name.first} ${item.providerId.name.last}`,
    },
    {
      key: 'type',
      label: 'نوع المعاملة',
      sortable: false,
      render: (_value, item) => {
        if (item.status === 'refunded' || item.status === 'partial_refund') return 'استرداد';
        if (item.status === 'completed' && item.seekerId._id === user?.id) return 'دفع';
        if (item.status === 'completed' && item.providerId._id === user?.id) return 'تحويل';
        if (item.status === 'escrowed') return 'إيداع ضمان';
        return 'معاملة';
      }
    },
    {
      key: 'actions' as keyof Transaction,
      label: 'تفاصيل',
      sortable: false,
      render: (_value, item) => (
        <Button size="xs" variant="outline" onClick={() => setSelectedTransaction(item)}>عرض</Button>
      )
    }
  ];

  const handleSort = (key: keyof Transaction, direction: SortDirection) => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const breadcrumbItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'معاملاتي', active: true },
  ];

  return (
    <PageLayout title="معاملاتي" breadcrumbItems={breadcrumbItems}>
      <BaseCard>
        <h2 className="text-2xl font-bold mb-6 text-deep-teal">سجل المعاملات المالية</h2>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex-1 min-w-[200px]">
            <FormInput
              type="text"
              variant="search"
              placeholder="ابحث عن معاملة أو خدمة..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="min-w-[160px]">
            <FormSelect
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'كل الحالات' },
                { value: 'completed', label: 'مكتمل' },
                { value: 'escrowed', label: 'في الضمان' },
                { value: 'pending', label: 'قيد الانتظار' },
                { value: 'failed', label: 'فشل' },
                { value: 'cancelled', label: 'ملغي' },
                { value: 'refunded', label: 'مسترد' },
                { value: 'partial_refund', label: 'استرداد جزئي' },
              ]}
              placeholder="كل الحالات"
              size="sm"
            />
          </div>
          <div className="min-w-[160px]">
            <FormSelect
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              options={[
                { value: '', label: 'كل الأنواع' },
                { value: 'pay', label: 'دفع' },
                { value: 'receive', label: 'تحويل' },
                { value: 'escrow', label: 'إيداع ضمان' },
                { value: 'refund', label: 'استرداد' },
              ]}
              placeholder="كل الأنواع"
              size="sm"
            />
          </div>
          <div className="min-w-[140px]">
            <FormInput
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              placeholder="من التاريخ"
              size="sm"
            />
          </div>
          <div className="min-w-[140px]">
            <FormInput
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              placeholder="إلى التاريخ"
              size="sm"
            />
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12 text-text-secondary">جاري تحميل المعاملات...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : (
          <SortableTable<Transaction>
            data={filteredTransactions}
            columns={columns}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
            emptyMessage="لا توجد معاملات حتى الآن"
          />
        )}
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            السابق
          </Button>
          <span className="px-4 py-2 text-text-secondary">صفحة {page} من {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            التالي
          </Button>
        </div>
      </BaseCard>
      {/* Transaction Details Modal */}
      <Modal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title="تفاصيل المعاملة"
        size="md"
      >
        {selectedTransaction && (
          <div className="space-y-3 text-sm">
            <div><span className="font-bold">الخدمة:</span> {selectedTransaction.serviceTitle}</div>
            <div><span className="font-bold">المبلغ:</span> {selectedTransaction.amount} {selectedTransaction.currency === 'egp' ? 'جنيه' : selectedTransaction.currency.toUpperCase()}</div>
            <div><span className="font-bold">الحالة:</span> {selectedTransaction.status}</div>
            <div><span className="font-bold">طريقة الدفع:</span> {selectedTransaction.paymentMethod === 'card' ? 'بطاقة' : selectedTransaction.paymentMethod}</div>
            <div><span className="font-bold">دافع المبلغ:</span> {selectedTransaction.seekerId.name.first} {selectedTransaction.seekerId.name.last}</div>
            <div><span className="font-bold">مستلم المبلغ:</span> {selectedTransaction.providerId.name.first} {selectedTransaction.providerId.name.last}</div>
            <div><span className="font-bold">تاريخ الإنشاء:</span> {new Date(selectedTransaction.createdAt).toLocaleString('ar-EG')}</div>
            {/* Add more fields as needed */}
          </div>
        )}
      </Modal>
    </PageLayout>
  );
};

export default TransactionsPage; 