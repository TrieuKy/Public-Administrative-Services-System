import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([
    { text: 'Xin chào! Tôi là trợ lý ảo của Cổng Dịch vụ công. Tôi có thể giúp gì cho bạn?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const quickQuestions = [
    'Làm thế nào để đăng ký hộ tịch?',
    'Cách tra cứu hồ sơ?',
    'Thủ tục đăng ký hộ kinh doanh?',
    'Dịch vụ chứng thực?'
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { text: input, sender: 'user' as const };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Chuyển history sang format Gemini
      const history = messages.slice(1).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const res = await axiosInstance.post('/ai/chat', {
        message: input,
        history
      });

      const botReply = res.data.data.reply;
      setMessages([...newMessages, { text: botReply, sender: 'bot' }]);
    } catch {
      setMessages([...newMessages, {
        text: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại hoặc liên hệ trực tiếp UBND xã.',
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = async (question: string) => {
    setInput(question);
    
    // Auto-send the quick question after setting it
    const userMsg = { text: question, sender: 'user' as const };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(1).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const res = await axiosInstance.post('/ai/chat', {
        message: question,
        history
      });

      const botReply = res.data.data.reply;
      setMessages([...newMessages, { text: botReply, sender: 'bot' }]);
    } catch {
      setMessages([...newMessages, {
        text: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại hoặc liên hệ trực tiếp UBND xã.',
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-8 w-[90vw] md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-amber-500">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-700 to-orange-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="text-red-700" size={24} />
              </div>
              <div>
                <h3 className="font-semibold">Trợ lý ảo</h3>
                <p className="text-xs text-orange-100">Hỗ trợ 24/7</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user'
                      ? 'bg-amber-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2 text-sm text-gray-500 flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Câu hỏi nhanh:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-xs px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-red-700 rounded-full transition border border-orange-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
              <button
                onClick={handleSend}
                className="px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 rounded-full transition font-medium text-sm"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 md:right-8 w-16 h-16 bg-gradient-to-br from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white rounded-full shadow-2xl flex items-center justify-center z-40 transition-all hover:scale-110 group"
        aria-label="Mở chatbot hỗ trợ"
      >
        {isOpen ? (
          <X size={28} className="group-hover:rotate-90 transition-transform" />
        ) : (
          <MessageCircle size={28} className="group-hover:animate-bounce" />
        )}

        {/* Notification badge - only show when closed and has messages beyond initial greeting */}
        {!isOpen && messages.length > 1 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
            {Math.min(messages.length - 1, 9)}
          </div>
        )}
      </button>
    </>
  );
}
