# Cấu trúc Backend Dịch vụ Công (Node.js & Postgres) 🚀

Hệ thống cung cấp API cho dịch vụ công trực tiếp cấp cơ sở, xây dựng theo chuẩn cấu trúc MC (Model-Controller) trong Node.js.

## 📂 Tổ chức mã nguồn (Folder Structure)

```
backend/
├── src/
│   ├── config/          # Khởi tạo kết nối DB và cấu hình (DB, Sequelize, CORS)
│   ├── controllers/     # Nơi chứa toàn bộ Logic và Xử lý Request/Response
│   │   ├── auth.controller.js      # Đăng ký, Đăng nhập, Xác thực, Lấy Profile
│   │   ├── application.controller.js # Công dân thao tác nộp hồ sơ, tra cứu
│   │   ├── officer.controller.js   # Cán bộ lấy danh sách, kiểm duyệt, từ chối
│   │   ├── payment.controller.js   # Logic thanh toán (Mock up)
│   ├── middlewares/     # Chứa cổng rào bảo mật
│   │   ├── auth.middleware.js      # Kiểm tra và bóc tách JWT Bearer Token
│   │   ├── role.middleware.js      # Kiểm duyệt quyền `citizen` hay `officer`
│   ├── models/          # Khai báo Schema (Table Database) thông qua Sequelize (ORM)
│   │   ├── User.js                 # Bảng Cư dân (Lưu data định danh CCCD)
│   │   ├── Application.js          # Hệ thống giao dịch, tiến độ hồ sơ
│   ├── routes/          # Nơi chuyển hướng URL endpoint tới đúng cái Controller
│   ├── services/        # Các API bên thứ 3 hoặc Script Email
│       ├── email.service.js        # File cấu trúc việc giả lập bắn mail (Dev mode terminal log)
├── server.js            # File khởi chạy gốc, nạp Middleware, Route
├── .env                 # (Không commit) Setting cơ sở dữ liệu
```

## 🛠️ Biến Môi Trường (`.env`)
Yêu cầu bạn phải tạo một file cấu hình `.env` cho BE dựa vào file `.env.example` trước khi Start. Đặc biệt chú ý kết nối Postgres:

```env
PORT=3001
DB_NAME=dichvucong
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=super_secret_key
# Cổng client để Link trỏ về
CLIENT_URL=http://localhost:5173
```
