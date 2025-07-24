import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useSocket } from '../hooks/useSocket';
import { useOfferContext, Offer } from '../contexts/OfferContext';
import NegotiationSummary from '../components/ui/NegotiationSummary';
import NegotiationHistory from '../components/ui/NegotiationHistory';
import PageLayout from '../components/layout/PageLayout';
import BaseCard from '../components/ui/BaseCard';
import Button from '../components/ui/Button';
import FormTextarea from '../components/ui/FormTextarea';
import PaymentModal from '../components/ui/PaymentModal';
import ReportProblemModal from '../components/ui/ReportProblemModal';
import Modal from '../admin/components/UI/Modal';
import { submitComplaint } from '../services/complaintService';
import { Send, ArrowLeft, MessageCircle, User, CreditCard, AlertTriangle, CheckCircle, AlertCircle, Shield } from 'lucide-react';

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  readAt?: string;
}

interface Conversation {
  _id: string;
  jobRequestId: {
    _id: string;
    title: string;
    description: string;
    status: string;
    budget: {
      min: number;
      max: number;
    };
    location: {
      address: string;
      government: string;
      city: string;
      street: string;
      apartmentNumber: string;
      additionalInformation: string;
    };
    deadline: string;
    createdAt: string;
  };
  participants: {
    seeker: {
      _id: string;
      name: { first: string; last: string };
      email: string;
    };
    provider: {
      _id: string;
      name: { first: string; last: string };
      email: string;
    };
  };
  lastMessage?: {
    content: string;
    senderId: string;
    timestamp: string;
  };
  unreadCount: {
    seeker: number;
    provider: number;
  };
  isActive: boolean;
}

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [searchParams] = useSearchParams();
  const { accessToken, user } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();
  const navigate = useNavigate();
  const { connected, on, emit } = useSocket(accessToken || undefined);
  const { negotiationState, fetchNegotiation, confirmNegotiation, resetNegotiation, fetchNegotiationHistory, updateNegotiation, offers, addNewOffer } = useOfferContext();
  
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [serviceInProgress, setServiceInProgress] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionLoading, setCompletionLoading] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [cancellationLoading, setCancellationLoading] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showNegotiationMobile, setShowNegotiationMobile] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [offerId, setOfferId] = useState<string | null>(null);

  // Fetch conversation details
  useEffect(() => {
    if (!chatId || !accessToken) return;
    
    fetch(`/api/chat/conversations/${chatId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setConversation(data.data.conversation);
        } else {
          setError('فشل تحميل المحادثة');
        }
      })
      .catch(() => setError('فشل الاتصال بالخادم'))
      .finally(() => setLoading(false));
  }, [chatId, accessToken]);

  // Fetch negotiation offerId for this conversation (jobRequestId + providerId)
  useEffect(() => {
    const fetchOfferId = async () => {
      if (conversation && conversation.jobRequestId && conversation.participants && accessToken) {
        const jobRequestId = conversation.jobRequestId._id;
        const providerId = conversation.participants.provider._id;
        
        console.log('Fetching offer ID for:', { jobRequestId, providerId });
        
        try {
          const res = await fetch(`/api/offers?jobRequest=${jobRequestId}&provider=${providerId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          const data = await res.json();
          console.log('Offers data:', data);
          
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            console.log('Found offer:', data.data[0]);
            setOfferId(data.data[0]._id);
            fetchNegotiation(data.data[0]._id);
            fetchNegotiationHistory(data.data[0]._id);
          } else {
            console.log('No offers found for this conversation');
            setOfferId(null);
          }
        } catch (error) {
          console.error('Error fetching offer ID:', error);
        }
      }
    };
    fetchOfferId();
  }, [conversation, accessToken, fetchNegotiation, fetchNegotiationHistory]);

  // Fetch offer details if not present in offers array
  useEffect(() => {
    const fetchOfferIfMissing = async () => {
      if (offerId && !offers.find(o => o.id === offerId) && accessToken) {
        try {
          const res = await fetch(`/api/offers/${offerId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          const data = await res.json();
          if (data.success && data.data) {
            // Map backend offer to frontend Offer type
            const backendOffer = data.data;
            const mappedOffer = {
              id: backendOffer._id,
              name: backendOffer.provider?.name
                ? typeof backendOffer.provider.name === 'object'
                  ? `${backendOffer.provider.name.first || ''} ${backendOffer.provider.name.last || ''}`.trim()
                  : backendOffer.provider.name
                : 'مستخدم غير معروف',
              avatar: backendOffer.provider?.avatarUrl || '',
              rating: backendOffer.provider?.providerProfile?.rating || 0,
              price: backendOffer.budget?.min || 0,
              specialties: backendOffer.provider?.providerProfile?.skills || [],
              verified: backendOffer.provider?.isVerified || false,
              message: backendOffer.message || '',
              estimatedTimeDays: backendOffer.estimatedTimeDays || 1,
              availableDates: backendOffer.availableDates || [],
              timePreferences: backendOffer.timePreferences || [],
              createdAt: backendOffer.createdAt,
            };
            addNewOffer(mappedOffer);
          }
        } catch (error) {
          // Optionally log error
          console.error('Error fetching offer details:', error);
        }
      }
    };
    fetchOfferIfMissing();
  }, [offerId, offers, accessToken, addNewOffer]);

  // Check if payment is completed for this conversation and if service is in progress
  const checkServiceStatus = async () => {
    if (!chatId || !accessToken || !user || !offerId) return;

    try {
      // First check offer status
      const offerResponse = await fetch(`/api/offers/${offerId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (offerResponse.ok) {
        const offerData = await offerResponse.json();
        if (offerData.success && offerData.data) {
          const offerStatus = offerData.data.status;
          setServiceInProgress(offerStatus === 'in_progress');
          setPaymentCompleted(offerStatus === 'in_progress' || offerStatus === 'completed');
        }
      }
      
      // Also check payment status
      const response = await fetch(`/api/payment/check-status/${chatId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        const isCompleted = data.success && (data.data?.status === 'completed' || data.data?.status === 'escrowed');
        setPaymentCompleted(isCompleted);
        console.log('Payment status check:', { status: data.data?.status, isCompleted });
      }
    } catch (error) {
      console.error('Error checking service status:', error);
    }
  };

  // Check service status on mount and when dependencies change
  useEffect(() => {
    if (offerId) {
      checkServiceStatus();
    }
  }, [offerId, chatId, accessToken, user]);

  // Refresh service status when user returns to the page (focus event)
  useEffect(() => {
    const handleFocus = () => {
      if (offerId) {
        checkServiceStatus();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [offerId, chatId, accessToken, user]);

  // Check if user is returning from payment success page
  useEffect(() => {
    const fromPayment = searchParams.get('from_payment');
    if (fromPayment === 'success') {
      // Refresh payment status immediately
      checkServiceStatus();
      // Show success message
      showSuccess('تم الدفع بنجاح', 'تم إتمام عملية الدفع بنجاح');
      // Clean up URL parameter
      navigate(`/chat/${chatId}`, { replace: true });
    }
  }, [searchParams, chatId, navigate]);

  // Periodic payment status check (every 30 seconds) when payment is not completed
  useEffect(() => {
    if (!paymentCompleted && chatId && accessToken && user) {
      const interval = setInterval(() => {
        checkServiceStatus();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [paymentCompleted, chatId, accessToken, user]);

  // Fetch messages
  useEffect(() => {
    if (!chatId || !accessToken) return;
    
    fetch(`/api/chat/conversations/${chatId}/messages?page=${page}&limit=50`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const newMessages = data.data.messages;
          setMessages(prev => page === 1 ? newMessages : [...newMessages, ...prev]);
          setHasMore(data.data.pagination.page < data.data.pagination.pages);
        }
      })
      .catch(() => setError('فشل تحميل الرسائل'));
  }, [chatId, accessToken, page]);

  // Join conversation room when connected
  useEffect(() => {
    if (connected && chatId) {
      emit('join-conversation', { conversationId: chatId });
      
      // Mark messages as read when joining
      emit('mark-read', { conversationId: chatId });
    }
  }, [connected, chatId, emit]);

  // Listen for real-time messages
  useEffect(() => {
    if (!connected) return;

    const offReceiveMessage = on('receive-message', (...args: unknown[]) => {
      const message = args[0] as Message;
      if (message.conversationId === chatId) {
        setMessages(prev => [...prev, message]);
        // Mark as read if user is in the conversation
        emit('mark-read', { conversationId: chatId });
      }
    });

    const offMessageSent = on('message-sent', (...args: unknown[]) => {
      const message = args[0] as Message;
      if (message.conversationId === chatId) {
        setMessages(prev => [...prev, message]);
      }
    });

    return () => {
      offReceiveMessage?.();
      offMessageSent?.();
    };
  }, [connected, on, emit, chatId]);

  // Auto-scroll disabled
  // useEffect(() => {
  //   // No auto-scrolling implementation
  // }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation || !user || sending) return;

    setSending(true);
    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      // Determine receiver ID
      const receiverId = user.id === conversation.participants.seeker._id 
        ? conversation.participants.provider._id 
        : conversation.participants.seeker._id;

      const messageData = {
        conversationId: chatId,
        receiverId,
        content: messageContent
      };

      // Send via Socket.IO
      emit('send-message', messageData);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('فشل إرسال الرسالة');
    } finally {
      setSending(false);
    }
  };

  const loadMoreMessages = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const getOtherParticipant = () => {
    if (!conversation || !user) return null;
    
    return user.id === conversation.participants.seeker._id 
      ? conversation.participants.provider 
      : conversation.participants.seeker;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'اليوم';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'أمس';
    } else {
      return date.toLocaleDateString('ar-EG');
    }
  };

  const handlePaymentConfirm = async (amount: number) => {
    if (!conversation || !user || !accessToken || !offerId) return;

    setPaymentLoading(true);
    try {
      // Use new escrow payment endpoint
      const response = await fetch('/api/payments/create-escrow-payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          offerId,
          amount
        })
      });

      const data = await response.json();
      if (response.ok && data.success && data.data.url) {
        window.location.href = data.data.url;
      } else {
        showError('خطأ في عملية الدفع', data.message || 'فشل في إنشاء جلسة الدفع');
        setShowPaymentModal(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      showError('خطأ في عملية الدفع', 'حدث خطأ أثناء إنشاء جلسة الدفع');
      setShowPaymentModal(false);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Mark service as completed
  const handleCompleteService = async () => {
    if (!offerId || !accessToken) return;

    setCompletionLoading(true);
    try {
      const response = await fetch(`/api/offers/${offerId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showSuccess('تم تأكيد اكتمال الخدمة', 'تم تحرير المبلغ لمقدم الخدمة بنجاح');
        setShowCompletionModal(false);
        checkServiceStatus();
      } else {
        showError('خطأ في تأكيد اكتمال الخدمة', data.message || 'حدث خطأ أثناء تأكيد اكتمال الخدمة');
      }
    } catch (error) {
      console.error('Service completion error:', error);
      showError('خطأ في تأكيد اكتمال الخدمة', 'حدث خطأ أثناء تأكيد اكتمال الخدمة');
    } finally {
      setCompletionLoading(false);
    }
  };

  // Request service cancellation
  const handleRequestCancellation = async () => {
    if (!offerId || !accessToken) return;

    setCancellationLoading(true);
    try {
      const response = await fetch(`/api/offers/${offerId}/cancel-request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: cancellationReason || 'طلب إلغاء بدون سبب محدد'
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showSuccess('تم طلب إلغاء الخدمة', `تم إرسال طلب الإلغاء بنجاح. نسبة الاسترداد المتوقعة: ${data.data.refundPercentage}%`);
        setShowCancellationModal(false);
        checkServiceStatus();
      } else {
        showError('خطأ في طلب إلغاء الخدمة', data.message || 'حدث خطأ أثناء طلب إلغاء الخدمة');
      }
    } catch (error) {
      console.error('Cancellation request error:', error);
      showError('خطأ في طلب إلغاء الخدمة', 'حدث خطأ أثناء طلب إلغاء الخدمة');
    } finally {
      setCancellationLoading(false);
    }
  };

  const handleReportIssue = () => {
    setShowReportModal(true);
  };

  const handleReportSubmit = async (problemType: string, description: string) => {
    if (!conversation || !user) return;
    
    setReportLoading(true);
    try {
      const reportedUserId = isSeeker 
        ? conversation.participants.provider._id 
        : conversation.participants.seeker._id;

      await submitComplaint({
        reportedUserId,
        jobRequestId: conversation.jobRequestId._id,
        problemType,
        description
      }, accessToken);

      setShowReportModal(false);
      showSuccess('تم إرسال البلاغ بنجاح', 'سيتم مراجعة البلاغ من قبل الإدارة قريباً');
    } catch (error) {
      console.error('Error submitting report:', error);
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال البلاغ';
      
      // Check if it's the duplicate complaint error
      if (errorMessage.includes('لديك بلاغ قيد المعالجة')) {
        showWarning('بلاغ موجود بالفعل', 'لديك بلاغ قيد المعالجة لهذا الطلب بالفعل');
      } else {
        showError('فشل إرسال البلاغ', errorMessage);
      }
    } finally {
      setReportLoading(false);
    }
  };

  const isSeeker = user?.id === conversation?.participants.seeker._id;

  const breadcrumbItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'المحادثات', href: '/conversations' },
    { label: 'المحادثة', active: true }
  ];

  if (loading) {
    return (
      <PageLayout
        title="جاري التحميل..."
        user={user}
        onLogout={() => {}}
      >
        <div className="max-w-4xl mx-auto">
          <BaseCard className="animate-pulse">
            <div className="h-96 flex items-center justify-center">
              <div className="text-text-secondary">جاري تحميل المحادثة...</div>
            </div>
          </BaseCard>
        </div>
      </PageLayout>
    );
  }

  if (error || !conversation) {
    return (
      <PageLayout
        title="خطأ"
        user={user}
        onLogout={() => {}}
      >
        <div className="max-w-4xl mx-auto">
          <BaseCard className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">حدث خطأ</h3>
            <p className="text-text-secondary mb-4">{error || 'المحادثة غير موجودة'}</p>
            <Button
              variant="primary"
              onClick={() => navigate('/conversations')}
            >
              العودة للمحادثات
            </Button>
          </BaseCard>
        </div>
      </PageLayout>
    );
  }

  const otherParticipant = getOtherParticipant();

  return (
    <PageLayout
      title={`محادثة مع ${otherParticipant?.name.first} ${otherParticipant?.name.last}`}
      subtitle={conversation.jobRequestId.title}
      breadcrumbItems={breadcrumbItems}
      user={user}
      onLogout={() => {}}
    >

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 h-[85vh] min-h-[600px] max-h-[1000px]">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <BaseCard className="flex-1 flex flex-col h-full">
            {/* Chat Header */}
            <div className="border-b border-gray-100">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/conversations')}
                    className="p-2 flex-shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-text-primary truncate">
                      {otherParticipant?.name.first} {otherParticipant?.name.last}
                    </h3>
                    <p className="text-sm text-text-secondary truncate">
                      {conversation.jobRequestId.title}
                    </p>
                    <p className="text-xs text-text-secondary/70 mt-1">
                      📍 {conversation.jobRequestId.location?.address || 
                        `${conversation.jobRequestId.location?.city || ''} ${conversation.jobRequestId.location?.government || ''}`.trim() || 
                        'غير محدد'}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {connected ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>متصل</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span>غير متصل</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Action Buttons - Hidden on mobile */}
                <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                  {/* Show payment button for seeker when offer is accepted but payment not completed */}
                  {isSeeker && negotiationState[offerId!]?.canAcceptOffer && !paymentCompleted && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setShowPaymentModal(true)}
                      className="flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      دفع ضمان الخدمة
                    </Button>
                  )}
                  
                  {/* Show service completion button for seeker when service is in progress */}
                  {isSeeker && serviceInProgress && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => setShowCompletionModal(true)}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      تأكيد اكتمال الخدمة
                    </Button>
                  )}
                  
                  {/* Show cancellation button only when payment has been made */}
                  {(serviceInProgress || paymentCompleted) && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setShowCancellationModal(true)}
                      className="flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      طلب إلغاء الخدمة
                    </Button>
                  )}
                  
                  {/* Show payment completed badge */}
                  {paymentCompleted && (
                    <div className="flex items-center gap-2 text-green-600 text-sm px-3 py-1 bg-green-50 rounded-full">
                      <Shield className="w-4 h-4" />
                      تم دفع ضمان الخدمة
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReportIssue}
                    className="flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    الإبلاغ عن مشكلة
                  </Button>
                </div>
              </div>
              {/* Service Details */}
              <div className="px-4 pb-4 space-y-3">
                                {/* Mobile Action Buttons */}
                <div className="md:hidden flex flex-col gap-2">
                  <div className="flex gap-2">
                    {/* Show payment button for seeker when offer is accepted but payment not completed */}
                    {isSeeker && negotiationState[offerId!]?.canAcceptOffer && !paymentCompleted && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setShowPaymentModal(true)}
                        className="flex items-center justify-center gap-2 flex-1"
                      >
                        <CreditCard className="w-4 h-4" />
                        دفع ضمان الخدمة
                      </Button>
                    )}
                    
                    {/* Show service completion button for seeker when service is in progress */}
                    {isSeeker && serviceInProgress && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => setShowCompletionModal(true)}
                        className="flex items-center justify-center gap-2 flex-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        تأكيد اكتمال الخدمة
                      </Button>
                    )}
                    
                    {/* Toggle negotiation sidebar on mobile */}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowNegotiationMobile(!showNegotiationMobile)}
                      className="flex items-center justify-center gap-2 flex-1"
                    >
                      {showNegotiationMobile ? 'إخفاء التفاوض' : 'عرض التفاوض'}
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    {/* Show cancellation button only when payment has been made */}
                    {(serviceInProgress || paymentCompleted) && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setShowCancellationModal(true)}
                        className="flex items-center justify-center gap-2 flex-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        طلب إلغاء
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReportIssue}
                      className="flex items-center justify-center gap-2 flex-1"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      الإبلاغ عن مشكلة
                    </Button>
                  </div>
                  
                  {/* Show payment completed badge */}
                  {paymentCompleted && (
                    <div className="flex items-center justify-center gap-2 text-green-600 text-sm py-1 bg-green-50 rounded-full">
                      <Shield className="w-4 h-4" />
                      تم دفع ضمان الخدمة
                    </div>
                  )}
                  
                  {/* Mobile Negotiation Section */}
                  {showNegotiationMobile && (
                    <div className="mt-4 border-t border-gray-200 pt-4 pb-16">
                      {!offerId && (
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
                          <h3 className="font-bold text-amber-800 mb-2">معلومات التصحيح</h3>
                          <p className="text-amber-700 text-sm">لم يتم العثور على معرّف العرض</p>
                        </div>
                      )}
                      {offerId && !negotiationState[offerId] && (
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
                          <h3 className="font-bold text-amber-800 mb-2">معلومات التصحيح</h3>
                          <p className="text-amber-700 text-sm">معرّف العرض: {offerId}</p>
                          <p className="text-amber-700 text-sm">لم يتم العثور على بيانات التفاوض</p>
                          <button 
                            onClick={() => {
                              console.log('Manually fetching negotiation for:', offerId);
                              fetchNegotiation(offerId);
                              fetchNegotiationHistory(offerId);
                            }}
                            className="mt-2 bg-deep-teal text-white px-3 py-1 rounded-md text-xs"
                          >
                            إعادة تحميل بيانات التفاوض
                          </button>
                        </div>
                      )}
                      
                      {offerId && negotiationState[offerId] && user && (
                        <div className="pb-4 flex flex-col space-y-4">
                          <div className="flex-none">
                            <NegotiationSummary
                            negotiation={negotiationState[offerId]}
                            isProvider={user.id === conversation.participants.provider._id}
                            isSeeker={user.id === conversation.participants.seeker._id}
                            jobRequest={{
                              id: conversation.jobRequestId._id,
                              title: conversation.jobRequestId.title,
                              description: conversation.jobRequestId.description || '',
                              budget: {
                                min: conversation.jobRequestId.budget.min,
                                max: conversation.jobRequestId.budget.max,
                                currency: 'EGP'
                              },
                              location: conversation.jobRequestId.location?.address || '',
                              postedBy: {
                                id: conversation.participants.seeker._id,
                                name: `${conversation.participants.seeker.name.first} ${conversation.participants.seeker.name.last}`,
                                isPremium: false
                              },
                              createdAt: conversation.jobRequestId.createdAt,
                              preferredDate: conversation.jobRequestId.deadline,
                              status: conversation.jobRequestId.status === 'open' ? 'open' : 
                                    conversation.jobRequestId.status === 'assigned' || conversation.jobRequestId.status === 'in_progress' ? 'accepted' : 'closed',
                              category: '',
                              availability: { days: [], timeSlots: [] }
                            }}
                            offer={offers.find(o => o.id === offerId) as Offer}
                            onEditSave={async (terms) => {
                              await updateNegotiation(offerId, terms);
                              await resetNegotiation(offerId);
                            }}
                            onConfirm={() => {
                              confirmNegotiation(offerId);
                              // Auto-close mobile negotiation view after confirming
                              setTimeout(() => setShowNegotiationMobile(false), 1500);
                            }}
                            onReset={() => resetNegotiation(offerId)}
                          />
                          </div>
                          <div className="flex-none">
                            <NegotiationHistory
                              negotiationHistory={negotiationState[offerId]?.negotiationHistory}
                              userMap={{
                                [conversation.participants.seeker._id]: `${conversation.participants.seeker.name.first} ${conversation.participants.seeker.name.last}`,
                                [conversation.participants.provider._id]: `${conversation.participants.provider.name.first} ${conversation.participants.provider.name.last}`
                              }}
                              isMobile={true}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Messages Container */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-warm-cream/20 to-white"
              aria-label="رسائل المحادثة"
              onScroll={(e) => {
                const target = e.target as HTMLDivElement;
                if (target.scrollTop === 0 && hasMore) {
                  loadMoreMessages();
                }
              }}
            >
              {hasMore && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadMoreMessages}
                    disabled={loading}
                    className="bg-white/80 backdrop-blur-sm"
                  >
                    {loading ? 'جاري التحميل...' : 'تحميل المزيد'}
                  </Button>
                </div>
              )}
              {messages.map((message, index) => {
                const isOwnMessage = message.senderId === user?.id;
                const showDate = index === 0 ||
                  new Date(message.timestamp).toDateString() !==
                  new Date(messages[index - 1]?.timestamp).toDateString();
                return (
                  <div key={message._id}>
                    {showDate && (
                      <div className="text-center my-4">
                        <span className="inline-block bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-text-secondary border border-gray-200">
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                          isOwnMessage
                            ? 'bg-deep-teal text-white rounded-br-md'
                            : 'bg-white text-text-primary rounded-bl-md border border-gray-100'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        <div className={`flex items-center justify-end mt-2 ${
                          isOwnMessage ? 'text-white/70' : 'text-text-secondary'
                        }`}>
                          <span className="text-xs">
                            {formatTime(message.timestamp)}
                          </span>
                          {isOwnMessage && (
                            <div className="ml-2 w-2 h-2">
                              {message.read ? (
                                <div className="w-2 h-2 bg-white/70 rounded-full"></div>
                              ) : (
                                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white">
              <div className="space-y-3">
                <FormTextarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="resize-none border-2 border-gray-200 focus:border-deep-teal rounded-xl"
                  rows={2}
                  maxLength={2000}
                  disabled={sending}
                  size="lg"
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <span>اضغط Enter للإرسال</span>
                    <span>•</span>
                    <span>{newMessage.length}/2000</span>
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={!newMessage.trim() || sending}
                    className="px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {sending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </BaseCard>
        </div>
        {/* Negotiation Sidebar (desktop only) */}
        <div className="hidden md:flex flex-col w-96 max-w-full h-full sticky top-8 bg-transparent">
          <div className="h-full flex flex-col border-r border-gray-100 pl-6 overflow-y-auto overflow-x-hidden" aria-label="ملخص التفاوض والتاريخ">
            {/* Debug information */}
            {!offerId && (
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
                <h3 className="font-bold text-amber-800 mb-2">معلومات التصحيح</h3>
                <p className="text-amber-700 text-sm">لم يتم العثور على معرّف العرض</p>
              </div>
            )}
            {offerId && !negotiationState[offerId] && (
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
                <h3 className="font-bold text-amber-800 mb-2">معلومات التصحيح</h3>
                <p className="text-amber-700 text-sm">معرّف العرض: {offerId}</p>
                <p className="text-amber-700 text-sm">لم يتم العثور على بيانات التفاوض</p>
                <button 
                  onClick={() => {
                    console.log('Manually fetching negotiation for:', offerId);
                    fetchNegotiation(offerId);
                    fetchNegotiationHistory(offerId);
                  }}
                  className="mt-2 bg-deep-teal text-white px-3 py-1 rounded-md text-xs"
                >
                  إعادة تحميل بيانات التفاوض
                </button>
              </div>
            )}
            
            {offerId && negotiationState[offerId] && user && (
              <div className="flex flex-col space-y-4">
                <div className="flex-none">
                  <NegotiationSummary
                  negotiation={negotiationState[offerId]}
                  isProvider={user.id === conversation.participants.provider._id}
                  isSeeker={user.id === conversation.participants.seeker._id}
                  jobRequest={{
                    id: conversation.jobRequestId._id,
                    title: conversation.jobRequestId.title,
                    description: conversation.jobRequestId.description || '',
                    budget: {
                      min: conversation.jobRequestId.budget.min,
                      max: conversation.jobRequestId.budget.max,
                      currency: 'EGP' // Default to EGP as currency
                    },
                    location: conversation.jobRequestId.location?.address || '',
                    postedBy: {
                      id: conversation.participants.seeker._id,
                      name: `${conversation.participants.seeker.name.first} ${conversation.participants.seeker.name.last}`,
                      isPremium: false
                    },
                    createdAt: conversation.jobRequestId.createdAt,
                    preferredDate: conversation.jobRequestId.deadline,
                    status: conversation.jobRequestId.status === 'open' ? 'open' : 
                           conversation.jobRequestId.status === 'assigned' || conversation.jobRequestId.status === 'in_progress' ? 'accepted' : 'closed',
                    category: '',
                    availability: { days: [], timeSlots: [] }
                  }}
                  offer={offers.find(o => o.id === offerId) as Offer}
                  onEditSave={async (terms) => {
                    await updateNegotiation(offerId, terms);
                    await resetNegotiation(offerId); // Reset confirmations after edit
                  }}
                  onConfirm={() => confirmNegotiation(offerId)}
                  onReset={() => resetNegotiation(offerId)}
                />
                </div>
                <div className="flex-none">
                  <NegotiationHistory
                    negotiationHistory={negotiationState[offerId]?.negotiationHistory}
                    userMap={{
                      [conversation.participants.seeker._id]: `${conversation.participants.seeker.name.first} ${conversation.participants.seeker.name.last}`,
                      [conversation.participants.provider._id]: `${conversation.participants.provider.name.first} ${conversation.participants.provider.name.last}`
                    }}
                    isMobile={false}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {conversation && offerId && negotiationState[offerId] && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handlePaymentConfirm}
          serviceTitle={conversation.jobRequestId.title}
          providerName={`${conversation.participants.provider.name.first} ${conversation.participants.provider.name.last}`}
          negotiatedPrice={negotiationState[offerId]?.currentTerms?.price}
          scheduledDate={negotiationState[offerId]?.currentTerms?.date}
          scheduledTime={negotiationState[offerId]?.currentTerms?.time}
          loading={paymentLoading}
        />
      )}
      
      {/* Service Completion Modal */}
      <Modal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        title="تأكيد اكتمال الخدمة"
      >
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <div className="text-green-800">
              <h3 className="font-semibold mb-1">تأكيد اكتمال الخدمة</h3>
              <p className="text-sm">
                بالضغط على زر التأكيد، أنت تؤكد أن الخدمة قد تم إنجازها بنجاح وأنك موافق على تحرير المبلغ المحتجز لمقدم الخدمة.
              </p>
              <p className="text-sm mt-2 font-medium">
                ملاحظة: لا يمكن التراجع عن هذا الإجراء بعد التأكيد.
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowCompletionModal(false)}
              disabled={completionLoading}
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button
              variant="success"
              onClick={handleCompleteService}
              disabled={completionLoading}
              className="flex-1"
            >
              {completionLoading ? 'جاري التأكيد...' : 'تأكيد اكتمال الخدمة'}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Cancellation Request Modal */}
      <Modal
        isOpen={showCancellationModal}
        onClose={() => setShowCancellationModal(false)}
        title="طلب إلغاء الخدمة"
      >
        <div className="space-y-4">
          <div className="bg-amber-50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
            <div className="text-amber-800">
              <h3 className="font-semibold mb-1">سياسة الإلغاء</h3>
              <ul className="text-sm space-y-1">
                <li>• إلغاء قبل 12 ساعة من موعد الخدمة: استرداد 100% من المبلغ</li>
                <li>• إلغاء خلال أقل من 12 ساعة: استرداد 70% فقط من المبلغ</li>
              </ul>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              سبب طلب الإلغاء
            </label>
            <FormTextarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="اذكر سبب طلب الإلغاء..."
              className="resize-none border-2 border-gray-200"
              rows={3}
              maxLength={500}
              disabled={cancellationLoading}
            />
            <p className="text-sm text-text-secondary mt-1">
              {cancellationReason.length}/500
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowCancellationModal(false)}
              disabled={cancellationLoading}
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button
              variant="danger"
              onClick={handleRequestCancellation}
              disabled={cancellationLoading}
              className="flex-1"
            >
              {cancellationLoading ? 'جاري الإرسال...' : 'تأكيد طلب الإلغاء'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Report Problem Modal */}
      {conversation && (
        <ReportProblemModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReportSubmit}
          providerName={`${conversation.participants.provider.name.first} ${conversation.participants.provider.name.last}`}
          serviceTitle={conversation.jobRequestId.title}
          loading={reportLoading}
        />
      )}
    </PageLayout>
  );
};

export default ChatPage; 