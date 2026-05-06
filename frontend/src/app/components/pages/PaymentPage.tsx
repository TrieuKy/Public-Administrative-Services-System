import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, CreditCard, FileText, Scale, Home, FileSignature, Landmark, Calculator, Printer, Download, X, History, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useAuth } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'medium' });
}

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
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [paymentId, setPaymentId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'pay' | 'history'>('pay');
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'history' && user) fetchHistory();
  }, [activeTab, user]);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await axiosInstance.get('/payments/my');
      if (res.data.success) setHistory(res.data.data.payments || []);
    } catch { /* ignore */ }
    finally { setHistoryLoading(false); }
  };

  const handleOpenPayment = (serviceName: string) => {
    if (!user) { toast.warning('Vui lòng đăng nhập để thanh toán'); return; }
    setSelectedService(serviceName);
    setSearchCode('');
    setStep(1);
    setReceiptData(null);
    setPaymentId('');
    setShowModal(true);
  };

  // Bước 1 → 2: Kiểm tra mã hồ sơ (nếu có) rồi tạo giao dịch pending
  const handleSearch = async () => {
    if (!searchCode.trim()) { toast.warning('Vui lòng nhập mã hồ sơ'); return; }
    setIsLoading(true);
    try {
      const fee = FEE_MAP[selectedService] ?? 20000;
      const res = await axiosInstance.post('/payments', {
        feeType: selectedService,
        amount: fee,
        paymentMethod: 'card',
        applicationCode: searchCode.trim(),
      });
      if (res.data.success) {
        setPaymentId(res.data.data.paymentId);
        setStep(2);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không tìm thấy hồ sơ. Vui lòng kiểm tra lại mã.');
    } finally { setIsLoading(false); }
  };

  // Bước 2 → 3: Xác nhận thanh toán
  const handlePay = async () => {
    if (!paymentId) return;
    setIsLoading(true);
    try {
      const res = await axiosInstance.post(`/payments/${paymentId}/confirm`);
      if (res.data.success) {
        setReceiptData(res.data.data);
        setStep(3);
        toast.success('Thanh toán thành công!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Thanh toán thất bại. Vui lòng thử lại.');
    } finally { setIsLoading(false); }
  };

  const fee = FEE_MAP[selectedService] ?? 20000;

  const serviceGroups = [
    {
      title: 'Tư pháp - Hộ tịch', color: 'blue',
      items: [
        { icon: FileSignature, label: 'Lệ phí chứng thực bản sao từ bản chính, chứng thực chữ ký', key: 'Lệ phí chứng thực bản sao, chữ ký' },
        { icon: Scale, label: 'Đăng ký khai sinh, kết hôn, khai tử (thuộc thẩm quyền xã)', key: 'Lệ phí đăng ký khai sinh, kết hôn, khai tử' },
        { icon: FileText, label: 'Phí cấp bản sao trích lục hộ tịch', key: 'Phí cấp bản sao trích lục hộ tịch' },
      ]
    },
    {
      title: 'Đất đai - Xây dựng', color: 'emerald',
      items: [
        { icon: Landmark, label: 'Lệ phí địa chính (cấp bản sao giấy tờ đất đai, trích đo...)', key: 'Lệ phí địa chính' },
        { icon: Home, label: 'Phí xây dựng hoặc phí vệ sinh môi trường địa phương', key: 'Phí xây dựng - vệ sinh môi trường' },
      ]
    },
    {
      title: 'Các khoản thu khác', color: 'red',
      items: [
        { icon: FileText, label: 'Phí, lệ phí theo quy định liên quan đến công tác quản lý xã', key: 'Phí, lệ phí quản lý xã' },
        { icon: Calculator, label: 'Nộp các khoản thù lao thu hộ (nếu có)', key: 'Các khoản thù lao thu hộ' },
      ]
    },
  ];

  const colorMap: Record<string, string> = {
    blue: 'border-blue-700 text-blue-900 hover:border-blue-400 hover:bg-blue-50',
    emerald: 'border-emerald-600 text-emerald-800 hover:border-emerald-400 hover:bg-emerald-50',
    red: 'border-red-700 text-red-900 hover:border-red-400 hover:bg-red-50',
  };
  const iconColorMap: Record<string, string> = { blue: 'text-blue-500', emerald: 'text-emerald-500', red: 'text-red-500' };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#cc6633] to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-orange-100 transition mb-4">
            <ArrowLeft size={20} /><span>Quay lại Cổng Dịch vụ công</span>
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Thanh toán trực tuyến cấp Xã/Phường</h1>
          <p className="text-orange-100 text-lg max-w-2xl">
            Cổng thanh toán điện tử an toàn, tiện lợi cho các khoản phí, lệ phí thực hiện thủ tục hành chính.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {[{ key: 'pay', label: 'Thanh toán', icon: CreditCard }, { key: 'history', label: 'Lịch sử giao dịch', icon: History }].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-5 py-3 font-medium text-sm border-b-2 transition ${activeTab === tab.key ? 'border-[#cc6633] text-[#cc6633]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <tab.icon size={16} />{tab.label}
            </button>
          ))}
        </div>

        {/* Thanh toán tab */}
        {activeTab === 'pay' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceGroups.map(group => (
              <div key={group.title} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className={`h-3 bg-${group.color}-700`} />
                <div className="p-6">
                  <h2 className={`text-xl font-bold text-center uppercase tracking-widest mb-6 text-${group.color}-900`}>{group.title}</h2>
                  <div className="space-y-4">
                    {group.items.map(item => (
                      <button key={item.key} onClick={() => handleOpenPayment(item.key)}
                        className={`w-full flex items-start gap-4 p-5 border border-gray-200 ${colorMap[group.color]} rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left group`}>
                        <item.icon className={`${iconColorMap[group.color]} mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0`} size={24} />
                        <span className="text-gray-700 font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lịch sử tab */}
        {activeTab === 'history' && (
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Lịch sử giao dịch của tôi</h2>
            {!user ? (
              <p className="text-gray-500 text-center py-8">Vui lòng <Link to="/login" className="text-[#cc6633] font-medium">đăng nhập</Link> để xem lịch sử thanh toán.</p>
            ) : historyLoading ? (
              <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-orange-200 border-t-[#cc6633] rounded-full animate-spin" /></div>
            ) : history.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Clock size={40} className="mx-auto mb-3 opacity-40" />
                <p>Chưa có giao dịch nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 text-gray-600 text-xs uppercase">
                    <th className="px-4 py-3 text-left">Số biên lai</th>
                    <th className="px-4 py-3 text-left">Nội dung thu</th>
                    <th className="px-4 py-3 text-right">Số tiền</th>
                    <th className="px-4 py-3 text-center">Trạng thái</th>
                    <th className="px-4 py-3 text-left">Thời gian</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {history.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-[#cc6633] font-semibold">{p.receiptCode}</td>
                        <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{p.feeType}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrency(p.amount)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.status === 'success' ? 'bg-green-100 text-green-700' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {p.status === 'success' ? 'Thành công' : p.status === 'pending' ? 'Chờ xử lý' : 'Thất bại'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{p.paidAt ? formatDateTime(p.paidAt) : formatDateTime(p.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gray-50 border-b px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard size={20} className="text-[#cc6633]" />
                <h3 className="font-bold text-lg text-gray-800">Thanh toán trực tuyến</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200">
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-6">
                {[1,2,3].map((s, i) => (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${step >= s ? 'bg-[#cc6633] text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {step > s ? '✓' : s}
                    </div>
                    <span className={`text-xs hidden sm:block ${step >= s ? 'text-[#cc6633] font-medium' : 'text-gray-400'}`}>
                      {s === 1 ? 'Nhập mã HS' : s === 2 ? 'Xác nhận' : 'Biên lai'}
                    </span>
                    {i < 2 && <div className={`h-px flex-1 ${step > s ? 'bg-[#cc6633]' : 'bg-gray-200'}`} />}
                  </div>
                ))}
              </div>

              <div className="mb-5 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg text-sm text-[#cc6633] font-medium">{selectedService}</div>

              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Nhập <strong>Mã hồ sơ</strong> để tra cứu thông tin cần nộp.</p>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Mã hồ sơ</label>
                    <input type="text" value={searchCode} onChange={e => setSearchCode(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSearch()}
                      placeholder="Ví dụ: HS2026VN..." className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#cc6633] transition" />
                  </div>
                  <Button onClick={handleSearch} disabled={isLoading} className="w-full bg-[#cc6633] hover:bg-[#a64e22] text-white py-6 text-lg mt-4">
                    {isLoading ? <span className="flex items-center gap-2 justify-center"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Đang tra cứu...</span> : 'Tra Cứu Giao Dịch'}
                  </Button>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Người nộp:</span><span className="font-bold text-gray-900">{user?.fullName || 'Công dân'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Mã hồ sơ:</span><span className="font-bold text-gray-900">{searchCode.trim().toUpperCase()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Loại phí:</span><span className="font-medium text-gray-800">{selectedService}</span></div>
                  </div>
                  <div className="text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-6">
                    <p className="text-gray-500 text-sm mb-1">Tổng tiền thanh toán</p>
                    <p className="text-4xl font-extrabold text-[#cc6633]">{formatCurrency(fee)}</p>
                    {fee === 0 && <p className="text-green-600 text-sm mt-1 font-medium">Miễn phí theo quy định</p>}
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs px-3 py-2 rounded-lg">
                    ⚠ Vui lòng kiểm tra lại thông tin trước khi xác nhận thanh toán.
                  </div>
                  <Button onClick={handlePay} disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg">
                    {isLoading ? <span className="flex items-center gap-2 justify-center"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Đang xử lý...</span> : 'Xác Nhận Nộp Tiền (Thẻ/QR)'}
                  </Button>
                </div>
              )}

              {/* Step 3 — Biên lai */}
              {step === 3 && receiptData && (
                <div>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="text-green-500" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Thanh toán thành công!</h3>
                    <p className="text-sm text-gray-500 mt-1">Biên lai điện tử đã được lưu vào hệ thống</p>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden" id="receipt-block">
                    <div className="bg-gradient-to-r from-[#cc6633] to-orange-500 text-white px-5 py-4 text-center">
                      <div className="font-bold text-lg">BIÊN LAI THU PHÍ ĐIỆN TỬ</div>
                      <div className="text-orange-100 text-xs mt-1">Cổng Dịch vụ công cấp Xã/Phường</div>
                    </div>
                    <div className="bg-white px-5 py-4 space-y-2.5 text-sm">
                      {[
                        ['Số biên lai', <span className="font-mono font-bold text-[#cc6633]">{receiptData.receiptCode}</span>],
                        ['Mã hồ sơ', receiptData.applicationCode || searchCode.toUpperCase()],
                        ['Nội dung thu', receiptData.feeType],
                        ['Người nộp', receiptData.payer],
                        ['Phương thức', 'Thanh toán điện tử (Thẻ/QR)'],
                        ['Thời gian', formatDateTime(receiptData.paidAt)],
                        ['Cơ quan thu', receiptData.unit],
                      ].map(([label, val]) => (
                        <div key={String(label)} className="flex justify-between py-1.5 border-b border-dashed border-gray-200">
                          <span className="text-gray-500">{label}</span>
                          <span className="font-medium text-right max-w-[55%]">{val}</span>
                        </div>
                      ))}
                      <div className="py-3 text-center">
                        <div className="text-gray-500 text-xs mb-1">Số tiền đã nộp</div>
                        <div className="text-3xl font-extrabold text-green-600">{formatCurrency(receiptData.amount)}</div>
                        {receiptData.amount === 0 && <div className="text-green-500 text-xs mt-1">Miễn phí theo quy định</div>}
                      </div>
                      <div className="flex justify-center pb-2">
                        <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                          <CheckCircle size={12} /> ĐÃ THANH TOÁN
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 border-t px-5 py-3 text-xs text-center text-gray-500">
                      Biên lai này có giá trị pháp lý khi tra cứu trên Cổng dịch vụ công
                    </div>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <Button variant="outline" className="flex-1 border-gray-300 text-gray-700 flex items-center gap-2 justify-center" onClick={() => window.print()}>
                      <Printer size={16} /> In biên lai
                    </Button>
                    <Button variant="outline" className="flex-1 border-[#cc6633] text-[#cc6633] flex items-center gap-2 justify-center"
                      onClick={() => {
                        const text = [`BIÊN LAI THU PHÍ ĐIỆN TỬ`, `Số biên lai: ${receiptData.receiptCode}`, `Mã hồ sơ: ${receiptData.applicationCode || searchCode}`, `Nội dung: ${receiptData.feeType}`, `Người nộp: ${receiptData.payer}`, `Số tiền: ${formatCurrency(receiptData.amount)}`, `Thời gian: ${formatDateTime(receiptData.paidAt)}`, `Trạng thái: ĐÃ THANH TOÁN`].join('\n');
                        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a'); a.href = url; a.download = `BienLai_${receiptData.receiptCode}.txt`; a.click(); URL.revokeObjectURL(url);
                      }}>
                      <Download size={16} /> Tải biên lai
                    </Button>
                  </div>
                  <Button onClick={() => { setShowModal(false); fetchHistory(); setActiveTab('history'); }} className="w-full mt-3 bg-[#cc6633] hover:bg-[#a64e22] text-white">
                    Xem lịch sử giao dịch
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
