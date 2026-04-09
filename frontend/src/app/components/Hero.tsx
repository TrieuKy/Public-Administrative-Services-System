import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div
      className="relative bg-gradient-to-r from-orange-200/40 via-orange-100/30 to-orange-200/40 overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(to right, rgba(251, 146, 60, 0.08), rgba(254, 215, 170, 0.05), rgba(251, 146, 60, 0.08))',
        backgroundSize: 'cover'
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30m-20 0a20 20 0 1 0 40 0a20 20 0 1 0 -40 0' fill='%23B91C1C' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Nhập từ khóa tìm kiếm"
              className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 rounded shadow-sm transition whitespace-nowrap">
              Tìm kiếm nâng cao
            </button>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <Link to="/service-form">
            <button className="w-full px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 rounded-lg shadow-md transition">
              Dịch vụ công trực tuyến
            </button>
          </Link>
          <Link to="/tracking">
            <button className="w-full px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 rounded-lg shadow-md transition">
              Tra cứu hồ sơ
            </button>
          </Link>
          <button className="px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 rounded-lg shadow-md transition">
            Dịch vụ công liên thông: Khai sinh, Khai tử
          </button>
        </div>
      </div>
    </div>
  );
}