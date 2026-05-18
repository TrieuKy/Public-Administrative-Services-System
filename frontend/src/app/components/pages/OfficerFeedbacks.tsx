import { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, XCircle, RefreshCw, Filter, Eye, X, Sparkles } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  resolved:  { label: 'Đã giải quyết', color: 'bg-green-100 text-green-700 border-green-200' },
  dismissed: { label: 'Bác bỏ', color: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const TOPIC_COLOR: Record<string, string> = {
  'Thái độ phục vụ': 'bg-red-50 text-red-700',
  'Hồ sơ trễ hẹn':  'bg-orange-50 text-orange-700',
  'Lỗi hệ thống':   'bg-purple-50 text-purple-700',
  'Khác':           'bg-gray-50 text-gray-600',
};

export function OfficerFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);

  // AI Summary State
  const [aiSummary, setAiSummary] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterTopic) params.append('topic', filterTopic);
      const res = await axiosInstance.get(`/officer/feedbacks?${params.toString()}`);
      if (res.data.success) {
        setFeedbacks(res.data.data.feedbacks || []);
        setTotal(res.data.data.total || 0);
      }
    } catch (err: any) {
      toast.error('Không thể tải danh sách phản ánh: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [filterStatus, filterTopic]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(true);
    try {
      await axiosInstance.patch(`/officer/feedbacks/${id}/status`, { status });
      toast.success('Cập nhật trạng thái thành công!');
      setSelected(null);
      fetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi cập nhật');
    } finally {
      setUpdating(false);
    }
  };

  const fetchAiSummary = async () => {
    setAiLoading(true);
    try {
      const res = await axiosInstance.get('/ai/summarize-feedbacks');
      if (res.data.success) {
        setAiSummary(res.data.data.summary);
        toast.success('Đã tải báo cáo tổng hợp từ AI');
      }
    } catch (err: any) {
      toast.error('Không thể lấy báo cáo AI: ' + (err.response?.data?.message || err.message));
    } finally {
      setAiLoading(false);
    }
  };

  const stats = {
    total: feedbacks.length,
    pending: feedbacks.filter(f => f.status === 'pending').length,
    resolved: feedbacks.filter(f => f.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Phản ánh kiến nghị</h2>
          <p className="text-sm text-gray-500">Quản lý và xử lý các phản ánh từ công dân</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchAiSummary} disabled={aiLoading} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700">
            {aiLoading ? <RefreshCw size={16} className="mr-2 animate-spin" /> : <Sparkles size={16} className="mr-2" />}
            {aiLoading ? 'Đang tổng hợp...' : 'AI Tổng hợp phản ánh'}
          </Button>
          <Button variant="outline" onClick={fetch} className="border-gray-300 bg-white shadow-sm text-gray-700">
            <RefreshCw size={16} className="mr-2" /> Làm mới
          </Button>
        </div>
      </div>

      {/* AI Summary Banner */}
      {aiSummary && (
        <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
              <Sparkles className="text-indigo-600" /> Báo cáo tổng hợp từ AI
            </h3>
            <button onClick={() => setAiSummary('')} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
          </div>
          <div 
            className="prose prose-sm prose-indigo max-w-none text-gray-700" 
            dangerouslySetInnerHTML={{ __html: aiSummary }} 
          />
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Tổng phản ánh', value: total, icon: MessageSquare, color: 'text-blue-600 bg-blue-50' },
          { label: 'Chờ xử lý',    value: stats.pending, icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Đã giải quyết', value: stats.resolved, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
        ].map(s => (
          <Card key={s.label} className="p-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter + Table */}
      <Card className="p-0 shadow-sm overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 bg-gray-50 border-b flex items-center gap-3">
          <Filter size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Lọc theo:</span>
          {[
            { value: '', label: 'Tất cả' },
            { value: 'pending', label: 'Chờ xử lý' },
            { value: 'resolved', label: 'Đã giải quyết' },
            { value: 'dismissed', label: 'Bác bỏ' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilterStatus(opt.value)}
              className={`px-3 py-1.5 text-sm rounded-lg transition ${
                filterStatus === opt.value
                  ? 'bg-red-700 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}

          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          
          <select
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
          >
            <option value="">Tất cả lĩnh vực</option>
            <option value="An ninh trật tự">An ninh trật tự</option>
            <option value="Môi trường">Môi trường</option>
            <option value="Giao thông đô thị">Giao thông đô thị</option>
            <option value="Thủ tục hành chính">Thủ tục hành chính</option>
            <option value="Hạ tầng">Hạ tầng</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-red-200 border-t-red-700 rounded-full animate-spin" />
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
            <p>Chưa có phản ánh nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Tiêu đề</th>
                  <th className="px-4 py-3 text-left">Lĩnh vực</th>
                  <th className="px-4 py-3 text-left">Người gửi</th>
                  <th className="px-4 py-3 text-center">Trạng thái</th>
                  <th className="px-4 py-3 text-left">Thời gian</th>
                  <th className="px-4 py-3 text-center">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {feedbacks.map(fb => (
                  <tr key={fb.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 max-w-[220px] truncate">{fb.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${TOPIC_COLOR[fb.topic] || TOPIC_COLOR['Khác']}`}>
                        {fb.topic || 'Khác'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {fb.author ? (
                        <div>
                          <p className="font-medium text-gray-800">{fb.author.fullName}</p>
                          <p className="text-xs text-gray-400">{fb.author.email}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Ẩn danh</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${STATUS_MAP[fb.status]?.color || STATUS_MAP.pending.color}`}>
                        {STATUS_MAP[fb.status]?.label || 'Chờ xử lý'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(fb.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelected(fb)}
                        className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition mx-auto"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-red-50 border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-800 font-bold">
                <MessageSquare size={18} /> Chi tiết phản ánh
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs uppercase text-gray-400 mb-1">Tiêu đề</p>
                <p className="font-bold text-gray-900 text-lg">{selected.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">Lĩnh vực</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${TOPIC_COLOR[selected.topic] || TOPIC_COLOR['Khác']}`}>
                    {selected.topic}
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">Trạng thái</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${STATUS_MAP[selected.status]?.color}`}>
                    {STATUS_MAP[selected.status]?.label}
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">Người gửi</p>
                  <p className="font-medium">{selected.author?.fullName || 'Ẩn danh'}</p>
                  {selected.author?.email && <p className="text-xs text-gray-400">{selected.author.email}</p>}
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">Thời gian</p>
                  <p className="font-medium">{new Date(selected.createdAt).toLocaleString('vi-VN')}</p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase text-gray-400 mb-2">Nội dung phản ánh</p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.content}
                </div>
              </div>

              {/* Actions */}
              {selected.status === 'pending' && (
                <div className="flex gap-3 pt-2 border-t">
                  <Button
                    onClick={() => updateStatus(selected.id, 'dismissed')}
                    disabled={updating}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <XCircle size={16} className="mr-2" /> Bác bỏ
                  </Button>
                  <Button
                    onClick={() => updateStatus(selected.id, 'resolved')}
                    disabled={updating}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    {updating ? 'Đang xử lý...' : 'Đánh dấu đã giải quyết'}
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
