import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

export const TIER_COLORS = {
  'Elementary': '#3b82f6', // Blue
  'K-8': '#10b981',        // Green
  'Middle': '#f59e0b',     // Amber
  'High School': '#ef4444',// Red
};

// Custom Tooltip for Charts
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataItem = payload[0].payload;
    const ratePct = (dataItem.attendanceRate * 100).toFixed(1);
    const targetDiff = (dataItem.attendanceRate - 0.920) * 100;
    const isAboveTarget = targetDiff >= 0;

    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[160px]">
        <div className="font-bold text-slate-100 border-b border-slate-800 pb-1 flex justify-between items-center">
          <span>{label}</span>
          {dataItem.school_type && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-semibold text-white"
              style={{ backgroundColor: TIER_COLORS[dataItem.school_type] || '#3b82f6' }}
            >
              {dataItem.school_type}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center text-slate-300">
          <span>Avg Attendance:</span>
          <span className="font-bold text-white text-sm">{ratePct}%</span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>Schools:</span>
          <span className="font-semibold text-slate-200">{dataItem.totalSchools?.toLocaleString() || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center text-slate-400 pt-0.5">
          <span>Vs 92.0% Goal:</span>
          <span className={`font-semibold ${isAboveTarget ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isAboveTarget ? '+' : ''}{targetDiff.toFixed(1)}%
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function AttendanceCharts({ data = [], selectedBorough = 'All Boroughs', selectedType = 'All Types' }) {
  // Aggregate 1: School Level Vertical Bar Data
  const schoolTypeOrder = ['Elementary', 'K-8', 'Middle', 'High School'];
  const schoolTypeAgg = schoolTypeOrder.map((type) => {
    const matching = data.filter((d) => d.school_type === type);
    const totalSchools = matching.reduce((sum, item) => sum + item.total_schools, 0);
    const weightedSum = matching.reduce((sum, item) => sum + item.avg_attendance * item.total_schools, 0);
    const attendanceRate = totalSchools > 0 ? weightedSum / totalSchools : 0;

    return {
      name: type,
      school_type: type,
      attendanceRate,
      attendanceRatePct: parseFloat((attendanceRate * 100).toFixed(1)),
      totalSchools,
      color: TIER_COLORS[type] || '#3b82f6',
    };
  });

  // Aggregate 2: Borough Horizontal Ranking Data
  const boroughOrder = ['Manhattan', 'Bronx', 'Brooklyn', 'Queens', 'Staten Island'];
  const boroughAgg = boroughOrder.map((borough) => {
    const matching = data.filter((d) => d.borough === borough);
    const totalSchools = matching.reduce((sum, item) => sum + item.total_schools, 0);
    const weightedSum = matching.reduce((sum, item) => sum + item.avg_attendance * item.total_schools, 0);
    const attendanceRate = totalSchools > 0 ? weightedSum / totalSchools : 0;

    return {
      name: borough,
      borough,
      attendanceRate,
      attendanceRatePct: parseFloat((attendanceRate * 100).toFixed(1)),
      totalSchools,
    };
  }).sort((a, b) => b.attendanceRate - a.attendanceRate); // Sort descending

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      
      {/* Primary Chart: Vertical Bar Chart by School Level */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Attendance Rate by School Tier</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison across Elementary, K-8, Middle, and High School
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-3 h-0.5 bg-rose-500/80 rounded" />
            <span>92.0% Goal</span>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={schoolTypeAgg}
              margin={{ top: 15, right: 15, left: -15, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                domain={[75, 100]}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(val) => `${val}%`}
                tickLine={false}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <ReferenceLine y={92.0} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} />
              <Bar dataKey="attendanceRatePct" radius={[6, 6, 0, 0]} maxBarSize={50}>
                {schoolTypeAgg.map((entry, index) => (
                  <Cell key={`tier-cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Chart: Horizontal Ranking Chart by Borough */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Borough Attendance Performance</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Horizontal ranking of average attendance across all 5 NYC boroughs
            </p>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={boroughAgg}
              margin={{ top: 5, right: 25, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis
                type="number"
                domain={[75, 100]}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(val) => `${val}%`}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#64748b"
                tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 500 }}
                tickLine={false}
                width={90}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <ReferenceLine x={92.0} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} />
              <Bar dataKey="attendanceRatePct" radius={[0, 6, 6, 0]} maxBarSize={28}>
                {boroughAgg.map((entry, index) => {
                  const isTop = index === 0;
                  const isSelected = selectedBorough === entry.borough;
                  const fillColor = isSelected
                    ? '#3b82f6'
                    : isTop
                    ? '#10b981'
                    : '#64748b';
                  return <Cell key={`borough-cell-${index}`} fill={fillColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
