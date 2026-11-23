import {
  CHAPTERS,
  SLIDES_DATA,
  TIMSORT_JAVA_TABS,
  INTROSORT_PYTHON_CODE,
  INTROSORT_OFFSET_CODE,
  HEAPSORT_PYTHON_CODE,
  LEETCODE_215_CODE,
  LEETCODE_912_CODE,
  COMPARISON_ROWS,
} from './data/slidesData.js';
import {
  TIMSORT_DEFAULT_ARRAY,
  TIMSORT_MINRUN,
  TIMSORT_SPEED_MAP,
  TIMSORT_PHASE_META,
  generateTimsortFrames,
  generateRandomTimsortArray,
} from './timsortEngine.js';
import {
  INTROSORT_INITIAL_ARRAY,
  INTROSORT_HEAP_VALUES,
  INTROSORT_HEAP_COORDS,
  INTROSORT_HEAP_EDGES,
  INTROSORT_TREE_SCENARIOS,
} from './introsortEngine.js';
import {
  HEAPSORT_SAMPLE_ARRAY,
  formatHeapArrayDivider,
  generateHeapSortFrames,
  generateRandomHeapArray7,
} from './heapsortEngine.js';

const ICONS = {
  chevronLeft:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  chevronRight:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  notes:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h8"/><path d="M8 14h4"/></svg>',
  fullscreen:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
  play: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  pause:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
  skipBack:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>',
  skipForward:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>',
  reset:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
};

