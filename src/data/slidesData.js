export const CHAPTERS = [
  { id: 'intro', label: 'Mở đầu', range: [1, 2], firstSlide: 1, theme: 'hero' },
  { id: 'timsort', label: 'Timsort', range: [3, 7], firstSlide: 3, theme: 'timsort' },
  { id: 'introsort', label: 'Introsort', range: [8, 13], firstSlide: 8, theme: 'introsort' },
  { id: 'heapsort', label: 'Heap Sort', range: [14, 18], firstSlide: 14, theme: 'heapsort' },
  { id: 'summary', label: 'So sánh & Q&A', range: [19, 19], firstSlide: 19, theme: 'summary' },
];

export const TIMSORT_JAVA_TABS = [
  {
    id: 'full',
    label: 'Toàn bộ TimSortDemo.java',
    description: 'Mã nguồn đầy đủ biến thể Timsort rút gọn phục vụ học tập (Java 8+, MIN_RUN = 4).',
    code: `import java.util.Arrays;

public class TimSortDemo {
    private static final int MIN_RUN = 4; // Minrun cố định để minh họa sư phạm

    public static void timSort(int[] a) {
        int n = a.length;
        if (n < 2) return;
        int[] runStart = new int[n];
        int[] runEnd = new int[n];
        int runCount = 0, start = 0;

        // 1. Phát hiện run tăng dần và mở rộng đến MIN_RUN
        while (start < n) {
            int naturalEnd = start + 1;
            while (naturalEnd < n && a[naturalEnd - 1] <= a[naturalEnd]) {
                naturalEnd++;
            }
            int end = Math.min(n, Math.max(naturalEnd, start + MIN_RUN));
            insertionSort(a, start, end - 1);
            runStart[runCount] = start;
            runEnd[runCount] = end - 1;
            runCount++;
            start = end;
        }

        // 2. Gộp các run kề nhau theo từng lượt
        while (runCount > 1) {
            int nextCount = 0;
            for (int i = 0; i < runCount; i += 2) {
                if (i + 1 < runCount) {
                    int left = runStart[i], mid = runEnd[i], right = runEnd[i + 1];
                    merge(a, left, mid, right);
                    runStart[nextCount] = left;
                    runEnd[nextCount] = right;
                } else {
                    runStart[nextCount] = runStart[i];
                    runEnd[nextCount] = runEnd[i];
                }
                nextCount++;
            }
            runCount = nextCount;
        }
    }

    private static void insertionSort(int[] a, int left, int right) {
        for (int i = left + 1; i <= right; i++) {
            int key = a[i], j = i - 1;
            while (j >= left && a[j] > key) { // Dùng > thay vì >= để giữ tính ổn định (Stable)
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = key;
        }
    }

    private static void merge(int[] a, int left, int mid, int right) {
        int[] temp = new int[right - left + 1];
        int i = left, j = mid + 1, k = 0;
        while (i <= mid && j <= right) {
            temp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
        }
        while (i <= mid) temp[k++] = a[i++];
        while (j <= right) temp[k++] = a[j++];
        System.arraycopy(temp, 0, a, left, temp.length);
    }

    public static void main(String[] args) {
        int[] input = {3, 5, 7, 2, 4, 6, 9, 1, 8, 10};
        System.out.println("Input : " + Arrays.toString(input));
        timSort(input);
        System.out.println("Output: " + Arrays.toString(input));
    }
}`,
  },
  {
    id: 'timSort',
    label: '1. timSort()',
    description: 'Quét mảng tạo run tự nhiên, mở rộng đến MIN_RUN, lưu ranh giới [runStart, runEnd] và gộp theo từng lượt.',
    code: `public static void timSort(int[] a) {
    int n = a.length;
    if (n < 2) return;
    int[] runStart = new int[n];
    int[] runEnd = new int[n];
    int runCount = 0, start = 0;

    // 1. Phát hiện run tăng dần và mở rộng đến MIN_RUN
    while (start < n) {
        int naturalEnd = start + 1;
        while (naturalEnd < n && a[naturalEnd - 1] <= a[naturalEnd]) {
            naturalEnd++;
        }
        int end = Math.min(n, Math.max(naturalEnd, start + MIN_RUN));
        insertionSort(a, start, end - 1);
        runStart[runCount] = start;
        runEnd[runCount] = end - 1;
        runCount++;
        start = end;
    }

    // 2. Gộp các run kề nhau theo từng lượt
    while (runCount > 1) {
        int nextCount = 0;
        for (int i = 0; i < runCount; i += 2) {
            if (i + 1 < runCount) {
                int left = runStart[i], mid = runEnd[i], right = runEnd[i + 1];
                merge(a, left, mid, right);
                runStart[nextCount] = left;
                runEnd[nextCount] = right;
            } else {
                runStart[nextCount] = runStart[i];
                runEnd[nextCount] = runEnd[i];
            }
            nextCount++;
        }
        runCount = nextCount;
    }
}`,
  },
  {
    id: 'insertionSort',
    label: '2. insertionSort()',
    description: 'Sắp xếp đoạn đóng [left, right]. Điều kiện a[j] > key (không dùng >=) giúp giữ nguyên thứ tự các phần tử bằng khóa.',
    code: `// Insertion sort trên đoạn đóng [left, right].
private static void insertionSort(int[] a, int left, int right) {
    for (int i = left + 1; i <= right; i++) {
        int key = a[i];
        int j = i - 1;
        // Dùng > thay vì >= để không đổi thứ tự các khóa bằng nhau (Stable).
        while (j >= left && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
}`,
  },
  {
    id: 'merge',
    label: '3. merge()',
    description: 'Cấp phát mảng tạm temp kích thước right - left + 1, trộn ổn định (<=) hai đoạn [left..mid] và [mid+1..right] rồi chép lại mảng gốc.',
    code: `// Trộn hai đoạn đã sắp xếp: [left, mid] và [mid + 1, right].
private static void merge(int[] a, int left, int mid, int right) {
    int[] temp = new int[right - left + 1];
    int i = left, j = mid + 1, k = 0;

    while (i <= mid && j <= right) {
        // <= đảm bảo phần tử bên trái được ưu tiên khi bằng khóa (Stable Sort)
        temp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
    }
    while (i <= mid) temp[k++] = a[i++];
    while (j <= right) temp[k++] = a[j++];

    System.arraycopy(temp, 0, a, left, temp.length);
}`,
  },
];

