import React, { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  CalendarDays, Users, BookOpen, Building2, UserRound,
  Search, Trash2, Eye, CheckCircle2, XCircle, ArrowUpRight,
  ClipboardCheck, Sparkles, Filter, X, ArrowLeft
} from "lucide-react";
import {
  getStoredSessions,
  deleteAttendanceSession,
  getOverallAttendance
} from "./attendanceStore.js";

export function AttendanceRecords() {
  const [sessions, setSessions] = useState(() => getStoredSessions());
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterSem, setFilterSem] = useState("All");
  const [query, setQuery] = useState("");
  const [activeSession, setActiveSession] = useState(null);
  const [modalSearch, setModalSearch] = useState("");

  const refresh = () => {
    setSessions(getStoredSessions());
  };

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("cf_attendance_updated", handler);
    return () => window.removeEventListener("cf_attendance_updated", handler);
  }, []);

  const overall = useMemo(() => getOverallAttendance(), [sessions]);

  // Today's sessions
  const todayIso = new Date().toISOString().split("T")[0];
  const todaySessionsCount = useMemo(() => {
    return sessions.filter(s => s.dateStr === todayIso).length;
  }, [sessions, todayIso]);

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    const q = query.toLowerCase().trim();
    return sessions.filter(s => {
      const matchBranch = filterBranch === "All" || s.branch === filterBranch;
      const matchSem = filterSem === "All" || s.semester.includes(filterSem);
      const matchQuery =
        !q ||
        s.subjectName.toLowerCase().includes(q) ||
        s.subjectCode.toLowerCase().includes(q) ||
        s.faculty.toLowerCase().includes(q) ||
        s.branch.toLowerCase().includes(q) ||
        s.dateFormatted.toLowerCase().includes(q);
      return matchBranch && matchSem && matchQuery;
    });
  }, [sessions, filterBranch, filterSem, query]);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to remove this attendance record? Student cumulative attendance will be adjusted accordingly.")) {
      deleteAttendanceSession(id);
      if (activeSession && activeSession.id === id) {
        setActiveSession(null);
      }
    }
  };

  const modalFilteredRecords = useMemo(() => {
    if (!activeSession) return [];
    const q = modalSearch.toLowerCase().trim();
    if (!q) return activeSession.records;
    return activeSession.records.filter(r =>
      r.name.toLowerCase().includes(q) ||
      (r.roll && r.roll.toLowerCase().includes(q)) ||
      (r.univRoll && r.univRoll.toLowerCase().includes(q))
    );
  }, [activeSession, modalSearch]);

  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <h2>Attendance Records</h2>
          <p>Complete historical archive of all marked class attendance sessions across all branches.</p>
        </div>
        <NavLink to="/attendance" className="primary-btn">
          <ClipboardCheck size={16}/> Mark New Attendance
        </NavLink>
      </div>

      {/* Overview stats */}
      <div className="substats">
        <div>
          <span>Total Sessions Logged</span>
          <b>{sessions.length}</b>
        </div>
        <div>
          <span>Overall Campus Attendance</span>
          <b>{overall.percentage}%</b>
          <em>{overall.totalPresent}/{overall.totalMarked} students</em>
        </div>
        <div>
          <span>Today's Sessions Marked</span>
          <b>{todaySessionsCount}</b>
          <em className={todaySessionsCount > 0 ? "" : "red"}>
            {todaySessionsCount > 0 ? "Active today" : "None today"}
          </em>
        </div>
        <div>
          <span>Active Monitored Branches</span>
          <b>5</b>
          <em>CSE A, B, C, AIML, IT</em>
        </div>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="panel" style={{ padding: "14px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div className="search" style={{ width: "260px" }}>
            <Search size={16}/>
            <input
              placeholder="Search by subject, code, teacher, date..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <div className="filter-pills">
              {["All", "CSE A", "CSE B", "CSE C", "AIML", "IT"].map(b => (
                <button
                  key={b}
                  className={filterBranch === b ? "selected" : ""}
                  onClick={() => setFilterBranch(b)}
                >
                  {b}
                </button>
              ))}
            </div>

            <div className="select" style={{ height: "32px", padding: "0 8px" }}>
              <select
                value={filterSem}
                onChange={e => setFilterSem(e.target.value)}
                style={{ fontSize: "9px" }}
              >
                <option value="All">All Semesters</option>
                <option value="3rd">3rd Sem</option>
                <option value="5th">5th Sem</option>
                <option value="7th">7th Sem</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Session Records List */}
      {filteredSessions.length === 0 ? (
        <div className="panel" style={{ padding: "48px 24px", textAlign: "center" }}>
          <div style={{ width: "50px", height: "50px", borderRadius: "14px", background: "#f0eeff", color: "var(--primary)", display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
            <ClipboardCheck size={26}/>
          </div>
          <h3 style={{ fontSize: "17px", margin: "0 0 6px" }}>No Attendance Records Found</h3>
          <p style={{ color: "var(--muted)", fontSize: "11px", maxWidth: "440px", margin: "0 auto 18px", lineHeight: "1.5" }}>
            {sessions.length === 0
              ? "No attendance sessions have been submitted yet. Teachers can mark classroom attendance right now from the Mark Attendance register."
              : "No records match your selected filter criteria. Try clearing search filters."}
          </p>
          <NavLink to="/attendance" className="primary-btn">
            <ClipboardCheck size={16}/> Go to Mark Attendance
          </NavLink>
        </div>
      ) : (
        <div className="att-records-grid">
          {filteredSessions.map(s => {
            const isHigh = s.percentage >= 85;
            const isMid = s.percentage >= 75 && s.percentage < 85;
            const rateClass = isHigh ? "high" : isMid ? "mid" : "low";

            return (
              <div key={s.id} className="att-record-item">
                <div className="att-record-main">
                  <div className={`att-record-rate ${rateClass}`}>
                    {s.percentage}%
                    <span style={{ display: "block", fontSize: "7px", fontWeight: 600, color: "inherit", opacity: 0.8 }}>
                      ATTENDANCE
                    </span>
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span className="tag" style={{ background: "#eeecff", color: "#6255dc", fontWeight: 700 }}>
                        {s.branch}
                      </span>
                      <span className="tag">{s.semester}</span>
                      <span style={{ fontSize: "10px", color: "#8a94a6" }}>
                        {s.dateFormatted} · {s.time}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "14px", margin: "5px 0 3px", color: "var(--text)" }}>
                      {s.subjectName} ({s.subjectCode})
                    </h3>

                    <div style={{ display: "flex", gap: "12px", fontSize: "9px", color: "var(--muted)", flexWrap: "wrap" }}>
                      <span><UserRound size={12} style={{ verticalAlign: "middle" }}/> Faculty: <b>{s.faculty}</b></span>
                      <span><Building2 size={12} style={{ verticalAlign: "middle" }}/> Room: <b>{s.room}</b></span>
                      <span><b>{s.presentCount}</b> Present · <b style={{ color: "#ef4444" }}>{s.absentCount}</b> Absent</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSession(s);
                      setModalSearch("");
                    }}
                    className="ghost-btn"
                  >
                    <Eye size={14}/> View Full Roster ({s.total})
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(s.id, e)}
                    className="icon-btn"
                    title="Delete record"
                    style={{ color: "#ef4444" }}
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Session Student Sheet Modal */}
      {activeSession && (
        <div className="modal-overlay" onClick={() => setActiveSession(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="eyebrow" style={{ color: "var(--primary)" }}>ATTENDANCE ROSTER SHEET</span>
                <h3 style={{ margin: "3px 0 0", fontSize: "15px" }}>
                  {activeSession.branch} · {activeSession.subjectName} ({activeSession.subjectCode})
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "9px", color: "var(--muted)" }}>
                  {activeSession.dateFormatted} · {activeSession.time} · Room: {activeSession.room} · Faculty: {activeSession.faculty}
                </p>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setActiveSession(null)}
              >
                <X size={18}/>
              </button>
            </div>

            <div style={{ padding: "12px 20px", background: "rgba(255, 255, 255, 0.04)", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "14px", fontSize: "11px" }}>
                <span>Total: <b>{activeSession.total}</b></span>
                <span style={{ color: "#10875e" }}>Present: <b>{activeSession.presentCount}</b></span>
                <span style={{ color: "#db3546" }}>Absent: <b>{activeSession.absentCount}</b></span>
                <span style={{ fontWeight: 700 }}>Rate: <b>{activeSession.percentage}%</b></span>
              </div>

              <div className="search" style={{ width: "200px", height: "30px" }}>
                <Search size={13}/>
                <input
                  placeholder="Filter roster..."
                  value={modalSearch}
                  onChange={e => setModalSearch(e.target.value)}
                  style={{ fontSize: "10px" }}
                />
              </div>
            </div>

            <div className="modal-body">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "8px 12px" }}>Roll No</th>
                    <th style={{ padding: "8px 12px" }}>Student Name</th>
                    <th style={{ padding: "8px 12px" }}>University Roll</th>
                    <th style={{ padding: "8px 12px", textAlign: "right" }}>Attendance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {modalFilteredRecords.map((r, idx) => (
                    <tr key={r.studentId + idx}>
                      <td style={{ padding: "8px 12px", fontWeight: 600 }}>{r.roll || r.studentId}</td>
                      <td style={{ padding: "8px 12px" }}><b>{r.name}</b></td>
                      <td style={{ padding: "8px 12px", color: "var(--muted)" }}>{r.univRoll || "—"}</td>
                      <td style={{ padding: "8px 12px", textAlign: "right" }}>
                        <span className={"status " + (r.present ? "ok" : "warn")} style={{ background: r.present ? "#e5f7f0" : "#fee2e2", color: r.present ? "#138866" : "#dc2626" }}>
                          {r.present ? "✓ Present" : "✕ Absent"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
