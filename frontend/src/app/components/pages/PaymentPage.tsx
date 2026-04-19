import { useState } from 'react';
import { ArrowLeft, CheckCircle, CreditCard, FileText, Scale, Home, FileSignature, Landmark, Calculator, Printer, Download, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useAuth } from '../../../context/AuthContext';

// Helpers
function generateReceiptCode() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `BL${y}${m}${d}-${rand}`;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'medium' });
}

// Fee map (mock amounts per service)
const FEE_MAP: Record<string, number> = {
  'Lệ phí chứng thực bản sao, chữ ký': 20000,
  'Lệ phí đăng ký khai sinh, kết hôn, khai tử': 0,
  'Phí cấp bản sao trích lục hộ tịch': 5000,
  'Lệ phí địa chính': 15000,
  'Phí xây dựng - vệ sinh môi trường': 30000,
  'Phí, lệ phí quản lý xã': 10000,
  'Các khoản thù lao thu hộ': 50000,
};

export function PaymentPage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [step, setStep] = useState(1); // 1: Nhập mã, 2: Xác nhận phí, 3: Biên lai
  const [isLoading, setIsLoading] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const handleOpenPayment = (serviceName: string) => {
    setSelectedService(serviceName);
    setSearchCode('');
    setStep(1);
    setReceiptData(null);
    setShowModal(true);
  };

  const mockSearch = () => {
    if (!searchCode.trim()) return alert('Vui lòng nhập mã hồ sơ!');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1200);
  };

  const mockPay = () => {
    setIsLoading(true);
    setTimeout(() => {
      const fee = FEE_MAP[selectedService] ?? 20000;
      const receipt = {
        receiptCode: generateReceiptCode(),
        serviceName: selectedService,
        applicationCode: searchCode.trim().toUpperCase(),
        amount: fee,
        payer: user?.fullName || 'Công dân',
        payerCccd: user?.cccd || '---',
        paymentMethod: 'Thanh toán điện tử (Thẻ/QR)',
        paidAt: new Date().toISOString(),
        status: 'success',
        unit: 'UBND Xã/Phường',
      };

      // Lưu vào localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
        existing.unshift(receipt);
        localStorage.setItem('paymentHistory', JSON.stringify(existing.slice(0, 50))); // giữ max 50
      } catch {
        // ignore
      }

      setReceiptData(receipt);
      setIsLoading(false);
      setStep(3);
    }, 2000);
  };

  const fee = FEE_MAP[selectedService] ?? 20000;

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

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gray-50 border-b px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard size={20} className="text-[#cc6633]" />
                <h3 className="font-bold text-lg text-gray-800">Thanh toán trực tuyến</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3].map((s, i) => (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                      ${step >= s ? 'bg-[#cc6633] text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {step > s ? '✓' : s}
                    </div>
                    <span className={`text-xs hidden sm:block ${step >= s ? 'text-[#cc6633] font-medium' : 'text-gray-400'}`}>
                      {s === 1 ? 'Nhập mã HS' : s === 2 ? 'Xác nhận' : 'Biên lai'}
                    </span>
                    {i < 2 && <div className={`h-px flex-1 ${step > s ? 'bg-[#cc6633]' : 'bg-gray-200'}`} />}
                  </div>
                ))}
              </div>

              {/* Service badge */}
              <div className="mb-5 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg text-sm text-[#cc6633] font-medium">
                {selectedService}
              </div>

              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Vui lòng nhập <strong className="text-black">Mã hồ sơ</strong> để tra cứu thông tin cần nộp.</p>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Mã hồ sơ</label>
                    <input
                      type="text"
                      value={searchCode}
                      onChange={e => setSearchCode(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && mockSearch()}
                      placeholder="Ví dụ: HS2026VN..."
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#cc6633] transition"
                    />
                  </div>
                  <Button
                    onClick={mockSearch}
                    disabled={isLoading}
                    className="w-full bg-[#cc6633] hover:bg-[#a64e22] text-white py-6 text-lg mt-4"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2 justify-center">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Đang tra cứu...
                      </span>
                    ) : 'Tra Cứu Giao Dịch'}
                  </Button>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Người nộp:</span>
                      <span className="font-bold text-gray-900">{user?.fullName || 'Công dân'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã tra cứu:</span>
                      <span className="font-bold text-gray-900">{searchCode.trim().toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại phí:</span>
                      <span className="font-medium text-gray-800">{selectedService}</span>
                    </div>
                  </div>

                  <div className="text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-6">
                    <p className="text-gray-500 text-sm mb-1">Tổng tiền thanh toán</p>
                    <p className="text-4xl font-extrabold text-[#cc6633]">{formatCurrency(fee)}</p>
                    {fee === 0 && <p className="text-green-600 text-sm mt-1 font-medium">Miễn phí theo quy định</p>}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs px-3 py-2 rounded-lg">
                    ⚠ Vui lòng kiểm tra lại thông tin trước khi xác nhận thanh toán.
                  </div>

                  <Button
                    onClick={mockPay}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2 justify-center">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Đang xử lý thanh toán...
                      </span>
                    ) : 'Xác Nhận Nộp Tiền (Thẻ/QR)'}
                  </Button>
                </div>
              )}

              {/* STEP 3: Biên lai */}
              {step === 3 && receiptData && (
                <div>
                  {/* Success header */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="text-green-500" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Thanh toán thành công!</h3>
                    <p className="text-sm text-gray-500 mt-1">Biên lai điện tử đã được ghi nhận vào hệ thống</p>
                  </div>

                  {/* Receipt */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden" id="receipt-block">
                    {/* Receipt header */}
                    <div className="bg-gradient-to-r from-[#cc6633] to-orange-500 text-white px-5 py-4 text-center">
                      <div className="font-bold text-lg">BIÊN LAI THU PHÍ ĐIỆN TỬ</div>
                      <div className="text-orange-100 text-xs mt-1">Cổng Dịch vụ công cấp Xã/Phường</div>
                    </div>

                    {/* receipt body */}
                    <div className="bg-white px-5 py-4 space-y-2.5 text-sm">
                      <div className="flex justify-between py-1.5 border-b border-dashed border-gray-200">
                        <span className="text-gray-500">Số biên lai</span>
                        <span className="font-mono font-bold text-[#cc6633]">{receiptData.receiptCode}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-dashed border-gray-200">
                        <span className="text-gray-500">Mã hồ sơ</span>
                        <span className="font-semibold">{receiptData.applicationCode}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-dashed border-gray-200">
                        <span className="text-gray-500">Nội dung thu</span>
                        <span className="font-medium text-right max-w-[55%]">{receiptData.serviceName}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-dashed border-gray-200">
                        <span className="text-gray-500">Người nộp</span>
                        <span className="font-semibold">{receiptData.payer}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-dashed border-gray-200">
                        <span className="text-gray-500">Phương thức</span>
                        <span className="font-medium">{receiptData.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-dashed border-gray-200">
                        <span className="text-gray-500">Thời gian</span>
                        <span className="font-medium">{formatDateTime(receiptData.paidAt)}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-dashed border-gray-200">
                        <span className="text-gray-500">Cơ quan thu</span>
                        <span className="font-medium">{receiptData.unit}</span>
                      </div>

                      {/* Big amount */}
                      <div className="py-3 text-center">
                        <div className="text-gray-500 text-xs mb-1">Số tiền đã nộp</div>
                        <div className="text-3xl font-extrabold text-green-600">
                          {formatCurrency(receiptData.amount)}
                        </div>
                        {receiptData.amount === 0 && (
                          <div className="text-green-500 text-xs mt-1">Miễn phí theo quy định</div>
                        )}
                      </div>

                      {/* status badge */}
                      <div className="flex justify-center pb-2">
                        <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                          <CheckCircle size={12} /> ĐÃ THANH TOÁN
                        </span>
                      </div>
                    </div>

                    {/* Receipt footer */}
                    <div className="bg-gray-50 border-t px-5 py-3 text-xs text-center text-gray-500">
                      Biên lai này có giá trị pháp lý khi tra cứu trên Cổng dịch vụ công
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-5">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700 flex items-center gap-2 justify-center"
                      onClick={() => window.print()}
                    >
                      <Printer size={16} /> In biên lai
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-[#cc6633] text-[#cc6633] flex items-center gap-2 justify-center"
                      onClick={() => {
                        const text = [
                          `BIÊN LAI THU PHÍ ĐIỆN TỬ`,
                          `Số biên lai: ${receiptData.receiptCode}`,
                          `Mã hồ sơ: ${receiptData.applicationCode}`,
                          `Nội dung: ${receiptData.serviceName}`,
                          `Người nộp: ${receiptData.payer}`,
                          `Số tiền: ${formatCurrency(receiptData.amount)}`,
                          `Thời gian: ${formatDateTime(receiptData.paidAt)}`,
                          `Trạng thái: ĐÃ THANH TOÁN`,
                        ].join('\n');
                        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url; a.download = `BienLai_${receiptData.receiptCode}.txt`;
                        a.click(); URL.revokeObjectURL(url);
                      }}
                    >
                      <Download size={16} /> Tải biên lai
                    </Button>
                  </div>

                  <Button
                    onClick={() => setShowModal(false)}
                    className="w-full mt-3 bg-[#cc6633] hover:bg-[#a64e22] text-white"
                  >
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
