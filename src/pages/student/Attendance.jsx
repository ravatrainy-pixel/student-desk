import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  Info,
  TrendingUp,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";

import "./Attendance.css";

function Attendance() {
  const { currentUser } = useAuth();

  const {
    subjects,
    attendance,
  } = useAppData();

  const [selectedSubject, setSelectedSubject] =
    useState("All");

  // =====================================================
  // CURRENT STUDENT RECORDS
  // =====================================================

  const studentAttendance = useMemo(() => {
    return attendance.filter(
      (item) =>
        Number(item.studentId) ===
        Number(currentUser?.id)
    );
  }, [attendance, currentUser]);

  // =====================================================
  // ATTENDANCE BY SUBJECT
  // =====================================================

  const subjectAttendance =
    subjects.map((subject) => {
      const records =
        studentAttendance.filter(
          (item) =>
            Number(item.subjectId) ===
            Number(subject.id)
        );

      const total = records.length;

      const present = records.filter(
        (item) =>
          item.status === "Present"
      ).length;

      const absent = records.filter(
        (item) =>
          item.status === "Absent"
      ).length;

      const percentage =
        total > 0
          ? Math.round(
              (present / total) * 100
            )
          : 0;

      return {
        ...subject,
        total,
        present,
        absent,
        percentage,
      };
    });

  // =====================================================
  // OVERALL
  // =====================================================

  const totalClasses =
    studentAttendance.length;

  const totalPresent =
    studentAttendance.filter(
      (item) =>
        item.status === "Present"
    ).length;

  const totalAbsent =
    studentAttendance.filter(
      (item) =>
        item.status === "Absent"
    ).length;

  const overallPercentage =
    totalClasses > 0
      ? Math.round(
          (totalPresent / totalClasses) *
            100
        )
      : 0;

  const classesRequired =
    overallPercentage < 75
      ? Math.max(
          0,
          Math.ceil(
            (0.75 * totalClasses -
              totalPresent) /
              0.25
          )
        )
      : 0;

  // =====================================================
  // FILTER
  // =====================================================

  const filteredSubjects =
    selectedSubject === "All"
      ? subjectAttendance
      : subjectAttendance.filter(
          (subject) =>
            Number(subject.id) ===
            Number(selectedSubject)
        );

  // =====================================================
  // STATUS
  // =====================================================

  const getStatus = (percentage) => {
    if (percentage >= 75) {
      return {
        label: "Good",
        className: "good",
      };
    }

    if (percentage >= 65) {
      return {
        label: "Warning",
        className: "warning",
      };
    }

    return {
      label: "Low",
      className: "low",
    };
  };

  return (
    <div className="student-attendance-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="student-attendance-header">

        <div>
          <span className="attendance-eyebrow">
            ACADEMIC PERFORMANCE
          </span>

          <h1>Attendance</h1>

          <p>
            Track your attendance across all
            current semester subjects.
          </p>
        </div>

        <div className="attendance-header-badge">
          <ClipboardCheck size={18} />

          <div>
            <span>Overall Attendance</span>

            <strong>
              {overallPercentage}%
            </strong>
          </div>
        </div>

      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="student-attendance-summary">

        <div className="attendance-summary-card">

          <div className="attendance-summary-icon blue">
            <ClipboardCheck size={20} />
          </div>

          <div>
            <span>Total Classes</span>
            <strong>{totalClasses}</strong>
            <small>Recorded classes</small>
          </div>

        </div>

        <div className="attendance-summary-card">

          <div className="attendance-summary-icon green">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Present</span>
            <strong>{totalPresent}</strong>
            <small>Classes attended</small>
          </div>

        </div>

        <div className="attendance-summary-card">

          <div className="attendance-summary-icon red">
            <AlertCircle size={20} />
          </div>

          <div>
            <span>Absent</span>
            <strong>{totalAbsent}</strong>
            <small>Classes missed</small>
          </div>

        </div>

        <div className="attendance-summary-card">

          <div className="attendance-summary-icon purple">
            <TrendingUp size={20} />
          </div>

          <div>
            <span>Required</span>

            <strong>
              {overallPercentage >= 75
                ? "On Track"
                : classesRequired}
            </strong>

            <small>
              {overallPercentage >= 75
                ? "Minimum attendance met"
                : "More classes needed"}
            </small>
          </div>

        </div>

      </div>

      {/* =================================================
          FILTER
      ================================================= */}

      <div className="student-attendance-toolbar">

        <div>
          <h2>
            Subject-wise Attendance
          </h2>

          <p>
            Attendance data is managed by
            faculty.
          </p>
        </div>

        <select
          value={selectedSubject}
          onChange={(event) =>
            setSelectedSubject(
              event.target.value
            )
          }
        >
          <option value="All">
            All Subjects
          </option>

          {subjects.map((subject) => (
            <option
              key={subject.id}
              value={subject.id}
            >
              {subject.code} - {subject.name}
            </option>
          ))}
        </select>

      </div>

      {/* =================================================
          SUBJECT LIST
      ================================================= */}

      <div className="student-attendance-list">

        {filteredSubjects.map(
          (subject) => {

            const status =
              getStatus(
                subject.percentage
              );

            return (
              <div
                className="attendance-subject-card"
                key={subject.id}
              >

                <div className="attendance-subject-top">

                  <div>

                    <span className="attendance-subject-code">
                      {subject.code}
                    </span>

                    <h3>
                      {subject.name}
                    </h3>

                    <p>
                      {subject.faculty}
                    </p>

                  </div>

                  <span
                    className={`attendance-status ${status.className}`}
                  >
                    {status.label}
                  </span>

                </div>

                <div className="attendance-progress-area">

                  <div className="attendance-percentage">
                    {subject.percentage}%
                  </div>

                  <div className="attendance-progress-track">

                    <div
                      className={`attendance-progress-fill ${status.className}`}
                      style={{
                        width: `${subject.percentage}%`,
                      }}
                    />

                  </div>

                </div>

                <div className="attendance-subject-stats">

                  <div>
                    <span>Present</span>
                    <strong>
                      {subject.present}
                    </strong>
                  </div>

                  <div>
                    <span>Absent</span>
                    <strong>
                      {subject.absent}
                    </strong>
                  </div>

                  <div>
                    <span>Total</span>
                    <strong>
                      {subject.total}
                    </strong>
                  </div>

                </div>

              </div>
            );
          }
        )}

      </div>

      {/* =================================================
          INFORMATION
      ================================================= */}

      <div className="attendance-information">

        <Info size={17} />

        <div>
          <strong>
            Attendance policy
          </strong>

          <p>
            Maintain at least 75% attendance
            to stay on track academically.
            Attendance records are added and
            managed by faculty.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Attendance;