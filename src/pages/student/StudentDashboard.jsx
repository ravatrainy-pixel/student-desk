import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  GraduationCap,
  Megaphone,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";

import "./StudentDashboard.css";

function StudentDashboard() {
  const { currentUser } = useAuth();

  const {
    subjects,
    schedules,
    attendance,
    assignments,
    submissions,
    results,
    notices,
    tasks,
  } = useAppData();

  // =====================================================
  // BASIC HELPERS
  // =====================================================

  const today = new Date();

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const todayName = dayNames[today.getDay()];

  const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(
      (item) =>
        Number(item.id) === Number(subjectId)
    );

    return subject?.name || "Unknown Subject";
  };

  // =====================================================
  // ATTENDANCE
  // =====================================================

  const getSubjectAttendance = (subjectId) => {
    const records = attendance.filter(
      (item) =>
        Number(item.subjectId) ===
        Number(subjectId)
    );

    if (records.length === 0) {
      return 0;
    }

    const presentCount = records.filter(
      (item) => item.status === "Present"
    ).length;

    return Math.round(
      (presentCount / records.length) * 100
    );
  };

  const totalAttendanceRecords =
    attendance.length;

  const totalPresent = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const overallAttendance =
    totalAttendanceRecords > 0
      ? Math.round(
          (totalPresent /
            totalAttendanceRecords) *
            100
        )
      : 0;

  // =====================================================
  // ASSIGNMENTS
  // =====================================================

  const submittedAssignmentIds =
    new Set(
      submissions
        .filter(
          (item) =>
            Number(item.studentId) ===
            Number(currentUser?.id)
        )
        .map((item) =>
          Number(item.assignmentId)
        )
    );

  const pendingAssignments =
    assignments.filter(
      (item) =>
        item.status === "Published" &&
        !submittedAssignmentIds.has(
          Number(item.id)
        )
    );

  const upcomingAssignments = [
    ...pendingAssignments,
  ]
    .sort(
      (a, b) =>
        new Date(a.dueDate) -
        new Date(b.dueDate)
    )
    .slice(0, 4);

  // =====================================================
  // TASKS
  // =====================================================

  const pendingTasks = tasks.filter(
    (item) =>
      Number(item.studentId) ===
        Number(currentUser?.id) &&
      item.status !== "Completed"
  );

  // =====================================================
  // TODAY'S CLASSES
  // =====================================================

  const todayClasses = schedules.filter(
    (item) => item.day === todayName
  );

  // =====================================================
  // RESULTS
  // =====================================================

  const studentResults = results.filter(
    (item) =>
      Number(item.studentId) ===
      Number(currentUser?.id)
  );

  const latestResults = [...studentResults]
    .sort((a, b) => b.id - a.id)
    .slice(0, 4);

  // =====================================================
  // NOTICES
  // =====================================================

  const publishedNotices = notices
    .filter(
      (item) => item.status === "Published"
    )
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );

  const latestNotices =
    publishedNotices.slice(0, 3);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="student-dashboard">

      {/* =========================================
          HEADER
      ========================================= */}

      <section className="student-dashboard-header">

        <div>
          <span className="dashboard-eyebrow">
            STUDENT OVERVIEW
          </span>

          <h1>
            Good day,{" "}
            {currentUser?.name?.split(" ")[0] ||
              "Student"}
            .
          </h1>

          <p>
            Here's what's happening with your
            academic activities today.
          </p>
        </div>

        <div className="dashboard-date-card">
          <CalendarDays size={18} />

          <div>
            <span>Today</span>

            <strong>
              {today.toLocaleDateString(
                "en-IN",
                {
                  weekday: "long",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </strong>
          </div>
        </div>

      </section>

      {/* =========================================
          STAT CARDS
      ========================================= */}

      <section className="student-dashboard-stats">

        <div className="student-stat-card">
          <div className="student-stat-icon blue">
            <BookOpen size={20} />
          </div>

          <div>
            <span>Total Subjects</span>
            <strong>{subjects.length}</strong>
            <small>Current semester</small>
          </div>
        </div>

        <div className="student-stat-card">
          <div className="student-stat-icon green">
            <ClipboardCheck size={20} />
          </div>

          <div>
            <span>Attendance</span>
            <strong>
              {overallAttendance}%
            </strong>
            <small>Overall attendance</small>
          </div>
        </div>

        <div className="student-stat-card">
          <div className="student-stat-icon orange">
            <FileText size={20} />
          </div>

          <div>
            <span>Pending Assignments</span>
            <strong>
              {pendingAssignments.length}
            </strong>
            <small>Need your attention</small>
          </div>
        </div>

        <div className="student-stat-card">
          <div className="student-stat-icon purple">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Pending Tasks</span>
            <strong>
              {pendingTasks.length}
            </strong>
            <small>Personal tasks</small>
          </div>
        </div>

      </section>

      {/* =========================================
          MAIN GRID
      ========================================= */}

      <section className="student-dashboard-grid">

        {/* TODAY'S CLASSES */}

        <div className="dashboard-panel today-classes-panel">

          <div className="dashboard-panel-header">

            <div>
              <span className="panel-label">
                SCHEDULE
              </span>

              <h2>
                Today's Classes
              </h2>
            </div>

            <Link to="/student/schedule">
              View all
              <ArrowRight size={15} />
            </Link>

          </div>

          {todayClasses.length === 0 ? (

            <div className="dashboard-empty">
              <CalendarDays size={24} />
              <p>
                No classes scheduled for today.
              </p>
            </div>

          ) : (

            <div className="today-class-list">

              {todayClasses.map((classItem) => (

                <div
                  className="today-class-item"
                  key={classItem.id}
                >

                  <div className="class-time">
                    <Clock3 size={15} />

                    <span>
                      {classItem.time}
                    </span>
                  </div>

                  <div className="class-main">

                    <strong>
                      {getSubjectName(
                        classItem.subjectId
                      )}
                    </strong>

                    <span>
                      {classItem.faculty}
                    </span>

                  </div>

                  <div className="class-room">
                    {classItem.room}
                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

        {/* ATTENDANCE */}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>
              <span className="panel-label">
                ATTENDANCE
              </span>

              <h2>
                Subject Attendance
              </h2>
            </div>

            <Link to="/student/attendance">
              Details
              <ArrowRight size={15} />
            </Link>

          </div>

          <div className="dashboard-attendance-list">

            {subjects.slice(0, 5).map(
              (subject) => {

                const percentage =
                  getSubjectAttendance(
                    subject.id
                  );

                const status =
                  percentage >= 75
                    ? "good"
                    : percentage >= 65
                    ? "warning"
                    : "low";

                return (
                  <div
                    className="dashboard-attendance-item"
                    key={subject.id}
                  >

                    <div className="attendance-info">

                      <div>
                        <strong>
                          {subject.code}
                        </strong>

                        <span>
                          {subject.name}
                        </span>
                      </div>

                      <b>
                        {percentage}%
                      </b>

                    </div>

                    <div className="attendance-bar">
                      <div
                        className={`attendance-fill ${status}`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

        {/* ASSIGNMENTS */}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>
              <span className="panel-label">
                ASSIGNMENTS
              </span>

              <h2>
                Upcoming Assignments
              </h2>
            </div>

            <Link to="/student/assignments">
              View all
              <ArrowRight size={15} />
            </Link>

          </div>

          {upcomingAssignments.length ===
          0 ? (

            <div className="dashboard-empty">
              <CheckCircle2 size={24} />
              <p>
                No pending assignments.
              </p>
            </div>

          ) : (

            <div className="dashboard-assignment-list">

              {upcomingAssignments.map(
                (assignment) => (

                  <div
                    className="dashboard-assignment-item"
                    key={assignment.id}
                  >

                    <div className="assignment-icon">
                      <FileText size={17} />
                    </div>

                    <div className="assignment-content">

                      <strong>
                        {assignment.title}
                      </strong>

                      <span>
                        {getSubjectName(
                          assignment.subjectId
                        )}
                      </span>

                    </div>

                    <div className="assignment-due">
                      <small>Due</small>
                      <strong>
                        {formatDate(
                          assignment.dueDate
                        )}
                      </strong>
                    </div>

                  </div>

                )
              )}

            </div>
          )}

        </div>

        {/* NOTICES */}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>
              <span className="panel-label">
                ANNOUNCEMENTS
              </span>

              <h2>
                Latest Notices
              </h2>
            </div>

            <Link to="/student/notices">
              View all
              <ArrowRight size={15} />
            </Link>

          </div>

          {latestNotices.length === 0 ? (

            <div className="dashboard-empty">
              <Megaphone size={24} />
              <p>
                No new notices.
              </p>
            </div>

          ) : (

            <div className="dashboard-notice-list">

              {latestNotices.map(
                (notice) => (

                  <div
                    className="dashboard-notice-item"
                    key={notice.id}
                  >

                    <div className="notice-icon">
                      <Megaphone size={16} />
                    </div>

                    <div>

                      <strong>
                        {notice.title}
                      </strong>

                      <span>
                        {formatDate(
                          notice.date
                        )}
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>
          )}

        </div>

        {/* RESULTS */}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>
              <span className="panel-label">
                ACADEMICS
              </span>

              <h2>
                Recent Results
              </h2>
            </div>

            <Link to="/student/results">
              View all
              <ArrowRight size={15} />
            </Link>

          </div>

          {latestResults.length === 0 ? (

            <div className="dashboard-empty">
              <GraduationCap size={24} />
              <p>
                No results available.
              </p>
            </div>

          ) : (

            <div className="dashboard-result-list">

              {latestResults.map(
                (result) => (

                  <div
                    className="dashboard-result-item"
                    key={result.id}
                  >

                    <div>
                      <strong>
                        {getSubjectName(
                          result.subjectId
                        )}
                      </strong>

                      <span>
                        Semester{" "}
                        {result.semester}
                      </span>
                    </div>

                    <div className="result-grade">
                      <strong>
                        {result.grade}
                      </strong>

                      <span>
                        {result.total}/100
                      </span>
                    </div>

                  </div>

                )
              )}

            </div>
          )}

        </div>

      </section>

    </div>
  );
}

export default StudentDashboard;