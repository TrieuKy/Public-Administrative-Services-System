import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: input, sender: 'user' as const }];
    setMessages(newMessages);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      setMessages([...newMessages, { text: botResponse, sender: 'bot' }]);
    }, 1000);

    setInput('');
  };

  const getBotResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('hộ tịch') || lowerQuestion.includes('khai sinh')) {
      return 'Để đăng ký hộ tịch tại xã/phường, bạn có thể truy cập mục "Dịch vụ công phổ biến" → "Đăng ký hộ tịch". Các dịch vụ bao gồm khai sinh (3 ngày), kết hôn (1 ngày), khai tử (2 ngày). Tất cả đều miễn phí và xử lý trực tuyến tại UBND xã.';
    } else if (lowerQuestion.includes('tra cứu') || lowerQuestion.includes('hồ sơ')) {
      return 'Để tra cứu hồ sơ tại xã/phường, bạn vào mục "Tra cứu hồ sơ" trên header và nhập mã hồ sơ hoặc số CMND/CCCD. Hệ thống sẽ hiển thị tình trạng xử lý của hồ sơ tại UBND xã.';
    } else if (lowerQuestion.includes('doanh nghiệp') || lowerQuestion.includes('kinh doanh')) {
      return 'Tại xã/phường chỉ xử lý đăng ký hộ kinh doanh (không phải doanh nghiệp). Thủ tục gồm: đăng ký mới (3 ngày, 50k), thay đổi (2 ngày, 30k), tạm ngừng và chấm dứt (1 ngày, miễn phí). Bạn nộp hồ sơ trực tuyến tại UBND xã.';
    } else if (lowerQuestion.includes('liên hệ') || lowerQuestion.includes('hỗ trợ')) {
      return 'Bạn có thể liên hệ hỗ trợ qua:\n- Bộ phận một cửa UBND xã: (024) 3825.xxxx\n- Email: ubnd@xa[tenxa].gov.vn\n- Hoặc chat trực tiếp với tôi tại đây!\n- Trực tiếp tại: Trụ sở UBND xã, từ 7h30 - 17h00 các ngày làm việc';
    } else if (lowerQuestion.includes('chứng thực')) {
      return 'Chứng thực tại xã/phường gồm:\n- Chứng thực bản sao: 5.000đ/trang, xử lý trong ngày\n- Chứng thực chữ ký: 10.000đ, xử lý trong ngày\nBạn mang theo giấy tờ gốc và CMND/CCCD đến bộ phận một cửa UBND xã.';
    } else {
      return 'Cảm ơn câu hỏi của bạn. Vui lòng chọn một trong các câu hỏi nhanh bên dưới hoặc liên hệ bộ phận một cửa UBND xã để được hỗ trợ chi tiết hơn.';
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
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
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
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
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
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
        
        {/* Notification badge */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900 animate-pulse">
            !
          </div>
        )}
      </button>
    </>
  );
}