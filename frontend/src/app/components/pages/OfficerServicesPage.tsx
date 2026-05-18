import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, LayoutList, ListPlus, Minus, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'react-toastify';
import axiosInstance from '../../../utils/axiosInstance';

interface RequiredDoc {
  name: string;
  templateUrl?: string;
  templateName?: string;
  extractedFields?: string[];
}

interface Service {
  id: string;
  name: string;
  category: 'individual' | 'business' | 'organization';
  agency: string;
  processingTime: string;
  processingDays: number;
  level: string;
  fee: string;
  description: string;
  procedures?: string;
  workflow?: string;
  requiredDocs: RequiredDoc[] | string[];
  isActive: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  individual:   'Công dân',
  business:     'Hộ kinh doanh',
  organization: 'Tổ chức',
};

const EMPTY_FORM = {
  name: '',
  category: 'individual' as Service['category'],
  agency: 'Ủy ban nhân dân cấp xã',
  processingTime: '3 ngày làm việc',
  processingDays: 3,
  level: 'Mức độ 4',
  fee: 'Miễn phí',
  description: '',
  procedures: '',
  workflow: '',
  requiredDocs: [{ name: '' }] as RequiredDoc[],
  isActive: true,
};

export function OfficerServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'individual' | 'business' | 'organization'>('individual');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/services?limit=100&includeHidden=true');
      setServices(res.data?.data?.services || []);
    } catch {
      toast.error('Không thể tải danh sách dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const openAdd = () => {
    setEditingService(null);
    setForm({ ...EMPTY_FORM, category: activeTab });
    setShowForm(true);
  };

  const openEdit = (svc: Service) => {
    setEditingService(svc);
    setForm({
      name:           svc.name,
      category:       svc.category,
      agency:         svc.agency || '',
      processingTime: svc.processingTime || '',
      processingDays: svc.processingDays || 3,
      level:          svc.level || '',
      fee:            svc.fee || '',
      description:    svc.description || '',
      procedures:     svc.procedures || '',
      workflow:       svc.workflow || '',
      requiredDocs:   svc.requiredDocs?.length 
                        ? svc.requiredDocs.map(d => typeof d === 'string' ? { name: d } : d) as RequiredDoc[] 
                        : [{ name: '' }],
      isActive:       svc.isActive,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Vui lòng nhập tên dịch vụ'); return; }
    const payload = {
      ...form,
      requiredDocs: form.requiredDocs.filter(d => d.name.trim() !== '')
    };
    setSaving(true);
    try {
      if (editingService) {
        await axiosInstance.put(`/services/${editingService.id}`, payload);
        toast.success('Cập nhật dịch vụ thành công!');
      } else {
        await axiosInstance.post('/services', payload);
        toast.success('Thêm dịch vụ thành công!');
      }
      setShowForm(false);
      fetchServices();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (svc: Service) => {
    try {
      await axiosInstance.put(`/services/${svc.id}`, { isActive: !svc.isActive });
      toast.success(svc.isActive ? 'Đã ẩn dịch vụ' : 'Đã hiện dịch vụ');
      fetchServices();
    } catch {
      toast.error('Không thể thay đổi trạng thái dịch vụ');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/services/${id}`);
      toast.success('Đã xóa dịch vụ');
      setDeleteConfirm(null);
      fetchServices();
    } catch {
      toast.error('Không thể xóa dịch vụ');
    }
  };

  const addDocField = () => setForm(f => ({ ...f, requiredDocs: [...f.requiredDocs, { name: '' }] }));
  const removeDocField = (i: number) => setForm(f => ({ ...f, requiredDocs: f.requiredDocs.filter((_, idx) => idx !== i) }));
  const updateDoc = (i: number, val: string) => setForm(f => {
    const docs = [...f.requiredDocs]; docs[i].name = val; return { ...f, requiredDocs: docs };
  });

  const handleUploadTemplate = async (index: number, file: File) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      toast.info('Đang tải lên và trích xuất trường thông tin...');
      const res = await axiosInstance.post('/services/template/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = res.data.data;
      setForm(f => {
        const docs = [...f.requiredDocs];
        docs[index] = {
          ...docs[index],
          templateUrl: data.fileUrl,
          templateName: data.fileName,
          extractedFields: data.extractedFields
        };
        return { ...f, requiredDocs: docs };
      });
      toast.success('Đã tải lên form mẫu và trích xuất dữ liệu');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi khi tải lên template');
    }
  };

  const filtered = services.filter(s => s.category === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <LayoutList className="text-red-700" size={28} />
            Quản lý Danh mục Dịch vụ Công
          </h1>
          <p className="text-gray-500 text-sm mt-1">Thêm, sửa, xóa các dịch vụ hiển thị trên trang chủ và trang nộp hồ sơ</p>
        </div>
        <Button onClick={openAdd} className="bg-red-700 hover:bg-red-800 text-white gap-2">
          <Plus size={18} /> Thêm dịch vụ
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['individual', 'business', 'organization'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition -mb-px border-b-2 ${
              activeTab === tab
                ? 'border-red-700 text-red-700 bg-red-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {CATEGORY_LABELS[tab]}
            <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
              {services.filter(s => s.category === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Service List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Đang tải...</div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <LayoutList size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Chưa có dịch vụ nào trong danh mục này.</p>
        </Card>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tên dịch vụ</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Thời gian</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phí</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Giấy tờ</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(svc => (
                <tr key={svc.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {!svc.isActive && <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] uppercase font-bold rounded">Đã ẩn</span>}
                      <p className={`font-medium ${!svc.isActive ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{svc.name}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{svc.agency}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{svc.processingTime}</td>
                  <td className="px-4 py-4 text-sm font-medium text-amber-700">{svc.fee}</td>
                  <td className="px-4 py-4">
                    <span className="text-xs text-gray-500">{svc.requiredDocs?.length || 0} giấy tờ</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(svc)}
                        className="p-1.5 text-gray-400 hover:text-orange-600 transition rounded"
                        title="Sửa"
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        onClick={() => handleToggleActive(svc)}
                        className={`p-1.5 transition rounded ${svc.isActive ? 'text-gray-400 hover:text-red-600' : 'text-green-500 hover:text-green-700'}`}
                        title={svc.isActive ? "Ẩn dịch vụ" : "Hiện dịch vụ"}
                      >
                        {svc.isActive ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(svc.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition rounded"
                        title="Xóa vĩnh viễn"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {editingService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={22} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên dịch vụ <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Đăng ký khai sinh"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value as Service['category'] })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
                  >
                    <option value="individual">Công dân</option>
                    <option value="business">Hộ kinh doanh</option>
                    <option value="organization">Tổ chức</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cơ quan thực hiện</label>
                  <input
                    type="text"
                    value={form.agency}
                    onChange={e => setForm({ ...form, agency: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Thời gian xử lý</label>
                  <input
                    type="text"
                    value={form.processingTime}
                    onChange={e => setForm({ ...form, processingTime: e.target.value })}
                    placeholder="VD: 3 ngày làm việc"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cấp độ dịch vụ</label>
                  <select
                    value={form.level}
                    onChange={e => setForm({ ...form, level: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
                  >
                    <option value="Mức độ 4">Mức độ 4</option>
                    <option value="Mức độ 3">Mức độ 3</option>
                    <option value="Mức độ 2">Mức độ 2</option>
                    <option value="Mức độ 1">Mức độ 1</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phí dịch vụ</label>
                <input
                  type="text"
                  value={form.fee}
                  onChange={e => setForm({ ...form, fee: e.target.value })}
                  placeholder="VD: Miễn phí hoặc 50.000 VNĐ"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>

              {/* Required Documents */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Yêu cầu giấy tờ cần thiết</label>
                  <button
                    type="button"
                    onClick={addDocField}
                    className="flex items-center gap-1 text-xs text-red-700 hover:text-red-800 font-medium"
                  >
                    <ListPlus size={15} /> Thêm giấy tờ
                  </button>
                </div>
                <div className="space-y-3">
                  {form.requiredDocs.map((doc, i) => (
                    <div key={i} className="flex flex-col gap-2 p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={doc.name}
                          onChange={e => updateDoc(i, e.target.value)}
                          placeholder={`Giấy tờ ${i + 1} (VD: CMND/CCCD)`}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
                        />
                        {form.requiredDocs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDocField(i)}
                            className="p-2 text-gray-400 hover:text-red-500 transition"
                            title="Xóa giấy tờ"
                          >
                            <Minus size={15} />
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-red-600 transition">
                          <Plus size={14} />
                          {doc.templateName ? 'Thay đổi Form Mẫu' : 'Thêm Form Mẫu (Word/PDF)'}
                          <input 
                            type="file" 
                            className="hidden" 
                            accept=".doc,.docx,.pdf"
                            onChange={(e) => {
                              if (e.target.files?.[0]) handleUploadTemplate(i, e.target.files[0]);
                            }}
                          />
                        </label>
                        {doc.templateName && (
                          <span className="text-xs text-blue-600 truncate max-w-[200px]" title={doc.templateName}>
                            {doc.templateName}
                          </span>
                        )}
                      </div>

                      {doc.extractedFields && doc.extractedFields.length > 0 && (
                        <div className="mt-1">
                          <p className="text-[11px] font-medium text-gray-500 mb-1">Các trường thông tin cần điền (AI trích xuất):</p>
                          <div className="flex flex-wrap gap-1.5">
                            {doc.extractedFields.map((field, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-red-50 text-red-700 border border-red-100">
                                {field}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Danh sách này sẽ hiển thị trong trang "Nộp hồ sơ trực tuyến". Bạn có thể đính kèm form mẫu để tự động yêu cầu người dân điền thông tin.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả (tùy chọn)</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Mô tả thêm về dịch vụ..."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Trình tự thực hiện (tùy chọn)</label>
                <textarea
                  value={form.procedures}
                  onChange={e => setForm({ ...form, procedures: e.target.value })}
                  placeholder="Các bước công dân cần thực hiện..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Quy trình xử lý (tùy chọn)</label>
                <textarea
                  value={form.workflow}
                  onChange={e => setForm({ ...form, workflow: e.target.value })}
                  placeholder="Quy trình xử lý nội bộ của cơ quan..."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">Hủy</Button>
              <Button onClick={handleSave} disabled={saving} className="flex-1 bg-red-700 hover:bg-red-800 text-white gap-2">
                <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu dịch vụ'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa vĩnh viễn</h3>
            <p className="text-gray-600 text-sm mb-6">Bạn có chắc chắn muốn xóa dịch vụ này không? Dữ liệu sẽ bị xóa khỏi hệ thống.</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1">Hủy</Button>
              <Button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-700 text-white">Xóa dịch vụ</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
