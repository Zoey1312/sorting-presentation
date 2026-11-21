import {
  CHAPTERS,
  SLIDES_DATA,
  TIMSORT_JAVA_TABS,
  TIMSORT_SIM_STEPS,
  INTROSORT_SCENARIOS,
  INTROSORT_PYTHON_CODE,
  INTROSORT_OFFSET_CODE,
  HEAPSORT_SIM_STEPS,
  HEAPSORT_PYTHON_CODE,
  LEETCODE_215_CODE,
  LEETCODE_912_CODE,
  COMPARISON_ROWS,
  QA_FLASHCARDS,
} from './data/slidesData.js';

const ICONS = {
  chevronLeft: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  chevronRight: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  notes: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h8"/><path d="M8 14h4"/></svg>',
  fullscreen: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
  play: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  pause: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
  skipBack: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>',
  skipForward: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>',
  reset: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
  flip: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>',
};

const state = {
  slideIndex: 0,
  showNotes: false,
  timsortStep: 0,
  timsortTimer: null,
  javaTab: 'full',
  introTab: 'standard',
  introStep: 0,
  introTimer: null,
  heapStep: 0,
  heapTimer: null,
  flippedCards: {},
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
      const commentIdx =
        lang === 'java' ? rawLine.indexOf('//') : rawLine.indexOf('#');
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
      safe = safe.replace(
        /\b([a-zA-Z_]\w*)(?=\s*\()/g,
        '<span class="tok-fn">$1</span>'
      );

      if (commentPart) {
        return `${safe}<span class="tok-cm">${esc(commentPart)}</span>`;
      }
      return safe;
    })
    .join('\n');
}

function renderCodeWindow(title, lang, code) {
  return `
    <div class="code-window">
      <div class="code-header">
        <div class="code-dots">
          <span style="background:#ef4444"></span>
          <span style="background:#f59e0b"></span>
          <span style="background:#10b981"></span>
        </div>
        <span class="text-xs text-muted mono">${esc(title)}</span>
        <span class="badge-pill badge-cyan">${lang.toUpperCase()}</span>
      </div>
      <pre class="code-pre"><code>${highlightCode(code, lang)}</code></pre>
    </div>
  `;
}

function renderSlide1() {
  return `
    <div class="hero-center">
      <div>
        <span class="badge-pill badge-cyan">Môn học: Cấu trúc dữ liệu và Giải thuật</span>
      </div>
      <h1 class="hero-title">
        KHOẢNG CÁCH GIỮA SÁCH GIÁO KHOA VÀ HỆ THỐNG THỰC TẾ<br/>
        <span style="font-size:0.68em; opacity:0.92;">(PRODUCTION SORTING ALGORITHMS)</span>
      </h1>
      <p style="font-size:1.12rem; color:#cbd5e1; max-width:920px; line-height:1.5;">
        Phân tích, Mô phỏng &amp; Ứng dụng của <strong style="color:#6ee7b7">Timsort</strong>,
        <strong style="color:#c4b5fd">Introsort</strong> và <strong style="color:#fcd34d">Heap Sort</strong>
      </p>

      <div class="grid-3 mt-2">
        <div class="glass-panel card-pad floating-card" style="border-color:rgba(16,185,129,0.4)">
          <div class="flex-row gap-2" style="justify-content:space-between">
            <span class="badge-pill badge-emerald">Timsort (Tim Peters, 2002)</span>
            <span class="mono text-xs" style="color:#6ee7b7">Stable • O(n) Best</span>
          </div>
          <div class="card-title mt-2">Merge Sort + Insertion Sort</div>
          <p class="card-text">
            Trái tim của <strong>Python</strong> (<code>sort()</code>, <code>sorted()</code>),
            <strong>Java Object Arrays</strong> (<code>Arrays.sort(Object[])</code>), <strong>V8 JS</strong> và <strong>Android</strong>.
          </p>
        </div>

        <div class="glass-panel card-pad floating-card floating-card-delay-1" style="border-color:rgba(139,92,246,0.45)">
          <div class="flex-row gap-2" style="justify-content:space-between">
            <span class="badge-pill badge-violet">Introsort (David R. Musser, 1997)</span>
            <span class="mono text-xs" style="color:#c4b5fd">Θ(n log n) Bound</span>
          </div>
          <div class="card-title mt-2">Quick Sort + Heap Sort + Insertion</div>
          <p class="card-text">
            Sức mạnh đằng sau <code>std::sort</code> của <strong>C++ STL</strong>,
            thư viện chuẩn <strong>.NET</strong> (C#) và ngôn ngữ <strong>Go</strong>.
          </p>
        </div>

        <div class="glass-panel card-pad floating-card floating-card-delay-2" style="border-color:rgba(245,158,11,0.45)">
          <div class="flex-row gap-2" style="justify-content:space-between">
            <span class="badge-pill badge-amber">Heap Sort (Binary Heap)</span>
            <span class="mono text-xs" style="color:#fcd34d">O(1) RAM • No Stack</span>
          </div>
          <div class="card-title mt-2">Sắp xếp vun đống tại chỗ</div>
          <p class="card-text">
            Chốt chặn an toàn tuyệt đối của nhân <strong>Linux Kernel</strong> (<code>lib/sort.c</code>),
            <strong>Embedded Systems</strong> và <strong>Priority Queue</strong>.
          </p>
        </div>
      </div>

      <div class="glass-panel-sm flex-row" style="padding:10px 16px; justify-content:space-between;">
        <span class="text-sm text-muted">Sử dụng phím <code>→</code> / <code>Space</code> để chuyển slide • Bấm <code>S</code> để mở Speaker Notes</span>
        <button type="button" class="sim-btn primary" data-action="next-slide">Bắt đầu bài thuyết trình ${ICONS.chevronRight}</button>
      </div>
    </div>
  `;
}

function renderSlide2() {
  return `
    <div class="grid-2">
      <div class="glass-panel card-pad">
        <span class="badge-pill badge-cyan">Nền tảng Sách giáo khoa</span>
        <div class="card-title mt-2">Thuật toán cơ bản — O(n²)</div>
        <p class="card-text">
          <em>Bubble Sort, Selection Sort, Insertion Sort</em> giúp hiểu rõ nguyên lý so sánh từng cặp phần tử,
          nhưng chi phí bậc hai <strong>O(n²)</strong> không thể đáp ứng dữ liệu lớn trong hệ thống thực tế.
        </p>
      </div>
      <div class="glass-panel card-pad">
        <span class="badge-pill badge-emerald">Bước ngoặt Chia để trị</span>
        <div class="card-title mt-2">Merge Sort &amp; Quick Sort — Trung bình O(n log n)</div>
        <p class="card-text">
          Tạo đột phá về hiệu năng với độ phức tạp trung bình <strong>O(n log n)</strong>,
          trong đó <strong>Quick Sort</strong> từ lâu được xem là chuẩn mực tốc độ thực thi trong RAM.
        </p>
      </div>
    </div>

    <div class="grid-3">
      <div class="glass-panel card-pad" style="border-color:rgba(244,63,94,0.4)">
        <span class="badge-pill badge-rose">Góc khuất #1 • Nguy cơ bảo mật</span>
        <div class="card-title mt-2">Nguy cơ của Quick Sort</div>
        <p class="card-text">
          Tiềm ẩn nguy cơ suy thoái về <strong>O(n²)</strong> khi gặp dữ liệu bất lợi (chọn chốt xấu liên tiếp)
          hoặc gây tràn ngăn xếp (<strong>Stack Overflow</strong> <code>O(n)</code>), dễ bị khai thác tấn công DoS.
        </p>
      </div>
      <div class="glass-panel card-pad" style="border-color:rgba(245,158,11,0.4)">
        <span class="badge-pill badge-amber">Góc khuất #2 • Áp lực bộ nhớ</span>
        <div class="card-title mt-2">Gánh nặng của Merge Sort</div>
        <p class="card-text">
          Đảm bảo ổn định (<strong>Stable</strong>) và cận trên <code>O(n log n)</code>, nhưng tiêu tốn
          bộ nhớ phụ <strong>O(n)</strong>, bất khả thi trên hệ thống nhúng hoặc nhân OS có RAM/Stack hạn hẹp.
        </p>
      </div>
      <div class="glass-panel card-pad" style="border-color:rgba(34,211,238,0.4)">
        <span class="badge-pill badge-cyan">Góc khuất #3 • Dữ liệu đời thực</span>
        <div class="card-title mt-2">Đặc thù dữ liệu Production</div>
        <p class="card-text">
          Dữ liệu thực tế hiếm khi ngẫu nhiên hoàn toàn mà thường có sẵn các đoạn đã được sắp xếp cục bộ
          (<em>natural runs</em>) — như log hệ thống, danh sách giao dịch nối tiếp.
        </p>
      </div>
    </div>

    <div className="glass-panel" class="glass-panel card-pad" style="border-color:rgba(16,185,129,0.4); background:linear-gradient(135deg, rgba(16,185,129,0.12), rgba(139,92,246,0.12))">
      <div class="card-title">Giải pháp từ các Thư viện Chuẩn &amp; Hệ điều hành</div>
      <p class="card-text">
        Sự ra đời của các thuật toán lai (<strong>Hybrid Sorting</strong>) và tối ưu phần cứng:
        <strong style="color:#6ee7b7">Timsort</strong> (khai thác natural runs + ổn định),
        <strong style="color:#c4b5fd">Introsort</strong> (tốc độ RAM + lưới an toàn Heapsort) và
        <strong style="color:#fcd34d">Heap Sort</strong> (chuẩn O(1) RAM tuyệt đối).
      </p>
    </div>
  `;
}

