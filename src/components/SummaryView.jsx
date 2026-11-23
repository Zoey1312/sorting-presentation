import React from 'react';
import { motion } from 'framer-motion';
import { COMPARISON_ROWS } from '../data/slidesData';

const bentoItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function SummaryView() {
  return (
    <div className="bento-grid flex-1 min-h-0">
      <motion.div variants={bentoItemVariants} className="bento-card summary-expanded-card col-12">
        <div className="flex-row justify-between items-center flex-wrap gap-2">
          <h3 className="bento-title">So sánh 5 Thuật toán Sắp xếp Cốt lõi</h3>
          <span className="badge-pill badge-blue">
            Đánh đổi Production: Thời gian • Bộ nhớ • Tính ổn định • Cache
          </span>
        </div>

        <div className="comparison-table-wrap">
          <table className="data-table data-table-expanded">
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
              {COMPARISON_ROWS.map((r) => {
                const bestStyle = r.best === 'Θ(n)' ? { color: '#30D158', fontWeight: 700 } : undefined;
                const worstStyle = r.worst === 'Θ(n²)' ? { color: '#FF6961', fontWeight: 700 } : undefined;
                const spaceStyle =
                  r.space === 'O(1)'
                    ? { color: '#FFD60A', fontWeight: 700 }
                    : r.space === 'Θ(log n)'
                      ? { color: '#DF9EFF', fontWeight: 700 }
                      : undefined;

                return (
                  <tr key={r.name} className={`row-theme-${r.theme}`}>
                    <td className="cell-nowrap">
                      <div className="algo-name">{r.name}</div>
                      <div className="algo-mechanism">{r.mechanism}</div>
                    </td>
                    <td className="mono cell-nowrap" style={bestStyle}>
                      {r.best}
                    </td>
                    <td className="mono cell-nowrap">{r.average}</td>
                    <td className="mono cell-nowrap" style={worstStyle}>
                      {r.worst}
                    </td>
                    <td className="mono cell-nowrap" style={spaceStyle}>
                      {r.space}
                    </td>
                    <td className="cell-nowrap">
                      {r.stable === 'Có' ? (
                        <span style={{ color: '#30D158', fontWeight: 700 }}>Có</span>
                      ) : (
                        <span style={{ color: '#A1A1A6' }}>Không</span>
                      )}
                    </td>
                    <td>{r.tradeoff}</td>
                    <td>{r.apps}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="summary-footer-bar">
          <span className="bento-caption">
            * Heap Sort đạt Best Case <code>Θ(n)</code> khi toàn bộ phần tử trong mảng bằng nhau.
          </span>
          <div className="flex-row gap-2 flex-wrap">
            <span className="badge-pill badge-mint">Timsort: Stable &amp; Natural Runs</span>
            <span className="badge-pill badge-purple">Introsort: Tốc độ RAM &amp; An toàn</span>
            <span className="badge-pill badge-amber">Heap Sort: O(1) RAM &amp; Không Stack</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
