/**
 * NYC School Attendance Benchmark Fallback Dataset
 * Aggregated metrics across 5 NYC Boroughs and 4 Primary School Tiers.
 * Data benchmark modeled after NYC Open Data Socrata (dnpx-dfnc).
 */

export const MOCK_ATTENDANCE_DATA = [
  // Manhattan
  { id: 'M-ELEM', borough: 'Manhattan', school_type: 'Elementary', avg_attendance: 0.932, total_schools: 78, target_attendance: 0.920 },
  { id: 'M-K8', borough: 'Manhattan', school_type: 'K-8', avg_attendance: 0.941, total_schools: 32, target_attendance: 0.920 },
  { id: 'M-MID', borough: 'Manhattan', school_type: 'Middle', avg_attendance: 0.908, total_schools: 45, target_attendance: 0.920 },
  { id: 'M-HS', borough: 'Manhattan', school_type: 'High School', avg_attendance: 0.885, total_schools: 64, target_attendance: 0.920 },

  // Bronx
  { id: 'X-ELEM', borough: 'Bronx', school_type: 'Elementary', avg_attendance: 0.895, total_schools: 95, target_attendance: 0.920 },
  { id: 'X-K8', borough: 'Bronx', school_type: 'K-8', avg_attendance: 0.902, total_schools: 42, target_attendance: 0.920 },
  { id: 'X-MID', borough: 'Bronx', school_type: 'Middle', avg_attendance: 0.864, total_schools: 58, target_attendance: 0.920 },
  { id: 'X-HS', borough: 'Bronx', school_type: 'High School', avg_attendance: 0.828, total_schools: 72, target_attendance: 0.920 },

  // Brooklyn
  { id: 'K-ELEM', borough: 'Brooklyn', school_type: 'Elementary', avg_attendance: 0.924, total_schools: 125, target_attendance: 0.920 },
  { id: 'K-K8', borough: 'Brooklyn', school_type: 'K-8', avg_attendance: 0.935, total_schools: 54, target_attendance: 0.920 },
  { id: 'K-MID', borough: 'Brooklyn', school_type: 'Middle', avg_attendance: 0.891, total_schools: 76, target_attendance: 0.920 },
  { id: 'K-HS', borough: 'Brooklyn', school_type: 'High School', avg_attendance: 0.862, total_schools: 98, target_attendance: 0.920 },

  // Queens
  { id: 'Q-ELEM', borough: 'Queens', school_type: 'Elementary', avg_attendance: 0.945, total_schools: 110, target_attendance: 0.920 },
  { id: 'Q-K8', borough: 'Queens', school_type: 'K-8', avg_attendance: 0.952, total_schools: 38, target_attendance: 0.920 },
  { id: 'Q-MID', borough: 'Queens', school_type: 'Middle', avg_attendance: 0.921, total_schools: 52, target_attendance: 0.920 },
  { id: 'Q-HS', borough: 'Queens', school_type: 'High School', avg_attendance: 0.898, total_schools: 66, target_attendance: 0.920 },

  // Staten Island
  { id: 'R-ELEM', borough: 'Staten Island', school_type: 'Elementary', avg_attendance: 0.938, total_schools: 36, target_attendance: 0.920 },
  { id: 'R-K8', borough: 'Staten Island', school_type: 'K-8', avg_attendance: 0.942, total_schools: 12, target_attendance: 0.920 },
  { id: 'R-MID', borough: 'Staten Island', school_type: 'Middle', avg_attendance: 0.914, total_schools: 16, target_attendance: 0.920 },
  { id: 'R-HS', borough: 'Staten Island', school_type: 'High School', avg_attendance: 0.880, total_schools: 18, target_attendance: 0.920 },
];

export const TARGET_ATTENDANCE_RATE = 0.920; // 92.0% target benchmark
