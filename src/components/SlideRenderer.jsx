import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
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

const APPLE_TRANSITION = { duration: 0.65, ease: [0.16, 1, 0.3, 1] };

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: APPLE_TRANSITION,
  },
};

const ECOM_LOG_CODE = `class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

# Sắp xếp hàng triệu sản phẩm theo "Giá từ thấp đến cao"
introsort(products, key=lambda p: p.price)

# Phân tích Request Logs (tìm P50, P90 Latency):
# Xử lý tính Unstable bằng khóa tuple (latency_ms, arrival_seq)
introsort(logs, key=lambda r: (r.latency_ms, r.arrival_seq))`;

const SERVER_LOG_CODE = `class LogEntry {
    final Instant timestamp;
    final String message;
    LogEntry(Instant timestamp, String message) {
        this.timestamp = timestamp;
        this.message = message;
    }
}
// Ghép log từ nhiều máy chủ lệch nhẹ timestamp -> nhiều run gần tăng dần:
logs.sort(Comparator.comparing(entry -> entry.timestamp));`;

const MERGE_RUNS_CODE = `// Liên hệ LeetCode 88 (Merge Sorted Array): Gộp 2 run đã sắp xếp trong O(m + n)
static int[] mergeSortedArrays(int[] a, int[] b) {
    int[] out = new int[a.length + b.length];
    int i = 0, j = 0, k = 0;
    while (i < a.length && j < b.length)
        out[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];
    while (i < a.length) out[k++] = a[i++];
    while (j < b.length) out[k++] = b[j++];
    return out;
}`;

