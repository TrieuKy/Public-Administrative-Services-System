# Cổng Dịch vụ công cấp Xã/Phường

Ứng dụng React + TypeScript + Tailwind CSS v4 phục vụ dịch vụ hành chính công trực tuyến cấp xã/phường.

## Tính năng
- Trang chủ với tìm kiếm nhanh, danh mục dịch vụ, tin tức
- Đăng nhập / Đăng ký tài khoản công dân
- Nộp hồ sơ trực tuyến với AI kiểm tra giấy tờ
- Tra cứu hồ sơ theo mã hồ sơ
- Dashboard cán bộ xử lý hồ sơ
- Chatbot hỗ trợ 24/7
- Responsive trên mọi thiết bị

## Công nghệ
- React 18 + TypeScript
- Tailwind CSS v4
- React Router v7
- Lucide React (icons)
- Vite (build tool)

## Cài đặt & Chạy

```bash
npm install
npm run dev
```

## Cấu trúc dự án

```
src/
├── app/
│   ├── App.tsx                    # Entry point, React Router
│   └── components/
│       ├── Header.tsx             # Header + nav
│       ├── Hero.tsx               # Banner tìm kiếm
│       ├── PopularServices.tsx    # Dịch vụ phổ biến
│       ├── ServiceCategories.tsx  # Danh mục dịch vụ (tab)
│       ├── News.tsx               # Tin tức & thông báo
│       ├── Statistics.tsx         # Thống kê
│       ├── QuickSearch.tsx        # Tìm kiếm nhanh
│       ├── Footer.tsx             # Footer
│       ├── ChatbotButton.tsx      # Chatbot 24/7
│       └── pages/
│           ├── LoginPage.tsx
│           ├── RegisterPage.tsx
│           ├── ServiceFormPage.tsx     # Nộp hồ sơ + AI check
│           ├── TrackingPage.tsx        # Tra cứu hồ sơ
│           ├── OfficerDashboard.tsx    # Dashboard cán bộ
│           └── ApplicationDetailModal.tsx
└── styles/
    ├── index.css
    ├── tailwind.css
    └── theme.css
```

## Ghi chú
- Hình ảnh quốc huy VN được import từ assets local. 
  Thay thế bằng file ảnh thực tế (tên: `quoc-huy.png`) và đặt vào `src/assets/`.
- Dữ liệu hiện tại là mock data – tích hợp Supabase hoặc API backend để có dữ liệu thực.

---
Xuất từ Figma Make – 8/4/2026
