import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useSocket } from '../hooks/useSocket';
import PageLayout from '../components/layout/PageLayout';
import BaseCard from '../components/ui/BaseCard';
import Button from '../components/ui/Button';
import FormTextarea from '../components/ui/FormTextarea';
import PaymentModal from '../components/ui/PaymentModal';
import ReportProblemModal from '../components/ui/ReportProblemModal';
import { createCheckoutSession } from '../services/paymentService';
import { submitComplaint } from '../services/complaintService';
import { Send, ArrowLeft, MessageCircle, User, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';

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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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

  // Check if payment is completed for this conversation
  const checkPaymentStatus = async () => {
    if (!chatId || !accessToken || !user) return;

    try {
      const response = await fetch(`/api/payment/check-status/${chatId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        const isCompleted = data.success && data.data?.status === 'completed';
        setPaymentCompleted(isCompleted);
        console.log('Payment status check:', { status: data.data?.status, isCompleted });
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  // Check payment status on mount and when dependencies change
  useEffect(() => {
    checkPaymentStatus();
  }, [chatId, accessToken, user]);

  // Refresh payment status when user returns to the page (focus event)
  useEffect(() => {
    const handleFocus = () => {
      checkPaymentStatus();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [chatId, accessToken, user]);

  // Check if user is returning from payment success page
  useEffect(() => {
    const fromPayment = searchParams.get('from_payment');
    if (fromPayment === 'success') {
      // Refresh payment status immediately
      checkPaymentStatus();
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
        checkPaymentStatus();
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

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    if (!conversation || !user || !accessToken) return;

    setPaymentLoading(true);
    try {
      const response = await createCheckoutSession({
        conversationId: chatId!,
        amount,
        serviceTitle: conversation.jobRequestId.title,
        providerId: conversation.participants.provider._id
      }, accessToken);

      if (response.success && response.data.url) {
        window.location.href = response.data.url;
      } else {
        setError(response.message || 'فشل في إنشاء جلسة الدفع');
        setShowPaymentModal(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('حدث خطأ أثناء إنشاء جلسة الدفع');
      setShowPaymentModal(false);
    } finally {
      setPaymentLoading(false);
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
      <div className="max-w-4xl mx-auto">
        <BaseCard className="h-[85vh] min-h-[600px] max-h-[1000px] flex flex-col">
          {/* Chat Header */}
          <div className="border-b border-gray-100">
            {/* Main Header */}
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
                {isSeeker && ['assigned', 'in_progress'].includes(conversation.jobRequestId.status) && !paymentCompleted && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowPaymentModal(true)}
                    className="flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    إتمام الدفع
                  </Button>
                )}
                {isSeeker && paymentCompleted && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    تم الدفع
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-text-primary mb-1">الميزانية</p>
                  <p className="text-text-secondary">
                    {conversation.jobRequestId.budget.min} - {conversation.jobRequestId.budget.max} جنيه
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-text-primary mb-1">التاريخ المفضل</p>
                  <p className="text-text-secondary">
                    {conversation.jobRequestId.deadline ? 
                      new Date(conversation.jobRequestId.deadline).toLocaleDateString('ar-EG') : 
                      'غير محدد'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-text-primary mb-1">تاريخ النشر</p>
                  <p className="text-text-secondary">
                    {new Date(conversation.jobRequestId.createdAt).toLocaleDateString('ar-EG')}
                  </p>
                </div>
              </div>
              
              {/* Mobile Action Buttons */}
              <div className="md:hidden flex gap-2">
                {isSeeker && ['assigned', 'in_progress'].includes(conversation.jobRequestId.status) && !paymentCompleted && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowPaymentModal(true)}
                    className="flex items-center gap-2 flex-1"
                  >
                    <CreditCard className="w-4 h-4" />
                    إتمام الدفع
                  </Button>
                )}
                {isSeeker && paymentCompleted && (
                  <div className="flex items-center gap-2 text-green-600 text-sm flex-1 justify-center">
                    <CheckCircle className="w-4 h-4" />
                    تم الدفع
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReportIssue}
                  className="flex items-center gap-2 flex-1"
                >
                  <AlertTriangle className="w-4 h-4" />
                  الإبلاغ عن مشكلة
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-warm-cream/20 to-white"
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

      {/* Payment Modal */}
      {conversation && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handlePaymentConfirm}
          serviceTitle={conversation.jobRequestId.title}
          providerName={`${conversation.participants.provider.name.first} ${conversation.participants.provider.name.last}`}
          loading={paymentLoading}
        />
      )}

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