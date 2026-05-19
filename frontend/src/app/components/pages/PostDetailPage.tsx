import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Tag, Clock, Share2, Home } from 'lucide-react';
import { Footer } from '../Footer';
import axiosInstance from '../../../utils/axiosInstance';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  publishedAt: string;
  createdAt: string;
}

const categoryColors: Record<string, { bg: string; text: string; badge: string }> = {
  'Tin tức':   { bg: 'from-red-700 to-red-900',   text: 'text-red-700',   badge: 'bg-red-100 text-red-700 border-red-200' },
  'Hướng dẫn': { bg: 'from-blue-600 to-blue-800', text: 'text-blue-700',  badge: 'bg-blue-100 text-blue-700 border-blue-200' },
  'Thông báo': { bg: 'from-amber-500 to-amber-700', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
};

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosInstance.get(`/posts/${id}`)
      .then(res => {
        setPost(res.data?.data);
        // Fetch related posts
        return axiosInstance.get('/posts?isPublished=true');
      })
      .then(res => {
        const all: Post[] = res.data?.data?.posts || [];
        // Related: same category, excluding current
        const filtered = all.filter(p => p.id !== id).slice(0, 3);
        setRelatedPosts(filtered);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN', {
        weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
      });
    } catch { return ''; }
  };

  const estimateReadTime = (text: string) => {
    const words = text?.split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / 200));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-72 bg-gray-200 rounded-2xl" />
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-gray-200 rounded" />)}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center flex-col gap-4 py-24">
          <div className="text-6xl">📰</div>
          <h2 className="text-2xl font-bold text-gray-700">Bài viết không tồn tại</h2>
          <p className="text-gray-500">Bài viết này có thể đã bị gỡ hoặc chưa được xuất bản.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-red-700 text-white rounded-lg hover:bg-red-800 transition font-medium"
          >
            <Home size={18} /> Về trang chủ
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const colors = categoryColors[post.category] || categoryColors['Tin tức'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className={`relative bg-gradient-to-br ${colors.bg} text-white`}>
        {post.imageUrl && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover opacity-20"
            />
            <div className={`absolute inset-0 bg-gradient-to-b ${colors.bg} opacity-80`} />
          </div>
        )}
        <div className="relative max-w-4xl mx-auto px-4 pt-10 pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <button onClick={() => navigate('/')} className="hover:text-white transition flex items-center gap-1">
              <Home size={14} /> Trang chủ
            </button>
            <span>/</span>
            <button onClick={() => navigate('/')} className="hover:text-white transition">Tin tức & Thông báo</button>
            <span>/</span>
            <span className="text-white line-clamp-1">{post.title}</span>
          </nav>

          {/* Category Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full mb-4 border border-white/30">
            <Tag size={12} /> {post.category}
          </span>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4 text-white">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6 max-w-3xl">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <Calendar size={15} />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            {post.content && (
              <span className="flex items-center gap-1.5">
                <Clock size={15} />
                ~{estimateReadTime(post.content)} phút đọc
              </span>
            )}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 hover:text-white transition ml-auto"
            >
              <Share2 size={15} /> Chia sẻ
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-700 mb-8 transition group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Quay lại
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Article image */}
          {post.imageUrl && (
            <div className="w-full h-72 md:h-96 overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article body */}
          <div className="p-6 md:p-10">
            <div
              className="prose prose-gray max-w-none text-gray-700 leading-relaxed text-base whitespace-pre-wrap"
              style={{ lineHeight: '1.85' }}
            >
              {post.content || post.excerpt || 'Nội dung đang được cập nhật...'}
            </div>

            {/* Footer meta */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${colors.badge}`}>
                  <Tag size={12} /> {post.category}
                </span>
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <Calendar size={13} />
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition"
              >
                <Share2 size={15} /> Chia sẻ bài viết
              </button>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-red-700 rounded-full" />
              Bài viết liên quan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedPosts.map(p => {
                const c = categoryColors[p.category] || categoryColors['Tin tức'];
                return (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/posts/${p.id}`)}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="h-40 overflow-hidden bg-gray-100 relative">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">📰</div>
                      )}
                      <span className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r ${c.bg} text-white`}>
                        {p.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-gray-800 text-sm line-clamp-2 group-hover:text-red-700 transition mb-2">
                        {p.title}
                      </p>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={11} />
                        {formatDate(p.publishedAt || p.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-red-700 text-white rounded-xl hover:bg-red-800 transition font-medium shadow-md hover:shadow-lg"
          >
            <Home size={18} /> Về trang chủ
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
