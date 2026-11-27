import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import {
  TIMSORT_PYTHON_TABS,
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

const SERVER_LOG_CODE = `class LogEntry:
    def __init__(self, timestamp: float, message: str):
        self.timestamp = timestamp
        self.message = message

# Ghép log từ nhiều máy chủ lệch nhẹ timestamp -> nhiều run gần tăng dần
# list.sort() dùng Timsort: vừa nhanh O(n), vừa giữ thứ tự log trùng timestamp
logs.sort(key=lambda entry: entry.timestamp)`;

const MERGE_RUNS_CODE = `# Liên hệ LeetCode 88 (Merge Sorted Array): Gộp 2 run đã sắp xếp trong O(m + n)
def merge_sorted_runs(a: list[int], b: list[int]) -> list[int]:
    out = []
    i, j = 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:  # <= giữ tính ổn định (ưu tiên phần tử bên trái)
            out.append(a[i])
            i += 1
        else:
            out.append(b[j])
            j += 1
    out.extend(a[i:])
    out.extend(b[j:])
    return out`;

const HS16_STEPS = [
  { label: 'Mảng gốc', heap: [4, 10, 3, 5, 1], sorted: [], rootHighlight: false, focus: null },
  { label: 'Build Max-Heap', heap: [10, 5, 3, 4, 1], sorted: [], rootHighlight: true, focus: 'build' },
  { label: 'Extract lần 1', heap: [5, 4, 3, 1], sorted: [10], rootHighlight: true, focus: 'extract' },
  { label: 'Extract lần 2', heap: [4, 1, 3], sorted: [5, 10], rootHighlight: true, focus: 'extract' },
  { label: 'Hoàn tất', heap: [], sorted: [1, 3, 4, 5, 10], rootHighlight: false, focus: null },
];

const HS17C_PYRAMID_LEVELS = [
  {
    cls: 'l0',
    label: 'Đỉnh (1 nút)',
    steps: '≤ log n bước',
    note: '<strong>Đỉnh (1 nút):</strong> Chỉ có duy nhất 1 nút phải trượt hết chiều cao log₂n.',
  },
  {
    cls: 'l1',
    label: '12.5% số nút',
    steps: '≤ 2 bước',
    note: '<strong>Tầng trên (12.5% số nút):</strong> Số lượng ít, chỉ trượt tối đa 2 tầng.',
  },
  {
    cls: 'l2',
    label: '25% số nút',
    steps: '≤ 1 bước',
    note: '<strong>Tầng áp đáy (25% số nút):</strong> Nhiều nút hơn nhưng chỉ trượt tối đa 1 bước.',
  },
  {
    cls: 'l3',
    label: '50% số nút (Nút lá)',
    steps: '0 bước',
    note: '<strong>Tầng đáy (50% số nút là lá):</strong> Không cần sift_down → 0 bước. Tổng chuỗi hội tụ = O(n)!',
  },
];

const HS17C_CASE_TEXTS = {
  distinct:
    'Với mảng phân biệt (kể cả đã sắp xếp sẵn), Heap Sort vẫn mất <code>Θ(n log n)</code> vì luôn phải rút đỉnh và đẩy phần tử nhỏ từ đáy lên để <code>sift_down</code> lại.',
  equal:
    'Khi mọi phần tử bằng nhau (VD: <code>[5, 5, 5, 5]</code>), <code>sift_down</code> thoát ngay ở lệnh <code>break</code> đầu tiên (O(1)/lần) → tổng thời gian giảm xuống <code>Θ(n)</code>.',
};

const HS17C_RAM_SCALES = {
  1: { n: '100', mW: '18%', mV: '~800 Bytes', qW: '10%', qV: '~500 Bytes' },
  2: { n: '10,000', mW: '48%', mV: '~80 KB', qW: '22%', qV: '~1.2 KB' },
  3: { n: '100,000', mW: '75%', mV: '~800 KB', qW: '34%', qV: '~1.6 KB (Worst: 800 KB)' },
  4: { n: '1,000,000', mW: '100%', mV: '~8 MB', qW: '46%', qV: '~2 KB (Worst: 8 MB)' },
};

const HS17_NUMS = [3, 2, 1, 5, 6, 4];

const HS17_LC_STEPS = [
  {
    currIdx: -1,
    skipped: [],
    doneIn: [0, 1],
    heap: [2, 3],
    line: 'init',
    kicked: 'Khởi tạo 2 số đầu',
    msg: 'Lấy <strong>[3, 2]</strong> và <code>heapify</code> → đỉnh gác cổng <code>min_heap[0] = 2</code>.',
  },
  {
    currIdx: 2,
    skipped: [2],
    doneIn: [0, 1],
    heap: [2, 3],
    line: 'check',
    kicked: '<span class="out">Bỏ qua 1</span> (1 ≤ 2)',
    msg: 'Xét <strong>1</strong>: Nhỏ hơn gác cổng <strong>2</strong> → Bỏ qua, không cần đụng vào Heap.',
  },
  {
    currIdx: 3,
    skipped: [2],
    doneIn: [0, 1, 3],
    heap: [3, 5],
    line: 'replace',
    kicked: 'Đá <span class="out">2</span> • Nạp <span class="in">5</span>',
    msg: 'Xét <strong>5</strong>: Lớn hơn <strong>2</strong> → <code>heapreplace</code> đá 2 ra, nạp 5 vào.',
  },
  {
    currIdx: 4,
    skipped: [2],
    doneIn: [0, 1, 3, 4],
    heap: [5, 6],
    line: 'replace',
    kicked: 'Đá <span class="out">3</span> • Nạp <span class="in">6</span>',
    msg: 'Xét <strong>6</strong>: Lớn hơn <strong>3</strong> → <code>heapreplace</code> đá 3 ra, nạp 6 vào.',
  },
  {
    currIdx: 5,
    skipped: [2, 5],
    doneIn: [0, 1, 3, 4],
    heap: [5, 6],
    line: 'check',
    kicked: '<span class="out">Bỏ qua 4</span> (4 ≤ 5)',
    msg: 'Xét <strong>4</strong>: Nhỏ hơn gác cổng <strong>5</strong> → Bỏ qua.',
  },
  {
    currIdx: -1,
    skipped: [2, 5],
    doneIn: [0, 1, 3, 4],
    heap: [5, 6],
    line: 'return',
    winner: true,
    kicked: 'Đáp án: <span class="in">5</span>',
    msg: 'Hoàn tất! Trả về <code>min_heap[0] = 5</code> chính là <strong>số lớn thứ 2</strong>.',
  },
];

export default function SlideRenderer({ slide, onNextSlide }) {
  const [timsortTab, setTimsortTab] = useState('full');
  const [hs16Focus, setHs16Focus] = useState(null);
  const [hs16StepIdx, setHs16StepIdx] = useState(0);
  const [hs17PyramidLvl, setHs17PyramidLvl] = useState(3);
  const [hs17BestCase, setHs17BestCase] = useState('distinct');
  const [hs17RamScale, setHs17RamScale] = useState(2);
  const [hs17IsDos, setHs17IsDos] = useState(false);
  const [hs17LcIdx, setHs17LcIdx] = useState(0);

  useEffect(() => {
    if (slide.id !== 16 && slide.id !== 18) return undefined;
    const onKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
      if (slide.id === 16) {
        if (e.key === '1') setHs16Focus((prev) => (prev === 'iter' ? null : 'iter'));
        else if (e.key === '2') setHs16Focus((prev) => (prev === 'build' ? null : 'build'));
        else if (e.key === '3') setHs16Focus((prev) => (prev === 'extract' ? null : 'extract'));
        else if (e.key === '0' || e.key === 'Escape') setHs16Focus(null);
      } else if (slide.id === 18) {
        if (e.key.toLowerCase() === 'd') setHs17IsDos((prev) => !prev);
        else if (e.key.toLowerCase() === 'k') {
          setHs17LcIdx((prev) => (prev + 1) % HS17_LC_STEPS.length);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [slide.id]);

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
                      color: '#6B5B7B',
                      WebkitTextFillColor: '#6B5B7B',
                      marginTop: '6px',
                    }}
                  >
                    (PRODUCTION SORTING ALGORITHMS)
                  </span>
                </h1>
                <p className="bento-body mt-3" style={{ maxWidth: '960px' }}>
                  Phân tích, Mô phỏng &amp; Ứng dụng của{' '}
                  <strong style={{ color: '#DB2777' }}>Timsort</strong>,{' '}
                  <strong style={{ color: '#7C3AED' }}>Introsort</strong> và{' '}
                  <strong style={{ color: '#EA580C' }}>Heap Sort</strong>
                </p>
                <div className="bento-subtile flex-row justify-between flex-wrap gap-3 mt-3">
                  <span className="bento-body" style={{ color: '#6B5B7B' }}>
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
                style={{ borderColor: 'rgba(219,39,119,0.32)' }}
              >
                <div className="flex-row justify-between gap-2">
                  <span className="badge-pill badge-mint">Timsort (Tim Peters, 2002)</span>
                  <span className="mono bento-caption" style={{ color: '#DB2777' }}>
                    Stable
                  </span>
                </div>
                <div
                  className="hero-stat mt-3"
                  style={{
                    background: 'linear-gradient(135deg,#DB2777,#F43F5E)',
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
                style={{ borderColor: 'rgba(124,58,237,0.34)' }}
              >
                <div className="flex-row justify-between gap-2">
                  <span className="badge-pill badge-purple">Introsort (David R. Musser, 1997)</span>
                  <span className="mono bento-caption" style={{ color: '#7C3AED' }}>
                    In-place
                  </span>
                </div>
                <div
                  className="hero-stat mt-3"
                  style={{
                    background: 'linear-gradient(135deg,#7C3AED,#A855F7)',
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
                style={{ borderColor: 'rgba(234,88,12,0.34)' }}
              >
                <div className="flex-row justify-between gap-2">
                  <span className="badge-pill badge-amber">Heap Sort (Binary Heap)</span>
                  <span className="mono bento-caption" style={{ color: '#EA580C' }}>
                    No Stack
                  </span>
                </div>
                <div
                  className="hero-stat mt-3"
                  style={{
                    background: 'linear-gradient(135deg,#EA580C,#F97316)',
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
                style={{ borderColor: 'rgba(225,29,72,0.32)' }}
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
                style={{ borderColor: 'rgba(234,88,12,0.34)' }}
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
                style={{ borderColor: 'rgba(124,58,237,0.34)' }}
              >
                <span className="badge-pill badge-purple">Góc khuất #3 • Dữ liệu đời thực</span>
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
                  <strong style={{ color: '#DB2777' }}>Timsort</strong> (khai thác natural runs + ổn định),{' '}
                  <strong style={{ color: '#7C3AED' }}>Introsort</strong> (tốc độ RAM + lưới an toàn Heapsort) và{' '}
                  <strong style={{ color: '#EA580C' }}>Heap Sort</strong> (chuẩn <code>O(1)</code> RAM tuyệt đối).
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
                  • <strong>Input:</strong> Danh sách <code>n</code> phần tử (số, chuỗi, hoặc Object qua hàm khóa{' '}
                  <code>key=...</code> trong Python).
                  <br />• <strong>Ví dụ:</strong> <code>[5, 2, 3, 1, 4]</code> → <code>[1, 2, 3, 4, 5]</code>.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bento-card flex-1"
                style={{ borderColor: 'rgba(219,39,119,0.32)' }}
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
        const activeTab =
          TIMSORT_PYTHON_TABS.find((t) => t.id === timsortTab) || TIMSORT_PYTHON_TABS[0];
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
                    {TIMSORT_PYTHON_TABS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className={`tab-btn ${timsortTab === t.id ? 'active' : ''}`}
                        onClick={() => setTimsortTab(t.id)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <span className="badge-pill badge-mint">Python 3+ • MIN_RUN = 4</span>
                </div>
              </motion.div>
            </div>

            <div className="bento-grid flex-1 min-h-0">
              <motion.div variants={itemVariants} className="col-7 h-full min-h-0">
                <CodeBlock title="timsort_demo.py" lang="python" code={activeTab.code} />
              </motion.div>

              <div className="bento-col col-5">
                <motion.div variants={itemVariants} className="bento-card bento-card-auto">
                  <h3 className="bento-title">Giải thích hàm đang xem</h3>
                  <p className="bento-body mt-2">{activeTab.description}</p>
                </motion.div>

                <motion.div variants={itemVariants} className="bento-card bento-card-auto">
                  <span className="badge-pill badge-mint">Kết quả Console</span>
                  <pre
                    className="mono mt-2"
                    style={{
                      fontSize: 'var(--fs-code)',
                      color: '#BE185D',
                      background: '#FFF5F9',
                      padding: '8px 12px',
                      borderRadius: '14px',
                      border: '1px solid rgba(219,39,119,0.26)',
                      lineHeight: 1.45,
                    }}
                  >
                    {`Input : [3, 5, 7, 2, 4, 6, 9, 1, 8, 10]\nOutput: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`}
                  </pre>
                </motion.div>

                <motion.div variants={itemVariants} className="bento-card bento-card-accent flex-1">
                  <h3 className="bento-title">Lưu ý kỹ thuật &amp; Tính ổn định</h3>
                  <p className="bento-body mt-2">
                    • Dùng <code>arr[j] &gt; key</code> (thay vì <code>&gt;=</code>) trong{' '}
                    <code>insertion_sort</code> và <code>arr[i] &lt;= arr[j]</code> trong <code>merge</code> để giữ nguyên thứ tự các khóa bằng nhau.
                    <br />• Bản sản xuất CPython (<code>listobject.c</code>) bổ sung đảo run giảm dần, bất biến merge stack và galloping mode.
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
                      <td className="mono font-bold" style={{ color: '#DB2777' }}>
                        O(n)
                      </td>
                      <td>
                        Mảng đã tăng dần, chỉ quét 1 lượt phát hiện 1 run duy nhất, không cần merge (VD: danh sách giao dịch theo thời gian).
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold">Trung bình (Avg)</td>
                      <td className="mono font-bold" style={{ color: '#7C3AED' }}>
                        O(n log n)
                      </td>
                      <td>
                        Dữ liệu ngẫu nhiên hoặc bán sắp xếp, gộp qua khoảng <code>~log n</code> tầng; các run dài giúp giảm mạnh số lần gộp.
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold">Xấu nhất (Worst)</td>
                      <td className="mono font-bold" style={{ color: '#EA580C' }}>
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
                    <br />• Bản Python minh họa lưu danh sách <code>runs</code> dạng <code>(start, end)</code> và danh sách đệm <code>temp</code> khi trộn để dễ quan sát cấu trúc.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="bento-card bento-card-accent flex-1">
                  <h3 className="bento-title">Timsort vs Dual-Pivot Quicksort</h3>
                  <p className="bento-body mt-2">
                    Chấp nhận tốn RAM <strong>O(n)</strong> (khác với Quicksort tại chỗ cho kiểu nguyên thủy) để đổi lấy{' '}
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
                  Thuật toán sắp xếp mặc định trong <strong>Python</strong> (<code>list.sort()</code>,{' '}
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
                  <CodeBlock title="server_log_sort.py" lang="python" code={SERVER_LOG_CODE} />
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
                  <CodeBlock title="merge_sorted_runs.py" lang="python" code={MERGE_RUNS_CODE} />
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
                  <span className="mono bento-caption" style={{ color: '#7C3AED' }}>
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
                      <strong style={{ color: '#E11D48' }}>1. Chỉ dùng Quicksort:</strong> Trung bình rất nhanh nhưng suy biến{' '}
                      <code>O(n²)</code> và tràn stack <code>O(n)</code> khi chọn chốt xấu.
                    </p>
                  </div>
                  <div className="bento-subtile">
                    <p className="bento-body">
                      <strong style={{ color: '#EA580C' }}>2. Chỉ dùng Heapsort:</strong> Luôn <code>O(n log n)</code> và{' '}
                      <code>O(1)</code> RAM, nhưng nhảy bộ nhớ liên tục gây <strong>Cache Miss</strong>, chậm hơn Quicksort 2–3 lần.
                    </p>
                  </div>
                  <div className="bento-subtile">
                    <p className="bento-body">
                      <strong style={{ color: '#7C3AED' }}>3. Không có Insertion Sort:</strong> Quicksort gọi đệ quy tới đoạn 1–2 phần tử → lãng phí tới{' '}
                      <strong>75% tổng số lời gọi hàm</strong> ở đáy cây đệ quy.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-card col-6 justify-between">
                <h3 className="bento-title">3 Trụ cột của Introsort</h3>
                <div className="flex-col gap-2 mt-2 flex-1 justify-between">
                  <div className="bento-subtile" style={{ borderColor: 'rgba(124,58,237,0.34)' }}>
                    <p className="bento-body">
                      <strong style={{ color: '#7C3AED' }}>1. Quicksort (Chủ lực):</strong> Khi{' '}
                      <code>size &gt; 16</code> và <code>depth &gt; 0</code>. Dùng chốt <em>Median-of-Three</em>, duyệt tuần tự thân thiện L1/L2 CPU Cache.
                    </p>
                  </div>
                  <div className="bento-subtile" style={{ borderColor: 'rgba(234,88,12,0.36)' }}>
                    <p className="bento-body">
                      <strong style={{ color: '#EA580C' }}>2. Heapsort (Lưới an toàn):</strong> Khi{' '}
                      <code>size &gt; 16</code> và <code>depth == 0</code>. Vun đống tại chỗ ngay trên đoạn con bị lệch, khóa chặt cận trên{' '}
                      <code>O(n log n)</code>.
                    </p>
                  </div>
                  <div className="bento-subtile" style={{ borderColor: 'rgba(219,39,119,0.34)' }}>
                    <p className="bento-body">
                      <strong style={{ color: '#DB2777' }}>3. Insertion Sort (Đoạn nhỏ):</strong> Khi{' '}
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
                      <path d="M0,0 L0,6 L8,3 z" fill="#6B5B7B" />
                    </marker>
                    <marker id="arrow-mint" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L8,3 z" fill="#DB2777" />
                    </marker>
                    <marker id="arrow-purple" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L8,3 z" fill="#EA580C" />
                    </marker>
                  </defs>

                  <rect x="20" y="16" width="310" height="66" rx="16" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="2" />
                  <text x="175" y="43" textAnchor="middle" fill="#1F1630" fontSize="14" fontWeight="700">
                    Bắt đầu _introsort_util(low, high, depth)
                  </text>
                  <text x="175" y="65" textAnchor="middle" fill="#6B5B7B" fontSize="13">
                    Tính size = high - low + 1
                  </text>

                  <line x1="175" y1="82" x2="175" y2="112" stroke="#6B5B7B" strokeWidth="2" markerEnd="url(#arrow)" />

                  <rect x="20" y="114" width="310" height="66" rx="16" fill="#FFF5F9" stroke="#DB2777" strokeWidth="2" />
                  <text x="175" y="141" textAnchor="middle" fill="#BE185D" fontSize="14" fontWeight="700">
                    Bước 1: Kiểm tra đoạn nhỏ
                  </text>
                  <text x="175" y="163" textAnchor="middle" fill="#1F1630" fontSize="13">
                    size &lt;= 16 (THRESHOLD) ?
                  </text>

                  <line x1="330" y1="147" x2="432" y2="147" stroke="#DB2777" strokeWidth="2" markerEnd="url(#arrow-mint)" />
                  <text x="381" y="137" textAnchor="middle" fill="#DB2777" fontSize="12" fontWeight="700">
                    ĐÚNG
                  </text>

                  <rect x="436" y="114" width="524" height="66" rx="16" fill="#FCE7F3" stroke="#DB2777" strokeWidth="2" />
                  <text x="698" y="141" textAnchor="middle" fill="#831843" fontSize="14" fontWeight="700">
                    Insertion Sort đoạn [low..high] &amp; RETURN
                  </text>
                  <text x="698" y="163" textAnchor="middle" fill="#BE185D" fontSize="13">
                    Chèn trực tiếp, triệt tiêu chi phí gọi hàm đệ quy ở đáy cây
                  </text>

                  <line x1="175" y1="180" x2="175" y2="210" stroke="#6B5B7B" strokeWidth="2" markerEnd="url(#arrow)" />
                  <text x="195" y="199" fill="#6B5B7B" fontSize="12" fontWeight="700">
                    SAI
                  </text>

                  <rect x="20" y="212" width="310" height="66" rx="16" fill="#FFF7F0" stroke="#EA580C" strokeWidth="2" />
                  <text x="175" y="239" textAnchor="middle" fill="#C2410C" fontSize="14" fontWeight="700">
                    Bước 2: Kiểm tra ngân sách độ sâu
                  </text>
                  <text x="175" y="261" textAnchor="middle" fill="#1F1630" fontSize="13">
                    depth_limit == 0 ?
                  </text>

                  <line x1="330" y1="245" x2="432" y2="245" stroke="#EA580C" strokeWidth="2" markerEnd="url(#arrow-purple)" />
                  <text x="381" y="235" textAnchor="middle" fill="#EA580C" fontSize="12" fontWeight="700">
                    ĐÚNG
                  </text>

                  <rect x="436" y="212" width="524" height="66" rx="16" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2" />
                  <text x="698" y="239" textAnchor="middle" fill="#9A3412" fontSize="14" fontWeight="700">
                    Heapsort đoạn con [low..high] &amp; RETURN
                  </text>
                  <text x="698" y="261" textAnchor="middle" fill="#C2410C" fontSize="13">
                    Vun đống tại chỗ bằng offset = low, khóa chặt cận O(n log n)
                  </text>

                  <line x1="175" y1="278" x2="175" y2="304" stroke="#6B5B7B" strokeWidth="2" markerEnd="url(#arrow)" />
                  <text x="195" y="295" fill="#6B5B7B" fontSize="12" fontWeight="700">
                    SAI
                  </text>

                  <rect x="20" y="306" width="940" height="54" rx="16" fill="#F3E8FF" stroke="#7C3AED" strokeWidth="2" />
                  <text x="490" y="329" textAnchor="middle" fill="#4C1D95" fontSize="14" fontWeight="700">
                    Bước 3 (Phân hoạch chuẩn Quicksort): p = partition_median_of_three(arr, low, high)
                  </text>
                  <text x="490" y="349" textAnchor="middle" fill="#6D28D9" fontSize="13">
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
                    <div className="mono mt-1" style={{ fontSize: 'var(--fs-code)', color: '#1F1630', lineHeight: 1.5 }}>
                      Cha: i &nbsp;|&nbsp; Trái: 2*i + 1
                      <br />
                      Phải: 2*i + 2
                    </div>
                  </div>
                  <div className="bento-subtile" style={{ borderColor: 'rgba(124,58,237,0.36)' }}>
                    <div className="bento-caption" style={{ color: '#7C3AED' }}>
                      Đoạn [low..high] (offset = low)
                    </div>
                    <div className="mono mt-1" style={{ fontSize: 'var(--fs-code)', color: '#1F1630', lineHeight: 1.5 }}>
                      Cha: low + i &nbsp;|&nbsp; Trái: low + 2*i + 1
                      <br />
                      Phải: low + 2*i + 2
                    </div>
                  </div>
                </div>
                <p className="bento-body mt-2" style={{ color: '#DB2777' }}>
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
                      <code className="mono" style={{ color: '#DB2777' }}>
                        Θ(n log n)
                      </code>{' '}
                      — Phân hoạch chia đôi cân bằng ở mọi mức.
                    </p>
                  </div>
                  <div className="bento-subtile">
                    <p className="bento-body">
                      <strong>• Trung bình:</strong>{' '}
                      <code className="mono" style={{ color: '#EA580C' }}>
                        Θ(n log n)
                      </code>{' '}
                      — Khoảng <code>≈ 1.188 n log₂(n)</code> phép so sánh nhờ Median-of-Three (thấp hơn{' '}
                      <code>1.386 n log₂(n)</code> của Quicksort ngẫu nhiên).
                    </p>
                  </div>
                  <div className="bento-subtile" style={{ borderColor: 'rgba(124,58,237,0.36)' }}>
                    <p className="bento-body">
                      <strong>• Xấu nhất (Median-of-3 Killer):</strong> 1. Quicksort tối đa{' '}
                      <code>2⌊log₂ n⌋</code> mức ⇒ <code>O(n log n)</code> • 2. Heapsort các đoạn rời nhau{' '}
                      <code>Σkᵢ ≤ n</code> ⇒ <code>O(n log n)</code> • 3. Insertion Sort đoạn{' '}
                      <code>≤ 16</code> ⇒ <code>O(n)</code>.{' '}
                      <strong style={{ color: '#7C3AED' }}>⇒ Khóa chặt Θ(n log n).</strong>
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="bento-col col-5">
                <motion.div variants={itemVariants} className="bento-card flex-1">
                  <h3 className="bento-title" style={{ color: '#DB2777' }}>
                    1. Thao tác tại chỗ: Θ(1)
                  </h3>
                  <p className="bento-body mt-2">
                    <code>partition_median_of_three</code>, <code>heapsort_subarray</code> và{' '}
                    <code>insertion_sort</code> chỉ dùng vài biến chỉ số cục bộ. Không dùng list slicing hay mảng phụ.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="bento-card bento-card-accent flex-1">
                  <h3 className="bento-title" style={{ color: '#7C3AED' }}>
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
                    style={{ color: '#EA580C', fontSize: 'var(--fs-table)' }}
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
                  <div className="bento-subtile" style={{ borderColor: 'rgba(234,88,12,0.34)' }}>
                    <div className="bento-caption">Con trái của nút i</div>
                    <div
                      className="mono font-bold mt-2"
                      style={{ fontSize: '1.75rem', color: '#EA580C' }}
                    >
                      left = 2*i + 1
                    </div>
                  </div>
                  <div className="bento-subtile" style={{ borderColor: 'rgba(219,39,119,0.34)' }}>
                    <div className="bento-caption">Con phải của nút i</div>
                    <div
                      className="mono font-bold mt-2"
                      style={{ fontSize: '1.75rem', color: '#DB2777' }}
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

      case 16: {
        const s = HS16_STEPS[hs16StepIdx] || HS16_STEPS[0];
        const toggleFocus = (group) => setHs16Focus((prev) => (prev === group ? null : group));
        const handleNextHs16Step = () => {
          const nextIdx = (hs16StepIdx + 1) % HS16_STEPS.length;
          setHs16StepIdx(nextIdx);
          setHs16Focus(HS16_STEPS[nextIdx].focus || null);
        };

        return (
          <div className="hs16-grid">
            <motion.div variants={itemVariants} className="hs16-code-window">
              <div className="hs16-code-topbar">
                <div className="hs16-dots">
                  <span className="hs16-dot r" />
                  <span className="hs16-dot y" />
                  <span className="hs16-dot g" />
                </div>
                <span>heapsort_iterative.py</span>
                <span className="hs16-lang-badge">PYTHON</span>
              </div>

              <div className={`hs16-code-body${hs16Focus ? ` has-focus focus-${hs16Focus}` : ''}`}>
                <div className="hs16-code-line">
                  <span className="hs16-kw">def</span> <span className="hs16-fn">sift_down</span>(arr, n, i):
                </div>
                <div className="hs16-code-line" data-group="iter">
                  {'    '}
                  <span className="hs16-kw">while True</span>:{'  '}
                  <span className="hs16-cm"># Khử đệ quy -&gt; O(1) RAM</span>
                </div>
                <div className="hs16-code-line" data-group="iter">
                  {'        '}largest = i
                </div>
                <div className="hs16-code-line" data-group="iter">
                  {'        '}left, right = <span className="hs16-num">2</span> * i + <span className="hs16-num">1</span>,{' '}
                  <span className="hs16-num">2</span> * i + <span className="hs16-num">2</span>
                </div>
                <div className="hs16-code-line" data-group="iter">
                  {'        '}
                  <span className="hs16-kw">if</span> left &lt; n <span className="hs16-kw">and</span> arr[left] &gt; arr[largest]:
                  largest = left
                </div>
                <div className="hs16-code-line" data-group="iter">
                  {'        '}
                  <span className="hs16-kw">if</span> right &lt; n <span className="hs16-kw">and</span> arr[right] &gt; arr[largest]:
                  largest = right
                </div>
                <div className="hs16-code-line" data-group="iter">
                  {'        '}
                  <span className="hs16-kw">if</span> largest == i: <span className="hs16-kw">break</span>
                </div>
                <div className="hs16-code-line" data-group="iter">
                  {'        '}arr[i], arr[largest] = arr[largest], arr[i]
                </div>
                <div className="hs16-code-line" data-group="iter">
                  {'        '}i = largest{'  '}
                  <span className="hs16-cm"># Trượt trực tiếp xuống nút con</span>
                </div>
                <div className="hs16-code-line"> </div>
                <div className="hs16-code-line">
                  <span className="hs16-kw">def</span> <span className="hs16-fn">heap_sort</span>(arr):
                </div>
                <div className="hs16-code-line">
                  {'    '}n = <span className="hs16-fn">len</span>(arr)
                </div>
                <div className="hs16-code-line" data-group="build">
                  {'    '}
                  <span className="hs16-kw">for</span> i <span className="hs16-kw">in</span> <span className="hs16-fn">range</span>
                  (n // <span className="hs16-num">2</span> - <span className="hs16-num">1</span>, -<span className="hs16-num">1</span>
                  , -<span className="hs16-num">1</span>):
                </div>
                <div className="hs16-code-line" data-group="build">
                  {'        '}
                  <span className="hs16-fn">sift_down</span>(arr, n, i)
                </div>
                <div className="hs16-code-line"> </div>
                <div className="hs16-code-line" data-group="extract">
                  {'    '}
                  <span className="hs16-kw">for</span> i <span className="hs16-kw">in</span> <span className="hs16-fn">range</span>
                  (n - <span className="hs16-num">1</span>, <span className="hs16-num">0</span>, -<span className="hs16-num">1</span>
                  ):
                </div>
                <div className="hs16-code-line" data-group="extract">
                  {'        '}arr[<span className="hs16-num">0</span>], arr[i] = arr[i], arr[<span className="hs16-num">0</span>]
                </div>
                <div className="hs16-code-line" data-group="extract">
                  {'        '}
                  <span className="hs16-fn">sift_down</span>(arr, i, <span className="hs16-num">0</span>)
                </div>
              </div>

              <div className="hs16-console-bar">
                <div className="hs16-console-left">
                  <span className="hs16-step-label">{s.label}</span>
                  <div className="hs16-arr-wrap">
                    {s.heap.map((val, idx) => (
                      <span
                        key={`h-${idx}`}
                        className={`hs16-cell${idx === 0 && s.rootHighlight ? ' root' : ''}`}
                      >
                        {val}
                      </span>
                    ))}
                    {s.heap.length > 0 && s.sorted.length > 0 && (
                      <span className="hs16-divider">|</span>
                    )}
                    {s.sorted.map((val, idx) => (
                      <span key={`s-${idx}`} className="hs16-cell sorted">
                        {val}
                      </span>
                    ))}
                  </div>
                </div>
                <button type="button" className="hs16-step-btn" onClick={handleNextHs16Step}>
                  {hs16StepIdx === HS16_STEPS.length - 1 ? 'Chạy lại ↺' : 'Bước tiếp theo ▸'}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="hs16-cards">
              <div
                className={`hs16-card${hs16Focus === 'iter' ? ' active' : ''}`}
                data-target="iter"
                onClick={() => toggleFocus('iter')}
              >
                <span className="hs16-hotkey-hint">Phím 1</span>
                <span className="hs16-badge gold">Điểm nhấn kỹ thuật: while True</span>
                <h3>Khử đệ quy triệt tiêu Stack Overflow</h3>
                <p>
                  Thay vì gọi đệ quy <code>sift_down</code> tốn Call Stack, vòng lặp trượt trực tiếp{' '}
                  <code>i = largest</code> xuống nút con, đạt chuẩn <strong>O(1) RAM phụ</strong> tuyệt đối.
                </p>
              </div>

              <div
                className={`hs16-card${hs16Focus === 'build' ? ' active' : ''}`}
                data-target="build"
                onClick={() => toggleFocus('build')}
              >
                <span className="hs16-hotkey-hint">Phím 2</span>
                <span className="hs16-badge blue">Vòng lặp 1 — O(n)</span>
                <h3>Build Max-Heap từ dưới lên</h3>
                <p>
                  Chỉ duyệt ngược từ nút cha cuối cùng <code>n // 2 - 1</code> về <code>0</code> (bỏ qua toàn bộ nút lá từ{' '}
                  <code>n // 2</code> trở đi).
                </p>
              </div>

              <div
                className={`hs16-card${hs16Focus === 'extract' ? ' active' : ''}`}
                data-target="extract"
                onClick={() => toggleFocus('extract')}
              >
                <span className="hs16-hotkey-hint">Phím 3</span>
                <span className="hs16-badge green">Vòng lặp 2 — O(n log n)</span>
                <h3>Rút đỉnh (Extract) &amp; Thu hẹp Heap</h3>
                <p>
                  Hoán đổi đỉnh lớn nhất <code>arr[0]</code> về cuối mảng <code>arr[i]</code>, sau đó gọi{' '}
                  <code>sift_down(arr, i, 0)</code> để khôi phục Heap trên phần còn lại.
                </p>
              </div>
            </motion.div>
          </div>
        );
      }

      case 17: {
        const activeNote =
          (HS17C_PYRAMID_LEVELS[hs17PyramidLvl] || HS17C_PYRAMID_LEVELS[3]).note;
        const ramScale = HS17C_RAM_SCALES[hs17RamScale] || HS17C_RAM_SCALES[2];

        return (
          <div className="hs17c-wrap">
            <motion.div variants={itemVariants} className="hs17c-kpi-grid">
              <div className="hs17c-kpi-card">
                <span className="hs17c-badge green">Build Max-Heap</span>
                <div className="hs17c-kpi-val">O(n)</div>
                <div className="hs17c-kpi-sub">Một nửa số nút là lá có chiều cao 0.</div>
              </div>
              <div className="hs17c-kpi-card">
                <span className="hs17c-badge gold">Worst &amp; Average</span>
                <div className="hs17c-kpi-val">O(n log n)</div>
                <div className="hs17c-kpi-sub">
                  Rút gốc lặp <code>n - 1</code> lần × <code>O(log n)</code>.
                </div>
              </div>
              <div className="hs17c-kpi-card">
                <span className="hs17c-badge gold">Không gian Tuyệt đối</span>
                <div className="hs17c-kpi-val gold">O(1) RAM</div>
                <div className="hs17c-kpi-sub">Không mảng phụ, không Call Stack.</div>
              </div>
            </motion.div>

            <div className="hs17c-main-grid">
              <motion.div variants={itemVariants} className="hs17c-panel">
                <div className="hs17c-panel-title">
                  <span>Tại sao Build Max-Heap chỉ tốn O(n)?</span>
                  <span className="hs17c-badge green" style={{ margin: 0 }}>
                    Di chuột vào từng tầng
                  </span>
                </div>

                <div className="hs17c-pyramid-box">
                  <div className="hs17c-pyramid-head">
                    <span>Số lượng nút ở mỗi tầng</span>
                    <span>Số bước trượt tối đa</span>
                  </div>
                  <div className="hs17c-pyramid">
                    {HS17C_PYRAMID_LEVELS.map((lvl, idx) => (
                      <div
                        key={lvl.cls}
                        className={`hs17c-p-level ${lvl.cls}${idx === hs17PyramidLvl ? ' active' : ''}`}
                        onMouseEnter={() => setHs17PyramidLvl(idx)}
                        onClick={() => setHs17PyramidLvl(idx)}
                      >
                        <span>{lvl.label}</span>
                        <span className="hs17c-p-steps">{lvl.steps}</span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="hs17c-p-note"
                    dangerouslySetInnerHTML={{ __html: activeNote }}
                  />
                </div>

                <div className="hs17c-case-box">
                  <div className="hs17c-case-top">
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>
                      Trường hợp tốt nhất (Best Case):
                    </span>
                    <div className="hs17c-case-tabs">
                      <button
                        type="button"
                        className={`hs17c-tab-btn${hs17BestCase === 'distinct' ? ' active' : ''}`}
                        onClick={() => setHs17BestCase('distinct')}
                      >
                        Phần tử phân biệt
                      </button>
                      <button
                        type="button"
                        className={`hs17c-tab-btn${hs17BestCase === 'equal' ? ' active' : ''}`}
                        onClick={() => setHs17BestCase('equal')}
                      >
                        Bằng nhau [5,5,5,5]
                      </button>
                    </div>
                  </div>
                  <div
                    className="hs17c-case-detail"
                    dangerouslySetInnerHTML={{ __html: HS17C_CASE_TEXTS[hs17BestCase] }}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="hs17c-panel">
                <div>
                  <div className="hs17c-panel-title">
                    <span>So sánh RAM phụ (In-place)</span>
                    <span className="hs17c-badge gold" style={{ margin: 0 }}>
                      Nhà vô địch RAM
                    </span>
                  </div>

                  <div className="hs17c-slider-row">
                    <label>
                      Kích thước mảng: <strong>{ramScale.n}</strong> phần tử
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="1"
                      value={hs17RamScale}
                      onChange={(e) => setHs17RamScale(Number(e.target.value))}
                    />
                  </div>

                  <div className="hs17c-ram-bars">
                    <div>
                      <div className="hs17c-ram-item-head">
                        <span>
                          <strong>Merge Sort</strong> — Mảng phụ O(n)
                        </span>
                        <span className="hs17c-ram-val" style={{ color: '#e11d48' }}>
                          {ramScale.mV}
                        </span>
                      </div>
                      <div className="hs17c-track">
                        <div className="hs17c-fill merge" style={{ width: ramScale.mW }} />
                      </div>
                    </div>

                    <div>
                      <div className="hs17c-ram-item-head">
                        <span>
                          <strong>QuickSort</strong> — Call Stack O(log n) → O(n)
                        </span>
                        <span className="hs17c-ram-val" style={{ color: '#7c3aed' }}>
                          {ramScale.qV}
                        </span>
                      </div>
                      <div className="hs17c-track">
                        <div className="hs17c-fill quick" style={{ width: ramScale.qW }} />
                      </div>
                    </div>

                    <div>
                      <div className="hs17c-ram-item-head">
                        <span>
                          <strong>Heap Sort</strong> — Khử đệ quy O(1)
                        </span>
                        <span className="hs17c-ram-val" style={{ color: '#be185d' }}>
                          32 Bytes (Cố định)
                        </span>
                      </div>
                      <div className="hs17c-track">
                        <div className="hs17c-fill heap" style={{ width: '4%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hs17c-vars-box">
                  <div>
                    <strong>Sắp xếp tại chỗ thuần túy:</strong> Dù mảng tăng lên hàng triệu phần tử, RAM phụ vẫn chỉ đúng 4 biến cục bộ:
                  </div>
                  <div className="hs17c-vars-pills">
                    <span className="hs17c-vpill">i</span>
                    <span className="hs17c-vpill">left</span>
                    <span className="hs17c-vpill">right</span>
                    <span className="hs17c-vpill">largest</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );
      }

      case 18: {
        const s = HS17_LC_STEPS[hs17LcIdx] || HS17_LC_STEPS[0];
        return (
          <div className="hs17-grid">
            <motion.div variants={itemVariants} className="hs17-left-col">
              <div className="hs17-card">
                <div>
                  <div className="hs17-card-top">
                    <span className="hs17-badge gold">1. Linux Kernel &amp; Hệ thống nhúng</span>
                    <span className="hs17-meta-tag">lib/sort.c</span>
                  </div>
                  <div className="hs17-big-stat">8–16 KB Stack</div>
                  <div className="hs17-sub-title">
                    Tại sao <code>linux/lib/sort.c</code> chọn Heap Sort?
                  </div>
                </div>

                <div className="hs17-meter-box">
                  <div className="hs17-meter-row">
                    <div className="hs17-meter-label">
                      <span>
                        <strong>QuickSort</strong> (Đệ quy)
                      </span>
                      <span className={`hs17-status-pill ${hs17IsDos ? 'panic' : 'warn'}`}>
                        {hs17IsDos ? '> 16 KB — KERNEL PANIC!' : '~4 KB (Bình thường)'}
                      </span>
                    </div>
                    <div className="hs17-track">
                      <div className="hs17-limit-tag">Giới hạn 16 KB</div>
                      <div className="hs17-limit-line" />
                      <div className={`hs17-bar qs${hs17IsDos ? ' overflow' : ''}`} />
                    </div>
                  </div>

                  <div className="hs17-meter-row">
                    <div className="hs17-meter-label">
                      <span>
                        <strong>Heap Sort</strong> (Khử đệ quy)
                      </span>
                      <span className="hs17-status-pill safe">
                        {hs17IsDos ? 'O(1) RAM — Miễn nhiễm' : 'O(1) RAM — An toàn'}
                      </span>
                    </div>
                    <div className="hs17-track">
                      <div className="hs17-limit-line" />
                      <div className="hs17-bar hs" />
                    </div>
                  </div>

                  <div className="hs17-dos-controls">
                    <span className="hs17-dos-note">
                      {hs17IsDos
                        ? 'Đầu vào xấu: QuickSort đệ quy làm sập hệ thống!'
                        : 'Trạng thái: Đầu vào ngẫu nhiên'}
                    </span>
                    <button
                      type="button"
                      className={`hs17-btn danger${hs17IsDos ? ' active' : ''}`}
                      onClick={() => setHs17IsDos((prev) => !prev)}
                    >
                      {hs17IsDos ? '↺ Khôi phục trạng thái [D]' : '⚡ Mô phỏng DoS O(n²) [D]'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="hs17-card hs17-lc-summary">
                <div>
                  <div className="hs17-card-top">
                    <span className="hs17-badge blue">2. Priority Queue • LeetCode 215</span>
                    <span className="hs17-meta-tag">O(n log k)</span>
                  </div>
                  <h3>Kth Largest Element in an Array</h3>
                  <p>
                    Giữ một <strong>Hộp Min-Heap cố định k phần tử</strong>. Đỉnh{' '}
                    <code>min_heap[0]</code> đóng vai trò <strong>&quot;người gác cổng&quot;</strong> — chỉ số nào lớn hơn nó mới được đá nó ra để vào Top-K.
                  </p>
                </div>
                <div className="hs17-compare-pills">
                  <span className="hs17-cpill bad">Sort cả mảng: O(n log n)</span>
                  <span className="hs17-cpill good">Min-Heap k phần tử: O(n log k)</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="hs17-right-panel">
              <div className="hs16-code-topbar">
                <div className="hs16-dots">
                  <span className="hs16-dot r" />
                  <span className="hs16-dot y" />
                  <span className="hs16-dot g" />
                </div>
                <span>leetcode_215_kth_largest.py</span>
                <span className="hs16-lang-badge">PYTHON</span>
              </div>

              <div className="hs17-code-body">
                <div className="hs17-code-line">
                  <span className="hs16-kw">import</span> heapq
                </div>
                <div className="hs17-code-line">
                  <span className="hs16-kw">def</span> <span className="hs16-fn">findKthLargest</span>(nums: list[int], k: int) -&gt; int:
                </div>
                <div className={`hs17-code-line${s.line === 'init' ? ' hl' : ''}`}>
                  {'    '}min_heap = nums[:k]
                </div>
                <div className={`hs17-code-line${s.line === 'init' ? ' hl' : ''}`}>
                  {'    '}heapq.<span className="hs16-fn">heapify</span>(min_heap){'            '}
                  <span className="hs16-cm"># Build Heap O(k)</span>
                </div>
                <div className={`hs17-code-line${s.line === 'check' ? ' hl' : ''}`}>
                  {'    '}
                  <span className="hs16-kw">for</span> num <span className="hs16-kw">in</span> nums[k:]:
                </div>
                <div className={`hs17-code-line${s.line === 'check' ? ' hl' : ''}`}>
                  {'        '}
                  <span className="hs16-kw">if</span> num &gt; min_heap[0]:{'          '}
                  <span className="hs16-cm"># So với &quot;gác cổng&quot;</span>
                </div>
                <div className={`hs17-code-line${s.line === 'replace' ? ' hl' : ''}`}>
                  {'            '}heapq.<span className="hs16-fn">heapreplace</span>(min_heap, num){'  '}
                  <span className="hs16-cm"># Đá đỉnh &amp; nạp mới</span>
                </div>
                <div className={`hs17-code-line${s.line === 'return' ? ' hl' : ''}`}>
                  {'    '}
                  <span className="hs16-kw">return</span> min_heap[0]
                </div>
              </div>

              <div className="hs17-sim-area">
                <div className="hs17-sim-header">
                  <span className="hs17-sim-title">
                    Mô phỏng trực quan: k = 2 (Tìm số lớn thứ 2)
                  </span>
                  <span className="hs17-meta-tag">
                    Bước {hs17LcIdx + 1} / {HS17_LC_STEPS.length}
                  </span>
                </div>

                <div className="hs17-stream-row">
                  <span className="hs17-row-label">Mảng nums:</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {HS17_NUMS.map((n, i) => {
                      let cls = 'hs17-num-cell';
                      if (i === s.currIdx) cls += ' current';
                      else if (s.skipped.includes(i)) cls += ' skipped';
                      else if (s.doneIn.includes(i)) cls += ' done-in';
                      return (
                        <div key={i} className={cls}>
                          {n}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="hs17-heap-stage">
                  <span className="hs17-row-label" style={{ minWidth: '78px' }}>
                    Min-Heap
                    <br />
                    <small style={{ color: '#7c3aed' }}>(size = 2)</small>
                  </span>
                  <div className="hs17-heap-slots">
                    {s.heap.map((val, idx) => {
                      let cls = 'hs17-heap-slot';
                      let tag = `min_heap[${idx}]`;
                      if (idx === 0) {
                        cls += s.winner ? ' winner' : ' gatekeeper';
                        tag = s.winner ? '★ Đáp án (Top-2)' : 'Gác cổng [0]';
                      }
                      return (
                        <div key={idx} className={cls}>
                          <div className="hs17-slot-val">{val}</div>
                          <span className="hs17-slot-tag">{tag}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className="hs17-kicked-info"
                    dangerouslySetInnerHTML={{ __html: s.kicked }}
                  />
                </div>

                <div className="hs17-sim-footer">
                  <div
                    className="hs17-sim-msg"
                    dangerouslySetInnerHTML={{ __html: s.msg }}
                  />
                  <button
                    type="button"
                    className="hs17-btn"
                    onClick={() => setHs17LcIdx((prev) => (prev + 1) % HS17_LC_STEPS.length)}
                  >
                    {hs17LcIdx === HS17_LC_STEPS.length - 1
                      ? 'Chạy lại ↺ [K]'
                      : 'Bước tiếp theo ▸ [K]'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        );
      }

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
