import { Card } from './ui/card';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export function News() {
  const news = [
    {
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400',
      category: 'Tin tức',
      title: 'Triển khai hệ thống định danh điện tử quốc gia VNeID 2.0',
      date: '28/03/2026',
      excerpt: 'Chính phủ chính thức ra mắt phiên bản nâng cấp của ứng dụng định danh điện tử với nhiều tính năng mới...'
    },
    {
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400',
      category: 'Hướng dẫn',
      title: 'Hướng dẫn đăng ký doanh nghiệp trực tuyến đơn giản, nhanh chóng',
      date: '25/03/2026',
      excerpt: 'Quy trình đăng ký thành lập doanh nghiệp hoàn toàn trực tuyến chỉ trong 3 ngày làm việc...'
    },
    {
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
      category: 'Thông báo',
      title: 'Nâng cấp hệ thống vào ngày 05/04/2026 từ 22h00 đến 02h00',
      date: '22/03/2026',
      excerpt: 'Hệ thống sẽ tạm thời gián đoạn để nâng cấp và bảo trì, quý khách vui lòng thực hiện giao dịch trước thời gian này...'
    },
    {
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
      category: 'Tin tức',
      title: 'Mở rộng danh mục 500 dịch vụ công trực tuyến mức độ 4',
      date: '20/03/2026',
      excerpt: 'Bộ Thông tin và Truyền thông công bố danh sách mở rộng các dịch vụ công trực tuyến toàn trình...'
    },
    {
      image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=400',
      category: 'Hướng dẫn',
      title: 'Cách tra cứu và thanh toán thuế trực tuyến qua Cổng Dịch vụ công',
      date: '18/03/2026',
      excerpt: 'Người dân và doanh nghiệp có thể tra cứu, kê khai và thanh toán thuế hoàn toàn trực tuyến...'
    },
    {
      image: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=400',
      category: 'Tin tức',
      title: 'Tích hợp thanh toán điện tử và chữ ký số vào dịch vụ công',
      date: '15/03/2026',
      excerpt: 'Nền tảng cho phép người dùng thanh toán trực tuyến và ký số ngay trên giao diện dịch vụ công...'
    }
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
            <div className="relative h-48 overflow-hidden bg-gray-200">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-gradient-to-r from-red-700 to-red-800 text-white text-xs rounded-full">
                  {item.category}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Calendar size={14} />
                <span>{item.date}</span>
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

      <div className="text-center mt-8 sm:hidden">
        <Button variant="outline" className="w-full border-red-700 text-red-700">
          Xem tất cả tin tức
        </Button>
      </div>
    </section>
  );
}