const state = {
  slideIndex: 0,
  showNotes: false,
  timsortArray: [...TIMSORT_DEFAULT_ARRAY],
  timsortFrames: generateTimsortFrames(TIMSORT_DEFAULT_ARRAY),
  timsortStep: 0,
  timsortPlaying: false,
  timsortTimer: null,
  timsortSpeed: 3,
  javaTab: 'full',
  introTab: 'tab1',
  introStep: 0,
  introPlaying: false,
  introTimer: null,
  introSpeed: 1.0,
  introHeapSyncTimer: null,
  introResizeObserver: null,
  introPrevIndexMap: new Map(),
  introTileEls: new Map(),
  introIndexEls: [],
  introTreeNodeEls: new Map(),
  introTreeEdgeEls: [],
  introHeapNodeEls: new Map(),
  introHeapEdgeEls: [],
  heapRawArray: [...HEAPSORT_SAMPLE_ARRAY],
  heapIsSample: true,
  heapFrames: generateHeapSortFrames(HEAPSORT_SAMPLE_ARRAY),
  heapStep: 0,
  heapPlaying: false,
  heapTimer: null,
  heapSpeed: 1.0,
  heapHoveredId: null,
  heapResizeObserver: null,
  heapTreeNodeEls: new Map(),
  heapArrayTileEls: new Map(),
  heapTreeEdgeEls: [],
  heapTreeCoords: [],
  heapPrevPosById: new Map(),
};

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function highlightCode(code, lang) {
  const keywords =
    lang === 'java'
      ? /\b(import|public|private|static|final|class|void|int|if|else|while|for|return|new)\b/g
      : /\b(import|def|class|if|elif|else|while|for|in|return|and|or|not|is|None|True|False|lambda|break)\b/g;

  return code
    .split('\n')
    .map((rawLine) => {
      const commentIdx = lang === 'java' ? rawLine.indexOf('//') : rawLine.indexOf('#');
      let codePart = rawLine;
      let commentPart = '';
      if (commentIdx !== -1) {
        codePart = rawLine.slice(0, commentIdx);
        commentPart = rawLine.slice(commentIdx);
      }

      let safe = esc(codePart);
      safe = safe.replace(/(&quot;.*?&quot;|".*?"|'.*?')/g, '<span class="tok-str">$1</span>');
      safe = safe.replace(keywords, '<span class="tok-kw">$1</span>');
      safe = safe.replace(/\b(\d+)\b/g, '<span class="tok-num">$1</span>');
      safe = safe.replace(/\b([a-zA-Z_]\w*)(?=\s*\()/g, '<span class="tok-fn">$1</span>');

      if (commentPart) {
        return `${safe}<span class="tok-cm">${esc(commentPart)}</span>`;
      }
      return safe;
    })
    .join('\n');
}

function renderCodeWindow(title, lang, code, stagger = 0) {
  return `
    <div class="code-window bento-item" style="--stagger:${stagger}">
      <div class="code-header">
        <div class="code-dots">
          <span style="background:#FF5F57"></span>
          <span style="background:#FEBC2E"></span>
          <span style="background:#28C840"></span>
        </div>
        <span class="code-filename">${esc(title)}</span>
        <span class="badge-pill badge-accent">${lang.toUpperCase()}</span>
      </div>
      <pre class="code-pre"><code>${highlightCode(code, lang)}</code></pre>
    </div>
  `;
}

function renderSlide1() {
  return `
    <div class="bento-grid bento-grid-auto">
      <div class="bento-card bento-card-accent bento-card-auto col-12 bento-item" style="--stagger:0">
        <div class="flex-row justify-between flex-wrap gap-2">
          <span class="badge-pill badge-blue">Môn học: Cấu trúc dữ liệu và Giải thuật</span>
          <span class="bento-caption">Slide 01 / 19 • 0.5 phút</span>
        </div>
        <h1 class="hero-title mt-3">
          KHOẢNG CÁCH GIỮA SÁCH GIÁO KHOA VÀ HỆ THỐNG THỰC TẾ
          <span style="display:block; font-size:0.56em; color:#A1A1A6; -webkit-text-fill-color:#A1A1A6; margin-top:6px;">
            (PRODUCTION SORTING ALGORITHMS)
          </span>
        </h1>
        <p class="bento-body mt-3" style="max-width:960px;">
          Phân tích, Mô phỏng &amp; Ứng dụng của <strong style="color:#30D158">Timsort</strong>,
          <strong style="color:#BF5AF2">Introsort</strong> và <strong style="color:#FFD60A">Heap Sort</strong>
        </p>
        <div class="bento-subtile flex-row justify-between flex-wrap gap-3 mt-3">
          <span class="bento-body" style="color:#A1A1A6;">
            Sử dụng phím <code>→</code> / <code>Space</code> để chuyển slide • Bấm <code>S</code> để mở Speaker Notes
          </span>
          <button type="button" class="sim-btn primary" data-action="next-slide">
            Bắt đầu bài thuyết trình ${ICONS.chevronRight}
          </button>
        </div>
      </div>
    </div>

    <div class="bento-grid flex-1 min-h-0">
      <div class="bento-card col-4 bento-item" style="--stagger:1; border-color:rgba(48,209,88,0.35);">
        <div class="flex-row justify-between gap-2">
          <span class="badge-pill badge-mint">Timsort (Tim Peters, 2002)</span>
          <span class="mono bento-caption" style="color:#30D158">Stable</span>
        </div>
        <div class="hero-stat mt-3" style="background:linear-gradient(135deg,#30D158,#64D2FF);-webkit-background-clip:text;background-clip:text;">
          O(n) Best
        </div>
        <h3 class="bento-title mt-2">Merge Sort + Insertion Sort</h3>
        <p class="bento-body mt-2">
          Trái tim của <strong>Python</strong> (<code>sort()</code>, <code>sorted()</code>),
          <strong>Java Object Arrays</strong> (<code>Arrays.sort(Object[])</code>), <strong>V8 JS</strong> và <strong>Android</strong>.
        </p>
      </div>

      <div class="bento-card col-4 bento-item" style="--stagger:2; border-color:rgba(191,90,242,0.38);">
        <div class="flex-row justify-between gap-2">
          <span class="badge-pill badge-purple">Introsort (David R. Musser, 1997)</span>
          <span class="mono bento-caption" style="color:#BF5AF2">In-place</span>
        </div>
        <div class="hero-stat mt-3" style="background:linear-gradient(135deg,#BF5AF2,#5E5CE6);-webkit-background-clip:text;background-clip:text;">
          Θ(n log n)
        </div>
        <h3 class="bento-title mt-2">Quick + Heap + Insertion</h3>
        <p class="bento-body mt-2">
          Sức mạnh đằng sau <code>std::sort</code> của <strong>C++ STL</strong>,
          thư viện chuẩn <strong>.NET</strong> (C#) và ngôn ngữ <strong>Go</strong>.
        </p>
      </div>

      <div class="bento-card col-4 bento-item" style="--stagger:3; border-color:rgba(255,159,10,0.38);">
        <div class="flex-row justify-between gap-2">
          <span class="badge-pill badge-amber">Heap Sort (Binary Heap)</span>
          <span class="mono bento-caption" style="color:#FFD60A">No Stack</span>
        </div>
        <div class="hero-stat mt-3" style="background:linear-gradient(135deg,#FF9F0A,#FFD60A);-webkit-background-clip:text;background-clip:text;">
          O(1) RAM
        </div>
        <h3 class="bento-title mt-2">Sắp xếp vun đống tại chỗ</h3>
        <p class="bento-body mt-2">
          Chốt chặn an toàn tuyệt đối của nhân <strong>Linux Kernel</strong> (<code>lib/sort.c</code>),
          <strong>Embedded Systems</strong> và <strong>Priority Queue</strong>.
        </p>
      </div>
    </div>
  `;
}

function renderSlide2() {
  return `
    <div class="bento-grid bento-grid-auto">
      <div class="bento-card col-6 bento-item" style="--stagger:0">
        <div class="flex-row justify-between items-center gap-3">
          <div>
            <span class="badge-pill badge-blue">Nền tảng Sách giáo khoa</span>
            <h3 class="bento-title mt-2">Thuật toán cơ bản</h3>
          </div>
          <div class="hero-stat">O(n²)</div>
        </div>
        <p class="bento-body mt-2">
          <em>Bubble Sort, Selection Sort, Insertion Sort</em> giúp hiểu rõ nguyên lý so sánh từng cặp phần tử,
          nhưng chi phí bậc hai <strong>O(n²)</strong> không thể đáp ứng dữ liệu lớn trong hệ thống thực tế.
        </p>
      </div>

      <div class="bento-card col-6 bento-item" style="--stagger:1">
        <div class="flex-row justify-between items-center gap-3">
          <div>
            <span class="badge-pill badge-mint">Bước ngoặt Chia để trị</span>
            <h3 class="bento-title mt-2">Merge Sort &amp; Quick Sort</h3>
          </div>
          <div class="hero-stat-accent">O(n log n)</div>
        </div>
        <p class="bento-body mt-2">
          Tạo đột phá về hiệu năng với độ phức tạp trung bình <strong>O(n log n)</strong>,
          trong đó <strong>Quick Sort</strong> từ lâu được xem là chuẩn mực tốc độ thực thi trong RAM.
        </p>
      </div>
    </div>

    <div class="bento-grid flex-1 min-h-0">
      <div class="bento-card col-4 bento-item" style="--stagger:2; border-color:rgba(255,69,58,0.38);">
        <span class="badge-pill badge-rose">Góc khuất #1 • Nguy cơ bảo mật</span>
        <h3 class="bento-title mt-2">Nguy cơ của Quick Sort</h3>
        <p class="bento-body mt-2">
          Tiềm ẩn nguy cơ suy thoái về <strong>O(n²)</strong> khi gặp dữ liệu bất lợi (chọn chốt xấu liên tiếp)
          hoặc gây tràn ngăn xếp (<strong>Stack Overflow</strong> <code>O(n)</code>), dễ bị khai thác tấn công DoS.
        </p>
      </div>

      <div class="bento-card col-4 bento-item" style="--stagger:3; border-color:rgba(255,159,10,0.38);">
        <span class="badge-pill badge-amber">Góc khuất #2 • Áp lực bộ nhớ</span>
        <h3 class="bento-title mt-2">Gánh nặng của Merge Sort</h3>
        <p class="bento-body mt-2">
          Đảm bảo ổn định (<strong>Stable</strong>) và cận trên <code>O(n log n)</code>, nhưng tiêu tốn
          bộ nhớ phụ <strong>O(n)</strong>, bất khả thi trên hệ thống nhúng hoặc nhân OS có RAM/Stack hạn hẹp.
        </p>
      </div>

      <div class="bento-card col-4 bento-item" style="--stagger:4; border-color:rgba(90,200,250,0.36);">
        <span class="badge-pill badge-blue">Góc khuất #3 • Dữ liệu đời thực</span>
        <h3 class="bento-title mt-2">Đặc thù dữ liệu Production</h3>
        <p class="bento-body mt-2">
          Dữ liệu thực tế hiếm khi ngẫu nhiên hoàn toàn mà thường có sẵn các đoạn đã được sắp xếp cục bộ
          (<em>natural runs</em>) — như log hệ thống, danh sách giao dịch nối tiếp.
        </p>
      </div>
    </div>

    <div class="bento-grid bento-grid-auto">
      <div class="bento-card bento-card-accent bento-card-auto col-12 bento-item" style="--stagger:5">
        <div class="flex-row justify-between flex-wrap gap-3">
          <h3 class="bento-title">Giải pháp từ các Thư viện Chuẩn &amp; Hệ điều hành (Hybrid Sorting)</h3>
          <span class="badge-pill badge-accent">Tối ưu Phần cứng &amp; Thực tế</span>
        </div>
        <p class="bento-body mt-2">
          <strong style="color:#30D158">Timsort</strong> (khai thác natural runs + ổn định),
          <strong style="color:#BF5AF2">Introsort</strong> (tốc độ RAM + lưới an toàn Heapsort) và
          <strong style="color:#FFD60A">Heap Sort</strong> (chuẩn <code>O(1)</code> RAM tuyệt đối).
        </p>
      </div>
    </div>
  `;
}

function renderSlide3() {
  return `
    <div class="bento-grid flex-1 min-h-0">
      <div class="bento-col col-5">
        <div class="bento-card bento-card-accent bento-card-auto bento-item" style="--stagger:0">
          <div class="flex-row justify-between items-center gap-2">
            <span class="badge-pill badge-mint">Tim Peters (2002)</span>
            <span class="bento-caption mono">minrun học tập = 4</span>
          </div>
          <div class="hero-stat-accent mt-2">minrun = 32–64</div>
          <p class="bento-body mt-2">
            <strong>Định nghĩa:</strong> Thuật toán sắp xếp lai kết hợp <strong>Merge Sort</strong> và <strong>Insertion Sort</strong>.
          </p>
        </div>

        <div class="bento-card bento-card-auto bento-item" style="--stagger:1">
          <h3 class="bento-title">Đặc tả Input / Output</h3>
          <p class="bento-body mt-2">
            • <strong>Input:</strong> Mảng <code>n</code> phần tử (số, chuỗi, hoặc Object qua <code>Comparable</code> / <code>Comparator</code> trong Java).<br/>
            • <strong>Ví dụ:</strong> <code>[5, 2, 3, 1, 4]</code> → <code>[1, 2, 3, 4, 5]</code>.
          </p>
        </div>

        <div class="bento-card flex-1 bento-item" style="--stagger:2; border-color:rgba(48,209,88,0.35);">
          <span class="badge-pill badge-mint">Stable Sort (Tính ổn định)</span>
          <p class="bento-body mt-2">
            Các phần tử có khóa bằng nhau (VD: bản ghi nhân viên cùng điểm, đơn hàng cùng ngày)
            <strong>giữ nguyên thứ tự tương đối ban đầu</strong>. Cực kỳ quan trọng khi sắp xếp theo nhiều tiêu chí!
          </p>
        </div>
      </div>

      <div class="col-7 h-full min-h-0">
        <div class="bento-subgrid-2">
          <div class="bento-card bento-item" style="--stagger:3">
            <span class="badge-pill badge-mint">Cơ chế 01</span>
            <h3 class="bento-title mt-2">Natural Runs</h3>
            <p class="bento-body mt-2">
              Quét mảng phát hiện các đoạn liên tiếp đã tăng dần tự nhiên (hoặc giảm dần rồi đảo ngược).
            </p>
          </div>

          <div class="bento-card bento-item" style="--stagger:4">
            <span class="badge-pill badge-blue">Cơ chế 02</span>
            <h3 class="bento-title mt-2">Minrun &amp; Binary Insertion</h3>
            <p class="bento-body mt-2">
              Thực tế <code>minrun = 32–64</code> (tính theo bit từ <code>n</code>). Nếu run ngắn hơn <code>minrun</code>, mở rộng bằng Binary Insertion Sort.
            </p>
          </div>

          <div class="bento-card bento-item" style="--stagger:5">
            <span class="badge-pill badge-blue">Cơ chế 03</span>
            <h3 class="bento-title mt-2">Merge Stack cân bằng</h3>
            <p class="bento-body mt-2">
              Lưu các run vào stack và gộp theo bất biến cân bằng kích thước để tránh cây gộp bị lệch.
            </p>
          </div>

          <div class="bento-card bento-item" style="--stagger:6">
            <span class="badge-pill badge-amber">Cơ chế 04</span>
            <h3 class="bento-title mt-2">Galloping Mode</h3>
            <p class="bento-body mt-2">
              Khi một run liên tục thắng lúc merge, nhảy bước lũy thừa rồi tìm nhị phân để chép cả cụm phần tử cùng lúc.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getTimsortHeaderSubtitle() {
  return `Mảng đầu vào A = [${state.timsortArray.join(', ')}] với tham số minrun = ${TIMSORT_MINRUN}`;
}

function renderTimsortBarsMarkup(frame) {
  const arr = frame.array;
  const maxVal = Math.max(...arr, 1);
  return arr
    .map((val, idx) => {
      const hlKey = frame.highlights[idx] || 'default';
      const isActive = frame.activeIndices.includes(idx);
      const heightPct = Math.round(14 + (val / maxVal) * 86);
      return `
        <div class="tim-bar-slot">
          <span class="tim-bar-val val-${hlKey}">${val}</span>
          <div class="tim-bar-track">
            <div class="tim-bar-col bar-${hlKey} ${isActive ? 'is-active' : ''}" style="height:${heightPct}%"></div>
          </div>
          <span class="tim-bar-idx ${isActive ? 'is-active' : ''}">[${idx}]</span>
        </div>
      `;
    })
    .join('');
}

function renderTimsortRunsMarkup(runs) {
  if (!runs || runs.length === 0) {
    return '<div class="tim-runs-placeholder">Chưa phân chia Run — thuật toán sẽ tự động tách mảng theo minrun = 4</div>';
  }
  return runs
    .map((run) => {
      let cls = '';
      if (run.active) cls = 'run-active';
      else if (run.label && run.label.startsWith('Merged')) cls = 'run-merged';
      return `<div class="tim-run-chip ${cls}" style="grid-column:${run.start + 1} / span ${run.len}" title="${esc(run.label)}">${esc(run.label)}</div>`;
    })
    .join('');
}

function getTimsortPlayButtonContent() {
  if (state.timsortPlaying) {
    return '<span>⏸</span><span>Tạm dừng</span>';
  }
  if (state.timsortStep >= state.timsortFrames.length - 1 && state.timsortFrames.length > 1) {
    return '<span>↻</span><span>Chạy lại</span>';
  }
  return '<span>▶</span><span>Tự động chạy</span>';
}

function renderTimsortStagePillsHtml(currentPhase) {
  const stages = [
    { key: 'init', label: '1. Khởi tạo' },
    { key: 'runs', label: '2. Tạo Runs' },
    { key: 'merge', label: '3. Trộn Runs' },
    { key: 'done', label: '4. Hoàn tất' },
  ];
  const currentIdx = stages.findIndex((s) => s.key === currentPhase);
  return stages
    .map((item, idx) => {
      const stateCls =
        idx === currentIdx ? 'is-active' : idx < currentIdx ? 'is-done' : '';
      const arrow = idx < stages.length - 1 ? '<span class="tim-stage-arrow">→</span>' : '';
      return `<div id="tim-stage-${item.key}" class="tim-stage-pill ${stateCls}">${item.label}</div>${arrow}`;
    })
    .join('');
}

function renderSlide4() {
  const frame = state.timsortFrames[state.timsortStep] || state.timsortFrames[0];
  const phaseInfo = TIMSORT_PHASE_META[frame.phase] || TIMSORT_PHASE_META.init;
  const speedInfo = TIMSORT_SPEED_MAP[state.timsortSpeed] || TIMSORT_SPEED_MAP[3];

  return `
    <div class="bento-grid flex-1 min-h-0">
      <div class="tim-card col-12 bento-item" style="--stagger:0">
        <div class="tim-top-row">
          <div class="tim-title-group">
            <span id="tim-phase-badge" class="tim-phase-badge ${phaseInfo.badgeClass}">${phaseInfo.text}</span>
            <h3 id="tim-step-title" class="tim-step-title">${esc(frame.title)}</h3>
          </div>
          <div class="tim-controls">
            <button id="tim-btn-auto" type="button" class="tim-btn-play" data-action="tim-auto">
              ${getTimsortPlayButtonContent()}
            </button>
            <button id="tim-btn-prev" type="button" class="tim-btn" data-action="tim-prev" title="Quay lại 1 bước ([)" ${state.timsortStep === 0 ? 'disabled' : ''}>
              <span>⏮</span><span>Quay lại</span>
            </button>
            <button id="tim-btn-next" type="button" class="tim-btn" data-action="tim-next" title="Bước tiếp theo (])" ${state.timsortStep >= state.timsortFrames.length - 1 ? 'disabled' : ''}>
              <span>Bước tiếp</span><span>⏭</span>
            </button>
            <button id="tim-btn-reset" type="button" class="tim-btn" data-action="tim-reset" title="Đặt lại về mảng mặc định">
              <span>↺</span><span>Đặt lại</span>
            </button>
            <button id="tim-btn-random" type="button" class="tim-btn" data-action="tim-random" title="Tạo mảng ngẫu nhiên 10 phần tử">
              <span>🎲</span><span>Mảng ngẫu nhiên</span>
            </button>
          </div>
        </div>

        <div class="tim-meta-row">
          <div id="tim-stepper" class="tim-stepper" aria-label="Tiến độ giai đoạn">
            ${renderTimsortStagePillsHtml(frame.phase)}
          </div>

          <div class="tim-metrics-group">
            <div class="tim-speed-box">
              <span>Chậm</span>
              <input id="tim-speed-slider" class="tim-speed-slider" type="range" min="1" max="5" step="1" value="${state.timsortSpeed}" aria-label="Tốc độ mô phỏng" />
              <span>Nhanh</span>
              <span id="tim-speed-label" class="tim-speed-label">${speedInfo.label}</span>
            </div>

            <div class="tim-stat-pill">
              <span>So sánh:</span>
              <span id="tim-stat-cmp" class="tim-stat-val tim-stat-cmp">${frame.comparisons}</span>
            </div>
            <div class="tim-stat-pill">
              <span>Ghi/Dịch:</span>
              <span id="tim-stat-writes" class="tim-stat-val tim-stat-writes">${frame.writes}</span>
            </div>
            <div class="tim-stat-pill">
              <span>Bước:</span>
              <span id="tim-stat-step" class="tim-stat-val tim-stat-step">${state.timsortStep} / ${state.timsortFrames.length - 1}</span>
            </div>
          </div>
        </div>

        <div class="tim-desc-box">
          <p id="tim-step-desc" class="tim-desc-text">${esc(frame.description)}</p>
        </div>

        <section class="tim-stage-box">
          <div id="tim-bars-container" class="tim-bars-grid" aria-label="Biểu đồ cột các phần tử mảng">
            ${renderTimsortBarsMarkup(frame)}
          </div>
          <div class="tim-runs-wrap">
            <div id="tim-runs-container" class="tim-runs-grid" aria-label="Nhãn phân nhóm các Run">
              ${renderTimsortRunsMarkup(frame.runs)}
            </div>
          </div>
        </section>

        <footer class="tim-footer">
          <div class="tim-legend">
            <div class="tim-legend-item"><span class="tim-legend-swatch swatch-default"></span><span>Mặc định</span></div>
            <div class="tim-legend-item"><span class="tim-legend-swatch swatch-compare"></span><span>Xét Run / So sánh</span></div>
            <div class="tim-legend-item"><span class="tim-legend-swatch swatch-insert"></span><span>Chèn / Dịch (Insertion Sort)</span></div>
            <div class="tim-legend-item"><span class="tim-legend-swatch swatch-merge"></span><span>Đang trộn (Merge)</span></div>
            <div class="tim-legend-item"><span class="tim-legend-swatch swatch-sorted"></span><span>Đã hoàn thành / Đã sắp xếp</span></div>
          </div>
          <div class="tim-kbd-hint">
            Phím tắt mô phỏng: <kbd>P</kbd> Chạy/Dừng · <kbd>[</kbd> <kbd>]</kbd> Chuyển bước
          </div>
        </footer>
      </div>
    </div>
  `;
}

function updateTimsortPlayButton() {
  const btnAuto = document.getElementById('tim-btn-auto');
  if (btnAuto) btnAuto.innerHTML = getTimsortPlayButtonContent();
}

function updateTimsortDOM(recreateBars = false) {
  const frame = state.timsortFrames[state.timsortStep];
  if (!frame) return;

  const barsContainer = document.getElementById('tim-bars-container');
  if (!barsContainer) return;

  if (recreateBars || barsContainer.children.length !== frame.array.length) {
    barsContainer.innerHTML = renderTimsortBarsMarkup(frame);
  } else {
    const arr = frame.array;
    const maxVal = Math.max(...arr, 1);
    const slots = barsContainer.children;
    for (let idx = 0; idx < arr.length; idx++) {
      const slot = slots[idx];
      const val = arr[idx];
      const hlKey = frame.highlights[idx] || 'default';
      const isActive = frame.activeIndices.includes(idx);
      const heightPct = Math.round(14 + (val / maxVal) * 86);

      const valEl = slot.querySelector('.tim-bar-val');
      const colEl = slot.querySelector('.tim-bar-col');
      const idxEl = slot.querySelector('.tim-bar-idx');

      if (valEl) {
        valEl.textContent = val;
        valEl.className = `tim-bar-val val-${hlKey}`;
      }
      if (colEl) {
        colEl.style.height = `${heightPct}%`;
        colEl.className = `tim-bar-col bar-${hlKey} ${isActive ? 'is-active' : ''}`;
      }
      if (idxEl) {
        idxEl.className = `tim-bar-idx ${isActive ? 'is-active' : ''}`;
      }
    }
  }

  const runsContainer = document.getElementById('tim-runs-container');
  if (runsContainer) runsContainer.innerHTML = renderTimsortRunsMarkup(frame.runs);

  const phaseInfo = TIMSORT_PHASE_META[frame.phase] || TIMSORT_PHASE_META.init;
  const badgeEl = document.getElementById('tim-phase-badge');
  if (badgeEl) {
    badgeEl.textContent = phaseInfo.text;
    badgeEl.className = `tim-phase-badge ${phaseInfo.badgeClass}`;
  }

  const titleEl = document.getElementById('tim-step-title');
  if (titleEl) titleEl.textContent = frame.title;

  const descEl = document.getElementById('tim-step-desc');
  if (descEl) descEl.textContent = frame.description;

  const order = ['init', 'runs', 'merge', 'done'];
  const currentPhaseIdx = order.indexOf(frame.phase);
  order.forEach((key, idx) => {
    const pill = document.getElementById(`tim-stage-${key}`);
    if (pill) {
      pill.className = `tim-stage-pill ${idx === currentPhaseIdx ? 'is-active' : idx < currentPhaseIdx ? 'is-done' : ''}`;
    }
  });

  const cmpEl = document.getElementById('tim-stat-cmp');
  if (cmpEl) cmpEl.textContent = frame.comparisons;

  const writesEl = document.getElementById('tim-stat-writes');
  if (writesEl) writesEl.textContent = frame.writes;

  const stepEl = document.getElementById('tim-stat-step');
  if (stepEl) stepEl.textContent = `${state.timsortStep} / ${state.timsortFrames.length - 1}`;

  const prevBtn = document.getElementById('tim-btn-prev');
  if (prevBtn) prevBtn.disabled = state.timsortStep === 0;

  const nextBtn = document.getElementById('tim-btn-next');
  if (nextBtn) nextBtn.disabled = state.timsortStep >= state.timsortFrames.length - 1;

  const subtitleEl = document.querySelector('.slide-subtitle');
  if (subtitleEl && SLIDES_DATA[state.slideIndex]?.id === 4) {
    subtitleEl.textContent = getTimsortHeaderSubtitle();
  }

  updateTimsortPlayButton();
}

function stopTimsortPlay() {
  if (state.timsortTimer !== null) {
    clearTimeout(state.timsortTimer);
    state.timsortTimer = null;
  }
  state.timsortPlaying = false;
  updateTimsortPlayButton();
}

function scheduleTimsortTick() {
  if (!state.timsortPlaying) return;
  const delay = TIMSORT_SPEED_MAP[state.timsortSpeed]?.delay || 550;
  state.timsortTimer = setTimeout(() => {
    if (!state.timsortPlaying) return;
    if (state.timsortStep < state.timsortFrames.length - 1) {
      state.timsortStep += 1;
      updateTimsortDOM();
      if (state.timsortStep >= state.timsortFrames.length - 1) {
        stopTimsortPlay();
      } else {
        scheduleTimsortTick();
      }
    } else {
      stopTimsortPlay();
    }
  }, delay);
}

function toggleTimsortPlay() {
  if (state.timsortPlaying) {
    stopTimsortPlay();
    return;
  }
  if (state.timsortStep >= state.timsortFrames.length - 1) {
    state.timsortStep = 0;
    updateTimsortDOM();
  }
  state.timsortPlaying = true;
  updateTimsortPlayButton();
  state.timsortTimer = setTimeout(() => {
    if (!state.timsortPlaying) return;
    if (state.timsortStep < state.timsortFrames.length - 1) {
      state.timsortStep += 1;
      updateTimsortDOM();
      if (state.timsortStep < state.timsortFrames.length - 1) {
        scheduleTimsortTick();
      } else {
        stopTimsortPlay();
      }
    } else {
      stopTimsortPlay();
    }
  }, 120);
}

function timsortStepForward() {
  stopTimsortPlay();
  if (state.timsortStep < state.timsortFrames.length - 1) {
    state.timsortStep += 1;
    updateTimsortDOM();
  }
}

function timsortStepBackward() {
  stopTimsortPlay();
  if (state.timsortStep > 0) {
    state.timsortStep -= 1;
    updateTimsortDOM();
  }
}

function loadTimsortArray(newArr) {
  stopTimsortPlay();
  state.timsortArray = [...newArr];
  state.timsortFrames = generateTimsortFrames(newArr);
  state.timsortStep = 0;
  updateTimsortDOM(true);
}

function renderSlide5() {
  const activeTab =
    TIMSORT_JAVA_TABS.find((t) => t.id === state.javaTab) || TIMSORT_JAVA_TABS[0];

  return `
    <div class="bento-grid bento-grid-auto">
      <div class="bento-card bento-card-auto col-12 bento-item" style="padding:12px 18px; --stagger:0">
        <div class="flex-row justify-between flex-wrap gap-2">
          <div class="flex-row gap-2 flex-wrap">
            ${TIMSORT_JAVA_TABS.map(
              (t) => `
              <button type="button" class="tab-btn ${state.javaTab === t.id ? 'active' : ''}" data-action="java-tab" data-tab="${t.id}">
                ${t.label}
              </button>
            `
            ).join('')}
          </div>
          <span class="badge-pill badge-mint">Java 8+ • MIN_RUN = 4</span>
        </div>
      </div>
    </div>

    <div class="bento-grid flex-1 min-h-0">
      <div class="col-7 h-full min-h-0">
        ${renderCodeWindow('TimSortDemo.java', 'java', activeTab.code, 1)}
      </div>

      <div class="bento-col col-5">
        <div class="bento-card bento-card-auto bento-item" style="--stagger:2">
          <h3 class="bento-title">Giải thích phương thức đang xem</h3>
          <p class="bento-body mt-2">${activeTab.description}</p>
        </div>

        <div class="bento-card bento-card-auto bento-item" style="--stagger:3">
          <span class="badge-pill badge-mint">Kết quả Console</span>
          <pre class="mono mt-2" style="font-size:var(--fs-code); color:#30D158; background:#0D0D0F; padding:8px 12px; border-radius:14px; border:1px solid rgba(48,209,88,0.28); line-height:1.45;">Input : [3, 5, 7, 2, 4, 6, 9, 1, 8, 10]
Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]</pre>
        </div>

        <div class="bento-card bento-card-accent flex-1 bento-item" style="--stagger:4">
          <h3 class="bento-title">Lưu ý kỹ thuật &amp; Tính ổn định</h3>
          <p class="bento-body mt-2">
            • Dùng <code>a[j] &gt; key</code> (thay vì <code>&gt;=</code>) trong <code>insertionSort</code> và <code>a[i] &lt;= a[j]</code> trong <code>merge</code> để giữ nguyên thứ tự các khóa bằng nhau.<br/>
            • Bản sản xuất OpenJDK bổ sung đảo run giảm dần, bất biến merge stack và galloping mode.
          </p>
        </div>
      </div>
    </div>
  `;
}

function renderSlide6() {
  return `
    <div class="bento-grid bento-grid-auto">
      <div class="bento-card bento-card-accent col-4 bento-item" style="--stagger:0">
        <span class="badge-pill badge-mint">Best Case</span>
        <div class="hero-stat-accent mt-2">O(n)</div>
        <p class="bento-body mt-1">1 lượt quét duy nhất trên mảng đã tăng dần.</p>
      </div>

      <div class="bento-card col-4 bento-item" style="--stagger:1">
        <span class="badge-pill badge-blue">Average &amp; Worst Case</span>
        <div class="hero-stat mt-2">O(n log n)</div>
        <p class="bento-body mt-1">Không bao giờ suy biến thành <code>O(n²)</code>.</p>
      </div>

      <div class="bento-card col-4 bento-item" style="--stagger:2">
        <span class="badge-pill badge-amber">Space Complexity</span>
        <div class="hero-stat mt-2">O(n)</div>
        <p class="bento-body mt-1">Bộ nhớ phụ cho vùng đệm tạm &amp; run stack.</p>
      </div>
    </div>

    <div class="bento-grid flex-1 min-h-0">
      <div class="bento-card col-7 bento-item" style="--stagger:3">
        <h3 class="bento-title">Bảng Độ phức tạp Thời gian (Time Complexity)</h3>
        <table class="data-table mt-2">
          <thead>
            <tr>
              <th>Trường hợp</th>
              <th>Độ phức tạp</th>
              <th>Cơ chế &amp; Tình huống ví dụ</th>
            </tr>
          </thead>
          <tbody>
            <tr class="row-highlight">
              <td class="font-bold">Tốt nhất (Best)</td>
              <td class="mono font-bold" style="color:#30D158">O(n)</td>
              <td>Mảng đã tăng dần, chỉ quét 1 lượt phát hiện 1 run duy nhất, không cần merge (VD: danh sách giao dịch theo thời gian).</td>
            </tr>
            <tr>
              <td class="font-bold">Trung bình (Avg)</td>
              <td class="mono font-bold" style="color:#64D2FF">O(n log n)</td>
              <td>Dữ liệu ngẫu nhiên hoặc bán sắp xếp, gộp qua khoảng <code>~log n</code> tầng; các run dài giúp giảm mạnh số lần gộp.</td>
            </tr>
            <tr>
              <td class="font-bold">Xấu nhất (Worst)</td>
              <td class="mono font-bold" style="color:#FFD60A">O(n log n)</td>
              <td>Dữ liệu đảo lộn tạo nhiều run ngắn, nhưng không bao giờ suy biến thành <code>O(n²)</code> nhờ quy tắc quản lý run.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bento-col col-5">
        <div class="bento-card flex-1 bento-item" style="--stagger:4">
          <h3 class="bento-title">Vùng đệm tạm &amp; Run Stack</h3>
          <p class="bento-body mt-2">
            • Tốn <strong>O(n)</strong> bộ nhớ phụ trong trường hợp xấu nhất cho vùng đệm tạm (<em>temporary buffer</em>) khi trộn hai run lớn và <code>run stack</code>.<br/>
            • Bản Java minh họa dùng <code>runStart</code> và <code>runEnd</code> kích thước <code>n</code> để dễ quan sát cấu trúc.
          </p>
        </div>

        <div class="bento-card bento-card-accent flex-1 bento-item" style="--stagger:5">
          <h3 class="bento-title">Timsort vs Dual-Pivot Quicksort</h3>
          <p class="bento-body mt-2">
            Chấp nhận tốn RAM <strong>O(n)</strong> (khác với Dual-Pivot Quicksort dùng cho kiểu nguyên thủy trong Java) để đổi lấy
            <strong>tính ổn định (Stability)</strong> và tốc độ cực cao trên dữ liệu thực tế gần có thứ tự.
          </p>
        </div>
      </div>
    </div>
  `;
}

function renderSlide7() {
  const logCode = `class LogEntry {
    final Instant timestamp;
    final String message;
    LogEntry(Instant timestamp, String message) {
        this.timestamp = timestamp;
        this.message = message;
    }
}
// Ghép log từ nhiều máy chủ lệch nhẹ timestamp -> nhiều run gần tăng dần:
logs.sort(Comparator.comparing(entry -> entry.timestamp));`;

  const lc88Code = `// Liên hệ LeetCode 88 (Merge Sorted Array): Gộp 2 run đã sắp xếp trong O(m + n)
static int[] mergeSortedArrays(int[] a, int[] b) {
    int[] out = new int[a.length + b.length];
    int i = 0, j = 0, k = 0;
    while (i < a.length && j < b.length)
        out[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];
    while (i < a.length) out[k++] = a[i++];
    while (j < b.length) out[k++] = b[j++];
    return out;
}`;

  return `
    <div class="bento-grid bento-grid-auto">
      <div class="bento-card bento-card-accent bento-card-auto col-12 bento-item" style="--stagger:0">
        <div class="flex-row justify-between flex-wrap gap-2">
          <h3 class="bento-title">1. Hệ sinh thái Ngôn ngữ Lập trình &amp; Runtime</h3>
          <div class="flex-row gap-2 flex-wrap">
            <span class="badge-pill badge-mint">Python sort() / sorted()</span>
            <span class="badge-pill badge-blue">Java Arrays.sort(Object[])</span>
            <span class="badge-pill badge-mint">V8 JS Engine</span>
            <span class="badge-pill badge-blue">Android</span>
          </div>
        </div>
        <p class="bento-body mt-2">
          Thuật toán sắp xếp mặc định trong <strong>Python</strong> (<code>sort()</code>, <code>sorted()</code>),
          <strong>Java</strong> (<code>Arrays.sort(Object[])</code>, <code>Collections.sort()</code>),
          <strong>Android</strong> và <strong>V8 JavaScript Engine</strong> (Chrome, Node.js).
        </p>
      </div>
    </div>

    <div class="bento-grid flex-1 min-h-0">
      <div class="bento-col col-6">
        <div class="bento-card bento-card-auto bento-item" style="--stagger:1">
          <span class="badge-pill badge-mint">2. Hệ thống thu thập Server Logs</span>
          <p class="bento-body mt-2">
            Ghép log từ nhiều máy chủ bị lệch nhẹ timestamp do độ trễ mạng tạo thành nhiều run gần tăng dần.
            Timsort nhận diện nhanh và giữ nguyên thứ tự các log trùng timestamp.
          </p>
        </div>
        ${renderCodeWindow('ServerLogSort.java', 'java', logCode, 2)}
      </div>

      <div class="bento-col col-6">
        <div class="bento-card bento-card-auto bento-item" style="--stagger:3">
          <span class="badge-pill badge-blue">3. Liên hệ LeetCode 88 — Merge Sorted Array</span>
          <p class="bento-body mt-2">
            Tư tưởng tận dụng các đoạn đã có thứ tự thay vì sắp xếp lại từ đầu và trộn bằng 2 con trỏ trong thời gian tuyến tính <code>O(m + n)</code>.
          </p>
        </div>
        ${renderCodeWindow('MergeSortedRuns.java', 'java', lc88Code, 4)}
      </div>
    </div>
  `;
}

function renderSlide8() {
  return `
    <div class="bento-grid bento-grid-auto">
      <div class="bento-card col-8 bento-item" style="--stagger:0">
        <div class="flex-row justify-between flex-wrap gap-2">
          <span class="badge-pill badge-purple">David R. Musser (1997) — Bảo vệ std::sort của C++ STL</span>
          <span class="mono bento-caption" style="color:#DF9EFF">Ví dụ: [19, 7, 15, 12, 16, 18, 4, 11, 13] → [4..19]</span>
        </div>
        <p class="bento-body mt-2">
          <strong>Đặc tả bài toán:</strong> Sắp xếp mảng dựa trên phép so sánh tại chỗ (<em>In-place comparison sort</em>) — vừa đạt tốc độ thực thi trung bình nhanh như Quicksort, vừa khóa chặt thời gian xấu nhất ở mức <strong>O(n log n)</strong>.
        </p>
      </div>

      <div class="bento-card bento-card-accent col-4 bento-item" style="--stagger:1">
        <span class="badge-pill badge-purple">Kiến trúc Lai</span>
        <div class="hero-stat-accent mt-1">3-in-1</div>
        <p class="bento-body mt-1"><code>depth = 2⌊log₂ n⌋</code> • <code>size ≤ 16</code></p>
      </div>
    </div>

    <div class="bento-grid flex-1 min-h-0">
      <div class="bento-card col-6 bento-item justify-between" style="--stagger:2">
        <h3 class="bento-title">Tại sao không dùng 1 thuật toán đơn lẻ?</h3>
        <div class="flex-col gap-2 mt-2 flex-1 justify-between">
          <div class="bento-subtile">
            <p class="bento-body"><strong style="color:#FF6961">1. Chỉ dùng Quicksort:</strong> Trung bình rất nhanh nhưng suy biến <code>O(n²)</code> và tràn stack <code>O(n)</code> khi chọn chốt xấu.</p>
          </div>
          <div class="bento-subtile">
            <p class="bento-body"><strong style="color:#FFD60A">2. Chỉ dùng Heapsort:</strong> Luôn <code>O(n log n)</code> và <code>O(1)</code> RAM, nhưng nhảy bộ nhớ liên tục gây <strong>Cache Miss</strong>, chậm hơn Quicksort 2–3 lần.</p>
          </div>
          <div class="bento-subtile">
            <p class="bento-body"><strong style="color:#64D2FF">3. Không có Insertion Sort:</strong> Quicksort gọi đệ quy tới đoạn 1–2 phần tử → lãng phí tới <strong>75% tổng số lời gọi hàm</strong> ở đáy cây đệ quy.</p>
          </div>
        </div>
      </div>

      <div class="bento-card col-6 bento-item justify-between" style="--stagger:3">
        <h3 class="bento-title">3 Trụ cột của Introsort</h3>
        <div class="flex-col gap-2 mt-2 flex-1 justify-between">
          <div class="bento-subtile" style="border-color:rgba(94,92,230,0.45);">
            <p class="bento-body"><strong style="color:#5AC8FA">1. Quicksort (Chủ lực):</strong> Khi <code>size &gt; 16</code> và <code>depth &gt; 0</code>. Dùng chốt <em>Median-of-Three</em>, duyệt tuần tự thân thiện L1/L2 CPU Cache.</p>
          </div>
          <div class="bento-subtile" style="border-color:rgba(191,90,242,0.5);">
            <p class="bento-body"><strong style="color:#BF5AF2">2. Heapsort (Lưới an toàn):</strong> Khi <code>size &gt; 16</code> và <code>depth == 0</code>. Vun đống tại chỗ ngay trên đoạn con bị lệch, khóa chặt cận trên <code>O(n log n)</code>.</p>
          </div>
          <div class="bento-subtile" style="border-color:rgba(48,209,88,0.45);">
            <p class="bento-body"><strong style="color:#30D158">3. Insertion Sort (Đoạn nhỏ):</strong> Khi <code>size &lt;= 16</code>. Triệt tiêu chi phí gọi hàm đệ quy (<em>recursion overhead</em>) ở đáy cây.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSlide9() {
  return `
    <div class="bento-grid flex-1 min-h-0">
      <div class="bento-col col-4">
        <div class="bento-card bento-card-accent bento-card-auto bento-item" style="--stagger:0">
          <span class="badge-pill badge-purple">Ngân sách độ sâu gốc</span>
          <div class="hero-stat-accent mt-2">2⌊log₂ n⌋</div>
          <p class="bento-body mt-2"><code>depth_limit = 2 * floor(log2(n))</code></p>
        </div>

        <div class="bento-card bento-card-auto bento-item" style="--stagger:1">
          <span class="badge-pill badge-mint">Ngưỡng đoạn nhỏ</span>
          <div class="hero-stat mt-2">size ≤ 16</div>
          <p class="bento-body mt-2">Chuyển sang Insertion Sort trực tiếp, triệt tiêu chi phí đệ quy.</p>
        </div>

        <div class="bento-card flex-1 bento-item" style="--stagger:2">
          <h3 class="bento-title">Khử đệ quy đuôi</h3>
          <p class="bento-body mt-2">
            Đệ quy nửa phải <code>[p + 1 .. high]</code>, rồi gán <code>high = p - 1</code> lặp <code>while</code> cho nửa trái với <code>depth_limit - 1</code>.
          </p>
        </div>
      </div>

      <div class="bento-card col-8 bento-item" style="--stagger:3">
        <div class="flex-row justify-between flex-wrap gap-2">
          <h3 class="bento-title">Lưu đồ điều phối <code>_introsort_util(low, high, depth_limit)</code></h3>
          <span class="badge-pill badge-purple">3 Nhánh Rẽ Cốt Lõi</span>
        </div>

        <div class="flex-1 min-h-0 flex items-center justify-center mt-2">
          <svg viewBox="0 0 980 370" style="width:100%; height:100%; max-height:100%;">
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

            <rect x="20" y="16" width="310" height="66" rx="16" fill="#0D0D0F" stroke="#5E5CE6" stroke-width="2" />
            <text x="175" y="43" text-anchor="middle" fill="#F5F5F7" font-size="14" font-weight="700">Bắt đầu _introsort_util(low, high, depth)</text>
            <text x="175" y="65" text-anchor="middle" fill="#A1A1A6" font-size="13">Tính size = high - low + 1</text>

            <line x1="175" y1="82" x2="175" y2="112" stroke="#A1A1A6" stroke-width="2" marker-end="url(#arrow)" />

            <rect x="20" y="114" width="310" height="66" rx="16" fill="rgba(48,209,88,0.12)" stroke="#30D158" stroke-width="2" />
            <text x="175" y="141" text-anchor="middle" fill="#30D158" font-size="14" font-weight="700">Bước 1: Kiểm tra đoạn nhỏ</text>
            <text x="175" y="163" text-anchor="middle" fill="#F5F5F7" font-size="13">size &lt;= 16 (THRESHOLD) ?</text>

            <line x1="330" y1="147" x2="432" y2="147" stroke="#30D158" stroke-width="2" marker-end="url(#arrow-mint)" />
            <text x="381" y="137" text-anchor="middle" fill="#30D158" font-size="12" font-weight="700">ĐÚNG</text>

            <rect x="436" y="114" width="524" height="66" rx="16" fill="rgba(48,209,88,0.18)" stroke="#30D158" stroke-width="2" />
            <text x="698" y="141" text-anchor="middle" fill="#F5F5F7" font-size="14" font-weight="700">Insertion Sort đoạn [low..high] &amp; RETURN</text>
            <text x="698" y="163" text-anchor="middle" fill="#A7F3D0" font-size="13">Chèn trực tiếp, triệt tiêu chi phí gọi hàm đệ quy ở đáy cây</text>

            <line x1="175" y1="180" x2="175" y2="210" stroke="#A1A1A6" stroke-width="2" marker-end="url(#arrow)" />
            <text x="195" y="199" fill="#A1A1A6" font-size="12" font-weight="700">SAI</text>

            <rect x="20" y="212" width="310" height="66" rx="16" fill="rgba(191,90,242,0.14)" stroke="#BF5AF2" stroke-width="2" />
            <text x="175" y="239" text-anchor="middle" fill="#BF5AF2" font-size="14" font-weight="700">Bước 2: Kiểm tra ngân sách độ sâu</text>
            <text x="175" y="261" text-anchor="middle" fill="#F5F5F7" font-size="13">depth_limit == 0 ?</text>

            <line x1="330" y1="245" x2="432" y2="245" stroke="#BF5AF2" stroke-width="2" marker-end="url(#arrow-purple)" />
            <text x="381" y="235" text-anchor="middle" fill="#BF5AF2" font-size="12" font-weight="700">ĐÚNG</text>

            <rect x="436" y="212" width="524" height="66" rx="16" fill="rgba(191,90,242,0.22)" stroke="#BF5AF2" stroke-width="2" />
            <text x="698" y="239" text-anchor="middle" fill="#F5F5F7" font-size="14" font-weight="700">Heapsort đoạn con [low..high] &amp; RETURN</text>
            <text x="698" y="261" text-anchor="middle" fill="#E9D5FF" font-size="13">Vun đống tại chỗ bằng offset = low, khóa chặt cận O(n log n)</text>

            <line x1="175" y1="278" x2="175" y2="304" stroke="#A1A1A6" stroke-width="2" marker-end="url(#arrow)" />
            <text x="195" y="295" fill="#A1A1A6" font-size="12" font-weight="700">SAI</text>

            <rect x="20" y="306" width="940" height="54" rx="16" fill="rgba(41,151,255,0.16)" stroke="#2997FF" stroke-width="2" />
            <text x="490" y="329" text-anchor="middle" fill="#F5F5F7" font-size="14" font-weight="700">Bước 3 (Phân hoạch chuẩn Quicksort): p = partition_median_of_three(arr, low, high)</text>
            <text x="490" y="349" text-anchor="middle" fill="#5AC8FA" font-size="13">Đệ quy nửa phải [p + 1 .. high] với (depth_limit - 1)  •  Khử đệ quy đuôi nửa trái: high = p - 1</text>
          </svg>
        </div>
      </div>
    </div>
  `;
}

function getIntroScenario() {
  return INTROSORT_TREE_SCENARIOS[state.introTab] || INTROSORT_TREE_SCENARIOS.tab1;
}

function getIntroStepData() {
  const sc = getIntroScenario();
  return sc.steps[state.introStep] || sc.steps[0];
}

function syncIntroSpeedTiming() {
  const animMs = Math.round(620 / state.introSpeed);
  document.documentElement.style.setProperty('--intro-anim-ms', `${animMs}ms`);
  const speedLabelEl = document.getElementById('intro-speed-label');
  if (speedLabelEl) {
    speedLabelEl.textContent = `${state.introSpeed.toFixed(state.introSpeed % 1 === 0 ? 1 : 2)}x`;
  }
}

function renderSlide10() {
  const speedLabel = `${state.introSpeed.toFixed(state.introSpeed % 1 === 0 ? 1 : 2)}x`;
  return `
    <div class="bento-grid flex-1 min-h-0">
      <div id="intro-sim-root" class="intro-card col-12 bento-item" style="--stagger:0">
        <div class="intro-top-bar">
          <div id="intro-tabs-wrap" class="intro-tabs-wrap" role="tablist" aria-label="Chọn kịch bản Introsort">
            <div id="intro-tab-pill" class="pill-tab1"></div>
            <button id="intro-tab1-btn" type="button" role="tab" aria-selected="true" class="intro-tab-btn active-tab1" data-action="intro-tab" data-tab="tab1">
              Tab 1: Trường hợp chuẩn (threshold=3, depth=6)
            </button>
            <button id="intro-tab2-btn" type="button" role="tab" aria-selected="false" class="intro-tab-btn" data-action="intro-tab" data-tab="tab2">
              Tab 2: Kích hoạt Heapsort (threshold=2, depth=1)
            </button>
          </div>

          <div class="intro-controls">
            <button id="intro-btn-auto" type="button" class="intro-btn-play" data-action="intro-auto">
              <span>▶</span><span>Tự động chạy</span>
            </button>
            <button id="intro-btn-prev" type="button" class="intro-btn" data-action="intro-prev" title="Quay lại ([)">
              <span>⏮</span><span>Quay lại</span>
            </button>
            <button id="intro-btn-next" type="button" class="intro-btn" data-action="intro-next" title="Bước tiếp (])">
              <span>Bước tiếp</span><span>⏭</span>
            </button>
            <button id="intro-btn-reset" type="button" class="intro-btn" data-action="intro-reset" title="Đặt lại về Bước 0">
              <span>↺</span><span>Đặt lại</span>
            </button>
            <div class="intro-speed-box">
              <span>Tốc độ</span>
              <input id="intro-speed-slider" class="intro-speed-slider" type="range" min="0.5" max="2.5" step="0.25" value="${state.introSpeed}" aria-label="Tốc độ mô phỏng" />
              <span id="intro-speed-label" class="intro-speed-label">${speedLabel}</span>
            </div>
          </div>
        </div>

        <section class="intro-top-grid">
          <div class="intro-array-panel">
            <div class="intro-array-header">
              <div class="flex-row gap-2">
                <span class="intro-array-title">Mảng A[0..8]</span>
                <span id="intro-active-range" class="intro-range-pill">Đang xét: toàn mảng [0..8]</span>
              </div>
              <div class="intro-inline-key">
                <span class="intro-key-item"><span class="intro-key-dot" style="background:#a855f7"></span>Nửa trái</span>
                <span class="intro-key-item"><span class="intro-key-dot" style="background:#f43f5e"></span>Pivot</span>
                <span class="intro-key-item"><span class="intro-key-dot" style="background:#0ea5e9"></span>Nửa phải</span>
                <span class="intro-key-item"><span class="intro-key-dot" style="background:#f97316"></span>Heapsort</span>
                <span class="intro-key-item"><span class="intro-key-dot" style="background:#22c55e"></span>Đã chốt ✓</span>
              </div>
            </div>

            <div class="intro-tiles-stage">
              <div id="intro-array-track" class="intro-array-track">
                <div id="intro-group-left" class="intro-group-bar intro-group-left">
                  <span class="intro-group-label" style="left:8px; color:#d8b4fe;">Nửa trái</span>
                </div>
                <div id="intro-group-right" class="intro-group-bar intro-group-right">
                  <span class="intro-group-label" style="right:8px; color:#7dd3fc;">Nửa phải</span>
                </div>
                <div id="intro-group-active" class="intro-group-bar">
                  <span id="intro-group-active-label" class="intro-group-label" style="left:8px;">Đang xử lý</span>
                </div>
                <div id="intro-tiles-layer" class="intro-tiles-layer"></div>
              </div>
              <div id="intro-index-row" class="intro-index-row"></div>
            </div>
          </div>

          <div id="intro-explain-box" class="intro-explain-panel box-init">
            <div class="intro-explain-meta">
              <div class="flex-row gap-2 flex-wrap">
                <span id="intro-step-badge" class="intro-step-badge">Bước 0</span>
                <span id="intro-meta-range" class="intro-meta-range">[0..8] (size=9)</span>
                <span style="color:#52525b">•</span>
                <span id="intro-meta-depth" class="intro-meta-depth">depth=6</span>
              </div>
              <span id="intro-algo-badge" class="intro-algo-badge badge-init">Khởi tạo</span>
            </div>

            <div class="intro-desc-wrap">
              <p id="intro-step-desc" class="intro-desc-text"></p>
            </div>

            <div class="intro-explain-footer">
              <span id="intro-step-progress" class="mono">Trạng thái 0 / 7</span>
              <span>Bấm vào node trên cây để nhảy đến bước tương ứng</span>
            </div>
          </div>
        </section>

        <section class="intro-center-panel">
          <div class="intro-center-header">
            <div class="flex-row gap-2">
              <h3 class="intro-center-title">Cây đệ quy phân hoạch &amp; Thước đo Depth</h3>
              <span class="intro-center-sub">Độ sâu đếm ngược từ trên xuống</span>
            </div>
            <div class="intro-algo-legend">
              <span class="intro-key-item"><span class="intro-legend-dot" style="background:#a855f7"></span>Quicksort</span>
              <span class="intro-key-item"><span class="intro-legend-dot" style="background:#22c55e"></span>Insertion Sort</span>
              <span class="intro-key-item"><span class="intro-legend-dot" style="background:#f97316"></span>Heapsort (Depth = 0)</span>
            </div>
          </div>

          <div class="intro-center-row">
            <div id="intro-tree-main" class="intro-tree-main">
              <div id="intro-depth-ruler" class="intro-depth-ruler" aria-label="Thước đo độ sâu Depth">
                <div class="intro-depth-track">
                  <div id="intro-depth-fill" style="height:12%; background:linear-gradient(180deg, #a855f7, #818cf8);"></div>
                </div>
                <div id="intro-depth-pointer"></div>
                <div id="intro-depth-ticks" class="intro-depth-ticks"></div>
              </div>

              <div id="intro-tree-canvas" class="intro-tree-canvas" aria-label="Sơ đồ cây đệ quy Introsort">
                <div id="intro-guide-lines" class="intro-guide-lines"></div>
                <svg id="intro-tree-svg" xmlns="http://www.w3.org/2000/svg"></svg>
                <div id="intro-active-ring"></div>
                <div id="intro-tree-nodes" class="intro-tree-nodes"></div>
              </div>
            </div>

            <aside id="intro-heap-panel" aria-label="Minh họa cây nhị phân Max-Heap">
              <div class="intro-heap-card">
                <div class="intro-heap-header">
                  <div>
                    <div id="intro-heap-title" class="intro-heap-title">Build Max-Heap [0..5]</div>
                    <div id="intro-heap-sub" class="intro-heap-sub">Kích hoạt khi chạm Depth = 0</div>
                  </div>
                  <span id="intro-heap-badge" class="intro-heap-badge">Max-Heap</span>
                </div>

                <div class="intro-heap-stage-wrap">
                  <div class="intro-heap-stage">
                    <svg id="intro-heap-svg" viewBox="0 0 280 184" xmlns="http://www.w3.org/2000/svg"></svg>
                    <div id="intro-heap-nodes" class="intro-heap-nodes"></div>
                  </div>
                </div>

                <div id="intro-heap-note" class="intro-heap-note"></div>
              </div>
            </aside>
          </div>
        </section>

        <footer class="intro-footer">
          <span>Introsort kết hợp Quicksort (nhanh trung bình) + Insertion Sort (mảng nhỏ) + Heapsort (bảo vệ tránh O(n²)).</span>
          <span>Phím tắt mô phỏng: <kbd>P</kbd> Chạy/Dừng · <kbd>[</kbd> <kbd>]</kbd> Chuyển bước · <kbd>1</kbd> <kbd>2</kbd> Đổi Tab</span>
        </footer>
      </div>
    </div>
  `;
}

function initIntroArrayTiles() {
  const tilesLayer = document.getElementById('intro-tiles-layer');
  const indexRow = document.getElementById('intro-index-row');
  if (!tilesLayer || !indexRow) return;

  tilesLayer.innerHTML = '';
  indexRow.innerHTML = '';
  state.introTileEls.clear();
  state.introIndexEls = [];
  state.introPrevIndexMap.clear();

  INTROSORT_INITIAL_ARRAY.forEach((val, initIdx) => {
    const outer = document.createElement('div');
    outer.className = 'intro-tile-outer';
    outer.dataset.val = String(val);

    const inner = document.createElement('div');
    inner.className = 'intro-tile-inner tile-default';

    const tagEl = document.createElement('span');
    tagEl.className = 'intro-tile-tag';

    const checkEl = document.createElement('span');
    checkEl.className = 'intro-tile-check';
    checkEl.textContent = '✓';

    const numEl = document.createElement('span');
    numEl.textContent = String(val);

    inner.appendChild(tagEl);
    inner.appendChild(checkEl);
    inner.appendChild(numEl);
    outer.appendChild(inner);
    tilesLayer.appendChild(outer);

    state.introTileEls.set(val, { outer, inner, tagEl, checkEl });
    state.introPrevIndexMap.set(val, initIdx);
  });

  for (let i = 0; i < 9; i++) {
    const idxEl = document.createElement('div');
    idxEl.className = 'intro-index-cell';
    idxEl.textContent = `[${i}]`;
    indexRow.appendChild(idxEl);
    state.introIndexEls.push(idxEl);
  }
}

function initIntroHeapStage() {
  const svg = document.getElementById('intro-heap-svg');
  const layer = document.getElementById('intro-heap-nodes');
  if (!svg || !layer) return;

  svg.innerHTML = '';
  layer.innerHTML = '';
  state.introHeapNodeEls.clear();
  state.introHeapEdgeEls = [];

  INTROSORT_HEAP_EDGES.forEach(([p, c]) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', INTROSORT_HEAP_COORDS[p].x);
    line.setAttribute('y1', INTROSORT_HEAP_COORDS[p].y);
    line.setAttribute('x2', INTROSORT_HEAP_COORDS[c].x);
    line.setAttribute('y2', INTROSORT_HEAP_COORDS[c].y);
    line.setAttribute('stroke', '#f97316');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('opacity', '0.65');
    line.style.transition = 'stroke 360ms ease, opacity 360ms ease';
    svg.appendChild(line);
    state.introHeapEdgeEls.push(line);
  });

  INTROSORT_HEAP_VALUES.forEach((val, idx) => {
    const circle = document.createElement('div');
    circle.className = 'intro-heap-circle';
    circle.innerHTML = `
      <span>${val}</span>
      <span class="intro-heap-idx-tag">[${idx}]</span>
    `;
    const { x, y } = INTROSORT_HEAP_COORDS[idx];
    circle.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    layer.appendChild(circle);
    state.introHeapNodeEls.set(val, circle);
  });
}

