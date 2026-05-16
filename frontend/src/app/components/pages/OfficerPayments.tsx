import { useState, useEffect } from 'react';
import { CreditCard, AlertCircle, CheckCircle, Clock, RefreshCw, FileText, User, ExternalLink, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}
function formatDate(iso?: string) {
  if (!iso) return '--';
  return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
}

export function OfficerPayments() {
  const [activeTab, setActiveTab] = useState<'all' | 'unpaid'>('all');

  // ── All payments ──
  const [payments, setPayments] = useState<any[]>([]);
  const [payTotal, setPayTotal] = useState(0);
  const [payPage, setPayPage] = useState(1);
  const [payTotalPages, setPayTotalPages] = useState(1);
  const [payLoading, setPayLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  // ── Unpaid applications ──
  const [unpaidApps, setUnpaidApps] = useState<any[]>([]);
  const [unpaidTotal, setUnpaidTotal] = useState(0);
  const [unpaidPage, setUnpaidPage] = useState(1);
  const [unpaidTotalPages, setUnpaidTotalPages] = useState(1);
  const [unpaidLoading, setUnpaidLoading] = useState(false);

  // ── Stats ──
  const [stats, setStats] = useState({ totalRevenue: 0, successCount: 0, pendingCount: 0, unpaidCount: 0 });

  const fetchPayments = async (p = payPage) => {
    setPayLoading(true);
    try {
      const params: any = { page: p, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      const res = await axiosInstance.get('/payments/officer/all', { params });
      if (res.data.success) {
        const d = res.data.data;
        setPayments(d.payments || []);
        setPayTotal(d.total || 0);
        setPayTotalPages(d.totalPages || 1);
        // Tính stats từ page 1 (thống kê sơ bộ)
        if (p === 1) {
          const allRes = await axiosInstance.get('/payments/officer/all', { params: { page: 1, limit: 9999 } });
          if (allRes.data.success) {
            const all = allRes.data.data.payments || [];
            setStats({
              totalRevenue: all.filter((x: any) => x.status === 'success').reduce((s: number, x: any) => s + x.amount, 0),
              successCount: all.filter((x: any) => x.status === 'success').length,
              pendingCount: all.filter((x: any) => x.status === 'pending').length,
              unpaidCount: 0, // sẽ cập nhật từ unpaid fetch
            });
          }
        }
      }
    } catch {
      toast.error('Không thể tải danh sách giao dịch');
    } finally {
      setPayLoading(false);
    }
  };

  const fetchUnpaid = async (p = unpaidPage) => {
    setUnpaidLoading(true);
    try {
      const res = await axiosInstance.get('/payments/officer/unpaid-applications', { params: { page: p, limit: 15 } });
      if (res.data.success) {
        const d = res.data.data;
        setUnpaidApps(d.applications || []);
        setUnpaidTotal(d.total || 0);
        setUnpaidTotalPages(d.totalPages || 1);
        setStats(prev => ({ ...prev, unpaidCount: d.total || 0 }));
      }
    } catch {
      toast.error('Không thể tải danh sách hồ sơ chưa thanh toán');
    } finally {
      setUnpaidLoading(false);
    }
  };

  useEffect(() => { fetchPayments(1); fetchUnpaid(1); }, []);
  useEffect(() => { fetchPayments(payPage); }, [statusFilter]);

  const statusBadge = (status: string) => {
    if (status === 'success') return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1 w-fit"><CheckCircle size={10}/>Thành công</span>;
    if (status === 'pending') return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full flex items-center gap-1 w-fit"><Clock size={10}/>Chờ xử lý</span>;
    return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1 w-fit"><AlertCircle size={10}/>Thất bại</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý thanh toán trực tuyến</h2>
          <p className="text-sm text-gray-500">Theo dõi lệ phí, hồ sơ chưa thanh toán và lịch sử giao dịch</p>
        </div>
        <Button variant="outline" onClick={() => { fetchPayments(1); fetchUnpaid(1); }}
          className="border-gray-300 bg-white text-gray-700">
          <RefreshCw size={16} className="mr-2" /> Làm mới
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tổng doanh thu', value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
          { label: 'Giao dịch thành công', value: stats.successCount, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Chờ xử lý', value: stats.pendingCount, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
          { label: 'Hồ sơ chưa đóng phí', value: stats.unpaidCount, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
        ].map(s => (
          <Card key={s.label} className={`p-4 border ${s.border} ${s.bg}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon size={22} className={s.color} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { key: 'all',    label: 'Lịch sử giao dịch',      icon: CreditCard,   count: payTotal },
          { key: 'unpaid', label: 'Hồ sơ chưa thanh toán',  icon: AlertCircle,  count: unpaidTotal },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-5 py-3 font-medium text-sm border-b-2 transition ${activeTab === tab.key ? 'border-red-700 text-red-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <tab.icon size={16} />
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* ── TAB: All Payments ── */}
      {activeTab === 'all' && (
        <Card className="p-0 shadow-sm border-gray-200 overflow-hidden">
          {/* Filter bar */}
          <div className="p-4 bg-gray-50 border-b flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <label className="text-sm font-medium text-gray-600">Tìm kiếm:</label>
              <input 
                type="text" 
                placeholder="Mã hồ sơ / Mã biên lai..."
                className="border border-gray-300 rounded-lg text-sm px-3 py-1.5 bg-white outline-none focus:ring-2 focus:ring-red-400 flex-1 md:w-64"
                onChange={(e) => {
                  const val = e.target.value.toLowerCase();
                  // Simple client side filter for now
                  if (!val) fetchPayments(1);
                  else {
                    setPayments(payments.filter(p => 
                      p.receiptCode?.toLowerCase().includes(val) || 
                      p.application?.applicationCode?.toLowerCase().includes(val)
                    ));
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-3 mt-2 md:mt-0">
              <label className="text-sm font-medium text-gray-600">Trạng thái:</label>
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPayPage(1); }}
                className="border border-gray-300 rounded-lg text-sm px-3 py-1.5 bg-white outline-none focus:ring-2 focus:ring-red-400">
                <option value="">Tất cả</option>
                <option value="success">Thành công</option>
                <option value="pending">Chờ xử lý</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-white border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Số biên lai</th>
                  <th className="px-4 py-3">Người nộp</th>
                  <th className="px-4 py-3">Nội dung thu</th>
                  <th className="px-4 py-3">Mã hồ sơ</th>
                  <th className="px-4 py-3 text-right">Số tiền</th>
                  <th className="px-4 py-3 text-center">Trạng thái</th>
                  <th className="px-4 py-3">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {payLoading ? (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-400">
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"/>Đang tải...
                    </span>
                  </td></tr>
                ) : payments.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-400">Không có dữ liệu</td></tr>
                ) : payments.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-3 font-mono text-red-700 font-semibold text-xs">{p.receiptCode}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center"><User size={13}/></div>
                        <div>
                          <p className="font-medium text-gray-800 text-xs">{p.payer?.fullName}</p>
                          <p className="text-[11px] text-gray-400">{p.payer?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[180px]">
                      <p className="truncate text-xs" title={p.feeType}>{p.feeType}</p>
                    </td>
                    <td className="px-4 py-3">
                      {p.application?.applicationCode ? (
                        <Link to="/officer/applications"
                          className="font-mono text-xs text-blue-600 hover:underline flex items-center gap-1">
                          {p.application.applicationCode}<ExternalLink size={10}/>
                        </Link>
                      ) : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrency(p.amount)}</td>
                    <td className="px-4 py-3">{statusBadge(p.status)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatDate(p.paidAt || p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t flex items-center justify-between bg-gray-50">
            <span className="text-sm text-gray-500">Hiển thị {payments.length} / {payTotal} giao dịch</span>
            <div className="flex gap-1">
              <button disabled={payPage <= 1} onClick={() => { const p = payPage - 1; setPayPage(p); fetchPayments(p); }}
                className="w-8 h-8 rounded border bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 text-sm">&lt;</button>
              {Array.from({ length: payTotalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => { setPayPage(p); fetchPayments(p); }}
                  className={`w-8 h-8 rounded text-sm font-medium ${p === payPage ? 'bg-red-700 text-white' : 'border bg-white text-gray-600 hover:bg-gray-50'}`}>{p}</button>
              ))}
              <button disabled={payPage >= payTotalPages} onClick={() => { const p = payPage + 1; setPayPage(p); fetchPayments(p); }}
                className="w-8 h-8 rounded border bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 text-sm">&gt;</button>
            </div>
          </div>
        </Card>
      )}

      {/* ── TAB: Unpaid Applications ── */}
      {activeTab === 'unpaid' && (
        <Card className="p-0 shadow-sm border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b bg-red-50 flex items-center gap-3">
            <AlertCircle size={18} className="text-red-600 shrink-0"/>
            <p className="text-sm text-red-800 font-medium">
              Có <strong>{unpaidTotal}</strong> hồ sơ đang chờ người dân đóng lệ phí. Hệ thống sẽ hiển thị thông báo nhắc nhở trong mục quản lý hồ sơ.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-white border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Mã hồ sơ</th>
                  <th className="px-4 py-3">Dịch vụ</th>
                  <th className="px-4 py-3">Công dân</th>
                  <th className="px-4 py-3">Liên hệ</th>
                  <th className="px-4 py-3 text-right">Lệ phí</th>
                  <th className="px-4 py-3 text-center">Trạng thái HĐ</th>
                  <th className="px-4 py-3">Ngày nộp</th>
                  <th className="px-4 py-3 text-center">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {unpaidLoading ? (
                  <tr><td colSpan={8} className="p-8 text-center text-gray-400">
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"/>Đang tải...
                    </span>
                  </td></tr>
                ) : unpaidApps.length === 0 ? (
                  <tr><td colSpan={8} className="p-10 text-center">
                    <CheckCircle size={40} className="mx-auto mb-3 text-green-400"/>
                    <p className="text-gray-500 font-medium">Tuyệt vời! Tất cả hồ sơ đều đã thanh toán lệ phí.</p>
                  </td></tr>
                ) : unpaidApps.map(app => (
                  <tr key={app.id} className="hover:bg-red-50/30 transition">
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-800 font-mono text-xs">{app.applicationCode}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5"><FileText size={12} className="text-gray-400"/>{app.service?.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 text-xs">{app.citizen?.fullName}</p>
                      <p className="text-[11px] text-gray-400">{app.citizen?.cccd}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{app.citizen?.email || app.citizen?.phone || '—'}</td>
                    <td className="px-4 py-3 text-right font-bold text-red-700">
                      {app.service?.currentFee > 0 ? formatCurrency(app.service.currentFee) : 'Miễn phí'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full w-fit mx-auto animate-pulse">
                        <AlertCircle size={10}/>Chưa thanh toán phí
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatDate(app.submittedAt)}</td>
                    <td className="px-4 py-3 text-center">
                      <Link to="/officer/applications"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium">
                        <ExternalLink size={12}/>Xem hồ sơ
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {unpaidTotalPages > 1 && (
            <div className="p-4 border-t flex items-center justify-between bg-gray-50">
              <span className="text-sm text-gray-500">Hiển thị {unpaidApps.length} / {unpaidTotal} hồ sơ</span>
              <div className="flex gap-1">
                <button disabled={unpaidPage <= 1} onClick={() => { const p = unpaidPage - 1; setUnpaidPage(p); fetchUnpaid(p); }}
                  className="w-8 h-8 rounded border bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 text-sm">&lt;</button>
                {Array.from({ length: unpaidTotalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => { setUnpaidPage(p); fetchUnpaid(p); }}
                    className={`w-8 h-8 rounded text-sm font-medium ${p === unpaidPage ? 'bg-red-700 text-white' : 'border bg-white text-gray-600 hover:bg-gray-50'}`}>{p}</button>
                ))}
                <button disabled={unpaidPage >= unpaidTotalPages} onClick={() => { const p = unpaidPage + 1; setUnpaidPage(p); fetchUnpaid(p); }}
                  className="w-8 h-8 rounded border bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 text-sm">&gt;</button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
