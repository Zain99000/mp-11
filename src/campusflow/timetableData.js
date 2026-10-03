// Timetable data extracted from Bengal College of Engineering & Technology Odd Semester (3rd, 5th & 7th B.Tech) 2026-27

export const SEMESTERS = ["3rd", "5th", "7th"];

export const BRANCH_LIST = [
  { code: "CSE", name: "Computer Science & Engineering", accent: "violet" },
  { code: "IT", name: "Information Technology", accent: "blue" },
  { code: "ECE", name: "Electronics & Communication", accent: "cyan" },
  { code: "ME", name: "Mechanical Engineering", accent: "orange" },
  { code: "CE", name: "Civil Engineering", accent: "green" },
  { code: "AIML", name: "CSE (Artificial Intelligence & Machine Learning)", accent: "pink" },
  { code: "DS", name: "CSE (Data Science)", accent: "red" },
  { code: "EE", name: "Electrical Engineering", accent: "red" },
];

export const SEMESTER_BRANCH_DATA = {
  "3rd": [
    { code: "CSE", name: "Computer Science & Engineering", students: 240, faculty: 18, rooms: 3, roomName: "LH-111, LH-112, LH-123", accent: "violet" },
    { code: "IT", name: "Information Technology", students: 120, faculty: 10, rooms: 2, roomName: "LH-123 (C+IT)", accent: "blue" },
    { code: "ECE", name: "Electronics & Communication", students: 180, faculty: 14, rooms: 2, roomName: "LH-240", accent: "cyan" },
    { code: "ME", name: "Mechanical Engineering", students: 140, faculty: 11, rooms: 2, roomName: "LH-225", accent: "orange" },
    { code: "CE", name: "Civil Engineering", students: 120, faculty: 9, rooms: 2, roomName: "LH-531", accent: "green" },
    { code: "AIML", name: "CSE (AI & ML)", students: 100, faculty: 8, rooms: 1, roomName: "LH-131", accent: "pink" },
    { code: "DS", name: "CSE (Data Science)", students: 80, faculty: 7, rooms: 1, roomName: "LH-122", accent: "red" },
    { code: "EE", name: "Electrical Engineering", students: 90, faculty: 8, rooms: 1, roomName: "LH-222", accent: "red" },
  ],
  "5th": [
    { code: "CSE", name: "Computer Science & Engineering", students: 240, faculty: 19, rooms: 3, roomName: "LH-124, LH-136, LH-132", accent: "violet" },
    { code: "IT", name: "Information Technology", students: 120, faculty: 11, rooms: 1, roomName: "LH-121", accent: "blue" },
    { code: "ECE", name: "Electronics & Communication", students: 180, faculty: 14, rooms: 2, roomName: "LH-238", accent: "cyan" },
    { code: "ME", name: "Mechanical Engineering", students: 140, faculty: 12, rooms: 1, roomName: "DH-1", accent: "orange" },
    { code: "CE", name: "Civil Engineering", students: 120, faculty: 9, rooms: 1, roomName: "LH-239", accent: "green" },
    { code: "AIML", name: "CSE (AI & ML)", students: 100, faculty: 8, rooms: 1, roomName: "LH-137", accent: "pink" },
    { code: "DS", name: "CSE (Data Science)", students: 80, faculty: 6, rooms: 1, roomName: "CSE Tutorial Room", accent: "red" },
    { code: "EE", name: "Electrical Engineering", students: 90, faculty: 8, rooms: 1, roomName: "LH-237", accent: "red" },
  ],
  "7th": [
    { code: "CSE", name: "Computer Science & Engineering", students: 240, faculty: 18, rooms: 3, roomName: "LH-133, LH-134, LH-135", accent: "violet" },
    { code: "IT", name: "Information Technology", students: 120, faculty: 10, rooms: 2, roomName: "Tutorial Room / LH-113", accent: "blue" },
    { code: "ECE", name: "Electronics & Communication", students: 180, faculty: 13, rooms: 1, roomName: "CB-11", accent: "cyan" },
    { code: "ME", name: "Mechanical Engineering", students: 140, faculty: 11, rooms: 1, roomName: "DH-2", accent: "orange" },
    { code: "CE", name: "Civil Engineering", students: 120, faculty: 8, rooms: 1, roomName: "LH-532", accent: "green" },
    { code: "AIML", name: "CSE (AI & ML)", students: 100, faculty: 8, rooms: 1, roomName: "LH-533", accent: "pink" },
    { code: "DS", name: "CSE (Data Science)", students: 70, faculty: 6, rooms: 1, roomName: "Tutorial Room", accent: "red" },
    { code: "EE", name: "Electrical Engineering", students: 90, faculty: 8, rooms: 1, roomName: "LH-241", accent: "red" },
  ],
};

export const TIME_SLOTS = [
  "09:30 AM - 10:20 AM",
  "10:20 AM - 11:10 AM",
  "11:10 AM - 12:00 PM",
  "12:00 PM - 12:50 PM",
  "12:50 PM - 01:40 PM",
  "01:40 PM - 02:30 PM",
  "02:30 PM - 03:20 PM",
  "03:20 PM - 04:10 PM",
  "04:10 PM - 05:20 PM",
];

export const SCHEDULE_DAYS = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
