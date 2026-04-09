# Cấu trúc Frontend Dịch vụ Công (React.js & Vite) 🎨

Giao diện Web cung cấp trải nghiệm thao tác người dùng hiện đại, tách lẻ từng Component độc lập thay thế cho cơ chế MVC cũ rích. Hệ thống sử dụng Vite làm mồi khởi chạy dự án thần tốc.

## 📂 Tổ chức mã nguồn (Folder Structure)

```
frontend/
├── public/              # File tĩnh (Favicon, Logo, Dummy Images...)
├── src/
│   ├── app/
│   │   ├── components/  # Các thẻ độc lập chạy toàn hệ thống (Widgets)
│   │   │   ├── pages/   # Chứa các màn hình khổng lồ (ProfilePage, OfficerDashboard, Payment)
│   │   │   ├── ui/      # Chứa Button, Card rút gọn UI
│   │   │   ├── Header.tsx / Footer.tsx / ChatbotButton.tsx...
│   │   ├── App.tsx      # Tổ chức Routing Điều hướng `<BrowserRouter>`
│   ├── styles/          # File css quy chuẩn (Tailwind layers, Index)
│   ├── utils/           
│   │   ├── axiosInstance.ts # Setup sẵn cấu hình HTTP Request chung cho API. Tự đính kèm config JWT Bearer vào mỗi Header request lên BE.
│   ├── main.tsx         # File cội nguồn Render Virtual DOM
├── tailwind.config.js   # Module tuỳ biến kích thước, màu sắc Tailwind
├── vite.config.ts       # Option đóng gói Vite, Config PostCSS
```

## 🎨 Design System
- **Tone màu:** Bắt chước theo UI của hệ thống DVC Quốc Gia thật: Theme chữ Blue 600 (Công an), Red 700 (Thống đốc), Orange/Yellow (Cảnh báo).
- **Responsive:** Dàn sẵn Layout Mobile-first bằng các class tiện ích như `md:grid-cols-2`, `hidden lg:flex`.
- Các Card dịch vụ cho Cán bộ / OCR được thiết kế bo góc với Shadow cực mạnh để làm bật nút Tương tác Action cho người lớn tuổi.

## 🚀 Khởi Chạy
Sau khi tải hoặc Clone, việc của bạn chỉ là:
```bash
npm install     # Tải cục dependencies vài trăm MB
npm run dev     # Hiện Link Vite http://localhost:5173 để coi kết quả
```
