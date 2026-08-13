import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchAttendanceData } from './services/socrataApi';
import { TARGET_ATTENDANCE_RATE } from './data/mockAttendanceData';

import KpiCards from './components/KpiCards';
import FilterToolbar from './components/FilterToolbar';
import AttendanceCharts from './components/AttendanceCharts';
import DataTable from './components/DataTable';

import {
  RefreshCw,
  ArrowDown,
  Database,
  Github,
} from 'lucide-react';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMock, setIsMock] = useState(false);

  const [selectedBorough, setSelectedBorough] =
    useState('All Boroughs');

  const [selectedType, setSelectedType] =
    useState('All Types');

  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (
        selectedBorough !== 'All Boroughs' &&
        item.borough !== selectedBorough
      ) {
        return false;
      }

      if (
        selectedType !== 'All Types' &&
        item.school_type !== selectedType
      ) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();

        const matchesBorough =
          item.borough?.toLowerCase().includes(q);

        const matchesType =
          item.school_type?.toLowerCase().includes(q);

        const matchesSchool =
          item.school_name?.toLowerCase().includes(q);

        if (
          !matchesBorough &&
          !matchesType &&
          !matchesSchool
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    data,
    selectedBorough,
    selectedType,
    searchQuery,
  ]);

  /*
   * Calculate school-level summary statistics.
   * These power the editorial storytelling section.
   */
  const schoolTypeStats = useMemo(() => {
    const types = [
      'Elementary',
      'K-8',
      'Middle',
      'High School',
    ];

    return types.map((type) => {
      const rows = filteredData.filter(
        (item) => item.school_type === type
      );

      if (!rows.length) {
        return {
          type,
          attendance: null,
          count: 0,
        };
      }

      const totalStudents = rows.reduce(
        (sum, row) =>
          sum + Number(row.number_of_students || 0),
        0
      );

      const weightedAttendance = rows.reduce(
        (sum, row) =>
          sum +
          Number(row.attendance_rate || row.attendance || 0) *
            Number(row.number_of_students || 0),
        0
      );

      const average =
        totalStudents > 0
          ? weightedAttendance / totalStudents
          : rows.reduce(
              (sum, row) =>
                sum +
                Number(
                  row.attendance_rate ||
                    row.attendance ||
                    0
                ),
              0
            ) / rows.length;

      return {
        type,
        attendance: average,
        count: rows.length,
      };
    });
  }, [filteredData]);

  const elementary =
    schoolTypeStats.find(
      (item) => item.type === 'Elementary'
    )?.attendance;

  const highSchool =
    schoolTypeStats.find(
      (item) => item.type === 'High School'
    )?.attendance;

  const attendanceGap =
    elementary != null && highSchool != null
      ? elementary - highSchool
      : null;

  const highestAttendance = useMemo(() => {
    return schoolTypeStats
      .filter((item) => item.attendance != null)
      .sort(
        (a, b) => b.attendance - a.attendance
      )[0];
  }, [schoolTypeStats]);

  return (
    <div className="editorial-site">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="site-header">
        <div className="site-header-inner">

          <div className="brand">
            <span className="brand-name">
              RIA RUSSO
            </span>

            <span className="brand-divider">
              /
            </span>

            <span className="brand-project">
              DATA PROJECT
            </span>
          </div>

          <div className="header-meta">
            <span>NYC PUBLIC SCHOOLS</span>

            <button
              onClick={() => loadData(false)}
              disabled={loading}
              className="refresh-button"
              aria-label="Refresh data"
            >
              <RefreshCw
                size={15}
                className={
                  loading ? 'spin' : ''
                }
              />
            </button>
          </div>

        </div>
      </header>


      <main className="editorial-main">

        {/* =========================================
            HERO
        ========================================= */}

        <section className="editorial-hero">

          <div className="hero-kicker">
            DATA INVESTIGATION · NYC ATTENDANCE
          </div>

          <h1>
            Roll Call:
            <br />
            <span>Who gets to be present?</span>
          </h1>

          <div className="hero-bottom">

            <p className="hero-intro">
              An exploration of attendance across
              New York City's public schools — and
              what the numbers reveal about the
              transition from childhood to adolescence.
            </p>

            <div className="hero-source">
              <Database size={16} />

              <div>
                <span>DATA SOURCE</span>
                <strong>
                  NYC Open Data · dnpx-dfnc
                </strong>
              </div>
            </div>

          </div>

        </section>


        {/* =========================================
            THE QUESTION
        ========================================= */}

        <section className="story-section">

          <div className="section-marker">
            <span>01</span>
            <span className="marker-line"></span>
            THE QUESTION
          </div>

          <div className="question-grid">

            <div>
              <h2>
                Does attendance
                <br />
                decline as students
                <br />
                <em>get older?</em>
              </h2>
            </div>

            <div className="question-copy">
              <p>
                This project compares attendance
                across four school types — K–8,
                Elementary, Middle, and High School —
                across New York City's five boroughs.
              </p>

              <p>
                The goal is not simply to identify
                which schools have the highest
                attendance. It is to understand where
                the gaps appear and what those gaps
                might tell us about the conditions
                students experience.
              </p>
            </div>

          </div>

        </section>


        {/* =========================================
            BIG ATTENDANCE GAP
        ========================================= */}

        <section className="gap-section">

          <div className="section-marker">
            <span>02</span>
            <span className="marker-line"></span>
            THE ATTENDANCE GAP
          </div>

          <div className="gap-layout">

            <div className="gap-label">
              ELEMENTARY
            </div>

            <div className="gap-number">
              {elementary != null
                ? `${elementary.toFixed(1)}%`
                : '—'}
            </div>

            <div className="gap-arrow">
              <ArrowDown size={28} />
            </div>

            <div className="gap-label high-school-label">
              HIGH SCHOOL
            </div>

            <div className="gap-number high-school-number">
              {highSchool != null
                ? `${highSchool.toFixed(1)}%`
                : '—'}
            </div>

            <div className="gap-difference">

              <span className="gap-difference-number">
                {attendanceGap != null
                  ? `−${attendanceGap.toFixed(1)}`
                  : '—'}
              </span>

              <span className="gap-difference-label">
                percentage point difference
              </span>

            </div>

          </div>

          <p className="gap-caption">
            The difference between Elementary and
            High School 90%+ attendance rates in the
            current selection.
          </p>

        </section>


        {/* =========================================
            EXISTING KPI COMPONENT
        ========================================= */}

        <section className="dashboard-section">

          <div className="section-marker">
            <span>03</span>
            <span className="marker-line"></span>
            AT A GLANCE
          </div>

          <KpiCards
            data={filteredData}
            targetRate={TARGET_ATTENDANCE_RATE}
          />

        </section>


        {/* =========================================
            SCHOOL TYPE COMPARISON
        ========================================= */}

        <section className="comparison-section">

          <div className="section-marker">
            <span>04</span>
            <span className="marker-line"></span>
            ATTENDANCE BY SCHOOL TYPE
          </div>

          <div className="comparison-header">

            <div>
              <h2>
                Where does attendance
                <br />
                begin to fall?
              </h2>
            </div>

            <div className="comparison-note">
              {highestAttendance && (
                <>
                  <span className="small-label">
                    HIGHEST CURRENT RATE
                  </span>

                  <strong>
                    {highestAttendance.type}
                  </strong>

                  <span>
                    {highestAttendance.attendance?.toFixed(1)}%
                  </span>
                </>
              )}
            </div>

          </div>

          <div className="editorial-bars">

            {schoolTypeStats.map((item) => {

              const percentage =
                item.attendance || 0;

              const isHighSchool =
                item.type === 'High School';

              return (
                <div
                  className={`editorial-bar-row ${
                    isHighSchool
                      ? 'high-school-row'
                      : ''
                  }`}
                  key={item.type}
                >

                  <div className="bar-label">
                    {item.type}
                  </div>

                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${Math.min(
                          percentage,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="bar-value">
                    {item.attendance != null
                      ? `${item.attendance.toFixed(1)}%`
                      : '—'}
                  </div>

                </div>
              );
            })}

          </div>

        </section>


        {/* =========================================
            WHAT THE DATA SUGGESTS
        ========================================= */}

        <section className="argument-section">

          <div className="section-marker red-marker">
            <span>05</span>
            <span className="marker-line"></span>
            WHAT THE DATA SUGGESTS
          </div>

          <div className="argument-card">

            <div className="argument-number">
              →
            </div>

            <div>
              <h2>
                Attendance is not
                <br />
                just a student problem.
              </h2>

              <p>
                When high school attendance trails
                other school levels, the question
                should not only be why students are
                absent.
              </p>

              <p>
                We should also ask what conditions
                make it easier — or harder — for
                students to be present.
              </p>

              <p className="argument-bold">
                NYC should invest in high schools
                and in the conditions that help
                students attend consistently.
              </p>

            </div>

          </div>

        </section>


        {/* =========================================
            BOROUGH / FILTER AREA
        ========================================= */}

        <section className="explore-section">

          <div className="section-marker">
            <span>06</span>
            <span className="marker-line"></span>
            EXPLORE THE CITY
          </div>

          <div className="explore-header">

            <div>
              <h2>
                Where is the gap
                <br />
                largest?
              </h2>
            </div>

            <p>
              Use the controls below to explore
              attendance by borough, school type,
              and individual school.
            </p>

          </div>

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

        </section>


        {/* =========================================
            CHARTS
        ========================================= */}

        <section className="charts-section">

          <div className="section-marker">
            <span>07</span>
            <span className="marker-line"></span>
            THE CITY IN DATA
          </div>

          <AttendanceCharts
            data={filteredData}
            selectedBorough={selectedBorough}
            selectedType={selectedType}
          />

        </section>


        {/* =========================================
            SCHOOL DATA
        ========================================= */}

        <section className="table-section">

          <div className="section-marker">
            <span>08</span>
            <span className="marker-line"></span>
            EXPLORE THE DATA
          </div>

          <div className="table-intro">

            <h2>
              School-level attendance
            </h2>

            <p>
              Search and compare individual schools
              across NYC.
            </p>

          </div>

          <DataTable
            data={filteredData}
            targetRate={TARGET_ATTENDANCE_RATE}
          />

        </section>


        {/* =========================================
            METHODOLOGY
        ========================================= */}

        <section className="methodology-section">

          <div className="section-marker">
            <span>09</span>
            <span className="marker-line"></span>
            ABOUT THE DATA
          </div>

          <div className="methodology-grid">

            <div>
              <h3>
                Methodology
              </h3>

              <p>
                Attendance data is retrieved from the
                NYC Open Data School Quality Reports
                dataset and processed through the
                Socrata API.
              </p>
            </div>

            <div>
              <h3>
                School Types
              </h3>

              <p>
                K–8, Elementary, Middle, and High
                School are compared throughout the
                analysis.
              </p>
            </div>

            <div>
              <h3>
                Boroughs
              </h3>

              <p>
                Manhattan, Bronx, Brooklyn, Queens,
                and Staten Island are represented in
                the dataset.
              </p>
            </div>

          </div>

        </section>

      </main>


      {/* =========================================
          FOOTER
      ========================================= */}

      <footer className="editorial-footer">

        <div className="footer-left">

          <strong>
            RIA RUSSO
          </strong>

          <span>
            NYC SCHOOL ATTENDANCE
          </span>

        </div>

        <div className="footer-center">
          Built with React · Vite · Recharts
        </div>

        <a
          href="https://github.com/riarusso/nyc-school-attendance-dashboard"
          target="_blank"
          rel="noreferrer"
          className="github-link"
        >
          <Github size={15} />
          VIEW CODE
        </a>

      </footer>

    </div>
  );
}
