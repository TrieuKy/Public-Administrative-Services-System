# Hệ Thống Dịch Vụ Hành Chính Công Trực Tuyến

Đây là dự án đồ án cơ sở được thực hiện tại trường Đại học Công nghệ TP.HCM (HUTECH). Hệ thống mô phỏng cổng dịch vụ công cấp phường, cho phép công dân nộp hồ sơ hành chính trực tuyến và cán bộ tiếp nhận, xử lý hồ sơ trên cùng một nền tảng.


## Giới Thiệu

Hệ thống được xây dựng theo kiến trúc Full-Stack, tích hợp trí tuệ nhân tạo (AI) để hỗ trợ hai nhóm người dùng chính:

Người dân có thể tạo tài khoản, nộp hồ sơ hành chính trực tuyến, tải lên giấy tờ tùy thân, thanh toán lệ phí và theo dõi tiến trình xử lý hồ sơ theo thời gian thực.

Cán bộ UBND có thể tiếp nhận hồ sơ, tra cứu chi tiết từng hồ sơ, xem kết quả phân tích tài liệu từ AI, duyệt hoặc từ chối hồ sơ, và xuất các giấy tờ chính thức dưới dạng PDF theo đúng mẫu của UBND Phường 11, Quận Bình Thạnh.


## Tính Năng Nổi Bật

Hệ thống hỗ trợ quét OCR trực tiếp từ ảnh hai mặt căn cước công dân, tự động nhận diện và điền thông tin vào biểu mẫu, giúp người dân tiết kiệm thời gian nhập liệu.

Khi cán bộ mở hồ sơ, AI sẽ phân tích toàn bộ tài liệu đính kèm, chấm điểm độ tin cậy theo từng giấy tờ và đưa ra đề xuất duyệt, từ chối hoặc yêu cầu bổ sung.

Sau khi hồ sơ được duyệt, cán bộ có thể xuất trực tiếp các loại giấy tờ chính thức bao gồm Giấy Chứng Nhận Kết Hôn, Lời Chứng Thực Bản Sao, Trích Lục Khai Tử và Giấy Phép Hoạt Động, với đầy đủ thông tin và đúng mẫu văn bản nhà nước.

Chatbot hỗ trợ trực tuyến sử dụng Gemini AI, được giới hạn chỉ trả lời các câu hỏi liên quan đến thủ tục hành chính tại UBND Phường 11.

Hệ thống gửi email thông báo tự động khi tài khoản được tạo, khi hồ sơ thay đổi trạng thái, và khi cần bổ sung giấy tờ.


## Công Nghệ Sử Dụng

Phần giao diện người dùng sử dụng React 18 với TypeScript, được đóng gói bằng Vite, giao diện được xây dựng bằng Tailwind CSS và thư viện Lucide React. Biểu đồ thống kê dùng Recharts.

Phần máy chủ sử dụng Node.js với Express.js, Sequelize ORM để làm việc với PostgreSQL, xác thực người dùng bằng JWT và mã hóa mật khẩu bằng bcrypt.

Dịch vụ AI tích hợp Google Gemini cho chatbot và Anthropic Claude cho OCR và phân tích tài liệu.

Dịch vụ email được xử lý qua Nodemailer.


## Cấu Trúc Thư Mục

    WebsiteProject/
        .gitignore
        README.md
        backend/
            .env.example
            server.js
            package.json
            scripts/
            src/
                config/
                controllers/
                middlewares/
                models/
                routes/
                seeders/
                services/
                utils/
            uploads/
        frontend/
            package.json
            vite.config.ts
            src/
                app/
                context/
                utils/
            public/
                templates/


## Yêu Cầu Hệ Thống

Trước khi cài đặt, máy cần có sẵn các phần mềm sau:

Node.js phiên bản 18 trở lên. Kiểm tra bằng lệnh: node -v

npm phiên bản 9 trở lên. Kiểm tra bằng lệnh: npm -v

PostgreSQL phiên bản 14 trở lên, khuyến nghị cài kèm pgAdmin 4 để quản lý cơ sở dữ liệu.

Git (bất kỳ phiên bản nào). Kiểm tra bằng lệnh: git --version

Node.js có thể tải tại nodejs.org, chọn bản LTS. PostgreSQL có thể tải tại postgresql.org.


## Hướng Dẫn Cài Đặt

### Bước 1: Tải mã nguồn về máy

Mở Terminal hoặc PowerShell tại thư mục muốn chứa dự án, sau đó chạy:

    git clone https://github.com/TrieuKy/Public-Administrative-Services-System.git
    cd Public-Administrative-Services-System


### Bước 2: Chuẩn bị cơ sở dữ liệu

Mở pgAdmin 4, tạo một database mới đặt tên là hanh_chinh_cong.

Nhấn chuột phải vào database vừa tạo, chọn Query Tool. Mở file hanh_chinh_cong.sql nằm trong thư mục gốc của dự án, dán nội dung vào cửa sổ Query Tool và nhấn F5 để chạy. Thao tác này sẽ tạo toàn bộ bảng dữ liệu cần thiết.