export const TIMSORT_SIM_STEPS = [
  {
    step: 0,
    title: 'Bước 0: Mảng đầu vào (Input)',
    badge: 'Khởi tạo',
    description: 'Mảng 10 phần tử A = [3, 5, 7, 2, 4, 6, 9, 1, 8, 10] với tham số sư phạm minrun = 4.',
    groups: [
      { label: 'Mảng A[0..9]', items: [3, 5, 7, 2, 4, 6, 9, 1, 8, 10], tone: 'neutral' },
    ],
    highlightText: 'Dãy có sẵn một số đoạn tăng cục bộ nhưng bị ngắt tại các vị trí giảm (7 -> 2, 9 -> 1).',
  },
  {
    step: 1,
    title: 'Bước 1: Phát hiện các Run tự nhiên (Natural Runs)',
    badge: 'Quét tuyến tính',
    description: 'Quét từ trái sang phải tìm các đoạn liên tiếp đã tăng dần tự nhiên.',
    groups: [
      { label: 'Run tự nhiên 1 (len = 3 < 4)', items: [3, 5, 7], tone: 'warn' },
      { label: 'Run tự nhiên 2 (len = 4)', items: [2, 4, 6, 9], tone: 'emerald' },
      { label: 'Run tự nhiên 3 (len = 3 < 4)', items: [1, 8, 10], tone: 'cyan' },
    ],
    highlightText: 'Run 1 = [3, 5, 7] có độ dài 3 < minrun (4) nên cần mở rộng thêm phần tử kế tiếp.',
  },
  {
    step: 2,
    title: 'Bước 2: Mở rộng Run ngắn (minrun = 4) & Insertion Sort',
    badge: 'Hoàn thiện Run',
    description: 'Kéo dài run ngắn đến minrun = 4 rồi sắp xếp từng đoạn bằng Insertion Sort.',
    groups: [
      { label: 'Run 1 (0..3): [3,5,7,2] → Sorted', items: [2, 3, 5, 7], tone: 'emerald' },
      { label: 'Run 2 (4..7): [4,6,9,1] → Sorted', items: [1, 4, 6, 9], tone: 'cyan' },
      { label: 'Run 3 (8..9): Giữ nguyên', items: [8, 10], tone: 'teal' },
    ],
    highlightText: 'Trạng thái toàn mảng sau hoàn thiện run: [2, 3, 5, 7 | 1, 4, 6, 9 | 8, 10].',
  },
  {
    step: 3,
    title: 'Bước 3: Merge Run 1 + Run 2',
    badge: 'Gộp lượt 1',
    description: 'Trộn [2, 3, 5, 7] và [1, 4, 6, 9] bằng hai con trỏ -> chỉ so sánh đầu 2 đoạn đã sắp xếp.',
    groups: [
      { label: 'Run 1+2 đã trộn (0..7)', items: [1, 2, 3, 4, 5, 6, 7, 9], tone: 'emerald' },
      { label: 'Run 3 chờ gộp (8..9)', items: [8, 10], tone: 'teal' },
    ],
    highlightText: 'Lấy lần lượt 1, 2, 3, 4, 5, 6, 7, 9 -> Thu được [1, 2, 3, 4, 5, 6, 7, 9 | 8, 10].',
  },
  {
    step: 4,
    title: 'Bước 4: Merge lần cuối với Run 3 -> Hoàn tất',
    badge: 'Kết quả',
    description: 'Trộn [1, 2, 3, 4, 5, 6, 7, 9] với [8, 10]. Phần tử 8 được chèn trước 9, sau đó lấy 9 và 10.',
    groups: [
      { label: 'Output hoàn chỉnh A[0..9]', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], tone: 'done' },
    ],
    highlightText: 'Kết quả: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] — Bảo toàn thứ tự ổn định (Stable Sort).',
  },
];

