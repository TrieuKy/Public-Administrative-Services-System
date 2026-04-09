import { FileText, Building2, Users, CreditCard, Car, Home, Briefcase, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from './ui/card';

export function PopularServices() {
  const services = [
    {
      icon: FileText,
      title: 'Đăng ký hộ tịch',
      description: 'Khai sinh, kết hôn, ly hôn, khai tử',
      count: '18 dịch vụ',
      color: 'bg-red-700'
    },
    {
      icon: Users,
      title: 'Quản lý dân cư',
      description: 'Đăng ký tạm trú, tạm vắng, thường trú',
      count: '12 dịch vụ',
      color: 'bg-amber-600'
    },
    {
      icon: FileText,
      title: 'Chứng thực',
      description: 'Chứng thực chữ ký, bản sao giấy tờ',
      count: '8 dịch vụ',
      color: 'bg-orange-600'
    },
    {
      icon: Home,
      title: 'Xây dựng - Đất đai',
      description: 'Giấy phép xây dựng nhà ở, xác nhận đất',
      count: '15 dịch vụ',
      color: 'bg-red-600'
    },
    {
      icon: CreditCard,
      title: 'Trợ cấp xã hội',
      description: 'Hộ nghèo, ưu đãi người có công',
      count: '10 dịch vụ',
      color: 'bg-amber-700'
    },
    {
      icon: Heart,
      title: 'Y tế - Sức khỏe',
      description: 'Xác nhận sức khỏe, sổ sức khỏe',
      count: '6 dịch vụ',
      color: 'bg-orange-700'
    },
    {
      icon: Building2,
      title: 'Văn hóa - Xã hội',
      description: 'Giấy phép lễ hội, sinh hoạt cộng đồng',
      count: '9 dịch vụ',
      color: 'bg-red-800'
    },
    {
      icon: Briefcase,
      title: 'Dịch vụ khác',
      description: 'Giấy giới thiệu, xác nhận, công chứng',
      count: '7 dịch vụ',
      color: 'bg-amber-800'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <h2 className="mb-2 text-red-800">Dịch vụ công phổ biến</h2>
        <p className="text-gray-600">Các dịch vụ được người dân và doanh nghiệp quan tâm nhiều nhất</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <Link to="/service-form" key={index}>
              <Card
                className="p-4 hover:shadow-xl transition-all cursor-pointer group border-2 hover:border-amber-500"
              >
                <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="mb-2 group-hover:text-red-700 transition text-base">{service.title}</h3>
                <p className="text-sm text-gray-600 mb-2 leading-relaxed">{service.description}</p>
                <div className="text-xs text-amber-600 font-medium">{service.count}</div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}