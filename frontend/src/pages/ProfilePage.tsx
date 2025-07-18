import React, { useEffect, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BaseCard from '../components/ui/BaseCard';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';

const fetchWithAuth = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json()).error?.message || 'فشل تحميل البيانات');
  return res.json();
};

const TABS = [
  { key: 'offered', label: 'الخدمات' },
  { key: 'requested', label: 'الخدمات المطلوبة' },
  { key: 'reviews', label: 'التقييمات والمراجعات' },
  { key: 'portfolio', label: 'الأعمال/المعرض' },
];

const STATUS_FILTERS = [
  { value: '', label: 'الكل' },
  { value: 'active', label: 'نشط' },
  { value: 'inactive', label: 'غير نشط' },
  { value: 'completed', label: 'مكتمل' },
  { value: 'pending', label: 'قيد الانتظار' },
  { value: 'in_progress', label: 'قيد التنفيذ' },
];

// Minimal types for strict linter compliance
interface Service {
  id: string;
  title: string;
  description?: string;
  status?: string;
  createdAt?: string;
  price?: number;
  category?: string;
}
interface Review {
  id: string;
  reviewerName?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
}
// Update Profile type to match DB schema
interface Profile {
  _id: string;
  email: string;
  name: { first: string; last: string };
  phone?: string;
  avatarUrl?: string | null;
  roles: string[];
  seekerProfile?: {
    totalJobsPosted: number;
    rating: number;
    reviewCount: number;
    totalSpent: number;
  };
  providerProfile?: {
    rating: number;
    reviewCount: number;
    totalJobsCompleted: number;
    totalEarnings: number;
    verification: { status: string; method: string | null; documents: string[] };
    skills?: string[]; // Added skills to the interface
    location?: { city: string; government: string }; // Added location to the interface
  };
  isActive: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  bio?: string; // Added bio to the interface
  profile?: { // Added profile to the interface
    bio?: string;
  };
}
interface Stats {
  rating?: number;
  reviewCount?: number;
  jobsCount?: number;
  // Add more fields as needed
}

