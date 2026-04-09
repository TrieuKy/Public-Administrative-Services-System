import { ChevronLeft, ChevronRight } from 'lucide-react';

export function QuickSearch() {
  const news = [
    {
      title: 'CÔNG BỐ VÀ HƯỚNG DẪN KẾT NỐI ĐỂ KHAI THÁC, SỬ DỤNG DỮ LIỆU...',
      date: 'Ngày 11/02/2026'
    },
    {
      title: 'CỔNG BỘ DỮ LIỆU, HƯỚNG DẪN KHAI THÁC, SỬ DỤNG DỮ LIỆU SỐC...',
      date: 'Ngày 11/02/2026'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Carousel Section */}
        <div className="relative">
          <button className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center">
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <button className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center">
            <ChevronRight size={20} className="text-gray-700" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {news.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              >
                <div className="mb-2">
                  <div className="w-full h-32 bg-gradient-to-br from-orange-100 to-amber-50 rounded flex items-center justify-center">
                    <div className="text-6xl text-orange-200">📰</div>
                  </div>
                </div>
                <h3 className="text-sm mb-2 line-clamp-2 leading-relaxed">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative lotus flowers (similar to reference image) */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <div className="text-orange-300 text-9xl">✿</div>
        </div>
      </div>
    </div>
  );
}