export const INTROSORT_SCENARIOS = {
  standard: {
    id: 'standard',
    label: 'Tab 1: Trường hợp chuẩn (threshold=3, depth=6)',
    subtitle: 'Minh họa 7 bước trên A = [19, 7, 15, 12, 16, 18, 4, 11, 13] với n = 9, size_threshold = 3, depth_limit = 6.',
    steps: [
      {
        step: 1,
        range: '[0..8] (9)',
        depth: 6,
        algo: 'Quicksort',
        tone: 'quicksort',
        action: 'Trung vị (19, 16, 13) -> Pivot = 16 định vị tại p = 6. Đệ quy phải [7..8], lặp trái [0..5].',
        segments: [
          { values: [13, 7, 15, 12, 4, 11], role: 'active', label: 'Nửa trái [0..5]' },
          { values: [16], role: 'pivot', label: 'Pivot p=6' },
          { values: [19, 18], role: 'sub', label: 'Nửa phải [7..8]' },
        ],
      },
      {
        step: 2,
        range: '[7..8] (2)',
        depth: 5,
        algo: 'Insertion Sort',
        tone: 'insertion',
        action: 'Đệ quy nửa phải [7..8]: Size = 2 <= 3 -> Chạy Insertion Sort đổi (19, 18) thành (18, 19).',
        segments: [
          { values: [13, 7, 15, 12, 4, 11], role: 'sub', label: 'Chờ [0..5]' },
          { values: [16], role: 'pivot', label: 'p=6' },
          { values: [18, 19], role: 'insertion', label: 'Sorted [7..8]' },
        ],
      },
      {
        step: 3,
        range: '[0..5] (6)',
        depth: 5,
        algo: 'Quicksort',
        tone: 'quicksort',
        action: 'Lặp trái high=5: Trung vị (13, 15, 11) -> Pivot = 13 về p = 4. Đệ quy [5..5], lặp [0..3].',
        segments: [
          { values: [11, 7, 12, 4], role: 'active', label: 'Nửa trái [0..3]' },
          { values: [13], role: 'pivot', label: 'Pivot p=4' },
          { values: [15], role: 'sub', label: '[5..5]' },
          { values: [16, 18, 19], role: 'done', label: 'Đã cố định' },
        ],
      },
      {
        step: 4,
        range: '[5..5] (1)',
        depth: 4,
        algo: 'Insertion Sort',
        tone: 'insertion',
        action: 'Đệ quy nửa phải [5..5]: Size = 1 <= 3 -> Giữ nguyên [15].',
        segments: [
          { values: [11, 7, 12, 4], role: 'sub', label: 'Chờ [0..3]' },
          { values: [13], role: 'pivot', label: 'p=4' },
          { values: [15], role: 'insertion', label: 'Sorted [5..5]' },
          { values: [16, 18, 19], role: 'done', label: 'Đã cố định' },
        ],
      },
      {
        step: 5,
        range: '[0..3] (4)',
        depth: 4,
        algo: 'Quicksort',
        tone: 'quicksort',
        action: 'Lặp trái high=3: Trung vị (11, 7, 4) -> Pivot = 7 về p = 1. Chia thành [2..3] và [0..0].',
        segments: [
          { values: [4], role: 'sub', label: '[0..0]' },
          { values: [7], role: 'pivot', label: 'Pivot p=1' },
          { values: [12, 11], role: 'active', label: '[2..3]' },
          { values: [13, 15, 16, 18, 19], role: 'done', label: 'Đã cố định' },
        ],
      },
      {
        step: 6,
        range: '[2..3] (2)',
        depth: 3,
        algo: 'Insertion Sort',
        tone: 'insertion',
        action: 'Đệ quy nửa phải [2..3]: Size = 2 <= 3 -> Đổi (12, 11) thành (11, 12).',
        segments: [
          { values: [4], role: 'sub', label: '[0..0]' },
          { values: [7], role: 'done', label: 'p=1' },
          { values: [11, 12], role: 'insertion', label: 'Sorted [2..3]' },
          { values: [13, 15, 16, 18, 19], role: 'done', label: 'Đã cố định' },
        ],
      },
      {
        step: 7,
        range: '[0..0] (1)',
        depth: 3,
        algo: 'Insertion Sort',
        tone: 'insertion',
        action: 'Lặp trái high=0: Size = 1 <= 3 -> Giữ nguyên [4]. Hoàn tất toàn mảng: 4 7 11 12 13 15 16 18 19.',
        segments: [
          { values: [4, 7, 11, 12, 13, 15, 16, 18, 19], role: 'done', label: 'Hoàn tất' },
        ],
      },
    ],
  },
  heapsortFallback: {
    id: 'heapsortFallback',
    label: 'Tab 2: Kịch bản kích hoạt Heapsort (threshold=2, depth=1)',
    subtitle: 'Đặt size_threshold = 2, depth_limit = 1 để quan sát đủ cả 3 thuật toán phối hợp trong 4 Frame.',
    steps: [
      {
        step: 1,
        range: '[0..8] (9)',
        depth: 1,
        algo: 'Frame 1 — Quicksort',
        tone: 'quicksort',
        action: 'Đoạn [0..8], Pivot = 16 về p = 6 (depth_limit giảm từ 1 xuống 0). Mảng: 13 7 15 12 4 11 | 16 | 19 18.',
        segments: [
          { values: [13, 7, 15, 12, 4, 11], role: 'active', label: 'Nửa trái [0..5] (depth=0)' },
          { values: [16], role: 'pivot', label: 'Pivot p=6' },
          { values: [19, 18], role: 'sub', label: 'Nửa phải [7..8]' },
        ],
      },
      {
        step: 2,
        range: '[7..8] (2)',
        depth: 0,
        algo: 'Frame 2 — Insertion Sort',
        tone: 'insertion',
        action: 'Đệ quy nửa phải [7..8] có size = 2 <= 2 -> Chèn trực tiếp hoán đổi 19 và 18 thành [18, 19].',
        segments: [
          { values: [13, 7, 15, 12, 4, 11], role: 'sub', label: 'Chờ [0..5]' },
          { values: [16], role: 'pivot', label: 'p=6' },
          { values: [18, 19], role: 'insertion', label: 'Insertion [7..8]' },
        ],
      },
      {
        step: 3,
        range: '[0..5] (6)',
        depth: 0,
        algo: 'Frame 3 — Heapsort (Max-Heap)',
        tone: 'heapsort',
        action: 'Nửa trái [0..5] chạm ngưỡng depth_limit == 0 -> Kích hoạt Heapsort tại chỗ! Build Max-Heap: 15 12 13 7 4 11 | 16 | 18 19.',
        segments: [
          { values: [15, 12, 13, 7, 4, 11], role: 'heapsort', label: 'Max-Heap [0..5]' },
          { values: [16, 18, 19], role: 'done', label: 'Đã cố định' },
        ],
      },
      {
        step: 4,
        range: '[0..5] (6)',
        depth: 0,
        algo: 'Frame 4 — Hoàn tất',
        tone: 'done',
        action: 'Trích xuất gốc Max-Heap lần lượt trên đoạn [0..5], thu được mảng tăng dần hoàn chỉnh: 4 7 11 12 13 15 16 18 19.',
        segments: [
          { values: [4, 7, 11, 12, 13, 15, 16, 18, 19], role: 'done', label: 'Output hoàn chỉnh' },
        ],
      },
    ],
  },
};

export const INTROSORT_PYTHON_CODE = `import math

def introsort(arr, size_threshold=16, max_depth=None, key=lambda x: x):
    n = len(arr)
    if n <= 1:
        return arr
    depth_limit = max_depth if max_depth is not None else 2 * int(math.log2(n))
    _introsort_util(arr, 0, n - 1, depth_limit, size_threshold, key)
    return arr

def _introsort_util(arr, low, high, depth_limit, size_threshold, key):
    while high - low + 1 > size_threshold:
        if depth_limit == 0:  # Chặn suy biến O(n^2)
            heapsort_subarray(arr, low, high, key)
            return
        depth_limit -= 1
        p = partition_median_of_three(arr, low, high, key)
        _introsort_util(arr, p + 1, high, depth_limit, size_threshold, key) # Đệ quy nửa phải
        high = p - 1  # Khử đệ quy đuôi nửa trái
    if low < high:
        insertion_sort(arr, low, high, key)`;

export const INTROSORT_OFFSET_CODE = `def _sift_down(arr, offset, heap_size, root_idx, key):
    while True:
        largest = root_idx
        left = 2 * root_idx + 1
        right = 2 * root_idx + 2

        # Cộng độ lệch offset (= low) để ánh xạ trực tiếp vào mảng gốc
        if left < heap_size and key(arr[offset + left]) > key(arr[offset + largest]):
            largest = left
        if right < heap_size and key(arr[offset + right]) > key(arr[offset + largest]):
            largest = right
        if largest == root_idx:
            break

        arr[offset + root_idx], arr[offset + largest] = (
            arr[offset + largest], arr[offset + root_idx]
        )
        root_idx = largest

def heapsort_subarray(arr, low, high, key):
    n = high - low + 1
    for i in range(n // 2 - 1, -1, -1):
        _sift_down(arr, low, n, i, key)
    for end in range(n - 1, 0, -1):
        arr[low], arr[low + end] = arr[low + end], arr[low]
        _sift_down(arr, low, end, 0, key)`;

