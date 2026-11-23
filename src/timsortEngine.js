export const TIMSORT_DEFAULT_ARRAY = [3, 5, 7, 2, 4, 6, 9, 1, 8, 10];
export const TIMSORT_MINRUN = 4;

export const TIMSORT_SPEED_MAP = {
  1: { delay: 1300, label: 'Rất chậm' },
  2: { delay: 900, label: 'Chậm' },
  3: { delay: 550, label: 'Vừa' },
  4: { delay: 300, label: 'Nhanh' },
  5: { delay: 140, label: 'Rất nhanh' },
};

export const TIMSORT_PHASE_META = {
  init: { text: 'Khởi tạo', badgeClass: 'tim-badge-init' },
  runs: { text: 'Tạo Runs', badgeClass: 'tim-badge-runs' },
  merge: { text: 'Trộn Runs', badgeClass: 'tim-badge-merge' },
  done: { text: 'Hoàn tất', badgeClass: 'tim-badge-done' },
};

export function generateTimsortFrames(inputArr) {
  const arr = [...inputArr];
  const n = arr.length;
  const frames = [];
  const runStack = [];
  let comparisons = 0;
  let writes = 0;
  let runCounter = 0;

  function recordFrame({
    phase,
    title,
    description,
    highlights = {},
    activeIndices = [],
    runsOverride = null,
  }) {
    const snapshotRuns = (runsOverride || runStack).map((r) => ({ ...r }));
    frames.push({
      array: [...arr],
      phase,
      title,
      description,
      highlights: { ...highlights },
      activeIndices: [...activeIndices],
      runs: snapshotRuns,
      comparisons,
      writes,
    });
  }

  function getStackSortedHighlights() {
    const hl = {};
    for (const r of runStack) {
      for (let idx = r.start; idx < r.start + r.len; idx++) {
        hl[idx] = 'sorted';
      }
    }
    return hl;
  }

  recordFrame({
    phase: 'init',
    title: 'Bước 0: Mảng đầu vào (Input)',
    description: `Mảng ${n} phần tử A = [${arr.join(', ')}] với tham số minrun = ${TIMSORT_MINRUN}. Nhấn "▶ Tự động chạy" để xem quá trình Timsort.`,
  });

  let i = 0;
  while (i < n) {
    runCounter++;
    const runStart = i;
    let runEnd = i;

    if (runEnd < n - 1) {
      comparisons++;
      const isDescending = arr[runEnd + 1] < arr[runEnd];

      if (isDescending) {
        runEnd++;
        while (runEnd < n - 1) {
          comparisons++;
          if (arr[runEnd + 1] < arr[runEnd]) {
            runEnd++;
          } else {
            break;
          }
        }

        const hlDesc = getStackSortedHighlights();
        for (let k = runStart; k <= runEnd; k++) hlDesc[k] = 'compare';

        recordFrame({
          phase: 'runs',
          title: `Tìm Natural Run ${runCounter} (giảm dần)`,
          description: `Phát hiện dãy giảm dần tự nhiên tại [${runStart}..${runEnd}] = [${arr.slice(runStart, runEnd + 1).join(', ')}]. Cần đảo ngược thành tăng dần.`,
          highlights: hlDesc,
          activeIndices: Array.from({ length: runEnd - runStart + 1 }, (_, idx) => runStart + idx),
          runsOverride: [
            ...runStack,
            {
              start: runStart,
              len: runEnd - runStart + 1,
              label: `Run ${runCounter} [${runStart}..${runEnd}]`,
              active: true,
            },
          ],
        });

        let left = runStart;
        let right = runEnd;
        while (left < right) {
          const temp = arr[left];
          arr[left] = arr[right];
          arr[right] = temp;
          writes += 2;
          left++;
          right--;
        }

        const hlRev = getStackSortedHighlights();
        for (let k = runStart; k <= runEnd; k++) hlRev[k] = 'insert';

        recordFrame({
          phase: 'runs',
          title: `Đảo ngược Natural Run ${runCounter}`,
          description: `Đã đảo ngược Run ${runCounter} [${runStart}..${runEnd}] thành dãy tăng dần [${arr.slice(runStart, runEnd + 1).join(', ')}].`,
          highlights: hlRev,
          activeIndices: Array.from({ length: runEnd - runStart + 1 }, (_, idx) => runStart + idx),
          runsOverride: [
            ...runStack,
            {
              start: runStart,
              len: runEnd - runStart + 1,
              label: `Run ${runCounter} [${runStart}..${runEnd}]`,
              active: true,
            },
          ],
        });
      } else {
        runEnd++;
        while (runEnd < n - 1) {
          comparisons++;
          if (arr[runEnd + 1] >= arr[runEnd]) {
            runEnd++;
          } else {
            break;
          }
        }

        const hlAsc = getStackSortedHighlights();
        for (let k = runStart; k <= runEnd; k++) hlAsc[k] = 'compare';

        recordFrame({
          phase: 'runs',
          title: `Phát hiện Natural Run ${runCounter} [${runStart}..${runEnd}]`,
          description: `Tìm thấy dãy tăng tự nhiên [${arr.slice(runStart, runEnd + 1).join(', ')}] (độ dài ${runEnd - runStart + 1}).`,
          highlights: hlAsc,
          activeIndices: Array.from({ length: runEnd - runStart + 1 }, (_, idx) => runStart + idx),
          runsOverride: [
            ...runStack,
            {
              start: runStart,
              len: runEnd - runStart + 1,
              label: `Run ${runCounter} [${runStart}..${runEnd}]`,
              active: true,
            },
          ],
        });
      }
    } else {
      const hlSingle = getStackSortedHighlights();
      hlSingle[runStart] = 'compare';
      recordFrame({
        phase: 'runs',
        title: `Phát hiện Run ${runCounter} [${runStart}..${runStart}]`,
        description: `Phần tử cuối cùng [${arr[runStart]}] tạo thành Run ${runCounter} độ dài 1.`,
        highlights: hlSingle,
        activeIndices: [runStart],
        runsOverride: [
          ...runStack,
          { start: runStart, len: 1, label: `Run ${runCounter} [${runStart}]`, active: true },
        ],
      });
    }

    const naturalLen = runEnd - runStart + 1;
    const forceEnd = Math.min(runStart + TIMSORT_MINRUN - 1, n - 1);

    if (forceEnd > runEnd) {
      const activeRunObj = {
        start: runStart,
        len: forceEnd - runStart + 1,
        label: `Run ${runCounter} [${runStart}..${forceEnd}]`,
        active: true,
      };

      const hlExtend = getStackSortedHighlights();
      for (let k = runStart; k <= forceEnd; k++) hlExtend[k] = 'compare';

      recordFrame({
        phase: 'runs',
        title: `Mở rộng Run ${runCounter} [${runStart}..${forceEnd}] bằng Insertion Sort`,
        description: `Độ dài tự nhiên (${naturalLen}) < minrun (${TIMSORT_MINRUN}). Mở rộng Run ${runCounter} đến chỉ số ${forceEnd} và sắp xếp chèn.`,
        highlights: hlExtend,
        activeIndices: [runEnd + 1],
        runsOverride: [...runStack, activeRunObj],
      });

      for (let curr = runEnd + 1; curr <= forceEnd; curr++) {
        const key = arr[curr];
        let j = curr - 1;

        const hlPick = getStackSortedHighlights();
        for (let k = runStart; k < curr; k++) hlPick[k] = 'compare';
        hlPick[curr] = 'insert';

        recordFrame({
          phase: 'runs',
          title: `Insertion Sort — Chọn giá trị ${key} (chỉ số ${curr})`,
          description: `Xét phần tử A[${curr}] = ${key} để chèn vào đúng vị trí trong Run ${runCounter} [${runStart}..${forceEnd}].`,
          highlights: hlPick,
          activeIndices: [curr],
          runsOverride: [...runStack, activeRunObj],
        });

        while (j >= runStart) {
          comparisons++;
          const hlCmp = getStackSortedHighlights();
          for (let k = runStart; k <= curr; k++) hlCmp[k] = 'compare';
          hlCmp[j] = 'compare';
          hlCmp[j + 1] = 'insert';

          if (arr[j] > key) {
            arr[j + 1] = arr[j];
            writes++;

            recordFrame({
              phase: 'runs',
              title: `Insertion Sort — Dịch chuyển ${arr[j]} sang phải`,
              description: `So sánh ${key} < ${arr[j]}: dịch phần tử ${arr[j]} từ vị trí ${j} sang ${j + 1}.`,
              highlights: { ...hlCmp, [j]: 'insert', [j + 1]: 'insert' },
              activeIndices: [j, j + 1],
              runsOverride: [...runStack, activeRunObj],
            });

            j--;
          } else {
            recordFrame({
              phase: 'runs',
              title: `Insertion Sort — Tìm thấy vị trí chèn cho ${key}`,
              description: `So sánh ${key} ≥ ${arr[j]}: dừng dịch chuyển, đặt ${key} tại chỉ số ${j + 1}.`,
              highlights: hlCmp,
              activeIndices: [j, j + 1],
              runsOverride: [...runStack, activeRunObj],
            });
            break;
          }
        }

        arr[j + 1] = key;
        writes++;

        const hlPlaced = getStackSortedHighlights();
        for (let k = runStart; k <= curr; k++) hlPlaced[k] = 'sorted';
        hlPlaced[j + 1] = 'insert';

        recordFrame({
          phase: 'runs',
          title: `Insertion Sort — Đã chèn ${key} vào vị trí ${j + 1}`,
          description: `Đặt giá trị ${key} vào A[${j + 1}]. Đoạn [${runStart}..${curr}] đã tăng dần: [${arr.slice(runStart, curr + 1).join(', ')}].`,
          highlights: hlPlaced,
          activeIndices: [j + 1],
          runsOverride: [...runStack, activeRunObj],
        });
      }

      runEnd = forceEnd;
    }

    const finalLen = runEnd - runStart + 1;
    runStack.push({
      start: runStart,
      len: finalLen,
      label: `Run ${runCounter} [${runStart}..${runEnd}]`,
    });

    const hlRunDone = getStackSortedHighlights();
    recordFrame({
      phase: 'runs',
      title: `Hoàn tất Run ${runCounter} [${runStart}..${runEnd}]`,
      description: `Run ${runCounter} = [${arr.slice(runStart, runEnd + 1).join(', ')}] (độ dài ${finalLen}) đã được đưa vào Run Stack.`,
      highlights: hlRunDone,
      activeIndices: Array.from({ length: finalLen }, (_, idx) => runStart + idx),
    });

    mergeCollapse();
    i = runEnd + 1;
  }

  while (runStack.length > 1) {
    let idx = runStack.length - 2;
    if (idx > 0 && runStack[idx - 1].len < runStack[idx + 1].len) {
      idx--;
    }
    mergeAt(idx);
  }

  const hlAllSorted = {};
  for (let k = 0; k < n; k++) hlAllSorted[k] = 'sorted';
  recordFrame({
    phase: 'done',
    title: 'Hoàn tất sắp xếp Timsort!',
    description: `Mảng đã được sắp xếp tăng dần hoàn chỉnh: [${arr.join(', ')}]. Tổng cộng ${comparisons} phép so sánh và ${writes} lần ghi/dịch chuyển.`,
    highlights: hlAllSorted,
    runsOverride: [{ start: 0, len: n, label: `Mảng đã sắp xếp [0..${n - 1}]`, done: true }],
  });

  return frames;

  function mergeCollapse() {
    while (runStack.length > 1) {
      let idx = runStack.length - 2;
      const cond1 = idx > 0 && runStack[idx - 1].len <= runStack[idx].len + runStack[idx + 1].len;
      const cond2 = idx > 1 && runStack[idx - 2].len <= runStack[idx - 1].len + runStack[idx].len;

      if (cond1 || cond2) {
        if (runStack[idx - 1].len < runStack[idx + 1].len) {
          idx--;
        }
        mergeAt(idx);
      } else if (runStack[idx].len <= runStack[idx + 1].len) {
        mergeAt(idx);
      } else {
        break;
      }
    }
  }

  function mergeAt(stackIdx) {
    const runA = runStack[stackIdx];
    const runB = runStack[stackIdx + 1];

    const leftStart = runA.start;
    const leftLen = runA.len;
    const rightStart = runB.start;
    const rightLen = runB.len;
    const rightEnd = rightStart + rightLen - 1;

    const leftArr = arr.slice(leftStart, leftStart + leftLen);
    const rightArr = arr.slice(rightStart, rightStart + rightLen);

    const hlStartMerge = getStackSortedHighlights();
    for (let k = leftStart; k < leftStart + leftLen; k++) hlStartMerge[k] = 'mergeLeft';
    for (let k = rightStart; k <= rightEnd; k++) hlStartMerge[k] = 'mergeRight';

    recordFrame({
      phase: 'merge',
      title: `Trộn ${runA.label} và ${runB.label}`,
      description: `Bắt đầu trộn Run trái [${leftArr.join(', ')}] và Run phải [${rightArr.join(', ')}] vào đoạn [${leftStart}..${rightEnd}].`,
      highlights: hlStartMerge,
      activeIndices: Array.from({ length: leftLen + rightLen }, (_, idx) => leftStart + idx),
    });

    let pL = 0;
    let pR = 0;
    let dest = leftStart;

    while (pL < leftLen && pR < rightLen) {
      comparisons++;
      const valL = leftArr[pL];
      const valR = rightArr[pR];

      if (valL <= valR) {
        arr[dest] = valL;
        writes++;
        const hlStep = getStackSortedHighlights();
        for (let k = leftStart; k < dest; k++) hlStep[k] = 'sorted';
        for (let k = dest + 1; k <= rightEnd; k++) hlStep[k] = 'mergeRight';
        hlStep[dest] = 'mergeWrite';

        recordFrame({
          phase: 'merge',
          title: `Đang trộn [${leftStart}..${rightEnd}] — Ghi giá trị ${valL}`,
          description: `So sánh ${valL} (trái) ≤ ${valR} (phải): chọn ${valL} đưa vào vị trí A[${dest}].`,
          highlights: hlStep,
          activeIndices: [dest],
        });
        pL++;
      } else {
        arr[dest] = valR;
        writes++;
        const hlStep = getStackSortedHighlights();
        for (let k = leftStart; k < dest; k++) hlStep[k] = 'sorted';
        for (let k = dest + 1; k <= rightEnd; k++) hlStep[k] = 'mergeLeft';
        hlStep[dest] = 'mergeWrite';

        recordFrame({
          phase: 'merge',
          title: `Đang trộn [${leftStart}..${rightEnd}] — Ghi giá trị ${valR}`,
          description: `So sánh ${valR} (phải) < ${valL} (trái): chọn ${valR} đưa vào vị trí A[${dest}].`,
          highlights: hlStep,
          activeIndices: [dest],
        });
        pR++;
      }
      dest++;
    }

    while (pL < leftLen) {
      arr[dest] = leftArr[pL];
      writes++;
      const hlRem = getStackSortedHighlights();
      for (let k = leftStart; k < dest; k++) hlRem[k] = 'sorted';
      hlRem[dest] = 'mergeWrite';

      recordFrame({
        phase: 'merge',
        title: `Đang trộn [${leftStart}..${rightEnd}] — Chép phần còn lại`,
        description: `Run phải đã hết, chép phần tử còn lại ${leftArr[pL]} từ Run trái vào A[${dest}].`,
        highlights: hlRem,
        activeIndices: [dest],
      });
      pL++;
      dest++;
    }

    while (pR < rightLen) {
      arr[dest] = rightArr[pR];
      writes++;
      const hlRem = getStackSortedHighlights();
      for (let k = leftStart; k < dest; k++) hlRem[k] = 'sorted';
      hlRem[dest] = 'mergeWrite';

      recordFrame({
        phase: 'merge',
        title: `Đang trộn [${leftStart}..${rightEnd}] — Chép phần còn lại`,
        description: `Run trái đã hết, chép phần tử còn lại ${rightArr[pR]} từ Run phải vào A[${dest}].`,
        highlights: hlRem,
        activeIndices: [dest],
      });
      pR++;
      dest++;
    }

    runStack.splice(stackIdx, 2, {
      start: leftStart,
      len: leftLen + rightLen,
      label: `Merged [${leftStart}..${rightEnd}]`,
    });

    const hlMerged = getStackSortedHighlights();
    recordFrame({
      phase: 'merge',
      title: `Hoàn tất trộn đoạn [${leftStart}..${rightEnd}]`,
      description: `Đã trộn xong thành Run mới [${arr.slice(leftStart, rightEnd + 1).join(', ')}] (độ dài ${leftLen + rightLen}).`,
      highlights: hlMerged,
      activeIndices: Array.from({ length: leftLen + rightLen }, (_, idx) => leftStart + idx),
    });
  }
}

export function generateRandomTimsortArray(size = 10, maxPool = 20) {
  const pool = Array.from({ length: maxPool }, (_, idx) => idx + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, size);
}
