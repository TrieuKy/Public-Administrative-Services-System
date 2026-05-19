import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import axios from 'axios';

interface Post {
  id: number;
  title: string;
  createdAt: string;
  category?: string;
}

export function QuickSearch() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const PAGE_SIZE = 2;

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
    axios.get(`${apiBase}/posts?isPublished=true&limit=6`)
      .then(res => {
        const data = res.data?.data?.posts || res.data?.data || [];
        if (Array.isArray(data)) setPosts(data);
      })
      .catch(() => setPosts([]));
  }, []);

  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const visible = posts.slice(currentIndex * PAGE_SIZE, currentIndex * PAGE_SIZE + PAGE_SIZE);

  const prev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const next = () => setCurrentIndex(i => Math.min(totalPages - 1, i + 1));

  const formatDate = (d: string) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (posts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
          <h2 className="text-base font-semibold text-red-800">Tin tức - Thông báo</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Trang trước"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-gray-400 px-1">{currentIndex + 1}/{totalPages}</span>
            <button
              onClick={next}
              disabled={currentIndex >= totalPages - 1}
              className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Trang sau"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
          {visible.map((item) => (
            <Link
              to={`/tin-tuc/${item.id}`}
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-red-200 transition cursor-pointer block"
            >
              <div className="w-full h-28 bg-gradient-to-br from-red-50 to-orange-50 rounded-md flex items-center justify-center mb-3">
                <div className="text-4xl opacity-30 text-red-300">📋</div>
              </div>
              <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 leading-relaxed">
                {item.title}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar size={12} />
                <span>{formatDate(item.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
