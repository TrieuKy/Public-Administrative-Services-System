<div align="center">

# 🏛️ Hệ Thống Dịch Vụ Hành Chính Công Trực Tuyến

### Cổng dịch vụ công cấp Phường / Xã — Đồ án cơ sở HUTECH

<br/>

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js_22-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## 📖 Giới Thiệu

Hệ thống là một ứng dụng Web **Full-Stack** giải quyết bài toán số hóa quy trình quản lý hồ sơ hành chính cấp địa phương. Hệ thống phục vụ hai nhóm người dùng:

- **Công dân:** Đăng ký, nộp hồ sơ, thanh toán lệ phí và theo dõi kết quả trực tuyến.
- **Cán bộ:** Tiếp nhận, phân loại, duyệt / từ chối / yêu cầu bổ sung hồ sơ qua bảng điều khiển chuyên biệt.

---

## ✨ Tính Năng Nổi Bật

### 🧑‍💼 Dành cho Công dân
| Tính năng | Mô tả |
|-----------|-------|
| 🔑 Đăng ký / Đăng nhập | Xác thực bằng JWT, kiểm tra email & CCCD |
| 🪪 OCR Quét CCCD | Giả lập đọc thẻ 2 mặt, tự điền thông tin cá nhân |
| 📄 Nộp hồ sơ trực tuyến | Nhiều loại dịch vụ: Hộ tịch, Cư trú, CCCD... |
| 📎 Tải tài liệu đính kèm | Upload file PDF, JPG, PNG |
| 💳 Thanh toán lệ phí | Mô phỏng cổng thanh toán nội địa với biên lai |
| 🔍 Tra cứu hồ sơ | Theo dõi tiến trình xử lý theo mã hồ sơ |
| ⭐ Đánh giá chất lượng | Khảo sát 1–5 sao sau khi hồ sơ hoàn thành |
| 🤖 Chatbot tư vấn | Trợ lý ảo hướng dẫn thủ tục hành chính |
| 👤 Trang cá nhân | Quản lý thông tin, lịch sử giao dịch |

### 👮 Dành cho Cán bộ
| Tính năng | Mô tả |
|-----------|-------|
| 📊 Dashboard thống kê | Tổng hợp hồ sơ theo trạng thái, biểu đồ real-time |
| 📋 Quản lý hồ sơ | Lọc, tìm kiếm, phân trang toàn bộ hồ sơ |
| 🔄 5 trạng thái xử lý | Chờ → Đang xử lý → Hoàn thành / Từ chối / Cần bổ sung |
| 👁️ Xem tài liệu | Kiểm duyệt file đính kèm của công dân |
| 📝 Ghi chú nội bộ | Comment nội bộ giữa các cán bộ |
| 🗓️ Lịch làm việc | Quản lý lịch cá nhân (schedule) |
| ⭐ Xem đánh giá | Dashboard báo cáo chất lượng dịch vụ |

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
| Công nghệ | Phiên bản | Vai trò |
|-----------|-----------|---------|
| React | 19.x | UI Framework |
| TypeScript | 5.x | Type Safety |
| Vite | 6.x | Build Tool |
| Tailwind CSS | 3.x | Styling |
| React Router | 7.x | Client-side Routing |
| Axios | 1.x | HTTP Client |
| Lucide React | — | Icon Library |

### Backend
| Công nghệ | Phiên bản | Vai trò |
|-----------|-----------|---------|
| Node.js | 22.x | Runtime |
| Express.js | 5.x | Web Framework |
| PostgreSQL | 18.x | Database |
| Sequelize | 6.x | ORM |
| JSON Web Token | 9.x | Authentication |
| bcrypt | 6.x | Password Hashing |
| Multer | 2.x | File Upload |
| Nodemailer | 8.x | Email Service |
| Helmet | 8.x | Security Headers |

---

## 📁 Cấu Trúc Thư Mục

