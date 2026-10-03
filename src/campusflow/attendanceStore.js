// Attendance Storage & State Manager for CampusFlow
import { students as initialStudents } from "./studentsData.js";

const STORAGE_SESSIONS_KEY = "cf_attendance_sessions_v1";
const STORAGE_STATS_KEY = "cf_student_attendance_stats_v1";

export const ATTENDANCE_BRANCHES = [
  { code: "CSE A", name: "Computer Science & Eng. - Section A", room: "LH-111", count: 57, accent: "violet" },
  { code: "CSE B", name: "Computer Science & Eng. - Section B", room: "LH-112", count: 57, accent: "violet" },
  { code: "CSE C", name: "Computer Science & Eng. - Section C", room: "LH-123", count: 57, accent: "violet" },
  { code: "AIML", name: "CSE (AI & Machine Learning)", room: "LH-131", count: 25, accent: "pink" },
  { code: "IT", name: "Information Technology", room: "LH-123", count: 11, accent: "blue" },
];

export function getStoredSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load attendance sessions from storage:", e);
    return [];
  }
}

export function getStoredStats() {
  try {
    const raw = localStorage.getItem(STORAGE_STATS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Failed to load attendance stats from storage:", e);
    return {};
  }
}

export function saveAttendanceSession(sessionData) {
  try {
    const sessions = getStoredSessions();
    const stats = getStoredStats();

    const newSession = {
      id: "att_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      timestamp: Date.now(),
      dateStr: sessionData.dateStr, // e.g. "2026-09-24"
      dateFormatted: sessionData.dateFormatted, // e.g. "Thursday, 24 Sep 2026"
      semester: sessionData.semester,
      branch: sessionData.branch,
      subjectCode: sessionData.subjectCode,
      subjectName: sessionData.subjectName,
      faculty: sessionData.faculty,
      time: sessionData.time,
      room: sessionData.room,
      type: sessionData.type || "Lecture",
      total: sessionData.records.length,
      presentCount: sessionData.records.filter(r => r.present).length,
      absentCount: sessionData.records.filter(r => !r.present).length,
      records: sessionData.records, // [{ studentId, name, roll, univRoll, present: boolean }]
    };

    newSession.percentage = newSession.total > 0
      ? Math.round((newSession.presentCount / newSession.total) * 100)
      : 0;

    sessions.unshift(newSession);

    // Update cumulative student stats
    for (const rec of sessionData.records) {
      const prev = stats[rec.studentId] || { attended: 0, total: 0 };
      stats[rec.studentId] = {
        attended: prev.attended + (rec.present ? 1 : 0),
        total: prev.total + 1,
      };
    }

    localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
    localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
    window.dispatchEvent(new Event("cf_attendance_updated"));
    return newSession;
  } catch (e) {
    console.error("Failed to save attendance session:", e);
    throw e;
  }
}

export function deleteAttendanceSession(sessionId) {
  try {
    const sessions = getStoredSessions().filter(s => s.id !== sessionId);
    // Recompute student stats from remaining sessions
    const stats = {};
    for (const s of sessions) {
      for (const rec of s.records) {
        if (!stats[rec.studentId]) {
          stats[rec.studentId] = { attended: 0, total: 0 };
        }
        stats[rec.studentId].total += 1;
        if (rec.present) {
          stats[rec.studentId].attended += 1;
        }
      }
    }

    localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
    localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
    window.dispatchEvent(new Event("cf_attendance_updated"));
  } catch (e) {
    console.error("Failed to delete attendance session:", e);
  }
}

export function getEnrichedStudents(baseStudents = initialStudents) {
  const stats = getStoredStats();
  return baseStudents.map(s => {
    const stat = stats[s.id] || { attended: 0, total: 0 };
    const attPercent = stat.total > 0 ? Math.round((stat.attended / stat.total) * 100) : 0;
    let status = "Pending";
    if (stat.total > 0) {
      if (attPercent >= 90) status = "Excellent";
      else if (attPercent >= 75) status = "Good";
      else if (attPercent >= 60) status = "Warning";
      else status = "Critical";
    }

    return {
      ...s,
      attendance: attPercent,
      attendedCount: stat.attended,
      totalSessions: stat.total,
      status: status,
    };
  });
}

export function getBranchAttendanceMap() {
  const sessions = getStoredSessions();
  const branchMap = {
    "CSE A": { present: 0, total: 0 },
    "CSE B": { present: 0, total: 0 },
    "CSE C": { present: 0, total: 0 },
    "AIML": { present: 0, total: 0 },
    "IT": { present: 0, total: 0 },
  };

  for (const s of sessions) {
    if (branchMap[s.branch]) {
      branchMap[s.branch].present += s.presentCount;
      branchMap[s.branch].total += s.total;
    }
  }

  const result = {};
  for (const b of ["CSE A", "CSE B", "CSE C", "AIML", "IT"]) {
    const item = branchMap[b];
    result[b] = item.total > 0 ? Math.round((item.present / item.total) * 100) : 0;
  }
  return result;
}

export function getOverallAttendance() {
  const sessions = getStoredSessions();
  if (sessions.length === 0) {
    return { percentage: 0, totalSessions: 0, totalPresent: 0, totalMarked: 0 };
  }
  let totalPresent = 0;
  let totalMarked = 0;
  for (const s of sessions) {
    totalPresent += s.presentCount;
    totalMarked += s.total;
  }
  const percentage = totalMarked > 0 ? Math.round((totalPresent / totalMarked) * 100) : 0;
  return { percentage, totalSessions: sessions.length, totalPresent, totalMarked };
}

export function getTodayAttendance(todayDateStr) {
  const sessions = getStoredSessions();
  const todaySessions = sessions.filter(s => s.dateStr === todayDateStr);
  if (todaySessions.length === 0) {
    return { percentage: 0, sessionCount: 0, totalPresent: 0, totalMarked: 0 };
  }
  let totalPresent = 0;
  let totalMarked = 0;
  for (const s of todaySessions) {
    totalPresent += s.presentCount;
    totalMarked += s.total;
  }
  const percentage = totalMarked > 0 ? Math.round((totalPresent / totalMarked) * 100) : 0;
  return { percentage, sessionCount: todaySessions.length, totalPresent, totalMarked };
}
