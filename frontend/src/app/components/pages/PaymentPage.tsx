import { useState } from 'react';
import { ArrowLeft, Search, CheckCircle, CreditCard, FileText, Scale, Home, FileSignature, Landmark, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export function PaymentPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [searchCode, setSearchCode] = useState('');
  
  // mock states
  const [step, setStep] = useState(1); // 1: Nhập mã, 2: Xác nhận phí, 3: Thành công
  const [isLoading, setIsLoading] = useState(false);
  
  const handleOpenPayment = (serviceName: string) => {
    setSelectedService(serviceName);
    setSearchCode('');
    setStep(1);
    setShowModal(true);
  };

  const mockSearch = () => {
    if (!searchCode) return alert('Vui lòng nhập mã hồ sơ!');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1200);
  };

  const mockPay = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#cc6633] to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-orange-100 transition mb-4">
            <ArrowLeft size={20} />
            <span>Quay lại Cổng Dịch vụ công</span>
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Thanh toán trực tuyến cấp Xã/Phường</h1>
          <p className="text-orange-100 text-lg max-w-2xl">
            Cổng thanh toán điện tử an toàn, tiện lợi cho các khoản phí, lệ phí thực hiện thủ tục hành chính tại cơ quan địa phương.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Cột 1: Tư pháp - Hộ tịch */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-100">
             <div className="h-3 bg-blue-700"></div>
             <div className="p-6">
               <h2 className="text-xl font-bold text-center text-blue-900 uppercase tracking-widest mb-6">Tư pháp - Hộ tịch</h2>
               <div className="space-y-4">
                 <button onClick={() => handleOpenPayment("Lệ phí chứng thực bản sao, chữ ký")} className="w-full flex items-start gap-4 p-5 border border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left group">
                   <FileSignature className="text-blue-500 mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0" size={24} />
                   <span className="text-gray-700 font-medium group-hover:text-blue-700">Lệ phí chứng thực bản sao từ bản chính, chứng thực chữ ký</span>
                 </button>
                 <button onClick={() => handleOpenPayment("Lệ phí đăng ký khai sinh, kết hôn, khai tử")} className="w-full flex items-start gap-4 p-5 border border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left group">
                   <Scale className="text-blue-500 mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0" size={24} />
                   <span className="text-gray-700 font-medium group-hover:text-blue-700">Đăng ký khai sinh, kết hôn, khai tử (thuộc thẩm quyền xã)</span>
                 </button>
                 <button onClick={() => handleOpenPayment("Phí cấp bản sao trích lục hộ tịch")} className="w-full flex items-start gap-4 p-5 border border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left group">
                   <FileText className="text-blue-500 mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0" size={24} />
                   <span className="text-gray-700 font-medium group-hover:text-blue-700">Phí cấp bản sao trích lục hộ tịch</span>
                 </button>
               </div>
             </div>
          </div>

          {/* Cột 2: Đất đai - Xây dựng */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-100">
             <div className="h-3 bg-emerald-600"></div>
             <div className="p-6">
               <h2 className="text-xl font-bold text-center text-emerald-800 uppercase tracking-widest mb-6">Đất đai - Xây dựng</h2>
               <div className="space-y-4">
                 <button onClick={() => handleOpenPayment("Lệ phí địa chính")} className="w-full flex items-start gap-4 p-5 border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left group">
                   <Landmark className="text-emerald-500 mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0" size={24} />
                   <span className="text-gray-700 font-medium group-hover:text-emerald-700">Lệ phí địa chính (cấp bản sao giấy tờ đất đai, trích đo...)</span>
                 </button>
                 <button onClick={() => handleOpenPayment("Phí xây dựng - vệ sinh môi trường")} className="w-full flex items-start gap-4 p-5 border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left group">
                   <Home className="text-emerald-500 mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0" size={24} />
                   <span className="text-gray-700 font-medium group-hover:text-emerald-700">Phí xây dựng hoặc phí vệ sinh môi trường địa phương</span>
                 </button>
               </div>
             </div>
          </div>

          {/* Cột 3: Các khoản thu khác */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-100">
             <div className="h-3 bg-red-700"></div>
             <div className="p-6">
               <h2 className="text-xl font-bold text-center text-red-900 uppercase tracking-widest mb-6">Các khoản thu khác</h2>
               <div className="space-y-4">
                 <button onClick={() => handleOpenPayment("Phí, lệ phí quản lý xã")} className="w-full flex items-start gap-4 p-5 border border-gray-200 hover:border-red-400 hover:bg-red-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left group">
                   <FileText className="text-red-500 mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0" size={24} />
                   <span className="text-gray-700 font-medium group-hover:text-red-700">Phí, lệ phí theo quy định liên quan đến công tác quản lý xã</span>
                 </button>
                 <button onClick={() => handleOpenPayment("Các khoản thù lao thu hộ")} className="w-full flex items-start gap-4 p-5 border border-gray-200 hover:border-red-400 hover:bg-red-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left group">
                   <Calculator className="text-red-500 mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0" size={24} />
                   <span className="text-gray-700 font-medium group-hover:text-red-700">Nộp các khoản thù lao thu hộ (nếu có)</span>
                 </button>
               </div>
             </div>
          </div>

        </div>
      </div>

      {/* Payment Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="bg-gray-50 border-b px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">Thanh toán trực tuyến</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 pb-2 border-b-2 border-[#cc6633] inline-block font-semibold text-[#cc6633]">
                {selectedService}
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">Vui lòng nhập <strong className="text-black">Mã hồ sơ</strong> hoặc <strong className="text-black">Biên lai</strong> để tra cứu thông tin cần nộp.</p>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Mã hồ sơ / CMND</label>
                    <input 
                      type="text" 
                      value={searchCode}
                      onChange={e => setSearchCode(e.target.value)}
                      placeholder="Ví dụ: HS2026VN..." 
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#cc6633] transition"
                    />
                  </div>
                  <Button 
                    onClick={mockSearch} 
                    disabled={isLoading}
                    className="w-full bg-[#cc6633] hover:bg-[#a64e22] text-white py-6 text-lg mt-4"
                  >
                    {isLoading ? "Đang tra cứu..." : "Tra Cứu Giao Dịch"}
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Người nộp:</span>
                      <span className="font-bold text-gray-900">Công dân</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mã tra cứu:</span>
                      <span className="font-bold text-gray-900">{searchCode}</span>
                    </div>
                  </div>
                  
                  <div className="text-center bg-gray-50 border rounded-lg p-6">
                    <p className="text-gray-500 text-sm mb-1">Tổng tiền thanh toán</p>
                    <p className="text-4xl font-extrabold text-[#cc6633]">20,000 <span className="text-lg">VND</span></p>
                  </div>

                  <Button 
                    onClick={mockPay} 
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                  >
                    {isLoading ? "Đang xử lý thanh toán..." : "Xác Nhận Nộp Tiền (Thẻ/QR)"}
                  </Button>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-green-500" size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h3>
                  <p className="text-gray-600 mb-8">Biên lai điện tử đã được ghi nhận vào hệ thống.</p>
                  <Button onClick={() => setShowModal(false)} variant="outline" className="w-full">
                    Đóng cửa sổ
                  </Button>
                </div>
              )}
            </div>
            
          </Card>
        </div>
      )}
    </div>
  );
}