```
WebsiteProject/
├── 📄 .env                        # Biến môi trường toàn dự án
├── 📄 hanh_chinh_cong.sql         # Bản dump CSDL PostgreSQL (schema + data mẫu)
│
├── 📂 backend/
│   ├── server.js                  # Entry point, khởi động Express server
│   ├── 📂 src/
│   │   ├── 📂 config/             # Cấu hình database (Sequelize)
│   │   ├── 📂 controllers/        # Xử lý logic từng API route
│   │   ├── 📂 middlewares/        # Auth, error handler, upload
│   │   ├── 📂 models/             # Định nghĩa Sequelize models
│   │   ├── 📂 routes/             # Khai báo API endpoints
│   │   ├── 📂 services/           # Business logic tầng service
│   │   └── 📂 utils/              # Helper functions
│   ├── 📂 scripts/                # Seed data, reset DB, verify user
│   └── 📂 uploads/                # File upload của công dân (local)
│
└── 📂 frontend/
    ├── 📂 public/                 # Static assets (logo, favicon)
    └── 📂 src/
        ├── 📂 app/
        │   ├── App.tsx            # Routing chính (<BrowserRouter>)
        │   └── 📂 components/
        │       ├── 📂 pages/      # Các trang lớn (Profile, Dashboard, Payment...)
        │       └── 📂 ui/         # Các component tái sử dụng (Button, Card...)
        ├── 📂 styles/             # CSS global, Tailwind config
        └── 📂 utils/
            └── axiosInstance.ts   # HTTP client có gắn JWT Bearer token
```

---

## 🗄️ Cơ Sở Dữ Liệu

### Thông tin kết nối (file `.env`)
```env
DB_HOST     = localhost
DB_PORT     = 5000          # Port PostgreSQL của pgAdmin
DB_NAME     = hanh_chinh_cong
DB_USER     = postgres
DB_PASSWORD = 123
```

### Sơ đồ các bảng chính

```
users ──────────────┬── applications ──┬── documents
  │                 │        │          └── comments
  │ (officer)       │        └── application_histories
  │                 │
  └── schedules     └── notifications
                    
services ───────────── applications
ai_logs ────────────── applications
audit_logs
```

### Các bảng trong CSDL
| Bảng | Mô tả |
|------|-------|
| `users` | Người dùng (citizen / officer / admin) |
| `services` | Danh mục dịch vụ hành chính |
| `applications` | Hồ sơ nộp bởi công dân |
| `documents` | Tài liệu đính kèm hồ sơ |
| `application_histories` | Lịch sử xử lý từng hồ sơ |
| `notifications` | Thông báo cho người dùng |
| `comments` | Ghi chú nội bộ cán bộ |
| `schedules` | Lịch làm việc cán bộ |
| `ai_logs` | Log phân tích OCR / AI |
| `audit_logs` | Nhật ký thao tác hệ thống |

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy

### ✅ Yêu cầu hệ thống
- **Node.js** v18 trở lên
- **PostgreSQL** (đã cài pgAdmin, đang chạy trên port `5000`)
- **npm** hoặc **yarn**

---

### Bước 1 — Tạo Database trong pgAdmin

1. Mở **pgAdmin 4** → kết nối server PostgreSQL (port `5000`)
2. Click chuột phải vào **Databases** → **Create → Database**
3. Đặt tên: `hanh_chinh_cong` → **Save**

---

### Bước 2 — Import CSDL (Schema + Dữ liệu mẫu)

1. Click chuột phải vào database `hanh_chinh_cong` → **Query Tool**
2. Click icon **Open File** (📂) → chọn file `hanh_chinh_cong.sql` trong thư mục gốc dự án
3. Nhấn **F5** để chạy toàn bộ script
4. Chờ xuất hiện: `Query returned successfully`

> **Kiểm tra nhanh** bằng query sau trong Query Tool:
> ```sql
> SELECT table_name FROM information_schema.tables
> WHERE table_schema = 'public';
> ```
> Phải thấy 10 bảng: `users`, `services`, `applications`, `documents`, `notifications`, `comments`, `application_histories`, `schedules`, `ai_logs`, `audit_logs`

---

### Bước 3 — Cài đặt Backend

```bash
cd backend
npm install
npm run dev
```

> Server API khởi động tại: **http://localhost:3001**
>
> Nếu kết nối database thành công, terminal hiển thị:
> `✅ Database connected` hoặc `Server running on port 3001`

---

### Bước 4 — Cài đặt Frontend

```bash
cd frontend
npm install
npm run dev
```

> Giao diện mở tại: **http://localhost:5173**

---

### Bước 5 — Đăng nhập thử

Hệ thống đã có sẵn tài khoản mẫu trong CSDL:

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| 🧑 Công dân | `kid14190@gmail.com` | `123456` *(hoặc tự đăng ký mới)* |
| 👮 Cán bộ | `nguyenvanb@bennghe.gov.vn` | `123456` *(hoặc tự tạo)* |

> **Lưu ý:** Password trong file SQL là hash bcrypt — không đọc ngược được.  
> Nếu không đăng nhập được, hãy **tự đăng ký tài khoản mới** qua giao diện web, sau đó chạy lệnh sau trong Query Tool để cấp quyền cán bộ:
> ```sql
> UPDATE users SET role = 'officer' WHERE email = 'your-email@example.com';
> ```

