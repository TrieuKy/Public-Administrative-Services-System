<div align="center">

# 🏛️ Hệ Thống Dịch Vụ Hành Chính Công Trực Tuyến

### Cổng dịch vụ công cấp Phường / Xã — Đồ án cơ sở HUTECH

<br/>

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js_22-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

</div>

---

## 📖 Giới Thiệu

Hệ thống Web **Full-Stack** số hóa quy trình quản lý hồ sơ hành chính cấp địa phương, tích hợp AI (Gemini Vision) để OCR quét CCCD, phân tích tài liệu và chatbot tư vấn tự động.

**2 nhóm người dùng:**
- 🧑 **Công dân:** Nộp hồ sơ, thanh toán lệ phí, tra cứu kết quả
- 👮 **Cán bộ:** Tiếp nhận, duyệt hồ sơ với hỗ trợ phân tích AI

---

## ✨ Tính Năng Chính

| Tính năng | Mô tả |
|-----------|-------|
| 🪪 OCR Quét CCCD | Upload 2 mặt CCCD, AI tự đọc và điền form |
| 📄 Nộp hồ sơ | Upload giấy tờ, AI kiểm tra độ hợp lệ |
| 🤖 AI Phân tích | Gemini Vision chấm điểm tin cậy từng tài liệu |
| 💳 Thanh toán | Mô phỏng thanh toán với biên lai |
| 🔍 Tra cứu hồ sơ | Theo dõi tiến trình theo mã hồ sơ |
| 📊 Dashboard cán bộ | Thống kê, duyệt/từ chối/yêu cầu bổ sung |
| 🤖 Chatbot | Trợ lý ảo hướng dẫn thủ tục hành chính |
| 📧 Xác thực Email | Gửi link xác thực khi đăng ký |

---

## 🛠️ Công Nghệ

| Lớp | Công nghệ |
|-----|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| **Backend** | Node.js, Express.js 5, Sequelize ORM |
| **Database** | PostgreSQL |
| **AI** | Google Gemini 2.5 Flash (OCR + Vision + Chatbot) |
| **Auth** | JWT (Access Token 1h + Refresh Token 7d) |
| **Upload** | Multer (local storage) |

---

## 📁 Cấu Trúc Thư Mục

```
WebsiteProject/
├── .gitignore
├── hanh_chinh_cong.sql        ← File SQL để import database
│
├── backend/
│   ├── .env                   ← Cấu hình backend (TỰ TẠO - xem bên dưới)
│   ├── server.js              ← Entry point
│   ├── scripts/
│   │   ├── seedData.js        ← Tạo dữ liệu mẫu (services, hồ sơ...)
│   │   ├── seedOfficer.js     ← Tạo tài khoản cán bộ mẫu
│   │   └── reset.js           ← Reset toàn bộ database
│   ├── src/
│   │   ├── config/            ← Kết nối database
│   │   ├── controllers/       ← Logic xử lý API
│   │   ├── middlewares/       ← Auth, upload, error handler
│   │   ├── models/            ← Sequelize models (User, Application...)
│   │   ├── routes/            ← Khai báo API endpoints
│   │   ├── services/          ← AI service (Gemini), Email service
│   │   └── utils/
│   └── uploads/               ← File upload của công dân (không up git)
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── App.tsx         ← Router chính
    │   │   └── components/
    │   │       ├── pages/      ← ProfilePage, OfficerApplications...
    │   │       └── ui/         ← Button, Card...
    │   ├── context/            ← AuthContext
    │   └── utils/
    │       └── axiosInstance.ts ← HTTP client với JWT
    └── public/
        └── logo.png
```

---

## ⚙️ Yêu Cầu Hệ Thống

Trước khi cài đặt, hãy chắc chắn máy tính đã có:

| Phần mềm | Phiên bản | Kiểm tra |
|----------|-----------|----------|
| **Node.js** | ≥ 18.x | `node --version` |
| **npm** | ≥ 9.x | `npm --version` |
| **PostgreSQL** | ≥ 14.x | Kiểm tra trong pgAdmin |
| **pgAdmin 4** | Bất kỳ | Mở được giao diện web |
| **Git** | Bất kỳ | `git --version` |

> 💡 **Tải Node.js:** https://nodejs.org (chọn bản LTS)  
> 💡 **Tải PostgreSQL + pgAdmin:** https://www.postgresql.org/download/

---

## 🚀 Hướng Dẫn Cài Đặt Chi Tiết

### BƯỚC 0 — Clone dự án về máy

Mở Terminal (Command Prompt / PowerShell) và chạy:

```bash
git clone https://github.com/TrieuKy/Public-Administrative-Services-System.git
cd Public-Administrative-Services-System
```