export const HEAPSORT_SIM_STEPS = [
  {
    step: 0,
    phase: 'Trạng thái 1: Mảng ban đầu',
    action: 'Khởi tạo mảng arr = [4, 10, 3, 5]',
    array: [4, 10, 3, 5],
    heapSize: 4,
    activeIndices: [0, 1, 2, 3],
    swapIndices: [],
    note: 'Cây ban đầu: Gốc (4), con trái (10), con phải (3), con trái của 10 là (5). Chưa thỏa mãn Max-Heap vì 4 < 10.',
  },
  {
    step: 1,
    phase: 'Trạng thái 2: Sau Build Max-Heap',
    action: 'Vun từ nút cha cuối (idx=1 -> idx=0)',
    array: [10, 5, 3, 4],
    heapSize: 4,
    activeIndices: [0],
    swapIndices: [0, 1, 3],
    note: 'Nút cha 4 đổi chỗ cho 10, sau đó đổi tiếp với 5. Đỉnh gốc arr[0] = 10 là phần tử lớn nhất.',
  },
  {
    step: 2,
    phase: 'Vòng 1 (Bước 1/2): Rút gốc arr[0] <-> arr[3]',
    action: 'Hoán đổi 10 <-> 4 và khóa vị trí 3',
    array: [4, 5, 3, 10],
    heapSize: 3,
    activeIndices: [0, 1],
    swapIndices: [0, 3],
    note: 'Đưa 10 về cuối mảng [4, 5, 3 | 10]. Vùng Heap thu hẹp còn 3 phần tử; đỉnh 4 nhỏ hơn con 5.',
  },
  {
    step: 3,
    phase: 'Vòng 1 (Bước 2/2): Sift-down vùng [0..2]',
    action: 'Vun lại [4, 5, 3] đẩy 5 lên gốc',
    array: [5, 4, 3, 10],
    heapSize: 3,
    activeIndices: [0],
    swapIndices: [0, 1],
    note: 'Đổi 4 và 5 -> Thu được Max-Heap [5, 4, 3 | 10].',
  },
  {
    step: 4,
    phase: 'Vòng 2: Rút gốc arr[0] <-> arr[2] & Sift-down',
    action: 'Chốt 5 ở idx=2, vun [3, 4] -> [4, 3 | 5, 10]',
    array: [4, 3, 5, 10],
    heapSize: 2,
    activeIndices: [0],
    swapIndices: [0, 1],
    note: 'Đổi 5 <-> 3 tạo [3, 4 | 5, 10], sau đó vun lại 2 phần tử đầu đẩy 4 lên gốc -> [4, 3 | 5, 10].',
  },
  {
    step: 5,
    phase: 'Vòng 3: Rút gốc arr[0] <-> arr[1] -> Hoàn tất!',
    action: 'Chốt 4 ở idx=1 -> Cây chỉ còn 3',
    array: [3, 4, 5, 10],
    heapSize: 0,
    activeIndices: [],
    swapIndices: [0, 1],
    note: 'Đổi đỉnh 4 với 3 -> Thu được mảng tăng dần hoàn chỉnh [3, 4, 5, 10] với O(1) RAM phụ!',
  },
];

export const HEAPSORT_PYTHON_CODE = `def sift_down(arr, n, i):
    # Dùng vòng lặp while thay vì đệ quy -> Đạt chuẩn O(1) RAM, không bao giờ lỗi Stack Overflow!
    while True:
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2

        if left < n and arr[left] > arr[largest]:   largest = left
        if right < n and arr[right] > arr[largest]: largest = right

        if largest == i: break                # Đã thỏa mãn tính chất Max-Heap
        arr[i], arr[largest] = arr[largest], arr[i]
        i = largest                           # Đi xuống tầng con để kiểm tra tiếp

def heap_sort(arr):
    n = len(arr)
    # 1. Build Max-Heap (Chỉ cần duyệt từ nút cha cuối cùng: n//2 - 1 về 0)
    for i in range(n // 2 - 1, -1, -1):
        sift_down(arr, n, i)

    # 2. Rút từng phần tử lớn nhất ở gốc arr[0] đưa về cuối mảng
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]       # Đưa Max hiện tại về cuối
        sift_down(arr, i, 0)                  # Vun lại đống trên vùng mảng kích thước i
    return arr

print(heap_sort([4, 10, 3, 5, 1]))            # Output: [1, 3, 4, 5, 10]`;

export const LEETCODE_215_CODE = `import heapq

def findKthLargest(nums: list[int], k: int) -> int:
    # Duy trì Min-Heap đúng k phần tử lớn nhất, đỉnh Heap chính là phần tử lớn thứ k
    min_heap = nums[:k]
    heapq.heapify(min_heap)                   # Build Heap trong O(k)
    for num in nums[k:]:
        if num > min_heap[0]:
            heapq.heapreplace(min_heap, num)  # Thay đỉnh và sift_down trong O(log k)
    return min_heap[0]`;

export const LEETCODE_912_CODE = `class Solution:
    def sortArray(self, nums: list[int]) -> list[int]:
        def heap_sort(lo, hi):
            n = hi - lo + 1
            def sift(i, size):
                while 2 * i + 1 < size:
                    j = 2 * i + 1
                    if j + 1 < size and nums[lo + j] < nums[lo + j + 1]:
                        j += 1
                    if nums[lo + i] >= nums[lo + j]:
                        break
                    nums[lo + i], nums[lo + j] = nums[lo + j], nums[lo + i]
                    i = j
            for i in range(n // 2 - 1, -1, -1):
                sift(i, n)
            for end in range(n - 1, 0, -1):
                nums[lo], nums[lo + end] = nums[lo + end], nums[lo]
                sift(0, end)

        def intro(lo, hi, depth):
            if lo >= hi: return
            if hi - lo + 1 <= 16: # Insertion Sort
                for i in range(lo + 1, hi + 1):
                    x, j = nums[i], i - 1
                    while j >= lo and nums[j] > x:
                        nums[j + 1] = nums[j]
                        j -= 1
                    nums[j + 1] = x
                return
            if depth == 0:        # Heapsort fallback
                heap_sort(lo, hi)
                return
            pivot, p = nums[hi], lo
            for j in range(lo, hi):
                if nums[j] < pivot:
                    nums[p], nums[j] = nums[j], nums[p]
                    p += 1
            nums[p], nums[hi] = nums[hi], nums[p]
            intro(lo, p - 1, depth - 1)
            intro(p + 1, hi, depth - 1)

        n = len(nums)
        depth = 2 * (n.bit_length() - 1) if n else 0
        intro(0, n - 1, depth)
        return nums`;

