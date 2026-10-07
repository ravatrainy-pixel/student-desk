import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  Megaphone,
  Upload,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";

import "./TeacherDashboard.css";

function TeacherDashboard() {
  const { currentUser } = useAuth();

  const {
    subjects,
    schedules,
    assignments,
    submissions,
    notices,
  } = useAppData();

  // =====================================================
  // DATE
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

  const todayName =
    dayNames[today.getDay()];

  const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
      }
    );
  };

  // =====================================================
  // TODAY'S CLASSES
  // =====================================================

  const todayClasses = schedules.filter(
    (item) => item.day === todayName
  );

  const getSubject = (subjectId) => {
    return subjects.find(
      (item) =>
        Number(item.id) === Number(subjectId)
    );
  };

  // =====================================================
  // ASSIGNMENTS
  // =====================================================

  const publishedAssignments =
    assignments.filter(
      (item) => item.status === "Published"
    );

  // =====================================================
  // SUBMISSIONS
  // =====================================================

  const pendingSubmissions =
    submissions.filter(
      (item) => item.status !== "Reviewed"
    );

  const recentSubmissions = [
    ...submissions,
  ]
    .sort(
      (a, b) =>
        new Date(b.submittedAt || 0) -
        new Date(a.submittedAt || 0)
    )
    .slice(0, 4);

  // =====================================================
  // NOTICES
  // =====================================================

  const publishedNotices =
    notices.filter(
      (item) => item.status === "Published"
    );

  const recentNotices = [
    ...publishedNotices,
  ]
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    )
    .slice(0, 3);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="teacher-dashboard">

      {/* =========================================
          HEADER
      ========================================= */}

      <section className="teacher-dashboard-header">

        <div>

          <span className="teacher-dashboard-eyebrow">
            FACULTY OVERVIEW
          </span>

          <h1>
            Welcome,{" "}
            {currentUser?.name?.split(" ")[0] ||
              "Teacher"}
            .
          </h1>

          <p>
            Manage your classes, assignments and
            student academic activities.
          </p>

        </div>

        <div className="teacher-dashboard-date">

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
          STATS
      ========================================= */}

      <section className="teacher-dashboard-stats">

        <div className="teacher-stat-card">

          <div className="teacher-stat-icon blue">
            <BookOpen size={20} />
          </div>

          <div>
            <span>Total Subjects</span>
            <strong>{subjects.length}</strong>
            <small>Managed subjects</small>
          </div>

        </div>

        <div className="teacher-stat-card">

          <div className="teacher-stat-icon green">
            <CalendarDays size={20} />
          </div>

          <div>
            <span>Today's Classes</span>
            <strong>
              {todayClasses.length}
            </strong>
            <small>
              {todayName}
            </small>
          </div>

        </div>

        <div className="teacher-stat-card">

          <div className="teacher-stat-icon orange">
            <FileText size={20} />
          </div>

          <div>
            <span>Published Assignments</span>
            <strong>
              {publishedAssignments.length}
            </strong>
            <small>Active assignments</small>
          </div>

        </div>

        <div className="teacher-stat-card">

          <div className="teacher-stat-icon purple">
            <Upload size={20} />
          </div>

          <div>
            <span>Pending Submissions</span>
            <strong>
              {pendingSubmissions.length}
            </strong>
            <small>Need review</small>
          </div>

        </div>

      </section>

      {/* =========================================
          MAIN GRID
      ========================================= */}

      <section className="teacher-dashboard-grid">

        {/* TODAY'S CLASSES */}

        <div className="teacher-dashboard-panel today-panel">

          <div className="teacher-panel-header">

            <div>

              <span>TEACHING SCHEDULE</span>

              <h2>
                Today's Classes
              </h2>

            </div>

            <Link to="/teacher/schedule">
              Manage
              <ArrowRight size={15} />
            </Link>

          </div>

          {todayClasses.length === 0 ? (

            <div className="teacher-dashboard-empty">
              <CalendarDays size={24} />
              <p>
                No classes scheduled for today.
              </p>
            </div>

          ) : (

            <div className="teacher-class-list">

              {todayClasses.map(
                (classItem) => {

                  const subject =
                    getSubject(
                      classItem.subjectId
                    );

                  return (
                    <div
                      className="teacher-class-item"
                      key={classItem.id}
                    >

                      <div className="teacher-class-time">
                        {classItem.time}
                      </div>

                      <div className="teacher-class-main">

                        <strong>
                          {subject?.name ||
                            "Unknown Subject"}
                        </strong>

                        <span>
                          {classItem.type}
                        </span>

                      </div>

                      <div className="teacher-class-room">
                        {classItem.room}
                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>

        {/* SUBMISSIONS */}

        <div className="teacher-dashboard-panel">

          <div className="teacher-panel-header">

            <div>

              <span>SUBMISSIONS</span>

              <h2>
                Recent Submissions
              </h2>

            </div>

            <Link to="/teacher/submissions">
              View all
              <ArrowRight size={15} />
            </Link>

          </div>

          {recentSubmissions.length ===
          0 ? (

            <div className="teacher-dashboard-empty">
              <Upload size={24} />
              <p>
                No submissions yet.
              </p>
            </div>

          ) : (

            <div className="teacher-submission-list">

              {recentSubmissions.map(
                (submission) => {

                  const assignment =
                    assignments.find(
                      (item) =>
                        Number(item.id) ===
                        Number(
                          submission.assignmentId
                        )
                    );

                  return (
                    <div
                      className="teacher-submission-item"
                      key={submission.id}
                    >

                      <div className="submission-icon">
                        <Upload size={16} />
                      </div>

                      <div>

                        <strong>
                          {submission.fileName ||
                            "Submitted file"}
                        </strong>

                        <span>
                          {assignment?.title ||
                            "Assignment"}
                        </span>

                      </div>

                      <span
                        className={`submission-status ${
                          submission.status
                            ?.toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            ) || ""
                        }`}
                      >
                        {submission.status}
                      </span>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>

        {/* ASSIGNMENTS */}

        <div className="teacher-dashboard-panel">

          <div className="teacher-panel-header">

            <div>

              <span>ASSIGNMENTS</span>

              <h2>
                Active Assignments
              </h2>

            </div>

            <Link to="/teacher/assignments">
              Manage
              <ArrowRight size={15} />
            </Link>

          </div>

          {publishedAssignments
            .slice(0, 4)
            .map((assignment) => {

              const subject =
                getSubject(
                  assignment.subjectId
                );

              return (
                <div
                  className="teacher-assignment-item"
                  key={assignment.id}
                >

                  <div>
                    <strong>
                      {assignment.title}
                    </strong>

                    <span>
                      {subject?.code || ""}
                      {" • "}
                      Due{" "}
                      {formatDate(
                        assignment.dueDate
                      )}
                    </span>
                  </div>

                  <span
                    className={`priority-badge ${assignment.priority.toLowerCase()}`}
                  >
                    {assignment.priority}
                  </span>

                </div>
              );
            })}

          {publishedAssignments.length ===
            0 && (
            <div className="teacher-dashboard-empty">
              <FileText size={24} />
              <p>
                No published assignments.
              </p>
            </div>
          )}

        </div>

        {/* NOTICES */}

        <div className="teacher-dashboard-panel">

          <div className="teacher-panel-header">

            <div>

              <span>ANNOUNCEMENTS</span>

              <h2>
                Recent Notices
              </h2>

            </div>

            <Link to="/teacher/notices">
              Manage
              <ArrowRight size={15} />
            </Link>

          </div>

          {recentNotices.length ===
          0 ? (

            <div className="teacher-dashboard-empty">
              <Megaphone size={24} />
              <p>
                No published notices.
              </p>
            </div>

          ) : (

            <div className="teacher-notice-list">

              {recentNotices.map(
                (notice) => (

                  <div
                    className="teacher-notice-item"
                    key={notice.id}
                  >

                    <div className="teacher-notice-icon">
                      <Megaphone size={15} />
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

        {/* QUICK ACTIONS */}

        <div className="teacher-dashboard-panel quick-actions-panel">

          <div className="teacher-panel-header">

            <div>

              <span>SHORTCUTS</span>

              <h2>
                Quick Actions
              </h2>

            </div>

          </div>

          <div className="teacher-quick-actions">

            <Link to="/teacher/subjects">
              <BookOpen size={18} />
              <span>Manage Subjects</span>
              <ArrowRight size={14} />
            </Link>

            <Link to="/teacher/attendance">
              <ClipboardCheck size={18} />
              <span>Take Attendance</span>
              <ArrowRight size={14} />
            </Link>

            <Link to="/teacher/assignments">
              <FileText size={18} />
              <span>Create Assignment</span>
              <ArrowRight size={14} />
            </Link>

            <Link to="/teacher/submissions">
              <Users size={18} />
              <span>Review Submissions</span>
              <ArrowRight size={14} />
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default TeacherDashboard;