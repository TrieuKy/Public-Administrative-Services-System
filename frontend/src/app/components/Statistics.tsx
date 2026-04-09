import { TrendingUp, Users, FileCheck, Award } from 'lucide-react';

export function Statistics() {
  const stats = [
    {
      icon: FileCheck,
      number: '1,234',
      label: 'Dịch vụ công trực tuyến',
      description: 'Đang hoạt động',
      color: 'bg-red-700'
    },
    {
      icon: Users,
      number: '2.5M+',
      label: 'Người dùng đăng ký',
      description: 'Tài khoản định danh điện tử',
      color: 'bg-amber-600'
    },
    {
      icon: TrendingUp,
      number: '567,890',
      label: 'Hồ sơ đã xử lý',
      description: 'Trong tháng này',
      color: 'bg-orange-600'
    },
    {
      icon: Award,
      number: '98.5%',
      label: 'Hài lòng dịch vụ',
      description: 'Khảo sát người dùng',
      color: 'bg-red-800'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-gradient-to-br from-red-800 via-red-700 to-orange-700 rounded-2xl p-8 md:p-12 text-white shadow-xl">
        <div className="text-center mb-12">
          <h2 className="text-white mb-2">Thống kê hoạt động</h2>
          <p className="text-orange-100">Dữ liệu cập nhật đến tháng 04/2026</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div className="text-3xl mb-2">{stat.number}</div>
                <div className="text-lg mb-1">{stat.label}</div>
                <div className="text-sm text-orange-100">{stat.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
