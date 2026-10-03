import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ClipboardCheck, CheckCircle2, XCircle, Users, Search,
  CalendarDays, BookOpen, Building2, UserRound, ArrowRight,
  Sparkles, Check, X, ArrowLeft, History
} from "lucide-react";
import allSchedules from "./scheduleData.json";
import {
  ATTENDANCE_BRANCHES,
  saveAttendanceSession,
  getEnrichedStudents,
  getTodayAttendance
} from "./attendanceStore.js";

export function AttendanceMaker() {
  const navigate = useNavigate();
  const todayIso = new Date().toISOString().split("T")[0];

  const [dateStr, setDateStr] = useState(todayIso);
  const [sem, setSem] = useState("3rd");
  const [branch, setBranch] = useState("CSE A");
  const [classIndex, setClassIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [attMap, setAttMap] = useState({});
  const [successData, setSuccessData] = useState(null);

  // Compute selected day of week name
  const dayName = useMemo(() => {
    try {
      const parts = dateStr.split("-");
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return days[d.getDay()];
    } catch {
      return "Thursday";
    }
  }, [dateStr]);

  const formattedDate = useMemo(() => {
    try {
      const parts = dateStr.split("-");
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  }, [dateStr]);

  // Determine schedule routine key and assigned room
  const { scheduleKey, assignedRoom } = useMemo(() => {
    let key = `${sem}_CSE`;
    let room = "LH-111";
    if (branch === "CSE A") {
      key = `${sem}_CSE`;
      room = "LH-111";
    } else if (branch === "CSE B") {
      key = `${sem}_CSE`;
      room = "LH-112";
    } else if (branch === "CSE C") {
      key = `${sem}_CSE`;
      room = "LH-123";
    } else if (branch === "AIML") {
      key = `${sem}_AIML`;
      room = "LH-131";
    } else if (branch === "IT") {
      key = `${sem}_IT`;
      room = "LH-123";
    }
    return { scheduleKey: key, assignedRoom: room };
  }, [sem, branch]);

  // Get available classes for this routine
  const availableClasses = useMemo(() => {
    const fullList = allSchedules[scheduleKey] || [];
    // First try filtering by the selected day
    const dayFiltered = fullList.filter(x => x.day === dayName);
    if (dayFiltered.length > 0) return dayFiltered;
    // Fallback: If off-day or no classes on this day, provide routine classes so teacher can still record
    const unique = [];
    const seen = new Set();
    for (const item of fullList) {
      const key = item.code + item.subject;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }
    return unique.length > 0 ? unique : [
      { day: dayName, time: "09:30 AM - 10:20 AM", code: "PCC-CS 302", subject: "Data Structure & Algorithms", faculty: "SD (CS)", room: assignedRoom, type: "Lecture" }
    ];
  }, [scheduleKey, dayName, assignedRoom]);

  // Keep classIndex in bounds
  const currentClass = availableClasses[classIndex] || availableClasses[0] || {
    time: "09:30 AM - 10:20 AM",
    code: "PCC-CS 302",
    subject: "Data Structure & Algorithms",
    faculty: "Faculty In-Charge",
    room: assignedRoom,
    type: "Lecture"
  };

  // Get students for the selected branch
  const allStudents = useMemo(() => {
    const list = getEnrichedStudents();
    return list.filter(s => s.branch === branch);
  }, [branch]);

  // Reset or initialize attendance when students change or branch changes
  useEffect(() => {
    const initial = {};
    for (const s of allStudents) {
      initial[s.id] = true; // Default to Present
    }
    setAttMap(initial);
    setClassIndex(0);
    setSuccessData(null);
  }, [allStudents, branch]);

  // Filtered students in class roster
  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allStudents;
    return allStudents.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      (s.univRoll && s.univRoll.toLowerCase().includes(q))
    );
  }, [allStudents, searchQuery]);

  // Live count
  const presentCount = useMemo(() => {
    return allStudents.filter(s => attMap[s.id] === true).length;
  }, [allStudents, attMap]);

  const absentCount = allStudents.length - presentCount;
  const attendanceRate = allStudents.length > 0 ? Math.round((presentCount / allStudents.length) * 100) : 0;

  const toggleStudent = (id) => {
    setAttMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const markAll = (val) => {
    const next = {};
    for (const s of allStudents) {
      next[s.id] = val;
    }
    setAttMap(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (allStudents.length === 0) return;

    const records = allStudents.map(s => ({
      studentId: s.id,
      name: s.name,
      roll: s.collegeRoll || s.id,
      univRoll: s.univRoll,
      present: attMap[s.id] === true
    }));

    const sessionData = {
      dateStr,
      dateFormatted: formattedDate,
      semester: `${sem} Semester`,
      branch,
      subjectCode: currentClass.code,
      subjectName: currentClass.subject,
      faculty: currentClass.faculty,
      time: currentClass.time,
      room: currentClass.room || assignedRoom,
      type: currentClass.type || "Lecture",
      records
    };

    const saved = saveAttendanceSession(sessionData);
    setSuccessData(saved);
  };

  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <h2>Mark Student Attendance</h2>
          <p>Live classroom attendance register · Select semester, branch, and period to mark attendance.</p>
        </div>
        <NavLink to="/attendance-records" className="ghost-btn">
          <History size={16}/> View Attendance Records
        </NavLink>
      </div>

      {successData && (
        <div style={{
          background: "linear-gradient(90deg, #138866, #0e6e52)",
          color: "#fff",
          borderRadius: "12px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "14px",
          boxShadow: "0 6px 20px rgba(19,136,102,0.3)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <CheckCircle2 size={24}/>
            <div>
              <b style={{ fontSize: "14px", display: "block" }}>Attendance Submitted Successfully!</b>
              <span style={{ fontSize: "11px", opacity: 0.9 }}>
                Recorded {successData.presentCount} present, {successData.absentCount} absent ({successData.percentage}%) for {successData.branch} · {successData.subjectCode} on {successData.dateFormatted}.
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setSuccessData(null)}
              className="ghost-btn"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "transparent" }}
            >
              Mark Another Class
            </button>
            <button
              onClick={() => navigate("/attendance-records")}
              className="primary-btn"
              style={{ background: "#fff", color: "#0e6e52", borderColor: "#fff" }}
            >
              View Attendance Records →
            </button>
          </div>
        </div>
      )}

      {/* Configuration Grid */}
      <div className="panel" style={{ padding: "18px 20px" }}>
        <div className="att-config-grid">
          {/* Date Selector */}
          <div className="att-field">
            <label>Attendance Date</label>
            <input
              type="date"
              value={dateStr}
              onChange={e => setDateStr(e.target.value)}
            />
          </div>

          {/* Semester Selector */}
          <div className="att-field">
            <label>Semester</label>
            <select
              value={sem}
              onChange={e => setSem(e.target.value)}
            >
              <option value="3rd">3rd Semester (2024 Batch)</option>
              <option value="5th">5th Semester</option>
              <option value="7th">7th Semester</option>
            </select>
          </div>

          {/* Branch Selector (5 branches) */}
          <div className="att-field">
            <label>Branch / Section</label>
            <select
              value={branch}
              onChange={e => setBranch(e.target.value)}
            >
              <option value="CSE A">CSE - Section A (57 Students)</option>
              <option value="CSE B">CSE - Section B (57 Students)</option>
              <option value="CSE C">CSE - Section C (57 Students)</option>
              <option value="AIML">CSE (AI & ML) (25 Students)</option>
              <option value="IT">Information Technology (11 Students)</option>
            </select>
          </div>

          {/* Class Routine Selector */}
          <div className="att-field" style={{ gridColumn: "span 2" }}>
            <label>Scheduled Class / Subject</label>
            <select
              value={classIndex}
              onChange={e => setClassIndex(Number(e.target.value))}
            >
              {availableClasses.map((c, i) => (
                <option key={c.code + c.time + i} value={i}>
                  {c.time} — {c.subject} ({c.code}) · {c.faculty} [{c.type}]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Class Highlight Card */}
        <div className="class-hero-card">
          <div>
            <span style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "1px", color: "#a5a9c2", fontWeight: 700 }}>
              PERIOD IN SESSION · {formattedDate}
            </span>
            <h3>{currentClass.subject} ({currentClass.code})</h3>
            <div className="class-hero-badges">
              <span><UserRound size={12}/> Faculty: {currentClass.faculty}</span>
              <span><Building2 size={12}/> Room: {currentClass.room || assignedRoom}</span>
              <span><CalendarDays size={12}/> Time: {currentClass.time}</span>
              <span style={{ background: currentClass.type === "Lab" ? "#f9731633" : "#6366f133" }}>
                {currentClass.type || "Lecture"}
              </span>
            </div>
          </div>

          <div className="class-hero-stats">
            <div>
              <span>Enrolled</span>
              <strong>{allStudents.length}</strong>
            </div>
            <div style={{ borderLeft: "1px solid #ffffff20", paddingLeft: "14px" }}>
              <span>Present</span>
              <strong style={{ color: "#34d399" }}>{presentCount}</strong>
            </div>
            <div style={{ borderLeft: "1px solid #ffffff20", paddingLeft: "14px" }}>
              <span>Absent</span>
              <strong style={{ color: "#f87171" }}>{absentCount}</strong>
            </div>
            <div style={{ borderLeft: "1px solid #ffffff20", paddingLeft: "14px" }}>
              <span>Rate</span>
              <strong style={{ color: attendanceRate >= 75 ? "#34d399" : "#fbbf24" }}>{attendanceRate}%</strong>
            </div>
          </div>
        </div>

        {/* Actions & Roster Filter */}
        <div className="att-actions-bar">
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => markAll(true)}
              className="att-quick-btn green"
            >
              <Check size={14}/> Mark All Present ({allStudents.length})
            </button>
            <button
              type="button"
              onClick={() => markAll(false)}
              className="att-quick-btn red"
            >
              <X size={14}/> Mark All Absent
            </button>
          </div>

          <div className="search" style={{ width: "240px", height: "32px" }}>
            <Search size={14}/>
            <input
              placeholder="Search student name or roll..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ fontSize: "10px" }}
            />
          </div>
        </div>

        {/* Student Roster Grid */}
        <div className="att-students-list">
          {filteredStudents.map(s => {
            const isPresent = attMap[s.id] === true;
            return (
              <div
                key={s.id}
                className={"att-student-card " + (isPresent ? "is-present" : "is-absent")}
                onClick={() => toggleStudent(s.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="att-student-info">
                  <div className="avatar" style={{
                    background: isPresent ? "#d1fae5" : "#fee2e2",
                    color: isPresent ? "#065f46" : "#991b1b"
                  }}>
                    {s.avatar}
                  </div>
                  <div>
                    <b>{s.name}</b>
                    <span>Roll: {s.id}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStudent(s.id);
                  }}
                  className={"att-toggle-btn " + (isPresent ? "present" : "absent")}
                >
                  {isPresent ? <Check size={12}/> : <X size={12}/>}
                  <span>{isPresent ? "Present" : "Absent"}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Submission Sticky Panel */}
        <div className="att-submit-panel">
          <div>
            <span style={{ fontSize: "10px", color: "var(--muted)", display: "block" }}>
              Ready to submit session for <b>{branch} · {currentClass.code}</b> ({formattedDate})
            </span>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "3px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff" }}>
                {presentCount} of {allStudents.length} Students Present ({attendanceRate}%)
              </span>
              <span style={{ fontSize: "11px", color: absentCount > 0 ? "#e11d48" : "#059669" }}>
                · {absentCount} Absent
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="primary-btn"
            style={{ padding: "10px 22px", fontSize: "12px", gap: "8px" }}
          >
            <ClipboardCheck size={18}/>
            <span>Submit Class Attendance</span>
          </button>
        </div>
      </div>
    </div>
  );
}
