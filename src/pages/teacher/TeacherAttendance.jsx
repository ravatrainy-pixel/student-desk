import { useEffect, useMemo, useState } from "react";
import {
  Check,
  CheckCheck,
  ClipboardCheck,
  Search,
  X,
} from "lucide-react";

import { useAppData } from "../../context/AppDataContext";

import "./TeacherAttendance.css";

function TeacherAttendance() {
  const {
    subjects,
    users,
    attendance,
    addItem,
    updateItem,
  } = useAppData();

  const students = users.filter(
    (user) => user.role === "student"
  );

  const [selectedSubjectId, setSelectedSubjectId] =
    useState(
      subjects.length > 0
        ? subjects[0].id
        : ""
    );

  const [selectedDate, setSelectedDate] =
    useState(() => {
      const today = new Date();

      return today
        .toISOString()
        .split("T")[0];
    });

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    attendanceStatus,
    setAttendanceStatus,
  ] = useState({});

  const [message, setMessage] =
    useState("");

  // =====================================================
  // LOAD EXISTING ATTENDANCE
  // =====================================================

  useEffect(() => {
    if (!selectedSubjectId) {
      setAttendanceStatus({});
      return;
    }

    const currentRecords =
      attendance.filter(
        (record) =>
          Number(record.subjectId) ===
            Number(selectedSubjectId) &&
          record.date === selectedDate
      );

    const statusMap = {};

    currentRecords.forEach((record) => {
      statusMap[record.studentId] =
        record.status;
    });

    setAttendanceStatus(statusMap);
    setMessage("");
  }, [
    selectedSubjectId,
    selectedDate,
    attendance,
  ]);

  // =====================================================
  // FILTER STUDENTS
  // =====================================================

  const filteredStudents = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    return students.filter(
      (student) =>
        student.name
          .toLowerCase()
          .includes(search) ||
        student.enrollmentNo
          ?.toLowerCase()
          .includes(search) ||
        student.email
          .toLowerCase()
          .includes(search)
    );
  }, [students, searchTerm]);

  // =====================================================
  // SELECT STATUS
  // =====================================================

  const markStudent = (
    studentId,
    status
  ) => {
    setAttendanceStatus((current) => ({
      ...current,
      [studentId]: status,
    }));
  };

  // =====================================================
  // MARK ALL
  // =====================================================

  const markAll = (status) => {
    const updated = {};

    filteredStudents.forEach(
      (student) => {
        updated[student.id] = status;
      }
    );

    setAttendanceStatus((current) => ({
      ...current,
      ...updated,
    }));
  };

  // =====================================================
  // SAVE ATTENDANCE
  // =====================================================

  const saveAttendance = () => {
    if (!selectedSubjectId) {
      return;
    }

    students.forEach((student) => {
      const status =
        attendanceStatus[student.id];

      if (!status) {
        return;
      }

      const existingRecord =
        attendance.find(
          (record) =>
            Number(record.studentId) ===
              Number(student.id) &&
            Number(record.subjectId) ===
              Number(selectedSubjectId) &&
            record.date === selectedDate
        );

      if (existingRecord) {
        updateItem(
          "attendance",
          existingRecord.id,
          {
            status,
          }
        );
      } else {
        addItem("attendance", {
          studentId: student.id,
          subjectId:
            Number(selectedSubjectId),
          date: selectedDate,
          status,
        });
      }
    });

    setMessage(
      "Attendance saved successfully."
    );
  };

  // =====================================================
  // COUNTS
  // =====================================================

  const presentCount =
    Object.values(
      attendanceStatus
    ).filter(
      (status) => status === "Present"
    ).length;

  const absentCount =
    Object.values(
      attendanceStatus
    ).filter(
      (status) => status === "Absent"
    ).length;

  const markedCount =
    presentCount + absentCount;

  const selectedSubject = subjects.find(
    (subject) =>
      Number(subject.id) ===
      Number(selectedSubjectId)
  );

  return (
    <div className="teacher-attendance-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="teacher-attendance-header">

        <div>

          <span className="teacher-attendance-eyebrow">
            CLASS MANAGEMENT
          </span>

          <h1>Attendance</h1>

          <p>
            Mark and manage daily student
            attendance.
          </p>

        </div>

        <div className="teacher-attendance-date">

          <ClipboardCheck size={18} />

          <div>
            <span>Attendance Date</span>

            <strong>
              {selectedDate}
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          CONTROLS
      ================================================= */}

      <div className="teacher-attendance-controls">

        <div className="teacher-attendance-control">

          <label>
            Subject
          </label>

          <select
            value={selectedSubjectId}
            onChange={(event) =>
              setSelectedSubjectId(
                event.target.value
              )
            }
          >

            {subjects.map(
              (subject) => (
                <option
                  key={subject.id}
                  value={subject.id}
                >
                  {subject.code} -{" "}
                  {subject.name}
                </option>
              )
            )}

          </select>

        </div>

        <div className="teacher-attendance-control">

          <label>
            Date
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(event) =>
              setSelectedDate(
                event.target.value
              )
            }
          />

        </div>

        <div className="teacher-attendance-control teacher-attendance-search">

          <label>
            Search Student
          </label>

          <div>

            <Search size={15} />

            <input
              type="text"
              placeholder="Search name or enrollment..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

          </div>

        </div>

      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="teacher-attendance-summary">

        <div>
          <span>Total Students</span>
          <strong>
            {students.length}
          </strong>
        </div>

        <div>
          <span>Marked</span>
          <strong>
            {markedCount}
          </strong>
        </div>

        <div>
          <span>Present</span>
          <strong className="present-count">
            {presentCount}
          </strong>
        </div>

        <div>
          <span>Absent</span>
          <strong className="absent-count">
            {absentCount}
          </strong>
        </div>

      </div>

      {/* =================================================
          ACTION BAR
      ================================================= */}

      <div className="teacher-attendance-actionbar">

        <div>

          <strong>
            {selectedSubject?.name ||
              "Select Subject"}
          </strong>

          <span>
            {selectedDate}
          </span>

        </div>

        <div className="teacher-attendance-actions">

          <button
            className="mark-present-button"
            onClick={() =>
              markAll("Present")
            }
          >
            <CheckCheck size={15} />
            All Present
          </button>

          <button
            className="mark-absent-button"
            onClick={() =>
              markAll("Absent")
            }
          >
            <X size={15} />
            All Absent
          </button>

          <button
            className="save-attendance-button"
            onClick={saveAttendance}
          >
            <ClipboardCheck size={15} />
            Save Attendance
          </button>

        </div>

      </div>

      {/* =================================================
          MESSAGE
      ================================================= */}

      {message && (
        <div className="teacher-attendance-success">
          <Check size={15} />
          {message}
        </div>
      )}

      {/* =================================================
          STUDENT TABLE
      ================================================= */}

      <div className="teacher-attendance-table-card">

        <div className="teacher-attendance-table-wrapper">

          <table className="teacher-attendance-table">

            <thead>

              <tr>
                <th>Student</th>
                <th>Enrollment</th>
                <th>Attendance</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {filteredStudents.map(
                (student) => {

                  const status =
                    attendanceStatus[
                      student.id
                    ];

                  return (
                    <tr
                      key={student.id}
                    >

                      <td>

                        <div className="teacher-student-cell">

                          <div className="teacher-student-avatar">
                            {student.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <strong>
                              {student.name}
                            </strong>

                            <span>
                              {student.email}
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>
                        {student.enrollmentNo}
                      </td>

                      <td>

                        <div className="attendance-mark-buttons">

                          <button
                            className={
                              status === "Present"
                                ? "attendance-present-active"
                                : ""
                            }
                            onClick={() =>
                              markStudent(
                                student.id,
                                "Present"
                              )
                            }
                          >
                            <Check size={14} />
                            Present
                          </button>

                          <button
                            className={
                              status === "Absent"
                                ? "attendance-absent-active"
                                : ""
                            }
                            onClick={() =>
                              markStudent(
                                student.id,
                                "Absent"
                              )
                            }
                          >
                            <X size={14} />
                            Absent
                          </button>

                        </div>

                      </td>

                      <td>

                        {status ? (
                          <span
                            className={`attendance-current-status ${
                              status === "Present"
                                ? "present"
                                : "absent"
                            }`}
                          >
                            {status}
                          </span>
                        ) : (
                          <span className="attendance-unmarked">
                            Not marked
                          </span>
                        )}

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

        {filteredStudents.length === 0 && (
          <div className="teacher-attendance-empty">
            <Search size={30} />
            <h3>No students found</h3>
            <p>
              Try another search term.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}

export default TeacherAttendance;