Mặc định PostgreSQL chạy trên cổng 5432. Nếu bạn đổi cổng khi cài đặt, hãy ghi nhớ cổng đó để điền vào file cấu hình ở bước sau.


### Bước 3: Lấy API Key cho các dịch vụ AI

Dự án sử dụng hai dịch vụ AI. Cả hai đều cung cấp gói miễn phí phù hợp cho mục đích học tập.

Gemini API Key dùng cho chatbot, lấy tại Google AI Studio: https://aistudio.google.com/app/apikey

Anthropic Claude API Key dùng cho OCR và phân tích tài liệu, lấy tại Anthropic Console: https://console.anthropic.com/settings/keys


### Bước 4: Cài đặt và khởi chạy Backend

Di chuyển vào thư mục backend và cài đặt thư viện:

    cd backend
    npm install

Tạo file cấu hình môi trường bằng cách sao chép file mẫu:

    copy .env.example .env

Mở file .env vừa tạo và điền thông tin thực tế của máy bạn:

    PORT = 3001
    NODE_ENV = development

    DB_HOST = localhost
    DB_PORT = 5432
    DB_NAME = hanh_chinh_cong
    DB_USER = postgres
    DB_PASSWORD = mat_khau_postgres_cua_ban

    JWT_SECRET = mot_chuoi_bi_mat_bat_ky
    JWT_EXPIRES_IN = 1h
    JWT_REFRESH_SECRET = mot_chuoi_bi_mat_khac
    JWT_REFRESH_EXPIRES_IN = 7d

    GEMINI_API_KEY = api_key_gemini_cua_ban
    ANTHROPIC_API_KEY = api_key_claude_cua_ban

    UPLOAD_DIR = uploads
    MAX_FILE_SIZE = 5242880
    CLIENT_URL = http://localhost:5173
    OCR_SERVICE_URL = http://localhost:5050

Khởi động Backend (lệnh này chạy đồng thời API Server trên cổng 3001 và OCR Service trên cổng 5050):

    npm run dev:all

Nếu Terminal hiển thị "Database connected successfully" thì backend đã khởi động thành công.


### Bước 5: Tạo dữ liệu mẫu (tùy chọn)

Để tạo sẵn các tài khoản và dịch vụ hành chính mẫu, mở thêm một Terminal mới tại thư mục backend và chạy:

    node scripts/seedOfficer.js
    node scripts/seedData.js

Nếu muốn xóa toàn bộ dữ liệu và bắt đầu lại từ đầu, dùng lệnh:

    node scripts/reset.js

Để tạo thêm tài khoản người dùng mẫu theo hướng dẫn riêng, xem file backend/src/seeders/users.seed.example.js.


### Bước 6: Cài đặt và khởi chạy Frontend

Mở một Terminal mới, di chuyển vào thư mục frontend:

    cd frontend
    npm install
    npm run dev

Truy cập hệ thống tại địa chỉ: http://localhost:5173


## Tài Khoản Mẫu

Sau khi chạy seedOfficer.js, có thể đăng nhập bằng tài khoản cán bộ sau:

    Email: nguyenvanb@bennghe.gov.vn
    Mat khau: 123456

Để tạo tài khoản công dân, truy cập: http://localhost:5173/register

Trong môi trường phát triển, đường link xác thực email sẽ xuất hiện trực tiếp trong Terminal của Backend. Chỉ cần nhấn vào đường link đó để kích hoạt tài khoản mà không cần email thật.


## Xử Lý Lỗi Thường Gặp

Nếu gặp lỗi ECONNREFUSED khi kết nối cơ sở dữ liệu, hãy kiểm tra xem dịch vụ PostgreSQL đã chạy chưa và xác nhận lại giá trị DB_PORT và DB_PASSWORD trong file .env.

Nếu gặp lỗi relation "users" does not exist, nguyên nhân là chưa import file SQL vào database. Thực hiện lại Bước 2.

Nếu giao diện không gọi được API và báo lỗi mạng, kiểm tra Terminal của Backend xem server đã khởi động thành công chưa.

Nếu tính năng OCR hoặc chatbot không hoạt động, kiểm tra lại API Key trong file .env và đảm bảo tài khoản chưa vượt quá giới hạn miễn phí của dịch vụ.


## Lưu Ý Về Bảo Mật

File .env chứa mật khẩu và API Key, không được phép đẩy lên GitHub. File này đã được liệt kê trong .gitignore.

Thư mục uploads chứa file tài liệu do người dùng nộp, cũng không được đẩy lên GitHub.

Khi muốn tạo dữ liệu mẫu có thông tin thật để test, hãy tạo file users.seed.js từ file mẫu users.seed.example.js. File users.seed.js đã được gitignore và sẽ không bao giờ được đẩy lên.


## Liên Hệ

Đây là dự án học thuật. Mọi góp ý hoặc báo lỗi trong quá trình cài đặt có thể tạo Issue tại trang GitHub của dự án để được hỗ trợ.
