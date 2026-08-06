import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchAttendanceData } from './services/socrataApi';
import { TARGET_ATTENDANCE_RATE } from './data/mockAttendanceData';
import KpiCards from './components/KpiCards';
import FilterToolbar from './components/FilterToolbar';
import AttendanceCharts from './components/AttendanceCharts';
import DataTable from './components/DataTable';
import { GraduationCap, BarChart3, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMock, setIsMock] = useState(false);

  // Active Filter States
  const [selectedBorough, setSelectedBorough] = useState('All Boroughs');
  const [selectedType, setSelectedType] = useState('All Types');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Attendance Data
  const loadData = useCallback(async (forceMock = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAttendanceData(forceMock);
      setData(result.data || []);
      setIsMock(result.isMock || false);
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
      setIsMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute Filtered Matrix Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Borough Filter
      if (selectedBorough !== 'All Boroughs' && item.borough !== selectedBorough) {
        return false;
      }
      // School Type Filter
      if (selectedType !== 'All Types' && item.school_type !== selectedType) {
        return false;
      }
      // Search Query Filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesBorough = item.borough.toLowerCase().includes(q);
        const matchesType = item.school_type.toLowerCase().includes(q);
        if (!matchesBorough && !matchesType) return false;
      }
      return true;
    });
  }, [data, selectedBorough, selectedType, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Header Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-white">
                  NYC School Attendance Analytics
                </h1>
                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-blue-500/20">
                  MVP v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Daily attendance metrics across 5 Boroughs & 4 School Tiers
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right text-xs">
              <div className="font-semibold text-slate-200">Data Source: NYC Open Data</div>
              <div className="text-slate-400 font-mono">Socrata Endpoint (dnpx-dfnc)</div>
            </div>
            <div className="h-7 w-px bg-slate-800" />
            <button
              onClick={() => loadData(false)}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Refresh Socrata dataset"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Error Banner if API threw warning */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                <strong>Socrata Notice:</strong> {error}. System seamlessly loaded the NYC DOE benchmark dataset.
              </span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-amber-400 hover:text-white underline font-medium ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading Spinner State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-400 animate-pulse">
              Computing SoQL Attendance Aggregations...
            </p>
          </div>
        ) : (
          <>
            {/* KPI Cards Component */}
            <KpiCards data={filteredData} targetRate={TARGET_ATTENDANCE_RATE} />

            {/* Filter Toolbar Component */}
            <FilterToolbar
              selectedBorough={selectedBorough}
              setSelectedBorough={setSelectedBorough}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isMock={isMock}
              onRefreshData={() => loadData(false)}
              loading={loading}
            />

            {/* Recharts Analytics Component */}
            <AttendanceCharts
              data={filteredData}
              selectedBorough={selectedBorough}
              selectedType={selectedType}
            />

            {/* Detailed Data Table Matrix */}
            <DataTable data={filteredData} targetRate={TARGET_ATTENDANCE_RATE} />
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/40 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span>NYC School Attendance Analytics Dashboard MVP</span>
          </div>
          <div>
            Built with React 18, Vite, Tailwind CSS v3 & Recharts v2
          </div>
        </div>
      </footer>

    </div>
  );
}
