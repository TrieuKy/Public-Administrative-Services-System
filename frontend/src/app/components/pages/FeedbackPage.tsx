import { useState } from 'react';
import { ArrowLeft, Send, MessageSquare, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export function FeedbackPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Thái độ phục vụ',
    content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return alert("Vui lòng điền đầy đủ tiêu đề và nội dung.");
    // Giả lập lưu
    setTimeout(() => {
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-800 to-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-red-100 transition mb-4">
            <ArrowLeft size={20} />
            <span>Quay lại Trang chủ</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Hệ thống Phản ánh kiến nghị</h1>
          <p className="text-red-100 max-w-2xl">
            Tiếp nhận các phản ánh, khiếu nại về thái độ, chất lượng phục vụ của cán bộ hoặc vướng mắc khi thực hiện thủ tục hành chính.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 -mt-8 relative z-10">
        <Card className="p-8 shadow-xl border-t-4 border-t-red-600">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <MessageSquare className="text-red-600" />
                Gửi phản ánh mới
              </h2>
              
              <div className="bg-yellow-50 text-red-700 p-4 rounded-lg mb-6 flex gap-3 text-sm border border-yellow-200">
                <AlertCircle className="flex-shrink-0" size={20} />
                <p>Nội dung phản ánh cần ngôn từ chuẩn mực, cung cấp sự việc trung thực. Những thông tin sai sự thật có thể xem xét xử lý theo quy định.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cơ quan/Cán bộ bị phản ánh (Tiêu đề) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Vd: Phản ánh về thủ tục cấp giấy khai sinh..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lĩnh vực phản ánh <span className="text-red-500">*</span></label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition bg-white"
                  >
                    <option value="Thái độ phục vụ">Thái độ phục vụ của cán bộ</option>
                    <option value="Hồ sơ trễ hẹn">Hồ sơ giải quyết trễ hạn</option>
                    <option value="Lỗi hệ thống">Lỗi hệ thống Cổng dịch vụ công</option>
                    <option value="Khác">Góp ý khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung chi tiết <span className="text-red-500">*</span></label>
                  <textarea
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Mô tả cụ thể sự việc, thời gian, địa điểm..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đính kèm bằng chứng (Không bắt buộc)</label>
                  <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center hover:bg-gray-50 transition cursor-pointer">
                    <FileText className="mx-auto text-gray-400 mb-2" size={24} />
                    <span className="text-sm text-gray-500">Kéo thả hoặc bấm để tải tệp lên (Hình ảnh, Âm thanh, Video)</span>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end gap-3">
                  <Link to="/">
                    <Button type="button" variant="outline" className="px-6">Hủy</Button>
                  </Link>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-8 flex items-center gap-2">
                    <Send size={18} />
                    Gửi phản ánh
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-500" size={48} />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Gửi kiến nghị thành công!</h2>
              <p className="text-gray-600 mb-2">Hệ thống đã ghi nhận mã phản ánh: <strong className="text-black">PA2026-9912</strong></p>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">Chúng tôi sẽ xác minh và phản hồi kết quả giải quyết phản ánh vào số điện thoại hoặc email đăng ký của bạn chậm nhất trong vòng 5 ngày làm việc.</p>
              <Link to="/">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8">Quay lại Trang chủ</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
