import React from 'react';
import { TrendingUp, School, Activity, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function KpiCards({ data = [], targetRate = 0.920 }) {
  // Compute Overall Weighted Average
  const totalSchools = data.reduce((acc, curr) => acc + (curr.total_schools || 0), 0);
  
  const overallAvg = totalSchools > 0
    ? data.reduce((acc, curr) => acc + (curr.avg_attendance * curr.total_schools), 0) / totalSchools
    : 0;

  // Group by Borough to find Top Borough
  const boroughTotals = {};
  data.forEach(item => {
    if (!boroughTotals[item.borough]) {
      boroughTotals[item.borough] = { sum: 0, count: 0 };
    }
    boroughTotals[item.borough].sum += item.avg_attendance * item.total_schools;
    boroughTotals[item.borough].count += item.total_schools;
  });

  let topBorough = 'N/A';
  let topBoroughRate = 0;
  Object.keys(boroughTotals).forEach(b => {
    const avg = boroughTotals[b].count > 0 ? boroughTotals[b].sum / boroughTotals[b].count : 0;
    if (avg > topBoroughRate) {
      topBoroughRate = avg;
      topBorough = b;
    }
  });

  // Calculate Tier Attendance Gap (Max - Min attendance across all matrix items)
  const rates = data.map(d => d.avg_attendance).filter(r => !isNaN(r) && r > 0);
  const maxRate = rates.length ? Math.max(...rates) : 0;
  const minRate = rates.length ? Math.min(...rates) : 0;
  const maxGapPct = (maxRate - minRate) * 100;

  // Overall Variance vs Target
  const overallVariancePct = (overallAvg - targetRate) * 100;
  const isPositiveVariance = overallVariancePct >= 0;

  const cards = [
    {
      id: 'overall-avg',
      title: 'Citywide Average',
      value: `${(overallAvg * 100).toFixed(1)}%`,
      subtext: `${isPositiveVariance ? '+' : ''}${overallVariancePct.toFixed(1)}% vs 92.0% Goal`,
      subtextClass: isPositiveVariance ? 'text-emerald-400' : 'text-rose-400',
      icon: TrendingUp,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10 border-blue-500/20',
      badgeIcon: isPositiveVariance ? ArrowUpRight : ArrowDownRight,
    },
    {
      id: 'total-schools',
      title: 'Schools Analyzed',
      value: totalSchools.toLocaleString(),
      subtext: 'Across 5 NYC Boroughs',
      subtextClass: 'text-slate-400',
      icon: School,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'max-gap',
      title: 'Max Attendance Gap',
      value: `${maxGapPct.toFixed(1)}%`,
      subtext: `High ${(maxRate * 100).toFixed(1)}% vs Low ${(minRate * 100).toFixed(1)}%`,
      subtextClass: 'text-amber-400',
      icon: Activity,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'top-borough',
      title: 'Top Performing Borough',
      value: topBorough,
      subtext: `${(topBoroughRate * 100).toFixed(1)}% Average Rate`,
      subtextClass: 'text-purple-400',
      icon: Award,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map(card => {
        const IconComponent = card.icon;
        const BadgeIcon = card.badgeIcon;
        return (
          <div
            key={card.id}
            className="glass-panel rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:border-slate-600 hover:shadow-lg hover:shadow-blue-500/5 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl border ${card.iconBg} ${card.iconColor} transition-transform group-hover:scale-110 duration-200`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline space-x-2">
              <h3 className="text-3xl font-extrabold tracking-tight text-white">
                {card.value}
              </h3>
            </div>

            <div className="mt-2 flex items-center text-xs font-medium space-x-1">
              {BadgeIcon && (
                <BadgeIcon className={`w-3.5 h-3.5 ${card.subtextClass}`} />
              )}
              <span className={card.subtextClass}>{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
