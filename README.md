<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</div>

<h1 align="center">🏛️ Hệ Thống Dịch Vụ Công Trực Tuyến - Cấp Phường/Xã</h1>

> Một hệ thống Web toàn diện hỗ trợ tự động hóa các thủ tục hành chính công cấp địa phương dành cho Cán bộ và Công dân.

---

## 🌟 Tóm tắt Dự án
Đây là Đồ án thực hành giải quyết bài toán số hóa quy trình quản lý hồ sơ trực tuyến cấp Phường/Xã. 
Hệ thống cho phép Công dân định danh cá nhân qua CCCD, nộp hồ sơ, thanh toán lệ phí, tra cứu kết quả; đồng thời cung cấp cho Cán bộ một bảng điều khiển (Dashboard) thông minh để xử lý hồ sơ một cách khoa học.

---

## ✨ Cấu trúc Chức năng (Features)

### 🧑 Tương tác Công dân (Citizen)
*   🔑 **Đăng ký / Đăng nhập & Định danh:** Tạo tài khoản an toàn thông qua JWT. Tích hợp tính năng Quét OCR (Lưu ý: Đang chạy Mock Data giả lập) quét 2 mặt CCCD để tự động trích xuất các dữ liệu dân cư.
*   📄 **Nộp hồ sơ trực tuyến:** Cung cấp các biểu mẫu và giao diện tải lên các tài liệu cho nhiều lĩnh vực: Hộ tịch, Đất đai, Kinh doanh...
*   💳 **Thanh toán trực tuyến:** Tra cứu mã hồ sơ và thực hiện thanh toán lệ phí mô phỏng (Mock Payment) với giao diện dễ nhìn, thân thiện cho người lớn tuổi.
*   🔍 **Tra cứu toàn diện:** Theo dõi lịch sử giao dịch và quá trình thụ lý hồ sơ trực tiếp trong Trang cá nhân.
*   ⭐ **Phản ánh & Đánh giá (Feedback & Rating):** Nộp đơn phản ánh, khiếu nại thái độ bộ máy nhà nước. Khảo sát 5 sao khi hồ sơ đạt trạng thái "Đã hoàn thành".
*   🤖 **Trợ lý ảo (Chatbot):** Nút Chatbot góc màn hình cung cấp thao tác trả lời nhanh thủ tục hành chính.

### 👮‍♂️ Chuyên môn Cán bộ (Officer)
*   📊 **Officer Dashboard:** Sắp xếp, phân trang và truy vấn nhanh chóng các hồ sơ do dân đẩy lên. Quản lý trạng thái thông thái.
*   📝 **5 Trạng thái Thụ lý:** 
    - `Tất cả` | `Chờ xử lý` | `Đang xử lý` | `Hoàn thành` | `Cần bổ sung` | `Bị từ chối`
*   👁️ **Kiểm duyệt & Thông báo:** Gửi tự động yêu cầu cập nhật hoặc từ chối thông qua nút nhấn thao tác. Tự động gửi Email ảo (Log Terminal) cho công dân.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### Frontend
- **Framework:** React.js chuyên lập trình UI.
- **Build Tool:** Vite (Nhanh và nhẹ).
- **Styling:** Tailwind CSS (Class-based cực mượt, chuẩn UI hệ thống nhà nước gốc).
- **Icons:** `lucide-react`.

### Backend
- **Khung (Framework):** Node.js + Express.js.
- **Database:** PostgreSQL (Mạnh mẽ, bảo mật cao).
- **ORM:** Sequelize (Đỡ phải viết query SQL thủ công, tự động Alter Table linh hoạt khi đổi cấu trúc).
- **Kiểm soát:** JSON Web Tokens (JWT) cho mật khẩu và quyền (Role) hệ thống.

---

## 🚀 Hướng Dẫn Cài Đặt (Installation)

Yêu cầu môi trường quản lý:
- **Node.js** (Khuyến nghị v18+)
- **PostgreSQL** (Bản 14 trở lên) hoạt động ổn định ở cổng mặc định `5432`.

**Bước 1: Khởi tạo Cơ sở dữ liệu (Database)**
- Khởi động service PostgreSQL. Mở PgAdmin, Navicat hoặc DBeaver, tạo một Database trống với tên tùy chọn, ví dụ: `dichvucong`.

**Bước 2: Cài đặt và cấu hình Backend (Server API)**
```bash
cd backend
npm install
```
- Tạo tệp `.env` trong thư mục `backend` và sao chép theo mẫu `.env.example` hoặc dán khối nội dung sau (thay đổi giá trị theo db local của bạn):
```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASS=123456
DB_NAME=dichvucong
JWT_SECRET=supersecret123
CLIENT_URL=http://localhost:5173
```
- Nếu cấu hình đúng, hệ thống sẽ tự động đồng bộ lược đồ (Auto Sync Schema) và khởi tạo bảng.
```bash
# Khởi động Backend (tích hợp nodemon tự restart khi sửa code)
npm run dev
# Server API sẽ lắng nghe tại: http://localhost:3000
```
*(Nếu muốn tạo tài khoản Admin/Cán bộ khởi điểm, hãy gọi API hoặc tạo tool script trong phần admin giả lập).*

**Bước 3: Cài đặt và chạy Frontend (Giao diện người dùng)**
```bash
cd frontend
npm install
```
- Tạo tệp `.env` chạy local trong thư mục `frontend` nếu URL backend của bạn khác so với file config hiện tại:
```env
VITE_API_URL=http://localhost:3000/api/v1
```
```bash
# Khởi động Vite Development Server
npm run dev
# Trình duyệt sẽ mở Project thông qua địa chỉ Web server: http://localhost:5173
```

**Bước 4: Test các chức năng Hệ thống**
- Mở URL trên trình duyệt và trải nghiệm dưới góc độ người dùng (đăng ký công dân), sau đó trải nghiệm luồng thao tác duyệt, sửa, phê duyệt hồ sơ dưới góc độ chuyên môn (có thể tạo Role thủ công qua database).

---

## 💡 Lưu ý dành cho Nhà Phát Triển / Chấm thi (Notes)
Hệ thống sử dụng rất nhiều tiện ích "Demo thân thiện" để không cần các setup của bên thứ 3:
1. **Xác thực Email (Verify Mail):** Mail thật đang tắt. Chạy Backend Terminal, web sẽ in URL Link có màu đỏ. Ctrl+Click vào link đó là coi như bạn đã Bấm check hộp thư mail.
2. **Scanner OCR:** Chức năng đọc thẻ CCCD hoạt động theo kịch bản Hard-code tạo sẵn để đảm bảo 100% demo qua dễ dàng với UI Loading y hệt thật.
3. **Thanh toán:** Cổng thanh toán nội địa được làm cho giao diện hiển thị 1 luồng chuẩn (Success Mocks) thay vì tạo Sandbox thật tốn tài nguyên.

---
> 📝 *Dự án "Đồ án cơ sở" thực hiện bởi Sinh viên HUTECH.*