export default function SlideRenderer({ slide, onNextSlide }) {
  const [javaTab, setJavaTab] = useState('full');

  const renderSlideBody = () => {
    switch (slide.id) {
      case 1:
        return (
          <>
            <div className="bento-grid bento-grid-auto">
              <motion.div
                variants={itemVariants}
                className="bento-card bento-card-accent bento-card-auto col-12"
              >
                <div className="flex-row justify-between flex-wrap gap-2">
                  <span className="badge-pill badge-blue">Môn học: Cấu trúc dữ liệu và Giải thuật</span>
                  <span className="bento-caption">Slide 01 / 19 • 0.5 phút</span>
                </div>
                <h1 className="hero-title mt-3">
                  KHOẢNG CÁCH GIỮA SÁCH GIÁO KHOA VÀ HỆ THỐNG THỰC TẾ
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.56em',
                      color: '#A1A1A6',
                      WebkitTextFillColor: '#A1A1A6',
                      marginTop: '6px',
                    }}
                  >
                    (PRODUCTION SORTING ALGORITHMS)
                  </span>
                </h1>
                <p className="bento-body mt-3" style={{ maxWidth: '960px' }}>
                  Phân tích, Mô phỏng &amp; Ứng dụng của{' '}
                  <strong style={{ color: '#30D158' }}>Timsort</strong>,{' '}
                  <strong style={{ color: '#BF5AF2' }}>Introsort</strong> và{' '}
                  <strong style={{ color: '#FFD60A' }}>Heap Sort</strong>
                </p>
                <div className="bento-subtile flex-row justify-between flex-wrap gap-3 mt-3">
                  <span className="bento-body" style={{ color: '#A1A1A6' }}>
                    Sử dụng phím <code>→</code> / <code>Space</code> để chuyển slide • Bấm{' '}
                    <code>S</code> để mở Speaker Notes
                  </span>
                  <button type="button" className="sim-btn primary" onClick={onNextSlide}>
                    Bắt đầu bài thuyết trình <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="bento-grid flex-1 min-h-0">
              <motion.div
                variants={itemVariants}
                className="bento-card col-4"
                style={{ borderColor: 'rgba(48,209,88,0.35)' }}
              >
                <div className="flex-row justify-between gap-2">
                  <span className="badge-pill badge-mint">Timsort (Tim Peters, 2002)</span>
                  <span className="mono bento-caption" style={{ color: '#30D158' }}>
                    Stable
                  </span>
                </div>
                <div
                  className="hero-stat mt-3"
                  style={{
                    background: 'linear-gradient(135deg,#30D158,#64D2FF)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                  }}
                >
                  O(n) Best
                </div>
                <h3 className="bento-title mt-2">Merge Sort + Insertion Sort</h3>
                <p className="bento-body mt-2">
                  Trái tim của <strong>Python</strong> (<code>sort()</code>, <code>sorted()</code>),{' '}
                  <strong>Java Object Arrays</strong> (<code>Arrays.sort(Object[])</code>),{' '}
                  <strong>V8 JS</strong> và <strong>Android</strong>.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bento-card col-4"
                style={{ borderColor: 'rgba(191,90,242,0.38)' }}
              >
                <div className="flex-row justify-between gap-2">
                  <span className="badge-pill badge-purple">Introsort (David R. Musser, 1997)</span>
                  <span className="mono bento-caption" style={{ color: '#BF5AF2' }}>
                    In-place
                  </span>
                </div>
                <div
                  className="hero-stat mt-3"
                  style={{
                    background: 'linear-gradient(135deg,#BF5AF2,#5E5CE6)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                  }}
                >
                  Θ(n log n)
                </div>
                <h3 className="bento-title mt-2">Quick + Heap + Insertion</h3>
                <p className="bento-body mt-2">
                  Sức mạnh đằng sau <code>std::sort</code> của <strong>C++ STL</strong>, thư viện chuẩn{' '}
                  <strong>.NET</strong> (C#) và ngôn ngữ <strong>Go</strong>.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bento-card col-4"
                style={{ borderColor: 'rgba(255,159,10,0.38)' }}
              >
                <div className="flex-row justify-between gap-2">
                  <span className="badge-pill badge-amber">Heap Sort (Binary Heap)</span>
                  <span className="mono bento-caption" style={{ color: '#FFD60A' }}>
                    No Stack
                  </span>
                </div>
                <div
                  className="hero-stat mt-3"
                  style={{
                    background: 'linear-gradient(135deg,#FF9F0A,#FFD60A)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                  }}
                >
                  O(1) RAM
                </div>
                <h3 className="bento-title mt-2">Sắp xếp vun đống tại chỗ</h3>
                <p className="bento-body mt-2">
                  Chốt chặn an toàn tuyệt đối của nhân <strong>Linux Kernel</strong> (
                  <code>lib/sort.c</code>), <strong>Embedded Systems</strong> và{' '}
                  <strong>Priority Queue</strong>.
                </p>
              </motion.div>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="bento-grid bento-grid-auto">
              <motion.div variants={itemVariants} className="bento-card col-6">
                <div className="flex-row justify-between items-center gap-3">
                  <div>
                    <span className="badge-pill badge-blue">Nền tảng Sách giáo khoa</span>
                    <h3 className="bento-title mt-2">Thuật toán cơ bản</h3>
                  </div>
                  <div className="hero-stat">O(n²)</div>
                </div>
                <p className="bento-body mt-2">
                  <em>Bubble Sort, Selection Sort, Insertion Sort</em> giúp hiểu rõ nguyên lý so sánh từng cặp phần tử,
                  nhưng chi phí bậc hai <strong>O(n²)</strong> không thể đáp ứng dữ liệu lớn trong hệ thống thực tế.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-card col-6">
                <div className="flex-row justify-between items-center gap-3">
                  <div>
                    <span className="badge-pill badge-mint">Bước ngoặt Chia để trị</span>
                    <h3 className="bento-title mt-2">Merge Sort &amp; Quick Sort</h3>
                  </div>
                  <div className="hero-stat-accent">O(n log n)</div>
                </div>
                <p className="bento-body mt-2">
                  Tạo đột phá về hiệu năng với độ phức tạp trung bình <strong>O(n log n)</strong>,
                  trong đó <strong>Quick Sort</strong> từ lâu được xem là chuẩn mực tốc độ thực thi trong RAM.
                </p>
              </motion.div>
            </div>

            <div className="bento-grid flex-1 min-h-0">
              <motion.div
                variants={itemVariants}
                className="bento-card col-4"
                style={{ borderColor: 'rgba(255,69,58,0.38)' }}
              >
                <span className="badge-pill badge-rose">Góc khuất #1 • Nguy cơ bảo mật</span>
                <h3 className="bento-title mt-2">Nguy cơ của Quick Sort</h3>
                <p className="bento-body mt-2">
                  Tiềm ẩn nguy cơ suy thoái về <strong>O(n²)</strong> khi gặp dữ liệu bất lợi (chọn chốt xấu liên tiếp)
                  hoặc gây tràn ngăn xếp (<strong>Stack Overflow</strong> <code>O(n)</code>), dễ bị khai thác tấn công DoS.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bento-card col-4"
                style={{ borderColor: 'rgba(255,159,10,0.38)' }}
              >
                <span className="badge-pill badge-amber">Góc khuất #2 • Áp lực bộ nhớ</span>
                <h3 className="bento-title mt-2">Gánh nặng của Merge Sort</h3>
                <p className="bento-body mt-2">
                  Đảm bảo ổn định (<strong>Stable</strong>) và cận trên <code>O(n log n)</code>, nhưng tiêu tốn
                  bộ nhớ phụ <strong>O(n)</strong>, bất khả thi trên hệ thống nhúng hoặc nhân OS có RAM/Stack hạn hẹp.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bento-card col-4"
                style={{ borderColor: 'rgba(90,200,250,0.36)' }}
              >
                <span className="badge-pill badge-blue">Góc khuất #3 • Dữ liệu đời thực</span>
                <h3 className="bento-title mt-2">Đặc thù dữ liệu Production</h3>
                <p className="bento-body mt-2">
                  Dữ liệu thực tế hiếm khi ngẫu nhiên hoàn toàn mà thường có sẵn các đoạn đã được sắp xếp cục bộ
                  (<em>natural runs</em>) — như log hệ thống, danh sách giao dịch nối tiếp.
                </p>
              </motion.div>
            </div>

            <div className="bento-grid bento-grid-auto">
              <motion.div
                variants={itemVariants}
                className="bento-card bento-card-accent bento-card-auto col-12"
              >
                <div className="flex-row justify-between flex-wrap gap-3">
                  <h3 className="bento-title">
                    Giải pháp từ các Thư viện Chuẩn &amp; Hệ điều hành (Hybrid Sorting)
                  </h3>
                  <span className="badge-pill badge-accent">Tối ưu Phần cứng &amp; Thực tế</span>
                </div>
                <p className="bento-body mt-2">
                  <strong style={{ color: '#30D158' }}>Timsort</strong> (khai thác natural runs + ổn định),{' '}
                  <strong style={{ color: '#BF5AF2' }}>Introsort</strong> (tốc độ RAM + lưới an toàn Heapsort) và{' '}
                  <strong style={{ color: '#FFD60A' }}>Heap Sort</strong> (chuẩn <code>O(1)</code> RAM tuyệt đối).
                </p>
              </motion.div>
            </div>
          </>
        );

      case 3:
        return (
          <div className="bento-grid flex-1 min-h-0">
            <div className="bento-col col-5">
              <motion.div variants={itemVariants} className="bento-card bento-card-accent bento-card-auto">
                <div className="flex-row justify-between items-center gap-2">
                  <span className="badge-pill badge-mint">Tim Peters (2002)</span>
                  <span className="bento-caption mono">minrun học tập = 4</span>
                </div>
                <div className="hero-stat-accent mt-2">minrun = 32–64</div>
                <p className="bento-body mt-2">
                  <strong>Định nghĩa:</strong> Thuật toán sắp xếp lai kết hợp <strong>Merge Sort</strong> và{' '}
                  <strong>Insertion Sort</strong>.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-card bento-card-auto">
                <h3 className="bento-title">Đặc tả Input / Output</h3>
                <p className="bento-body mt-2">
                  • <strong>Input:</strong> Mảng <code>n</code> phần tử (số, chuỗi, hoặc Object so sánh qua{' '}
                  <code>Comparable</code> / <code>Comparator</code> trong Java).
                  <br />• <strong>Ví dụ:</strong> <code>[5, 2, 3, 1, 4]</code> → <code>[1, 2, 3, 4, 5]</code>.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bento-card flex-1"
                style={{ borderColor: 'rgba(48,209,88,0.35)' }}
              >
                <span className="badge-pill badge-mint">Stable Sort (Tính ổn định)</span>
                <p className="bento-body mt-2">
                  Các phần tử có khóa bằng nhau (VD: bản ghi nhân viên cùng điểm, đơn hàng cùng ngày){' '}
                  <strong>giữ nguyên thứ tự tương đối ban đầu</strong>. Cực kỳ quan trọng khi sắp xếp theo nhiều tiêu chí!
                </p>
              </motion.div>
            </div>

            <div className="col-7 h-full min-h-0">
              <div className="bento-subgrid-2">
                <motion.div variants={itemVariants} className="bento-card">
                  <span className="badge-pill badge-mint">Cơ chế 01</span>
                  <h3 className="bento-title mt-2">Natural Runs</h3>
                  <p className="bento-body mt-2">
                    Quét mảng phát hiện các đoạn liên tiếp đã tăng dần tự nhiên (hoặc giảm dần rồi đảo ngược).
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="bento-card">
                  <span className="badge-pill badge-blue">Cơ chế 02</span>
                  <h3 className="bento-title mt-2">Minrun &amp; Binary Insertion</h3>
                  <p className="bento-body mt-2">
                    Thực tế <code>minrun = 32–64</code> (tính theo bit từ <code>n</code>). Nếu run ngắn hơn{' '}
                    <code>minrun</code>, mở rộng bằng Binary Insertion Sort.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="bento-card">
                  <span className="badge-pill badge-blue">Cơ chế 03</span>
                  <h3 className="bento-title mt-2">Merge Stack cân bằng</h3>
                  <p className="bento-body mt-2">
                    Lưu các run vào stack và gộp theo bất biến cân bằng kích thước để tránh cây gộp bị lệch.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="bento-card">
                  <span className="badge-pill badge-amber">Cơ chế 04</span>
                  <h3 className="bento-title mt-2">Galloping Mode</h3>
                  <p className="bento-body mt-2">
                    Khi một run liên tục thắng lúc merge, nhảy bước lũy thừa rồi tìm nhị phân để chép cả cụm phần tử cùng lúc.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 4:
        return <TimsortSimulator />;

      case 5: {
        const activeTab = TIMSORT_JAVA_TABS.find((t) => t.id === javaTab) || TIMSORT_JAVA_TABS[0];
        return (
          <>
            <div className="bento-grid bento-grid-auto">
              <motion.div
                variants={itemVariants}
                className="bento-card bento-card-auto col-12"
                style={{ padding: '12px 18px' }}
              >
                <div className="flex-row justify-between flex-wrap gap-2">
                  <div className="flex-row gap-2 flex-wrap">
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
                  <span className="badge-pill badge-mint">Java 8+ • MIN_RUN = 4</span>
                </div>
              </motion.div>
            </div>

            <div className="bento-grid flex-1 min-h-0">
              <motion.div variants={itemVariants} className="col-7 h-full min-h-0">
                <CodeBlock title="TimSortDemo.java" lang="java" code={activeTab.code} />
              </motion.div>

              <div className="bento-col col-5">
                <motion.div variants={itemVariants} className="bento-card bento-card-auto">
                  <h3 className="bento-title">Giải thích phương thức đang xem</h3>
                  <p className="bento-body mt-2">{activeTab.description}</p>
                </motion.div>

                <motion.div variants={itemVariants} className="bento-card bento-card-auto">
                  <span className="badge-pill badge-mint">Kết quả Console</span>
                  <pre
                    className="mono mt-2"
                    style={{
                      fontSize: 'var(--fs-code)',
                      color: '#30D158',
                      background: '#0D0D0F',
                      padding: '8px 12px',
                      borderRadius: '14px',
                      border: '1px solid rgba(48,209,88,0.28)',
                      lineHeight: 1.45,
                    }}
                  >
                    {`Input : [3, 5, 7, 2, 4, 6, 9, 1, 8, 10]\nOutput: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`}
                  </pre>
                </motion.div>

                <motion.div variants={itemVariants} className="bento-card bento-card-accent flex-1">
                  <h3 className="bento-title">Lưu ý kỹ thuật &amp; Tính ổn định</h3>
                  <p className="bento-body mt-2">
                    • Dùng <code>a[j] &gt; key</code> (thay vì <code>&gt;=</code>) trong{' '}
                    <code>insertionSort</code> và <code>a[i] &lt;= a[j]</code> trong <code>merge</code> để giữ nguyên thứ tự các khóa bằng nhau.
                    <br />• Bản sản xuất OpenJDK bổ sung đảo run giảm dần, bất biến merge stack và galloping mode.
                  </p>
                </motion.div>
              </div>
            </div>
          </>
        );
      }

      case 6:
        return (
          <>
            <div className="bento-grid bento-grid-auto">
              <motion.div variants={itemVariants} className="bento-card bento-card-accent col-4">
                <span className="badge-pill badge-mint">Best Case</span>
                <div className="hero-stat-accent mt-2">O(n)</div>
                <p className="bento-body mt-1">1 lượt quét duy nhất trên mảng đã tăng dần.</p>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-card col-4">
                <span className="badge-pill badge-blue">Average &amp; Worst Case</span>
                <div className="hero-stat mt-2">O(n log n)</div>
                <p className="bento-body mt-1">
                  Không bao giờ suy biến thành <code>O(n²)</code>.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-card col-4">
                <span className="badge-pill badge-amber">Space Complexity</span>
                <div className="hero-stat mt-2">O(n)</div>
                <p className="bento-body mt-1">Bộ nhớ phụ cho vùng đệm tạm &amp; run stack.</p>
              </motion.div>
            </div>

            <div className="bento-grid flex-1 min-h-0">
              <motion.div variants={itemVariants} className="bento-card col-7">
                <h3 className="bento-title">Bảng Độ phức tạp Thời gian (Time Complexity)</h3>
                <table className="data-table mt-2">
                  <thead>
                    <tr>
                      <th>Trường hợp</th>
                      <th>Độ phức tạp</th>
                      <th>Cơ chế &amp; Tình huống ví dụ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="row-highlight">
                      <td className="font-bold">Tốt nhất (Best)</td>
                      <td className="mono font-bold" style={{ color: '#30D158' }}>
                        O(n)
                      </td>
                      <td>
                        Mảng đã tăng dần, chỉ quét 1 lượt phát hiện 1 run duy nhất, không cần merge (VD: danh sách giao dịch theo thời gian).
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold">Trung bình (Avg)</td>
                      <td className="mono font-bold" style={{ color: '#64D2FF' }}>
                        O(n log n)
                      </td>
                      <td>
                        Dữ liệu ngẫu nhiên hoặc bán sắp xếp, gộp qua khoảng <code>~log n</code> tầng; các run dài giúp giảm mạnh số lần gộp.
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold">Xấu nhất (Worst)</td>
                      <td className="mono font-bold" style={{ color: '#FFD60A' }}>
                        O(n log n)
                      </td>
                      <td>
                        Dữ liệu đảo lộn tạo nhiều run ngắn, nhưng không bao giờ suy biến thành <code>O(n²)</code> nhờ quy tắc quản lý run.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </motion.div>

              <div className="bento-col col-5">
                <motion.div variants={itemVariants} className="bento-card flex-1">
                  <h3 className="bento-title">Vùng đệm tạm &amp; Run Stack</h3>
                  <p className="bento-body mt-2">
                    • Tốn <strong>O(n)</strong> bộ nhớ phụ trong trường hợp xấu nhất cho vùng đệm tạm (
                    <em>temporary buffer</em>) khi trộn hai run lớn và <code>run stack</code>.
                    <br />• Bản Java minh họa dùng <code>runStart</code> và <code>runEnd</code> kích thước <code>n</code> để dễ quan sát cấu trúc.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="bento-card bento-card-accent flex-1">
                  <h3 className="bento-title">Timsort vs Dual-Pivot Quicksort</h3>
                  <p className="bento-body mt-2">
                    Chấp nhận tốn RAM <strong>O(n)</strong> (khác với Dual-Pivot Quicksort dùng cho kiểu nguyên thủy trong Java) để đổi lấy{' '}
                    <strong>tính ổn định (Stability)</strong> và tốc độ cực cao trên dữ liệu thực tế gần có thứ tự.
                  </p>
                </motion.div>
              </div>
            </div>
          </>
        );

      case 7:
        return (
          <>
            <div className="bento-grid bento-grid-auto">
              <motion.div
                variants={itemVariants}
                className="bento-card bento-card-accent bento-card-auto col-12"
              >
                <div className="flex-row justify-between flex-wrap gap-2">
                  <h3 className="bento-title">1. Hệ sinh thái Ngôn ngữ Lập trình &amp; Runtime</h3>
                  <div className="flex-row gap-2 flex-wrap">
                    <span className="badge-pill badge-mint">Python sort() / sorted()</span>
                    <span className="badge-pill badge-blue">Java Arrays.sort(Object[])</span>
                    <span className="badge-pill badge-mint">V8 JS Engine</span>
                    <span className="badge-pill badge-blue">Android</span>
                  </div>
                </div>
                <p className="bento-body mt-2">
                  Thuật toán sắp xếp mặc định trong <strong>Python</strong> (<code>sort()</code>,{' '}
                  <code>sorted()</code>), <strong>Java</strong> (<code>Arrays.sort(Object[])</code>,{' '}
                  <code>Collections.sort()</code>), <strong>Android</strong> và{' '}
                  <strong>V8 JavaScript Engine</strong> (Chrome, Node.js).
                </p>
              </motion.div>
            </div>

            <div className="bento-grid flex-1 min-h-0">
              <div className="bento-col col-6">
                <motion.div variants={itemVariants} className="bento-card bento-card-auto">
                  <span className="badge-pill badge-mint">2. Hệ thống thu thập Server Logs</span>
                  <p className="bento-body mt-2">
                    Ghép log từ nhiều máy chủ bị lệch nhẹ timestamp do độ trễ mạng tạo thành nhiều run gần tăng dần.
                    Timsort nhận diện nhanh và giữ nguyên thứ tự các log trùng timestamp.
                  </p>
                </motion.div>
                <motion.div variants={itemVariants} className="flex-1 min-h-0 flex">
                  <CodeBlock title="ServerLogSort.java" lang="java" code={SERVER_LOG_CODE} />
                </motion.div>
              </div>

              <div className="bento-col col-6">
                <motion.div variants={itemVariants} className="bento-card bento-card-auto">
                  <span className="badge-pill badge-blue">3. Liên hệ LeetCode 88 — Merge Sorted Array</span>
                  <p className="bento-body mt-2">
                    Tư tưởng tận dụng các đoạn đã có thứ tự thay vì sắp xếp lại từ đầu và trộn bằng 2 con trỏ trong thời gian tuyến tính{' '}
                    <code>O(m + n)</code>.
                  </p>
                </motion.div>
                <motion.div variants={itemVariants} className="flex-1 min-h-0 flex">
                  <CodeBlock title="MergeSortedRuns.java" lang="java" code={MERGE_RUNS_CODE} />
                </motion.div>
              </div>
            </div>
          </>
        );

      case 8:
        return (
          <>
            <div className="bento-grid bento-grid-auto">
              <motion.div variants={itemVariants} className="bento-card col-8">
                <div className="flex-row justify-between flex-wrap gap-2">
                  <span className="badge-pill badge-purple">
                    David R. Musser (1997) — Bảo vệ std::sort của C++ STL
                  </span>
                  <span className="mono bento-caption" style={{ color: '#DF9EFF' }}>
                    Ví dụ: [19, 7, 15, 12, 16, 18, 4, 11, 13] → [4..19]
                  </span>
                </div>
                <p className="bento-body mt-2">
                  <strong>Đặc tả bài toán:</strong> Sắp xếp mảng dựa trên phép so sánh tại chỗ (
                  <em>In-place comparison sort</em>) — vừa đạt tốc độ thực thi trung bình nhanh như Quicksort, vừa khóa chặt thời gian xấu nhất ở mức{' '}
                  <strong>O(n log n)</strong>.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-card bento-card-accent col-4">
                <span className="badge-pill badge-purple">Kiến trúc Lai</span>
                <div className="hero-stat-accent mt-1">3-in-1</div>
                <p className="bento-body mt-1">
                  <code>depth = 2⌊log₂ n⌋</code> • <code>size ≤ 16</code>
                </p>
              </motion.div>
            </div>

            <div className="bento-grid flex-1 min-h-0">
              <motion.div variants={itemVariants} className="bento-card col-6 justify-between">
                <h3 className="bento-title">Tại sao không dùng 1 thuật toán đơn lẻ?</h3>
                <div className="flex-col gap-2 mt-2 flex-1 justify-between">
                  <div className="bento-subtile">
                    <p className="bento-body">
                      <strong style={{ color: '#FF6961' }}>1. Chỉ dùng Quicksort:</strong> Trung bình rất nhanh nhưng suy biến{' '}
                      <code>O(n²)</code> và tràn stack <code>O(n)</code> khi chọn chốt xấu.
                    </p>
                  </div>
                  <div className="bento-subtile">
                    <p className="bento-body">
                      <strong style={{ color: '#FFD60A' }}>2. Chỉ dùng Heapsort:</strong> Luôn <code>O(n log n)</code> và{' '}
                      <code>O(1)</code> RAM, nhưng nhảy bộ nhớ liên tục gây <strong>Cache Miss</strong>, chậm hơn Quicksort 2–3 lần.
                    </p>
                  </div>
                  <div className="bento-subtile">
                    <p className="bento-body">
                      <strong style={{ color: '#64D2FF' }}>3. Không có Insertion Sort:</strong> Quicksort gọi đệ quy tới đoạn 1–2 phần tử → lãng phí tới{' '}
                      <strong>75% tổng số lời gọi hàm</strong> ở đáy cây đệ quy.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-card col-6 justify-between">
                <h3 className="bento-title">3 Trụ cột của Introsort</h3>
                <div className="flex-col gap-2 mt-2 flex-1 justify-between">
                  <div className="bento-subtile" style={{ borderColor: 'rgba(94,92,230,0.45)' }}>
                    <p className="bento-body">
                      <strong style={{ color: '#5AC8FA' }}>1. Quicksort (Chủ lực):</strong> Khi{' '}
                      <code>size &gt; 16</code> và <code>depth &gt; 0</code>. Dùng chốt <em>Median-of-Three</em>, duyệt tuần tự thân thiện L1/L2 CPU Cache.
                    </p>
                  </div>
                  <div className="bento-subtile" style={{ borderColor: 'rgba(191,90,242,0.5)' }}>
                    <p className="bento-body">
                      <strong style={{ color: '#BF5AF2' }}>2. Heapsort (Lưới an toàn):</strong> Khi{' '}
                      <code>size &gt; 16</code> và <code>depth == 0</code>. Vun đống tại chỗ ngay trên đoạn con bị lệch, khóa chặt cận trên{' '}
                      <code>O(n log n)</code>.
                    </p>
                  </div>
                  <div className="bento-subtile" style={{ borderColor: 'rgba(48,209,88,0.45)' }}>
                    <p className="bento-body">
                      <strong style={{ color: '#30D158' }}>3. Insertion Sort (Đoạn nhỏ):</strong> Khi{' '}
                      <code>size &lt;= 16</code>. Triệt tiêu chi phí gọi hàm đệ quy (<em>recursion overhead</em>) ở đáy cây.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        );

      case 9:
        return (
          <div className="bento-grid flex-1 min-h-0">
            <div className="bento-col col-4">
              <motion.div variants={itemVariants} className="bento-card bento-card-accent bento-card-auto">
                <span className="badge-pill badge-purple">Ngân sách độ sâu gốc</span>
                <div className="hero-stat-accent mt-2">2⌊log₂ n⌋</div>
                <p className="bento-body mt-2">
                  <code>depth_limit = 2 * floor(log2(n))</code>
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-card bento-card-auto">
                <span className="badge-pill badge-mint">Ngưỡng đoạn nhỏ</span>
                <div className="hero-stat mt-2">size ≤ 16</div>
                <p className="bento-body mt-2">Chuyển sang Insertion Sort trực tiếp, triệt tiêu chi phí đệ quy.</p>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-card flex-1">
                <h3 className="bento-title">Khử đệ quy đuôi</h3>
                <p className="bento-body mt-2">
                  Đệ quy nửa phải <code>[p + 1 .. high]</code>, rồi gán <code>high = p - 1</code> lặp{' '}
                  <code>while</code> cho nửa trái với <code>depth_limit - 1</code>.
                </p>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="bento-card col-8">
              <div className="flex-row justify-between flex-wrap gap-2">
                <h3 className="bento-title">
                  Lưu đồ điều phối <code>_introsort_util(low, high, depth_limit)</code>
                </h3>
                <span className="badge-pill badge-purple">3 Nhánh Rẽ Cốt Lõi</span>
              </div>

              <div className="flex-1 min-h-0 flex items-center justify-center mt-2">
                <svg viewBox="0 0 980 370" style={{ width: '100%', height: '100%', maxHeight: '100%' }}>
                  <defs>
                    <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L8,3 z" fill="#A1A1A6" />
                    </marker>
                    <marker id="arrow-mint" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L8,3 z" fill="#30D158" />
                    </marker>
                    <marker id="arrow-purple" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L8,3 z" fill="#BF5AF2" />
                    </marker>
                  </defs>

                  <rect x="20" y="16" width="310" height="66" rx="16" fill="#0D0D0F" stroke="#5E5CE6" strokeWidth="2" />
                  <text x="175" y="43" textAnchor="middle" fill="#F5F5F7" fontSize="14" fontWeight="700">
                    Bắt đầu _introsort_util(low, high, depth)
                  </text>
                  <text x="175" y="65" textAnchor="middle" fill="#A1A1A6" fontSize="13">
                    Tính size = high - low + 1
                  </text>

                  <line x1="175" y1="82" x2="175" y2="112" stroke="#A1A1A6" strokeWidth="2" markerEnd="url(#arrow)" />

                  <rect x="20" y="114" width="310" height="66" rx="16" fill="rgba(48,209,88,0.12)" stroke="#30D158" strokeWidth="2" />
                  <text x="175" y="141" textAnchor="middle" fill="#30D158" fontSize="14" fontWeight="700">
                    Bước 1: Kiểm tra đoạn nhỏ
                  </text>
                  <text x="175" y="163" textAnchor="middle" fill="#F5F5F7" fontSize="13">
                    size &lt;= 16 (THRESHOLD) ?
                  </text>

                  <line x1="330" y1="147" x2="432" y2="147" stroke="#30D158" strokeWidth="2" markerEnd="url(#arrow-mint)" />
                  <text x="381" y="137" textAnchor="middle" fill="#30D158" fontSize="12" fontWeight="700">
                    ĐÚNG
                  </text>

                  <rect x="436" y="114" width="524" height="66" rx="16" fill="rgba(48,209,88,0.18)" stroke="#30D158" strokeWidth="2" />
                  <text x="698" y="141" textAnchor="middle" fill="#F5F5F7" fontSize="14" fontWeight="700">
                    Insertion Sort đoạn [low..high] &amp; RETURN
                  </text>
                  <text x="698" y="163" textAnchor="middle" fill="#A7F3D0" fontSize="13">
                    Chèn trực tiếp, triệt tiêu chi phí gọi hàm đệ quy ở đáy cây
                  </text>

                  <line x1="175" y1="180" x2="175" y2="210" stroke="#A1A1A6" strokeWidth="2" markerEnd="url(#arrow)" />
                  <text x="195" y="199" fill="#A1A1A6" fontSize="12" fontWeight="700">
                    SAI
                  </text>

                  <rect x="20" y="212" width="310" height="66" rx="16" fill="rgba(191,90,242,0.14)" stroke="#BF5AF2" strokeWidth="2" />
                  <text x="175" y="239" textAnchor="middle" fill="#BF5AF2" fontSize="14" fontWeight="700">
                    Bước 2: Kiểm tra ngân sách độ sâu
                  </text>
                  <text x="175" y="261" textAnchor="middle" fill="#F5F5F7" fontSize="13">
                    depth_limit == 0 ?
                  </text>

                  <line x1="330" y1="245" x2="432" y2="245" stroke="#BF5AF2" strokeWidth="2" markerEnd="url(#arrow-purple)" />
                  <text x="381" y="235" textAnchor="middle" fill="#BF5AF2" fontSize="12" fontWeight="700">
                    ĐÚNG
                  </text>

                  <rect x="436" y="212" width="524" height="66" rx="16" fill="rgba(191,90,242,0.22)" stroke="#BF5AF2" strokeWidth="2" />
                  <text x="698" y="239" textAnchor="middle" fill="#F5F5F7" fontSize="14" fontWeight="700">
                    Heapsort đoạn con [low..high] &amp; RETURN
                  </text>
                  <text x="698" y="261" textAnchor="middle" fill="#E9D5FF" fontSize="13">
                    Vun đống tại chỗ bằng offset = low, khóa chặt cận O(n log n)
                  </text>

                  <line x1="175" y1="278" x2="175" y2="304" stroke="#A1A1A6" strokeWidth="2" markerEnd="url(#arrow)" />
                  <text x="195" y="295" fill="#A1A1A6" fontSize="12" fontWeight="700">
                    SAI
                  </text>

                  <rect x="20" y="306" width="940" height="54" rx="16" fill="rgba(41,151,255,0.16)" stroke="#2997FF" strokeWidth="2" />
                  <text x="490" y="329" textAnchor="middle" fill="#F5F5F7" fontSize="14" fontWeight="700">
                    Bước 3 (Phân hoạch chuẩn Quicksort): p = partition_median_of_three(arr, low, high)
                  </text>
                  <text x="490" y="349" textAnchor="middle" fill="#5AC8FA" fontSize="13">
                    Đệ quy nửa phải [p + 1 .. high] với (depth_limit - 1)  •  Khử đệ quy đuôi nửa trái: high = p - 1
                  </text>
                </svg>
              </div>
            </motion.div>
          </div>
        );

      case 10:
        return <IntrosortSimulator />;

      case 11:
        return (
          <div className="bento-grid flex-1 min-h-0">
            <motion.div variants={itemVariants} className="col-6 h-full min-h-0">
              <CodeBlock
                title="introsort_driver.py (Khử đệ quy đuôi)"
                lang="python"
                code={INTROSORT_PYTHON_CODE}
              />
            </motion.div>

            <div className="bento-col col-6">
              <motion.div variants={itemVariants} className="bento-card bento-card-auto">
                <h3 className="bento-title">Ánh xạ chỉ số Heap (Offset) trên đoạn con [low..high]</h3>
                <div className="bento-subgrid-2 mt-2" style={{ height: 'auto' }}>
                  <div className="bento-subtile">
                    <div className="bento-caption">Heap chuẩn (từ 0)</div>
                    <div className="mono mt-1" style={{ fontSize: 'var(--fs-code)', color: '#F5F5F7', lineHeight: 1.5 }}>
                      Cha: i &nbsp;|&nbsp; Trái: 2*i + 1
                      <br />
                      Phải: 2*i + 2
                    </div>
                  </div>
                  <div className="bento-subtile" style={{ borderColor: 'rgba(191,90,242,0.45)' }}>
                    <div className="bento-caption" style={{ color: '#BF5AF2' }}>
                      Đoạn [low..high] (offset = low)
                    </div>
                    <div className="mono mt-1" style={{ fontSize: 'var(--fs-code)', color: '#F5F5F7', lineHeight: 1.5 }}>
                      Cha: low + i &nbsp;|&nbsp; Trái: low + 2*i + 1
                      <br />
                      Phải: low + 2*i + 2
                    </div>
                  </div>
                </div>
                <p className="bento-body mt-2" style={{ color: '#30D158' }}>
                  <strong>Lợi ích cốt lõi:</strong> Tuyệt đối không dùng list slicing (<code>arr[a:b]</code>), bảo toàn bộ nhớ phụ{' '}
                  <strong>O(1)</strong>!
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex-1 min-h-0 flex">
                <CodeBlock
                  title="heapsort_subarray_offset.py"
                  lang="python"
                  code={INTROSORT_OFFSET_CODE}
                />
              </motion.div>
            </div>
          </div>
        );

      case 12:
        return (
          <>
            <div className="bento-grid bento-grid-auto">
              <motion.div variants={itemVariants} className="bento-card bento-card-accent col-4">
                <span className="badge-pill badge-purple">Cận trên mọi trường hợp</span>
                <div className="hero-stat-accent mt-2">Θ(n log n)</div>
                <p className="bento-body mt-1">
                  Chống lại chuỗi <em>Median-of-3 Killer</em>.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-card col-4">
                <span className="badge-pill badge-blue">Call Stack khóa cứng</span>
                <div className="hero-stat mt-2">Θ(log n)</div>
                <p className="bento-body mt-1">
                  Tối đa <code>2⌊log₂ n⌋ + 1</code> khung hàm.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-card col-4">
                <span className="badge-pill badge-mint">Aux RAM tại chỗ</span>
                <div className="hero-stat mt-2">Θ(1)</div>
                <p className="bento-body mt-1">Zero list slicing, chỉ dùng biến chỉ số.</p>
              </motion.div>
            </div>

            <div className="bento-grid flex-1 min-h-0">
              <motion.div variants={itemVariants} className="bento-card col-7 justify-between">
                <h3 className="bento-title">Chứng minh chặn trên Thời gian Θ(n log n)</h3>
                <div className="flex-col gap-2 mt-2 flex-1 justify-between">
                  <div className="bento-subtile">
                    <p className="bento-body">
                      <strong>• Tốt nhất:</strong>{' '}
                      <code className="mono" style={{ color: '#30D158' }}>
                        Θ(n log n)
                      </code>{' '}
                      — Phân hoạch chia đôi cân bằng ở mọi mức.
                    </p>
                  </div>
                  <div className="bento-subtile">
                    <p className="bento-body">
                      <strong>• Trung bình:</strong>{' '}
                      <code className="mono" style={{ color: '#64D2FF' }}>
                        Θ(n log n)
                      </code>{' '}
                      — Khoảng <code>≈ 1.188 n log₂(n)</code> phép so sánh nhờ Median-of-Three (thấp hơn{' '}
                      <code>1.386 n log₂(n)</code> của Quicksort ngẫu nhiên).
                    </p>
                  </div>
                  <div className="bento-subtile" style={{ borderColor: 'rgba(191,90,242,0.45)' }}>
                    <p className="bento-body">
                      <strong>• Xấu nhất (Median-of-3 Killer):</strong> 1. Quicksort tối đa{' '}
                      <code>2⌊log₂ n⌋</code> mức ⇒ <code>O(n log n)</code> • 2. Heapsort các đoạn rời nhau{' '}
                      <code>Σkᵢ ≤ n</code> ⇒ <code>O(n log n)</code> • 3. Insertion Sort đoạn{' '}
                      <code>≤ 16</code> ⇒ <code>O(n)</code>.{' '}
                      <strong style={{ color: '#BF5AF2' }}>⇒ Khóa chặt Θ(n log n).</strong>
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="bento-col col-5">
                <motion.div variants={itemVariants} className="bento-card flex-1">
                  <h3 className="bento-title" style={{ color: '#30D158' }}>
                    1. Thao tác tại chỗ: Θ(1)
                  </h3>
                  <p className="bento-body mt-2">
                    <code>partition_median_of_three</code>, <code>heapsort_subarray</code> và{' '}
                    <code>insertion_sort</code> chỉ dùng vài biến chỉ số cục bộ. Không dùng list slicing hay mảng phụ.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="bento-card bento-card-accent flex-1">
                  <h3 className="bento-title" style={{ color: '#5AC8FA' }}>
                    2. Ngăn xếp đệ quy: Θ(log n)
                  </h3>
                  <p className="bento-body mt-2">
                    Khóa cứng tối đa <code>2⌊log₂ n⌋ + 1</code> khung hàm trên Call Stack ⇒{' '}
                    <strong>Θ(log n)</strong>, chống tràn Stack <code>O(n)</code> tuyệt đối so với Quicksort truyền thống.
                  </p>
                </motion.div>
              </div>
            </div>
          </>
        );

      case 13:
        return (
          <div className="bento-grid flex-1 min-h-0">
            <div className="bento-col col-6">
              <motion.div variants={itemVariants} className="bento-card bento-card-auto">
                <div className="flex-row gap-2 flex-wrap">
                  <span className="badge-pill badge-purple">1. Sàn Thương mại điện tử</span>
                  <span className="badge-pill badge-blue">2. Request Logs (P50 / P90)</span>
                </div>
                <p className="bento-body mt-2">
                  • Sắp xếp hàng triệu sản phẩm theo <strong>&quot;Giá từ thấp đến cao&quot;</strong> tức thì nhờ tính thân thiện CPU Cache của nhánh Quicksort.
                  <br />• Khắc phục tính không ổn định (<em>Unstable</em>) khi tính P50, P90 Latency bằng khóa tuple{' '}
                  <code>(latency_ms, arrival_seq)</code>.
                </p>
              </motion.div>
              <motion.div variants={itemVariants} className="flex-1 min-h-0 flex">
                <CodeBlock title="ecommerce_and_logs.py" lang="python" code={ECOM_LOG_CODE} />
              </motion.div>
            </div>

            <div className="bento-col col-6">
              <motion.div variants={itemVariants} className="bento-card bento-card-auto">
                <span className="badge-pill badge-mint">3. LeetCode 912 — Sort an Array</span>
                <p className="bento-body mt-2">
                  Vượt qua toàn bộ test case anti-Quicksort khắc nghiệt trong thời gian đảm bảo{' '}
                  <code>O(n log n)</code> mà không dùng hàm sort có sẵn.
                </p>
              </motion.div>
              <motion.div variants={itemVariants} className="flex-1 min-h-0 flex">
                <CodeBlock title="leetcode_912_introsort.py" lang="python" code={LEETCODE_912_CODE} />
              </motion.div>
            </div>
          </div>
        );

      case 14:
        return (
          <>
            <div className="bento-grid flex-1 min-h-0">
              <motion.div
                variants={itemVariants}
                className="bento-card bento-card-accent col-5 justify-between"
              >
                <div>
                  <span className="badge-pill badge-amber">Bài toán đặt ra</span>
                  <div className="hero-stat-accent mt-2">O(1) RAM</div>
                  <h3 className="bento-title mt-2">Tại chỗ &amp; O(n log n) mọi trường hợp</h3>
                  <p className="bento-body mt-2">
                    Sắp xếp mảng <code>n</code> phần tử tăng dần ngay tại chỗ (<strong>In-place</strong>) với bộ nhớ phụ{' '}
                    <strong>O(1) tuyệt đối</strong> và đảm bảo thời gian <strong>O(n log n)</strong> ngay cả trường hợp xấu nhất.
                  </p>
                </div>
                <div className="bento-subtile mt-3">
                  <div className="bento-caption">Ví dụ minh họa</div>
                  <div
                    className="mono font-bold mt-1"
                    style={{ color: '#FFD60A', fontSize: 'var(--fs-table)' }}
                  >
                    Input : [4, 10, 3, 5, 1] → Output: [1, 3, 4, 5, 10]
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-card col-7 justify-between">
                <div>
                  <span className="badge-pill badge-amber">Ý tưởng cốt lõi</span>
                  <h3 className="bento-title mt-2">
                    Cây nhị phân hoàn chỉnh (Binary Heap) trên mảng 1 chiều
                  </h3>
                  <p className="bento-body mt-2">
                    <strong>Không dùng con trỏ!</strong> Biểu diễn cây trực tiếp trên mảng 1 chiều với nút cha tại chỉ số{' '}
                    <code>i</code>:
                  </p>
                </div>
                <div className="bento-subgrid-2 mt-3" style={{ height: 'auto' }}>
                  <div className="bento-subtile" style={{ borderColor: 'rgba(255,159,10,0.4)' }}>
                    <div className="bento-caption">Con trái của nút i</div>
                    <div
                      className="mono font-bold mt-2"
                      style={{ fontSize: '1.75rem', color: '#FF9F0A' }}
                    >
                      left = 2*i + 1
                    </div>
                  </div>
                  <div className="bento-subtile" style={{ borderColor: 'rgba(255,214,10,0.4)' }}>
                    <div className="bento-caption">Con phải của nút i</div>
                    <div
                      className="mono font-bold mt-2"
                      style={{ fontSize: '1.75rem', color: '#FFD60A' }}
                    >
                      right = 2*i + 2
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="bento-grid bento-grid-auto">
              <motion.div variants={itemVariants} className="bento-card col-6">
                <span className="badge-pill badge-amber">Giai đoạn 1</span>
                <h3 className="bento-title mt-2">Build Max-Heap (Tạo đống cực đại)</h3>
                <p className="bento-body mt-2">
                  Biến mảng ban đầu thành Max-Heap: mọi nút cha <code>≥</code> nút con, đảm bảo phần tử lớn nhất nằm ở đỉnh gốc{' '}
                  <code>arr[0]</code>.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-card col-6">
                <span className="badge-pill badge-mint">Giai đoạn 2</span>
                <h3 className="bento-title mt-2">Extract &amp; Sift-down (Rút gốc &amp; Vun lại đống)</h3>
                <p className="bento-body mt-2">
                  Hoán đổi <code>arr[0]</code> về cuối mảng (khóa vị trí đã xếp), giảm kích thước Heap đi 1, gọi{' '}
                  <code>sift_down</code> đưa phần tử lớn tiếp theo lên gốc.
                </p>
              </motion.div>
            </div>
          </>
        );

      case 15:
        return <HeapsortSimulator />;

      case 16:
        return (
          <div className="bento-grid flex-1 min-h-0">
            <div className="bento-col col-7">
              <motion.div variants={itemVariants} className="flex-1 min-h-0 flex">
                <CodeBlock title="heapsort_iterative.py" lang="python" code={HEAPSORT_PYTHON_CODE} />
              </motion.div>
              <motion.div variants={itemVariants} className="bento-card bento-card-auto">
                <div className="flex-row justify-between items-center flex-wrap gap-2">
                  <span className="badge-pill badge-mint">Kết quả Console</span>
                  <code className="mono" style={{ fontSize: 'var(--fs-code)', color: '#FFD60A' }}>
                    heap_sort([4, 10, 3, 5, 1]) → Output: [1, 3, 4, 5, 10]
                  </code>
                </div>
              </motion.div>
            </div>

            <div className="bento-col col-5">
              <motion.div
                variants={itemVariants}
                className="bento-card bento-card-accent flex-1 justify-between"
              >
                <div>
                  <span className="badge-pill badge-amber">Điểm nhấn kỹ thuật: while True</span>
                  <h3 className="bento-title mt-2">Khử đệ quy triệt tiêu Stack Overflow</h3>
                </div>
                <p className="bento-body mt-2">
                  Thay vì gọi đệ quy <code>sift_down</code> tốn khung hàm trên Call Stack, vòng lặp{' '}
                  <code>while True</code> trượt trực tiếp từ nút cha <code>i</code> xuống con{' '}
                  <code>largest</code>, đạt chuẩn <strong>O(1) RAM phụ tuyệt đối</strong>.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-card flex-1 justify-between">
                <h3 className="bento-title">
                  Cấu trúc 2 vòng lặp trong <code>heap_sort()</code>
                </h3>
                <p className="bento-body mt-2">
                  • <strong>Vòng 1 (Build Max-Heap):</strong> Duyệt ngược từ nút cha cuối <code>n // 2 - 1</code> về{' '}
                  <code>0</code> (các nút từ <code>n // 2</code> trở đi là lá).
                  <br />• <strong>Vòng 2 (Extract):</strong> Đổi đỉnh <code>arr[0]</code> với cuối Heap{' '}
                  <code>arr[i]</code> và gọi <code>sift_down(arr, i, 0)</code>.
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 17:
        return (
          <>
            <div className="bento-grid bento-grid-auto">
              <motion.div variants={itemVariants} className="bento-card col-4">
                <span className="badge-pill badge-mint">Build Max-Heap</span>
                <div className="hero-stat mt-2">O(n)</div>
                <p className="bento-body mt-1">Một nửa số nút là lá có chiều cao 0.</p>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-card col-4">
                <span className="badge-pill badge-amber">Worst &amp; Average</span>
                <div className="hero-stat mt-2">O(n log n)</div>
                <p className="bento-body mt-1">
                  Rút gốc lặp <code>n - 1</code> lần × <code>O(log n)</code>.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-card bento-card-accent col-4">
                <span className="badge-pill badge-amber">Không gian Tuyệt đối</span>
                <div className="hero-stat-accent mt-2">O(1) RAM</div>
                <p className="bento-body mt-1">Không mảng phụ, không Call Stack.</p>
              </motion.div>
            </div>

            <div className="bento-grid flex-1 min-h-0">
              <motion.div variants={itemVariants} className="bento-card col-8">
                <h3 className="bento-title">Độ phức tạp Thời gian (Time Complexity)</h3>
                <table className="data-table data-table-compact mt-1">
                  <thead>
                    <tr>
                      <th>Thành phần / Trường hợp</th>
                      <th>Độ phức tạp</th>
                      <th>Phân tích chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-bold cell-nowrap">Build Max-Heap</td>
                      <td className="mono font-bold cell-nowrap" style={{ color: '#30D158' }}>
                        O(n)
                      </td>
                      <td>Nhờ chuỗi hội tụ chiều cao cây: một nửa số nút là lá có chiều cao 0.</td>
                    </tr>
                    <tr>
                      <td className="font-bold cell-nowrap">Rút gốc (Extract)</td>
                      <td className="mono font-bold cell-nowrap" style={{ color: '#FFD60A' }}>
                        O(n log n)
                      </td>
                      <td>
                        Lặp <code>n - 1</code> lần, mỗi lần <code>sift_down</code> tối đa hết chiều cao cây{' '}
                        <code>O(log n)</code>.
                      </td>
                    </tr>
                    <tr className="row-highlight">
                      <td className="font-bold cell-nowrap">Worst &amp; Average</td>
                      <td className="mono font-bold cell-nowrap" style={{ color: '#FF9F0A' }}>
                        O(n log n)
                      </td>
                      <td>
                        Xấu nhất khi phần tử nhỏ ở đáy đưa lên đỉnh phải trượt hết chiều cao <code>log₂ n</code>.
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold cell-nowrap">Best Case</td>
                      <td className="mono font-bold cell-nowrap" style={{ color: '#64D2FF' }}>
                        Θ(n log n) / Θ(n)*
                      </td>
                      <td>
                        <code>Θ(n log n)</code> với phần tử phân biệt; đạt <code>Θ(n)</code> khi{' '}
                        <strong>mọi phần tử bằng nhau</strong> (VD: <code>[5, 5, 5, 5]</code>) vì{' '}
                        <code>sift_down</code> thoát ngay ở <code>break</code> đầu tiên.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bento-card bento-card-accent col-4 justify-between"
              >
                <div>
                  <span className="badge-pill badge-amber">Nhà vô địch tiết kiệm RAM</span>
                  <h3 className="bento-title mt-2">Sắp xếp tại chỗ thuần túy</h3>
                  <p className="bento-body mt-2">
                    Sắp xếp hoàn toàn tại chỗ (<em>In-place</em>) trên mảng gốc, chỉ dùng vài biến chỉ số cục bộ (
                    <code>i, left, right, largest</code>).
                  </p>
                </div>
                <div className="bento-subtile mt-3">
                  <p className="bento-body">
                    Không tốn <code>O(n)</code> RAM như Merge Sort, cũng không tốn <code>O(log n)</code> hay{' '}
                    <code>O(n)</code> Call Stack như QuickSort.
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        );

      case 18:
        return (
          <div className="bento-grid flex-1 min-h-0">
            <div className="bento-col col-6">
              <motion.div variants={itemVariants} className="bento-card bento-card-accent flex-1">
                <div className="flex-row justify-between items-center gap-2">
                  <span className="badge-pill badge-amber">1. Linux Kernel &amp; Hệ thống nhúng</span>
                  <span className="mono bento-caption" style={{ color: '#FFD60A' }}>
                    lib/sort.c
                  </span>
                </div>
                <div className="hero-stat-accent mt-2">8–16 KB Stack</div>
                <h3 className="bento-title mt-2">
                  <code>linux/lib/sort.c</code> chọn Heap Sort
                </h3>
                <p className="bento-body mt-2">
                  • <strong>Kernel Stack cực nhỏ:</strong> Chỉ vỏn vẹn <strong>8 KB – 16 KB</strong>.
                  <br />• <strong>An toàn tuyệt đối:</strong> QuickSort đệ quy dễ gây tràn Stack dẫn tới{' '}
                  <strong>Kernel Panic</strong> hoặc bị tấn công DoS <code>O(n²)</code>.
                  <br />• Heap Sort với <strong>O(1) RAM</strong> và cam kết <strong>O(n log n)</strong> là chốt chặn an toàn tuyệt đối.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-card flex-1">
                <div className="flex-row justify-between items-center gap-2">
                  <span className="badge-pill badge-blue">2. Priority Queue • LeetCode 215</span>
                  <span className="mono font-bold" style={{ color: '#5AC8FA', fontSize: '1.15rem' }}>
                    O(n log k)
                  </span>
                </div>
                <h3 className="bento-title mt-2">Kth Largest Element in an Array</h3>
                <p className="bento-body mt-2">
                  Duy trì một <strong>Min-Heap kích thước k</strong> để lọc ra <code>k</code> phần tử lớn nhất trong thời gian{' '}
                  <strong>O(n log k)</strong> thay vì phải sort toàn bộ mảng <code>O(n log n)</code>.
                </p>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="col-6 h-full min-h-0">
              <CodeBlock
                title="leetcode_215_kth_largest.py"
                lang="python"
                code={LEETCODE_215_CODE}
              />
            </motion.div>
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
          <h1 className="slide-title">{slide.title}</h1>
          <div className="slide-meta-row">
            <p className="slide-subtitle">{slide.subtitle}</p>
            <span className="slide-kicker">
              Slide {String(slide.id).padStart(2, '0')} / 19 • {slide.duration}
            </span>
          </div>
        </header>
      )}
      <motion.div
        className="slide-body"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {renderSlideBody()}
      </motion.div>
    </>
  );
}
