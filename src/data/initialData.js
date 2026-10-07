export const initialData = {
  // =====================================================
  // USERS
  // =====================================================

  users: [
  {
    id: 1,
    name: "Student Demo",
    role: "student",
    email: "student@example.com",
    enrollmentNo: "STUDENT001",
    phone: "9313872416",
    address: "valsad,Gujrat",
    city: "Valsad",
    department: "Computer Engineering",
    program: "B.Tech Computer Engineering",
    semester: 7,
    cgpa: 8.02,
    profileImage: "",
  },

  {
    id: 2,
    name: "Student 02",
    role: "student",
    email: "student02@example.com",
    enrollmentNo: "STUDENT002",
    phone: "",
    address: "",
    city: "",
    department: "Computer Engineering",
    program: "B.Tech Computer Engineering",
    semester: 7,
    cgpa: 7.86,
    profileImage: "",
  },

  {
    id: 3,
    name: "Student 03",
    role: "student",
    email: "student03@example.com",
    enrollmentNo: "STUDENT003",
    phone: "",
    address: "",
    city: "",
    department: "Computer Engineering",
    program: "B.Tech Computer Engineering",
    semester: 7,
    cgpa: 8.24,
    profileImage: "",
  },

  {
    id: 4,
    name: "Student 04",
    role: "student",
    email: "student04@example.com",
    enrollmentNo: "STUDENT004",
    phone: "",
    address: "",
    city: "",
    department: "Computer Engineering",
    program: "B.Tech Computer Engineering",
    semester: 7,
    cgpa: 7.91,
    profileImage: "",
  },

  {
    id: 5,
    name: "Student 05",
    role: "student",
    email: "student05@example.com",
    enrollmentNo: "STUDENT005",
    phone: "",
    address: "",
    city: "",
    department: "Computer Engineering",
    program: "B.Tech Computer Engineering",
    semester: 7,
    cgpa: 8.11,
    profileImage: "",
  },

  {
    id: 6,
    name: "Teacher Demo",
    role: "teacher",
    email: "teacher@example.com",
    department: "Computer Engineering",
    designation: "Assistant Professor",
    profileImage: "",
  },
],

  // =====================================================
  // SUBJECTS
  // =====================================================

  subjects: [
    {
      id: 1,
      code: "CE401",
      name: "Computer Networks",
      faculty: "Prof. Sharma",
      credits: 4,
      type: "Theory",
      schedule: "Monday • 09:00 AM - 10:00 AM",
      room: "Room 204",
      semester: 7,
    },

    {
      id: 2,
      code: "CE402",
      name: "Database Management",
      faculty: "Prof. Patel",
      credits: 4,
      type: "Theory",
      schedule: "Monday • 11:00 AM - 12:00 PM",
      room: "Lab 3",
      semester: 7,
    },

    {
      id: 3,
      code: "CE403",
      name: "Artificial Intelligence",
      faculty: "Prof. Mehta",
      credits: 4,
      type: "Theory",
      schedule: "Tuesday • 10:00 AM - 11:00 AM",
      room: "Room 101",
      semester: 7,
    },

    {
      id: 4,
      code: "CE404",
      name: "Software Engineering",
      faculty: "Prof. Desai",
      credits: 3,
      type: "Theory",
      schedule: "Wednesday • 09:00 AM - 10:00 AM",
      room: "Room 205",
      semester: 7,
    },

    {
      id: 5,
      code: "CE405",
      name: "Compiler Design",
      faculty: "Prof. Joshi",
      credits: 3,
      type: "Theory",
      schedule: "Friday • 02:00 PM - 03:00 PM",
      room: "Room 103",
      semester: 7,
    },

    {
      id: 6,
      code: "CE406",
      name: "Web Development",
      faculty: "Prof. Shah",
      credits: 4,
      type: "Practical",
      schedule: "Thursday • 11:00 AM - 01:00 PM",
      room: "Lab 2",
      semester: 7,
    },
  ],

  // =====================================================
  // CLASS SCHEDULE
  // =====================================================

  schedules: [
    {
      id: 1,
      subjectId: 1,
      day: "Monday",
      time: "09:00 AM - 10:00 AM",
      faculty: "Prof. Sharma",
      room: "Room 204",
      type: "Lecture",
      semester: 7,
    },

    {
      id: 2,
      subjectId: 2,
      day: "Monday",
      time: "11:00 AM - 12:00 PM",
      faculty: "Prof. Patel",
      room: "Lab 3",
      type: "Lecture",
      semester: 7,
    },

    {
      id: 3,
      subjectId: 3,
      day: "Tuesday",
      time: "10:00 AM - 11:00 AM",
      faculty: "Prof. Mehta",
      room: "Room 101",
      type: "Lecture",
      semester: 7,
    },

    {
      id: 4,
      subjectId: 4,
      day: "Wednesday",
      time: "09:00 AM - 10:00 AM",
      faculty: "Prof. Desai",
      room: "Room 205",
      type: "Lecture",
      semester: 7,
    },

    {
      id: 5,
      subjectId: 6,
      day: "Thursday",
      time: "11:00 AM - 01:00 PM",
      faculty: "Prof. Shah",
      room: "Lab 2",
      type: "Practical",
      semester: 7,
    },

    {
      id: 6,
      subjectId: 5,
      day: "Friday",
      time: "02:00 PM - 03:00 PM",
      faculty: "Prof. Joshi",
      room: "Room 103",
      type: "Lecture",
      semester: 7,
    },
  ],

  // =====================================================
  // ATTENDANCE
  // =====================================================

  attendance: [
    {
      id: 1,
      studentId: 1,
      subjectId: 1,
      date: "2026-09-28",
      status: "Present",
    },

    {
      id: 2,
      studentId: 1,
      subjectId: 1,
      date: "2026-09-29",
      status: "Present",
    },

    {
      id: 3,
      studentId: 1,
      subjectId: 1,
      date: "2026-09-30",
      status: "Absent",
    },

    {
      id: 4,
      studentId: 1,
      subjectId: 2,
      date: "2026-09-28",
      status: "Present",
    },

    {
      id: 5,
      studentId: 1,
      subjectId: 2,
      date: "2026-09-29",
      status: "Present",
    },

    {
      id: 6,
      studentId: 1,
      subjectId: 3,
      date: "2026-09-30",
      status: "Present",
    },

    {
      id: 7,
      studentId: 1,
      subjectId: 4,
      date: "2026-09-30",
      status: "Present",
    },

    {
      id: 8,
      studentId: 1,
      subjectId: 5,
      date: "2026-09-30",
      status: "Absent",
    },

    {
      id: 9,
      studentId: 1,
      subjectId: 6,
      date: "2026-10-01",
      status: "Present",
    },
  ],

  // =====================================================
  // ASSIGNMENTS
  // =====================================================
  assignments: [
  {
    id: 1,
    subjectId: 1,
    title: "Network Security Report",
    description:
      "Prepare a report on common network security threats and preventive techniques.",
    dueDate: "2026-10-10",
    priority: "High",
    status: "Published",
    createdBy: 6,
  },

  {
    id: 2,
    subjectId: 2,
    title: "Database Normalization",
    description:
      "Solve normalization problems up to BCNF with suitable examples.",
    dueDate: "2026-10-12",
    priority: "Medium",
    status: "Published",
    createdBy: 6,
  },

  {
    id: 3,
    subjectId: 3,
    title: "AI Search Algorithms",
    description:
      "Explain BFS, DFS and A* search algorithms with suitable examples.",
    dueDate: "2026-10-15",
    priority: "High",
    status: "Published",
    createdBy: 6,
  },

  {
    id: 4,
    subjectId: 6,
    title: "React Component Practice",
    description:
      "Create reusable React components using props and state.",
    dueDate: "2026-10-18",
    priority: "Medium",
    status: "Published",
    createdBy: 6,
  },
],
  
  // =====================================================
  // SUBMISSIONS
  // =====================================================

  submissions: [
  {
    id: 1,
    assignmentId: 1,
    studentId: 1,
    fileName: "network-security-report.pdf",
    submittedAt: "2026-10-03T10:30:00",
    status: "Submitted",
    marks: null,
    feedback: "",
  },

  {
    id: 2,
    assignmentId: 2,
    studentId: 1,
    fileName: "database-normalization.pdf",
    submittedAt: "2026-10-02T15:45:00",
    status: "Reviewed",
    marks: 18,
    feedback: "Good work.",
  },
],


  // =====================================================
  // RESULTS
  // =====================================================

  results: [
    {
      id: 1,
      studentId: 1,
      subjectId: 1,
      semester: 7,
      internal: 22,
      external: 62,
      total: 84,
      grade: "A",
      gradePoint: 9,
    },

    {
      id: 2,
      studentId: 1,
      subjectId: 2,
      semester: 7,
      internal: 21,
      external: 60,
      total: 81,
      grade: "A",
      gradePoint: 9,
    },

    {
      id: 3,
      studentId: 1,
      subjectId: 3,
      semester: 7,
      internal: 23,
      external: 65,
      total: 88,
      grade: "A+",
      gradePoint: 10,
    },

    {
      id: 4,
      studentId: 1,
      subjectId: 4,
      semester: 7,
      internal: 20,
      external: 58,
      total: 78,
      grade: "B+",
      gradePoint: 8,
    },

    {
      id: 5,
      studentId: 1,
      subjectId: 5,
      semester: 7,
      internal: 19,
      external: 55,
      total: 74,
      grade: "B+",
      gradePoint: 8,
    },

    {
      id: 6,
      studentId: 1,
      subjectId: 6,
      semester: 7,
      internal: 24,
      external: 67,
      total: 91,
      grade: "A+",
      gradePoint: 10,
    },
  ],

  // =====================================================
  // NOTICES
  // =====================================================

  notices: [
    {
      id: 1,
      title: "Mid-Semester Examination Schedule",
      description:
        "The mid-semester examination schedule has been published.",
      category: "Exam",
      date: "2026-10-01",
      priority: "High",
      author: "Teacher Demo",
      status: "Published",
    },

    {
      id: 2,
      title: "Department Seminar",
      description:
        "Students are invited to attend the upcoming department seminar.",
      category: "Event",
      date: "2026-10-03",
      priority: "Medium",
      author: "Teacher Demo",
      status: "Published",
    },

    {
      id: 3,
      title: "Assignment Submission Reminder",
      description:
        "Students are requested to submit pending assignments before their due dates.",
      category: "Academic",
      date: "2026-10-04",
      priority: "Medium",
      author: "Teacher Demo",
      status: "Published",
    },
  ],

  // =====================================================
  // PERSONAL TASKS
  // =====================================================

  tasks: [
  {
    id: 1,
    studentId: 1,
    title: "Complete DBMS Assignment",
    description: "Finish normalization questions.",
    dueDate: "2026-10-08",
    priority: "High",
    status: "Pending",
    createdAt: "2026-10-01T10:00:00",
  },
  {
    id: 2,
    studentId: 1,
    title: "Prepare CN Notes",
    description: "Revise routing and transport layer.",
    dueDate: "2026-10-09",
    priority: "Medium",
    status: "Pending",
    createdAt: "2026-10-02T10:00:00",
  },
  {
    id: 3,
    studentId: 1,
    title: "Practice React Hooks",
    description: "Practice useState and useEffect.",
    dueDate: "2026-10-05",
    priority: "Low",
    status: "Completed",
    createdAt: "2026-10-03T10:00:00",
  },
]
};