export const COMPARISON_ROWS = [
  {
    name: 'Timsort',
    theme: 'timsort',
    best: 'Θ(n)',
    average: 'Θ(n log n)',
    worst: 'Θ(n log n)',
    space: 'O(n)',
    stable: 'Có',
    apps: 'Python, Java Objects, V8 JS, Android',
  },
  {
    name: 'Introsort',
    theme: 'introsort',
    best: 'Θ(n log n)',
    average: 'Θ(n log n)',
    worst: 'Θ(n log n)',
    space: 'Θ(log n)',
    stable: 'Không',
    apps: 'C++ std::sort, .NET, Go',
  },
  {
    name: 'Heap Sort',
    theme: 'heapsort',
    best: 'Θ(n log n) / Θ(n)*',
    average: 'Θ(n log n)',
    worst: 'Θ(n log n)',
    space: 'O(1)',
    stable: 'Không',
    apps: 'Linux Kernel (lib/sort.c), Embedded',
  },
  {
    name: 'Quick Sort',
    theme: 'neutral',
    best: 'Θ(n log n)',
    average: 'Θ(n log n)',
    worst: 'Θ(n²)',
    space: 'Θ(log n)..O(n)',
    stable: 'Không',
    apps: 'Sắp xếp mảng nguyên thủy trong RAM',
  },
  {
    name: 'Merge Sort',
    theme: 'neutral',
    best: 'Θ(n log n)',
    average: 'Θ(n log n)',
    worst: 'Θ(n log n)',
    space: 'O(n)',
    stable: 'Có',
    apps: 'Sắp xếp ngoại (External Sort), Linked List',
  },
];

export const QA_FLASHCARDS = [
  {
    id: 'qa1',
    tag: 'Câu hỏi Giảng viên #1 • Toán học Build Heap',
    question:
      'Tại sao bước Build Max-Heap có vòng lặp n/2 lần, bên trong gọi sift_down tốn O(log n), nhưng tổng độ phức tạp lại là O(n) chứ không phải O(n log n)?',
    answer:
      'Vì hầu hết các nút nằm ở tầng đáy! Một nửa số nút (n/2) là lá nên trượt 0 bước, n/4 nút tầng sát đáy trượt tối đa 1 bước, n/8 nút trượt tối đa 2 bước... Tổng số bước là chuỗi hội tụ ∑ (n / 2^(h+1)) · h ≤ n, nên độ phức tạp chính xác là O(n).',
    formula: '∑_{h=0}^{⌊log₂n⌋} (n / 2^{h+1}) · h ≤ n  ⇒  O(n)',
  },
  {
    id: 'qa2',
    tag: 'Câu hỏi Giảng viên #2 • Kiến trúc Phần cứng & Cache',
    question:
      'Nếu Heap Sort vừa O(n log n) mọi trường hợp, vừa tốn O(1) RAM, tại sao trên RAM thông thường người ta vẫn thích dùng QuickSort / Introsort hơn?',
    answer:
      'Do CPU Cache Miss (Trượt bộ nhớ đệm). QuickSort duyệt các phần tử liền kề trong RAM nên tận dụng tối đa L1/L2 Cache (Spatial Locality). Ngược lại, Heap Sort liên tục nhảy từ vị trí i đến 2i + 1 cách xa nhau khi mảng lớn, gây Cache Miss liên tục nên thực tế chậm hơn QuickSort 1.5–3 lần.',
    formula: 'QuickSort: Tuần tự [i, i+1] (Cache Hit)  vs  HeapSort: Nhảy xa [i → 2i+1] (Cache Miss)',
  },
];

