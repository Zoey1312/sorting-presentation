import React, { useState } from 'react';
import {
  TIMSORT_JAVA_TABS,
  INTROSORT_PYTHON_CODE,
  INTROSORT_OFFSET_CODE,
  HEAPSORT_PYTHON_CODE,
  LEETCODE_215_CODE,
  LEETCODE_912_CODE,
} from '../data/slidesData';
import CodeBlock from './CodeBlock.jsx';
import TimsortSimulator from './TimsortSimulator.jsx';
import IntrosortSimulator from './IntrosortSimulator.jsx';
import HeapsortSimulator from './HeapsortSimulator.jsx';
import SummaryView from './SummaryView.jsx';

export default function SlideRenderer({ slide }) {
  const [javaTab, setJavaTab] = useState('full');

  const renderSlideBody = () => {
    switch (slide.id) {
      case 1:
        return (
          <div className="hero-center">
            <span className="badge-pill badge-cyan">Môn học: Cấu trúc dữ liệu và Giải thuật</span>
            <h1 className="hero-title">{slide.title} (PRODUCTION SORTING ALGORITHMS)</h1>
            <p className="slide-subtitle" style={{ fontSize: '1.12rem' }}>
              {slide.subtitle}
            </p>
            <div className="grid-3">
              <div className="glass-panel card-pad floating-card">
                <span className="badge-pill badge-emerald">Timsort (Tim Peters, 2002)</span>
                <p className="card-text mt-2">
                  Merge Sort + Insertion Sort. Trái tim của Python, Java Object Arrays, V8 JS, Android.
                </p>
              </div>
              <div className="glass-panel card-pad floating-card floating-card-delay-1">
                <span className="badge-pill badge-violet">Introsort (David R. Musser, 1997)</span>
                <p className="card-text mt-2">
                  Quick Sort + Heap Sort + Insertion Sort. Sức mạnh đằng sau <code>std::sort</code> của C++, .NET và Go.
                </p>
              </div>
              <div className="glass-panel card-pad floating-card floating-card-delay-2">
                <span className="badge-pill badge-amber">Heap Sort (Binary Heap)</span>
                <p className="card-text mt-2">
                  Sắp xếp vun đống tại chỗ O(1) RAM. Chốt chặn an toàn của Linux Kernel &amp; Embedded Systems.
                </p>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-3">
            <div className="glass-panel card-pad">
              <p className="card-text">
                Các thuật toán cơ bản (<em>Bubble Sort, Selection Sort, Insertion Sort</em>) có độ phức tạp O(n²).
                Các thuật toán Chia để trị (<em>Merge Sort, Quick Sort</em>) đạt trung bình O(n log n), nhưng vẫn tồn tại 3 góc khuất trong Production:
              </p>
            </div>
            <div className="grid-3">
              <div className="glass-panel card-pad">
                <span className="badge-pill badge-rose">1. Nguy cơ của Quick Sort</span>
                <p className="card-text mt-2">Tiềm ẩn suy thoái về O(n²) khi gặp dữ liệu bất lợi hoặc gây tràn ngăn xếp (Stack Overflow).</p>
              </div>
              <div className="glass-panel card-pad">
                <span className="badge-pill badge-amber">2. Gánh nặng của Merge Sort</span>
                <p className="card-text mt-2">Ổn định (Stable) nhưng tiêu tốn bộ nhớ phụ O(n).</p>
              </div>
              <div className="glass-panel card-pad">
                <span className="badge-pill badge-cyan">3. Đặc thù dữ liệu đời thực</span>
                <p className="card-text mt-2">Dữ liệu thực tế hiếm khi ngẫu nhiên hoàn toàn mà thường có sẵn các đoạn đã sắp xếp cục bộ (natural runs).</p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid-2">
            <div className="glass-panel card-pad">
              <div className="card-title">Bài toán &amp; Tính ổn định (Stability)</div>
              <p className="card-text">
                Input: Mảng n phần tử (số, chuỗi, Object qua <code>Comparable</code>/<code>Comparator</code>). VD: [5, 2, 3, 1, 4] → [1, 2, 3, 4, 5].
                Stable Sort giữ nguyên thứ tự tương đối của các phần tử có khóa bằng nhau.
              </p>
            </div>
            <div className="glass-panel card-pad">
              <div className="card-title">4 Cơ chế cốt lõi của Timsort</div>
              <p className="card-text">
                1. <strong>Natural Runs</strong>: Phát hiện đoạn tăng/giảm tự nhiên.<br />
                2. <strong>Minrun (32–64 thực tế, 4 học tập)</strong> &amp; Binary Insertion Sort.<br />
                3. <strong>Merge Stack</strong>: Gộp cân bằng kích thước.<br />
                4. <strong>Galloping Mode</strong>: Nhảy bước lũy thừa + tìm nhị phân khi một run thắng liên tục.
              </p>
            </div>
          </div>
        );
      case 4:
        return <TimsortSimulator />;
      case 5: {
        const activeTab = TIMSORT_JAVA_TABS.find((t) => t.id === javaTab) || TIMSORT_JAVA_TABS[0];
        return (
          <div className="flex flex-col gap-3">
            <div className="flex-row gap-2">
              {TIMSORT_JAVA_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`tab-btn ${javaTab === t.id ? 'active' : ''}`}
                  onClick={() => setJavaTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className="text-sm text-muted">{activeTab.description}</p>
            <CodeBlock title="TimSortDemo.java" lang="java" code={activeTab.code} />
          </div>
        );
      }
      case 6:
        return (
          <div className="grid-2">
            <div className="glass-panel card-pad">
              <div className="card-title">Độ phức tạp Thời gian</div>
              <p className="card-text">
                <strong>Best Case: O(n)</strong> — Mảng đã tăng dần, quét 1 lượt tạo 1 run duy nhất.<br />
                <strong>Average &amp; Worst Case: O(n log n)</strong> — Gộp qua ~log n tầng, không bao giờ suy biến thành O(n²).
              </p>
            </div>
            <div className="glass-panel card-pad">
              <div className="card-title">Độ phức tạp Không gian: O(n)</div>
              <p className="card-text">
                Tốn O(n) bộ nhớ phụ cho vùng đệm tạm khi merge và run stack. Đánh đổi RAM để đạt Stability và tốc độ cực cao trên dữ liệu thực tế.
              </p>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="grid-3">
            <div className="glass-panel card-pad">
              <div className="card-title">1. Hệ sinh thái ngôn ngữ</div>
              <p className="card-text">Python (sort, sorted), Java Arrays.sort(Object[]), Collections.sort(), Android, V8 JS Engine.</p>
            </div>
            <div className="glass-panel card-pad">
              <div className="card-title">2. Thu thập Server Logs</div>
              <p className="card-text"><code>logs.sort(Comparator.comparing(e -&gt; e.timestamp))</code> xử lý hiệu quả các run gần tăng dần lệch nhẹ do mạng.</p>
            </div>
            <div className="glass-panel card-pad">
              <div className="card-title">3. Liên hệ LeetCode 88</div>
              <p className="card-text">Merge Sorted Array tận dụng các đoạn đã sắp xếp và trộn bằng 2 con trỏ trong O(m + n).</p>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="grid-2">
            <div className="glass-panel card-pad">
              <div className="card-title">Tại sao không dùng 1 thuật toán đơn lẻ?</div>
              <p className="card-text">
                • Chỉ dùng Quicksort: Suy biến O(n²), tràn stack O(n).<br />
                • Chỉ dùng Heapsort: Gây Cache Miss, chậm hơn 2–3 lần.<br />
                • Không có Insertion Sort: Lãng phí 75% lời gọi đệ quy ở đoạn 1–2 phần tử.
              </p>
            </div>
            <div className="glass-panel card-pad">
              <div className="card-title">3 Trụ cột của Introsort</div>
              <p className="card-text">
                1. <strong>Quicksort</strong> (size &gt; 16, depth &gt; 0): Median-of-Three, thân thiện L1/L2 Cache.<br />
                2. <strong>Heapsort</strong> (size &gt; 16, depth == 0): Lưới an toàn O(n log n).<br />
                3. <strong>Insertion Sort</strong> (size &lt;= 16): Triệt tiêu recursion overhead.
              </p>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="glass-panel card-pad">
            <div className="card-title">Lưu đồ hàm _introsort_util(low, high, depth_limit)</div>
            <p className="card-text">
              Khởi tạo <code>depth_limit = 2 * floor(log2(n))</code>.<br />
              • <strong>Bước 1:</strong> size &lt;= 16? → ĐÚNG: Chạy Insertion Sort &amp; Return.<br />
              • <strong>Bước 2:</strong> depth_limit == 0? → ĐÚNG: Chạy Heapsort đoạn con [low..high] &amp; Return.<br />
              • <strong>Bước 3:</strong> Phân hoạch Median-of-Three, đệ quy nửa phải [p+1..high], khử đệ quy đuôi nửa trái [low..p-1] với depth_limit - 1.
            </p>
          </div>
        );
      case 10:
        return <IntrosortSimulator />;
      case 11:
        return (
          <div className="grid-2">
            <CodeBlock title="introsort.py" lang="python" code={INTROSORT_PYTHON_CODE} />
            <CodeBlock title="heapsort_subarray_offset.py" lang="python" code={INTROSORT_OFFSET_CODE} />
          </div>
        );
      case 12:
        return (
          <div className="grid-2">
            <div className="glass-panel card-pad">
              <div className="card-title">Chứng minh chặn trên Θ(n log n)</div>
              <p className="card-text">
                Tốt nhất &amp; Trung bình: Θ(n log n) (~1.188 n log2 n phép so sánh).<br />
                Xấu nhất (Median-of-3 Killer): Quicksort tối đa 2⌊log2 n⌋ mức O(n log n) + Heapsort các đoạn rời nhau O(n log n) + Insertion Sort O(n) = Θ(n log n).
              </p>
            </div>
            <div className="glass-panel card-pad">
              <div className="card-title">Độ phức tạp Không gian: Θ(log n)</div>
              <p className="card-text">
                Thao tác sắp xếp tại chỗ tốn Θ(1) biến cục bộ (zero slicing). Call Stack khóa cứng tối đa 2⌊log2 n⌋ + 1 khung hàm ⇒ Θ(log n), chống tràn Stack tuyệt đối.
              </p>
            </div>
          </div>
        );
      case 13:
        return (
          <div className="grid-2">
            <div className="glass-panel card-pad">
              <div className="card-title">Sàn TMĐT &amp; Phân tích Request Logs</div>
              <p className="card-text">
                1. Sắp xếp hàng triệu sản phẩm theo giá tăng dần tức thì.<br />
                2. Tìm P50, P90 Latency và xử lý tính Unstable bằng khóa tuple <code>(latency_ms, arrival_seq)</code>.
              </p>
            </div>
            <CodeBlock title="leetcode_912_introsort.py" lang="python" code={LEETCODE_912_CODE} />
          </div>
        );
      case 14:
        return (
          <div className="grid-2">
            <div className="glass-panel card-pad">
              <div className="card-title">Binary Heap trên mảng 1 chiều</div>
              <p className="card-text">
                Không dùng con trỏ! Nút cha tại i có <code>left = 2*i + 1</code>, <code>right = 2*i + 2</code>.
                Ví dụ: [4, 10, 3, 5, 1] → [1, 3, 4, 5, 10].
              </p>
            </div>
            <div className="glass-panel card-pad">
              <div className="card-title">2 Giai đoạn chính</div>
              <p className="card-text">
                1. <strong>Build Max-Heap</strong>: Đưa phần tử lớn nhất lên đỉnh arr[0].<br />
                2. <strong>Extract &amp; Sift-down</strong>: Hoán đổi arr[0] về cuối mảng, giảm Heap size đi 1 và vun lại đống.
              </p>
            </div>
          </div>
        );
      case 15:
        return <HeapsortSimulator />;
      case 16:
        return <CodeBlock title="heapsort_iterative.py" lang="python" code={HEAPSORT_PYTHON_CODE} />;
      case 17:
        return (
          <div className="grid-2">
            <div className="glass-panel card-pad">
              <div className="card-title">Độ phức tạp Thời gian</div>
              <p className="card-text">
                • Build Max-Heap: O(n).<br />
                • Rút gốc lặp n-1 lần: O(n log n).<br />
                • Worst &amp; Average: O(n log n). Best Case: Θ(n log n) với phần tử phân biệt, Θ(n) nếu mọi phần tử bằng nhau [5,5,5,5].
              </p>
            </div>
            <div className="glass-panel card-pad">
              <div className="card-title">Độ phức tạp Không gian: O(1) Tuyệt đối</div>
              <p className="card-text">
                Khử đệ quy bằng vòng lặp while True, chỉ dùng biến chỉ số (i, left, right, largest) — không tốn RAM mảng phụ hay Call Stack.
              </p>
            </div>
          </div>
        );
      case 18:
        return (
          <div className="grid-2">
            <div className="glass-panel card-pad">
              <div className="card-title">Linux Kernel (lib/sort.c) &amp; Hệ thống nhúng</div>
              <p className="card-text">
                Kernel Stack cực nhỏ (8 KB – 16 KB). Heap Sort với O(1) RAM và cam kết O(n log n) chống Kernel Panic và tấn công DoS O(n²).
              </p>
            </div>
            <CodeBlock title="leetcode_215_min_heap.py" lang="python" code={LEETCODE_215_CODE} />
          </div>
        );
      case 19:
        return <SummaryView />;
      default:
        return null;
    }
  };

  return (
    <>
      {slide.id !== 1 && (
        <header className="slide-header">
          <div>
            <span className="slide-kicker">Slide {slide.id} / 19</span>
            <h1 className="slide-title">{slide.title}</h1>
            <p className="slide-subtitle">{slide.subtitle}</p>
          </div>
        </header>
      )}
      <div className="slide-body">{renderSlideBody()}</div>
    </>
  );
}
