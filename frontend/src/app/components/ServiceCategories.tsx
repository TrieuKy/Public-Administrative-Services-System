import { Card } from './ui/card';
import { ArrowRight, CheckCircle, Clock, Building2, Banknote } from 'lucide-react';
import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

interface Service {
  id: string;
  name: string;
  category: 'individual' | 'business' | 'organization';
  agency: string;
  processingTime: string;
  level: string;
  fee: string;
  requiredDocs: string[];
}

const CATEGORY_CONFIG = [
  { value: 'individual',   label: 'Công dân' },
  { value: 'business',     label: 'Hộ kinh doanh' },
  { value: 'organization', label: 'Tổ chức' },
];

const LEVEL_COLOR: Record<string, string> = {
  'Mức độ 4': 'bg-green-100 text-green-700',
  'Mức độ 3': 'bg-blue-100 text-blue-700',
  'Mức độ 2': 'bg-orange-100 text-orange-700',
  'Mức độ 1': 'bg-gray-100 text-gray-600',
};

export function ServiceCategories() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('individual');

  useEffect(() => {
    axiosInstance.get('/services?limit=100')
      .then(res => setServices(res.data?.data?.services || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = services.filter(s => s.category === activeTab);

  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="mb-2 text-red-800">Danh mục dịch vụ công</h2>
          <p className="text-gray-600">Tra cứu và thực hiện thủ tục hành chính trực tuyến</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex w-full max-w-md mx-auto mb-8 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
          {CATEGORY_CONFIG.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveTab(cat.value)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === cat.value
                  ? 'bg-gradient-to-r from-red-700 to-red-800 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white animate-pulse rounded-xl h-28" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Chưa có dịch vụ nào trong danh mục này.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((service) => (
                <Card
                  key={service.id}
                  className="p-5 hover:shadow-lg transition-all duration-200 cursor-pointer group bg-white border border-gray-200 hover:border-red-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="flex-1 text-sm font-semibold text-gray-900 group-hover:text-red-700 transition leading-snug pr-2">
                      {service.name}
                    </h3>
                    <ArrowRight
                      size={18}
                      className="text-gray-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Building2 size={12} className="text-gray-400 flex-shrink-0" />
                      <span>{service.agency}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-gray-400 flex-shrink-0" />
                      <span>{service.processingTime}</span>
                    </div>
                    <div className="flex items-center gap-3 pt-0.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${LEVEL_COLOR[service.level] || 'bg-gray-100 text-gray-600'}`}>
                        <CheckCircle size={10} />
                        {service.level}
                      </span>
                      <div className="flex items-center gap-1">
                        <Banknote size={12} className="text-amber-600" />
                        <span className="text-amber-700 font-medium">{service.fee}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="border border-red-700 text-red-700 hover:bg-red-50 px-6 py-2 rounded-lg text-sm font-medium transition">
                Xem tất cả dịch vụ {CATEGORY_CONFIG.find(c => c.value === activeTab)?.label.toLowerCase()}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}