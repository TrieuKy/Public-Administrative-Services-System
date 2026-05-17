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
![Claude AI](https://img.shields.io/badge/Claude_AI-D97757?style=for-the-badge&logo=anthropic&logoColor=white)

</div>

---

## 📖 Giới Thiệu

Hệ thống Web **Full-Stack** số hóa quy trình quản lý hồ sơ hành chính cấp địa phương, tích hợp AI tiên tiến (Gemini và Claude) để xử lý OCR quét căn cước công dân (CCCD), phân tích tài liệu tự động và chatbot tư vấn nghiệp vụ cho công dân.

**2 nhóm người dùng:**
- 🧑 **Công dân:** Nộp hồ sơ, thanh toán lệ phí trực tuyến, tra cứu tiến trình và kết quả xử lý hồ sơ.
- 👮 **Cán bộ:** Tiếp nhận, xét duyệt, trả kết quả với sự hỗ trợ phân tích độ tin cậy tài liệu từ AI.

---

## ✨ Tính Năng Chính

| Tính năng | Mô tả |
|-----------|-------|
| 🪪 OCR Quét CCCD | Upload 2 mặt CCCD, AI (Claude) tự động đọc và điền thông tin form |
| 📄 Nộp hồ sơ | Upload giấy tờ, hỗ trợ kiểm tra và nhận diện tài liệu tự động |
| 🤖 AI Phân tích hồ sơ | Phân tích tài liệu, đánh giá độ tin cậy hỗ trợ cán bộ xét duyệt |
| 💳 Thanh toán lệ phí | Mô phỏng cổng thanh toán trực tuyến, xuất biên lai điện tử |
| 🔍 Tra cứu hồ sơ | Theo dõi tiến trình xử lý real-time qua mã số hồ sơ |
| 📊 Dashboard cán bộ | Thống kê số liệu trực quan, duyệt/từ chối/yêu cầu bổ sung hồ sơ |
| 🤖 Chatbot AI | Trợ lý ảo (Gemini) hỗ trợ giải đáp quy trình thủ tục hành chính |
| 📧 Gửi thông báo Email | Tự động thông báo xác thực tài khoản và cập nhật trạng thái hồ sơ |

---

## 🛠️ Công Nghệ Sử Dụng

| Lớp | Công nghệ |
|-----|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios, Lucide React, Recharts |
| **Backend** | Node.js, Express.js 5, Sequelize ORM, Multer, JWT, Bcrypt |
| **Database** | PostgreSQL |
| **AI Services** | Google Gemini (Chatbot), Anthropic Claude (OCR & Vision Phân tích) |
| **Email Service** | Nodemailer |

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
WebsiteProject/
├── .gitignore
├── hanh_chinh_cong.sql        ← File SQL để tạo và thêm dữ liệu ban đầu vào database
├── backend/
│   ├── .env.example           ← Mẫu cấu hình môi trường backend (cần sao chép thành .env)
│   ├── server.js              ← Entry point chính
│   ├── package.json
│   ├── scripts/               ← Script hỗ trợ tạo dữ liệu mẫu (seed) hoặc reset
│   ├── src/
│   │   ├── config/            ← Cấu hình database
│   │   ├── controllers/       ← Xử lý logic API
│   │   ├── middlewares/       ← Middleware xác thực (Auth), upload file
│   │   ├── models/            ← Các mô hình CSDL Sequelize
│   │   ├── ocr/               ← Dịch vụ OCR cục bộ
│   │   ├── routes/            ← Định tuyến API
│   │   └── utils/
│   └── uploads/               ← (Sẽ tự tạo) Thư mục chứa file tải lên
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── src/
    │   ├── app/               ← Components, pages, layout chính
    │   ├── context/           ← Quản lý state toàn cục (Auth)
    │   └── utils/             ← Cấu hình Axios
    └── public/
```

---

## ⚙️ Yêu Cầu Hệ Thống

Trước khi tiến hành cài đặt, đảm bảo máy của bạn đã được cài đặt:

| Môi trường / Phần mềm | Phiên bản | Lệnh kiểm tra |
|-----------------------|-----------|---------------|
| **Node.js** | ≥ 18.x | `node -v` |
| **npm** | ≥ 9.x | `npm -v` |
| **PostgreSQL** | ≥ 14.x | Xem trong ứng dụng pgAdmin |
| **Git** | Bất kỳ | `git --version` |

> 💡 **Node.js:** Tải tại [nodejs.org](https://nodejs.org) (Bản LTS).
> 💡 **PostgreSQL & pgAdmin:** Tải tại [postgresql.org](https://www.postgresql.org/download/).

---

## 🚀 Hướng Dẫn Cài Đặt và Chạy Dự Án (Clone Về Máy)

### Bước 1: Clone mã nguồn từ GitHub

Mở Terminal (hoặc Command Prompt/PowerShell) tại thư mục bạn muốn chứa dự án:

```bash
git clone https://github.com/TrieuKy/Public-Administrative-Services-System.git
cd Public-Administrative-Services-System
```

### Bước 2: Khởi tạo và Cấu hình Database (PostgreSQL)

1. Mở công cụ quản lý PostgreSQL (khuyến nghị **pgAdmin 4**).
2. Tạo một database mới với tên: `hanh_chinh_cong`.
3. Nhập dữ liệu và cấu trúc bảng mẫu:
   - Click phải vào DB `hanh_chinh_cong` vừa tạo -> chọn **Query Tool**.
   - Mở file `hanh_chinh_cong.sql` nằm trong thư mục gốc của dự án.
   - Nhấn **Execute** (hoặc `F5`) để chạy lệnh SQL, thao tác này sẽ tạo toàn bộ table và dữ liệu khởi tạo.

*(Lưu ý: Mặc định PostgreSQL chạy port `5432`, nếu bạn đổi port khi cài đặt, hãy nhớ port đó cho bước cấu hình môi trường bên dưới).*

### Bước 3: Thiết lập API Keys cho AI

Dự án này sử dụng 2 dịch vụ AI, bạn cần đăng ký khóa API (API Key) miễn phí:
1. **Gemini API (Hỗ trợ Chatbot):** Lấy tại [Google AI Studio](https://aistudio.google.com/app/apikey).
2. **Claude API (Hỗ trợ OCR tài liệu & Verify):** Lấy tại [Anthropic Console](https://console.anthropic.com/settings/keys).

### Bước 4: Cài đặt và Chạy Backend

1. Di chuyển vào thư mục backend và cài đặt thư viện:
   ```bash
   cd backend
   npm install
   ```
2. Tạo file `.env`: Tại thư mục `backend/`, copy file `.env.example` và đổi tên thành `.env`. Cấu hình nội dung bên trong như sau:
   ```env
   PORT = 3001
   NODE_ENV = development

   # Cấu hình Database
   DB_HOST = localhost
   DB_PORT = 5432             # <-- Đổi thành port PostgreSQL thực tế của bạn
   DB_NAME = hanh_chinh_cong
   DB_USER = postgres         # <-- Tên user quản trị postgres
   DB_PASSWORD = 123          # <-- Đổi thành mật khẩu postgres của bạn

   # JWT
   JWT_SECRET = super_secret_key_change_me
   JWT_EXPIRES_IN = 1h
   JWT_REFRESH_SECRET = refresh_super_secret_key_change_me
   JWT_REFRESH_EXPIRES_IN = 7d

   # Cấu hình AI API Keys (Từ Bước 3)
   GEMINI_API_KEY=your_gemini_api_key_here
   ANTHROPIC_API_KEY=your_claude_api_key_here

   # Các cài đặt khác (Giữ nguyên)
   UPLOAD_DIR = uploads
   MAX_FILE_SIZE = 5242880
   CLIENT_URL = http://localhost:5173
   OCR_SERVICE_URL=http://localhost:5050
   ```
3. Khởi động Backend Server (Lệnh này sẽ chạy song song Backend API trên cổng 3001 và OCR Service trên cổng 5050):
   ```bash
   npm run dev:all
   ```

### Bước 5: Tạo Dữ Liệu Mẫu Bổ Sung (Tùy chọn)

Để tạo sẵn các tài khoản cán bộ và các dịch vụ hành chính ban đầu, hãy mở thêm một Terminal mới, chuyển vào thư mục `backend` và chạy các lệnh:

```bash
cd backend
node scripts/seedOfficer.js   # Tạo tài khoản Cán bộ
node scripts/seedData.js      # Tạo dữ liệu Dịch vụ & Hồ sơ mẫu
```
*(Nếu muốn xóa sạch database và chạy lại từ đầu, bạn có thể dùng lệnh: `node scripts/reset.js`)*

### Bước 6: Cài đặt và Chạy Frontend

Mở thêm một Terminal mới, chuyển hướng vào thư mục frontend:

```bash
cd frontend
npm install
npm run dev
```

Truy cập hệ thống thông qua trình duyệt tại địa chỉ: **http://localhost:5173**

---

## 🔑 Tài Khoản Truy Cập Mẫu

Nếu bạn đã chạy lệnh `node scripts/seedOfficer.js` (Bước 5), bạn có thể dùng tài khoản sau để đăng nhập với quyền Cán bộ (Officer):

| Quyền | Email | Mật khẩu |
|-------|-------|----------|
| 👮 **Cán bộ** | `nguyenvanb@bennghe.gov.vn` | `123456` |

**Đối với tài khoản công dân:** Truy cập đường dẫn `http://localhost:5173/register` để đăng ký mới.
*(Trong quá trình phát triển, link xác thực Email sẽ được hiển thị ngay trong màn hình Terminal của Backend. Chỉ cần click vào link đó để hoàn tất việc kích hoạt tài khoản).*

---

## 🐛 Xử Lý Lỗi Thường Gặp

| Vấn đề | Cách khắc phục |
|--------|----------------|
| **Lỗi `ECONNREFUSED` khi kết nối DB** | Kiểm tra dịch vụ PostgreSQL đã chạy chưa và xác minh lại thông số `DB_PORT`, `DB_PASSWORD` trong file `.env`. |
| **Lỗi `relation "users" does not exist`** | Do chưa import file cấu trúc `hanh_chinh_cong.sql` vào database. Hãy thực hiện lại Bước 2. |
| **Giao diện không gọi được API (Network Error)** | Kiểm tra lại terminal Backend xem server đã khởi chạy thành công (`✅ Database connected successfully`) chưa. |
| **Chức năng OCR / Chatbot không hoạt động** | Đảm bảo bạn đã nhập chính xác `GEMINI_API_KEY` và `ANTHROPIC_API_KEY` trong file `.env`. Đồng thời kiểm tra xem tài khoản API có bị vượt quá giới hạn gọi miễn phí không. |

---

<div align="center">

📝 *Đồ án cơ sở — Sinh viên HUTECH*

Mọi thắc mắc hoặc lỗi phát sinh trong quá trình clone có thể tạo [Issue](https://github.com/TrieuKy/Public-Administrative-Services-System/issues) để được hỗ trợ.

</div>