function renderSlide3() {
  return `
    <div class="grid-2-weighted">
      <div class="glass-panel card-pad flex" style="flex-direction:column; gap:10px;">
        <div class="card-title">Bài toán &amp; Tính ổn định (Stability)</div>
        <p class="card-text">
          <strong>Định nghĩa:</strong> Thuật toán sắp xếp lai kết hợp <strong>Merge Sort</strong> và <strong>Insertion Sort</strong> (Tim Peters, 2002).
        </p>
        <div class="glass-panel-sm card-pad">
          <div class="text-xs text-muted">Đặc tả Input / Output</div>
          <p class="card-text mt-2">
            • <strong>Input:</strong> Mảng <code>n</code> phần tử (số, chuỗi, hoặc Object so sánh qua <code>Comparable</code> / <code>Comparator</code> trong Java).<br/>
            • <strong>Ví dụ:</strong> <code>[5, 2, 3, 1, 4]</code> → <code>[1, 2, 3, 4, 5]</code>.
          </p>
        </div>
        <div class="glass-panel-sm card-pad" style="border-color:rgba(16,185,129,0.35)">
          <span class="badge-pill badge-emerald">Stable Sort (Tính ổn định)</span>
          <p class="card-text mt-2">
            Các phần tử có khóa bằng nhau (VD: bản ghi nhân viên cùng điểm, đơn hàng cùng ngày)
            <strong>giữ nguyên thứ tự tương đối ban đầu</strong>. Cực kỳ quan trọng khi sắp xếp theo nhiều tiêu chí!
          </p>
        </div>
      </div>

      <div class="glass-panel card-pad">
        <div class="card-title">4 Cơ chế cốt lõi của Timsort</div>
        <div style="display:flex; flex-direction:column; gap:9px;">
          <div class="glass-panel-sm" style="padding:10px 12px;">
            <strong style="color:#6ee7b7">1. Natural Runs (Đoạn có thứ tự tự nhiên)</strong>
            <p class="text-sm text-muted mt-2">Quét mảng phát hiện các đoạn liên tiếp đã tăng dần (hoặc giảm dần rồi đảo ngược).</p>
          </div>
          <div class="glass-panel-sm" style="padding:10px 12px;">
            <strong style="color:#67e8f9">2. Minrun &amp; Binary Insertion Sort</strong>
            <p class="text-sm text-muted mt-2">Thực tế <code>minrun = 32–64</code> (tính theo bit từ <code>n</code>). Nếu run ngắn hơn <code>minrun</code>, mở rộng bằng Binary Insertion Sort. <em>(Bản minh họa học tập đặt <code>minrun = 4</code>)</em>.</p>
          </div>
          <div class="glass-panel-sm" style="padding:10px 12px;">
            <strong style="color:#a5f3fc">3. Merge Stack (Ngăn xếp gộp cân bằng)</strong>
            <p class="text-sm text-muted mt-2">Lưu các run vào stack và gộp theo bất biến cân bằng kích thước để tránh cây gộp lệch.</p>
          </div>
          <div class="glass-panel-sm" style="padding:10px 12px;">
            <strong style="color:#fcd34d">4. Galloping Mode (Chế độ phi nước đại)</strong>
            <p class="text-sm text-muted mt-2">Khi một run liên tục thắng lúc merge, thuật toán nhảy bước lũy thừa rồi tìm nhị phân để chép cả cụm phần tử cùng lúc.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSlide4() {
  const cur = TIMSORT_SIM_STEPS[state.timsortStep];
  const toneClass = (tone) => {
    if (tone === 'emerald') return 'cell-emerald';
    if (tone === 'cyan' || tone === 'teal') return 'cell-cyan';
    if (tone === 'warn') return 'cell-warn';
    if (tone === 'done') return 'cell-done';
    return '';
  };

  return `
    <div class="glass-panel card-pad flex" style="flex-direction:column; gap:12px;">
      <div class="sim-toolbar">
        <div class="flex-row gap-2">
          <span class="badge-pill badge-emerald">${cur.badge}</span>
          <strong>${cur.title}</strong>
        </div>
        <div class="flex-row gap-2">
          <button type="button" class="sim-btn" data-action="tim-prev" ${state.timsortStep === 0 ? 'disabled' : ''}>${ICONS.skipBack} Quay lại</button>
          <button type="button" class="sim-btn primary" data-action="tim-next" ${state.timsortStep === TIMSORT_SIM_STEPS.length - 1 ? 'disabled' : ''}>Bước tiếp ${ICONS.skipForward}</button>
          <button type="button" class="sim-btn" data-action="tim-auto">${state.timsortTimer ? `${ICONS.pause} Tạm dừng` : `${ICONS.play} Tự động chạy`}</button>
          <button type="button" class="sim-btn" data-action="tim-reset">${ICONS.reset} Đặt lại</button>
        </div>
      </div>

      <div class="flex-row gap-2">
        ${TIMSORT_SIM_STEPS.map(
          (s) => `
          <button type="button" class="tab-btn ${state.timsortStep === s.step ? 'active' : ''}" data-action="tim-jump" data-step="${s.step}">
            Bước ${s.step}
          </button>
        `
        ).join('')}
      </div>

      <p class="card-text">${cur.description}</p>

      <div class="array-strip">
        ${cur.groups
          .map(
            (g) => `
          <div class="run-group">
            <span class="run-group-label">${g.label}</span>
            <div class="cells-row">
              ${g.items.map((v) => `<div class="array-cell ${toneClass(g.tone)}">${v}</div>`).join('')}
            </div>
          </div>
        `
          )
          .join('')}
      </div>

      <div class="glass-panel-sm" style="padding:10px 14px; border-color:rgba(16,185,129,0.35); color:#d1fae5; font-size:0.88rem;">
        ${cur.highlightText}
      </div>
    </div>

    <div class="glass-panel card-pad">
      <div class="card-title">Bảng đối chiếu mở rộng Run ngắn (minrun = 4)</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Đoạn Run</th>
            <th>Run tự nhiên ban đầu</th>
            <th>Mở rộng trước Insertion Sort</th>
            <th>Sau Insertion Sort</th>
          </tr>
        </thead>
        <tbody>
          <tr class="${state.timsortStep === 2 ? 'row-highlight' : ''}">
            <td class="font-bold">Run 1 (0..3)</td>
            <td class="mono">[3, 5, 7] (len 3 &lt; 4)</td>
            <td class="mono">[3, 5, 7, 2]</td>
            <td class="mono" style="color:#6ee7b7">[2, 3, 5, 7]</td>
          </tr>
          <tr class="${state.timsortStep === 2 ? 'row-highlight' : ''}">
            <td class="font-bold">Run 2 (4..7)</td>
            <td class="mono">[2, 4, 6, 9] → tiếp [4, 6, 9]</td>
            <td class="mono">[4, 6, 9, 1]</td>
            <td class="mono" style="color:#67e8f9">[1, 4, 6, 9]</td>
          </tr>
          <tr class="${state.timsortStep === 2 ? 'row-highlight' : ''}">
            <td class="font-bold">Run 3 (8..9)</td>
            <td class="mono">[1, 8, 10] → phần còn lại [8, 10]</td>
            <td class="mono">[8, 10]</td>
            <td class="mono" style="color:#67e8f9">[8, 10]</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderSlide5() {
  const activeTab =
    TIMSORT_JAVA_TABS.find((t) => t.id === state.javaTab) || TIMSORT_JAVA_TABS[0];

  return `
    <div class="flex-row gap-2" style="flex-wrap:wrap">
      ${TIMSORT_JAVA_TABS.map(
        (t) => `
        <button type="button" class="tab-btn ${state.javaTab === t.id ? 'active' : ''}" data-action="java-tab" data-tab="${t.id}">
          ${t.label}
        </button>
      `
      ).join('')}
    </div>

    <div class="grid-2-weighted" style="min-height:0; flex:1;">
      <div style="min-height:0; overflow:auto;">
        ${renderCodeWindow('TimSortDemo.java', 'java', activeTab.code)}
      </div>

      <div class="flex" style="flex-direction:column; gap:12px;">
        <div class="glass-panel card-pad">
          <div class="card-title">Giải thích phương thức đang xem</div>
          <p class="card-text">${activeTab.description}</p>
        </div>

        <div class="glass-panel card-pad">
          <span class="badge-pill badge-emerald">Kết quả Console</span>
          <pre class="mono mt-2" style="font-size:0.84rem; color:#a7f3d0; background:#070b14; padding:10px 12px; border-radius:10px; border:1px solid rgba(16,185,129,0.28);">Input : [3, 5, 7, 2, 4, 6, 9, 1, 8, 10]
Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]</pre>
        </div>

        <div class="glass-panel card-pad">
          <div class="card-title">Lưu ý kỹ thuật &amp; Tính ổn định</div>
          <p class="card-text">
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
    <div class="glass-panel card-pad">
      <div class="card-title">Bảng Độ phức tạp Thời gian (Time Complexity)</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Trường hợp</th>
            <th>Độ phức tạp</th>
            <th>Cơ chế &amp; Tình huống ví dụ</th>
          </tr>
        </thead>
        <tbody>
          <tr class="row-highlight">
            <td class="font-bold">Tốt nhất (Best Case)</td>
            <td class="mono font-bold" style="color:#6ee7b7">O(n)</td>
            <td>Mảng đã tăng dần, chỉ quét 1 lượt phát hiện 1 run duy nhất, không cần merge (VD: danh sách giao dịch theo thời gian).</td>
          </tr>
          <tr>
            <td class="font-bold">Trung bình (Average Case)</td>
            <td class="mono font-bold" style="color:#67e8f9">O(n log n)</td>
            <td>Dữ liệu ngẫu nhiên hoặc bán sắp xếp, gộp qua khoảng <code>~log n</code> tầng; các run dài giúp giảm mạnh số lần gộp.</td>
          </tr>
          <tr>
            <td class="font-bold">Xấu nhất (Worst Case)</td>
            <td class="mono font-bold" style="color:#fcd34d">O(n log n)</td>
            <td>Dữ liệu đảo lộn tạo nhiều run ngắn, nhưng không bao giờ suy biến thành <code>O(n²)</code> nhờ quy tắc quản lý run.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid-2">
      <div class="glass-panel card-pad">
        <span class="badge-pill badge-cyan">Độ phức tạp Không gian: O(n)</span>
        <div class="card-title mt-2">Vùng đệm tạm &amp; Run Stack</div>
        <p class="card-text">
          • Tốn <strong>O(n)</strong> bộ nhớ phụ trong trường hợp xấu nhất cho vùng đệm tạm (<em>temporary buffer</em>) khi trộn hai run lớn và <code>run stack</code>.<br/>
          • Bản Java minh họa dùng <code>runStart</code> và <code>runEnd</code> kích thước <code>n</code> để dễ quan sát cấu trúc.
        </p>
      </div>
      <div class="glass-panel card-pad">
        <span class="badge-pill badge-emerald">Bài toán đánh đổi (Trade-off)</span>
        <div class="card-title mt-2">Timsort vs Dual-Pivot Quicksort</div>
        <p class="card-text">
          Chấp nhận tốn RAM <strong>O(n)</strong> (khác với Dual-Pivot Quicksort dùng cho kiểu nguyên thủy trong Java) để đổi lấy
          <strong>tính ổn định (Stability)</strong> và tốc độ cực cao trên dữ liệu thực tế gần có thứ tự.
        </p>
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
    <div class="glass-panel card-pad">
      <div class="card-title">1. Hệ sinh thái Ngôn ngữ Lập trình &amp; Runtime</div>
      <p class="card-text">
        Thuật toán sắp xếp mặc định trong <strong>Python</strong> (<code>sort()</code>, <code>sorted()</code>),
        <strong>Java</strong> (<code>Arrays.sort(Object[])</code>, <code>Collections.sort()</code>),
        <strong>Android</strong>, và <strong>V8 JavaScript Engine</strong> (Chrome, Node.js).
      </p>
    </div>

    <div class="grid-2">
      <div class="flex" style="flex-direction:column; gap:10px;">
        <div class="glass-panel card-pad">
          <span class="badge-pill badge-emerald">2. Hệ thống thu thập Server Logs</span>
          <p class="card-text mt-2">
            Ghép log từ nhiều máy chủ bị lệch nhẹ timestamp do độ trễ mạng tạo thành nhiều run gần tăng dần.
            Timsort nhận diện nhanh và giữ nguyên thứ tự các log trùng timestamp.
          </p>
        </div>
        ${renderCodeWindow('ServerLogSort.java', 'java', logCode)}
      </div>

      <div class="flex" style="flex-direction:column; gap:10px;">
        <div class="glass-panel card-pad">
          <span class="badge-pill badge-cyan">3. Liên hệ LeetCode 88 — Merge Sorted Array</span>
          <p class="card-text mt-2">
            Tư tưởng tận dụng các đoạn đã có thứ tự thay vì sắp xếp lại từ đầu và trộn bằng 2 con trỏ trong thời gian tuyến tính <code>O(m + n)</code>.
          </p>
        </div>
        ${renderCodeWindow('MergeSortedRuns.java', 'java', lc88Code)}
      </div>
    </div>
  `;
}

function renderSlide8() {
  return `
    <div class="glass-panel card-pad">
      <div class="flex-row" style="justify-content:space-between; flex-wrap:wrap; gap:8px;">
        <span class="badge-pill badge-violet">David R. Musser (1997) — Bảo vệ std::sort của C++ STL</span>
        <span class="mono text-xs" style="color:#c4b5fd">Ví dụ: [19, 7, 15, 12, 16, 18, 4, 11, 13] → [4, 7, 11, 12, 13, 15, 16, 18, 19]</span>
      </div>
      <p class="card-text mt-2">
        <strong>Đặc tả bài toán:</strong> Sắp xếp mảng dựa trên phép so sánh tại chỗ (<em>In-place comparison sort</em>) — vừa đạt tốc độ thực thi trung bình nhanh như Quicksort, vừa khóa chặt thời gian xấu nhất ở mức <strong>O(n log n)</strong>.
      </p>
    </div>

    <div class="grid-2">
      <div class="glass-panel card-pad">
        <div class="card-title">Tại sao không dùng 1 thuật toán đơn lẻ?</div>
        <div style="display:flex; flex-direction:column; gap:9px;">
          <div class="glass-panel-sm" style="padding:10px 12px;">
            <strong style="color:#fda4af">1. Chỉ dùng Quicksort:</strong>
            <span class="text-sm text-muted"> Trung bình rất nhanh nhưng suy biến <code>O(n²)</code> và tràn stack <code>O(n)</code> khi chọn chốt xấu.</span>
          </div>
          <div class="glass-panel-sm" style="padding:10px 12px;">
            <strong style="color:#fcd34d">2. Chỉ dùng Heapsort:</strong>
            <span class="text-sm text-muted"> Luôn <code>O(n log n)</code> và <code>O(1)</code> RAM, nhưng nhảy bộ nhớ liên tục gây <strong>Cache Miss</strong>, chậm hơn Quicksort 2–3 lần.</span>
          </div>
          <div class="glass-panel-sm" style="padding:10px 12px;">
            <strong style="color:#67e8f9">3. Không có Insertion Sort:</strong>
            <span class="text-sm text-muted"> Quicksort gọi đệ quy tới đoạn 1–2 phần tử → lãng phí tới <strong>75% tổng số lời gọi hàm</strong> ở đáy cây đệ quy.</span>
          </div>
        </div>
      </div>

      <div class="glass-panel card-pad">
        <div class="card-title">3 Trụ cột của Introsort</div>
        <div style="display:flex; flex-direction:column; gap:9px;">
          <div class="glass-panel-sm" style="padding:10px 12px; border-color:rgba(99,102,241,0.45)">
            <strong style="color:#93c5fd">1. Quicksort (Chủ lực)</strong>
            <p class="text-sm text-muted mt-2">Khi <code>size &gt; 16</code> và <code>depth &gt; 0</code>. Dùng chốt <em>Median-of-Three</em>, duyệt tuần tự thân thiện L1/L2 CPU Cache.</p>
          </div>
          <div class="glass-panel-sm" style="padding:10px 12px; border-color:rgba(139,92,246,0.5)">
            <strong style="color:#c4b5fd">2. Heapsort (Lưới an toàn)</strong>
            <p class="text-sm text-muted mt-2">Khi <code>size &gt; 16</code> và <code>depth == 0</code>. Vun đống tại chỗ ngay trên đoạn con bị lệch, khóa chặt cận trên <code>O(n log n)</code>.</p>
          </div>
          <div class="glass-panel-sm" style="padding:10px 12px; border-color:rgba(16,185,129,0.45)">
            <strong style="color:#6ee7b7">3. Insertion Sort (Đoạn nhỏ)</strong>
            <p class="text-sm text-muted mt-2">Khi <code>size &lt;= 16</code>. Triệt tiêu chi phí gọi hàm đệ quy (<em>recursion overhead</em>) ở đáy cây.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSlide9() {
  return `
    <div class="glass-panel card-pad">
      <div class="flex-row" style="justify-content:space-between; flex-wrap:wrap; gap:8px;">
        <div class="card-title" style="margin:0;">Lưu đồ điều phối <code>_introsort_util(low, high, depth_limit)</code></div>
        <span class="badge-pill badge-violet">Khởi tạo ở gốc: depth_limit = 2 * floor(log2(n))</span>
      </div>

      <svg viewBox="0 0 980 345" style="width:100%; max-height:335px; margin-top:10px;">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#94a3b8" />
          </marker>
        </defs>

        <!-- Start -->
        <rect x="20" y="24" width="290" height="58" rx="12" fill="rgba(30,41,59,0.9)" stroke="#818cf8" stroke-width="2" />
        <text x="165" y="48" text-anchor="middle" fill="#f8fafc" font-size="13" font-weight="700">Bắt đầu _introsort_util(low, high, depth)</text>
        <text x="165" y="68" text-anchor="middle" fill="#cbd5e1" font-size="12">Tính size = high - low + 1</text>

        <line x1="165" y1="82" x2="165" y2="115" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow)" />

        <!-- Step 1 -->
        <rect x="20" y="117" width="290" height="58" rx="12" fill="rgba(16,185,129,0.14)" stroke="#10b981" stroke-width="2" />
        <text x="165" y="142" text-anchor="middle" fill="#a7f3d0" font-size="13" font-weight="700">Bước 1: Kiểm tra đoạn nhỏ</text>
        <text x="165" y="162" text-anchor="middle" fill="#e2e8f0" font-size="12">size &lt;= 16 (THRESHOLD) ?</text>

        <line x1="310" y1="146" x2="430" y2="146" stroke="#10b981" stroke-width="2" marker-end="url(#arrow)" />
        <text x="370" y="138" text-anchor="middle" fill="#6ee7b7" font-size="11" font-weight="700">ĐÚNG</text>

        <rect x="434" y="117" width="510" height="58" rx="12" fill="rgba(16,185,129,0.22)" stroke="#34d399" stroke-width="2" />
        <text x="689" y="142" text-anchor="middle" fill="#ecfdf5" font-size="13" font-weight="700">Insertion Sort đoạn [low..high] &amp; RETURN</text>
        <text x="689" y="161" text-anchor="middle" fill="#a7f3d0" font-size="12">Chèn trực tiếp, triệt tiêu chi phí gọi hàm đệ quy ở đáy cây</text>

        <line x1="165" y1="175" x2="165" y2="206" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow)" />
        <text x="186" y="195" fill="#94a3b8" font-size="11" font-weight="700">SAI</text>

        <!-- Step 2 -->
        <rect x="20" y="208" width="290" height="56" rx="12" fill="rgba(139,92,246,0.16)" stroke="#8b5cf6" stroke-width="2" />
        <text x="165" y="232" text-anchor="middle" fill="#ddd6fe" font-size="13" font-weight="700">Bước 2: Kiểm tra ngân sách độ sâu</text>
        <text x="165" y="252" text-anchor="middle" fill="#e2e8f0" font-size="12">depth_limit == 0 ?</text>

        <line x1="310" y1="236" x2="430" y2="236" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrow)" />
        <text x="370" y="228" text-anchor="middle" fill="#c4b5fd" font-size="11" font-weight="700">ĐÚNG</text>

        <rect x="434" y="208" width="510" height="56" rx="12" fill="rgba(139,92,246,0.26)" stroke="#a78bfa" stroke-width="2" />
        <text x="689" y="232" text-anchor="middle" fill="#f5f3ff" font-size="13" font-weight="700">Heapsort đoạn con [low..high] &amp; RETURN</text>
        <text x="689" y="251" text-anchor="middle" fill="#ddd6fe" font-size="12">Vun đống tại chỗ bằng offset = low, khóa chặt cận O(n log n)</text>

        <line x1="165" y1="264" x2="165" y2="288" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow)" />
        <text x="186" y="280" fill="#94a3b8" font-size="11" font-weight="700">SAI</text>

        <!-- Step 3 -->
        <rect x="20" y="290" width="924" height="50" rx="12" fill="rgba(59,130,246,0.22)" stroke="#38bdf8" stroke-width="2" />
        <text x="482" y="313" text-anchor="middle" fill="#f0f9ff" font-size="13" font-weight="700">Bước 3 (Phân hoạch chuẩn Quicksort): p = partition_median_of_three(arr, low, high)</text>
        <text x="482" y="331" text-anchor="middle" fill="#bae6fd" font-size="12">Gọi đệ quy nửa phải [p + 1 .. high] với (depth_limit - 1)  •  Khử đệ quy đuôi nửa trái: high = p - 1 (lặp while với depth_limit - 1)</text>
      </svg>
    </div>
  `;
}

function renderSlide10() {
  const scenario = INTROSORT_SCENARIOS[state.introTab];
  const cur = scenario.steps[state.introStep] || scenario.steps[0];
  const roleClass = (role) => {
    if (role === 'pivot') return 'cell-pivot';
    if (role === 'insertion') return 'cell-emerald';
    if (role === 'heapsort') return 'cell-amber';
    if (role === 'active') return 'cell-violet';
    if (role === 'done') return 'cell-done';
    return 'cell-cyan';
  };

  return `
    <div class="glass-panel card-pad flex" style="flex-direction:column; gap:10px;">
      <div class="sim-toolbar">
        <div class="flex-row gap-2" style="flex-wrap:wrap">
          <button type="button" class="tab-btn ${state.introTab === 'standard' ? 'active' : ''}" data-action="intro-tab" data-tab="standard">
            ${INTROSORT_SCENARIOS.standard.label}
          </button>
          <button type="button" class="tab-btn ${state.introTab === 'heapsortFallback' ? 'active' : ''}" data-action="intro-tab" data-tab="heapsortFallback">
            ${INTROSORT_SCENARIOS.heapsortFallback.label}
          </button>
        </div>
        <div class="flex-row gap-2">
          <button type="button" class="sim-btn" data-action="intro-prev" ${state.introStep === 0 ? 'disabled' : ''}>${ICONS.skipBack} Quay lại</button>
          <button type="button" class="sim-btn primary" data-action="intro-next" ${state.introStep === scenario.steps.length - 1 ? 'disabled' : ''}>Bước tiếp ${ICONS.skipForward}</button>
          <button type="button" class="sim-btn" data-action="intro-auto">${state.introTimer ? `${ICONS.pause} Dừng` : `${ICONS.play} Tự động`}</button>
        </div>
      </div>

      <p class="text-sm text-muted">${scenario.subtitle}</p>

      <div class="array-strip">
        ${cur.segments
          .map(
            (seg) => `
          <div class="run-group">
            <span class="run-group-label">${seg.label}</span>
            <div class="cells-row">
              ${seg.values.map((v) => `<div class="array-cell ${roleClass(seg.role)}">${v}</div>`).join('')}
            </div>
          </div>
        `
          )
          .join('')}
      </div>

      <div class="glass-panel-sm" style="padding:8px 12px; font-size:0.86rem; color:#e2e8f0;">
        <strong>${cur.algo}:</strong> ${cur.action}
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Bước</th>
            <th>Đoạn (Size)</th>
            <th>Depth</th>
            <th>Thuật toán</th>
            <th>Pivot &amp; Kết quả xử lý</th>
          </tr>
        </thead>
        <tbody>
          ${scenario.steps
            .map(
              (row, idx) => `
            <tr class="${idx === state.introStep ? 'row-highlight' : ''}" style="cursor:pointer" data-action="intro-jump" data-step="${idx}">
              <td class="font-bold">${row.step}</td>
              <td class="mono">${row.range}</td>
              <td class="mono">${row.depth}</td>
              <td>${row.algo}</td>
              <td>${row.action}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderSlide11() {
  return `
    <div class="grid-2" style="min-height:0; flex:1;">
      <div class="flex" style="flex-direction:column; gap:10px; min-height:0; overflow:auto;">
        ${renderCodeWindow('introsort_driver.py (Khử đệ quy đuôi)', 'python', INTROSORT_PYTHON_CODE)}
      </div>

      <div class="flex" style="flex-direction:column; gap:10px; min-height:0; overflow:auto;">
        <div class="glass-panel card-pad">
          <div class="card-title">Ánh xạ chỉ số Heap (Offset) trên đoạn con [low..high]</div>
          <div class="grid-2 mt-2">
            <div class="glass-panel-sm" style="padding:8px 10px;">
              <div class="text-xs text-muted">Heap chuẩn (từ 0)</div>
              <div class="mono text-sm mt-2">Cha: i<br/>Trái: 2*i + 1<br/>Phải: 2*i + 2</div>
            </div>
            <div class="glass-panel-sm" style="padding:8px 10px; border-color:rgba(139,92,246,0.45)">
              <div class="text-xs" style="color:#c4b5fd">Đoạn [low..high] (offset = low)</div>
              <div class="mono text-sm mt-2">Cha: low + i<br/>Trái: low + 2*i + 1<br/>Phải: low + 2*i + 2</div>
            </div>
          </div>
          <p class="text-sm mt-2" style="color:#a7f3d0">
            <strong>Lợi ích cốt lõi:</strong> Tuyệt đối không dùng list slicing (<code>arr[a:b]</code>), không tạo mảng phụ, bảo toàn bộ nhớ phụ <strong>O(1)</strong> cho thao tác hoán đổi!
          </p>
        </div>
        ${renderCodeWindow('heapsort_subarray_offset.py', 'python', INTROSORT_OFFSET_CODE)}
      </div>
    </div>
  `;
}

function renderSlide12() {
  return `
    <div class="grid-2">
      <div class="glass-panel card-pad">
        <span class="badge-pill badge-violet">Chứng minh chặn trên Thời gian Θ(n log n)</span>
        <div class="mt-2" style="display:flex; flex-direction:column; gap:8px;">
          <div class="glass-panel-sm" style="padding:9px 12px;">
            <strong>• Tốt nhất:</strong> <code class="mono" style="color:#6ee7b7">Θ(n log n)</code> — Phân hoạch chia đôi cân bằng ở mọi mức.
          </div>
          <div class="glass-panel-sm" style="padding:9px 12px;">
            <strong>• Trung bình:</strong> <code class="mono" style="color:#67e8f9">Θ(n log n)</code> — Khoảng <code>≈ 1.188 n log₂(n)</code> phép so sánh nhờ chốt Median-of-Three (thấp hơn <code>1.386 n log₂(n)</code> của Quicksort ngẫu nhiên).
          </div>
          <div class="glass-panel-sm" style="padding:10px 12px; border-color:rgba(139,92,246,0.45)">
            <strong>• Xấu nhất (Gặp chuỗi <em>Median-of-3 Killer</em>):</strong>
            <p class="text-sm text-muted mt-2">
              1. <strong>Giai đoạn Quicksort:</strong> Chạy tối đa <code>2⌊log₂ n⌋</code> mức ⇒ <code>O(n log n)</code>.<br/>
              2. <strong>Giai đoạn Heapsort:</strong> Xử lý các đoạn rời nhau <code>Σkᵢ ≤ n</code> ⇒ <code>Σ O(kᵢ log kᵢ) ≤ O(n log n)</code>.<br/>
              3. <strong>Giai đoạn Insertion Sort:</strong> Đoạn kích thước <code>≤ M</code> (M=16) ⇒ <code>O((n/M)·M²) = O(n)</code>.<br/>
              <strong style="color:#c4b5fd">⇒ Tổng thời gian luôn bị khóa chặt ở Θ(n log n).</strong>
            </p>
          </div>
        </div>
      </div>

      <div class="glass-panel card-pad">
        <span class="badge-pill badge-cyan">Độ phức tạp Không gian (Space Complexity)</span>
        <div class="mt-2" style="display:flex; flex-direction:column; gap:10px;">
          <div class="glass-panel-sm" style="padding:10px 12px;">
            <strong style="color:#6ee7b7">1. Thao tác sắp xếp tại chỗ: Θ(1)</strong>
            <p class="text-sm text-muted mt-2">
              <code>partition_median_of_three</code>, <code>heapsort_subarray</code> và <code>insertion_sort</code> chỉ dùng vài biến chỉ số cục bộ. Không dùng list slicing hay mảng phụ.
            </p>
          </div>
          <div class="glass-panel-sm" style="padding:10px 12px; border-color:rgba(34,211,238,0.45)">
            <strong style="color:#67e8f9">2. Ngăn xếp đệ quy (Call Stack): Θ(log n)</strong>
            <p class="text-sm text-muted mt-2">
              Khóa cứng tối đa <code>2⌊log₂ n⌋ + 1</code> khung hàm trên Call Stack ⇒ <strong>Θ(log n)</strong>, chống tràn Stack <code>O(n)</code> tuyệt đối so với Quicksort truyền thống.
            </p>
          </div>
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
    <div class="grid-2" style="min-height:0; flex:1;">
      <div class="flex" style="flex-direction:column; gap:10px;">
        <div class="glass-panel card-pad">
          <span class="badge-pill badge-violet">1. Sàn Thương mại điện tử</span>
          <p class="card-text mt-2">
            Sắp xếp hàng triệu sản phẩm theo <strong>"Giá từ thấp đến cao"</strong> với tốc độ phản hồi tức thì nhờ tính thân thiện CPU Cache của nhánh Quicksort.
          </p>
        </div>
        <div class="glass-panel card-pad">
          <span class="badge-pill badge-cyan">2. Phân tích Request Logs (P50, P90 Latency)</span>
          <p class="card-text mt-2">
            Sắp xếp độ trễ request; khắc phục tính không ổn định (<em>Unstable</em>) của Introsort bằng khóa tuple <code>(latency_ms, arrival_seq)</code>.
          </p>
        </div>
        ${renderCodeWindow('ecommerce_and_logs.py', 'python', ecomCode)}
      </div>

      <div class="flex" style="flex-direction:column; gap:10px; min-height:0; overflow:auto;">
        <div class="glass-panel card-pad">
          <span class="badge-pill badge-emerald">3. LeetCode 912 — Sort an Array</span>
          <p class="card-text mt-2">
            Vượt qua các test case khắc nghiệt chống Quicksort mẫu mực trong thời gian đảm bảo <code>O(n log n)</code> không dùng hàm sort có sẵn.
          </p>
        </div>
        ${renderCodeWindow('leetcode_912_introsort.py', 'python', LEETCODE_912_CODE)}
      </div>
    </div>
  `;
}

function renderSlide14() {
  return `
    <div class="grid-2">
      <div class="glass-panel card-pad">
        <span class="badge-pill badge-amber">Bài toán đặt ra</span>
        <div class="card-title mt-2">Sắp xếp tại chỗ O(1) RAM &amp; O(n log n) mọi trường hợp</div>
        <p class="card-text">
          Sắp xếp mảng <code>n</code> phần tử tăng dần ngay tại chỗ (<strong>In-place</strong>) với bộ nhớ phụ <strong>O(1) tuyệt đối</strong> và đảm bảo thời gian <strong>O(n log n)</strong> ngay cả trong trường hợp xấu nhất.
        </p>
        <div class="glass-panel-sm mt-3" style="padding:10px 12px;">
          <div class="text-xs text-muted">Ví dụ minh họa</div>
          <div class="mono mt-2" style="color:#fcd34d">Input : [4, 10, 3, 5, 1] → Output: [1, 3, 4, 5, 10]</div>
        </div>
      </div>

      <div class="glass-panel card-pad">
        <span class="badge-pill badge-amber">Ý tưởng cốt lõi</span>
        <div class="card-title mt-2">Cây nhị phân hoàn chỉnh (Binary Heap) trên mảng 1 chiều</div>
        <p class="card-text">
          <strong>Không dùng con trỏ!</strong> Biểu diễn cây trực tiếp trên mảng với nút cha tại chỉ số <code>i</code>:
        </p>
        <div class="grid-2 mt-2">
          <div class="glass-panel-sm" style="padding:8px 12px;">
            <span class="text-xs text-muted">Con trái</span>
            <div class="mono font-bold" style="color:#fb923c">left = 2*i + 1</div>
          </div>
          <div class="glass-panel-sm" style="padding:8px 12px;">
            <span class="text-xs text-muted">Con phải</span>
            <div class="mono font-bold" style="color:#fbbf24">right = 2*i + 2</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="glass-panel card-pad">
        <div class="card-title">Giai đoạn 1: Build Max-Heap (Tạo đống cực đại)</div>
        <p class="card-text">
          Biến mảng ban đầu thành Max-Heap: mọi nút cha <code>≥</code> nút con, đảm bảo phần tử lớn nhất nằm ở đỉnh gốc <code>arr[0]</code>.
        </p>
      </div>
      <div class="glass-panel card-pad">
        <div class="card-title">Giai đoạn 2: Extract &amp; Sift-down (Rút gốc &amp; Vun lại đống)</div>
        <p class="card-text">
          Hoán đổi <code>arr[0]</code> về cuối mảng (khóa vị trí đã xếp), giảm kích thước Heap đi 1, gọi <code>sift_down</code> (heapify) đưa phần tử lớn tiếp theo lên gốc.
        </p>
      </div>
    </div>
  `;
}

function renderSlide15() {
  const cur = HEAPSORT_SIM_STEPS[state.heapStep];
  const nodePos = [
    { x: 160, y: 34 },
    { x: 92, y: 102 },
    { x: 228, y: 102 },
    { x: 54, y: 170 },
  ];
  const edges = [
    [0, 1],
    [0, 2],
    [1, 3],
  ];

  return `
    <div class="glass-panel card-pad flex" style="flex-direction:column; gap:10px;">
      <div class="sim-toolbar">
        <div class="flex-row gap-2">
          <span class="badge-pill badge-amber">${cur.phase}</span>
          <strong class="text-sm">${cur.action}</strong>
        </div>
        <div class="flex-row gap-2">
          <button type="button" class="sim-btn" data-action="heap-prev" ${state.heapStep === 0 ? 'disabled' : ''}>${ICONS.skipBack} Quay lại</button>
          <button type="button" class="sim-btn primary" data-action="heap-next" ${state.heapStep === HEAPSORT_SIM_STEPS.length - 1 ? 'disabled' : ''}>Bước tiếp ${ICONS.skipForward}</button>
          <button type="button" class="sim-btn" data-action="heap-auto">${state.heapTimer ? `${ICONS.pause} Tạm dừng` : `${ICONS.play} Tự động`}</button>
          <button type="button" class="sim-btn" data-action="heap-reset">${ICONS.reset} Đặt lại</button>
        </div>
      </div>

      <div class="grid-2-weighted">
        <div class="glass-panel-sm card-pad">
          <div class="card-title">Sơ đồ Cây nhị phân (Binary Heap)</div>
          <svg viewBox="0 0 320 205" style="width:100%; max-height:190px;">
            ${edges
              .map(([p, c]) => {
                const locked = c >= cur.heapSize && cur.heapSize > 0;
                return `<line x1="${nodePos[p].x}" y1="${nodePos[p].y}" x2="${nodePos[c].x}" y2="${nodePos[c].y}" stroke="${locked ? 'rgba(16,185,129,0.35)' : 'rgba(251,146,60,0.55)'}" stroke-width="2.5" ${locked ? 'stroke-dasharray="4 4"' : ''} />`;
              })
              .join('')}
            ${cur.array
              .map((val, idx) => {
                const p = nodePos[idx];
                const locked = idx >= cur.heapSize || cur.heapSize === 0;
                const swap = cur.swapIndices.includes(idx);
                const fill = locked ? '#065f46' : swap ? '#b45309' : '#1e293b';
                const stroke = locked ? '#34d399' : swap ? '#fbbf24' : '#fb923c';
                return `
                  <g>
                    <circle cx="${p.x}" cy="${p.y}" r="22" fill="${fill}" stroke="${stroke}" stroke-width="2.5" />
                    <text x="${p.x}" y="${p.y + 5}" text-anchor="middle" fill="#f8fafc" font-weight="700" font-size="14">${val}</text>
                    <text x="${p.x}" y="${p.y + 34}" text-anchor="middle" fill="#94a3b8" font-size="10">arr[${idx}]</text>
                  </g>
                `;
              })
              .join('')}
          </svg>
        </div>

        <div class="glass-panel-sm card-pad flex" style="flex-direction:column; gap:10px;">
          <div class="card-title">Mảng 1 chiều (Heap | Đã xếp)</div>
          <div class="cells-row">
            ${cur.array
              .map((val, idx) => {
                const locked = idx >= cur.heapSize || cur.heapSize === 0;
                const swap = cur.swapIndices.includes(idx);
                return `
                  <div class="array-cell ${locked ? 'cell-done' : swap ? 'cell-amber' : ''}">
                    <span>${val}</span>
                    <span style="font-size:0.62rem; color:#94a3b8">[${idx}]</span>
                  </div>
                `;
              })
              .join('')}
          </div>
          <p class="card-text">${cur.note}</p>
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Giai đoạn</th>
            <th>Hành động chính</th>
            <th>Trạng thái mảng</th>
          </tr>
        </thead>
        <tbody>
          <tr class="${state.heapStep <= 1 ? 'row-highlight' : ''}" style="cursor:pointer" data-action="heap-jump" data-step="1">
            <td class="font-bold">Khởi tạo</td>
            <td>Build Max-Heap</td>
            <td class="mono">[10, 5, 3, 4]</td>
          </tr>
          <tr class="${state.heapStep === 2 || state.heapStep === 3 ? 'row-highlight' : ''}" style="cursor:pointer" data-action="heap-jump" data-step="3">
            <td class="font-bold">Vòng 1</td>
            <td>Đổi arr[0] ↔ arr[3] &amp; Vun lại [4, 5, 3]</td>
            <td class="mono">[5, 4, 3 | 10]</td>
          </tr>
          <tr class="${state.heapStep === 4 ? 'row-highlight' : ''}" style="cursor:pointer" data-action="heap-jump" data-step="4">
            <td class="font-bold">Vòng 2</td>
            <td>Đổi arr[0] ↔ arr[2] &amp; Vun lại [3, 4]</td>
            <td class="mono">[4, 3 | 5, 10]</td>
          </tr>
          <tr class="${state.heapStep === 5 ? 'row-highlight' : ''}" style="cursor:pointer" data-action="heap-jump" data-step="5">
            <td class="font-bold">Vòng 3</td>
            <td>Đổi arr[0] ↔ arr[1] (Hoàn tất!)</td>
            <td class="mono" style="color:#6ee7b7">[3 | 4, 5, 10]</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderSlide16() {
  return `
    <div class="grid-2-weighted" style="min-height:0; flex:1;">
      <div style="min-height:0; overflow:auto;">
        ${renderCodeWindow('heapsort_iterative.py', 'python', HEAPSORT_PYTHON_CODE)}
      </div>

      <div class="flex" style="flex-direction:column; gap:12px;">
        <div class="glass-panel card-pad" style="border-color:rgba(245,158,11,0.45)">
          <span class="badge-pill badge-amber">Điểm nhấn kỹ thuật: while True</span>
          <div class="card-title mt-2">Khử đệ quy triệt tiêu Stack Overflow</div>
          <p class="card-text">
            Thay vì gọi đệ quy <code>sift_down</code> tốn khung hàm trên Call Stack, vòng lặp <code>while True</code>
            trượt trực tiếp từ nút cha <code>i</code> xuống con <code>largest</code>, giúp đạt chuẩn <strong>O(1) RAM phụ tuyệt đối</strong>.
          </p>
        </div>

        <div class="glass-panel card-pad">
          <div class="card-title">Cấu trúc 2 vòng lặp trong <code>heap_sort()</code></div>
          <p class="card-text">
            • <strong>Vòng 1 (Build Max-Heap):</strong> Duyệt ngược từ nút cha cuối cùng <code>n // 2 - 1</code> về <code>0</code> (các nút từ <code>n // 2</code> trở đi là lá, không cần vun).<br/>
            • <strong>Vòng 2 (Extract):</strong> Đổi đỉnh <code>arr[0]</code> với cuối vùng Heap <code>arr[i]</code> và gọi <code>sift_down(arr, i, 0)</code>.
          </p>
        </div>

        <div class="glass-panel card-pad">
          <span class="badge-pill badge-emerald">Kết quả Console</span>
          <pre class="mono mt-2" style="font-size:0.84rem; color:#fde68a; background:#070b14; padding:10px 12px; border-radius:10px; border:1px solid rgba(245,158,11,0.28);">heap_sort([4, 10, 3, 5, 1])
Output: [1, 3, 4, 5, 10]</pre>
        </div>
      </div>
    </div>
  `;
}

function renderSlide17() {
  return `
    <div class="glass-panel card-pad">
      <div class="card-title">Độ phức tạp Thời gian (Time Complexity)</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Thành phần / Trường hợp</th>
            <th>Độ phức tạp</th>
            <th>Phân tích chi tiết</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="font-bold">Build Max-Heap</td>
            <td class="mono font-bold" style="color:#6ee7b7">O(n)</td>
            <td>Nhờ chuỗi hội tụ chiều cao cây: một nửa số nút là lá có chiều cao 0.</td>
          </tr>
          <tr>
            <td class="font-bold">Rút gốc (Extract)</td>
            <td class="mono font-bold" style="color:#fcd34d">O(n log n)</td>
            <td>Lặp <code>n - 1</code> lần, mỗi lần <code>sift_down</code> tối đa hết chiều cao cây <code>O(log n)</code>.</td>
          </tr>
          <tr class="row-highlight">
            <td class="font-bold">Worst &amp; Average Case</td>
            <td class="mono font-bold" style="color:#fb923c">O(n log n)</td>
            <td>Xấu nhất khi phần tử nhỏ ở lá đưa lên đỉnh luôn phải trượt hết chiều cao <code>log₂ n</code>.</td>
          </tr>
          <tr>
            <td class="font-bold">Best Case</td>
            <td class="mono font-bold" style="color:#67e8f9">Θ(n log n) / Θ(n)*</td>
            <td><code>Θ(n log n)</code> với phần tử đôi một khác nhau; đạt <code>Θ(n)</code> khi <strong>mọi phần tử bằng nhau</strong> (VD: <code>[5, 5, 5, 5]</code>) vì <code>sift_down</code> thoát ngay ở <code>break</code> đầu tiên.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="glass-panel card-pad" style="border-color:rgba(245,158,11,0.45)">
      <span class="badge-pill badge-amber">Độ phức tạp Không gian: O(1) Tuyệt đối!</span>
      <div class="card-title mt-2">Nhà vô địch về tiết kiệm RAM</div>
      <p class="card-text">
        Sắp xếp hoàn toàn tại chỗ (<em>In-place</em>) trên mảng gốc, chỉ dùng vài biến chỉ số cục bộ (<code>i, left, right, largest</code>).
        Không tốn <code>O(n)</code> RAM như Merge Sort, cũng không tốn <code>O(log n)</code> hay <code>O(n)</code> Call Stack như QuickSort.
      </p>
    </div>
  `;
}

function renderSlide18() {
  return `
    <div class="grid-2" style="min-height:0; flex:1;">
      <div class="flex" style="flex-direction:column; gap:12px;">
        <div class="glass-panel card-pad" style="border-color:rgba(245,158,11,0.45)">
          <span class="badge-pill badge-amber">1. Nhân hệ điều hành Linux Kernel &amp; Hệ thống nhúng</span>
          <div class="card-title mt-2"><code>linux/lib/sort.c</code> sử dụng Heap Sort!</div>
          <p class="card-text">
            • <strong>Kernel Stack cực nhỏ:</strong> Chỉ vỏn vẹn <strong>8 KB – 16 KB</strong>.<br/>
            • <strong>An toàn tuyệt đối:</strong> Dùng đệ quy của QuickSort dễ gây tràn Stack làm sập hệ điều hành (<strong>Kernel Panic</strong>) hoặc bị tấn công DoS qua kịch bản <code>O(n²)</code>.<br/>
            • Heap Sort với <strong>O(1) RAM</strong> và cam kết <strong>O(n log n)</strong> là lựa chọn an toàn tuyệt đối.
          </p>
        </div>

        <div class="glass-panel card-pad">
          <span class="badge-pill badge-cyan">2. Hàng đợi ưu tiên (Priority Queue)</span>
          <div class="card-title mt-2">LeetCode 215 — Kth Largest Element in an Array</div>
          <p class="card-text">
            Duy trì một <strong>Min-Heap kích thước k</strong> để lọc ra <code>k</code> phần tử lớn nhất trong thời gian
            <strong>O(n log k)</strong> thay vì phải sort toàn bộ mảng <code>O(n log n)</code>.
          </p>
        </div>
      </div>

      <div style="min-height:0; overflow:auto;">
        ${renderCodeWindow('leetcode_215_kth_largest.py', 'python', LEETCODE_215_CODE)}
      </div>
    </div>
  `;
}

function renderSlide19() {
  return `
    <div class="glass-panel card-pad">
      <div class="card-title">Bảng Tổng hợp So sánh Toàn diện (5 Thuật toán)</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Thuật toán</th>
            <th>Tốt nhất</th>
            <th>Trung bình</th>
            <th>Xấu nhất</th>
            <th>Bộ nhớ phụ</th>
            <th>Ổn định (Stable)</th>
            <th>Ứng dụng tiêu biểu</th>
          </tr>
        </thead>
        <tbody>
          ${COMPARISON_ROWS.map(
            (r) => `
            <tr class="${r.theme !== 'neutral' ? 'row-highlight' : ''}">
              <td class="font-bold">${r.name}</td>
              <td class="mono">${r.best}</td>
              <td class="mono">${r.average}</td>
              <td class="mono">${r.worst}</td>
              <td class="mono">${r.space}</td>
              <td>${r.stable === 'Có' ? '<span style="color:#6ee7b7;font-weight:700">Có</span>' : 'Không'}</td>
              <td>${r.apps}</td>
            </tr>
          `
          ).join('')}
        </tbody>
      </table>
    </div>

    <div class="flip-grid">
      ${QA_FLASHCARDS.map((card) => {
        const isFlipped = !!state.flippedCards[card.id];
        return `
          <div class="flip-card ${isFlipped ? 'flipped' : ''}" data-action="flip-card" data-card="${card.id}" role="button" tabindex="0">
            <div class="flip-card-inner">
              <div class="flip-face flip-front">
                <div>
                  <span class="badge-pill badge-violet">${card.tag}</span>
                  <p class="card-title mt-2" style="font-size:0.95rem; line-height:1.4;">${card.question}</p>
                </div>
                <div class="flex-row gap-2 text-xs text-muted">${ICONS.flip} Bấm vào thẻ để lật mở đáp án</div>
              </div>
              <div class="flip-face flip-back">
                <div>
                  <span class="badge-pill badge-emerald">Đáp án ăn điểm tuyệt đối</span>
                  <p class="card-text mt-2" style="font-size:0.84rem;">${card.answer}</p>
                </div>
                <div class="mono text-xs" style="color:#67e8f9">${card.formula}</div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderSlideBody(slide) {
  switch (slide.id) {
    case 1: return renderSlide1();
    case 2: return renderSlide2();
    case 3: return renderSlide3();
    case 4: return renderSlide4();
    case 5: return renderSlide5();
    case 6: return renderSlide6();
    case 7: return renderSlide7();
    case 8: return renderSlide8();
    case 9: return renderSlide9();
    case 10: return renderSlide10();
    case 11: return renderSlide11();
    case 12: return renderSlide12();
    case 13: return renderSlide13();
    case 14: return renderSlide14();
    case 15: return renderSlide15();
    case 16: return renderSlide16();
    case 17: return renderSlide17();
    case 18: return renderSlide18();
    case 19: return renderSlide19();
    default: return '';
  }
}

function stopAllTimers() {
  if (state.timsortTimer) {
    clearInterval(state.timsortTimer);
    state.timsortTimer = null;
  }
  if (state.introTimer) {
    clearInterval(state.introTimer);
    state.introTimer = null;
  }
  if (state.heapTimer) {
    clearInterval(state.heapTimer);
    state.heapTimer = null;
  }
}

function renderSlideHeaderHtml(slide, total) {
  if (slide.id === 1) return '';
  return `
    <header class="slide-header">
      <div>
        <span class="slide-kicker">Slide ${slide.id} / ${total} • ${slide.duration}</span>
        <h1 class="slide-title">${slide.title}</h1>
        <p class="slide-subtitle">${slide.subtitle}</p>
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
          <strong class="text-sm">Speaker Notes — Slide ${slide.id}</strong>
          <span class="badge-pill badge-cyan">${slide.duration}</span>
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
      <div class="ambient-orb orb-1" style="background: var(--accent);"></div>
      <div class="ambient-orb orb-2" style="background: var(--accent-2);"></div>
      <div class="grid-backdrop"></div>

      <header class="top-nav">
        <div class="brand-badge">
          <span class="brand-dot"></span>
          <span>DSA Production Sorting</span>
        </div>

        <nav id="chapter-nav" class="chapter-nav" aria-label="Chapters">
          ${CHAPTERS.map((ch) => {
            const rangeText = ch.range[0] === ch.range[1] ? ch.range[0] : `${ch.range[0]}-${ch.range[1]}`;
            return `
              <button type="button" class="chapter-btn" data-chapter="${ch.id}" data-action="jump-slide" data-slide="${ch.firstSlide - 1}">
                <span>${ch.label}</span>
                <span class="text-xs text-muted">(${rangeText})</span>
              </button>
            `;
          }).join('')}
        </nav>

        <div class="nav-actions">
          <span id="slide-counter" class="slide-counter">Slide 1 / ${total}</span>
          <button id="notes-toggle-btn" type="button" class="icon-btn" data-action="toggle-notes">
            ${ICONS.notes}
            <span>Speaker Notes (S)</span>
          </button>
          <button type="button" class="icon-btn" data-action="toggle-fullscreen" title="Toàn màn hình (F)">
            ${ICONS.fullscreen}
          </button>
        </div>
      </header>

      <main class="stage-wrapper">
        <section id="slide-canvas" class="slide-canvas">
          <div id="slide-header-slot"></div>
          <div id="slide-body-slot" class="slide-body"></div>
        </section>
      </main>

      <div id="speaker-drawer-slot"></div>

      <footer class="bottom-bar">
        <div class="progress-track">
          <div id="progress-fill" class="progress-fill" style="width:0%"></div>
        </div>
        <div class="text-xs text-muted">
          Điều hướng: ← / → / Space / PageUp / PageDown • Bật Speaker Notes: phím S
        </div>
        <div class="flex-row gap-2">
          <button id="prev-slide-btn" type="button" class="sim-btn" data-action="prev-slide">
            ${ICONS.chevronLeft} Trước
          </button>
          <button id="next-slide-btn" type="button" class="sim-btn primary" data-action="next-slide">
            Tiếp ${ICONS.chevronRight}
          </button>
        </div>
      </footer>
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
  const prevScroll = bodySlot.scrollTop;
  bodySlot.innerHTML = renderSlideBody(slide);
  bodySlot.scrollTop = prevScroll;
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
  if (counter) counter.textContent = `Slide ${state.slideIndex + 1} / ${total}`;

  const progressFill = document.getElementById('progress-fill');
  if (progressFill) progressFill.style.width = `${progress}%`;

  const prevBtn = document.getElementById('prev-slide-btn');
  if (prevBtn) prevBtn.disabled = state.slideIndex === 0;

  const nextBtn = document.getElementById('next-slide-btn');
  if (nextBtn) nextBtn.disabled = state.slideIndex === total - 1;

  const headerSlot = document.getElementById('slide-header-slot');
  if (headerSlot) headerSlot.innerHTML = renderSlideHeaderHtml(slide, total);

  const bodySlot = document.getElementById('slide-body-slot');
  if (bodySlot) {
    bodySlot.innerHTML = renderSlideBody(slide);
    bodySlot.scrollTop = 0;
  }

  const canvas = document.getElementById('slide-canvas');
  if (canvas && animate) {
    canvas.classList.remove('slide-entering');
    void canvas.offsetWidth;
    canvas.classList.add('slide-entering');
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
      stopAllTimers();
      state.timsortStep = Math.max(0, state.timsortStep - 1);
      renderSlideBodyOnly();
      break;
    case 'tim-next':
      stopAllTimers();
      state.timsortStep = Math.min(TIMSORT_SIM_STEPS.length - 1, state.timsortStep + 1);
      renderSlideBodyOnly();
      break;
    case 'tim-reset':
      stopAllTimers();
      state.timsortStep = 0;
      renderSlideBodyOnly();
      break;
    case 'tim-jump':
      stopAllTimers();
      state.timsortStep = Number(target.dataset.step);
      renderSlideBodyOnly();
      break;
    case 'tim-auto':
      if (state.timsortTimer) {
        stopAllTimers();
        renderSlideBodyOnly();
      } else {
        if (state.timsortStep >= TIMSORT_SIM_STEPS.length - 1) state.timsortStep = 0;
        state.timsortTimer = setInterval(() => {
          if (state.timsortStep >= TIMSORT_SIM_STEPS.length - 1) {
            stopAllTimers();
          } else {
            state.timsortStep += 1;
          }
          renderSlideBodyOnly();
        }, 1600);
        renderSlideBodyOnly();
      }
      break;
    case 'java-tab':
      state.javaTab = target.dataset.tab;
      renderSlideBodyOnly();
      break;
    case 'intro-tab':
      stopAllTimers();
      state.introTab = target.dataset.tab;
      state.introStep = 0;
      renderSlideBodyOnly();
      break;
    case 'intro-prev':
      stopAllTimers();
      state.introStep = Math.max(0, state.introStep - 1);
      renderSlideBodyOnly();
      break;
    case 'intro-next': {
      stopAllTimers();
      const maxStep = INTROSORT_SCENARIOS[state.introTab].steps.length - 1;
      state.introStep = Math.min(maxStep, state.introStep + 1);
      renderSlideBodyOnly();
      break;
    }
    case 'intro-jump':
      stopAllTimers();
      state.introStep = Number(target.dataset.step);
      renderSlideBodyOnly();
      break;
    case 'intro-auto': {
      const maxStep = INTROSORT_SCENARIOS[state.introTab].steps.length - 1;
      if (state.introTimer) {
        stopAllTimers();
        renderSlideBodyOnly();
      } else {
        if (state.introStep >= maxStep) state.introStep = 0;
        state.introTimer = setInterval(() => {
          if (state.introStep >= maxStep) {
            stopAllTimers();
          } else {
            state.introStep += 1;
          }
          renderSlideBodyOnly();
        }, 1600);
        renderSlideBodyOnly();
      }
      break;
    }
    case 'heap-prev':
      stopAllTimers();
      state.heapStep = Math.max(0, state.heapStep - 1);
      renderSlideBodyOnly();
      break;
    case 'heap-next':
      stopAllTimers();
      state.heapStep = Math.min(HEAPSORT_SIM_STEPS.length - 1, state.heapStep + 1);
      renderSlideBodyOnly();
      break;
    case 'heap-reset':
      stopAllTimers();
      state.heapStep = 0;
      renderSlideBodyOnly();
      break;
    case 'heap-jump':
      stopAllTimers();
      state.heapStep = Number(target.dataset.step);
      renderSlideBodyOnly();
      break;
    case 'heap-auto':
      if (state.heapTimer) {
        stopAllTimers();
        renderSlideBodyOnly();
      } else {
        if (state.heapStep >= HEAPSORT_SIM_STEPS.length - 1) state.heapStep = 0;
        state.heapTimer = setInterval(() => {
          if (state.heapStep >= HEAPSORT_SIM_STEPS.length - 1) {
            stopAllTimers();
          } else {
            state.heapStep += 1;
          }
          renderSlideBodyOnly();
        }, 1700);
        renderSlideBodyOnly();
      }
      break;
    case 'flip-card': {
      const id = target.dataset.card;
      state.flippedCards[id] = !state.flippedCards[id];
      const cardEl = target.closest('.flip-card');
      if (cardEl) {
        cardEl.classList.toggle('flipped', state.flippedCards[id]);
      } else {
        renderSlideBodyOnly();
      }
      break;
    }
    default:
      break;
  }
});

document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
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
renderSlideChange(false);
