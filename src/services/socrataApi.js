import { MOCK_ATTENDANCE_DATA, TARGET_ATTENDANCE_RATE } from '../data/mockAttendanceData';

const SOCRATA_ENDPOINT = 'https://data.cityofnewyork.us/resource/dnpx-dfnc.json';

/**
 * Parses DBN string to get borough name.
 * NYC DBN format: e.g. "01M015" -> M = Manhattan, X = Bronx, K = Brooklyn, Q = Queens, R = Staten Island
 */
export const deriveBoroughFromDbn = (dbn) => {
  if (!dbn || dbn.length < 3) return 'Manhattan';
  const char = dbn.charAt(2).toUpperCase();
  switch (char) {
    case 'M': return 'Manhattan';
    case 'X': return 'Bronx';
    case 'K': return 'Brooklyn';
    case 'Q': return 'Queens';
    case 'R': return 'Staten Island';
    default: return 'Manhattan';
  }
};

/**
 * Standardizes school type strings into 4 core tiers:
 * Elementary, K-8, Middle, High School
 */
export const normalizeSchoolType = (type) => {
  if (!type) return 'Elementary';
  const t = type.toLowerCase();
  if (t.includes('elementary') || t.includes('early') || t.includes('primary')) return 'Elementary';
  if (t.includes('k-8') || t.includes('k-12') || t.includes('all grades') || t.includes('ems')) return 'K-8';
  if (t.includes('middle') || t.includes('junior')) return 'Middle';
  if (t.includes('high') || t.includes('hs') || t.includes('secondary')) return 'High School';
  return 'Elementary';
};

/**
 * Fetches attendance dataset using Socrata SoQL or falls back gracefully to mock benchmark data.
 * @param {boolean} forceMock - If true, bypasses network fetch and returns fallback data immediately.
 */
export const fetchAttendanceData = async (forceMock = false) => {
  if (forceMock) {
    return { data: MOCK_ATTENDANCE_DATA, isMock: true };
  }

  try {
    // SoQL Query selecting school_type, metric values for attendance
    const soqlQuery = `$select=dbn,school_type,metric_value&$where=metric_variable_name='attendance_k8_all' OR metric_variable_name='attendance_hs_all' OR metric_display_name='Average Student Attendance'&$limit=2000`;
    const response = await fetch(`${SOCRATA_ENDPOINT}?${soqlQuery}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Socrata HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();

    if (!Array.isArray(rawData) || rawData.length === 0) {
      throw new Error('Socrata API returned an empty response dataset');
    }

    // Group raw rows by Borough & Normalized School Type
    const grouped = {};

    rawData.forEach(item => {
      if (!item.metric_value) return;
      const rate = parseFloat(item.metric_value);
      if (isNaN(rate) || rate <= 0 || rate > 1) return;

      const borough = deriveBoroughFromDbn(item.dbn);
      const schoolType = normalizeSchoolType(item.school_type);
      const key = `${borough}_${schoolType}`;

      if (!grouped[key]) {
        grouped[key] = {
          borough,
          school_type: schoolType,
          totalRateSum: 0,
          total_schools: 0,
        };
      }

      grouped[key].totalRateSum += rate;
      grouped[key].total_schools += 1;
    });

    const parsedData = Object.values(grouped).map((group, idx) => ({
      id: `SOC-${idx}-${group.borough.substring(0, 3)}-${group.school_type.replace(/ /g, '')}`,
      borough: group.borough,
      school_type: group.school_type,
      avg_attendance: parseFloat((group.totalRateSum / group.total_schools).toFixed(3)),
      total_schools: group.total_schools,
      target_attendance: TARGET_ATTENDANCE_RATE,
    }));

    if (parsedData.length < 5) {
      // Incomplete data, use mock data fallback
      return { data: MOCK_ATTENDANCE_DATA, isMock: true };
    }

    return { data: parsedData, isMock: false };
  } catch (err) {
    console.warn('Socrata API Fetch Warning (Using Benchmark Mock Data):', err.message);
    return { data: MOCK_ATTENDANCE_DATA, isMock: true, error: err.message };
  }
};
