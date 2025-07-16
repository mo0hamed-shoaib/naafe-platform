import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState('');

  const messages = [
    {
      type: 'user',
      content: 'How do I verify my identity?',
      timestamp: new Date()
    },
    {
      type: 'assistant',
      content: 'To verify your identity, go to your profile > Verification tab > Upload a valid national ID. I can guide you step-by-step. Would you like me to open the verification page for you?',
      timestamp: new Date()
    }
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // Static for now - no actual sending
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="w-80 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4">
          <header className="bg-deep-teal text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  alt="Assistant Avatar"
                  className="w-10 h-10 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV7IqTTPPHvXPy-KiqJxjjNTSSaOkO1_R0X6pdsaqHc6WZW3kWE0YroSjHU8BqTHgjbA47MoXNRKdFsM9qnMm9FepXIs5DP7ShwB7to1_pW-HKnbg3MXMDGCex0NSHlMghIiG_aNsYnYv15R7z_DIMwaLgiJ3V1QBqGd5OOkZl-l6-4T2j1KvMfZZJr1qLPSCx9OQKFwcL8CfikUZdAq0pUuHyGBf5fhaCshjJf3dMiWHv3CP9v0M4zDp55Zvxv47Bc6OtUXjsRg"
                />
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-deep-teal"></span>
              </div>
              <div>
                <h3 className="font-bold">Assistant</h3>
                <p className="text-sm opacity-80">Online</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white/70 hover:text-white transition-colors duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </header>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-warm-cream">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg py-3 px-4 max-w-xs shadow-sm ${
                    msg.type === 'user'
                      ? 'bg-white text-text-primary rounded-br-none'
                      : 'bg-deep-teal text-white rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>

          <div className="p-4 border-t bg-white">
            <form onSubmit={handleSendMessage} className="relative">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-full py-3 pl-4 pr-12 border-gray-300 focus:ring-2 focus:ring-bright-orange focus:border-transparent transition-all duration-300"
                placeholder="Type your message..."
                type="text"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-bright-orange transition-colors duration-300"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={toggleChat}
          className="w-16 h-16 bg-bright-orange rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 animate-pulse-slow"
        >
          <MessageCircle className="w-8 h-8" />
        </button>
      )}
    </div>
  );
};

export default ChatBot;