function getIntroSlotGeometry() {
  const track = document.getElementById('intro-array-track');
  if (!track) return { trackW: 0, gap: 8, slotW: 0 };
  const trackW = track.clientWidth;
  const gap = 8;
  const slotW = (trackW - gap * 8) / 9;
  return { trackW, gap, slotW };
}

function positionIntroGroupBar(barEl, range, visible, extraClass = '') {
  if (!barEl) return;
  if (!visible || !range) {
    barEl.style.opacity = '0';
    return;
  }
  const { gap, slotW } = getIntroSlotGeometry();
  if (slotW <= 0) return;
  const [start, end] = range;
  const x = start * (slotW + gap) - 4;
  const w = (end - start + 1) * slotW + (end - start) * gap + 8;
  barEl.style.transform = `translate3d(${x}px, 0, 0)`;
  barEl.style.width = `${w}px`;
  barEl.style.opacity = '1';
  if (extraClass) {
    barEl.className = `intro-group-bar ${extraClass}`;
  }
}

function updateIntroSlidingTabs() {
  const btn1 = document.getElementById('intro-tab1-btn');
  const btn2 = document.getElementById('intro-tab2-btn');
  const pill = document.getElementById('intro-tab-pill');
  if (!btn1 || !btn2 || !pill) return;

  const isTab1 = state.introTab === 'tab1';
  const activeBtn = isTab1 ? btn1 : btn2;
  btn1.setAttribute('aria-selected', String(isTab1));
  btn2.setAttribute('aria-selected', String(!isTab1));
  btn1.className = `intro-tab-btn ${isTab1 ? 'active-tab1' : ''}`;
  btn2.className = `intro-tab-btn ${!isTab1 ? 'active-tab2' : ''}`;

  pill.style.transform = `translate3d(${activeBtn.offsetLeft}px, 0, 0)`;
  pill.style.width = `${activeBtn.offsetWidth}px`;
  pill.className = isTab1 ? 'pill-tab1' : 'pill-tab2';
}