export const SLIDES_DATA = [
  {
    id: 1,
    chapter: 'intro',
    theme: 'hero',
    title: 'KHOẢNG CÁCH GIỮA SÁCH GIÁO KHOA VÀ HỆ THỐNG THỰC TẾ',
    subtitle: 'Phân tích, Mô phỏng & Ứng dụng của Timsort, Introsort và Heap Sort',
    duration: '0.5 phút',
    speakerNotes:
      'Chào thầy/cô và các bạn. Hôm nay nhóm chúng tôi trình bày đề tài "Khoảng cách giữa sách giáo khoa và hệ thống thực tế" thông qua ba thuật toán sắp xếp trụ cột trong môi trường Production: Timsort (Python, Java Objects, V8 JS), Introsort (C++ std::sort, .NET, Go) và Heap Sort (Linux Kernel, Hệ thống nhúng).',
  },
  {
    id: 2,
    chapter: 'intro',
    theme: 'hero',
    title: 'Mở bài — Tại sao các thuật toán sách giáo khoa chưa đủ?',
    subtitle: 'Những góc khuất khi đưa Bubble, Merge và Quick Sort vào Production',
    duration: '1.0 phút',
    speakerNotes:
      'Sắp xếp dữ liệu là bài toán kinh điển. Các thuật toán cơ bản như Bubble, Selection hay Insertion Sort đạt O(n²). Lên mức cao hơn, Merge Sort và Quick Sort tạo bước ngoặt với O(n log n). Tuy nhiên, trong môi trường thực tế: Quick Sort có nguy cơ suy thoái về O(n²) hoặc tràn Stack O(n); Merge Sort ổn định nhưng tốn O(n) RAM phụ; còn dữ liệu đời thực hiếm khi ngẫu nhiên hoàn toàn mà chứa nhiều đoạn đã có thứ tự cục bộ (natural runs). Đó là lý do các thuật toán lai như Timsort, Introsort và chốt chặn Heap Sort ra đời.',
  },
  {
    id: 3,
    chapter: 'timsort',
    theme: 'timsort',
    title: 'Timsort — Bài toán & Ý tưởng cốt lõi',
    subtitle: 'Thuật toán lai giữa Merge Sort và Insertion Sort (Tim Peters, 2002)',
    duration: '1.0 phút',
    speakerNotes:
      'Timsort do Tim Peters thiết kế năm 2002. Mục tiêu không chỉ nhanh trên dữ liệu ngẫu nhiên mà còn tận dụng cấu trúc có sẵn và giữ tính ổn định (Stable Sort) — tức các phần tử có khóa bằng nhau (như bản ghi cùng điểm hoặc cùng ngày) giữ nguyên thứ tự tương đối ban đầu. Timsort vận hành dựa trên 4 cơ chế: (1) Phát hiện Natural Runs; (2) Mở rộng run ngắn hơn minrun (32–64 ngoài thực tế, đặt bằng 4 trong bản học tập) bằng Binary Insertion Sort; (3) Duy trì Merge Stack cân bằng kích thước; và (4) Chế độ Galloping nhảy bước khi một run thắng liên tiếp.',
  },
  {
    id: 4,
    chapter: 'timsort',
    theme: 'timsort',
    title: 'Timsort — Minh họa bằng tay & Mô phỏng tương tác',
    subtitle: 'Trace từng bước mảng A = [3, 5, 7, 2, 4, 6, 9, 1, 8, 10] với minrun = 4',
    duration: '1.5 phút',
    speakerNotes:
      'Hãy bấm nút "Bước tiếp" để quan sát mảng 10 phần tử A = [3, 5, 7, 2, 4, 6, 9, 1, 8, 10] với minrun = 4. Bước 1: Quét phát hiện run tự nhiên [3, 5, 7], [2, 4, 6, 9], [1, 8, 10]. Vì [3, 5, 7] dài 3 < 4, ta kéo phần tử 2 vào thành Run 1 (0..3) = [3, 5, 7, 2] rồi chạy Insertion Sort được [2, 3, 5, 7]. Tương tự Run 2 (4..7) = [4, 6, 9, 1] -> [1, 4, 6, 9]; Run 3 (8..9) = [8, 10]. Tiếp theo gộp Run 1 + Run 2 bằng hai con trỏ được [1, 2, 3, 4, 5, 6, 7, 9], rồi gộp lần cuối với [8, 10] thu được mảng hoàn chỉnh [1..10]. Có thể hỏi người nghe dự đoán phần tử kế tiếp khi merge để tăng tương tác.',
  },
  {
    id: 5,
    chapter: 'timsort',
    theme: 'timsort',
    title: 'Timsort — Cài đặt bằng Java (Java Implementation)',
    subtitle: 'Biến thể TimSortDemo rút gọn gồm timSort(), insertionSort() và merge()',
    duration: '1.0 phút',
    speakerNotes:
      'Đây là mã nguồn Java 8+ cài đặt 3 phương thức cốt lõi: timSort() quét run và gộp theo cặp từng lượt; insertionSort() sắp xếp đoạn đóng [left, right] sử dụng điều kiện a[j] > key (thay vì >=) để bảo toàn tính ổn định; và merge() dùng mảng phụ temp với điều kiện a[i] <= a[j] nhằm ưu tiên phần tử run trái khi bằng khóa. Lưu ý đây là mô hình giảng dạy (minrun = 4), bản sản xuất trong OpenJDK có thêm đảo run giảm dần, merge stack invariant và galloping mode.',
  },
  {
    id: 6,
    chapter: 'timsort',
    theme: 'timsort',
    title: 'Timsort — Độ phức tạp Thời gian & Không gian',
    subtitle: 'Đánh đổi O(n) RAM phụ để lấy Stability và tốc độ O(n) trên dữ liệu gần sắp xếp',
    duration: '1.0 phút',
    speakerNotes:
      'Về thời gian: Best Case đạt O(n) khi mảng đã tăng dần sẵn (chỉ quét 1 lượt phát hiện 1 run duy nhất, không merge). Average Case và Worst Case đều khóa chặt ở O(n log n) nhờ cơ chế quản lý kích thước run. Về không gian: Tốn O(n) bộ nhớ phụ cho vùng đệm tạm khi merge và run stack. Trong Java, mảng kiểu nguyên thủy dùng Dual-Pivot Quicksort để tiết kiệm RAM, còn mảng đối tượng (Object[]) dùng Timsort vì tính ổn định là tối quan trọng.',
  },
  {
    id: 7,
    chapter: 'timsort',
    theme: 'timsort',
    title: 'Timsort — Bài toán Ứng dụng Thực tế',
    subtitle: 'Ngôn ngữ lập trình hiện đại, Hệ thống Server Logs & LeetCode 88',
    duration: '1.0 phút',
    speakerNotes:
      'Timsort là mặc định trong Python (sort(), sorted()), Java (Arrays.sort(Object[]), Collections.sort()), Android và V8 JS Engine. Một bài toán thực tế điển hình là tổng hợp Server Logs từ nhiều máy chủ bị lệch nhẹ timestamp do độ trễ mạng: dữ liệu gồm nhiều run gần tăng dần, gọi logs.sort(Comparator.comparing(entry -> entry.timestamp)) vừa nhanh vừa giữ nguyên thứ tự các log trùng timestamp. Tư tưởng tận dụng run đã sắp xếp cũng liên hệ trực tiếp tới LeetCode 88 (Merge Sorted Array) dùng 2 con trỏ trong O(m + n).',
  },
  {
    id: 8,
    chapter: 'introsort',
    theme: 'introsort',
    title: 'Introsort — Mục tiêu cốt lõi & 3 Trụ cột',
    subtitle: 'Tác giả David R. Musser (1997) — Bảo vệ std::sort của C++ STL',
    duration: '1.0 phút',
    speakerNotes:
      'Chào thầy/cô và các bạn, tiếp theo là thuật toán Introsort (Introspective Sort) do David Musser tạo ra năm 1997 để bảo vệ std::sort của C++ STL. Mục tiêu của Introsort là vừa nhanh như Quicksort ở trung bình, vừa khóa chặt thời gian xấu nhất ở O(n log n). Tại sao cần kết hợp 3 thuật toán? Vì chỉ dùng Quicksort dễ suy biến O(n²) và tràn stack; chỉ dùng Heapsort bị Cache Miss chậm hơn 2–3 lần; không có Insertion Sort sẽ lãng phí tới 75% số lời gọi hàm đệ quy ở các đoạn 1–2 phần tử.',
  },
  {
    id: 9,
    chapter: 'introsort',
    theme: 'introsort',
    title: 'Introsort — Nguyên lý điều phối & Lưu đồ hoạt động',
    subtitle: 'Lưu đồ hàm _introsort_util(low, high, depth_limit) với depth_limit = 2 * floor(log2(n))',
    duration: '1.5 phút',
    speakerNotes:
      'Lưu đồ thể hiện chính xác logic của _introsort_util: Ở gốc khởi tạo depth_limit = 2 * floor(log2(n)). Tại mỗi nhánh: Bước 1 kiểm tra đoạn nhỏ size <= 16 -> Đúng chạy Insertion Sort (Khối Xanh lá) và return. Bước 2 kiểm tra ngân sách độ sâu depth_limit == 0 -> Đúng kích hoạt Heapsort tại chỗ cho đoạn [low..high] (Khối Tím) và return. Bước 3 nếu cả hai đều sai, chọn chốt Median-of-Three, đệ quy nửa phải [p+1..high] và khử đệ quy đuôi cho nửa trái [low..p-1] với depth_limit - 1.',
  },
  {
    id: 10,
    chapter: 'introsort',
    theme: 'introsort',
    title: 'Introsort — Minh họa bằng tay & Trace 2 kịch bản',
    subtitle: 'Interactive 2-Tab Trace trên A = [19, 7, 15, 12, 16, 18, 4, 11, 13] (n = 9)',
    duration: '1.5 phút',
    speakerNotes:
      'Ở Slide này có 2 Tab tương tác. Tab 1 minh họa Trường hợp chuẩn (size_threshold = 3, depth_limit = 6): Bước 1 chọn chốt Median-of-Three (19, 16, 13) -> Pivot = 16 về p=6; Bước 2 đệ quy phải [7..8] dùng Insertion Sort; Bước 3-5 phân hoạch nửa trái với Pivot = 13 và 7; Bước 6-7 hoàn tất các đoạn <= 3. Tab 2 chủ động đặt size_threshold = 2 và depth_limit = 1 để kích hoạt nhánh Heapsort ngay trên đoạn con [0..5] khi chạm depth_limit == 0, quan sát đủ 4 màu tách biệt của Quicksort, Insertion Sort và Heapsort.',
  },
  {
    id: 11,
    chapter: 'introsort',
    theme: 'introsort',
    title: 'Introsort — Cài đặt Python & Kỹ thuật Offset Heapsort',
    subtitle: 'Khử đệ quy đuôi và ánh xạ chỉ số offset = low giúp bảo toàn O(1) RAM phụ',
    duration: '1.5 phút',
    speakerNotes:
      'Hàm _introsort_util bên trái thể hiện rõ 3 nhánh rẽ cùng kỹ thuật khử đệ quy đuôi (high = p - 1) cho nửa trái. Điểm kỹ thuật đắt giá nằm ở cột phải: để vun đống trên đoạn con [low..high] mà tuyệt đối không dùng list slicing (arr[a:b]) vốn tốn O(n) bộ nhớ, ta đặt offset = low. Nút cha là low + i, con trái low + 2*i + 1, con phải low + 2*i + 2, đảm bảo thao tác hoán đổi tốn đúng O(1) bộ nhớ phụ.',
  },
  {
    id: 12,
    chapter: 'introsort',
    theme: 'introsort',
    title: 'Introsort — Chứng minh Độ phức tạp Thời gian & Không gian',
    subtitle: 'Khóa chặt cận trên Θ(n log n) trước Median-of-3 Killer & Call Stack Θ(log n)',
    duration: '1.5 phút',
    speakerNotes:
      'Ngay cả khi gặp chuỗi khắc tinh Median-of-3 Killer: (1) Giai đoạn Quicksort chạy tối đa 2*floor(log2(n)) mức nên tốn <= O(n log n); (2) Giai đoạn Heapsort xử lý các đoạn rời nhau có tổng kích thước <= n nên tổng thời gian <= O(n log n); (3) Giai đoạn Insertion Sort trên các đoạn <= 16 tốn O(n). Cộng lại tổng thời gian luôn khóa chặt ở Θ(n log n)! Về không gian: biến cục bộ là Θ(1), ngăn xếp đệ quy khóa cứng tối đa 2*floor(log2(n)) + 1 khung hàm => Θ(log n), chống tràn Stack tuyệt đối.',
  },
  {
    id: 13,
    chapter: 'introsort',
    theme: 'introsort',
    title: 'Introsort — Bài toán Ứng dụng Thực tế & LeetCode 912',
    subtitle: 'Sàn Thương mại điện tử, Phân tích Request Logs (P50/P90) & Anti-Quicksort Test Cases',
    duration: '1.5 phút',
    speakerNotes:
      'Introsort tỏa sáng khi sắp xếp hàng triệu sản phẩm theo "Giá từ thấp đến cao" trên sàn TMĐT với tốc độ phản hồi tức thì. Trong phân tích Request Logs (tìm P50, P90 latency), vì Introsort không ổn định (Unstable), kỹ sư xử lý bằng cách đóng gói khóa tuple (latency_ms, arrival_seq) để giữ thứ tự đến trước. Ngoài ra, trên LeetCode 912 (Sort an Array), Introsort vượt qua toàn bộ test case anti-Quicksort khắc nghiệt trong thời gian O(n log n).',
  },
  {
    id: 14,
    chapter: 'heapsort',
    theme: 'heapsort',
    title: 'Heap Sort — Bài toán & Ý tưởng cốt lõi (Binary Heap)',
    subtitle: 'Sắp xếp tại chỗ chuẩn O(1) RAM tuyệt đối & O(n log n) mọi trường hợp',
    duration: '1.0 phút (Phút 1)',
    speakerNotes:
      'Tiếp theo, mình xin trình bày về Heap Sort (Sắp xếp vun đống). Bài toán đặt ra là sắp xếp mảng n phần tử tăng dần với một ràng buộc khắc nghiệt hơn Merge Sort và QuickSort: phải sắp xếp ngay tại chỗ (In-place) với bộ nhớ phụ O(1) mà vẫn đảm bảo thời gian O(n log n) ngay cả trong trường hợp xấu nhất. Ý tưởng cốt lõi của Heap Sort là nhìn mảng 1 chiều dưới góc độ một Cây nhị phân hoàn chỉnh (Binary Heap) thông qua công thức chỉ số: nút cha ở vị trí i sẽ có con trái là 2i + 1 và con phải là 2i + 2. Thuật toán gồm 2 bước: Bước 1 là Build Max-Heap để đẩy phần tử lớn nhất lên đỉnh gốc arr[0]. Bước 2 là liên tục hoán đổi đỉnh gốc này về cuối mảng, khóa nó lại, rồi vun lại phần cây còn lại để tìm phần tử lớn tiếp theo.',
  },
  {
    id: 15,
    chapter: 'heapsort',
    theme: 'heapsort',
    title: 'Heap Sort — Minh họa bằng tay & Cây Nhị Phân',
    subtitle: 'Trực quan hóa song song Sơ đồ Cây nhị phân + Mảng 1 chiều cho arr = [4, 10, 3, 5]',
    duration: '1.1 phút (Phút 2)',
    speakerNotes:
      'Hãy cùng trace tay trên mảng 4 phần tử [4, 10, 3, 5]. Ban đầu gốc là 4, con trái 10, con phải 3, con của 10 là 5. Sau bước Build Max-Heap, số 10 được đẩy lên làm gốc, số 5 đẩy lên kế tiếp, thu được Max-Heap [10, 5, 3, 4]. Vòng 1: Đổi gốc 10 với phần tử cuối là 4, chốt 10 ở cuối mảng. Lúc này 4 ở trên đỉnh nhỏ hơn con là 5, vun đống đẩy 5 lên đỉnh được [5, 4, 3 | 10]. Vòng 2: Đổi đỉnh 5 với 3, chốt 5, vun lại 2 phần tử đầu để 4 lên đỉnh được [4, 3 | 5, 10]. Vòng 3: Đổi đỉnh 4 với 3, thu được mảng hoàn chỉnh [3, 4, 5, 10] mà không tốn bất kỳ mảng phụ nào!',
  },
  {
    id: 16,
    chapter: 'heapsort',
    theme: 'heapsort',
    title: 'Heap Sort — Cài đặt Python (Khử Đệ Quy Chuẩn O(1) RAM)',
    subtitle: 'Sử dụng vòng lặp while True trong sift_down để triệt tiêu nguy cơ Stack Overflow',
    duration: '1.0 phút (Phút 3)',
    speakerNotes:
      'Đây là mã nguồn cài đặt bằng Python. Điểm ăn tiền nhất trong đoạn code này nằm ở hàm sift_down (vun đống): thay vì gọi đệ quy như nhiều tài liệu cơ bản, nhóm sử dụng vòng lặp while True để trượt từ nút cha xuống nút con. Điều này giúp thuật toán đạt đúng chuẩn O(1) bộ nhớ phụ tuyệt đối và triệt tiêu hoàn toàn nguy cơ lỗi tràn bộ nhớ Stack Overflow. Trong hàm heap_sort, vòng for đầu tiên chạy ngược từ n // 2 - 1 về 0 để xây dựng Max-Heap (vì các nút từ n // 2 trở đi là nút lá). Vòng for thứ hai liên tục hoán đổi đỉnh arr[0] với arr[i] ở cuối mảng và gọi sift_down để khôi phục Max-Heap.',
  },
  {
    id: 17,
    chapter: 'heapsort',
    theme: 'heapsort',
    title: 'Heap Sort — Độ phức tạp Thời gian & Không gian',
    subtitle: 'Build Max-Heap O(n), Extract O(n log n), Không gian O(1) tuyệt đối',
    duration: '0.8 phút (Phút 4)',
    speakerNotes:
      'Về độ phức tạp thời gian: Bước Build Heap đầu tiên chỉ mất thời gian tuyến tính O(n), còn bước rút n phần tử mỗi lần tốn log n, nên tổng thời gian của cả Best, Average và Worst Case với dữ liệu phân biệt luôn là O(n log n). Tình huống tạo ra Worst Case (nhiều phép hoán đổi nhất) là khi mỗi lần ta đổi phần tử ở đáy lên đỉnh, nó luôn nhỏ hơn các con và phải trượt một mạch hết chiều cao log2(n) xuống tận lá. Ngược lại, Best Case đặc biệt đạt tới Ω(n) xảy ra khi toàn bộ phần tử trong mảng bằng nhau (như [5, 5, 5, 5]), vì hàm sift_down thoát ngay ở dòng break đầu tiên. Về không gian: chỉ dùng đúng O(1) bộ nhớ phụ.',
  },
  {
    id: 18,
    chapter: 'heapsort',
    theme: 'heapsort',
    title: 'Heap Sort — Ứng dụng Thực tế (Linux Kernel) & LeetCode 215',
    subtitle: 'Bảo vệ Kernel Stack 8–16 KB chống Kernel Panic & Priority Queue Top-K',
    duration: '1.0 phút (Phút 5)',
    speakerNotes:
      'Vậy tại sao Heap Sort lại sống khỏe trong các hệ thống lõi? Thứ nhất là trong Hệ thống nhúng và nhân Linux Kernel (file lib/sort.c): Kernel Stack chỉ vỏn vẹn 8 KB – 16 KB. Nếu dùng QuickSort đệ quy sâu hoặc dính kịch bản tấn công DoS O(n²) sẽ gây Kernel Panic ngay lập tức, nên Linux Kernel chọn biến thể Heap Sort nhờ O(1) RAM và cam kết O(n log n). Thứ hai là nền tảng cho Hàng đợi ưu tiên (Priority Queue) giải quyết bài toán Top-K như LeetCode 215 (Kth Largest Element): chỉ cần duy trì Min-Heap kích thước k để đạt thời gian O(n log k) thay vì sort cả mảng O(n log n).',
  },
  {
    id: 19,
    chapter: 'summary',
    theme: 'summary',
    title: 'Bảng Tổng hợp So sánh & Góc Q&A Chuyên sâu',
    subtitle: 'Đối chiếu 5 thuật toán cốt lõi & Flashcards giải đáp câu hỏi Giảng viên',
    duration: '1.5 phút',
    speakerNotes:
      'Tổng kết lại: Không có một thuật toán sắp xếp "vạn năng" cho mọi bối cảnh — Production lựa chọn dựa trên sự đánh đổi: cần Stable và khai thác dữ liệu gần sắp xếp trên Object Arrays thì chọn Timsort (Python, Java Objects, V8 JS); cần tốc độ RAM nhanh nhất nhưng vẫn an toàn cận trên O(n log n) thì chọn Introsort (C++ std::sort, .NET, Go); còn khi tài nguyên RAM và Stack bị siết chặt tuyệt đối như nhân Linux Kernel hay Hệ thống nhúng thì Heap Sort là chốt chặn an toàn duy nhất. Mời thầy/cô và các bạn bấm vào 2 Flashcards bên dưới để xem giải đáp chuyên sâu về toán học Build Heap O(n) và CPU Cache Miss.',
  },
];
