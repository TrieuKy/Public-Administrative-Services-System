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

Yêu cầu môi trường có cài sẵn **Node.js** (v18+) và **PostgreSQL** đang chạy ngầm trên máy.

**Bước 1: Setup Cơ sở dữ liệu (Database)**
- Mở PgAdmin hoặc DBeaver, tạo một Database trống tên là `dichvucong`.

**Bước 2: Chạy BE (Backend)**
```bash
cd backend
npm install
```
- Tạo tệp `.env` trong thư mục `backend` và điền cấu hình Database (Ví dụ: `DB_NAME=dichvucong`, `DB_USER=postgres`...).
```bash
# Sau đó khởi động
npm run dev
# Server Backend sẽ khởi chạy ở: http://localhost:3001
```

**Bước 3: Chạy FE (Frontend)**
```bash
cd frontend
npm install
npm run dev
# Trình duyệt sẽ mở Giao diện người dùng ở: http://localhost:5173
```

---

## 💡 Lưu ý dành cho Nhà Phát Triển / Chấm thi (Notes)
Hệ thống sử dụng rất nhiều tiện ích "Demo thân thiện" để không cần các setup của bên thứ 3:
1. **Xác thực Email (Verify Mail):** Mail thật đang tắt. Chạy Backend Terminal, web sẽ in URL Link có màu đỏ. Ctrl+Click vào link đó là coi như bạn đã Bấm check hộp thư mail.
2. **Scanner OCR:** Chức năng đọc thẻ CCCD hoạt động theo kịch bản Hard-code tạo sẵn để đảm bảo 100% demo qua dễ dàng với UI Loading y hệt thật.
3. **Thanh toán:** Cổng thanh toán nội địa được làm cho giao diện hiển thị 1 luồng chuẩn (Success Mocks) thay vì tạo Sandbox thật tốn tài nguyên.

---
> 📝 *Dự án "Đồ án cơ sở" thực hiện bởi Sinh viên HUTECH.*