---

### BƯỚC 1 — Cài đặt & Cấu hình PostgreSQL

#### 1.1 Mở pgAdmin 4

- Mở pgAdmin 4 từ Start Menu
- Đăng nhập bằng **Master Password** (bạn tự đặt lúc cài)
- Ở cột trái: click vào **Servers** → tên server của bạn (thường là `PostgreSQL 16` hoặc `localhost`)

#### 1.2 Xác nhận port PostgreSQL

> ⚠️ **Quan trọng:** PostgreSQL mặc định chạy trên port **5432**, nhưng dự án này cấu hình port **5000**. Cần kiểm tra port thực tế của bạn.

**Cách kiểm tra port:**
- Trong pgAdmin → click phải vào tên server → **Properties**
- Tab **Connection** → xem **Port** là bao nhiêu
- Ghi nhớ port đó để điền vào `.env`

#### 1.3 Tạo Database mới

1. Trong pgAdmin, click phải vào **Databases** (dưới tên server)
2. Chọn **Create → Database...**
3. Ở tab **General**, điền:
   - **Database:** `hanh_chinh_cong`
4. Nhấn **Save**

Bạn sẽ thấy database `hanh_chinh_cong` xuất hiện trong danh sách.

#### 1.4 Import file SQL (Schema + Dữ liệu mẫu)

**Cách 1 — Qua pgAdmin Query Tool (khuyến nghị):**

1. Click vào database `hanh_chinh_cong` (để chọn nó)
2. Trên thanh menu → **Tools → Query Tool**
3. Cửa sổ Query Tool mở ra → click icon **📂 Open File** (hoặc `Ctrl+O`)
4. Tìm và chọn file `hanh_chinh_cong.sql` trong thư mục dự án vừa clone
5. Nhấn **▶ Execute / Refresh** (hoặc phím `F5`)
6. Chờ đến khi thấy: `Query returned successfully`

**Cách 2 — Qua Command Line (nhanh hơn):**

```bash
# Thay YOUR_PASSWORD bằng mật khẩu postgres của bạn
# Thay 5432 bằng port PostgreSQL thực tế của bạn
psql -U postgres -p 5432 -d hanh_chinh_cong -f hanh_chinh_cong.sql
```

**Kiểm tra import thành công:**

Chạy query này trong Query Tool:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Phải thấy các bảng: `ai_logs`, `application_histories`, `applications`, `audit_logs`, `comments`, `documents`, `notifications`, `payments`, `posts`, `schedules`, `services`, `users`

---

### BƯỚC 2 — Cấu hình Backend

#### 2.1 Tạo file `.env` cho backend

Trong thư mục `backend/`, tạo file tên `.env` (không có phần mở rộng khác):

```bash
# Mở thư mục backend
cd backend
```

Tạo file `backend/.env` với nội dung sau (chỉnh sửa theo máy bạn):

```env
PORT = 3001
NODE_ENV = development

# ── Database PostgreSQL ────────────────────────────────
DB_HOST     = localhost
DB_PORT     = 5432          # ← SỬA: port PostgreSQL thực tế của bạn (5432 hoặc 5000)
DB_NAME     = hanh_chinh_cong
DB_USER     = postgres
DB_PASSWORD = 123           # ← SỬA: mật khẩu postgres của bạn

# ── JWT Authentication ─────────────────────────────────
JWT_SECRET              = super_secret_key_change_this_in_production
JWT_EXPIRES_IN          = 1h
JWT_REFRESH_SECRET      = refresh_super_secret_key_change_this
JWT_REFRESH_EXPIRES_IN  = 7d

# ── Email (để trống = in ra console, không gửi mail thật) ──
EMAIL_HOST     = smtp.gmail.com
EMAIL_PORT     = 587
EMAIL_USER     =
EMAIL_PASSWORD =

# ── Gemini AI (OCR CCCD, Chatbot, Phân tích tài liệu) ──
# Lấy key MIỄN PHÍ tại: https://aistudio.google.com/app/apikey
GEMINI_API_KEY = AIza...key_của_bạn...

# ── Upload ─────────────────────────────────────────────
UPLOAD_DIR    = uploads
MAX_FILE_SIZE = 5242880     # 5MB

# ── CORS ───────────────────────────────────────────────
CLIENT_URL = http://localhost:5173
```

> ⚠️ **Bắt buộc thay đổi:**
> - `DB_PORT` — xem lại từ Bước 1.2
> - `DB_PASSWORD` — mật khẩu postgres khi cài đặt
> - `GEMINI_API_KEY` — xem Bước 2.2

#### 2.2 Lấy Gemini API Key (Miễn Phí)

