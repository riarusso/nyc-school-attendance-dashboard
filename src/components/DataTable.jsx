import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Download, SearchX, CheckCircle, AlertTriangle } from 'lucide-react';
import { TIER_COLORS } from './AttendanceCharts';

export default function DataTable({ data = [], targetRate = 0.920 }) {
  const [sortField, setSortField] = useState('avg_attendance');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortOrder]);

  const exportCSV = () => {
    const headers = ['Borough', 'School Level', 'Avg Attendance Rate (%)', 'Total Schools', 'Target Rate (%)', 'Variance (%)'];
    const rows = sortedData.map((row) => {
      const avgPct = (row.avg_attendance * 100).toFixed(1);
      const targetPct = (targetRate * 100).toFixed(1);
      const variancePct = ((row.avg_attendance - targetRate) * 100).toFixed(1);
      return [row.borough, row.school_type, avgPct, row.total_schools, targetPct, variancePct];
    });

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NYC_School_Attendance_Matrix_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-5 overflow-hidden">
      
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100">Attendance Data Matrix</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Detailed breakdown comparing attendance performance against the 92.0% DOE benchmark
          </p>
        </div>

        <button
          onClick={exportCSV}
          disabled={sortedData.length === 0}
          className="flex items-center space-x-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Table Container */}
      {sortedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
          <SearchX className="w-10 h-10 mb-2 stroke-1" />
          <p className="text-sm font-medium">No school attendance records match the active filter criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                
                <th
                  onClick={() => handleSort('borough')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Borough</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort('school_type')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>School Tier</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort('avg_attendance')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors text-right"
                >
                  <div className="flex items-center justify-end space-x-1.5">
                    <span>Avg Attendance %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort('total_schools')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors text-right"
                >
                  <div className="flex items-center justify-end space-x-1.5">
                    <span>Total Schools</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                <th className="py-3 px-4 text-center">Variance vs 92.0% Goal</th>

              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {sortedData.map((row) => {
                const avgPct = (row.avg_attendance * 100).toFixed(1);
                const variancePct = ((row.avg_attendance - targetRate) * 100).toFixed(1);
                const isPositive = parseFloat(variancePct) >= 0;
                const tierColor = TIER_COLORS[row.school_type] || '#3b82f6';

                return (
                  <tr
                    key={row.id || `${row.borough}-${row.school_type}`}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Borough */}
                    <td className="py-3 px-4 text-slate-200 font-semibold">
                      {row.borough}
                    </td>

                    {/* School Tier Pill */}
                    <td className="py-3 px-4">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold text-white shadow-sm"
                        style={{ backgroundColor: tierColor }}
                      >
                        {row.school_type}
                      </span>
                    </td>

                    {/* Avg Attendance % */}
                    <td className="py-3 px-4 text-right font-bold text-white text-sm">
                      {avgPct}%
                    </td>

                    {/* Total Schools */}
                    <td className="py-3 px-4 text-right text-slate-300">
                      {row.total_schools.toLocaleString()}
                    </td>

                    {/* Variance vs Target Indicator */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            isPositive
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {isPositive ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          <span>
                            {isPositive ? '+' : ''}
                            {variancePct}%
                          </span>
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>Showing {sortedData.length} aggregated matrix records</span>
        <span>Target benchmark: 92.0% daily attendance</span>
      </div>

    </div>
  );
}
