import { Mail, Phone, MapPin, Facebook, Youtube, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-800 via-gray-900 to-stone-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-amber-400 mb-4">Về Cổng Dịch vụ công</h3>
            <p className="text-sm leading-relaxed mb-4">
              Cổng Dịch vụ công cấp Xã/Phường là nền tảng phục vụ dịch vụ công trực tuyến tại cơ sở, phục vụ người dân và doanh nghiệp.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-700 transition">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-700 transition">
                <Youtube size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-700 transition">
                <Globe size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-amber-400 mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition">Giới thiệu</a></li>
              <li><Link to="/service-form" className="hover:text-amber-400 transition">Dịch vụ công trực tuyến</Link></li>
              <li><a href="#" className="hover:text-amber-400 transition">Hướng dẫn sử dụng</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Chính sách bảo mật</a></li>
              <li><Link to="/officer/dashboard" className="hover:text-amber-400 transition">Dành cho cán bộ</Link></li>
              <li><Link to="/export" className="hover:text-amber-400 transition flex items-center gap-1">⬇ Tải mã nguồn</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-amber-400 mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition">Trung tâm hỗ trợ</a></li>
              <li><Link to="/service-form" className="hover:text-amber-400 transition">Hướng dẫn nộp hồ sơ</Link></li>
              <li><Link to="/tracking" className="hover:text-amber-400 transition">Tra cứu hồ sơ</Link></li>
              <li><a href="#" className="hover:text-amber-400 transition">Đánh giá dịch vụ</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Góp ý kiến</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Báo cáo sự cố</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-amber-400 mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                <span>UBND Xã/Phường, Huyện/Quận, Tỉnh/Thành phố</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="flex-shrink-0" />
                <span>Hotline: (024) 3825.xxxx</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="flex-shrink-0" />
                <span>ubnd@xa.gov.vn</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-lg border border-red-800/30">
              <div className="text-sm mb-1 text-amber-400">Thời gian hỗ trợ:</div>
              <div className="text-xs text-gray-400">Thứ 2 - Thứ 6: 7:30 - 17:00</div>
              <div className="text-xs text-gray-400">Thứ 7: 7:30 - 11:30</div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p>© 2026 Cổng Dịch vụ công cấp Xã/Phường. Bản quyền thuộc về UBND Xã/Phường.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-amber-400 transition">Bản đồ trang</a>
              <a href="#" className="hover:text-amber-400 transition">Liên hệ</a>
              <a href="#" className="hover:text-amber-400 transition">RSS</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}