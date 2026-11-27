export const CHAPTERS = [
  { id: 'intro', label: 'Mở đầu', range: [1, 2], firstSlide: 1, theme: 'hero' },
  { id: 'timsort', label: 'Timsort', range: [3, 7], firstSlide: 3, theme: 'timsort' },
  { id: 'introsort', label: 'Introsort', range: [8, 13], firstSlide: 8, theme: 'introsort' },
  { id: 'heapsort', label: 'Heap Sort', range: [14, 18], firstSlide: 14, theme: 'heapsort' },
  { id: 'summary', label: 'Tổng hợp', range: [19, 19], firstSlide: 19, theme: 'summary' },
];

export const TIMSORT_PYTHON_TABS = [
  {
    id: 'full',
    label: 'Toàn bộ timsort_demo.py',
    description: 'Mã nguồn đầy đủ biến thể Timsort rút gọn phục vụ học tập (Python 3+, MIN_RUN = 4).',
    code: `MIN_RUN = 4  # Minrun cố định để minh họa sư phạm


def insertion_sort(arr: list[int], left: int, right: int) -> None:
    for i in range(left + 1, right + 1):
        key = arr[i]
        j = i - 1
        while j >= left and arr[j] > key:  # Dùng > thay vì >= để giữ tính ổn định (Stable)
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key


def merge(arr: list[int], left: int, mid: int, right: int) -> None:
    temp = []
    i, j = left, mid + 1
    while i <= mid and j <= right:
        if arr[i] <= arr[j]:  # <= ưu tiên phần tử nhánh trái khi bằng khóa (Stable)
            temp.append(arr[i])
            i += 1
        else:
            temp.append(arr[j])
            j += 1
    temp.extend(arr[i : mid + 1])
    temp.extend(arr[j : right + 1])
    arr[left : right + 1] = temp


def tim_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    if n < 2:
        return arr

    runs: list[tuple[int, int]] = []
    start = 0

    # 1. Phát hiện run tăng dần tự nhiên và mở rộng đến MIN_RUN
    while start < n:
        natural_end = start + 1
        while natural_end < n and arr[natural_end - 1] <= arr[natural_end]:
            natural_end += 1
        end = min(n, max(natural_end, start + MIN_RUN))
        insertion_sort(arr, start, end - 1)
        runs.append((start, end - 1))
        start = end

    # 2. Gộp các run kề nhau theo từng lượt
    while len(runs) > 1:
        next_runs: list[tuple[int, int]] = []
        for i in range(0, len(runs), 2):
            if i + 1 < len(runs):
                left, mid = runs[i]
                _, right = runs[i + 1]
                merge(arr, left, mid, right)
                next_runs.append((left, right))
            else:
                next_runs.append(runs[i])
        runs = next_runs
    return arr


if __name__ == "__main__":
    data = [3, 5, 7, 2, 4, 6, 9, 1, 8, 10]
    print("Input :", data)
    tim_sort(data)
    print("Output:", data)`,
  },
  {
    id: 'tim_sort',
    label: '1. tim_sort()',
    description: 'Quét mảng tạo run tự nhiên, mở rộng đến MIN_RUN, lưu ranh giới (start, end) vào danh sách runs và gộp theo từng lượt.',
    code: `def tim_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    if n < 2:
        return arr

    runs: list[tuple[int, int]] = []
    start = 0

    # 1. Phát hiện run tăng dần tự nhiên và mở rộng đến MIN_RUN
    while start < n:
        natural_end = start + 1
        while natural_end < n and arr[natural_end - 1] <= arr[natural_end]:
            natural_end += 1
        end = min(n, max(natural_end, start + MIN_RUN))
        insertion_sort(arr, start, end - 1)
        runs.append((start, end - 1))
        start = end

    # 2. Gộp các run kề nhau theo từng lượt
    while len(runs) > 1:
        next_runs: list[tuple[int, int]] = []
        for i in range(0, len(runs), 2):
            if i + 1 < len(runs):
                left, mid = runs[i]
                _, right = runs[i + 1]
                merge(arr, left, mid, right)
                next_runs.append((left, right))
            else:
                next_runs.append(runs[i])
        runs = next_runs
    return arr`,
  },
  {
    id: 'insertion_sort',
    label: '2. insertion_sort()',
    description: 'Sắp xếp đoạn đóng [left, right]. Điều kiện arr[j] > key (không dùng >=) giúp giữ nguyên thứ tự các phần tử bằng khóa.',
    code: `# Insertion sort trên đoạn đóng [left, right]
def insertion_sort(arr: list[int], left: int, right: int) -> None:
    for i in range(left + 1, right + 1):
        key = arr[i]
        j = i - 1
        # Dùng > thay vì >= để không đổi thứ tự các khóa bằng nhau (Stable)
        while j >= left and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
  },
  {
    id: 'merge',
    label: '3. merge()',
    description: 'Dùng danh sách đệm temp trộn ổn định (<=) hai đoạn [left..mid] và [mid+1..right] bằng 2 con trỏ rồi ghi lại vào mảng gốc.',
    code: `# Trộn hai đoạn đã sắp xếp: [left, mid] và [mid + 1, right]
def merge(arr: list[int], left: int, mid: int, right: int) -> None:
    temp = []
    i, j = left, mid + 1

    while i <= mid and j <= right:
        # <= đảm bảo phần tử nhánh trái được ưu tiên khi bằng khóa (Stable Sort)
        if arr[i] <= arr[j]:
            temp.append(arr[i])
            i += 1
        else:
            temp.append(arr[j])
            j += 1

    temp.extend(arr[i : mid + 1])
    temp.extend(arr[j : right + 1])
    arr[left : right + 1] = temp`,
  },
];

export const TIMSORT_JAVA_TABS = TIMSORT_PYTHON_TABS;

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
    mechanism: 'Lai: Merge + Insertion',
    best: 'Θ(n)',
    average: 'Θ(n log n)',
    worst: 'Θ(n log n)',
    space: 'O(n)',
    stable: 'Có',
    tradeoff: 'Tận dụng natural runs cực nhanh; cần O(n) RAM phụ',
    apps: 'Python, Java Objects, V8 JS, Android',
  },
  {
    name: 'Introsort',
    theme: 'introsort',
    mechanism: 'Lai: Quick + Heap + Insertion',
    best: 'Θ(n log n)',
    average: 'Θ(n log n)',
    worst: 'Θ(n log n)',
    space: 'Θ(log n)',
    stable: 'Không',
    tradeoff: 'Thân thiện CPU Cache, khóa O(n log n); không ổn định',
    apps: 'C++ std::sort, .NET, Go',
  },
  {
    name: 'Heap Sort',
    theme: 'heapsort',
    mechanism: 'Cây nhị phân (Max-Heap)',
    best: 'Θ(n log n) / Θ(n)*',
    average: 'Θ(n log n)',
    worst: 'Θ(n log n)',
    space: 'O(1)',
    stable: 'Không',
    tradeoff: 'O(1) RAM tuyệt đối, không dùng Stack; Cache Miss cao',
    apps: 'Linux Kernel (lib/sort.c), Embedded',
  },
  {
    name: 'Quick Sort',
    theme: 'neutral',
    mechanism: 'Chia để trị (Phân hoạch)',
    best: 'Θ(n log n)',
    average: 'Θ(n log n)',
    worst: 'Θ(n²)',
    space: 'Θ(log n)..O(n)',
    stable: 'Không',
    tradeoff: 'Nhanh trung bình trên RAM; rủi ro O(n²) & tràn Stack',
    apps: 'Sắp xếp mảng nguyên thủy trong RAM',
  },
  {
    name: 'Merge Sort',
    theme: 'neutral',
    mechanism: 'Chia để trị (Gộp mảng)',
    best: 'Θ(n log n)',
    average: 'Θ(n log n)',
    worst: 'Θ(n log n)',
    space: 'O(n)',
    stable: 'Có',
    tradeoff: 'Ổn định, khóa O(n log n); tốn O(n) bộ nhớ phụ',
    apps: 'Sắp xếp ngoại (External Sort), Linked List',
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
    title: 'Timsort — Mô phỏng Biểu đồ Cột Trực Quan',
    subtitle: 'Mảng đầu vào A = [3, 5, 7, 2, 4, 6, 9, 1, 8, 10] với tham số minrun = 4',
    duration: '1.5 phút',
    speakerNotes:
      'Hãy bấm nút "Tự động chạy" hoặc "Bước tiếp" để quan sát trực quan thuật toán Timsort trên biểu đồ cột với tham số minrun = 4. Trình mô phỏng tái hiện chi tiết từng khung hình: (1) Phát hiện Natural Runs tăng/giảm tự nhiên (nếu giảm thì đảo ngược tại chỗ); (2) Mở rộng các run ngắn hơn minrun = 4 bằng Insertion Sort từng bước chèn/dịch; (3) Trộn các run theo bất biến Run Stack (mergeCollapse) bằng hai con trỏ. Bạn cũng có thể kéo thanh tốc độ hoặc bấm "Mảng ngẫu nhiên" để thử nghiệm dữ liệu mới.',
  },
  {
    id: 5,
    chapter: 'timsort',
    theme: 'timsort',
    title: 'Timsort — Cài đặt bằng Python (Python Implementation)',
    subtitle: 'Biến thể minh họa rút gọn gồm tim_sort(), insertion_sort() và merge()',
    duration: '1.0 phút',
    speakerNotes:
      'Đây là mã nguồn Python 3+ cài đặt 3 hàm cốt lõi: tim_sort() quét run tự nhiên và gộp theo cặp từng lượt; insertion_sort() sắp xếp đoạn đóng [left, right] sử dụng điều kiện arr[j] > key (thay vì >=) để bảo toàn tính ổn định; và merge() dùng mảng đệm temp với điều kiện arr[i] <= arr[j] nhằm ưu tiên phần tử run trái khi bằng khóa. Lưu ý đây là mô hình giảng dạy (MIN_RUN = 4), bản sản xuất trong CPython (Objects/listobject.c) có thêm đảo run giảm dần, bất biến merge stack và galloping mode.',
  },
  {
    id: 6,
    chapter: 'timsort',
    theme: 'timsort',
    title: 'Timsort — Độ phức tạp Thời gian & Không gian',
    subtitle: 'Đánh đổi O(n) RAM phụ để lấy Stability và tốc độ O(n) trên dữ liệu gần sắp xếp',
    duration: '1.0 phút',
    speakerNotes:
      'Về thời gian: Best Case đạt O(n) khi mảng đã tăng dần sẵn (chỉ quét 1 lượt phát hiện 1 run duy nhất, không merge). Average Case và Worst Case đều khóa chặt ở O(n log n) nhờ cơ chế quản lý kích thước run. Về không gian: Tốn O(n) bộ nhớ phụ cho vùng đệm tạm khi merge và run stack. Trong Java, mảng kiểu nguyên thủy dùng Dual-Pivot Quicksort để tiết kiệm RAM, còn Python list và mảng đối tượng Java (Object[]) dùng Timsort vì tính ổn định là tối quan trọng.',
  },
  {
    id: 7,
    chapter: 'timsort',
    theme: 'timsort',
    title: 'Timsort — Bài toán Ứng dụng Thực tế',
    subtitle: 'Ngôn ngữ lập trình hiện đại, Hệ thống Server Logs & LeetCode 88',
    duration: '1.0 phút',
    speakerNotes:
      'Timsort là mặc định trong Python (list.sort(), sorted()), Java (Arrays.sort(Object[]), Collections.sort()), Android và V8 JS Engine. Một bài toán thực tế điển hình là tổng hợp Server Logs từ nhiều máy chủ bị lệch nhẹ timestamp do độ trễ mạng: dữ liệu gồm nhiều run gần tăng dần, gọi logs.sort(key=lambda entry: entry.timestamp) trong Python vừa nhanh vừa giữ nguyên thứ tự các log trùng timestamp. Tư tưởng tận dụng run đã sắp xếp cũng liên hệ trực tiếp tới LeetCode 88 (Merge Sorted Array) dùng 2 con trỏ trong O(m + n).',
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
    title: 'Introsort — Cây đệ quy & Thước đo Depth',
    subtitle: 'Interactive 2-Tab Trace trên mảng A = [19, 7, 15, 12, 16, 18, 4, 11, 13] (n = 9)',
    duration: '1.5 phút',
    speakerNotes:
      'Ở Slide này có 2 Tab tương tác kèm Cây đệ quy và Thước đo Depth trực quan. Tab 1 minh họa Trường hợp chuẩn (threshold = 3, depth = 6): mảng lướt qua các lần phân hoạch Pivot và Insertion Sort ở các nhánh nhỏ mà chưa chạm ngưỡng depth = 0. Tab 2 chủ động đặt threshold = 2 và depth = 1: khi nửa trái [0..5] chạm vạch đỏ depth = 0, Introsort lập tức kích hoạt Heapsort kèm mô phỏng cây nhị phân Max-Heap bên phải để chặn nguy cơ O(n²). Bạn có thể bấm "Tự động chạy", kéo thanh tốc độ 0.5x–2.5x hoặc bấm trực tiếp vào bất kỳ node nào trên cây đệ quy để nhảy tới bước đó.',
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
    title: "Heap Sort — Cây nhị phân 'co lại' & Vách ngăn mảng động",
    subtitle: 'Trực quan hóa đồng bộ Cây Heap thu gọn + Mảng 1 chiều có vách ngăn trượt cho arr = [4, 10, 3, 5]',
    duration: '1.1 phút (Phút 2)',
    speakerNotes:
      'Hãy bấm "Tự động chạy" hoặc "Bước tiếp" để theo dõi đồng bộ Cây nhị phân co lại và Mảng 1 chiều có vách ngăn trượt! Pha 1 (Build Max-Heap) liên kết nút cha i với con 2i+1 / 2i+2 bằng vòng cung công thức, đẩy giá trị lớn nhất lên gốc arr[0]. Pha 2 (Rút gốc & Vun lại) liên tục đổi gốc về cuối vùng Heap, khóa nút (thu nhỏ trên cây + ngắt nét đứt cạnh nối), đồng thời trượt vách ngăn xanh-vàng lùi sang trái. Bạn có thể chuyển sang "Ngẫu nhiên (7 phần tử)" để quan sát cây 3 tầng đầy đủ, kéo thanh tốc độ hoặc rê chuột lên từng nút để soi đồng bộ trên mảng.',
  },
  {
    id: 16,
    chapter: 'heapsort',
    theme: 'heapsort',
    title: 'Heap Sort — Cài đặt Python (Khử Đệ Quy Chuẩn O(1) RAM)',
    subtitle: 'Bấm vào từng thẻ bên phải (hoặc phím 1, 2, 3, 0) để Spotlight từng khối logic',
    duration: '1.0 phút (Phút 3)',
    speakerNotes:
      'Đây là mã nguồn cài đặt bằng Python. Bạn có thể bấm vào từng thẻ bên phải hoặc bấm phím 1, 2, 3 để spotlight từng khối logic và bấm "Bước tiếp theo" ở thanh Console dưới cùng. Điểm ăn tiền nhất nằm ở hàm sift_down (Phím 1): thay vì gọi đệ quy, vòng lặp while True trượt trực tiếp từ nút cha xuống nút con, đạt chuẩn O(1) RAM phụ tuyệt đối và triệt tiêu hoàn toàn nguy cơ Stack Overflow. Vòng lặp 1 (Phím 2) chạy ngược từ n // 2 - 1 về 0 để Build Max-Heap trong O(n). Vòng lặp 2 (Phím 3) liên tục hoán đổi đỉnh arr[0] về cuối mảng arr[i] và gọi sift_down để khôi phục Max-Heap.',
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
    subtitle: 'Phím D: Mô phỏng tấn công tràn Stack Kernel  |  Phím K: Chạy từng bước Hộp Min-Heap Top-K',
    duration: '1.0 phút (Phút 5)',
    speakerNotes:
      'Vậy tại sao Heap Sort lại sống khỏe trong các hệ thống lõi? Thứ nhất là trong Hệ thống nhúng và nhân Linux Kernel (file lib/sort.c): Kernel Stack chỉ vỏn vẹn 8 KB – 16 KB. Bấm phím D để mô phỏng kịch bản DoS O(n²): nếu dùng QuickSort đệ quy sâu sẽ vượt ngưỡng 16 KB gây Kernel Panic ngay lập tức, trong khi Heap Sort dùng O(1) RAM nên hoàn toàn miễn nhiễm. Thứ hai là nền tảng cho Hàng đợi ưu tiên (Priority Queue) giải quyết bài toán Top-K như LeetCode 215: bấm phím K để chạy từng bước Hộp Min-Heap k = 2 phần tử với đỉnh min_heap[0] đóng vai trò "người gác cổng", giúp đạt thời gian O(n log k) thay vì sort cả mảng O(n log n).',
  },
  {
    id: 19,
    chapter: 'summary',
    theme: 'summary',
    title: 'Bảng Tổng hợp So sánh Toàn diện',
    subtitle:
      'Đối chiếu 5 thuật toán sắp xếp cốt lõi theo Thời gian, Bộ nhớ, Tính ổn định, Đặc tính & Ứng dụng Production',
    duration: '1.5 phút',
    speakerNotes:
      'Tổng kết lại: Không có một thuật toán sắp xếp "vạn năng" cho mọi bối cảnh — hệ thống Production lựa chọn dựa trên sự đánh đổi giữa thời gian, bộ nhớ phụ, tính ổn định và mức độ thân thiện CPU Cache. Cần Stable và khai thác dữ liệu gần sắp xếp trên Object Arrays thì chọn Timsort (Python, Java Objects, V8 JS); cần tốc độ RAM nhanh nhất nhưng vẫn khóa chặt cận trên O(n log n) thì chọn Introsort (C++ std::sort, .NET, Go); còn khi tài nguyên RAM và Stack bị siết chặt tuyệt đối như nhân Linux Kernel hay Hệ thống nhúng thì Heap Sort là chốt chặn an toàn duy nhất.',
  },
];