const ProfilePage: React.FC = () => {
  const { user: authUser, accessToken } = useAuth();
  const { id } = useParams();
  const isSelf = !id || (authUser && (id === authUser?.id));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [requestedServices, setRequestedServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState('offered');
  const [offeredStatus, setOfferedStatus] = useState('');
  const [requestedStatus, setRequestedStatus] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [skillsSuccess, setSkillsSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = accessToken || localStorage.getItem('accessToken') || '';
        // Determine userId to use
        const userId = id || authUser?.id;
        if (!userId) {
          setError('تعذر تحديد المستخدم');
          setLoading(false);
          return;
        }
        const profileUrl = isSelf ? '/api/users/me' : `/api/users/${userId}`;
        const profileRes = await fetchWithAuth(profileUrl, token);
        setProfile(profileRes.data.user);
        const statsRes = await fetchWithAuth(`/api/users/${userId}/stats`, token);
        setStats(statsRes.data.stats);
        if (profileRes.data.user.roles?.includes('provider')) {
          const servicesRes = await fetchWithAuth('/api/users/me/listings', token);
          setServices(servicesRes.data.listings || []);
        } else {
          setServices([]);
        }
        if (profileRes.data.user.roles?.includes('seeker')) {
          const reqRes = await fetchWithAuth('/api/requests?seeker=current', token);
          setRequestedServices(reqRes.data.jobRequests || []);
        } else {
          setRequestedServices([]);
        }
        const reviewsRes = await fetchWithAuth(`/api/reviews/user/${userId}`, token);
        setReviews(reviewsRes.data.reviews || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'حدث خطأ أثناء تحميل البيانات');
        } else {
          setError('حدث خطأ أثناء تحميل البيانات');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, accessToken, authUser]);

  // Fetch provider skills if provider
  useEffect(() => {
    if (profile && profile.roles.includes('provider') && isSelf && accessToken) {
      setSkillsLoading(true);
      fetch('/api/users/me/skills', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setSkills(data.data.skills || []);
          else setSkillsError('فشل تحميل المهارات');
        })
        .catch(() => setSkillsError('فشل تحميل المهارات'))
        .finally(() => setSkillsLoading(false));
    }
  }, [profile, isSelf, accessToken]);

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill('');
    }
  };
  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };
  const handleSaveSkills = async () => {
    setSkillsLoading(true);
    setSkillsError(null);
    setSkillsSuccess(null);
    try {
      const res = await fetch('/api/users/me/skills', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ skills })
      });
      const data = await res.json();
      if (data.success) {
        setSkillsSuccess('تم حفظ المهارات بنجاح');
      } else {
        setSkillsError(data.error?.message || 'فشل حفظ المهارات');
      }
    } catch {
      setSkillsError('فشل حفظ المهارات');
    } finally {
      setSkillsLoading(false);
      setTimeout(() => setSkillsSuccess(null), 2000);
    }
  };

  // Helper: get full name
  const getFullName = (user: Profile | null) => {
    if (!user) return '';
    return `${user.name?.first || ''} ${user.name?.last || ''}`.trim();
  };

  // Helper: get roles
  const getRoles = (user: Profile | null) => {
    if (!user?.roles) return [];
    return user.roles;
  };

  // Helper: get rating
  const getRating = (user: Profile | null) => {
    if (!user) return 0;
    if (user.roles.includes('provider')) return user.providerProfile?.rating || 0;
    if (user.roles.includes('seeker')) return user.seekerProfile?.rating || 0;
    return 0;
  };
  const getReviewCount = (user: Profile | null) => {
    if (!user) return 0;
    if (user.roles.includes('provider')) return user.providerProfile?.reviewCount || 0;
    if (user.roles.includes('seeker')) return user.seekerProfile?.reviewCount || 0;
    return 0;
  };

  return (
    <PageLayout
      title="الملف الشخصي"
      subtitle="عرض معلومات المستخدم"
      breadcrumbItems={[
        { label: 'الرئيسية', href: '/' },
        { label: 'الملف الشخصي', active: true }
      ]}
      showHeader
      showFooter
      showBreadcrumb
      className="font-cairo"
    >
      <div dir="rtl" className="max-w-4xl mx-auto py-8">
        {loading ? (
          <div className="text-center text-deep-teal text-lg" aria-live="polite">جاري تحميل البيانات...</div>
        ) : error ? (
          <BaseCard className="max-w-md mx-auto text-center text-red-600 text-lg" aria-live="assertive">
            {error}
          </BaseCard>
        ) : profile && stats ? (
          <BaseCard className="mb-8 p-6 flex flex-col lg:flex-row gap-8 items-center lg:items-start bg-light-cream">
            {/* Avatar + Upload */}
            <div className="relative shrink-0 flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-cover bg-center ring-4 ring-white/50" style={{ backgroundImage: `url(${profile.avatarUrl || ''})` }} />
              </div>
            </div>
            {/* Main Info */}
            <div className="flex-1 flex flex-col gap-2 items-center lg:items-start">
              <div className="flex flex-col gap-1 items-center lg:items-start">
                <h1 className="text-3xl font-bold text-deep-teal font-cairo mb-1">{getFullName(profile)}</h1>
                {profile?.profile?.bio && (
                  <p className="text-text-secondary text-base text-center lg:text-right mt-2 mb-1 whitespace-pre-line">
                    {profile.profile.bio}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mb-1">
                  {getRoles(profile).map((role: string) => (
                    <span key={role} className="bg-soft-teal/20 text-deep-teal px-3 py-1 rounded-full text-xs font-semibold font-cairo border border-soft-teal/40">{role === 'provider' ? 'مقدم خدمة' : role === 'seeker' ? 'باحث عن خدمة' : role === 'admin' ? 'مشرف' : role}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-accent text-lg font-cairo">
                  <span className="font-bold">{getRating(profile)}</span>
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  <span className="text-sm text-text-secondary">({getReviewCount(profile)} تقييم)</span>
                </div>
              </div>
              {/* Location */}
              {profile?.profile?.location?.city && profile?.profile?.location?.government && (
                <div className="text-text-secondary text-sm flex items-center gap-2">
                  <span className="inline-block">{profile.profile.location.city}, {profile.profile.location.government}</span>
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
                </div>
              )}
              {/* Verified Badge */}
              {profile?.providerProfile?.verification?.status === 'verified' && (
                <div className="flex items-center gap-1 text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  تم التحقق من الهوية
                </div>
              )}
              {/* Member Since */}
              {profile?.createdAt && (
                <div className="text-text-secondary text-xs">عضو منذ: {new Date(profile.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}</div>
              )}
              {/* Last Active */}
              {profile?.lastLoginAt && (
                <div className="text-text-secondary text-xs">آخر تواجد: {new Date(profile.lastLoginAt).toLocaleString('ar-EG')}</div>
              )}
              {/* Skills */}
              {profile?.providerProfile?.skills && profile.providerProfile.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.providerProfile.skills.map((skill: string) => (
                    <span key={skill} className="bg-[#F5A623]/10 text-[#F5A623] px-3 py-1 rounded-full text-xs font-cairo border border-[#F5A623]/30">{skill}</span>
                  ))}
                </div>
              )}
          </div>
          </BaseCard>
        ) : null}
        {profile && profile.roles.includes('provider') && isSelf && (
          <BaseCard className="mb-8 p-6 bg-white border border-gray-200">
            <h2 className="text-xl font-bold text-[#2D5D4F] mb-4">المهارات</h2>
            {skillsLoading ? (
              <div className="text-center text-deep-teal">جاري تحميل المهارات...</div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.map(skill => (
                    <span key={skill} className="bg-[#F5A623]/10 text-[#F5A623] px-3 py-1 rounded-full text-sm font-cairo border border-[#F5A623]/30 flex items-center gap-1">
                      {skill}
                      <button type="button" className="ml-1 text-red-500 hover:text-red-700" onClick={() => handleRemoveSkill(skill)} title="حذف المهارة">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mb-4">
                  <FormInput
                    type="text"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    placeholder="أضف مهارة جديدة..."
                    className="flex-1 text-right"
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                  />
                  <Button type="button" onClick={handleAddSkill} disabled={!newSkill.trim()} variant="secondary">إضافة</Button>
                </div>
                <Button type="button" onClick={handleSaveSkills} loading={skillsLoading} variant="primary">حفظ المهارات</Button>
                {skillsError && <div className="text-red-600 mt-2">{skillsError}</div>}
                {skillsSuccess && <div className="text-green-600 mt-2">{skillsSuccess}</div>}
              </>
            )}
          </BaseCard>
        )}
        <div className="w-full mt-8">
          <div className="flex gap-2 md:gap-4 border-b border-[#E5E7EB] mb-4 rtl flex-row-reverse" role="tablist">
            {TABS.map(tab => (
              <button
                    key={tab.key}
                className={`px-4 py-2 font-semibold rounded-t-lg focus:outline-none transition-colors duration-200 ${activeTab === tab.key ? 'bg-[#FDF8F0] text-[#2D5D4F] border-b-2 border-[#2D5D4F]' : 'text-[#50958A] bg-transparent'}`}
                onClick={() => setActiveTab(tab.key)}
                    role="tab"
                  >
                    {tab.label}
              </button>
                ))}
          </div>
          <div className="min-h-[200px]" id="profile-tabs-content">
            {/* الخدمات (offered services) */}
            {activeTab === 'offered' && (
              <div id="tab-panel-offered" role="tabpanel" aria-labelledby="offered">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
                  <label htmlFor="offered-status" className="text-[#0E1B18] font-medium">تصفية حسب الحالة:</label>
                  <select
                    id="offered-status"
                    className="rounded-lg border border-[#E5E7EB] px-3 py-2 focus:ring-2 focus:ring-[#2D5D4F] text-[#2D5D4F] bg-white"
                    value={offeredStatus}
                    onChange={e => setOfferedStatus(e.target.value)}
                  >
                    {STATUS_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                {services && services.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(services as Service[]).filter((s: Service) => !offeredStatus || s.status === offeredStatus).length > 0 ? (
                      (services as Service[]).filter((s: Service) => !offeredStatus || s.status === offeredStatus).map((service: Service, idx: number) => (
                        <BaseCard key={service.id || idx} className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#2D5D4F]">{service.title}</span>
                            <span className="text-xs text-[#50958A] bg-[#F5E6D3] rounded px-2 py-1">{service.status ? STATUS_FILTERS.find(f => f.value === service.status)?.label : '—'}</span>
                            {service.category && <span className="text-xs text-[#50958A] bg-[#FDF8F0] rounded px-2 py-1">{service.category}</span>}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#50958A]">
                            {service.createdAt && <span>تاريخ الإضافة: {new Date(service.createdAt).toLocaleDateString('ar-EG')}</span>}
                            {service.price && <span>السعر: {service.price} جنيه</span>}
                          </div>
                          <div className="text-[#0E1B18] text-sm line-clamp-2">{service.description}</div>
                          {/* Add more service info as needed */}
                        </BaseCard>
                      ))
                    ) : (
                      <div className="text-[#50958A] text-center w-full py-8 flex flex-col items-center justify-center gap-2">
                        <svg className="w-8 h-8 mb-2 text-[#50958A]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>
                        لا توجد خدمات بهذه الحالة.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[#50958A] text-center w-full py-8">لا توجد خدمات معروضة بعد.</div>
                )}
              </div>
            )}
            {/* الخدمات المطلوبة (requested services) */}
            {activeTab === 'requested' && (
              <div id="tab-panel-requested" role="tabpanel" aria-labelledby="requested">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
                  <label htmlFor="requested-status" className="text-[#0E1B18] font-medium">تصفية حسب الحالة:</label>
                  <select
                    id="requested-status"
                    className="rounded-lg border border-[#E5E7EB] px-3 py-2 focus:ring-2 focus:ring-[#2D5D4F] text-[#2D5D4F] bg-white"
                    value={requestedStatus}
                    onChange={e => setRequestedStatus(e.target.value)}
                  >
                    {STATUS_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                {requestedServices && requestedServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(requestedServices as Service[]).filter((s: Service) => !requestedStatus || s.status === requestedStatus).length > 0 ? (
                      (requestedServices as Service[]).filter((s: Service) => !requestedStatus || s.status === requestedStatus).map((service: Service, idx: number) => (
                        <BaseCard key={service.id || idx} className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#2D5D4F]">{service.title}</span>
                            <span className="text-xs text-[#50958A] bg-[#F5E6D3] rounded px-2 py-1">{service.status ? STATUS_FILTERS.find(f => f.value === service.status)?.label : '—'}</span>
                          </div>
                          <div className="text-[#0E1B18] text-sm line-clamp-2">{service.description}</div>
                          {/* Add more requested service info as needed */}
                        </BaseCard>
                      ))
                    ) : (
                      <div className="text-[#50958A] text-center w-full py-8">لا توجد خدمات مطلوبة بهذه الحالة.</div>
                    )}
                  </div>
                ) : (
                  <div className="text-[#50958A] text-center w-full py-8">لا توجد خدمات مطلوبة بعد.</div>
                )}
                </div>
            )}
            {/* التقييمات والمراجعات (reviews) */}
            {activeTab === 'reviews' && (
              <div id="tab-panel-reviews" role="tabpanel" aria-labelledby="reviews">
                {reviews && reviews.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {(reviews as Review[]).map((review: Review, idx: number) => (
                      <BaseCard key={review.id || idx} className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#2D5D4F]">{review.reviewerName}</span>
                          <span className="text-xs text-[#50958A] bg-[#F5E6D3] rounded px-2 py-1">{review.rating} ★</span>
                        </div>
                        <div className="text-[#0E1B18] text-sm">{review.comment}</div>
                        <div className="text-xs text-[#50958A]">{review.createdAt && new Date(review.createdAt).toLocaleDateString('ar-EG')}</div>
                      </BaseCard>
                    ))}
                  </div>
                ) : (
                  <div className="text-[#50958A] text-center w-full py-8">لا توجد تقييمات أو مراجعات بعد.</div>
                )}
              </div>
            )}
            {/* الأعمال/المعرض (portfolio) */}
            {activeTab === 'portfolio' && (
              <div id="tab-panel-portfolio" role="tabpanel" aria-labelledby="portfolio">
                {/* TODO: Integrate portfolio API if available */}
                <div className="text-[#50958A] text-center w-full py-8">لم يتم إضافة أعمال أو معرض بعد.</div>
              </div>
            )}
          </div>
        </div>
    </div>
    </PageLayout>
  );
};

export default ProfilePage; 