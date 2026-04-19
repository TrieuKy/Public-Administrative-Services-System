import { useState, useEffect } from 'react';
import { Star, MessageSquare, Calendar, Filter, User, Search, ThumbsUp } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';

export function OfficerReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/officer/reviews');
      setReviews(res.data.data.reviews || []);
      setStats(res.data.data.stats || null);
    } catch (e: any) {
      toast.error('Không thể tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Đánh giá chất lượng dịch vụ</h2>
          <p className="text-sm text-gray-500">Phản hồi từ công dân sau khi hoàn tất thủ tục hành chính</p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 md:col-span-1 bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-100 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-medium text-orange-900 mb-2">Điểm trung bình</h3>
            <div className="text-5xl font-bold text-orange-600 mb-2">{stats.averageRating}</div>
            <div className="flex text-yellow-500 mb-2">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} fill={s <= Math.round(stats.averageRating) ? 'currentColor' : 'none'} size={24} />
              ))}
            </div>
            <p className="text-sm text-orange-700">Dựa trên {stats.totalReviews} lượt đánh giá</p>
          </Card>

          <Card className="p-6 md:col-span-2">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Chi tiết các mức đánh giá</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(stars => {
                const count = stats.ratingCounts[stars] || 0;
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16 text-sm text-gray-600 font-medium">
                      {stars} <Star size={14} className="text-yellow-500" fill="currentColor" />
                    </div>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${stars >= 4 ? 'bg-green-500' : stars === 3 ? 'bg-yellow-400' : 'bg-red-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-right text-sm text-gray-500">{count}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Reviews List */}
      <Card className="p-0 shadow-sm border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <MessageSquare size={18} /> Danh sách phản hồi
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white border-gray-300 text-sm">
              <Filter size={16} className="mr-2" /> Lọc
            </Button>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Đang tải dữ liệu...</div>
          ) : reviews.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Chưa có đánh giá nào từ công dân.</p>
            </div>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="p-6 hover:bg-gray-50/50 transition flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 flex-shrink-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {review.citizen?.fullName?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{review.citizen?.fullName || 'Công dân'}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} /> {formatDate(review.completedAt)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="inline-block px-3 py-1 bg-gray-100 border border-gray-200 rounded-md text-xs text-gray-600 mb-3">
                    Dịch vụ: <span className="font-medium text-gray-800">{review.service?.name}</span> (Mã HS: {review.applicationCode})
                  </div>
                  
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={18} className={s <= review.rating ? 'text-yellow-400' : 'text-gray-200'} fill={s <= review.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>

                  <p className="text-gray-700 italic border-l-4 border-gray-200 pl-4 py-1 text-sm bg-white rounded-r-lg">
                    {review.ratingContent ? `"${review.ratingContent}"` : <span className="text-gray-400">Không để lại nhận xét chi tiết.</span>}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
