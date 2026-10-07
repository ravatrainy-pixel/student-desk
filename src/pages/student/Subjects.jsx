import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  MapPin,
  Search,
  UserRound,
} from "lucide-react";

import { useAppData } from "../../context/AppDataContext";

import "./Subjects.css";

function Subjects() {
  const { subjects, attendance } = useAppData();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState(null);

  // =====================================================
  // ATTENDANCE
  // =====================================================

  const getAttendance = (subjectId) => {
    const records = attendance.filter(
      (item) =>
        Number(item.subjectId) === Number(subjectId)
    );

    if (records.length === 0) {
      return 0;
    }

    const present = records.filter(
      (item) => item.status === "Present"
    ).length;

    return Math.round(
      (present / records.length) * 100
    );
  };

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 75) return "good";
    if (percentage >= 65) return "warning";
    return "low";
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredSubjects = subjects.filter(
    (subject) => {
      const search = searchTerm
        .toLowerCase()
        .trim();

      const matchesSearch =
        subject.name
          .toLowerCase()
          .includes(search) ||
        subject.code
          .toLowerCase()
          .includes(search) ||
        subject.faculty
          .toLowerCase()
          .includes(search);

      const matchesType =
        typeFilter === "All" ||
        subject.type === typeFilter;

      return matchesSearch && matchesType;
    }
  );

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalCredits = subjects.reduce(
    (total, subject) =>
      total + Number(subject.credits || 0),
    0
  );

  const theoryCount = subjects.filter(
    (subject) => subject.type === "Theory"
  ).length;

  const practicalCount = subjects.filter(
    (subject) => subject.type === "Practical"
  ).length;

  return (
    <div className="subjects-page">

      {/* HEADER */}

      <div className="subjects-page-header">

        <div>
          <span className="subjects-eyebrow">
            ACADEMICS
          </span>

          <h1>My Subjects</h1>

          <p>
            View your current semester subjects,
            faculty, schedule and academic details.
          </p>
        </div>

        <div className="subjects-semester">
          <GraduationCap size={18} />

          <div>
            <span>Current Semester</span>
            <strong>Semester 7</strong>
          </div>
        </div>

      </div>

      {/* SUMMARY */}

      <div className="subjects-summary">

        <div className="subjects-summary-card">
          <div className="subjects-summary-icon blue">
            <BookOpen size={20} />
          </div>

          <div>
            <span>Total Subjects</span>
            <strong>{subjects.length}</strong>
            <small>Current semester</small>
          </div>
        </div>

        <div className="subjects-summary-card">
          <div className="subjects-summary-icon purple">
            <GraduationCap size={20} />
          </div>

          <div>
            <span>Total Credits</span>
            <strong>{totalCredits}</strong>
            <small>Registered credits</small>
          </div>
        </div>

        <div className="subjects-summary-card">
          <div className="subjects-summary-icon green">
            <BookOpen size={20} />
          </div>

          <div>
            <span>Theory</span>
            <strong>{theoryCount}</strong>
            <small>Theory subjects</small>
          </div>
        </div>

        <div className="subjects-summary-card">
          <div className="subjects-summary-icon orange">
            <CalendarDays size={20} />
          </div>

          <div>
            <span>Practical</span>
            <strong>{practicalCount}</strong>
            <small>Lab subjects</small>
          </div>
        </div>

      </div>

      {/* TOOLBAR */}

      <div className="subjects-toolbar">

        <div className="subjects-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search subject, code or faculty..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="subjects-filters">

          {["All", "Theory", "Practical"].map(
            (type) => (
              <button
                key={type}
                className={
                  typeFilter === type
                    ? "subjects-filter-active"
                    : ""
                }
                onClick={() =>
                  setTypeFilter(type)
                }
              >
                {type}
              </button>
            )
          )}

        </div>

      </div>

      <div className="subjects-result-count">
        Showing {filteredSubjects.length}{" "}
        {filteredSubjects.length === 1
          ? "subject"
          : "subjects"}
      </div>

      {/* LIST */}

      {filteredSubjects.length === 0 ? (

        <div className="subjects-empty">
          <BookOpen size={32} />
          <h3>No subjects found</h3>
          <p>
            Try changing your search or filter.
          </p>
        </div>

      ) : (

        <div className="subjects-grid">

          {filteredSubjects.map((subject) => {

            const attendancePercentage =
              getAttendance(subject.id);

            const attendanceStatus =
              getAttendanceStatus(
                attendancePercentage
              );

            const facultyInitial =
              subject.faculty
                .replace(/^Prof\.\s*/i, "")
                .trim()
                .charAt(0)
                .toUpperCase();

            return (
              <article
                className="subject-card"
                key={subject.id}
              >

                <div className="subject-card-header">

                  <div>
                    <span className="subject-code">
                      {subject.code}
                    </span>

                    <h2>{subject.name}</h2>
                  </div>

                  <span
                    className={`subject-type ${subject.type.toLowerCase()}`}
                  >
                    {subject.type}
                  </span>

                </div>

                {/* FACULTY */}

                <div className="subject-faculty">

                  <div className="faculty-avatar">
                    {facultyInitial}
                  </div>

                  <div>
                    <span>Faculty</span>
                    <strong>
                      {subject.faculty}
                    </strong>
                  </div>

                </div>

                {/* INFO */}

                <div className="subject-info">

                  <div>
                    <BookOpen size={15} />
                    <span>Credits</span>
                    <strong>
                      {subject.credits}
                    </strong>
                  </div>

                  <div>
                    <MapPin size={15} />
                    <span>Room</span>
                    <strong>
                      {subject.room}
                    </strong>
                  </div>

                  <div>
                    <CalendarDays size={15} />
                    <span>Attendance</span>
                    <strong
                      className={`attendance-${attendanceStatus}`}
                    >
                      {attendancePercentage}%
                    </strong>
                  </div>

                </div>

                {/* SCHEDULE */}

                <div className="subject-schedule">

                  <CalendarDays size={16} />

                  <div>
                    <span>Class Schedule</span>
                    <strong>
                      {subject.schedule}
                    </strong>
                  </div>

                </div>

                {/* FOOTER */}

                <div className="subject-card-footer">

                  <span>
                    Student View
                  </span>

                  <button
                    onClick={() =>
                      setSelectedSubject(subject)
                    }
                  >
                    View Details →
                  </button>

                </div>

              </article>
            );
          })}

        </div>
      )}

      {/* MODAL */}

      {selectedSubject && (

        <div
          className="subject-modal-backdrop"
          onClick={() =>
            setSelectedSubject(null)
          }
        >

          <div
            className="subject-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="subject-modal-header">

              <div>
                <span className="subject-code">
                  {selectedSubject.code}
                </span>

                <h2>
                  {selectedSubject.name}
                </h2>
              </div>

              <button
                className="subject-modal-close"
                onClick={() =>
                  setSelectedSubject(null)
                }
              >
                ×
              </button>

            </div>

            <div className="subject-modal-body">

              <div className="modal-detail">
                <UserRound size={17} />
                <div>
                  <span>Faculty</span>
                  <strong>
                    {selectedSubject.faculty}
                  </strong>
                </div>
              </div>

              <div className="modal-detail">
                <BookOpen size={17} />
                <div>
                  <span>Credits</span>
                  <strong>
                    {selectedSubject.credits}
                  </strong>
                </div>
              </div>

              <div className="modal-detail">
                <MapPin size={17} />
                <div>
                  <span>Room</span>
                  <strong>
                    {selectedSubject.room}
                  </strong>
                </div>
              </div>

              <div className="modal-detail">
                <CalendarDays size={17} />
                <div>
                  <span>Schedule</span>
                  <strong>
                    {selectedSubject.schedule}
                  </strong>
                </div>
              </div>

              <div className="modal-attendance">

                <div>
                  <span>Attendance</span>

                  <strong>
                    {getAttendance(
                      selectedSubject.id
                    )}
                    %
                  </strong>
                </div>

                <div className="modal-attendance-bar">
                  <div
                    style={{
                      width: `${getAttendance(
                        selectedSubject.id
                      )}%`,
                    }}
                  />
                </div>

              </div>

            </div>

            <div className="subject-modal-footer">

              <span>
                Subject information is managed
                by faculty.
              </span>

              <button
                onClick={() =>
                  setSelectedSubject(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Subjects;