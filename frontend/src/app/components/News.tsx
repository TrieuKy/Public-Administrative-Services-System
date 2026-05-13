import { Card } from './ui/card';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  publishedAt: string;
  createdAt: string;
}

export function News() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/posts?isPublished=true')
      .then(res => {
        setPosts(res.data?.data?.posts?.slice(0, 6) || []);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const categoryColors: Record<string, string> = {
    'Tin tức':   'from-red-700 to-red-800',
    'Hướng dẫn': 'from-blue-600 to-blue-700',
    'Thông báo': 'from-amber-600 to-amber-700',
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch { return ''; }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-red-800">Tin tức & Thông báo</h2>
          <p className="text-gray-600">Cập nhật tin tức mới nhất về dịch vụ công</p>
        </div>
        <Button variant="outline" className="hidden sm:flex border-red-700 text-red-700 hover:bg-red-50">
          Xem tất cả
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-80" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Chưa có bài đăng nào được xuất bản.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((item) => (
            <Card
              key={item.id}
              onClick={() => {
                // Nếu có trang chi tiết bài viết thì navigate, không thì toast
                window.open(`/posts/${item.id}`, '_self');
              }}
              className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden bg-gray-200">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 text-4xl">📰</span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 bg-gradient-to-r ${categoryColors[item.category] || 'from-gray-600 to-gray-700'} text-white text-xs rounded-full`}>
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar size={14} />
                  <span>{formatDate(item.publishedAt || item.createdAt)}</span>
                </div>
                <h3 className="mb-3 line-clamp-2 group-hover:text-red-700 transition">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {item.excerpt}
                </p>
                <div className="flex items-center gap-2 text-red-700 group-hover:gap-3 transition-all">
                  <span className="text-sm">Đọc thêm</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center mt-8 sm:hidden">
        <Button variant="outline" className="w-full border-red-700 text-red-700">
          Xem tất cả tin tức
        </Button>
      </div>
    </section>
  );
}