1. Truy cập: **https://aistudio.google.com/app/apikey**
2. Đăng nhập bằng Google Account
3. Nhấn **"Create API Key"**
4. Chọn project (hoặc tạo mới)
5. Copy key dạng `AIzaSy...`
6. Dán vào `GEMINI_API_KEY` trong file `.env`

> 💡 **Free tier:** 15 requests/phút, 1.500 requests/ngày — Đủ dùng cho demo  
> 💡 **Không cần thẻ ngân hàng**

#### 2.3 Cài đặt dependencies và chạy

```bash
# Đảm bảo bạn đang ở trong thư mục backend/
cd backend

# Cài đặt tất cả packages
npm install

# Chạy backend (development mode với nodemon + OCR server)
npm run dev:all
```

**Output thành công trông như sau:**
```
[0] Server running on port 3001
[0] ✅ Database connected successfully
[1] OCR Service running on port 5050
```

> ❌ **Nếu thấy lỗi kết nối database:** Kiểm tra lại `DB_PORT` và `DB_PASSWORD` trong `.env`

---

### BƯỚC 3 — Tạo Dữ liệu Mẫu (Seed)

Mở thêm một terminal mới, chạy trong thư mục `backend/`:

```bash
# Tạo tài khoản cán bộ mẫu (Nguyễn Văn B)
node scripts/seedOfficer.js

# Tạo dữ liệu dịch vụ và hồ sơ mẫu
node scripts/seedData.js
```

**Nếu muốn reset toàn bộ database về ban đầu:**
```bash
node scripts/reset.js
```

---

### BƯỚC 4 — Cấu hình và Chạy Frontend

Mở terminal mới (để terminal backend vẫn chạy), chạy:

```bash
# Vào thư mục frontend
cd frontend

# Cài đặt packages
npm install

# Chạy frontend
npm run dev
```

**Output thành công:**
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Mở trình duyệt và truy cập: **http://localhost:5173**

---

### BƯỚC 5 — Đăng ký & Đăng nhập

#### Đăng ký tài khoản Công dân mới:

1. Vào **http://localhost:5173/register**
2. Điền thông tin và đăng ký
3. Sau khi đăng ký, nhìn vào **terminal của backend**, sẽ thấy:
   ```
   🔗 Verify URL: http://localhost:3001/api/v1/auth/verify?token=xxxxx
   ```
4. **Ctrl + Click** vào link đó trong terminal để xác thực email
5. Quay lại trang web và đăng nhập

#### Tài khoản Cán bộ mẫu (sau khi chạy seedOfficer.js):

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| 👮 Cán bộ | `nguyenvanb@bennghe.gov.vn` | `123456` |

#### Cấp quyền Cán bộ cho tài khoản của bạn:

Nếu muốn tài khoản vừa đăng ký có quyền cán bộ, chạy query trong pgAdmin:

```sql
UPDATE users SET role = 'officer', "isVerified" = true
WHERE email = 'email-của-bạn@example.com';
```

---

## 🗄️ Sơ Đồ Database

```
users ──────────────┬── applications ──┬── documents
                    │        │          ├── comments
                    │        │          └── application_histories
                    │        │
                    │        └── payments
                    │
                    └── schedules

services ───────────── applications
ai_logs ────────────── applications
posts
audit_logs
```

### Mô tả các bảng

| Bảng | Mô tả |
|------|-------|
| `users` | Người dùng: citizen / officer / admin |
| `services` | Danh mục dịch vụ hành chính (khai sinh, kết hôn...) |
| `applications` | Hồ sơ nộp bởi công dân |
| `documents` | File đính kèm của từng hồ sơ |
| `application_histories` | Lịch sử luân chuyển hồ sơ |
| `comments` | Ghi chú nội bộ giữa cán bộ |
| `payments` | Lịch sử thanh toán lệ phí |
| `notifications` | Thông báo cho người dùng |
| `schedules` | Lịch làm việc cán bộ |
| `ai_logs` | Log phân tích OCR / AI |
| `posts` | Tin tức / thông báo công khai |
| `audit_logs` | Nhật ký thao tác hệ thống |

---

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi Backend

| Lỗi | Nguyên nhân | Giải pháp |
|-----|------------|-----------|
| `ECONNREFUSED localhost:5432` | PostgreSQL chưa chạy hoặc sai port | Mở pgAdmin kiểm tra, sửa `DB_PORT` trong `.env` |
| `password authentication failed` | Sai mật khẩu postgres | Sửa `DB_PASSWORD` trong `.env` |
| `database "hanh_chinh_cong" does not exist` | Chưa tạo database | Thực hiện lại Bước 1.3 |
| `relation "users" does not exist` | Chưa import SQL | Thực hiện lại Bước 1.4 |
| `type already exists` khi import SQL | Database đã có dữ liệu cũ | Drop database, tạo lại, import lại |
| `Cannot find module 'xxx'` | Chưa `npm install` | Chạy `npm install` trong thư mục `backend/` |
| `API key not valid` (Gemini) | Key sai hoặc chưa điền | Xem lại Bước 2.2, lấy key mới |

