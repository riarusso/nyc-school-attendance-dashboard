# NYC School Attendance Analytics Dashboard MVP

A lightweight, high-performance React 18 MVP application for analyzing daily student attendance rates across four NYC school tiers (**Elementary**, **K-8**, **Middle**, **High School**) and five NYC boroughs (**Manhattan**, **Bronx**, **Brooklyn**, **Queens**, **Staten Island**).

![Dashboard Overview](https://img.shields.io/badge/React-18-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-emerald) ![Recharts](https://img.shields.io/badge/Recharts-v2-purple) ![Vite](https://img.shields.io/badge/Vite-v5-amber)

## Features
- **Key Metrics (KPI Cards)**: Displays Citywide Weighted Average Attendance, Total Schools Analyzed, Max Tier Gap %, and Top Performing Borough.
- **Dual-Filter Toolbar**: Filter dynamically by Borough, School Tier, and live text search query.
- **Visual Analytics (Recharts)**:
  - **Vertical Bar Chart**: Compares attendance across school levels with distinct tier colors (`#3b82f6` Elementary, `#10b981` K-8, `#f59e0b` Middle, `#ef4444` High School).
  - **Horizontal Ranking Chart**: Ranks average attendance across all 5 boroughs relative to the 92.0% DOE benchmark.
- **Data Matrix Table**: Detailed matrix table with column sorting, tier badges, target variance indicators (+/- vs 92.0% goal), and CSV export.
- **API Integration & Fallback Strategy**: Directly queries NYC Open Data Socrata endpoint (`dnpx-dfnc`) with server-side SoQL aggregations and automatic benchmark fallback (`mockAttendanceData.js`).

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation & Running Locally

1. Navigate to the project directory:
   ```bash
   cd nyc-school-attendance-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build production bundle:
   ```bash
   npm run build
   ```

## Project Architecture
```text
nyc-school-attendance-dashboard/
├── src/
│   ├── components/
│   │   ├── KpiCards.jsx             # Key metrics display
│   │   ├── FilterToolbar.jsx        # Dual-filter controls & live search
│   │   ├── AttendanceCharts.jsx     # Recharts vertical tier & horizontal ranking charts
│   │   └── DataTable.jsx            # Detailed matrix table & CSV export
│   ├── data/
│   │   └── mockAttendanceData.js    # Fallback benchmark dataset
│   ├── services/
│   │   └── socrataApi.js            # Socrata Open Data fetch & SoQL queries
│   ├── App.jsx                      # Main dashboard layout & state management
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Tailwind CSS directives & global glassmorphism styles
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```
