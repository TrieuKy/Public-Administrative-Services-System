import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

export function ServiceCategories() {
  const categories = [
    {
      value: 'individual',
      label: 'Công dân',
      services: [
        {
          title: 'Đăng ký khai sinh',
          agency: 'Ủy ban nhân dân cấp xã',
          time: '3 ngày làm việc',
          level: 'Mức độ 4',
          fee: 'Miễn phí'
        },
        {
          title: 'Đăng ký kết hôn',
          agency: 'Ủy ban nhân dân cấp xã',
          time: '1 ngày làm việc',
          level: 'Mức độ 4',
          fee: 'Miễn phí'
        },
        {
          title: 'Đăng ký khai tử',
          agency: 'Ủy ban nhân dân cấp xã',
          time: '2 ngày làm việc',
          level: 'Mức độ 4',
          fee: 'Miễn phí'
        },
        {
          title: 'Đăng ký tạm trú',
          agency: 'Công an cấp xã',
          time: '2 ngày làm việc',
          level: 'Mức độ 4',
          fee: 'Miễn phí'
        },
        {
          title: 'Đăng ký tạm vắng',
          agency: 'Công an cấp xã',
          time: '1 ngày làm việc',
          level: 'Mức độ 4',
          fee: 'Miễn phí'
        },
        {
          title: 'Chứng thực bản sao',
          agency: 'Ủy ban nhân dân cấp xã',
          time: 'Trong ngày',
          level: 'Mức độ 4',
          fee: '5.000 VNĐ/trang'
        },
        {
          title: 'Chứng thực chữ ký',
          agency: 'Ủy ban nhân dân cấp xã',
          time: 'Trong ngày',
          level: 'Mức độ 4',
          fee: '10.000 VNĐ'
        },
        {
          title: 'Giấy phép xây dựng nhà ở',
          agency: 'Ủy ban nhân dân cấp xã',
          time: '7 ngày làm việc',
          level: 'Mức độ 3',
          fee: '50.000 VNĐ'
        }
      ]
    },
    {
      value: 'business',
      label: 'Hộ kinh doanh',
      services: [
        {
          title: 'Đăng ký hộ kinh doanh',
          agency: 'Ủy ban nhân dân cấp xã',
          time: '3 ngày làm việc',
          level: 'Mức độ 3',
          fee: '50.000 VNĐ'
        },
        {
          title: 'Thay đổi nội dung hộ kinh doanh',
          agency: 'Ủy ban nhân dân cấp xã',
          time: '2 ngày làm việc',
          level: 'Mức độ 3',
          fee: '30.000 VNĐ'
        },
        {
          title: 'Tạm ngừng kinh doanh',
          agency: 'Ủy ban nhân dân cấp xã',
          time: '1 ngày làm việc',
          level: 'Mức độ 4',
          fee: 'Miễn phí'
        },
        {
          title: 'Chấm dứt hoạt động hộ kinh doanh',
          agency: 'Ủy ban nhân dân cấp xã',
          time: '1 ngày làm việc',
          level: 'Mức độ 4',
          fee: 'Miễn phí'
        }
      ]
    },
    {
      value: 'organization',
      label: 'Tổ chức',
      services: [
        {
          title: 'Giấy phép tổ chức lễ hội',
          agency: 'Ủy ban nhân dân cấp xã',
          time: '5 ngày làm việc',
          level: 'Mức độ 3',
          fee: '100.000 VNĐ'
        },
        {
          title: 'Giấy phép hoạt động văn hóa cộng đồng',
          agency: 'Ủy ban nhân dân cấp xã',
          time: '3 ngày làm việc',
          level: 'Mức độ 3',
          fee: '50.000 VNĐ'
        },
        {
          title: 'Đăng ký hoạt động tôn giáo',
          agency: 'Ủy ban nhân dân cấp xã',
          time: '7 ngày làm việc',
          level: 'Mức độ 3',
          fee: 'Miễn phí'
        },
        {
          title: 'Xác nhận hộ nghèo/hộ cận nghèo',
          agency: 'Ủy ban nhân dân cấp xã',
          time: '5 ngày làm việc',
          level: 'Mức độ 3',
          fee: 'Miễn phí'
        }
      ]
    }
  ];

  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="mb-2 text-red-800">Danh mục dịch vụ công</h2>
          <p className="text-gray-600">Tra cứu và thực hiện thủ tục hành chính trực tuyến</p>
        </div>

        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 h-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category.value}
                value={category.value}
                className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-700 data-[state=active]:to-red-800 data-[state=active]:text-white"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.value} value={category.value}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.services.map((service, index) => (
                  <Card key={index} className="p-5 hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="flex-1 group-hover:text-red-700 transition">{service.title}</h3>
                      <ArrowRight size={20} className="text-gray-400 group-hover:text-red-700 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Cơ quan:</span>
                        <span>{service.agency}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Thời gian:</span>
                        <span>{service.time}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">Cấp độ:</span>
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            <CheckCircle size={12} className="mr-1" />
                            {service.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">Phí:</span>
                          <span className="text-amber-700 font-medium">{service.fee}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button variant="outline" className="border-red-700 text-red-700 hover:bg-red-50">
                  Xem tất cả dịch vụ {category.label.toLowerCase()}
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}