import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../hooks/useSocket';
import PageLayout from '../components/layout/PageLayout';
import BaseCard from '../components/ui/BaseCard';
import Button from '../components/ui/Button';
import FormTextarea from '../components/ui/FormTextarea';
import { Send, ArrowLeft, MessageCircle, User } from 'lucide-react';

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
    status: string;
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
  const { accessToken, user } = useAuth();
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
        <BaseCard className="h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/conversations')}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">
                  {otherParticipant?.name.first} {otherParticipant?.name.last}
                </h3>
                <p className="text-sm text-text-secondary">
                  {conversation.jobRequestId.title}
                </p>
              </div>
            </div>
            <div className="text-sm text-text-secondary">
              {connected ? (
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  متصل
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  غير متصل
                </span>
              )}
            </div>
          </div>

          {/* Messages Container */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
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
                >
                  {loading ? 'جاري التحميل...' : 'تحميل المزيد'}
                </Button>
              </div>
            )}

            {messages.map((message) => {
              const isOwnMessage = message.senderId === user?.id;
              const showDate = true; // You can add logic to show date separators
              
              return (
                <div key={message._id}>
                  {showDate && (
                    <div className="text-center text-xs text-text-secondary my-2">
                      {formatDate(message.timestamp)}
                    </div>
                  )}
                  <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        isOwnMessage
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-text-primary'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-white/70' : 'text-text-secondary'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <FormTextarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 resize-none"
                rows={1}
                maxLength={2000}
                disabled={sending}
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!newMessage.trim() || sending}
                className="px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </BaseCard>
      </div>
    </PageLayout>
  );
};

export default ChatPage; 