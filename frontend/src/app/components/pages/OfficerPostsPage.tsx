import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Newspaper, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'react-toastify';
import axiosInstance from '../../../utils/axiosInstance';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: 'Tin tức' | 'Hướng dẫn' | 'Thông báo';
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  content: '',
  imageUrl: '',
  category: 'Tin tức' as Post['category'],
  isPublished: false,
};

export function OfficerPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/posts');
      setPosts(res.data?.data?.posts || []);
    } catch {
      toast.error('Không thể tải danh sách bài đăng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const openAdd = () => {
    setEditingPost(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (post: Post) => {
    setEditingPost(post);
    setForm({
      title:       post.title,
      excerpt:     post.excerpt || '',
      content:     post.content || '',
      imageUrl:    post.imageUrl || '',
      category:    post.category,
      isPublished: post.isPublished,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Vui lòng nhập tiêu đề'); return; }
    setSaving(true);
    try {
      if (editingPost) {
        await axiosInstance.put(`/posts/${editingPost.id}`, form);
        toast.success('Cập nhật bài đăng thành công!');
      } else {
        await axiosInstance.post('/posts', form);
        toast.success('Thêm bài đăng thành công!');
      }
      setShowForm(false);
      fetchPosts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/posts/${id}`);
      toast.success('Đã xóa bài đăng');
      setDeleteConfirm(null);
      fetchPosts();
    } catch {
      toast.error('Không thể xóa bài đăng');
    }
  };

  const togglePublish = async (post: Post) => {
    try {
      await axiosInstance.put(`/posts/${post.id}`, { isPublished: !post.isPublished });
      toast.success(post.isPublished ? 'Đã ẩn bài đăng' : 'Đã xuất bản bài đăng');
      fetchPosts();
    } catch {
      toast.error('Không thể thay đổi trạng thái');
    }
  };

  const categoryColors: Record<string, string> = {
    'Tin tức':   'bg-blue-100 text-blue-700',
    'Hướng dẫn': 'bg-green-100 text-green-700',
    'Thông báo': 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Newspaper className="text-red-700" size={28} />
            Quản lý Bài đăng
          </h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý tin tức và thông báo hiển thị trên trang chủ công dân</p>
        </div>
        <Button onClick={openAdd} className="bg-red-700 hover:bg-red-800 text-white gap-2">
          <Plus size={18} /> Thêm bài đăng
        </Button>
      </div>

      {/* Post List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Đang tải...</div>
      ) : posts.length === 0 ? (
        <Card className="p-12 text-center">
          <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Chưa có bài đăng nào. Thêm bài đăng mới để hiển thị trên trang chủ.</p>
        </Card>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Bài đăng</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Danh mục</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ngày tạo</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <ImageIcon size={20} className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{post.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
                      {post.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${post.isPublished ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {post.isPublished ? 'Đã xuất bản' : 'Nháp'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => togglePublish(post)}
                        title={post.isPublished ? 'Ẩn bài' : 'Xuất bản'}
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition rounded"
                      >
                        {post.isPublished ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                      <button
                        onClick={() => openEdit(post)}
                        className="p-1.5 text-gray-400 hover:text-orange-600 transition rounded"
                        title="Sửa"
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition rounded"
                        title="Xóa"
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
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPost ? 'Chỉnh sửa bài đăng' : 'Thêm bài đăng mới'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={22} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Nhập tiêu đề bài đăng..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value as Post['category'] })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
                  >
                    <option value="Tin tức">Tin tức</option>
                    <option value="Hướng dẫn">Hướng dẫn</option>
                    <option value="Thông báo">Thông báo</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={e => setForm({ ...form, isPublished: e.target.checked })}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Xuất bản ngay</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">URL ảnh</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="preview" className="mt-2 h-24 rounded-lg object-cover w-full" onError={e => (e.currentTarget.style.display='none')} />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả ngắn</label>
                <textarea
                  value={form.excerpt}
                  onChange={e => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Tóm tắt nội dung bài đăng (hiển thị ở trang chủ)..."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung đầy đủ</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Nội dung chi tiết bài đăng..."
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">Hủy</Button>
              <Button onClick={handleSave} disabled={saving} className="flex-1 bg-red-700 hover:bg-red-800 text-white gap-2">
                <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu bài đăng'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
            <p className="text-gray-600 text-sm mb-6">Bạn có chắc muốn xóa bài đăng này? Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1">Hủy</Button>
              <Button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-700 text-white">Xóa</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
