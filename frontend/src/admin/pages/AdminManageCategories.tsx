import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../components/UI/Modal';
import Pagination from '../components/UI/Pagination';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { TableSkeleton } from '../components/UI/LoadingSkeleton';
import Breadcrumb from '../components/UI/Breadcrumb';
import FormInput from '../components/UI/FormInput';
import FormTextarea from '../components/UI/FormTextarea';
import ConfirmationModal from '../components/UI/ConfirmationModal';

const CATEGORIES_API = '/api/categories';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: string | Date;
}
interface CategoriesApiResponse {
  categories: Category[];
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Utility to map backend category to frontend
function mapCategory(raw: unknown): Category {
  if (typeof raw !== 'object' || raw === null) throw new Error('Invalid category object');
  const obj = raw as Record<string, unknown>;
  return {
    id: String(obj._id || obj.id),
    name: String(obj.name),
    description: String(obj.description),
    icon: String(obj.icon),
    createdAt: String(obj.createdAt),
  };
}

const fetchCategories = async ({ page, search }: { page: number; search: string; }): Promise<CategoriesApiResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (search) params.append('search', search);
  const res = await fetch(`${CATEGORIES_API}?${params.toString()}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('فشل تحميل الفئات');
  const raw = await res.json();
  // Debug log
  console.debug('[fetchCategories] token:', null, 'response:', raw);
  return {
    ...raw.data,
    categories: (raw.data.categories || []).map(mapCategory),
    totalPages: raw.data.totalPages || 1,
    totalItems: raw.data.totalItems || 0,
    itemsPerPage: raw.data.itemsPerPage || 10,
  };
};

const addCategory = async (data: { name: string; description: string; icon: string }, token: string | null) => {
  console.debug('[addCategory] token:', token, 'payload:', data);
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('فشل إضافة الفئة');
  return res.json();
};
const editCategory = async (id: string, data: { name: string; description: string; icon: string }, token: string | null) => {
  console.debug('[editCategory] token:', token, 'id:', id, 'payload:', data);
  const res = await fetch(`/api/categories/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('فشل تعديل الفئة');
  return res.json();
};
const deleteCategory = async (id: string, token: string | null) => {
  console.debug('[deleteCategory] token:', token, 'id:', id);
  const res = await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('فشل حذف الفئة');
  return res.json();
};

const AdminManageCategories: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const { accessToken } = useAuth();
  const { showSuccess, showError } = useToast();

  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (data: { name: string; description: string; icon: string }) => addCategory(data, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showSuccess('تم إضافة الفئة بنجاح');
    },
    onError: (error) => {
      showError('فشل إضافة الفئة', error.message);
    },
  });
  
  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; description: string; icon: string } }) => editCategory(id, data, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showSuccess('تم تعديل الفئة بنجاح');
    },
    onError: (error) => {
      showError('فشل تعديل الفئة', error.message);
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showSuccess('تم حذف الفئة بنجاح');
    },
    onError: (error) => {
      showError('فشل حذف الفئة', error.message);
    },
  });

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<CategoriesApiResponse, Error>({
    queryKey: ['categories', currentPage],
    queryFn: () => fetchCategories({ page: currentPage, search: '' }),
  });

  const categories = data?.categories || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItems || 0;
  const itemsPerPage = data?.itemsPerPage || 10;

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setFormData({ name: '', description: '', icon: '' });
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon
    });
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'اسم الفئة مطلوب';
    }
    if (!formData.description.trim()) {
      errors.description = 'وصف الفئة مطلوب';
    }
    if (!formData.icon.trim()) {
      errors.icon = 'رابط الأيقونة مطلوب';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    if (selectedCategory) {
      editMutation.mutate({ id: selectedCategory.id, data: formData });
    } else {
      addMutation.mutate(formData);
    }
    setIsModalOpen(false);
    setFormData({ name: '', description: '', icon: '' });
    setFormErrors({});
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      deleteMutation.mutate(selectedCategory.id);
    }
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[300px] text-lg text-deep-teal">جاري التحميل...</div>
  );
  
  if (isError) return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'إدارة الفئات' }]} />
      <h2 className="text-3xl font-bold text-deep-teal">إدارة الفئات</h2>
      <div className="text-center py-8 text-red-600">{(error as Error).message}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-deep-teal">إدارة الفئات</h2>
        <button
          onClick={handleAddCategory}
          className="flex items-center gap-2 bg-bright-orange text-white font-bold py-2 px-4 rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="h-5 w-5" />
          إضافة فئة جديدة
        </button>
      </div>
      <div className="bg-light-cream rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-warm-cream border-b border-light-cream">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-medium text-deep-teal uppercase tracking-wider">اسم الفئة</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-deep-teal uppercase tracking-wider">الوصف</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-deep-teal uppercase tracking-wider">الأيقونة</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-deep-teal uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-cream text-deep-teal">
              {categories.map((category: Category) => (
                <tr key={category.id} className="hover:bg-bright-orange/10">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-deep-teal text-right">{category.name}</td>
                  <td className="px-6 py-4 text-soft-teal text-right">{category.description}</td>
                  <td className="px-6 py-4 text-right">
                    <img src={category.icon} alt={`${category.name} Icon`} className="h-10 w-10 rounded-full object-cover" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center gap-4 justify-end">
                      <button onClick={() => handleEditCategory(category)} className="flex items-center gap-1 text-deep-teal hover:text-soft-teal font-semibold transition-colors" title="تعديل الفئة" aria-label="تعديل الفئة">
                        <Edit2 className="h-4 w-4" />تعديل
                      </button>
                      <button onClick={() => handleDeleteCategory(category)} className="flex items-center gap-1 text-bright-orange hover:opacity-80 font-semibold transition-opacity" title="حذف الفئة" aria-label="حذف الفئة">
                        <Trash2 className="h-4 w-4" />حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
      {/* Add/Edit/Delete Modals remain as is, to be refactored for backend integration next */}

      {/* Add/Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="اسم الفئة"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="أدخل اسم الفئة"
            error={formErrors.name}
            required
          />
          
          <FormTextarea
            label="وصف الفئة"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="أدخل وصف الفئة"
            rows={3}
            error={formErrors.description}
            required
          />
          
          <FormInput
            label="رابط الأيقونة"
            type="url"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="أدخل رابط الأيقونة"
            error={formErrors.icon}
            required
          />
          
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setFormErrors({});
              }}
              className="px-6 py-2 border border-[#F5E6D3] rounded-lg text-[#0e1b18] hover:bg-[#F5E6D3] transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-bright-orange text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={addMutation.isPending || editMutation.isPending}
            >
              {addMutation.isPending || editMutation.isPending ? 'جاري...' : (selectedCategory ? 'تعديل' : 'إضافة')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={confirmDelete}
        title="حذف الفئة"
        message={`هل أنت متأكد من حذف الفئة "${selectedCategory?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="حذف"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminManageCategories;