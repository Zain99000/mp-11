import React, { useMemo, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  HashRouter, Routes, Route, NavLink, useLocation, useNavigate, useSearchParams
} from "react-router-dom";
import {
  LayoutDashboard, CalendarDays, ClipboardCheck, Users, BookOpen,
  GraduationCap, Search, ChevronDown, Menu,
  TrendingUp, Building2, UserRound, AlertCircle,
  Download, Filter, MoreHorizontal, ArrowUpRight, Sparkles,
  BarChart3, Layers3, MapPin, ShieldCheck, ArrowLeft,
  CalendarCheck2, CheckCircle2, History, FileText, ExternalLink
} from "lucide-react";
import "./styles.css";
import { SEMESTER_BRANCH_DATA, SCHEDULE_DAYS } from "./timetableData.js";
import allSchedules from "./scheduleData.json";
import { students } from "./studentsData.js";
import { AttendanceMaker } from "./AttendanceMaker.jsx";
import { AttendanceRecords } from "./AttendanceRecords.jsx";
import {
  getEnrichedStudents,
  getBranchAttendanceMap,
  getOverallAttendance,
  getTodayAttendance
} from "./attendanceStore.js";

const facultyBranches = [
  {
    code: "CSE",
    name: "Computer Science and Engineering",
    dept: "Department of Computer Science & Engineering",
    url: "https://bcetdgp.ac.in/HTML/CSE/faculties.html",
    accent: "violet",
  },
  {
    code: "CSE (AI&ML)",
    name: "CSE (AI & ML)",
    dept: "Department of Computer Science & Engineering (AI & ML)",
    url: "https://bcetdgp.ac.in/HTML/CSE-AI-&-ML/faculties.html",
    accent: "pink",
  },
  {
    code: "CSE (DS)",
    name: "CSE (Data Science)",
    dept: "Department of Computer Science & Engineering (Data Science)",
    url: "https://bcetdgp.ac.in/HTML/CSE-DATA-SCIENCE/faculties.html",
    accent: "red",
  },
  {
    code: "ECE",
    name: "Electronics & Communication Engineering",
    dept: "Department of Electronics & Communication Engineering",
    url: "https://bcetdgp.ac.in/HTML/ECE/faculty-all.html",
    accent: "cyan",
  },
  {
    code: "IT",
    name: "Information Technology",
    dept: "Department of Information Technology",
    url: "https://bcetdgp.ac.in/HTML/IT%20FINAL/faculties.html",
    accent: "blue",
  },
  {
    code: "EE",
    name: "Electrical Engineering",
    dept: "Department of Electrical Engineering",
    url: "https://bcetdgp.ac.in/HTML/EE/faculty-all.html",
    accent: "orange",
  },
  {
    code: "CE",
    name: "Civil Engineering",
    dept: "Department of Civil Engineering",
    url: "https://bcetdgp.ac.in/HTML/CIVIL/teacher.html",
    accent: "green",
  },
  {
    code: "ME",
    name: "Mechanical Engineering",
    dept: "Department of Mechanical Engineering",
    url: "https://bcetdgp.ac.in/HTML/MECHANICAL/teacher.html",
    accent: "orange",
  },
];

const schedule = [
  { day:"Monday", time:"09:00 - 10:00", code:"CS601", subject:"Machine Learning", faculty:"Dr. Neha Kapoor", room:"C-302", type:"Lecture" },
  { day:"Monday", time:"10:15 - 11:15", code:"CS603", subject:"Compiler Design", faculty:"Prof. Raj Malhotra", room:"C-201", type:"Lecture" },
  { day:"Monday", time:"12:00 - 13:00", code:"CS605", subject:"Cloud Computing", faculty:"Dr. Aman Joshi", room:"Lab 4", type:"Lab" },
  { day:"Tuesday", time:"09:00 - 10:00", code:"CS601", subject:"Machine Learning", faculty:"Dr. Neha Kapoor", room:"C-302", type:"Lecture" },
  { day:"Tuesday", time:"11:15 - 12:15", code:"HS611", subject:"Professional Ethics", faculty:"Dr. Meera Iyer", room:"A-101", type:"Lecture" },
  { day:"Tuesday", time:"14:00 - 16:00", code:"CS607", subject:"ML Lab", faculty:"Dr. Neha Kapoor", room:"AI Lab", type:"Lab" },
  { day:"Wednesday", time:"10:15 - 11:15", code:"CS603", subject:"Compiler Design", faculty:"Prof. Raj Malhotra", room:"C-201", type:"Lecture" },
  { day:"Wednesday", time:"12:00 - 13:00", code:"CS609", subject:"Cyber Security", faculty:"Prof. Sameer Jain", room:"C-104", type:"Lecture" },
  { day:"Thursday", time:"09:00 - 10:00", code:"CS605", subject:"Cloud Computing", faculty:"Dr. Aman Joshi", room:"Lab 4", type:"Lab" },
  { day:"Thursday", time:"10:15 - 11:15", code:"CS601", subject:"Machine Learning", faculty:"Dr. Neha Kapoor", room:"C-302", type:"Lecture" },
  { day:"Friday", time:"09:00 - 10:00", code:"HS611", subject:"Professional Ethics", faculty:"Dr. Meera Iyer", room:"A-101", type:"Lecture" },
  { day:"Friday", time:"11:15 - 12:15", code:"CS609", subject:"Cyber Security", faculty:"Prof. Sameer Jain", room:"C-104", type:"Lecture" },
];

const branches = [
  { code:"CSE", name:"Computer Science & Engineering", students:720, faculty:42, rooms:18, accent:"violet" },
  { code:"IT", name:"Information Technology", students:480, faculty:27, rooms:12, accent:"blue" },
  { code:"ECE", name:"Electronics & Communication", students:540, faculty:35, rooms:15, accent:"cyan" },
  { code:"ME", name:"Mechanical Engineering", students:420, faculty:31, rooms:14, accent:"orange" },
  { code:"CE", name:"Civil Engineering", students:360, faculty:25, rooms:11, accent:"green" },
  { code:"AIML", name:"Artificial Intelligence & Machine learning", students:300, faculty:19, rooms:8, accent:"pink" },
  { code: "DS", name:"Data Science", students: 5 , faculty:5,   rooms: 6 , accent:"red" },
  { code: "EE", name:"Electrical Engineering", students: 5 , faculty:5,   rooms: 6 , accent:"red"},
];

function Layout({ children }) {
  const [mobile, setMobile] = useState(false);
  const location = useLocation();
  const title = {
    "/":"Dashboard",
    "/attendance":"Mark Attendance",
    "/attendance-records":"Attendance Records",
    "/students":"Students & Attendance",
    "/schedule":"Class Schedule",
    "/branches":"B.Tech Programs",
    "/faculty":"Faculty",
    "/records":"Academic Records"
  }[location.pathname] || "CampusFlow";

  const nav = [
    ["Dashboard", "/", LayoutDashboard],
    ["Mark Attendance", "/attendance", ClipboardCheck],
    ["Attendance Records", "/attendance-records", CalendarCheck2],
    ["Students", "/students", Users],
    ["Schedule", "/schedule", CalendarDays],
    ["B.Tech Programs", "/branches", GraduationCap],
    ["Faculty", "/faculty", UserRound],
    ["Academic Records", "/records", BookOpen],
  ];

  return <div className="app-shell">
    {/* Animated video background */}
    <div className="campus-video-bg-container" aria-hidden="true">
      <video
        className="campus-video-bg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260815_030633_1712fc71-4979-4e14-98f9-9f95702ab3da.mp4" type="video/mp4" />
        <source src="/campusflow_bg.mp4" type="video/mp4" />
      </video>
      <div className="campus-video-overlay" />
    </div>

    <aside className={"sidebar " + (mobile ? "mobile-open" : "")}>
      <div className="brand">
        <div className="brand-mark"><Sparkles size={19}/></div>
        <div><b>CampusFlow</b><span>Engineering OS</span></div>
      </div>
      <div className="workspace">
        <div className="workspace-icon"><Building2 size={16}/></div>
        <div><b>Bengal college of engineering & technology</b><span>Admin Workspace</span></div>
        <ChevronDown size={15}/>
      </div>
      <div className="nav-label">MAIN MENU</div>
      <nav>
        {nav.map(([label,to,Icon])=><NavLink key={to} to={to} onClick={()=>setMobile(false)} className={({isActive})=>isActive?"active":""}>
          <Icon size={18}/><span>{label}</span>
        </NavLink>)}
      </nav>
      <nav style={{ marginTop: "10px" }}>
        <a href="/"><ArrowLeft size={18}/><span>Back to Asme</span></a>
      </nav>
      <div className="sidebar-bottom">
        <div className="help-card"><ShieldCheck size={20}/><div><b>System secure</b><span>All services operational</span></div></div>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="icon-btn menu-btn" onClick={()=>setMobile(true)}><Menu/></button>
        <div><div className="eyebrow">Bengal college of engineering & technology / 2026–27</div><h1>{title}</h1></div>
        <div className="top-actions">
          <div className="search"><Search size={17}/><input placeholder="Search students, classes..." /></div>
          <div className="avatar purple">AD</div>
        </div>
      </header>
      <div className="page">{children}</div>
    </main>
  </div>
}

function StatCard({label,value,sub,icon:Icon,trend}) {
  return <div className="stat-card">
    <div className="stat-icon"><Icon size={19}/></div>
    <div className="stat-copy"><span>{label}</span><strong>{value}</strong><small className={trend?.startsWith("+")?"positive":""}>{trend || sub}</small></div>
    <ArrowUpRight size={17} className="stat-arrow"/>
  </div>
}

function AttendanceRing({value=0, size=150}) {
  const r=50, c=2*Math.PI*r, dash=(value/100)*c;
  return <div className="ring-wrap" style={{width:size,height:size}}>
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--line)" strokeWidth="10"/>
      <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${dash} ${c-dash}`} transform="rotate(-90 60 60)"/>
    </svg>
    <div className="ring-label"><strong>{value}%</strong><span>Overall Attendance</span></div>
  </div>
}

function Dashboard() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [attVersion, setAttVersion] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentDate(new Date()), 30000);
    const handler = () => setAttVersion(v => v + 1);
    window.addEventListener("cf_attendance_updated", handler);
    return () => {
      clearInterval(interval);
      window.removeEventListener("cf_attendance_updated", handler);
    };
  }, []);

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDay = dayNames[currentDate.getDay()];
  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short"
  });

  const hour = currentDate.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const todayClasses = (allSchedules["3rd_CSE"] || []).filter(x => x.day === currentDay);
  const totalClassesToday = todayClasses.length * 8; // Across all 8 branches

  // Live dynamic attendance data
  const dateIso = currentDate.toISOString().split("T")[0];
  const todayAtt = useMemo(() => getTodayAttendance(dateIso), [dateIso, attVersion]);
  const overallAtt = useMemo(() => getOverallAttendance(), [attVersion]);
  const branchAttMap = useMemo(() => getBranchAttendanceMap(), [attVersion]);
  const enrichedStudents = useMemo(() => getEnrichedStudents(), [attVersion]);
  const defaulters = useMemo(() => {
    return enrichedStudents.filter(s => s.totalSessions > 0 && s.attendance < 75);
  }, [enrichedStudents]);

  return <>
    <section className="welcome">
      <div>
        <div className="pill"><Sparkles size={14}/> Smart campus automation</div>
        <h2>{greeting}, Admin.</h2>
        <p>Here’s what’s happening across your engineering campus today ({currentDay}).</p>
      </div>
      <div className="date-card">
        <CalendarDays size={18}/>
        <div>
          <b>{formattedDate}</b>
          <span>Odd Semester · 2026–27</span>
        </div>
      </div>
    </section>
    <div className="stats-grid">
      <StatCard label="Total Students" value="207" trend="Official BCET Cohort" icon={Users}/>
      <StatCard
        label="Today's Attendance"
        value={todayAtt.percentage + "%"}
        trend={todayAtt.sessionCount > 0 ? `+${todayAtt.percentage}% marked today` : "0% (No classes marked)"}
        sub={todayAtt.sessionCount > 0 ? `${todayAtt.sessionCount} class session(s) marked today` : "0 sessions marked today"}
        icon={ClipboardCheck}
      />
      <StatCard
        label="Classes Today"
        value={totalClassesToday > 0 ? String(totalClassesToday) : "0"}
        sub={totalClassesToday > 0 ? `${todayClasses.filter(x => x.type === "Lab").length * 8} labs · ${todayClasses.filter(x => x.type !== "Lab").length * 8} lectures` : "No classes scheduled"}
        icon={CalendarDays}
      />
      <StatCard label="Faculty On Campus" value="128" sub="All departments active" icon={UserRound}/>
    </div>
    <div className="dashboard-grid">
      <section className="panel attendance-panel">
        <div className="panel-head">
          <div>
            <h3>Attendance overview</h3>
            <p>Overall campus attendance ({overallAtt.totalSessions} sessions recorded)</p>
          </div>
          <NavLink to="/attendance-records" className="ghost-btn">
            View records <ArrowUpRight size={15}/>
          </NavLink>
        </div>
        <div className="attendance-content">
          <AttendanceRing value={overallAtt.percentage}/>
          <div className="att-bars">
            {[
              ["CSE A", branchAttMap["CSE A"] || 0],
              ["CSE B", branchAttMap["CSE B"] || 0],
              ["CSE C", branchAttMap["CSE C"] || 0],
              ["AIML", branchAttMap["AIML"] || 0],
              ["IT", branchAttMap["IT"] || 0],
            ].map(([b, pct]) => (
              <div className="bar-row" key={b}>
                <span>{b}</span>
                <div className="bar"><i style={{ width: pct + "%" }}></i></div>
                <b>{pct}%</b>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="panel today-panel">
        <div className="panel-head">
          <div>
            <h3>Today’s classes</h3>
            <p>{currentDay} · 3rd Semester CSE</p>
          </div>
          <NavLink to={`/schedule?sem=3rd&branch=CSE`} className="text-link">Full schedule →</NavLink>
        </div>
        <div className="timeline">
          {todayClasses.length === 0 ? (
            <div style={{ padding: "34px 18px", textAlign: "center", color: "var(--muted)", fontSize: "11px" }}>
              No classes scheduled for {currentDay} ({currentDay === "Sunday" || currentDay === "Monday" ? "College Off-day" : "No sessions"}). Regular timetable runs Tuesday through Saturday.
            </div>
          ) : (
            todayClasses.map((x, i) => (
              <div className={"timeline-item " + (i === 0 ? "current" : "")} key={x.code + x.time + i}>
                <div className="time">{x.time.split(" - ")[0]}</div>
                <div className="dot"></div>
                <div className="class-info">
                  <b>{x.subject}</b>
                  <span>{x.code} · {x.faculty}</span>
                  <small><MapPin size={12}/> {x.room}</small>
                </div>
                {i === 0 && <span className="live">NOW</span>}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
    <div className="dashboard-grid lower">
      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>Attendance alerts</h3>
            <p>Students below the 75% threshold</p>
          </div>
          <NavLink to="/students" className="text-link">Manage →</NavLink>
        </div>
        <div className="mini-table">
          {defaulters.length === 0 ? (
            <div style={{ padding: "26px 16px", textAlign: "center", color: "var(--muted)", fontSize: "11px", lineHeight: "1.5" }}>
              {overallAtt.totalSessions === 0
                ? "Attendance initialized at 0%. Defaulters (< 75%) will automatically populate once teachers submit class attendance."
                : "Great standing! No students currently fall below the 75% minimum threshold."}
            </div>
          ) : (
            defaulters.slice(0, 6).map(s => (
              <div className="mini-row" key={s.id}>
                <div className="avatar">{s.avatar}</div>
                <div><b>{s.name}</b><span>{s.id} · {s.branch}</span></div>
                <strong className="danger">{s.attendance}%</strong>
                <AlertCircle size={17}/>
              </div>
            ))
          )}
        </div>
      </section>
      <section className="panel">
        <div className="panel-head"><div><h3>Quick actions</h3><p>Common administrative tasks</p></div></div>
        <div className="quick-grid">
          <NavLink to="/attendance"><ClipboardCheck/><b>Mark attendance</b><span>Take today’s class attendance</span></NavLink>
          <NavLink to="/attendance-records"><CalendarCheck2/><b>Attendance records</b><span>View past marked sessions</span></NavLink>
          <NavLink to="/schedule"><CalendarDays/><b>Build schedule</b><span>Manage rooms & faculty</span></NavLink>
          <NavLink to="/students"><Users/><b>Students roster</b><span>207 students enrolled</span></NavLink>
        </div>
      </section>
    </div>
  </>
}

function Students() {
  const [attVersion, setAttVersion] = useState(0);

  useEffect(() => {
    const handler = () => setAttVersion(v => v + 1);
    window.addEventListener("cf_attendance_updated", handler);
    return () => window.removeEventListener("cf_attendance_updated", handler);
  }, []);

  const studentList = useMemo(() => getEnrichedStudents(), [attVersion]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const totalCount = studentList.length;
  const recordedStudents = studentList.filter(s => s.totalSessions > 0);
  const above75 = studentList.filter(s => s.totalSessions > 0 && s.attendance >= 75).length;
  const above75Pct = recordedStudents.length > 0 ? ((above75 / recordedStudents.length) * 100).toFixed(1) : "0.0";
  const alerts = studentList.filter(s => s.totalSessions > 0 && s.attendance < 75).length;
  const alertsPct = recordedStudents.length > 0 ? ((alerts / recordedStudents.length) * 100).toFixed(1) : "0.0";
  const perfect = studentList.filter(s => s.totalSessions > 0 && s.attendance >= 95).length;
  const perfectPct = recordedStudents.length > 0 ? ((perfect / recordedStudents.length) * 100).toFixed(1) : "0.0";

  const filtered = studentList.filter(s => {
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      (s.univRoll && s.univRoll.toLowerCase().includes(q)) ||
      s.branch.toLowerCase().includes(q);
    const matchesBranch =
      filter === "All" ||
      s.branch === filter ||
      (filter === "CSE" && s.branch.startsWith("CSE"));
    return matchesQuery && matchesBranch;
  });

  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <h2>Students & Attendance</h2>
          <p>Official student directory and attendance standing ({totalCount} enrolled students across 5 branches).</p>
        </div>
        <NavLink to="/attendance" className="primary-btn">
          <ClipboardCheck size={16}/> Mark Attendance
        </NavLink>
      </div>

      <div className="substats">
        <div><span>Total students</span><b>{totalCount}</b></div>
        <div><span>Above 75% attendance</span><b>{above75}</b><em>{above75Pct}%</em></div>
        <div><span>Attendance alerts (&lt;75%)</span><b>{alerts}</b><em className="red">{alertsPct}%</em></div>
        <div><span>High attendance (≥95%)</span><b>{perfect}</b><em>{perfectPct}%</em></div>
      </div>

      <section className="panel table-panel">
        <div className="toolbar">
          <div className="search table-search">
            <Search size={16}/>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, roll no, or branch..."
            />
          </div>
          <div className="filter-pills">
            {["All", "CSE A", "CSE B", "CSE C", "AIML", "IT"].map(f => (
              <button
                className={filter === f ? "selected" : ""}
                onClick={() => setFilter(f)}
                key={f}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Branch</th>
                <th>Semester</th>
                <th>Attendance</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id + (s.univRoll || "")}>
                  <td>
                    <div className="person-cell">
                      <div className="avatar">{s.avatar}</div>
                      <div>
                        <b>{s.name}</b>
                        <span>Roll: {s.id}{s.univRoll && s.univRoll !== s.id ? ` · Univ: ${s.univRoll}` : ""}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="tag">{s.branch}</span></td>
                  <td>Semester {s.semester}</td>
                  <td>
                    <div className="attendance-cell">
                      <div className="mini-progress"><i style={{ width: s.attendance + "%" }}></i></div>
                      <b>{s.attendance}%</b>
                      {s.totalSessions > 0 ? (
                        <small style={{ fontSize: "8px", color: "var(--muted)", marginLeft: "4px" }}>
                          ({s.attendedCount}/{s.totalSessions})
                        </small>
                      ) : (
                        <small style={{ fontSize: "8px", color: "var(--muted)", marginLeft: "4px" }}>
                          (0 sessions)
                        </small>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={"status " + (s.status === "Critical" || s.status === "Warning" ? "warn" : s.status === "Pending" ? "" : "ok")} style={s.status === "Pending" ? { background: "#f1f3f8", color: "#6b7280" } : {}}>
                      {s.status}
                    </span>
                  </td>
                  <td><button className="icon-btn"><MoreHorizontal size={17}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Schedule() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSem = searchParams.get("sem") || "3rd";
  const urlBranch = searchParams.get("branch") || "CSE";
  const [sem, setSem] = useState(urlSem);
  const [branch, setBranch] = useState(urlBranch);
  const days = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const realDay = dayNames[new Date().getDay()];
  const initialDay = days.includes(realDay) ? realDay : "Tuesday";
  const [day, setDay] = useState(initialDay);

  useEffect(() => {
    const s = searchParams.get("sem");
    const b = searchParams.get("branch");
    if (s && s !== sem) setSem(s);
    if (b && b !== branch) setBranch(b);
  }, [searchParams]);

  const scheduleKey = `${sem}_${branch}`;
  const classList = allSchedules[scheduleKey] || [];
  const filtered = classList.filter(s => s.day === day);
  const currentBranchInfo = (SEMESTER_BRANCH_DATA[sem] || []).find(b => b.code === branch);
  const assignedRoom = currentBranchInfo ? currentBranchInfo.roomName : "Allocated Lecture Hall";

  return <div className="page-stack">
    <div className="page-intro">
      <div>
        <h2>Class Schedule</h2>
        <p>Timetable, rooms and faculty assignments for every branch & semester.</p>
      </div>
    </div>
    <div className="schedule-controls">
      <div className="select">
        <Layers3 size={16}/>
        <select
          value={sem}
          onChange={e => {
            const nextSem = e.target.value;
            setSem(nextSem);
            setSearchParams({ sem: nextSem, branch });
          }}
        >
          <option value="3rd">3rd Sem</option>
          <option value="5th">5th Sem</option>
          <option value="7th">7th Sem</option>
        </select>
      </div>
      <div className="select">
        <GraduationCap size={16}/>
        <select
          value={branch}
          onChange={e => {
            const nextBranch = e.target.value;
            setBranch(nextBranch);
            setSearchParams({ sem, branch: nextBranch });
          }}
        >
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
          <option value="CE">CE</option>
          <option value="AIML">AIML</option>
          <option value="DS">DS</option>
          <option value="EE">EE</option>
        </select>
      </div>
      <div className="day-tabs">
        {days.map(d => (
          <button
            className={day === d ? "active" : ""}
            onClick={() => setDay(d)}
            key={d}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
    <section className="panel schedule-panel">
      <div className="schedule-head">
        <div>
          <h3>{sem} Semester · {branch} ({day})</h3>
          <p>09:30 AM — 05:20 PM · Odd Semester 2026–27 · BCET Durgapur</p>
        </div>
        <span className="room-note">
          <Building2 size={14}/> Room: {assignedRoom}
        </span>
      </div>
      <div className="schedule-list">
        {filtered.length === 0 ? (
          <div style={{ padding: "34px 20px", textAlign: "center", color: "#8a94a6", fontSize: "11px" }}>
            No scheduled classes or labs for {day} ({sem} Sem {branch}).
          </div>
        ) : (
          filtered.map((x, i) => (
            <div className="schedule-card" key={x.code + x.time + i}>
              <div className="schedule-time">
                <b>{x.time.split(" - ")[0]}</b>
                <span>{x.time.split(" - ")[1]}</span>
              </div>
              <div className="schedule-line"></div>
              <div className="schedule-main">
                <div className="subject-icon">
                  <BookOpen size={18}/>
                </div>
                <div>
                  <div className="subject-title">
                    <b>{x.subject}</b>
                    <span className={"type " + (x.type === "Lab" ? "lab" : "")}>{x.type}</span>
                  </div>
                  <span className="muted">{x.code} · Faculty: {x.faculty}</span>
                  <small><MapPin size={12}/> {x.room}</small>
                </div>
              </div>
              <button className="icon-btn" title="Class options"><MoreHorizontal size={18}/></button>
            </div>
          ))
        )}
      </div>
    </section>
  </div>
}

function Branches() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSem, setSelectedSem] = useState(searchParams.get("sem") || null);
  const [selected, setSelected] = useState(null);

  const semCards = [
    {
      sem: "3rd",
      year: "2nd Year B.Tech",
      batches: "2024–2028 Batch",
      desc: "Core departmental foundations, data structures, electronics, mechanics & mathematics.",
      students: 970,
      faculty: 77,
      rooms: 13
    },
    {
      sem: "5th",
      year: "3rd Year B.Tech",
      batches: "2023–2027 Batch",
      desc: "Advanced core engineering, compiler design, professional electives & system labs.",
      students: 950,
      faculty: 79,
      rooms: 11
    },
    {
      sem: "7th",
      year: "4th Year B.Tech",
      batches: "2022–2026 Batch",
      desc: "Major projects, open electives, cloud computing, campus placements & grooming.",
      students: 940,
      faculty: 75,
      rooms: 12
    },
  ];

  if (!selectedSem) {
    return <div className="page-stack">
      <div className="page-intro">
        <div>
          <h2>Select Academic Semester</h2>
          <p>Choose your semester first to view departmental programs, classroom allocations and schedules.</p>
        </div>
      </div>
      <div className="sem-selection-grid">
        {semCards.map(s => (
          <div
            key={s.sem}
            className="sem-card"
            onClick={() => {
              setSelectedSem(s.sem);
              setSelected(null);
            }}
          >
            <div>
              <div className="sem-card-top">
                <span className="sem-badge">ODD SEMESTER 2026–27</span>
                <ArrowUpRight size={18} style={{ color: "#8a94a6" }} />
              </div>
              <h3>{s.sem} Sem</h3>
              <p style={{ fontWeight: 600, color: "#6255dc", marginBottom: "8px" }}>{s.year} · {s.batches}</p>
              <p>{s.desc}</p>
              <div className="sem-card-stats">
                <span><Users size={13}/> {s.students} students</span>
                <span><Building2 size={13}/> {s.rooms} rooms</span>
              </div>
            </div>
            <div className="sem-card-footer">
              <span>Explore {s.sem} Sem B.Tech Programs</span>
              <ArrowUpRight size={15}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  }

  const branchesForSem = SEMESTER_BRANCH_DATA[selectedSem] || SEMESTER_BRANCH_DATA["3rd"];

  return <div className="page-stack">
    <div className="page-intro">
      <div>
        <h2>B.Tech Programs · {selectedSem} Semester</h2>
        <p>Departments, cohorts, classrooms and program capacity for {selectedSem} Sem (2026–27).</p>
      </div>
      <button
        className="ghost-btn"
        onClick={() => {
          setSelectedSem(null);
          setSelected(null);
        }}
      >
        <ArrowLeft size={16}/> Choose another semester
      </button>
    </div>

    <div className="sem-nav-bar">
      <div className="sem-pill-tabs">
        {["3rd", "5th", "7th"].map(s => (
          <button
            key={s}
            className={selectedSem === s ? "active" : ""}
            onClick={() => {
              setSelectedSem(s);
              setSelected(null);
            }}
          >
            {s} Semester
          </button>
        ))}
      </div>
      <span className="room-note">
        <Building2 size={14}/> Showing all 8 engineering branches for {selectedSem} Sem
      </span>
    </div>

    <div className="branch-grid">
      {branchesForSem.map(b => (
        <button
          className={"branch-card " + b.accent}
          key={b.code}
          onClick={() => setSelected(b)}
        >
          <div className="branch-top">
            <span className="branch-code">{b.code}</span>
            <ArrowUpRight size={18}/>
          </div>
          <h3>{b.name}</h3>
          <div className="branch-metrics">
            <span><Users size={14}/>{b.students} students</span>
            <span><UserRound size={14}/>{b.faculty} faculty</span>
            <span><Building2 size={14}/>{b.roomName}</span>
          </div>
          <div className="capacity">
            <div>
              <span>Capacity utilization</span>
              <b>{Math.min(98, Math.round(b.students / 2.7))}%</b>
            </div>
            <div className="bar">
              <i style={{ width: Math.min(98, Math.round(b.students / 2.7)) + "%" }}></i>
            </div>
          </div>
        </button>
      ))}
    </div>

    {selected && (
      <section className="panel branch-detail">
        <div>
          <span className="eyebrow">PROGRAM OVERVIEW</span>
          <h3>{selected.name} · {selectedSem} Sem</h3>
          <p>
            Assigned classroom: {selected.roomName} · {selected.faculty} faculty allocation · {selected.students} enrolled students for {selectedSem} semester.
          </p>
        </div>
        <div className="detail-actions">
          <button className="ghost-btn" onClick={() => setSelected(null)}>
            Close
          </button>
          <NavLink
            className="primary-btn"
            to={`/schedule?sem=${selectedSem}&branch=${selected.code}`}
          >
            View schedule
          </NavLink>
        </div>
      </section>
    )}
  </div>
}

function Faculty() {
  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <h2>Faculty Directory</h2>
          <p>Select any B.Tech branch to view its faculty members and teaching staff.</p>
        </div>
      </div>

      <div className="branch-grid">
        {facultyBranches.map((b) => (
          <a
            className={"branch-card " + b.accent}
            key={b.code}
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "180px" }}
            title={`View ${b.name} Faculty Directory`}
          >
            <div>
              <div className="branch-top">
                <span className="branch-code">{b.code}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "var(--primary)", fontWeight: 600 }}>
                  <span>View Faculty</span>
                  <ArrowUpRight size={16} />
                </span>
              </div>
              <h3 style={{ margin: "14px 0 6px", fontSize: "14px", lineHeight: "1.3", color: "var(--text)" }}>{b.name}</h3>
              <p style={{ margin: 0, fontSize: "9px", color: "var(--muted)" }}>{b.dept}</p>
            </div>

            <div style={{ borderTop: "1px solid #f0f1f5", marginTop: "16px", paddingTop: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "9px", color: "#8a94a6", display: "flex", alignItems: "center", gap: "5px" }}>
                <UserRound size={13} style={{ color: "var(--primary)" }} />
                BCET Faculty Portal
              </span>
              <span style={{ fontSize: "9px", fontWeight: 700, color: "#6255dc", background: "#eeecff", padding: "3px 9px", borderRadius: "12px" }}>
                Open Directory ↗
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

const PLACEMENT_LISTS = [
  {
    year: "2026",
    title: "Placement-2026",
    displayName: "Placement List 2026",
    batch: "2022–2026 Batch",
    program: "B.Tech Programs",
    desc: "B.Tech final placement list, recruiters drive records and campus selection statistics.",
    url: "https://bcetdgp.ac.in/wp-content/uploads/2026/08/Placement-2026-1.pdf",
    studentListUrl: "https://bcetdgp.ac.in/wp-content/uploads/2026/08/Placed-Student-List-2026-1.pdf",
    accent: "blue"
  },
  {
    year: "2025",
    title: "Placement-2025",
    displayName: "Placement List 2025",
    batch: "2021–2025 Batch",
    program: "B.Tech Programs",
    desc: "B.Tech campus placement status, recruitment report and corporate hiring roll.",
    url: "https://bcetdgp.ac.in/wp-content/uploads/2025/08/Placement-2025-1.pdf",
    studentListUrl: "https://bcetdgp.ac.in/wp-content/uploads/2025/08/Placed-Student-List-2025-2.pdf",
    accent: "violet"
  },
  {
    year: "2024",
    title: "Placement-2024",
    displayName: "Placement List 2024",
    batch: "2020–2024 Batch",
    program: "B.Tech Programs",
    desc: "Official placement report and campus recruitment offers for graduating B.Tech students.",
    url: "https://bcetdgp.ac.in/wp-content/uploads/2025/02/PLACEMENT-2024-1.pdf",
    studentListUrl: "https://bcetdgp.ac.in/wp-content/uploads/2025/02/Placed-Student-List-2024-1.pdf",
    accent: "cyan"
  },
  {
    year: "2023",
    title: "Placement-2023",
    displayName: "Placement List 2023",
    batch: "2019–2023 Batch",
    program: "B.Tech Programs",
    desc: "Comprehensive list of placed B.Tech students and companies visiting BCET campus.",
    url: "https://bcetdgp.ac.in/wp-content/uploads/2024/03/Placement-2023.pdf",
    studentListUrl: "https://bcetdgp.ac.in/wp-content/uploads/2024/03/Placed-Students-list-2023.pdf",
    accent: "green"
  },
  {
    year: "2022",
    title: "Placement-2022",
    displayName: "Placement List 2022",
    batch: "2018–2022 Batch",
    program: "B.Tech Programs",
    desc: "Annual recruitment report and career placement list for B.Tech engineering departments.",
    url: "https://bcetdgp.ac.in/wp-content/uploads/2024/03/Placement-2022.pdf",
    studentListUrl: "https://bcetdgp.ac.in/wp-content/uploads/2024/03/Placed-Students-list-2022.pdf",
    accent: "orange"
  },
  {
    year: "2021",
    title: "Placement – 2021",
    displayName: "Placement List 2021",
    batch: "2017–2021 Batch",
    program: "B.Tech Programs",
    desc: "Official placement record and corporate selection statistics for B.Tech cohorts.",
    url: "https://bcetdgp.ac.in/wp-content/uploads/2024/03/Placement-2021.pdf",
    studentListUrl: "https://bcetdgp.ac.in/wp-content/uploads/2024/03/Placed-Students-list-2021.pdf",
    accent: "pink"
  },
  {
    year: "2020",
    title: "Placement – 2020",
    displayName: "Placement List 2020",
    batch: "2016–2020 Batch",
    program: "B.Tech Programs",
    desc: "Official placement documentation and hiring records for 2020 passout B.Tech batch.",
    url: "https://bcetdgp.ac.in/wp-content/uploads/2024/03/Placement-2020.pdf",
    studentListUrl: null,
    accent: "red"
  },
  {
    year: "2019",
    title: "Placement – 2019",
    displayName: "Placement List 2019",
    batch: "2015–2019 Batch",
    program: "B.Tech Programs",
    desc: "Placement status report and campus placement verification for 2019 B.Tech graduates.",
    url: "https://bcetdgp.ac.in/wp-content/uploads/2024/03/Placement-2019.pdf",
    studentListUrl: null,
    accent: "blue"
  },
  {
    year: "2018",
    title: "Placement – 2018",
    displayName: "Placement List 2018",
    batch: "2014–2018 Batch",
    program: "B.Tech Programs",
    desc: "Annual campus placement and recruitment record from BCET Durgapur official records.",
    url: "https://bcetdgp.ac.in/wp-content/uploads/2024/03/Placement-2018.pdf",
    studentListUrl: null,
    accent: "violet"
  },
  {
    year: "2017",
    title: "Placement – 2017",
    displayName: "Placement List 2017",
    batch: "2013–2017 Batch",
    program: "B.Tech Programs",
    desc: "Official 2017 B.Tech recruitment summary and placed students directory.",
    url: "https://bcetdgp.ac.in/wp-content/uploads/2024/03/Placement-2017.pdf",
    studentListUrl: null,
    accent: "green"
  }
];

function Records() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" (2026 -> 2017) or "asc" (2017 -> 2026)
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "table"

  const filteredLists = useMemo(() => {
    let result = PLACEMENT_LISTS.filter(item => {
      const q = searchTerm.toLowerCase().trim();
      if (!q) return true;
      return (
        item.year.includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.batch.toLowerCase().includes(q) ||
        item.program.toLowerCase().includes(q)
      );
    });

    return [...result].sort((a, b) => {
      const numA = parseInt(a.year, 10);
      const numB = parseInt(b.year, 10);
      return sortOrder === "desc" ? numB - numA : numA - numB;
    });
  }, [searchTerm, sortOrder]);

  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <h2>Academic Records · Placement Status</h2>
          <p>
            Official B.Tech Programs placement lists and recruitment reports from{" "}
            <a
              href="https://bcetdgp.ac.in/placement-status/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#6255dc", textDecoration: "underline", fontWeight: 600 }}
            >
              bcetdgp.ac.in/placement-status
            </a>{" "}
            (2017 – 2026).
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <a
            href="https://bcetdgp.ac.in/placement-status/"
            target="_blank"
            rel="noopener noreferrer"
            className="ghost-btn"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <ExternalLink size={15} /> Official BCET Portal
          </a>
        </div>
      </div>

      {/* Overview Stat Banner */}
      <div className="sem-nav-bar" style={{ flexWrap: "wrap", gap: "10px" }}>
        <div className="sem-pill-tabs">
          <button
            className={sortOrder === "desc" ? "active" : ""}
            onClick={() => setSortOrder("desc")}
            title="Sort Newest First (2026 to 2017)"
          >
            2026 → 2017 (Newest First)
          </button>
          <button
            className={sortOrder === "asc" ? "active" : ""}
            onClick={() => setSortOrder("asc")}
            title="Sort Chronological (2017 to 2026)"
          >
            2017 → 2026 (Chronological)
          </button>
        </div>

        <div style={{ display: "flex", gap: "8px", marginLeft: "auto", alignItems: "center" }}>
          <div className="table-search" style={{ margin: 0, width: "220px" }}>
            <Search size={14} />
            <input
              type="text"
              placeholder="Search placement year..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sem-pill-tabs">
            <button
              className={viewMode === "cards" ? "active" : ""}
              onClick={() => setViewMode("cards")}
            >
              Cards
            </button>
            <button
              className={viewMode === "table" ? "active" : ""}
              onClick={() => setViewMode("table")}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Card Grid View (Styled like B.Tech Programs section) */}
      {viewMode === "cards" ? (
        <div className="branch-grid">
          {filteredLists.map(item => (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={"branch-card " + item.accent}
              key={item.year}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer"
              }}
            >
              <div>
                <div className="branch-top">
                  <span className="branch-code">{item.year}</span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11px",
                      color: "#6255dc",
                      fontWeight: 600
                    }}
                  >
                    PDF <ArrowUpRight size={16} />
                  </span>
                </div>
                <h3 style={{ margin: "11px 0 6px" }}>{item.title}</h3>
                <p style={{ fontSize: "10px", color: "#8a94a6", margin: "0 0 12px", lineHeight: "1.4" }}>
                  {item.desc}
                </p>
                <div className="branch-metrics">
                  <span>
                    <GraduationCap size={13} /> {item.program}
                  </span>
                  <span>
                    <FileText size={13} /> Official PDF
                  </span>
                  <span>
                    <Building2 size={13} /> BCET Durgapur
                  </span>
                </div>
              </div>

              <div>
                <div className="capacity" style={{ marginTop: "14px" }}>
                  <div>
                    <span>Academic Batch</span>
                    <b style={{ color: "#ffffff" }}>{item.batch}</b>
                  </div>
                  <div className="bar">
                    <i style={{ width: "100%", background: "#6255dc" }}></i>
                  </div>
                </div>

                <div className="sem-card-footer" style={{ marginTop: "12px", paddingTop: "10px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <Download size={13} /> Open {item.year} Placement List
                  </span>
                  <ArrowUpRight size={15} />
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        /* Table View */
        <section className="panel table-panel">
          <div className="toolbar">
            <div>
              <h3>B.Tech Placement List Directory</h3>
              <p>Official annual placement registers from 2017 to 2026 · BCET Durgapur</p>
            </div>
            <span className="room-note">
              <Building2 size={14} /> Showing {filteredLists.length} of {PLACEMENT_LISTS.length} Years
            </span>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Placement List Document</th>
                  <th>Academic Batch</th>
                  <th>Program</th>
                  <th>Source Domain</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLists.map(r => (
                  <tr key={r.year}>
                    <td>
                      <span className="tag" style={{ fontWeight: 700, fontSize: "11px" }}>
                        {r.year}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FileText size={16} style={{ color: "#6255dc", flexShrink: 0 }} />
                        <div>
                          <b style={{ fontSize: "12px" }}>{r.title}</b>
                          <div style={{ fontSize: "9px", color: "#8a94a6" }}>{r.desc}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "#ffffff" }}>
                        {r.batch}
                      </span>
                    </td>
                    <td>
                      <span className="grade" style={{ background: "rgba(99, 85, 220, 0.25)", color: "#c4bdff", border: "1px solid rgba(139, 124, 255, 0.3)" }}>
                        {r.program}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "10px", color: "#8a94a6" }}>bcetdgp.ac.in</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px", justifyContent: "flex-end" }}>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="primary-btn"
                          style={{
                            padding: "6px 12px",
                            fontSize: "11px",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px"
                          }}
                        >
                          <Download size={13} /> Open PDF <ArrowUpRight size={13} />
                        </a>
                        {r.studentListUrl && (
                          <a
                            href={r.studentListUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ghost-btn"
                            title={`Placed Students List ${r.year}`}
                            style={{
                              padding: "6px 10px",
                              fontSize: "10px",
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            <Users size={12} /> Student Roll
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Additional Departmental & Student Lists from bcetdgp.ac.in */}
      <section className="panel" style={{ padding: "18px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: "14px" }}>Branch-wise & Placed Student Registries</h3>
            <p style={{ margin: 0, fontSize: "10px", color: "var(--muted)" }}>
              Supplementary B.Tech departmental placement registers available on bcetdgp.ac.in
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px" }}>
          <a
            href="https://bcetdgp.ac.in/wp-content/uploads/2026/06/Computer-Science-Engineering-Placement-List-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="ghost-btn"
            style={{
              justifyContent: "space-between",
              padding: "10px 14px",
              textDecoration: "none",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#ffffff"
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
              <FileText size={15} style={{ color: "#6255dc" }} />
              CSE Placement List - 2026
            </span>
            <ArrowUpRight size={15} />
          </a>

          <a
            href="https://bcetdgp.ac.in/wp-content/uploads/2026/06/Information-Technology-Placement-List-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="ghost-btn"
            style={{
              justifyContent: "space-between",
              padding: "10px 14px",
              textDecoration: "none",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#ffffff"
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
              <FileText size={15} style={{ color: "#28b9ce" }} />
              IT Placement List - 2026
            </span>
            <ArrowUpRight size={15} />
          </a>

          <a
            href="https://bcetdgp.ac.in/wp-content/uploads/2026/08/Placed-Student-List-2026-1.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="ghost-btn"
            style={{
              justifyContent: "space-between",
              padding: "10px 14px",
              textDecoration: "none",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#ffffff"
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
              <Users size={15} style={{ color: "#35b783" }} />
              Placed Students List 2026
            </span>
            <ArrowUpRight size={15} />
          </a>

          <a
            href="https://bcetdgp.ac.in/wp-content/uploads/2025/08/Placed-Student-List-2025-2.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="ghost-btn"
            style={{
              justifyContent: "space-between",
              padding: "10px 14px",
              textDecoration: "none",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#ffffff"
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
              <Users size={15} style={{ color: "#ef9951" }} />
              Placed Students List 2025
            </span>
            <ArrowUpRight size={15} />
          </a>
        </div>
      </section>
    </div>
  );
}

function App(){
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/attendance" element={<AttendanceMaker/>}/>
        <Route path="/attendance-records" element={<AttendanceRecords/>}/>
        <Route path="/students" element={<Students/>}/>
        <Route path="/schedule" element={<Schedule/>}/>
        <Route path="/branches" element={<Branches/>}/>
        <Route path="/faculty" element={<Faculty/>}/>
        <Route path="/records" element={<Records/>}/>
      </Routes>
    </Layout>
  );
}

createRoot(document.getElementById("root")).render(<HashRouter><App/></HashRouter>);