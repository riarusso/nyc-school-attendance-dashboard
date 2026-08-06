import React from 'react';
import { Filter, RotateCcw, Search, Building2, Layers } from 'lucide-react';

export const BOROUGH_OPTIONS = [
  'All Boroughs',
  'Manhattan',
  'Bronx',
  'Brooklyn',
  'Queens',
  'Staten Island',
];

export const SCHOOL_TYPES = [
  'All Types',
  'Elementary',
  'K-8',
  'Middle',
  'High School',
];

export default function FilterToolbar({
  selectedBorough,
  setSelectedBorough,
  selectedType,
  setSelectedType,
  searchQuery,
  setSearchQuery,
  isMock,
  onRefreshData,
  loading,
}) {
  const isFiltered = selectedBorough !== 'All Boroughs' || selectedType !== 'All Types' || searchQuery !== '';

  const handleReset = () => {
    setSelectedBorough('All Boroughs');
    setSelectedType('All Types');
    setSearchQuery('');
  };

  return (
    <div className="glass-panel rounded-2xl p-4 mb-6 transition-all border border-slate-800">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left Section: Controls & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Filter Label */}
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold uppercase tracking-wider pr-1">
            <Filter className="w-4 h-4 text-blue-400" />
            <span>Filters</span>
          </div>

          {/* Borough Dropdown */}
          <div className="relative min-w-[170px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
            <select
              value={selectedBorough}
              onChange={(e) => setSelectedBorough(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs rounded-xl pl-9 pr-8 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer font-medium"
            >
              {BOROUGH_OPTIONS.map((borough) => (
                <option key={borough} value={borough} className="bg-slate-900 text-slate-200">
                  {borough}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-xs">
              ▼
            </div>
          </div>

          {/* School Type Pills */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl gap-1">
            {SCHOOL_TYPES.map((type) => {
              const active = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    active
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[180px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              placeholder="Search borough or tier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-slate-500"
            />
          </div>

          {/* Reset Button */}
          {isFiltered && (
            <button
              onClick={handleReset}
              className="flex items-center space-x-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3 py-2 rounded-xl transition-colors"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

        </div>

        {/* Right Section: Data Status & Refresh */}
        <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
          <div className="flex items-center space-x-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isMock ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-ping'
              }`}
            />
            <span className="text-xs font-medium text-slate-400">
              {isMock ? 'Benchmark Mock Mode' : 'Live SoQL Connected'}
            </span>
          </div>

          <button
            onClick={onRefreshData}
            disabled={loading}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-2 rounded-xl border border-slate-700 transition-colors disabled:opacity-50"
          >
            <Layers className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Fetching...' : 'Reload Data'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