function updateIntroArrayTiles(stepData, triggerArc = true) {
  const { gap, slotW } = getIntroSlotGeometry();
  if (slotW <= 0) return;

  const [low, high] = stepData.range;
  const rangeEl = document.getElementById('intro-active-range');
  if (rangeEl) {
    rangeEl.textContent =
      stepData.step === 0
        ? 'Đang xét: toàn mảng [0..8]'
        : `Đang xét: [${low}..${high}] (size = ${stepData.size})`;
  }

  const groupLeft = document.getElementById('intro-group-left');
  const groupRight = document.getElementById('intro-group-right');
  const groupActive = document.getElementById('intro-group-active');
  const groupActiveLabel = document.getElementById('intro-group-active-label');

  if (stepData.algoType === 'quick' && stepData.leftRange && stepData.rightRange) {
    positionIntroGroupBar(groupLeft, stepData.leftRange, true);
    positionIntroGroupBar(groupRight, stepData.rightRange, true);
    positionIntroGroupBar(groupActive, null, false);
  } else if (stepData.algoType === 'insertion') {
    positionIntroGroupBar(groupLeft, null, false);
    positionIntroGroupBar(groupRight, null, false);
    if (groupActiveLabel) {
      groupActiveLabel.textContent = 'Insertion Sort';
      groupActiveLabel.style.color = '#86efac';
    }
    positionIntroGroupBar(groupActive, stepData.range, true, 'intro-group-insertion');
  } else if (stepData.algoType === 'heap') {
    positionIntroGroupBar(groupLeft, null, false);
    positionIntroGroupBar(groupRight, null, false);
    const isDone = stepData.step === 4;
    if (groupActiveLabel) {
      groupActiveLabel.textContent = isDone ? 'Heapsort Hoàn tất' : 'Max-Heap [0..5]';
      groupActiveLabel.style.color = isDone ? '#86efac' : '#fdba74';
    }
    positionIntroGroupBar(
      groupActive,
      stepData.range,
      true,
      isDone ? 'intro-group-insertion' : 'intro-group-heap'
    );
  } else {
    positionIntroGroupBar(groupLeft, null, false);
    positionIntroGroupBar(groupRight, null, false);
    positionIntroGroupBar(groupActive, null, false);
  }

  const isInSeg = (idx, r) => Array.isArray(r) && idx >= r[0] && idx <= r[1];

  stepData.array.forEach((val, idx) => {
    const item = state.introTileEls.get(val);
    if (!item) return;

    const prevIdx = state.introPrevIndexMap.get(val);
    const moved = triggerArc && prevIdx !== undefined && prevIdx !== idx;
    const dist = prevIdx !== undefined ? Math.abs(idx - prevIdx) : 0;

    const targetX = idx * (slotW + gap);
    item.outer.style.width = `${slotW}px`;
    item.outer.style.transform = `translate3d(${targetX}px, 0, 0)`;
    item.outer.style.zIndex = moved ? (dist > 2 ? '30' : '25') : '10';

    item.inner.classList.remove('intro-arc-high', 'intro-arc-low');
    if (moved) {
      void item.inner.offsetWidth;
    }

    const inActiveSegment = stepData.step > 0 && idx >= low && idx <= high;
    const isPivot = stepData.pivotIndex === idx;
    const isLeft = isInSeg(idx, stepData.leftRange);
    const isRight = isInSeg(idx, stepData.rightRange);
    const isHeapBuild = stepData.step === 3 && isInSeg(idx, stepData.heapRange);
    const isSorted = stepData.sortedIndices.includes(idx);

    let tileCls = 'tile-default';
    let tagText = '';
    let tagColor = '';

    if (isPivot) {
      tileCls = 'tile-pivot';
      tagText = `Pivot p=${idx}`;
      tagColor = '#fda4af';
      item.outer.style.zIndex = '35';
    } else if (isHeapBuild) {
      tileCls = idx === 0 ? 'tile-heap-max' : 'tile-heap';
      if (idx === 0) {
        tagText = 'Max';
        tagColor = '#fdba74';
      }
    } else if (isLeft) {
      tileCls = 'tile-left';
    } else if (isRight) {
      tileCls = 'tile-right';
    } else if (isSorted && inActiveSegment) {
      tileCls = 'tile-sorted-active';
    } else if (isSorted) {
      tileCls = 'tile-sorted';
    }

    item.inner.className = `intro-tile-inner ${tileCls} ${
      moved ? (dist >= 2 ? 'intro-arc-high' : 'intro-arc-low') : ''
    }`;

    if (tagText) {
      item.tagEl.textContent = tagText;
      item.tagEl.style.color = tagColor;
      item.tagEl.className = 'intro-tile-tag is-visible';
    } else {
      item.tagEl.className = 'intro-tile-tag';
    }

    item.checkEl.style.opacity = isSorted && !isPivot ? '1' : '0';
    state.introPrevIndexMap.set(val, idx);
  });

  state.introIndexEls.forEach((el, idx) => {
    const inActive = stepData.step > 0 && idx >= low && idx <= high;
    el.className = `intro-index-cell ${inActive ? 'is-active' : ''}`;
  });
}

function updateIntroExplanation(stepData, scenario) {
  const stepBadge = document.getElementById('intro-step-badge');
  const metaRange = document.getElementById('intro-meta-range');
  const metaDepth = document.getElementById('intro-meta-depth');
  const algoBadge = document.getElementById('intro-algo-badge');
  const explainBox = document.getElementById('intro-explain-box');
  const descEl = document.getElementById('intro-step-desc');
  const progressEl = document.getElementById('intro-step-progress');

  if (stepBadge) stepBadge.textContent = `Bước ${stepData.step}`;
  if (metaRange) metaRange.textContent = `[${stepData.range[0]}..${stepData.range[1]}] (size=${stepData.size})`;
  if (metaDepth) {
    metaDepth.textContent = `depth=${stepData.depth}`;
    metaDepth.className = `intro-meta-depth ${stepData.depth === 0 ? 'is-zero' : ''}`;
  }
  if (algoBadge) {
    algoBadge.textContent = stepData.algo;
    algoBadge.className = `intro-algo-badge badge-${stepData.algoType}`;
  }
  if (explainBox) {
    explainBox.className = `intro-explain-panel box-${stepData.algoType}`;
  }
  if (descEl) {
    descEl.classList.remove('intro-fade-slide-in');
    void descEl.offsetWidth;
    descEl.textContent = stepData.description;
    descEl.classList.add('intro-fade-slide-in');
  }
  if (progressEl) {
    progressEl.textContent = `Trạng thái ${stepData.step} / ${scenario.steps.length - 1}`;
  }
}

function rebuildIntroSvgEdges(scenario) {
  const treeCanvas = document.getElementById('intro-tree-canvas');
  const svg = document.getElementById('intro-tree-svg');
  if (!treeCanvas || !svg) return;

  const canvasRect = treeCanvas.getBoundingClientRect();
  if (canvasRect.width === 0 || canvasRect.height === 0) return;

  svg.setAttribute('viewBox', `0 0 ${canvasRect.width} ${canvasRect.height}`);
  svg.innerHTML = '';
  state.introTreeEdgeEls = [];

  scenario.edges.forEach((edge) => {
    const fromObj = state.introTreeNodeEls.get(edge.from);
    const toObj = state.introTreeNodeEls.get(edge.to);
    if (!fromObj || !toObj) return;

    const r1 = fromObj.el.getBoundingClientRect();
    const r2 = toObj.el.getBoundingClientRect();

    const x1 = r1.left - canvasRect.left + r1.width / 2;
    const y1 = r1.bottom - canvasRect.top;
    const x2 = r2.left - canvasRect.left + r2.width / 2;
    const y2 = r2.top - canvasRect.top;
    const midY = y1 + (y2 - y1) * 0.52;
    const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

    const bgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    bgPath.setAttribute('d', d);
    bgPath.setAttribute('fill', 'none');
    bgPath.setAttribute('stroke', '#272c3d');
    bgPath.setAttribute('stroke-width', '1.4');
    bgPath.setAttribute('stroke-dasharray', '4 4');
    bgPath.setAttribute('opacity', '0.55');
    svg.appendChild(bgPath);

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', d);
    pathEl.setAttribute('fill', 'none');
    pathEl.setAttribute('stroke-width', '2.4');
    pathEl.setAttribute('stroke-linecap', 'round');
    pathEl.setAttribute('class', 'intro-edge-path');
    svg.appendChild(pathEl);

    const length = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = `${length}`;
    pathEl.style.strokeDashoffset = `${length}`;

    const labelX = (x1 + x2) / 2 + (edge.branch === 'left' ? -20 : 20);
    const labelY = (y1 + y2) / 2 - 2;

    const labelEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelEl.setAttribute('x', labelX);
    labelEl.setAttribute('y', labelY);
    labelEl.setAttribute('text-anchor', 'middle');
    labelEl.setAttribute('font-size', '10');
    labelEl.setAttribute('font-weight', '600');
    labelEl.setAttribute('class', 'intro-edge-label');
    labelEl.textContent = edge.label;
    svg.appendChild(labelEl);

    state.introTreeEdgeEls.push({ edge, pathEl, labelEl, length });
  });

  updateIntroTreeVisualStates(scenario, getIntroStepData());
}

function buildIntroTreeScene(scenario) {
  const treeMain = document.getElementById('intro-tree-main');
  const treeCanvas = document.getElementById('intro-tree-canvas');
  const ticksLayer = document.getElementById('intro-depth-ticks');
  const guidesLayer = document.getElementById('intro-guide-lines');
  const nodesLayer = document.getElementById('intro-tree-nodes');
  if (!treeMain || !treeCanvas || !ticksLayer || !guidesLayer || !nodesLayer) return;

  ticksLayer.innerHTML = '';
  guidesLayer.innerHTML = '';
  nodesLayer.innerHTML = '';
  state.introTreeNodeEls.clear();

  scenario.depthRows.forEach((row, rIdx) => {
    const topPct = scenario.rowCentersPct[rIdx];
    const tick = document.createElement('div');
    tick.style.top = `${topPct}%`;
    tick.className = 'intro-depth-tick';
    if (row.isDanger) {
      tick.innerHTML = `
        <span style="font-size:11px; font-weight:800; color:#fb7185;">${row.label}</span>
        <span style="font-size:9px; font-weight:600; color:rgba(251,113,133,0.8);">${row.sub}</span>
      `;
    } else {
      tick.innerHTML = `
        <span style="font-size:11px; font-weight:700; color:#d4d4d8;">${row.label}</span>
        <span style="font-size:9px; color:#71717a;">${row.sub}</span>
      `;
    }
    ticksLayer.appendChild(tick);

    const guide = document.createElement('div');
    guide.style.top = `${topPct}%`;
    if (row.isDanger) {
      guide.className = 'intro-guide-line is-danger';
      guide.innerHTML = `
        <span class="intro-danger-tag">
          ${
            row.isCompactWarning
              ? '⚠ Depth = 0 (Kích hoạt Heapsort — Chưa chạm tới)'
              : '⚠ Depth = 0 (Kích hoạt Heapsort nếu size > 2)'
          }
        </span>
      `;
    } else {
      guide.className = 'intro-guide-line';
    }
    guidesLayer.appendChild(guide);
  });

  scenario.nodes.forEach((node) => {
    const topPct = scenario.rowCentersPct[node.rowIndex];
    const el = document.createElement('div');
    el.dataset.nodeId = node.id;
    el.style.left = `${node.xPercent}%`;
    el.style.top = `${topPct}%`;
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');

    let subPillsHtml = '';
    if (node.extraStep !== undefined) {
      subPillsHtml = `
        <div class="intro-heap-subpills">
          <button type="button" data-action="intro-node-jump" data-step="3" class="intro-heap-pill pill-b3">B3: Max-Heap</button>
          <button type="button" data-action="intro-node-jump" data-step="4" class="intro-heap-pill pill-b4">B4: Hoàn tất</button>
        </div>
      `;
    }

    el.className = `intro-tree-node node-${node.algoType}`;
    el.innerHTML = `
      <div class="intro-node-badge">${node.badge}</div>
      <div class="intro-node-range">${node.rangeText}</div>
      <div class="intro-node-detail">${node.detail}</div>
      ${subPillsHtml}
    `;

    el.addEventListener('click', (e) => {
      const pill = e.target.closest('[data-action="intro-node-jump"]');
      if (pill) {
        e.stopPropagation();
        jumpIntroStep(Number(pill.dataset.step));
        return;
      }
      if (node.extraStep !== undefined && state.introStep === node.step) {
        jumpIntroStep(node.extraStep);
      } else {
        jumpIntroStep(node.step);
      }
    });

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        jumpIntroStep(node.step);
      }
    });

    nodesLayer.appendChild(el);
    state.introTreeNodeEls.set(node.id, { el, node });
  });

  rebuildIntroSvgEdges(scenario);
}

function updateIntroTreeVisualStates(scenario, stepData) {
  const ruler = document.getElementById('intro-depth-ruler');
  const depthPointer = document.getElementById('intro-depth-pointer');
  const depthFill = document.getElementById('intro-depth-fill');
  const treeCanvas = document.getElementById('intro-tree-canvas');
  const activeRing = document.getElementById('intro-active-ring');

  if (ruler && depthPointer && depthFill) {
    const rowIdx = scenario.depthRows.findIndex((r) => r.depth === stepData.depth);
    const safeRowIdx = rowIdx >= 0 ? rowIdx : 0;
    const pct = scenario.rowCentersPct[safeRowIdx];
    const rulerH = ruler.clientHeight || scenario.minHeightPx;
    const pointerY = (pct / 100) * rulerH - 7;

    depthPointer.style.transform = `translate3d(0, ${pointerY}px, 0)`;
    depthFill.style.height = `${pct}%`;

    if (stepData.depth === 0) {
      depthFill.style.background = 'linear-gradient(180deg, #a855f7 0%, #f59e0b 55%, #ef4444 100%)';
      depthPointer.style.backgroundColor = '#ef4444';
      depthPointer.style.boxShadow = '0 0 16px rgba(239, 68, 68, 0.9)';
      depthPointer.classList.add('intro-danger-ripple');
    } else if (stepData.depth <= 4 && scenario.id === 'tab1') {
      depthFill.style.background = 'linear-gradient(180deg, #a855f7 0%, #f59e0b 100%)';
      depthPointer.style.backgroundColor = '#f59e0b';
      depthPointer.style.boxShadow = '0 0 14px rgba(245, 158, 11, 0.8)';
      depthPointer.classList.remove('intro-danger-ripple');
    } else {
      depthFill.style.background = 'linear-gradient(180deg, #a855f7 0%, #6366f1 100%)';
      depthPointer.style.backgroundColor = '#a855f7';
      depthPointer.style.boxShadow = '0 0 14px rgba(168, 85, 247, 0.85)';
      depthPointer.classList.remove('intro-danger-ripple');
    }
  }

  let activeNodeEl = null;
  let activeNodeAlgo = 'quick';

  state.introTreeNodeEls.forEach(({ el, node }) => {
    const isReached = state.introStep >= node.step;
    const isCurrent =
      state.introStep === node.step ||
      (node.extraStep !== undefined && state.introStep === node.extraStep);

    if (isCurrent) {
      activeNodeEl = el;
      activeNodeAlgo = node.algoType;
    }

    el.className = `intro-tree-node node-${node.algoType} ${isReached ? 'is-reached' : ''} ${
      isCurrent ? 'is-current' : ''
    }`;

    if (node.extraStep !== undefined) {
      const p3 = el.querySelector('.pill-b3');
      const p4 = el.querySelector('.pill-b4');
      if (p3) p3.className = `intro-heap-pill pill-b3 ${state.introStep === 3 ? 'is-active' : ''}`;
      if (p4) p4.className = `intro-heap-pill pill-b4 ${state.introStep === 4 ? 'is-active' : ''}`;
    }
  });

  if (activeRing && treeCanvas) {
    if (activeNodeEl) {
      const canvasRect = treeCanvas.getBoundingClientRect();
      const nodeRect = activeNodeEl.getBoundingClientRect();
      if (canvasRect.width > 0 && nodeRect.width > 0) {
        const pad = 4;
        const x = nodeRect.left - canvasRect.left - pad;
        const y = nodeRect.top - canvasRect.top - pad;
        activeRing.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        activeRing.style.width = `${nodeRect.width + pad * 2}px`;
        activeRing.style.height = `${nodeRect.height + pad * 2}px`;
        activeRing.style.opacity = '1';

        if (activeNodeAlgo === 'heap') {
          activeRing.style.border = '2px solid #fb923c';
          activeRing.style.boxShadow = '0 0 22px rgba(249, 115, 22, 0.55)';
        } else if (activeNodeAlgo === 'insertion') {
          activeRing.style.border = '2px solid #4ade80';
          activeRing.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.45)';
        } else {
          activeRing.style.border = '2px solid #c084fc';
          activeRing.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.5)';
        }
      }
    } else {
      activeRing.style.opacity = '0';
    }
  }

  state.introTreeEdgeEls.forEach(({ edge, pathEl, labelEl, length }) => {
    const isRevealed = state.introStep >= edge.revealStep;
    const strokeColor = edge.isDanger
      ? '#f97316'
      : edge.branch === 'left'
        ? '#a855f7'
        : '#38bdf8';

    pathEl.setAttribute('stroke', strokeColor);
    pathEl.style.strokeDashoffset = isRevealed ? '0' : `${length}`;
    pathEl.style.opacity = isRevealed ? '0.95' : '0';

    labelEl.setAttribute('fill', isRevealed ? strokeColor : '#52525b');
    labelEl.style.opacity = isRevealed ? '1' : '0.4';
  });
}