---

## 📧 Xác Thực Email (Email Verification)

Email thật **chưa được cấu hình**. Khi đăng ký tài khoản:

1. Backend sẽ **in ra terminal** một đường link xác thực màu đỏ, dạng:
   ```
   🔗 Verify URL: http://localhost:3001/api/v1/auth/verify?token=xxxxx
   ```
2. **Ctrl + Click** vào link đó trong terminal để kích hoạt tài khoản (tương đương bấm link trong email).
3. Sau khi click, tài khoản sẽ có `isVerified = true` và có thể đăng nhập bình thường.

---

## 💡 Lưu Ý Kỹ Thuật

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| 🪪 OCR Quét CCCD | 🟡 Mock | Giả lập dữ liệu hardcode, UI loading y hệt thật |
| 💳 Thanh toán | 🟡 Mock | Luồng Success được mô phỏng, không cần Sandbox |
| 📧 Email | 🟡 Console Log | Link xác thực in ra terminal thay vì gửi mail |
| 🔐 JWT Auth | 🟢 Thật | Access Token (1h) + Refresh Token (7d) |
| 📁 File Upload | 🟢 Thật | Lưu local tại `backend/uploads/` |
| 🗄️ Database | 🟢 Thật | PostgreSQL với đầy đủ schema, triggers, enums |

---

## 🔑 Biến Môi Trường (`.env`)

File `.env` đặt tại **thư mục gốc dự án** (`WebsiteProject/.env`):

```env
PORT              = 3001
NODE_ENV          = development

# Database PostgreSQL
DB_HOST           = localhost
DB_PORT           = 5000        # Port pgAdmin của bạn
DB_NAME           = hanh_chinh_cong
DB_USER           = postgres
DB_PASSWORD       = 123         # Mật khẩu postgres của bạn

# JWT
JWT_SECRET        = your_jwt_secret_key
JWT_EXPIRES_IN    = 1h
JWT_REFRESH_SECRET = your_jwt_refresh_secret_key
JWT_REFRESH_EXPIRES_IN = 7d

# Email (để trống nếu dùng console log)
EMAIL_HOST        = smtp.example.com
EMAIL_PORT        = 587
EMAIL_USER        =
EMAIL_PASSWORD    =

# Upload
UPLOAD_DIR        = uploads
MAX_FILE_SIZE     = 5242880     # 5MB tính bằng bytes

# Frontend URL (CORS)
CLIENT_URL        = http://localhost:5173
```

---

## 🐛 Xử Lý Lỗi Thường Gặp

| Lỗi | Nguyên nhân | Giải pháp |
|-----|------------|-----------|
| `ECONNREFUSED localhost:5000` | PostgreSQL chưa chạy hoặc sai port | Kiểm tra pgAdmin đang kết nối, xác nhận `DB_PORT=5000` |
| `password authentication failed` | Sai mật khẩu postgres | Cập nhật `DB_PASSWORD` trong `.env` |
| `database "hanh_chinh_cong" does not exist` | Chưa tạo database | Thực hiện Bước 1 |
| `relation does not exist` | Chưa import SQL | Thực hiện Bước 2 |
| `type already exists` khi import | Database đã có dữ liệu cũ | Drop và tạo lại database, import lại |
| `Cannot find module` ở backend | Chưa `npm install` | Chạy `npm install` trong thư mục `backend` |
| Frontend trắng / API lỗi 404 | Backend chưa chạy | Chạy `npm run dev` trong `backend` trước |

---

## 📊 API Endpoints Chính

```
POST   /api/v1/auth/register       # Đăng ký tài khoản
POST   /api/v1/auth/login          # Đăng nhập
GET    /api/v1/auth/me             # Lấy thông tin người dùng hiện tại
PUT    /api/v1/auth/me             # Cập nhật hồ sơ cá nhân

GET    /api/v1/services            # Danh sách dịch vụ (public)
GET    /api/v1/applications        # Hồ sơ của công dân đang đăng nhập
POST   /api/v1/applications        # Nộp hồ sơ mới
GET    /api/v1/applications/:id    # Chi tiết hồ sơ

GET    /api/v1/officer/applications   # Hồ sơ cần xử lý (cán bộ)
PUT    /api/v1/officer/applications/:id/approve  # Duyệt hồ sơ
PUT    /api/v1/officer/applications/:id/reject   # Từ chối hồ sơ

GET    /api/v1/notifications       # Thông báo người dùng
GET    /api/v1/schedules           # Lịch làm việc cán bộ
```

---

<div align="center">

📝 *Dự án Đồ án cơ sở — Sinh viên HUTECH*

</div>
