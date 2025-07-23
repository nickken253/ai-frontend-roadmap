# 🚀 AI Learning Roadmap - Frontend

Đây là dự án Frontend cho ứng dụng "AI Gợi ý Lộ trình Học tập", được xây dựng bằng Next.js và TypeScript. Ứng dụng cho phép người dùng nhập kỹ năng và mục tiêu nghề nghiệp, sau đó sử dụng AI để tạo ra một lộ trình học tập cá nhân hóa và chi tiết.

## ✨ Tính năng Nổi bật

### Dành cho Người dùng
- **Xác thực & Bảo mật:** Đăng ký, đăng nhập, xác thực email, quên mật khẩu.
- **Tạo Lộ trình bằng AI:** Form nhập liệu thông minh để gửi yêu cầu đến AI.
- **Trực quan hóa Dữ liệu:** Hiển thị lộ trình dưới dạng biểu đồ (React Flow) và danh sách chi tiết.
- **Lịch sử Lộ trình:** Xem lại và quản lý tất cả các lộ trình đã tạo.
- **Quản lý Hồ sơ:** Cập nhật thông tin cá nhân và thay đổi mật khẩu.
- **Gợi ý Kỹ năng:** Khám phá các kỹ năng cần thiết cho một mục tiêu nghề nghiệp cụ thể.

### Dành cho Quản trị viên (Admin)
- **Bảng điều khiển (Dashboard):** Giao diện tổng quan với các số liệu và biểu đồ thống kê trực quan.
- **Quản lý Người dùng:** Xem danh sách, chi tiết, và cập nhật trạng thái/vai trò của người dùng.
- **Xem Logs hệ thống:** Theo dõi lịch sử các lần gọi API của AI.
- **Phân quyền & Bảo mật:** Khu vực admin được bảo vệ, chỉ tài khoản có vai trò `admin` mới có thể truy cập.

## 🛠️ Công nghệ sử dụng

- **Framework:** Next.js 14 (App Router)
- **Ngôn ngữ:** TypeScript
- **Giao diện (UI):**
    - Tailwind CSS
    - Shadcn/UI (cho các component chất lượng cao)
    - Recharts (cho các biểu đồ)
    - React Flow (để trực quan hóa lộ trình)
- **Quản lý Trạng thái (State Management):**
    - Zustand (cho global state)
    - TanStack Query (React Query) (để quản lý server state, fetching, caching)
- **Form:** React Hook Form & Zod (để validation)
- **Gọi API:** Axios

## 🚀 Bắt đầu

### Yêu cầu
- Node.js (v18 trở lên)
- npm hoặc yarn

### Cài đặt & Chạy Local

1.  **Clone repository:**
    ```bash
    git clone [https://github.com/nickken253/ai-backend-roadmap.git](https://github.com/nickken253/ai-backend-roadmap.git)
    cd ai-backend-roadmap # Di chuyển vào thư mục frontend của bạn
    ```

2.  **Cài đặt các dependencies:**
    ```bash
    npm install
    ```

3.  **Thiết lập biến môi trường:**
    Tạo một file tên là `.env.local` ở thư mục gốc và thêm vào biến sau. Thay đổi URL nếu backend của bạn chạy ở một port khác.
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
    ```

4.  **Chạy server Backend:**
    Đảm bảo server backend của bạn đang chạy.

5.  **Chạy server Frontend (Development):**
    ```bash
    npm run dev
    ```
    Mở trình duyệt và truy cập `http://localhost:3000`.

### Build & Chạy Production

1.  **Tạo bản build tối ưu hóa:**
    ```bash
    npm run build
    ```

2.  **Chạy server production:**
    ```bash
    npm start
    ```

## 📂 Cấu trúc Thư mục

Dự án sử dụng App Router của Next.js với cấu trúc chính như sau:

-   `/app/(auth)`: Các trang dành cho khách (Login, Register).
-   `/app/(user)`: Các trang được bảo vệ dành cho người dùng đã đăng nhập.
-   `/app/(admin)`: Các trang được bảo vệ dành cho Quản trị viên.
-   `/components`: Chứa các UI component có thể tái sử dụng.
-   `/lib`: Chứa các hàm tiện ích, ví dụ như file `api.ts` để gọi API.
-   `/store`: Chứa các store của Zustand để quản lý state toàn cục.