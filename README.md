# Các Thuật Toán Sắp Xếp Thực Tế: Timsort, Introsort & Heap Sort

Bài thuyết trình tương tác gồm **19 slide** về các thuật toán sắp xếp trong hệ thống Production (**Timsort**, **Introsort**, **Heap Sort**), chạy trực tiếp bằng ES Modules gốc trên trình duyệt mà **không cần cài đặt Node.js hay thư viện ngoài**.

---

## Cách chạy dự án

> **Lưu ý quan trọng:** Không mở trực tiếp file `index.html` bằng giao thức `file://` (kéo thả vào trình duyệt), vì trình duyệt chặn tải ES Modules (`src/runtime.js`, `src/timsortEngine.js`, v.v.) qua `file://`. Hãy chạy qua một trong các cách bên dưới.

### Cách 1: Chạy nhanh bằng `run.bat` (Khuyên dùng trên Windows)

1. Mở thư mục dự án và **nhấp đúp chuột (double-click)** vào file `run.bat` (hoặc chạy `.\run.bat` trong Terminal).
2. Script sẽ tự động gọi `serve.ps1 -OpenBrowser` (với `-ExecutionPolicy Bypass`):
   - Mở máy chủ cục bộ trên cổng **`8080`** và **`5173`** (hỗ trợ cả `http://localhost:8080` và `http://127.0.0.1:8080`).
   - Tự động mở trình duyệt mặc định tại `http://localhost:8080` (hoặc `http://localhost:5173` nếu cổng `8080` đang bận).
3. **Giữ nguyên cửa sổ dòng lệnh** trong suốt thời gian xem/trình chiếu. Khi muốn tắt server, nhấn `Ctrl + C` hoặc đóng cửa sổ đó.

### Cách 2: Chạy trực tiếp bằng `serve.ps1` (PowerShell)

Mở PowerShell tại thư mục dự án và chạy:

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1 -OpenBrowser
```

Nếu muốn chỉ định một cổng riêng (ví dụ cổng `3000`):

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1 -Port 3000 -OpenBrowser
```

### Cách 3: Dùng Node.js / Vite hoặc Python (tùy chọn, dùng được trên macOS / Linux)

- **Nếu máy có Node.js:**
  ```bash
  npm install
  npm run dev
  ```
- **Nếu máy có Python 3:**
  ```bash
  python3 -m http.server 8080
  ```
  Sau đó mở trình duyệt và truy cập `http://localhost:8080`.

---

## Phím tắt điều khiển

### Điều hướng bài thuyết trình
| Phím | Chức năng |
| --- | --- |
| `→` / `PageDown` / `Space` | Chuyển sang slide tiếp theo |
| `←` / `PageUp` | Quay lại slide trước |
| `S` | Bật / Tắt Speaker Notes |
| `F` | Bật / Tắt chế độ toàn màn hình (Fullscreen) |

### Phím tắt riêng trong các slide mô phỏng
- **Slide 4 (Timsort), Slide 10 (Introsort), Slide 15 (Heap Sort):**
  - `P`: Tự động chạy / Tạm dừng
  - `[` hoặc `,`: Lùi 1 bước
  - `]` hoặc `.`: Tiến 1 bước
- **Slide 10 (Introsort):** `1` / `2` để chuyển nhanh giữa 2 kịch bản (Tab 1 & Tab 2).
- **Slide 15 (Heap Sort):** `R` để đặt lại về Bước 0.

---

## Cấu trúc thư mục chính

```text
sorting-presentation/
├── run.bat                     # File chạy nhanh 1-click trên Windows
├── serve.ps1                   # HTTP server PowerShell tích hợp sẵn
├── index.html                  # Điểm vào chính của bài thuyết trình
├── package.json                # Cấu hình tùy chọn cho Vite / React
└── src/
    ├── runtime.js              # Engine trình chiếu & điều khiển DOM 19 slide
    ├── styles.css              # Giao diện & hiệu ứng cho các slide và mô phỏng
    ├── timsortEngine.js        # Bộ sinh khung hình mô phỏng Timsort (Slide 4)
    ├── introsortEngine.js      # Dữ liệu kịch bản cây đệ quy Introsort (Slide 10)
    ├── heapsortEngine.js       # Bộ sinh khung hình Heap Sort đồng bộ (Slide 15)
    ├── data/slidesData.js      # Nội dung 19 slide, code mẫu & bảng so sánh
    └── components/             # Các component React tương ứng (tùy chọn cho Vite)
```

---

## Xử lý sự cố thường gặp

- **Windows SmartScreen hiện cảnh báo khi mở `run.bat`:** Chọn **More info** → **Run anyway**.
- **Báo lỗi trùng port (`No ports could be bound`):** Chạy qua PowerShell với cổng khác, ví dụ:
  ```powershell
  powershell -ExecutionPolicy Bypass -File .\serve.ps1 -Port 3000 -OpenBrowser
  ```
- **Trang vẫn hiển thị bản cũ sau khi cập nhật code:** Nhấn `Ctrl + F5` (hoặc `Ctrl + Shift + R`) để tải lại trang và xóa cache trình duyệt.
