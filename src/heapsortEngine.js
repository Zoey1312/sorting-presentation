export const HEAPSORT_SAMPLE_ARRAY = [4, 10, 3, 5];

export function formatHeapArrayDivider(items, heapSize) {
  const vals = items.map((x) => x.val);
  if (heapSize <= 0 || heapSize >= vals.length) return vals.join(', ');
  return `${vals.slice(0, heapSize).join(', ')} | ${vals.slice(heapSize).join(', ')}`;
}

export function generateHeapSortFrames(inputArr) {
  const items = inputArr.map((val, idx) => ({ id: idx, val }));
  const n = items.length;
  const frames = [];
  let comparisons = 0;
  let swaps = 0;

  function pushFrame({
    phase,
    phaseLabel,
    pillLabel,
    actionType,
    actionLabel,
    description,
    heapSize,
    comparing = null,
    swapping = null,
    justLocked = null,
  }) {
    frames.push({
      items: items.map((it) => ({ ...it })),
      phase,
      phaseLabel,
      pillLabel,
      actionType,
      actionLabel,
      description,
      heapSize,
      comparing,
      swapping,
      justLocked,
      comparisons,
      swaps,
    });
  }

  const isDefault4 =
    n === 4 &&
    inputArr[0] === 4 &&
    inputArr[1] === 10 &&
    inputArr[2] === 3 &&
    inputArr[3] === 5;

  pushFrame({
    phase: 'init',
    phaseLabel: 'Khởi tạo',
    pillLabel: 'Khởi tạo',
    actionType: 'init',
    actionLabel: 'Mảng ban đầu',
    description: isDefault4
      ? 'Khởi tạo mảng arr = [4, 10, 3, 5] (n = 4). Gốc arr[0] = 4 có con trái arr[1] = 10, con phải arr[2] = 3; con trái của 10 là arr[3] = 5. Bắt đầu Pha 1: Build Max-Heap.'
      : `Khởi tạo mảng ${n} phần tử arr = [${inputArr.join(', ')}] tạo thành cây nhị phân 3 tầng. Bắt đầu Pha 1: Build Max-Heap từ nút nội bộ cuối cùng i = ${Math.floor(n / 2) - 1} về 0.`,
    heapSize: n,
  });

  function heapify(heapSize, rootIdx, phase, phaseLabel, pillPrefix) {
    let curr = rootIdx;

    while (true) {
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;
      const children = [];

      if (left < heapSize) children.push({ idx: left, formula: '2i+1' });
      if (right < heapSize) children.push({ idx: right, formula: '2i+2' });

      if (children.length === 0) break;

      let largest = curr;
      if (left < heapSize) {
        comparisons++;
        if (items[left].val > items[largest].val) largest = left;
      }
      if (right < heapSize) {
        comparisons++;
        if (items[right].val > items[largest].val) largest = right;
      }

      const pVal = items[curr].val;
      const childDesc = children
        .map((c) => `arr[${c.idx}]=${items[c.idx].val} (${c.formula})`)
        .join(' và ');

      if (largest === curr) {
        pushFrame({
          phase,
          phaseLabel,
          pillLabel: `${pillPrefix} i=${curr}`,
          actionType: 'compare',
          actionLabel: 'So sánh (Đạt chuẩn)',
          description: `So sánh cha arr[${curr}]=${pVal} với ${childDesc}. Vì ${pVal} đã lớn nhất → nhánh tại i=${curr} thỏa mãn tính chất Max-Heap.`,
          heapSize,
          comparing: { parent: curr, children },
        });
        break;
      } else {
        const lVal = items[largest].val;
        pushFrame({
          phase,
          phaseLabel,
          pillLabel: `${pillPrefix} i=${curr}`,
          actionType: 'compare',
          actionLabel: 'So sánh cha & con',
          description: `So sánh cha arr[${curr}]=${pVal} với ${childDesc}. Nút con arr[${largest}]=${lVal} lớn hơn ${pVal} → cần hoán đổi để đưa giá trị lớn lên trên.`,
          heapSize,
          comparing: { parent: curr, children },
        });

        const tmp = items[curr];
        items[curr] = items[largest];
        items[largest] = tmp;
        swaps++;

        pushFrame({
          phase,
          phaseLabel,
          pillLabel: `Đổi ${pVal}↔${lVal}`,
          actionType: 'swap',
          actionLabel: `Hoán đổi [${curr}] ↔ [${largest}]`,
          description: `Hoán đổi arr[${curr}] (${pVal}) ↔ arr[${largest}] (${lVal}) đồng bộ trên cả cây và mảng. Trạng thái hiện tại: [${formatHeapArrayDivider(items, heapSize)}].`,
          heapSize,
          swapping: [curr, largest],
        });

        curr = largest;
      }
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i, 'build', 'Pha 1: Build Max-Heap', 'Xét');
  }

  pushFrame({
    phase: 'build',
    phaseLabel: 'Pha 1: Build Max-Heap',
    pillLabel: 'Xong Max-Heap',
    actionType: 'done',
    actionLabel: 'Đạt Max-Heap',
    description: `Hoàn tất Pha 1 (Build Max-Heap)! Toàn bộ cây đã thỏa mãn Cha ≥ Con với giá trị lớn nhất (${items[0].val}) nằm ở gốc arr[0]. Sẵn sàng sang Pha 2.`,
    heapSize: n,
  });

  for (let end = n - 1; end >= 1; end--) {
    const round = n - end;
    const rootVal = items[0].val;
    const endVal = items[end].val;

    const tmp = items[0];
    items[0] = items[end];
    items[end] = tmp;
    swaps++;

    pushFrame({
      phase: 'extract',
      phaseLabel: 'Pha 2: Rút gốc & Vun lại',
      pillLabel: `V${round}: Đổi ${rootVal}↔${endVal}`,
      actionType: 'swap',
      actionLabel: `Vòng ${round}: Rút gốc arr[0] ↔ arr[${end}]`,
      description: `Vòng ${round}: Đưa phần tử lớn nhất ở gốc arr[0]=${rootVal} xuống cuối vùng Heap arr[${end}]=${endVal}.`,
      heapSize: end + 1,
      swapping: [0, end],
    });

    pushFrame({
      phase: 'extract',
      phaseLabel: 'Pha 2: Rút gốc & Vun lại',
      pillLabel: `Khóa ${rootVal} [${end}]`,
      actionType: 'lock',
      actionLabel: `Khóa arr[${end}] • Co cây`,
      description: `Khóa cố định ${rootVal} tại arr[${end}]! Cạnh nối bị ngắt (nét đứt), cây Heap thu nhỏ còn ${end}/${n} nút và vách ngăn mảng trượt lùi sang trái 1 ô.`,
      heapSize: end,
      justLocked: end,
    });

    if (end > 1) {
      heapify(end, 0, 'extract', 'Pha 2: Rút gốc & Vun lại', `Vun V${round}`);
    }
  }

  pushFrame({
    phase: 'done',
    phaseLabel: 'Hoàn tất',
    pillLabel: 'Hoàn tất ✓',
    actionType: 'done',
    actionLabel: 'Đã sắp xếp ✓',
    description: `Khóa nốt gốc cuối cùng arr[0]=${items[0].val}. Cây Heap đã thu gọn về 0, vách ngăn mở trọn vùng xanh lá — mảng đã sắp xếp tăng dần hoàn chỉnh: [${items.map((x) => x.val).join(', ')}]!`,
    heapSize: 0,
    justLocked: 0,
  });

  return frames;
}

export function generateRandomHeapArray7() {
  const pool = Array.from({ length: 24 }, (_, i) => i + 2);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 7);
}