function updateIntroHeapPanel(scenario, stepData) {
  const wrapper = document.getElementById('intro-heap-panel');
  if (!wrapper) return;

  const showHeap = scenario.id === 'tab2' && (stepData.step === 3 || stepData.step === 4);
  wrapper.classList.toggle('is-open', showHeap);

  if (state.introHeapSyncTimer) {
    clearTimeout(state.introHeapSyncTimer);
    state.introHeapSyncTimer = null;
  }

  if (scenario.id === 'tab2') {
    const ms = Math.round(620 / state.introSpeed) + 40;
    state.introHeapSyncTimer = setTimeout(() => {
      state.introHeapSyncTimer = null;
      if (SLIDES_DATA[state.slideIndex]?.id === 10 && state.introTab === 'tab2') {
        rebuildIntroSvgEdges(getIntroScenario());
      }
    }, ms);
  }

  if (!showHeap) return;

  const isBuildStep = stepData.step === 3;
  const subArr = stepData.array.slice(0, 6);
  const titleEl = document.getElementById('intro-heap-title');
  const subEl = document.getElementById('intro-heap-sub');
  const badgeEl = document.getElementById('intro-heap-badge');
  const noteEl = document.getElementById('intro-heap-note');

  if (isBuildStep) {
    if (titleEl) {
      titleEl.textContent = 'Build Max-Heap [0..5]';
      titleEl.className = 'intro-heap-title';
    }
    if (subEl) subEl.textContent = 'Bước 3: Dựng cây Max-Heap (Cha ≥ Con)';
    if (badgeEl) {
      badgeEl.textContent = 'Max-Heap';
      badgeEl.className = 'intro-heap-badge';
    }
    if (noteEl) {
      noteEl.innerHTML =
        'Gốc <strong style="color:#fdba74;">15</strong> lớn nhất nằm ở đỉnh A[0]. Các nhánh con (12 ≥ 7, 4 và 13 ≥ 11) đều thỏa tính chất Max-Heap.';
    }
  } else {
    if (titleEl) {
      titleEl.textContent = 'Extract-Max Hoàn tất [0..5]';
      titleEl.className = 'intro-heap-title is-done';
    }
    if (subEl) subEl.textContent = 'Bước 4: Rút dần gốc lớn nhất về cuối';
    if (badgeEl) {
      badgeEl.textContent = 'Đã sắp xếp ✓';
      badgeEl.className = 'intro-heap-badge is-done';
    }
    if (noteEl) {
      noteEl.innerHTML =
        'Các nút lướt về đúng thứ tự tăng dần <strong style="color:#86efac;">[4, 7, 11, 12, 13, 15]</strong> với độ phức tạp đảm bảo O(n log n).';
    }
  }

  state.introHeapEdgeEls.forEach((line) => {
    line.setAttribute('stroke', isBuildStep ? '#f97316' : '#22c55e');
    line.setAttribute('opacity', isBuildStep ? '0.68' : '0.4');
    line.setAttribute('stroke-dasharray', isBuildStep ? '' : '4 3');
  });

  subArr.forEach((val, idx) => {
    const circle = state.introHeapNodeEls.get(val);
    if (!circle) return;
    const { x, y } = INTROSORT_HEAP_COORDS[idx];
    const isRoot = idx === 0;
    circle.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${isRoot && isBuildStep ? 1.12 : 1})`;

    if (isBuildStep) {
      circle.style.backgroundColor = isRoot ? '#c2410c' : '#2a160c';
      circle.style.borderColor = isRoot ? '#fdba74' : '#f97316';
      circle.style.color = '#ffffff';
      circle.style.boxShadow = isRoot ? '0 0 18px rgba(249, 115, 22, 0.7)' : 'none';
    } else {
      circle.style.backgroundColor = '#0f291e';
      circle.style.borderColor = '#22c55e';
      circle.style.color = '#d1fae5';
      circle.style.boxShadow = '0 0 12px rgba(34, 197, 94, 0.25)';
    }

    const idxTag = circle.querySelector('.intro-heap-idx-tag');
    if (idxTag) idxTag.textContent = `[${idx}]`;
  });
}

function updateIntroPlaybackButtons() {
  const maxStep = getIntroScenario().steps.length - 1;
  const prevBtn = document.getElementById('intro-btn-prev');
  const nextBtn = document.getElementById('intro-btn-next');
  const autoBtn = document.getElementById('intro-btn-auto');

  if (prevBtn) prevBtn.disabled = state.introStep === 0;
  if (nextBtn) nextBtn.disabled = state.introStep >= maxStep;
  if (autoBtn) {
    if (state.introPlaying) {
      autoBtn.innerHTML = '<span>⏸</span><span>Tạm dừng</span>';
    } else if (state.introStep >= maxStep) {
      autoBtn.innerHTML = '<span>↻</span><span>Chạy lại</span>';
    } else {
      autoBtn.innerHTML = '<span>▶</span><span>Tự động chạy</span>';
    }
  }
}

function renderIntroStep(triggerArc = true) {
  const scenario = getIntroScenario();
  const stepData = getIntroStepData();
  updateIntroSlidingTabs();
  updateIntroArrayTiles(stepData, triggerArc);
  updateIntroExplanation(stepData, scenario);
  updateIntroTreeVisualStates(scenario, stepData);
  updateIntroHeapPanel(scenario, stepData);
  updateIntroPlaybackButtons();
}

function mountIntrosortSlide() {
  syncIntroSpeedTiming();
  initIntroArrayTiles();
  initIntroHeapStage();
  buildIntroTreeScene(getIntroScenario());

  if (state.introResizeObserver) {
    state.introResizeObserver.disconnect();
    state.introResizeObserver = null;
  }

  const treeCanvas = document.getElementById('intro-tree-canvas');
  const arrayTrack = document.getElementById('intro-array-track');
  if (typeof ResizeObserver !== 'undefined' && (treeCanvas || arrayTrack)) {
    let rafId = null;
    state.introResizeObserver = new ResizeObserver(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (SLIDES_DATA[state.slideIndex]?.id !== 10) return;
        updateIntroSlidingTabs();
        updateIntroArrayTiles(getIntroStepData(), false);
        rebuildIntroSvgEdges(getIntroScenario());
      });
    });
    if (treeCanvas) state.introResizeObserver.observe(treeCanvas);
    if (arrayTrack) state.introResizeObserver.observe(arrayTrack);
  }

  requestAnimationFrame(() => {
    if (SLIDES_DATA[state.slideIndex]?.id !== 10) return;
    updateIntroSlidingTabs();
    updateIntroArrayTiles(getIntroStepData(), false);
    rebuildIntroSvgEdges(getIntroScenario());
    renderIntroStep(false);
  });
}

function stopIntroPlay() {
  if (state.introTimer !== null) {
    clearTimeout(state.introTimer);
    state.introTimer = null;
  }
  if (state.introHeapSyncTimer !== null) {
    clearTimeout(state.introHeapSyncTimer);
    state.introHeapSyncTimer = null;
  }
  state.introPlaying = false;
  updateIntroPlaybackButtons();
}

function scheduleIntroTick() {
  if (!state.introPlaying) return;
  const maxStep = getIntroScenario().steps.length - 1;
  const delay = Math.round(1350 / state.introSpeed);
  state.introTimer = setTimeout(() => {
    if (!state.introPlaying) return;
    if (state.introStep < maxStep) {
      state.introStep += 1;
      renderIntroStep(true);
      if (state.introStep >= maxStep) {
        stopIntroPlay();
      } else {
        scheduleIntroTick();
      }
    } else {
      stopIntroPlay();
    }
  }, delay);
}

function toggleIntroPlay() {
  const maxStep = getIntroScenario().steps.length - 1;
  if (state.introPlaying) {
    stopIntroPlay();
    return;
  }
  if (state.introStep >= maxStep) {
    state.introStep = 0;
    renderIntroStep(true);
  }
  state.introPlaying = true;
  updateIntroPlaybackButtons();
  state.introTimer = setTimeout(() => {
    if (!state.introPlaying) return;
    if (state.introStep < maxStep) {
      state.introStep += 1;
      renderIntroStep(true);
      if (state.introStep < maxStep) {
        scheduleIntroTick();
      } else {
        stopIntroPlay();
      }
    } else {
      stopIntroPlay();
    }
  }, 160);
}

function jumpIntroStep(stepIdx) {
  stopIntroPlay();
  const maxStep = getIntroScenario().steps.length - 1;
  const clamped = Math.max(0, Math.min(stepIdx, maxStep));
  if (clamped === state.introStep) return;
  state.introStep = clamped;
  renderIntroStep(true);
}

function switchIntroTab(tabKey) {
  if (state.introTab === tabKey) return;
  stopIntroPlay();
  state.introTab = tabKey;
  state.introStep = 0;
  buildIntroTreeScene(getIntroScenario());
  renderIntroStep(true);
}

function renderSlide11() {
  return `
    <div class="bento-grid flex-1 min-h-0">
      <div class="col-6 h-full min-h-0">
        ${renderCodeWindow('introsort_driver.py (Khử đệ quy đuôi)', 'python', INTROSORT_PYTHON_CODE, 0)}
      </div>

      <div class="bento-col col-6">
        <div class="bento-card bento-card-auto bento-item" style="--stagger:1">
          <h3 class="bento-title">Ánh xạ chỉ số Heap (Offset) trên đoạn con [low..high]</h3>
          <div class="bento-subgrid-2 mt-2" style="height:auto;">
            <div class="bento-subtile">
              <div class="bento-caption">Heap chuẩn (từ 0)</div>
              <div class="mono mt-1" style="font-size:var(--fs-code); color:#F5F5F7; line-height:1.5;">
                Cha: i &nbsp;|&nbsp; Trái: 2*i + 1<br/>Phải: 2*i + 2
              </div>
            </div>
            <div class="bento-subtile" style="border-color:rgba(191,90,242,0.45);">
              <div class="bento-caption" style="color:#BF5AF2;">Đoạn [low..high] (offset = low)</div>
              <div class="mono mt-1" style="font-size:var(--fs-code); color:#F5F5F7; line-height:1.5;">
                Cha: low + i &nbsp;|&nbsp; Trái: low + 2*i + 1<br/>Phải: low + 2*i + 2
              </div>
            </div>
          </div>
          <p class="bento-body mt-2" style="color:#30D158;">
            <strong>Lợi ích cốt lõi:</strong> Tuyệt đối không dùng list slicing (<code>arr[a:b]</code>), bảo toàn bộ nhớ phụ <strong>O(1)</strong>!
          </p>
        </div>

        ${renderCodeWindow('heapsort_subarray_offset.py', 'python', INTROSORT_OFFSET_CODE, 2)}
      </div>
    </div>
  `;
}

function renderSlide12() {
  return `
    <div class="bento-grid bento-grid-auto">
      <div class="bento-card bento-card-accent col-4 bento-item" style="--stagger:0">
        <span class="badge-pill badge-purple">Cận trên mọi trường hợp</span>
        <div class="hero-stat-accent mt-2">Θ(n log n)</div>
        <p class="bento-body mt-1">Chống lại chuỗi <em>Median-of-3 Killer</em>.</p>
      </div>

      <div class="bento-card col-4 bento-item" style="--stagger:1">
        <span class="badge-pill badge-blue">Call Stack khóa cứng</span>
        <div class="hero-stat mt-2">Θ(log n)</div>
        <p class="bento-body mt-1">Tối đa <code>2⌊log₂ n⌋ + 1</code> khung hàm.</p>
      </div>

      <div class="bento-card col-4 bento-item" style="--stagger:2">
        <span class="badge-pill badge-mint">Aux RAM tại chỗ</span>
        <div class="hero-stat mt-2">Θ(1)</div>
        <p class="bento-body mt-1">Zero list slicing, chỉ dùng biến chỉ số.</p>
      </div>
    </div>

    <div class="bento-grid flex-1 min-h-0">
      <div class="bento-card col-7 bento-item justify-between" style="--stagger:3">
        <h3 class="bento-title">Chứng minh chặn trên Thời gian Θ(n log n)</h3>
        <div class="flex-col gap-2 mt-2 flex-1 justify-between">
          <div class="bento-subtile">
            <p class="bento-body"><strong>• Tốt nhất:</strong> <code class="mono" style="color:#30D158">Θ(n log n)</code> — Phân hoạch chia đôi cân bằng ở mọi mức.</p>
          </div>
          <div class="bento-subtile">
            <p class="bento-body"><strong>• Trung bình:</strong> <code class="mono" style="color:#64D2FF">Θ(n log n)</code> — Khoảng <code>≈ 1.188 n log₂(n)</code> phép so sánh nhờ Median-of-Three (thấp hơn <code>1.386 n log₂(n)</code> của Quicksort ngẫu nhiên).</p>
          </div>
          <div class="bento-subtile" style="border-color:rgba(191,90,242,0.45);">
            <p class="bento-body">
              <strong>• Xấu nhất (Median-of-3 Killer):</strong>
              1. Quicksort tối đa <code>2⌊log₂ n⌋</code> mức ⇒ <code>O(n log n)</code> •
              2. Heapsort các đoạn rời nhau <code>Σkᵢ ≤ n</code> ⇒ <code>O(n log n)</code> •
              3. Insertion Sort đoạn <code>≤ 16</code> ⇒ <code>O(n)</code>.
              <strong style="color:#BF5AF2">⇒ Khóa chặt Θ(n log n).</strong>
            </p>
          </div>
        </div>
      </div>

      <div class="bento-col col-5">
        <div class="bento-card flex-1 bento-item" style="--stagger:4">
          <h3 class="bento-title" style="color:#30D158">1. Thao tác tại chỗ: Θ(1)</h3>
          <p class="bento-body mt-2">
            <code>partition_median_of_three</code>, <code>heapsort_subarray</code> và <code>insertion_sort</code> chỉ dùng vài biến chỉ số cục bộ. Không dùng list slicing hay mảng phụ.
          </p>
        </div>

        <div class="bento-card bento-card-accent flex-1 bento-item" style="--stagger:5">
          <h3 class="bento-title" style="color:#5AC8FA">2. Ngăn xếp đệ quy: Θ(log n)</h3>
          <p class="bento-body mt-2">
            Khóa cứng tối đa <code>2⌊log₂ n⌋ + 1</code> khung hàm trên Call Stack ⇒ <strong>Θ(log n)</strong>, chống tràn Stack <code>O(n)</code> tuyệt đối so với Quicksort truyền thống.
          </p>
        </div>
      </div>
    </div>
  `;
}

function renderSlide13() {
  const ecomCode = `class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

# Sắp xếp hàng triệu sản phẩm theo "Giá từ thấp đến cao"
introsort(products, key=lambda p: p.price)

# Phân tích Request Logs (tìm P50, P90 Latency):
# Xử lý tính Unstable bằng khóa tuple (latency_ms, arrival_seq)
introsort(logs, key=lambda r: (r.latency_ms, r.arrival_seq))`;

  return `
    <div class="bento-grid flex-1 min-h-0">
      <div class="bento-col col-6">
        <div class="bento-card bento-card-auto bento-item" style="--stagger:0">
          <div class="flex-row gap-2 flex-wrap">
            <span class="badge-pill badge-purple">1. Sàn Thương mại điện tử</span>
            <span class="badge-pill badge-blue">2. Request Logs (P50 / P90)</span>
          </div>
          <p class="bento-body mt-2">
            • Sắp xếp hàng triệu sản phẩm theo <strong>"Giá từ thấp đến cao"</strong> tức thì nhờ tính thân thiện CPU Cache của nhánh Quicksort.<br/>
            • Khắc phục tính không ổn định (<em>Unstable</em>) khi tính P50, P90 Latency bằng khóa tuple <code>(latency_ms, arrival_seq)</code>.
          </p>
        </div>
        ${renderCodeWindow('ecommerce_and_logs.py', 'python', ecomCode, 1)}
      </div>

      <div class="bento-col col-6">
        <div class="bento-card bento-card-auto bento-item" style="--stagger:2">
          <span class="badge-pill badge-mint">3. LeetCode 912 — Sort an Array</span>
          <p class="bento-body mt-2">
            Vượt qua toàn bộ test case anti-Quicksort khắc nghiệt trong thời gian đảm bảo <code>O(n log n)</code> mà không dùng hàm sort có sẵn.
          </p>
        </div>
        ${renderCodeWindow('leetcode_912_introsort.py', 'python', LEETCODE_912_CODE, 3)}
      </div>
    </div>
  `;
}

function renderSlide14() {
  return `
    <div class="bento-grid flex-1 min-h-0">
      <div class="bento-card bento-card-accent col-5 bento-item justify-between" style="--stagger:0">
        <div>
          <span class="badge-pill badge-amber">Bài toán đặt ra</span>
          <div class="hero-stat-accent mt-2">O(1) RAM</div>
          <h3 class="bento-title mt-2">Tại chỗ &amp; O(n log n) mọi trường hợp</h3>
          <p class="bento-body mt-2">
            Sắp xếp mảng <code>n</code> phần tử tăng dần ngay tại chỗ (<strong>In-place</strong>) với bộ nhớ phụ <strong>O(1) tuyệt đối</strong> và đảm bảo thời gian <strong>O(n log n)</strong> ngay cả trường hợp xấu nhất.
          </p>
        </div>
        <div class="bento-subtile mt-3">
          <div class="bento-caption">Ví dụ minh họa</div>
          <div class="mono font-bold mt-1" style="color:#FFD60A; font-size:var(--fs-table);">
            Input : [4, 10, 3, 5, 1] → Output: [1, 3, 4, 5, 10]
          </div>
        </div>
      </div>

      <div class="bento-card col-7 bento-item justify-between" style="--stagger:1">
        <div>
          <span class="badge-pill badge-amber">Ý tưởng cốt lõi</span>
          <h3 class="bento-title mt-2">Cây nhị phân hoàn chỉnh (Binary Heap) trên mảng 1 chiều</h3>
          <p class="bento-body mt-2">
            <strong>Không dùng con trỏ!</strong> Biểu diễn cây trực tiếp trên mảng 1 chiều với nút cha tại chỉ số <code>i</code>:
          </p>
        </div>
        <div class="bento-subgrid-2 mt-3" style="height:auto;">
          <div class="bento-subtile" style="border-color:rgba(255,159,10,0.4);">
            <div class="bento-caption">Con trái của nút i</div>
            <div class="mono font-bold mt-2" style="font-size:1.75rem; color:#FF9F0A;">left = 2*i + 1</div>
          </div>
          <div class="bento-subtile" style="border-color:rgba(255,214,10,0.4);">
            <div class="bento-caption">Con phải của nút i</div>
            <div class="mono font-bold mt-2" style="font-size:1.75rem; color:#FFD60A;">right = 2*i + 2</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bento-grid bento-grid-auto">
      <div class="bento-card col-6 bento-item" style="--stagger:2">
        <span class="badge-pill badge-amber">Giai đoạn 1</span>
        <h3 class="bento-title mt-2">Build Max-Heap (Tạo đống cực đại)</h3>
        <p class="bento-body mt-2">
          Biến mảng ban đầu thành Max-Heap: mọi nút cha <code>≥</code> nút con, đảm bảo phần tử lớn nhất nằm ở đỉnh gốc <code>arr[0]</code>.
        </p>
      </div>

      <div class="bento-card col-6 bento-item" style="--stagger:3">
        <span class="badge-pill badge-mint">Giai đoạn 2</span>
        <h3 class="bento-title mt-2">Extract &amp; Sift-down (Rút gốc &amp; Vun lại đống)</h3>
        <p class="bento-body mt-2">
          Hoán đổi <code>arr[0]</code> về cuối mảng (khóa vị trí đã xếp), giảm kích thước Heap đi 1, gọi <code>sift_down</code> đưa phần tử lớn tiếp theo lên gốc.
        </p>
      </div>
    </div>
  `;
}

function getHeapHeaderSubtitle() {
  return `Trực quan hóa đồng bộ Cây Heap thu gọn + Mảng 1 chiều có vách ngăn trượt cho arr = [${state.heapRawArray.join(', ')}]`;
}

function syncHeapSpeedTiming() {
  const animMs = Math.round(620 / state.heapSpeed);
  document.documentElement.style.setProperty('--heap-anim-ms', `${animMs}ms`);
  const labelEl = document.getElementById('heap-speed-label');
  if (labelEl) {
    labelEl.textContent = `${state.heapSpeed.toFixed(state.heapSpeed % 1 === 0 ? 1 : 2)}x`;
  }
}

function setHeapHoveredItem(itemId) {
  if (state.heapHoveredId === itemId) return;
  if (state.heapHoveredId !== null) {
    const prevNode = state.heapTreeNodeEls.get(state.heapHoveredId);
    const prevTile = state.heapArrayTileEls.get(state.heapHoveredId);
    if (prevNode) prevNode.inner.classList.remove('heap-hover-node');
    if (prevTile) prevTile.inner.classList.remove('heap-hover-tile');
  }
  state.heapHoveredId = itemId;
  if (itemId !== null) {
    const nextNode = state.heapTreeNodeEls.get(itemId);
    const nextTile = state.heapArrayTileEls.get(itemId);
    if (nextNode) nextNode.inner.classList.add('heap-hover-node');
    if (nextTile) nextTile.inner.classList.add('heap-hover-tile');
  }
}

function computeHeapTreeCoords(n) {
  const stage = document.getElementById('heap-tree-stage');
  const w = stage?.clientWidth || 440;
  const h = stage?.clientHeight || 280;
  const levels = Math.floor(Math.log2(n)) + 1;

  const padTop = 40;
  const padBottom = 46;
  const usableH = Math.max(110, h - padTop - padBottom);
  const levelGap = levels > 1 ? usableH / (levels - 1) : 0;

  const padX = Math.min(42, w * 0.09);
  const usableW = Math.max(160, w - padX * 2);

  const coords = [];
  for (let idx = 0; idx < n; idx++) {
    const level = Math.floor(Math.log2(idx + 1));
    const posInLevel = idx - (Math.pow(2, level) - 1);
    const maxNodesInLevel = Math.pow(2, level);
    const x = padX + ((posInLevel + 0.5) / maxNodesInLevel) * usableW;
    const y = padTop + level * levelGap;
    coords.push({ x, y });
  }
  return coords;
}

function renderSlide15() {
  const speedLabel = `${state.heapSpeed.toFixed(state.heapSpeed % 1 === 0 ? 1 : 2)}x`;
  return `
    <div id="heap-sim-root" class="heap-shell">
      <section class="heap-controls-bar">
        <div class="heap-ctrl-group">
          <button id="heap-btn-prev" type="button" class="heap-btn" data-action="heap-prev" title="Quay lại 1 bước ([)">
            <span>⏮</span><span>Quay lại</span>
          </button>
          <button id="heap-btn-next" type="button" class="heap-btn-next" data-action="heap-next" title="Bước tiếp theo (])">
            <span>Bước tiếp</span><span>⏭</span>
          </button>
          <button id="heap-btn-auto" type="button" class="heap-btn-auto" data-action="heap-auto" title="Tự động chạy / Tạm dừng (P)">
            <span>▶</span><span>Tự động chạy</span>
          </button>
          <button id="heap-btn-reset" type="button" class="heap-btn" data-action="heap-reset" title="Đặt lại về Bước 0 (R)">
            <span>↺</span><span>Đặt lại</span>
          </button>
        </div>

        <div class="heap-ctrl-group">
          <button id="heap-btn-sample" type="button" class="heap-btn-mode ${state.heapIsSample ? 'is-active' : ''}" data-action="heap-sample" title="Mảng mẫu 4 phần tử [4, 10, 3, 5]">
            <span>📌</span><span>Mảng mẫu [4, 10, 3, 5]</span>
          </button>
          <button id="heap-btn-random" type="button" class="heap-btn-mode ${!state.heapIsSample ? 'is-active' : ''}" data-action="heap-random" title="Tạo mảng ngẫu nhiên 7 phần tử khác nhau">
            <span>🎲</span><span>Ngẫu nhiên (7 phần tử)</span>
          </button>
          <div class="heap-speed-box">
            <span>Tốc độ</span>
            <input id="heap-speed-slider" class="heap-speed-slider" type="range" min="0.5" max="2.5" step="0.25" value="${state.heapSpeed}" aria-label="Tốc độ mô phỏng" />
            <span id="heap-speed-label" class="heap-speed-label">${speedLabel}</span>
          </div>
        </div>
      </section>

      <main class="heap-main-grid">
        <section class="heap-tree-card bento-item" style="--stagger:0">
          <div class="heap-card-header">
            <h3 class="heap-card-title">Sơ đồ Cây nhị phân "co lại"</h3>
            <span id="heap-size-badge" class="heap-size-badge is-full">Kích thước Heap: 4 / 4</span>
          </div>

          <div id="heap-tree-stage" class="heap-tree-stage" aria-label="Sơ đồ Cây nhị phân Heap co lại">
            <svg id="heap-tree-svg" xmlns="http://www.w3.org/2000/svg"></svg>
            <div id="heap-slots-layer" class="heap-slots-layer"></div>
            <div id="heap-nodes-layer" class="heap-nodes-layer"></div>
          </div>

          <div class="heap-tree-legend">
            <div class="heap-legend-dots">
              <span class="heap-legend-item"><span class="heap-legend-dot" style="background:#f59e0b"></span>Heap</span>
              <span class="heap-legend-item"><span class="heap-legend-dot" style="background:#38bdf8"></span>So sánh</span>
              <span class="heap-legend-item"><span class="heap-legend-dot" style="background:#f97316"></span>Hoán đổi</span>
              <span class="heap-legend-item"><span class="heap-legend-dot" style="background:#10b981"></span>Đã khóa</span>
            </div>
            <span style="font-size:0.65rem; color:#71717a;">Di chuột vào nút để soi mảng</span>
          </div>
        </section>

        <section class="heap-right-col bento-item" style="--stagger:1">
          <div class="heap-array-card">
            <div class="heap-card-header">
              <h3 class="heap-card-title">Mảng 1 chiều &amp; Vách ngăn động</h3>
              <span id="heap-summary-chip" class="heap-summary-chip">[4, 10, 3, 5]</span>
            </div>

            <div class="heap-array-stage">
              <div class="heap-region-labels">
                <span id="heap-label-heap" style="color:#fbbf24; transition:opacity 0.3s ease;">◀ VÙNG HEAP</span>
                <span id="heap-label-sorted" style="color:#34d399; opacity:0.35; transition:opacity 0.3s ease;">VÙNG ĐÃ XẾP ▶</span>
              </div>

              <div class="heap-arcs-wrap">
                <svg id="heap-arcs-svg" xmlns="http://www.w3.org/2000/svg"></svg>
              </div>

              <div id="heap-array-track" class="heap-array-track">
                <div id="heap-region-bg" class="heap-region-backdrop is-heap"></div>
                <div id="heap-sorted-bg" class="heap-region-backdrop is-sorted"></div>
                <div id="heap-divider">
                  <div class="heap-divider-line"></div>
                  <span class="heap-divider-tag">|</span>
                </div>
                <div id="heap-tiles-layer" class="heap-tiles-layer"></div>
              </div>

              <div id="heap-index-row" class="heap-index-row"></div>
            </div>
          </div>

          <div id="heap-explain-card" class="heap-explain-card border-init">
            <div class="heap-explain-top">
              <div class="heap-explain-badges">
                <span id="heap-phase-badge" class="heap-phase-badge heap-phase-init">Khởi tạo</span>
                <span id="heap-step-pill" class="heap-step-pill">Bước 0 / 0</span>
                <span id="heap-action-badge" class="heap-action-badge heap-action-init">Mảng ban đầu</span>
              </div>
              <div class="heap-stats-group">
                <div class="heap-stat-pill">
                  <span>So sánh:</span>
                  <span id="heap-stat-cmp" class="font-bold" style="color:#38bdf8; font-variant-numeric:tabular-nums;">0</span>
                </div>
                <div class="heap-stat-pill">
                  <span>Hoán đổi:</span>
                  <span id="heap-stat-swaps" class="font-bold" style="color:#f97316; font-variant-numeric:tabular-nums;">0</span>
                </div>
              </div>
            </div>

            <div class="heap-desc-box">
              <p id="heap-step-desc" class="heap-desc-text"></p>
            </div>
          </div>
        </section>
      </main>

      <section class="heap-timeline-bar bento-item" style="--stagger:2">
        <div class="heap-timeline-header">
          <div class="heap-timeline-meta">
            <span class="font-bold" style="color:#ffffff;">Thanh tiến độ 2 Pha</span>
            <span class="heap-legend-item" style="color:#fcd34d; font-size:0.7rem;">
              <span class="heap-legend-dot" style="background:#fbbf24; width:7px; height:7px;"></span>Pha 1: Build Max-Heap
            </span>
            <span class="heap-legend-item" style="color:#6ee7b7; font-size:0.7rem;">
              <span class="heap-legend-dot" style="background:#34d399; width:7px; height:7px;"></span>Pha 2: Rút gốc &amp; Vun lại
            </span>
          </div>
          <div class="heap-kbd-hint">
            Phím tắt mô phỏng: <kbd>P</kbd> Chạy/Dừng · <kbd>[</kbd> <kbd>]</kbd> Lùi/Tiến · <kbd>R</kbd> Đặt lại
          </div>
        </div>
        <div id="heap-timeline-row" class="heap-timeline-row"></div>
      </section>
    </div>
  `;
}

function buildHeapPersistentTree(initialItems) {
  const stage = document.getElementById('heap-tree-stage');
  const svg = document.getElementById('heap-tree-svg');
  const slotsLayer = document.getElementById('heap-slots-layer');
  const nodesLayer = document.getElementById('heap-nodes-layer');
  if (!stage || !svg || !slotsLayer || !nodesLayer) return;

  const n = initialItems.length;
  state.heapTreeCoords = computeHeapTreeCoords(n);

  const w = stage.clientWidth || 440;
  const h = stage.clientHeight || 280;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.innerHTML = '';
  state.heapTreeEdgeEls = [];

  for (let child = 1; child < n; child++) {
    const parent = Math.floor((child - 1) / 2);
    const p = state.heapTreeCoords[parent];
    const c = state.heapTreeCoords[child];
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', p.x);
    line.setAttribute('y1', p.y);
    line.setAttribute('x2', c.x);
    line.setAttribute('y2', c.y);
    line.setAttribute('stroke', '#92400e');
    line.setAttribute('stroke-width', '2.5');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('class', 'heap-tree-edge');
    svg.appendChild(line);
    state.heapTreeEdgeEls.push({ parent, child, lineEl: line });
  }

  slotsLayer.innerHTML = '';
  state.heapTreeCoords.forEach((coord, idx) => {
    const lbl = document.createElement('div');
    lbl.className = 'heap-slot-label';
    lbl.style.left = `${coord.x}px`;
    lbl.style.top = `${coord.y + 29}px`;
    lbl.textContent = `arr[${idx}]`;
    slotsLayer.appendChild(lbl);
  });

  nodesLayer.innerHTML = '';
  state.heapTreeNodeEls.clear();

  initialItems.forEach((item, idx) => {
    const outer = document.createElement('div');
    outer.className = 'heap-node-outer';
    outer.dataset.itemId = String(item.id);

    const scaleWrap = document.createElement('div');
    scaleWrap.className = 'heap-node-scale';

    const inner = document.createElement('div');
    inner.className = 'heap-node-inner';

    const valEl = document.createElement('span');
    valEl.textContent = String(item.val);

    const lockEl = document.createElement('span');
    lockEl.className = 'heap-node-lock';
    lockEl.innerHTML = `
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    `;

    inner.appendChild(valEl);
    inner.appendChild(lockEl);
    scaleWrap.appendChild(inner);
    outer.appendChild(scaleWrap);
    nodesLayer.appendChild(outer);

    const coord = state.heapTreeCoords[idx];
    outer.style.transform = `translate3d(${coord.x}px, ${coord.y}px, 0)`;

    outer.addEventListener('mouseenter', () => setHeapHoveredItem(item.id));
    outer.addEventListener('mouseleave', () => setHeapHoveredItem(null));

    state.heapTreeNodeEls.set(item.id, { outer, scaleWrap, inner, lockEl });
  });
}

function repositionHeapTreeGeometry() {
  const stage = document.getElementById('heap-tree-stage');
  const svg = document.getElementById('heap-tree-svg');
  const slotsLayer = document.getElementById('heap-slots-layer');
  if (!stage || !svg || !slotsLayer) return;

  const n = state.heapRawArray.length;
  state.heapTreeCoords = computeHeapTreeCoords(n);
  const w = stage.clientWidth || 440;
  const h = stage.clientHeight || 280;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  state.heapTreeEdgeEls.forEach(({ parent, child, lineEl }) => {
    const p = state.heapTreeCoords[parent];
    const c = state.heapTreeCoords[child];
    if (!p || !c) return;
    lineEl.setAttribute('x1', p.x);
    lineEl.setAttribute('y1', p.y);
    lineEl.setAttribute('x2', c.x);
    lineEl.setAttribute('y2', c.y);
  });

  Array.from(slotsLayer.children).forEach((lbl, idx) => {
    const coord = state.heapTreeCoords[idx];
    if (coord) {
      lbl.style.left = `${coord.x}px`;
      lbl.style.top = `${coord.y + 29}px`;
    }
  });
}

function getHeapArraySlotGeometry(n) {
  const track = document.getElementById('heap-array-track');
  const trackW = track?.clientWidth || 460;
  const gap = n <= 4 ? 14 : 10;
  const slotW = (trackW - gap * (n - 1)) / n;
  return { trackW, gap, slotW };
}

function buildHeapPersistentArrayTiles(initialItems) {
  const tilesLayer = document.getElementById('heap-tiles-layer');
  const indexRow = document.getElementById('heap-index-row');
  if (!tilesLayer || !indexRow) return;

  const n = initialItems.length;
  tilesLayer.innerHTML = '';
  indexRow.innerHTML = '';
  state.heapArrayTileEls.clear();

  const { gap, slotW } = getHeapArraySlotGeometry(n);

  indexRow.style.gridTemplateColumns = `repeat(${n}, minmax(0, 1fr))`;
  indexRow.style.gap = `${gap}px`;
  for (let i = 0; i < n; i++) {
    const idxEl = document.createElement('div');
    idxEl.className = 'heap-index-cell';
    idxEl.textContent = `[${i}]`;
    indexRow.appendChild(idxEl);
  }

  initialItems.forEach((item, idx) => {
    const outer = document.createElement('div');
    outer.className = 'heap-tile-outer';
    outer.dataset.itemId = String(item.id);
    outer.style.width = `${slotW}px`;
    outer.style.transform = `translate3d(${idx * (slotW + gap)}px, 0, 0)`;

    const inner = document.createElement('div');
    inner.className = 'heap-tile-inner';

    const roleEl = document.createElement('span');
    roleEl.className = 'heap-tile-role';

    const valEl = document.createElement('span');
    valEl.className = 'heap-tile-val';
    valEl.style.fontSize = n <= 4 ? '1.35rem' : '1.12rem';
    valEl.textContent = String(item.val);

    const lockEl = document.createElement('span');
    lockEl.className = 'heap-tile-lock';
    lockEl.textContent = '🔒';

    inner.appendChild(roleEl);
    inner.appendChild(valEl);
    inner.appendChild(lockEl);
    outer.appendChild(inner);
    tilesLayer.appendChild(outer);

    outer.addEventListener('mouseenter', () => setHeapHoveredItem(item.id));
    outer.addEventListener('mouseleave', () => setHeapHoveredItem(null));

    state.heapArrayTileEls.set(item.id, { outer, inner, valEl, roleEl, lockEl });
  });
}

function renderHeapFormulaArcs(frame, slotW, gap) {
  const track = document.getElementById('heap-array-track');
  const svg = document.getElementById('heap-arcs-svg');
  if (!track || !svg) return;

  const w = track.clientWidth || 460;
  const h = 40;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.innerHTML = '';

  const getCenterX = (idx) => idx * (slotW + gap) + slotW / 2;
  const animatedPaths = [];

  if (frame.comparing) {
    const pX = getCenterX(frame.comparing.parent);
    frame.comparing.children.forEach((child, cIdx) => {
      const cX = getCenterX(child.idx);
      const midX = (pX + cX) / 2;
      const peakY = cIdx === 0 ? 16 : 4;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${pX} ${h - 2} Q ${midX} ${peakY}, ${cX} ${h - 2}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#38bdf8');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('class', 'heap-formula-arc');
      svg.appendChild(path);

      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
      animatedPaths.push(path);

      [pX, cX].forEach((dotX) => {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', dotX);
        dot.setAttribute('cy', h - 2);
        dot.setAttribute('r', '2.6');
        dot.setAttribute('fill', '#38bdf8');
        svg.appendChild(dot);
      });

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', midX + (cIdx === 1 ? 16 : -6));
      text.setAttribute('y', peakY + 8);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '10');
      text.setAttribute('font-weight', '700');
      text.setAttribute('font-family', 'JetBrains Mono, monospace');
      text.setAttribute('fill', '#7dd3fc');
      text.textContent = child.formula;
      svg.appendChild(text);
    });
  } else if (frame.swapping && frame.swapping.length === 2) {
    const [a, b] = frame.swapping;
    const xA = getCenterX(a);
    const xB = getCenterX(b);
    const midX = (xA + xB) / 2;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${xA} ${h - 2} Q ${midX} 5, ${xB} ${h - 2}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#f97316');
    path.setAttribute('stroke-width', '2.2');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('class', 'heap-formula-arc');
    svg.appendChild(path);

    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    animatedPaths.push(path);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', midX);
    text.setAttribute('y', 13);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '10');
    text.setAttribute('font-weight', '700');
    text.setAttribute('fill', '#fdba74');
    text.textContent = '⇄ Hoán đổi';
    svg.appendChild(text);
  }

  if (animatedPaths.length > 0) {
    requestAnimationFrame(() => {
      animatedPaths.forEach((p) => {
        p.style.strokeDashoffset = '0';
      });
    });
  }
}

function buildHeapTimeline() {
  const row = document.getElementById('heap-timeline-row');
  if (!row) return;
  row.innerHTML = '';
  let lastPhase = null;

  state.heapFrames.forEach((frame, idx) => {
    if (frame.phase === 'build' && lastPhase !== 'build') {
      const sep = document.createElement('span');
      sep.className = 'heap-timeline-sep';
      sep.style.color = '#fbbf24';
      sep.textContent = 'Pha 1';
      row.appendChild(sep);
    } else if (frame.phase === 'extract' && lastPhase !== 'extract') {
      const sep = document.createElement('span');
      sep.className = 'heap-timeline-sep';
      sep.style.color = '#34d399';
      sep.textContent = 'Pha 2';
      row.appendChild(sep);
    }
    lastPhase = frame.phase;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.stepIdx = String(idx);
    btn.textContent = `${idx}. ${frame.pillLabel}`;
    btn.className = 'heap-timeline-pill';
    btn.addEventListener('click', () => jumpHeapStep(idx));
    row.appendChild(btn);
  });
}

function updateHeapTimelineHighlight() {
  const row = document.getElementById('heap-timeline-row');
  if (!row) return;
  const pills = row.querySelectorAll('.heap-timeline-pill');
  pills.forEach((btn) => {
    const idx = Number(btn.dataset.stepIdx);
    const frame = state.heapFrames[idx];
    if (idx === state.heapStep) {
      if (frame.phase === 'done' || frame.actionType === 'lock') {
        btn.className = 'heap-timeline-pill is-current-emerald';
      } else if (frame.phase === 'extract') {
        btn.className = 'heap-timeline-pill is-current-orange';
      } else {
        btn.className = 'heap-timeline-pill is-current-amber';
      }
      btn.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    } else if (idx < state.heapStep) {
      btn.className = 'heap-timeline-pill is-past';
    } else {
      btn.className = 'heap-timeline-pill';
    }
  });
}

function updateHeapControlButtons() {
  const maxStep = state.heapFrames.length - 1;
  const prevBtn = document.getElementById('heap-btn-prev');
  const nextBtn = document.getElementById('heap-btn-next');
  const autoBtn = document.getElementById('heap-btn-auto');
  const sampleBtn = document.getElementById('heap-btn-sample');
  const randomBtn = document.getElementById('heap-btn-random');

  if (prevBtn) prevBtn.disabled = state.heapStep === 0;
  if (nextBtn) nextBtn.disabled = state.heapStep >= maxStep;
  if (autoBtn) {
    if (state.heapPlaying) {
      autoBtn.innerHTML = '<span>⏸</span><span>Tạm dừng</span>';
    } else if (state.heapStep >= maxStep && maxStep > 0) {
      autoBtn.innerHTML = '<span>↻</span><span>Chạy lại</span>';
    } else {
      autoBtn.innerHTML = '<span>▶</span><span>Tự động chạy</span>';
    }
  }
  if (sampleBtn) sampleBtn.className = `heap-btn-mode ${state.heapIsSample ? 'is-active' : ''}`;
  if (randomBtn) randomBtn.className = `heap-btn-mode ${!state.heapIsSample ? 'is-active' : ''}`;
}

function updateHeapMetadataUI(frame) {
  const n = frame.items.length;
  const sizeBadge = document.getElementById('heap-size-badge');
  if (sizeBadge) {
    sizeBadge.textContent = `Kích thước Heap: ${frame.heapSize} / ${n}`;
    sizeBadge.className = `heap-size-badge ${
      frame.heapSize === 0 ? 'is-done' : frame.heapSize < n ? 'is-shrinking' : 'is-full'
    }`;
  }

  const chip = document.getElementById('heap-summary-chip');
  if (chip) chip.textContent = `[${formatHeapArrayDivider(frame.items, frame.heapSize)}]`;

  const phaseBadge = document.getElementById('heap-phase-badge');
  if (phaseBadge) {
    phaseBadge.textContent = frame.phaseLabel;
    phaseBadge.className = `heap-phase-badge heap-phase-${frame.phase}`;
  }

  const stepPill = document.getElementById('heap-step-pill');
  if (stepPill) stepPill.textContent = `Bước ${state.heapStep} / ${state.heapFrames.length - 1}`;

  const actionBadge = document.getElementById('heap-action-badge');
  if (actionBadge) {
    actionBadge.textContent = frame.actionLabel;
    actionBadge.className = `heap-action-badge heap-action-${frame.actionType}`;
  }

  const explainCard = document.getElementById('heap-explain-card');
  if (explainCard) {
    explainCard.className = `heap-explain-card border-${frame.actionType}`;
  }

  const descEl = document.getElementById('heap-step-desc');
  if (descEl) {
    descEl.classList.remove('heap-text-reveal');
    void descEl.offsetWidth;
    descEl.textContent = frame.description;
    descEl.classList.add('heap-text-reveal');
  }

  const cmpEl = document.getElementById('heap-stat-cmp');
  if (cmpEl) cmpEl.textContent = String(frame.comparisons);

  const swapsEl = document.getElementById('heap-stat-swaps');
  if (swapsEl) swapsEl.textContent = String(frame.swaps);

  const subtitleEl = document.querySelector('.slide-subtitle');
  if (subtitleEl && SLIDES_DATA[state.slideIndex]?.id === 15) {
    subtitleEl.textContent = getHeapHeaderSubtitle();
  }
}

function renderHeapFrame(triggerArc = true) {
  const frame = state.heapFrames[state.heapStep];
  if (!frame) return;

  const items = frame.items;
  const n = items.length;
  const { trackW, gap, slotW } = getHeapArraySlotGeometry(n);

  const compareRoleMap = new Map();
  if (frame.comparing) {
    compareRoleMap.set(frame.comparing.parent, `Cha i=${frame.comparing.parent}`);
    frame.comparing.children.forEach((c) => {
      compareRoleMap.set(c.idx, c.formula);
    });
  }
  const swapSet = new Set(frame.swapping || []);

  items.forEach((item, idx) => {
    const prevIdx = state.heapPrevPosById.get(item.id);
    const moved = triggerArc && prevIdx !== undefined && prevIdx !== idx;
    const isLocked = idx >= frame.heapSize;
    const isSwapping = swapSet.has(idx);
    const isComparing = compareRoleMap.has(idx);
    const isJustLocked = frame.justLocked === idx;

    const nodeObj = state.heapTreeNodeEls.get(item.id);
    if (nodeObj) {
      const coord = state.heapTreeCoords[idx];
      if (coord) {
        nodeObj.outer.style.transform = `translate3d(${coord.x}px, ${coord.y}px, 0)`;
      }
      nodeObj.outer.style.zIndex = moved ? (idx < prevIdx ? '35' : '30') : isSwapping ? '25' : '20';

      if (isLocked) {
        nodeObj.scaleWrap.style.transform = 'scale(0.82)';
        nodeObj.scaleWrap.style.opacity = isJustLocked ? '0.96' : '0.72';
        nodeObj.scaleWrap.style.filter = isJustLocked ? 'brightness(1.05)' : 'brightness(0.85)';
      } else {
        nodeObj.scaleWrap.style.transform = 'scale(1)';
        nodeObj.scaleWrap.style.opacity = '1';
        nodeObj.scaleWrap.style.filter = 'brightness(1)';
      }

      nodeObj.inner.classList.remove('heap-arc-up', 'heap-arc-down');
      if (moved) {
        void nodeObj.inner.offsetWidth;
        nodeObj.inner.classList.add(idx < prevIdx ? 'heap-arc-up' : 'heap-arc-down');
      }

      if (isLocked) {
        nodeObj.inner.style.backgroundColor = '#0a241b';
        nodeObj.inner.style.borderColor = '#10b981';
        nodeObj.inner.style.color = '#a7f3d0';
        nodeObj.inner.style.boxShadow = isJustLocked
          ? '0 0 24px rgba(16, 185, 129, 0.7)'
          : '0 0 10px rgba(16, 185, 129, 0.25)';
        nodeObj.lockEl.style.opacity = '1';
        nodeObj.lockEl.style.transform = 'scale(1)';
      } else if (isSwapping) {
        nodeObj.inner.style.backgroundColor = '#3a1709';
        nodeObj.inner.style.borderColor = '#f97316';
        nodeObj.inner.style.color = '#ffffff';
        nodeObj.inner.style.boxShadow = '0 0 24px rgba(249, 115, 22, 0.75)';
        nodeObj.lockEl.style.opacity = '0';
        nodeObj.lockEl.style.transform = 'scale(0.5)';
      } else if (isComparing) {
        nodeObj.inner.style.backgroundColor = '#0b2236';
        nodeObj.inner.style.borderColor = '#38bdf8';
        nodeObj.inner.style.color = '#e0f2fe';
        nodeObj.inner.style.boxShadow = '0 0 22px rgba(56, 189, 248, 0.65)';
        nodeObj.lockEl.style.opacity = '0';
        nodeObj.lockEl.style.transform = 'scale(0.5)';
      } else {
        nodeObj.inner.style.backgroundColor = '#1d1609';
        nodeObj.inner.style.borderColor = '#f59e0b';
        nodeObj.inner.style.color = '#fef3c7';
        nodeObj.inner.style.boxShadow = '0 0 12px rgba(245, 158, 11, 0.22)';
        nodeObj.lockEl.style.opacity = '0';
        nodeObj.lockEl.style.transform = 'scale(0.5)';
      }
    }

    const tileObj = state.heapArrayTileEls.get(item.id);
    if (tileObj) {
      const targetX = idx * (slotW + gap);
      tileObj.outer.style.width = `${slotW}px`;
      tileObj.outer.style.transform = `translate3d(${targetX}px, 0, 0)`;
      tileObj.outer.style.zIndex = moved ? (idx < prevIdx ? '35' : '30') : isSwapping ? '25' : '15';

      tileObj.inner.classList.remove('heap-tile-hop-high', 'heap-tile-hop-low');
      if (moved) {
        void tileObj.inner.offsetWidth;
        tileObj.inner.classList.add(idx < prevIdx ? 'heap-tile-hop-high' : 'heap-tile-hop-low');
      }

      let roleText = '';
      let roleVariant = '';

      if (isLocked) {
        tileObj.inner.style.backgroundColor = '#0b251c';
        tileObj.inner.style.borderColor = '#10b981';
        tileObj.inner.style.color = '#a7f3d0';
        tileObj.inner.style.boxShadow = isJustLocked
          ? '0 0 22px rgba(16, 185, 129, 0.65)'
          : '0 0 10px rgba(16, 185, 129, 0.18)';
        tileObj.lockEl.style.opacity = '1';
        if (isJustLocked) {
          roleText = 'Khóa';
          roleVariant = 'role-lock';
        }
      } else if (isSwapping) {
        tileObj.inner.style.backgroundColor = '#3a1709';
        tileObj.inner.style.borderColor = '#f97316';
        tileObj.inner.style.color = '#ffffff';
        tileObj.inner.style.boxShadow = '0 0 22px rgba(249, 115, 22, 0.65)';
        tileObj.lockEl.style.opacity = '0';
        roleText = idx === 0 ? 'Gốc' : 'Đổi';
        roleVariant = 'role-swap';
      } else if (isComparing) {
        tileObj.inner.style.backgroundColor = '#0b2236';
        tileObj.inner.style.borderColor = '#38bdf8';
        tileObj.inner.style.color = '#e0f2fe';
        tileObj.inner.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.55)';
        tileObj.lockEl.style.opacity = '0';
        roleText = compareRoleMap.get(idx);
        roleVariant = 'role-cmp';
      } else {
        tileObj.inner.style.backgroundColor = '#1b150a';
        tileObj.inner.style.borderColor = '#f59e0b';
        tileObj.inner.style.color = '#fef3c7';
        tileObj.inner.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.15)';
        tileObj.lockEl.style.opacity = '0';
        if (idx === 0 && frame.heapSize > 0) {
          roleText = 'Gốc';
          roleVariant = 'role-root';
        }
      }

      if (roleText) {
        tileObj.roleEl.textContent = roleText;
        tileObj.roleEl.className = `heap-tile-role is-visible ${roleVariant}`;
      } else {
        tileObj.roleEl.className = 'heap-tile-role';
      }
    }

    state.heapPrevPosById.set(item.id, idx);
  });

  state.heapTreeEdgeEls.forEach(({ parent, child, lineEl }) => {
    const isChildLocked = child >= frame.heapSize;
    const isCompareEdge =
      frame.comparing &&
      frame.comparing.parent === parent &&
      frame.comparing.children.some((c) => c.idx === child);
    const isSwapEdge = swapSet.has(parent) && swapSet.has(child);

    if (isChildLocked) {
      lineEl.setAttribute('stroke', '#10b981');
      lineEl.setAttribute('stroke-width', '1.6');
      lineEl.setAttribute('stroke-dasharray', '5 5');
      lineEl.setAttribute('opacity', '0.26');
    } else if (isSwapEdge) {
      lineEl.setAttribute('stroke', '#f97316');
      lineEl.setAttribute('stroke-width', '3.6');
      lineEl.removeAttribute('stroke-dasharray');
      lineEl.setAttribute('opacity', '1');
    } else if (isCompareEdge) {
      lineEl.setAttribute('stroke', '#38bdf8');
      lineEl.setAttribute('stroke-width', '3.5');
      lineEl.removeAttribute('stroke-dasharray');
      lineEl.setAttribute('opacity', '1');
    } else {
      lineEl.setAttribute('stroke', '#b45309');
      lineEl.setAttribute('stroke-width', '2.3');
      lineEl.removeAttribute('stroke-dasharray');
      lineEl.setAttribute('opacity', '0.78');
    }
  });

  const slotsLayer = document.getElementById('heap-slots-layer');
  if (slotsLayer) {
    Array.from(slotsLayer.children).forEach((lbl, idx) => {
      const isLocked = idx >= frame.heapSize;
      const isActive = compareRoleMap.has(idx) || swapSet.has(idx);
      lbl.className = `heap-slot-label ${isLocked ? 'is-locked' : isActive ? 'is-active' : ''}`;
    });
  }

  const indexRow = document.getElementById('heap-index-row');
  if (indexRow) {
    Array.from(indexRow.children).forEach((lbl, idx) => {
      const isLocked = idx >= frame.heapSize;
      const isActive = compareRoleMap.has(idx) || swapSet.has(idx);
      lbl.className = `heap-index-cell ${isLocked ? 'is-locked' : isActive ? 'is-active' : ''}`;
    });
  }

  const heapBg = document.getElementById('heap-region-bg');
  const sortedBg = document.getElementById('heap-sorted-bg');
  const divider = document.getElementById('heap-divider');
  const labelHeap = document.getElementById('heap-label-heap');
  const labelSorted = document.getElementById('heap-label-sorted');
  const pad = 6;

  if (heapBg && labelHeap) {
    if (frame.heapSize > 0) {
      const heapW = frame.heapSize * slotW + (frame.heapSize - 1) * gap + pad * 2;
      heapBg.style.transform = `translate3d(${-pad}px, 0, 0)`;
      heapBg.style.width = `${heapW}px`;
      heapBg.style.opacity = '1';
      labelHeap.style.opacity = '1';
    } else {
      heapBg.style.width = '0px';
      heapBg.style.opacity = '0';
      labelHeap.style.opacity = '0.25';
    }
  }

  if (sortedBg && labelSorted) {
    const sortedCount = n - frame.heapSize;
    if (sortedCount > 0) {
      const sortedStartX = frame.heapSize * (slotW + gap) - pad;
      const sortedW = sortedCount * slotW + (sortedCount - 1) * gap + pad * 2;
      sortedBg.style.transform = `translate3d(${sortedStartX}px, 0, 0)`;
      sortedBg.style.width = `${sortedW}px`;
      sortedBg.style.opacity = '1';
      labelSorted.style.opacity = '1';
    } else {
      sortedBg.style.transform = `translate3d(${trackW}px, 0, 0)`;
      sortedBg.style.width = '0px';
      sortedBg.style.opacity = '0';
      labelSorted.style.opacity = '0.3';
    }
  }

  if (divider) {
    if (frame.heapSize > 0 && frame.heapSize < n) {
      const dividerX = frame.heapSize * (slotW + gap) - gap / 2 - 1.5;
      divider.style.transform = `translate3d(${dividerX}px, 0, 0)`;
      divider.style.opacity = '1';
    } else {
      const parkX = frame.heapSize === 0 ? -4 : trackW + 4;
      divider.style.transform = `translate3d(${parkX}px, 0, 0)`;
      divider.style.opacity = '0';
    }
  }

  renderHeapFormulaArcs(frame, slotW, gap);
  updateHeapMetadataUI(frame);
  updateHeapTimelineHighlight();
  updateHeapControlButtons();
}

function mountHeapsortSlide() {
  syncHeapSpeedTiming();
  const initialItems = state.heapFrames[0].items;
  state.heapPrevPosById.clear();
  state.heapFrames[state.heapStep].items.forEach((it, idx) => state.heapPrevPosById.set(it.id, idx));

  buildHeapPersistentTree(initialItems);
  buildHeapPersistentArrayTiles(initialItems);
  buildHeapTimeline();

  if (state.heapResizeObserver) {
    state.heapResizeObserver.disconnect();
    state.heapResizeObserver = null;
  }

  const treeStage = document.getElementById('heap-tree-stage');
  const arrayTrack = document.getElementById('heap-array-track');
  if (typeof ResizeObserver !== 'undefined' && (treeStage || arrayTrack)) {
    let rafId = null;
    state.heapResizeObserver = new ResizeObserver(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (SLIDES_DATA[state.slideIndex]?.id !== 15) return;
        repositionHeapTreeGeometry();
        renderHeapFrame(false);
      });
    });
    if (treeStage) state.heapResizeObserver.observe(treeStage);
    if (arrayTrack) state.heapResizeObserver.observe(arrayTrack);
  }

  requestAnimationFrame(() => {
    if (SLIDES_DATA[state.slideIndex]?.id !== 15) return;
    repositionHeapTreeGeometry();
    renderHeapFrame(false);
  });
}

function stopHeapPlay() {
  if (state.heapTimer !== null) {
    clearTimeout(state.heapTimer);
    state.heapTimer = null;
  }
  state.heapPlaying = false;
  updateHeapControlButtons();
}

function scheduleHeapTick() {
  if (!state.heapPlaying) return;
  const maxStep = state.heapFrames.length - 1;
  const delay = Math.round(1350 / state.heapSpeed);
  state.heapTimer = setTimeout(() => {
    if (!state.heapPlaying) return;
    if (state.heapStep < maxStep) {
      state.heapStep += 1;
      renderHeapFrame(true);
      if (state.heapStep >= maxStep) {
        stopHeapPlay();
      } else {
        scheduleHeapTick();
      }
    } else {
      stopHeapPlay();
    }
  }, delay);
}

function toggleHeapPlay() {
  const maxStep = state.heapFrames.length - 1;
  if (state.heapPlaying) {
    stopHeapPlay();
    return;
  }
  if (state.heapStep >= maxStep) {
    state.heapStep = 0;
    renderHeapFrame(true);
  }
  state.heapPlaying = true;
  updateHeapControlButtons();
  state.heapTimer = setTimeout(() => {
    if (!state.heapPlaying) return;
    if (state.heapStep < maxStep) {
      state.heapStep += 1;
      renderHeapFrame(true);
      if (state.heapStep < maxStep) {
        scheduleHeapTick();
      } else {
        stopHeapPlay();
      }
    } else {
      stopHeapPlay();
    }
  }, 150);
}

function jumpHeapStep(stepIdx) {
  stopHeapPlay();
  const maxStep = state.heapFrames.length - 1;
  const clamped = Math.max(0, Math.min(stepIdx, maxStep));
  if (clamped === state.heapStep) return;
  state.heapStep = clamped;
  renderHeapFrame(true);
}

function loadHeapArray(arr, isSample) {
  stopHeapPlay();
  setHeapHoveredItem(null);
  state.heapRawArray = [...arr];
  state.heapIsSample = isSample;
  state.heapFrames = generateHeapSortFrames(arr);
  state.heapStep = 0;
  state.heapPrevPosById.clear();

  const initialItems = state.heapFrames[0].items;
  initialItems.forEach((it, idx) => state.heapPrevPosById.set(it.id, idx));

  buildHeapPersistentTree(initialItems);
  buildHeapPersistentArrayTiles(initialItems);
  buildHeapTimeline();
  renderHeapFrame(false);
}

function renderSlide16() {
  return `
    <div class="bento-grid flex-1 min-h-0">
      <div class="bento-col col-7">
        ${renderCodeWindow('heapsort_iterative.py', 'python', HEAPSORT_PYTHON_CODE, 0)}
        <div class="bento-card bento-card-auto bento-item" style="--stagger:1">
          <div class="flex-row justify-between items-center flex-wrap gap-2">
            <span class="badge-pill badge-mint">Kết quả Console</span>
            <code class="mono" style="font-size:var(--fs-code); color:#FFD60A;">heap_sort([4, 10, 3, 5, 1]) → Output: [1, 3, 4, 5, 10]</code>
          </div>
        </div>
      </div>

      <div class="bento-col col-5">
        <div class="bento-card bento-card-accent flex-1 bento-item justify-between" style="--stagger:2">
          <div>
            <span class="badge-pill badge-amber">Điểm nhấn kỹ thuật: while True</span>
            <h3 class="bento-title mt-2">Khử đệ quy triệt tiêu Stack Overflow</h3>
          </div>
          <p class="bento-body mt-2">
            Thay vì gọi đệ quy <code>sift_down</code> tốn khung hàm trên Call Stack, vòng lặp <code>while True</code>
            trượt trực tiếp từ nút cha <code>i</code> xuống con <code>largest</code>, đạt chuẩn <strong>O(1) RAM phụ tuyệt đối</strong>.
          </p>
        </div>

        <div class="bento-card flex-1 bento-item justify-between" style="--stagger:3">
          <h3 class="bento-title">Cấu trúc 2 vòng lặp trong <code>heap_sort()</code></h3>
          <p class="bento-body mt-2">
            • <strong>Vòng 1 (Build Max-Heap):</strong> Duyệt ngược từ nút cha cuối <code>n // 2 - 1</code> về <code>0</code> (các nút từ <code>n // 2</code> trở đi là lá).<br/>
            • <strong>Vòng 2 (Extract):</strong> Đổi đỉnh <code>arr[0]</code> với cuối Heap <code>arr[i]</code> và gọi <code>sift_down(arr, i, 0)</code>.
          </p>
        </div>
      </div>
    </div>
  `;
}

function renderSlide17() {
  return `
    <div class="bento-grid bento-grid-auto">
      <div class="bento-card col-4 bento-item" style="--stagger:0">
        <span class="badge-pill badge-mint">Build Max-Heap</span>
        <div class="hero-stat mt-2">O(n)</div>
        <p class="bento-body mt-1">Một nửa số nút là lá có chiều cao 0.</p>
      </div>

      <div class="bento-card col-4 bento-item" style="--stagger:1">
        <span class="badge-pill badge-amber">Worst &amp; Average</span>
        <div class="hero-stat mt-2">O(n log n)</div>
        <p class="bento-body mt-1">Rút gốc lặp <code>n - 1</code> lần × <code>O(log n)</code>.</p>
      </div>

      <div class="bento-card bento-card-accent col-4 bento-item" style="--stagger:2">
        <span class="badge-pill badge-amber">Không gian Tuyệt đối</span>
        <div class="hero-stat-accent mt-2">O(1) RAM</div>
        <p class="bento-body mt-1">Không mảng phụ, không Call Stack.</p>
      </div>
    </div>

    <div class="bento-grid flex-1 min-h-0">
      <div class="bento-card col-8 bento-item" style="--stagger:3">
        <h3 class="bento-title">Độ phức tạp Thời gian (Time Complexity)</h3>
        <table class="data-table data-table-compact mt-1">
          <thead>
            <tr>
              <th>Thành phần / Trường hợp</th>
              <th>Độ phức tạp</th>
              <th>Phân tích chi tiết</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-bold cell-nowrap">Build Max-Heap</td>
              <td class="mono font-bold cell-nowrap" style="color:#30D158">O(n)</td>
              <td>Nhờ chuỗi hội tụ chiều cao cây: một nửa số nút là lá có chiều cao 0.</td>
            </tr>
            <tr>
              <td class="font-bold cell-nowrap">Rút gốc (Extract)</td>
              <td class="mono font-bold cell-nowrap" style="color:#FFD60A">O(n log n)</td>
              <td>Lặp <code>n - 1</code> lần, mỗi lần <code>sift_down</code> tối đa hết chiều cao cây <code>O(log n)</code>.</td>
            </tr>
            <tr class="row-highlight">
              <td class="font-bold cell-nowrap">Worst &amp; Average</td>
              <td class="mono font-bold cell-nowrap" style="color:#FF9F0A">O(n log n)</td>
              <td>Xấu nhất khi phần tử nhỏ ở đáy đưa lên đỉnh phải trượt hết chiều cao <code>log₂ n</code>.</td>
            </tr>
            <tr>
              <td class="font-bold cell-nowrap">Best Case</td>
              <td class="mono font-bold cell-nowrap" style="color:#64D2FF">Θ(n log n) / Θ(n)*</td>
              <td><code>Θ(n log n)</code> với phần tử phân biệt; đạt <code>Θ(n)</code> khi <strong>mọi phần tử bằng nhau</strong> (VD: <code>[5, 5, 5, 5]</code>) vì <code>sift_down</code> thoát ngay ở <code>break</code> đầu tiên.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bento-card bento-card-accent col-4 bento-item justify-between" style="--stagger:4">
        <div>
          <span class="badge-pill badge-amber">Nhà vô địch tiết kiệm RAM</span>
          <h3 class="bento-title mt-2">Sắp xếp tại chỗ thuần túy</h3>
          <p class="bento-body mt-2">
            Sắp xếp hoàn toàn tại chỗ (<em>In-place</em>) trên mảng gốc, chỉ dùng vài biến chỉ số cục bộ (<code>i, left, right, largest</code>).
          </p>
        </div>
        <div class="bento-subtile mt-3">
          <p class="bento-body">
            Không tốn <code>O(n)</code> RAM như Merge Sort, cũng không tốn <code>O(log n)</code> hay <code>O(n)</code> Call Stack như QuickSort.
          </p>
        </div>
      </div>
    </div>
  `;
}

function renderSlide18() {
  return `
    <div class="bento-grid flex-1 min-h-0">
      <div class="bento-col col-6">
        <div class="bento-card bento-card-accent flex-1 bento-item" style="--stagger:0">
          <div class="flex-row justify-between items-center gap-2">
            <span class="badge-pill badge-amber">1. Linux Kernel &amp; Hệ thống nhúng</span>
            <span class="mono bento-caption" style="color:#FFD60A">lib/sort.c</span>
          </div>
          <div class="hero-stat-accent mt-2">8–16 KB Stack</div>
          <h3 class="bento-title mt-2"><code>linux/lib/sort.c</code> chọn Heap Sort</h3>
          <p class="bento-body mt-2">
            • <strong>Kernel Stack cực nhỏ:</strong> Chỉ vỏn vẹn <strong>8 KB – 16 KB</strong>.<br/>
            • <strong>An toàn tuyệt đối:</strong> QuickSort đệ quy dễ gây tràn Stack dẫn tới <strong>Kernel Panic</strong> hoặc bị tấn công DoS <code>O(n²)</code>.<br/>
            • Heap Sort với <strong>O(1) RAM</strong> và cam kết <strong>O(n log n)</strong> là chốt chặn an toàn tuyệt đối.
          </p>
        </div>

        <div class="bento-card flex-1 bento-item" style="--stagger:1">
          <div class="flex-row justify-between items-center gap-2">
            <span class="badge-pill badge-blue">2. Priority Queue • LeetCode 215</span>
            <span class="mono font-bold" style="color:#5AC8FA; font-size:1.15rem;">O(n log k)</span>
          </div>
          <h3 class="bento-title mt-2">Kth Largest Element in an Array</h3>
          <p class="bento-body mt-2">
            Duy trì một <strong>Min-Heap kích thước k</strong> để lọc ra <code>k</code> phần tử lớn nhất trong thời gian
            <strong>O(n log k)</strong> thay vì phải sort toàn bộ mảng <code>O(n log n)</code>.
          </p>
        </div>
      </div>

      <div class="col-6 h-full min-h-0">
        ${renderCodeWindow('leetcode_215_kth_largest.py', 'python', LEETCODE_215_CODE, 2)}
      </div>
    </div>
  `;
}

function renderSlide19() {
  return `
    <div class="bento-grid flex-1 min-h-0">
      <div class="bento-card summary-expanded-card col-12 bento-item" style="--stagger:0">
        <div class="flex-row justify-between items-center flex-wrap gap-2">
          <h3 class="bento-title">So sánh 5 Thuật toán Sắp xếp Cốt lõi</h3>
          <span class="badge-pill badge-blue">Đánh đổi Production: Thời gian • Bộ nhớ • Tính ổn định • Cache</span>
        </div>

        <div class="comparison-table-wrap">
          <table class="data-table data-table-expanded">
            <thead>
              <tr>
                <th>Thuật toán</th>
                <th>Tốt nhất</th>
                <th>Trung bình</th>
                <th>Xấu nhất</th>
                <th>Bộ nhớ phụ</th>
                <th>Ổn định</th>
                <th>Đặc tính &amp; Đánh đổi</th>
                <th>Ứng dụng tiêu biểu</th>
              </tr>
            </thead>
            <tbody>
              ${COMPARISON_ROWS.map((r) => {
                const bestStyle = r.best === 'Θ(n)' ? 'color:#30D158;font-weight:700;' : '';
                const worstStyle = r.worst === 'Θ(n²)' ? 'color:#FF6961;font-weight:700;' : '';
                const spaceStyle =
                  r.space === 'O(1)'
                    ? 'color:#FFD60A;font-weight:700;'
                    : r.space === 'Θ(log n)'
                      ? 'color:#DF9EFF;font-weight:700;'
                      : '';
                const stableHtml =
                  r.stable === 'Có'
                    ? '<span style="color:#30D158;font-weight:700">Có</span>'
                    : '<span style="color:#A1A1A6;">Không</span>';

                return `
                  <tr class="row-theme-${r.theme}">
                    <td class="cell-nowrap">
                      <div class="algo-name">${r.name}</div>
                      <div class="algo-mechanism">${r.mechanism}</div>
                    </td>
                    <td class="mono cell-nowrap" style="${bestStyle}">${r.best}</td>
                    <td class="mono cell-nowrap">${r.average}</td>
                    <td class="mono cell-nowrap" style="${worstStyle}">${r.worst}</td>
                    <td class="mono cell-nowrap" style="${spaceStyle}">${r.space}</td>
                    <td class="cell-nowrap">${stableHtml}</td>
                    <td>${r.tradeoff}</td>
                    <td>${r.apps}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="summary-footer-bar">
          <span class="bento-caption">* Heap Sort đạt Best Case <code>Θ(n)</code> khi toàn bộ phần tử trong mảng bằng nhau.</span>
          <div class="flex-row gap-2 flex-wrap">
            <span class="badge-pill badge-mint">Timsort: Stable &amp; Natural Runs</span>
            <span class="badge-pill badge-purple">Introsort: Tốc độ RAM &amp; An toàn</span>
            <span class="badge-pill badge-amber">Heap Sort: O(1) RAM &amp; Không Stack</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSlideBody(slide) {
  switch (slide.id) {
    case 1:
      return renderSlide1();
    case 2:
      return renderSlide2();
    case 3:
      return renderSlide3();
    case 4:
      return renderSlide4();
    case 5:
      return renderSlide5();
    case 6:
      return renderSlide6();
    case 7:
      return renderSlide7();
    case 8:
      return renderSlide8();
    case 9:
      return renderSlide9();
    case 10:
      return renderSlide10();
    case 11:
      return renderSlide11();
    case 12:
      return renderSlide12();
    case 13:
      return renderSlide13();
    case 14:
      return renderSlide14();
    case 15:
      return renderSlide15();
    case 16:
      return renderSlide16();
    case 17:
      return renderSlide17();
    case 18:
      return renderSlide18();
    case 19:
      return renderSlide19();
    default:
      return '';
  }
}

function stopAllTimers() {
  stopTimsortPlay();
  stopIntroPlay();
  stopHeapPlay();
}

function renderSlideHeaderHtml(slide, total) {
  if (slide.id === 1) return '';
  const subtitle =
    slide.id === 4
      ? getTimsortHeaderSubtitle()
      : slide.id === 15
        ? getHeapHeaderSubtitle()
        : slide.subtitle;
  return `
    <header class="slide-header">
      <h1 class="slide-title">${slide.title}</h1>
      <div class="slide-meta-row">
        <p class="slide-subtitle">${subtitle}</p>
        <span class="slide-kicker">Slide ${String(slide.id).padStart(2, '0')} / ${total} • ${slide.duration}</span>
      </div>
    </header>
  `;
}

function renderNotesHtml(slide) {
  if (!state.showNotes) return '';
  return `
    <aside class="speaker-drawer" aria-label="Speaker Notes">
      <div class="speaker-drawer-header">
        <div class="flex-row gap-2">
          ${ICONS.notes}
          <strong style="font-size:0.95rem;">Speaker Notes — Slide ${slide.id}</strong>
          <span class="badge-pill badge-accent">${slide.duration}</span>
        </div>
        <button type="button" class="sim-btn" data-action="toggle-notes">Đóng (S)</button>
      </div>
      <div class="speaker-drawer-body">${slide.speakerNotes}</div>
    </aside>
  `;
}

function initShell() {
  const root = document.getElementById('root');
  const total = SLIDES_DATA.length;
  root.innerHTML = `
    <div id="app-shell" class="app-shell theme-hero">
      <div class="ambient-glow"></div>

      <div class="top-island-wrap">
        <header class="dynamic-island">
          <div class="brand-badge">
            <span class="brand-dot"></span>
            <span>DSA Sorting</span>
          </div>

          <nav id="chapter-nav" class="chapter-nav" aria-label="Chapters">
            ${CHAPTERS.map((ch) => {
              const rangeText =
                ch.range[0] === ch.range[1] ? ch.range[0] : `${ch.range[0]}–${ch.range[1]}`;
              return `
                <button type="button" class="chapter-btn" data-chapter="${ch.id}" data-action="jump-slide" data-slide="${ch.firstSlide - 1}">
                  <span>${ch.label}</span>
                  <span class="chapter-range">${rangeText}</span>
                </button>
              `;
            }).join('')}
          </nav>

          <div class="nav-actions">
            <button id="prev-slide-btn" type="button" class="nav-pill-btn icon-only" data-action="prev-slide" title="Slide trước (←)">
              ${ICONS.chevronLeft}
            </button>
            <span id="slide-counter" class="slide-counter">01 / ${total}</span>
            <button id="next-slide-btn" type="button" class="nav-pill-btn icon-only" data-action="next-slide" title="Slide tiếp (→)">
              ${ICONS.chevronRight}
            </button>
            <button id="notes-toggle-btn" type="button" class="nav-pill-btn" data-action="toggle-notes" title="Speaker Notes (S)">
              ${ICONS.notes}
              <span>Notes (S)</span>
            </button>
            <button type="button" class="nav-pill-btn icon-only" data-action="toggle-fullscreen" title="Toàn màn hình (F)">
              ${ICONS.fullscreen}
            </button>
          </div>
        </header>
      </div>

      <main class="stage-shell">
        <section id="slide-canvas" class="slide-canvas">
          <div id="slide-header-slot"></div>
          <div id="slide-body-slot" class="slide-body"></div>
        </section>
      </main>

      <div id="speaker-drawer-slot"></div>

      <div class="bottom-progress-track" aria-hidden="true">
        <div id="progress-fill" class="bottom-progress-fill" style="width:0%"></div>
      </div>
    </div>
  `;
}

function renderNotesOnly() {
  const slide = SLIDES_DATA[state.slideIndex];
  const notesBtn = document.getElementById('notes-toggle-btn');
  const drawerSlot = document.getElementById('speaker-drawer-slot');
  if (notesBtn) notesBtn.classList.toggle('active', state.showNotes);
  if (drawerSlot) drawerSlot.innerHTML = renderNotesHtml(slide);
}

function renderSlideBodyOnly() {
  const slide = SLIDES_DATA[state.slideIndex];
  const bodySlot = document.getElementById('slide-body-slot');
  if (!bodySlot) return;
  bodySlot.classList.remove('animate-stagger');
  bodySlot.innerHTML = renderSlideBody(slide);
}

function renderSlideChange(animate = true) {
  const slide = SLIDES_DATA[state.slideIndex];
  const total = SLIDES_DATA.length;
  const progress = ((state.slideIndex + 1) / total) * 100;

  const shell = document.getElementById('app-shell');
  if (shell) shell.className = `app-shell theme-${slide.theme}`;

  document.querySelectorAll('#chapter-nav .chapter-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.chapter === slide.chapter);
  });

  const counter = document.getElementById('slide-counter');
  if (counter) {
    counter.textContent = `${String(state.slideIndex + 1).padStart(2, '0')} / ${total}`;
  }

  const progressFill = document.getElementById('progress-fill');
  if (progressFill) progressFill.style.width = `${progress}%`;

  const prevBtn = document.getElementById('prev-slide-btn');
  if (prevBtn) prevBtn.disabled = state.slideIndex === 0;

  const nextBtn = document.getElementById('next-slide-btn');
  if (nextBtn) nextBtn.disabled = state.slideIndex === total - 1;

  const headerSlot = document.getElementById('slide-header-slot');
  if (headerSlot) headerSlot.innerHTML = renderSlideHeaderHtml(slide, total);

  if (state.introResizeObserver) {
    state.introResizeObserver.disconnect();
    state.introResizeObserver = null;
  }
  if (state.heapResizeObserver) {
    state.heapResizeObserver.disconnect();
    state.heapResizeObserver = null;
  }

  const bodySlot = document.getElementById('slide-body-slot');
  if (bodySlot) {
    bodySlot.classList.remove('animate-stagger');
    bodySlot.innerHTML = renderSlideBody(slide);
    if (animate) {
      void bodySlot.offsetWidth;
      bodySlot.classList.add('animate-stagger');
    }
  }

  if (slide.id === 10) {
    mountIntrosortSlide();
  } else if (slide.id === 15) {
    mountHeapsortSlide();
  }

  renderNotesOnly();
}

function goToSlide(idx) {
  stopAllTimers();
  const clamped = Math.max(0, Math.min(SLIDES_DATA.length - 1, idx));
  if (clamped === state.slideIndex) return;
  state.slideIndex = clamped;
  renderSlideChange(true);
}

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;

  switch (action) {
    case 'next-slide':
      goToSlide(state.slideIndex + 1);
      break;
    case 'prev-slide':
      goToSlide(state.slideIndex - 1);
      break;
    case 'jump-slide':
      goToSlide(Number(target.dataset.slide));
      break;
    case 'toggle-notes':
      state.showNotes = !state.showNotes;
      renderNotesOnly();
      break;
    case 'toggle-fullscreen':
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
      break;
    case 'tim-prev':
      timsortStepBackward();
      break;
    case 'tim-next':
      timsortStepForward();
      break;
    case 'tim-reset':
      loadTimsortArray(TIMSORT_DEFAULT_ARRAY);
      break;
    case 'tim-random':
      loadTimsortArray(generateRandomTimsortArray());
      break;
    case 'tim-auto':
      toggleTimsortPlay();
      break;
    case 'java-tab':
      state.javaTab = target.dataset.tab;
      renderSlideBodyOnly();
      break;
    case 'intro-tab':
      switchIntroTab(target.dataset.tab);
      break;
    case 'intro-prev':
      jumpIntroStep(state.introStep - 1);
      break;
    case 'intro-next':
      jumpIntroStep(state.introStep + 1);
      break;
    case 'intro-reset':
      jumpIntroStep(0);
      break;
    case 'intro-auto':
      toggleIntroPlay();
      break;
    case 'heap-prev':
      jumpHeapStep(state.heapStep - 1);
      break;
    case 'heap-next':
      jumpHeapStep(state.heapStep + 1);
      break;
    case 'heap-reset':
      jumpHeapStep(0);
      break;
    case 'heap-sample':
      loadHeapArray(HEAPSORT_SAMPLE_ARRAY, true);
      break;
    case 'heap-random':
      loadHeapArray(generateRandomHeapArray7(), false);
      break;
    case 'heap-auto':
      toggleHeapPlay();
      break;
    default:
      break;
  }
});

document.addEventListener('input', (e) => {
  if (e.target?.id === 'tim-speed-slider') {
    state.timsortSpeed = Number(e.target.value);
    const speedLabelEl = document.getElementById('tim-speed-label');
    if (speedLabelEl) {
      speedLabelEl.textContent = TIMSORT_SPEED_MAP[state.timsortSpeed]?.label || 'Vừa';
    }
  } else if (e.target?.id === 'intro-speed-slider') {
    state.introSpeed = Number(e.target.value);
    syncIntroSpeedTiming();
  } else if (e.target?.id === 'heap-speed-slider') {
    state.heapSpeed = Number(e.target.value);
    syncHeapSpeedTiming();
  }
});

document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;

  if (SLIDES_DATA[state.slideIndex]?.id === 4) {
    if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      toggleTimsortPlay();
      return;
    }
    if (e.key === ',' || e.key === '[') {
      e.preventDefault();
      timsortStepBackward();
      return;
    }
    if (e.key === '.' || e.key === ']') {
      e.preventDefault();
      timsortStepForward();
      return;
    }
  } else if (SLIDES_DATA[state.slideIndex]?.id === 10) {
    if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      toggleIntroPlay();
      return;
    }
    if (e.key === ',' || e.key === '[') {
      e.preventDefault();
      jumpIntroStep(state.introStep - 1);
      return;
    }
    if (e.key === '.' || e.key === ']') {
      e.preventDefault();
      jumpIntroStep(state.introStep + 1);
      return;
    }
    if (e.key === '1') {
      e.preventDefault();
      switchIntroTab('tab1');
      return;
    }
    if (e.key === '2') {
      e.preventDefault();
      switchIntroTab('tab2');
      return;
    }
  } else if (SLIDES_DATA[state.slideIndex]?.id === 15) {
    if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      toggleHeapPlay();
      return;
    }
    if (e.key === ',' || e.key === '[') {
      e.preventDefault();
      jumpHeapStep(state.heapStep - 1);
      return;
    }
    if (e.key === '.' || e.key === ']') {
      e.preventDefault();
      jumpHeapStep(state.heapStep + 1);
      return;
    }
    if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      jumpHeapStep(0);
      return;
    }
  }

  if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
    e.preventDefault();
    goToSlide(state.slideIndex + 1);
  } else if (['ArrowLeft', 'PageUp'].includes(e.key)) {
    e.preventDefault();
    goToSlide(state.slideIndex - 1);
  } else if (e.key === 's' || e.key === 'S') {
    e.preventDefault();
    state.showNotes = !state.showNotes;
    renderNotesOnly();
  } else if (e.key === 'f' || e.key === 'F') {
    e.preventDefault();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }
});

initShell();
renderSlideChange(true);