### Lỗi Frontend

| Lỗi | Nguyên nhân | Giải pháp |
|-----|------------|-----------|
| Trang trắng / API 404 | Backend chưa chạy | Chạy `npm run dev:all` trong `backend/` trước |
| `Network Error` | CORS hoặc backend offline | Kiểm tra terminal backend còn chạy không |
| Không upload được file | Thư mục `uploads/` không tồn tại | Tạo thư mục `backend/uploads/` thủ công |

### Reset Database khi gặp sự cố

```bash
# Trong pgAdmin → Query Tool, chạy:
DROP DATABASE hanh_chinh_cong;
CREATE DATABASE hanh_chinh_cong;

# Sau đó import lại file SQL (Bước 1.4)
# Và chạy lại seed (Bước 3)
```

---

## 📋 Tóm Tắt Lệnh

```bash
# ── Clone ──────────────────────────────────────────────
git clone https://github.com/TrieuKy/Public-Administrative-Services-System.git
cd Public-Administrative-Services-System

# ── Backend ────────────────────────────────────────────
cd backend
npm install
# (tạo file .env trước - xem Bước 2.1)
npm run dev:all              # Chạy cả backend + OCR server

# ── Seed dữ liệu (terminal khác) ───────────────────────
node scripts/seedOfficer.js  # Tạo tài khoản cán bộ
node scripts/seedData.js     # Tạo dữ liệu dịch vụ mẫu

# ── Frontend (terminal khác) ────────────────────────────
cd frontend
npm install
npm run dev
```

**Các port mặc định:**
| Service | URL |
|---------|-----|
| 🖥️ Frontend | http://localhost:5173 |
| 🔌 Backend API | http://localhost:3001 |
| 🤖 OCR Service | http://localhost:5050 |
| 🗄️ PostgreSQL | localhost:5432 (hoặc port của bạn) |

---

## 🔑 Cấu Trúc File `.env` Hoàn Chỉnh

File `backend/.env` — **Bắt buộc tạo thủ công, không có trong git:**

```env
PORT = 3001
NODE_ENV = development

# Database
DB_HOST     = localhost
DB_PORT     = 5432
DB_NAME     = hanh_chinh_cong
DB_USER     = postgres
DB_PASSWORD = your_postgres_password

# JWT
JWT_SECRET             = change_this_to_random_string
JWT_EXPIRES_IN         = 1h
JWT_REFRESH_SECRET     = change_this_too
JWT_REFRESH_EXPIRES_IN = 7d

# Email (để trống để dùng console log)
EMAIL_HOST     =
EMAIL_PORT     = 587
EMAIL_USER     =
EMAIL_PASSWORD =

# AI - Lấy tại https://aistudio.google.com/app/apikey
GEMINI_API_KEY = AIza...

# Upload
UPLOAD_DIR    = uploads
MAX_FILE_SIZE = 5242880
CLIENT_URL    = http://localhost:5173
```

---

## 📊 API Endpoints

```
# Auth
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/verify?token=xxx
GET    /api/v1/auth/me
PUT    /api/v1/auth/me

# Dịch vụ & Hồ sơ (Công dân)
GET    /api/v1/services
POST   /api/v1/applications
GET    /api/v1/applications
GET    /api/v1/applications/:id
POST   /api/v1/applications/:id/documents
POST   /api/v1/applications/:id/submit

# Cán bộ
GET    /api/v1/officer/applications
PATCH  /api/v1/officer/applications/:id/approve
PATCH  /api/v1/officer/applications/:id/reject
PATCH  /api/v1/officer/applications/:id/request-supplement

# AI
POST   /api/v1/ai/chat                      # Chatbot
POST   /api/v1/ai/ocr-cccd-dual             # OCR 2 mặt CCCD
POST   /api/v1/ai/ocr-group                 # OCR nhiều tài liệu
POST   /api/v1/ai/analyze-application/:id   # Phân tích hồ sơ
```

---

<div align="center">

📝 *Đồ án cơ sở — Sinh viên HUTECH*

**Liên hệ:** Tạo [Issue](https://github.com/TrieuKy/Public-Administrative-Services-System/issues) nếu gặp vấn đề khi cài đặt

</div>
