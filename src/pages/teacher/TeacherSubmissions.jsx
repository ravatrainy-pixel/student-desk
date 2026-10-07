import { useState } from "react";
import {
  CheckCircle2,
  FileText,
  MessageSquare,
  Search,
  Upload,
  X,
} from "lucide-react";

import { useAppData } from "../../context/AppDataContext";

import "./TeacherSubmissions.css";

function TeacherSubmissions() {
  const {
    assignments,
    submissions,
    subjects,
    users,
    updateItem,
  } = useAppData();

  const students = users.filter(
    (user) => user.role === "student"
  );

  const [selectedAssignmentId, setSelectedAssignmentId] =
    useState(
      assignments.length > 0
        ? assignments[0].id
        : ""
    );

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  const [marks, setMarks] = useState("");

  const [feedback, setFeedback] =
    useState("");

  const [reviewMessage, setReviewMessage] =
    useState("");

  // =====================================================
  // HELPERS
  // =====================================================

  const getStudent = (studentId) => {
    return students.find(
      (student) =>
        Number(student.id) ===
        Number(studentId)
    );
  };

  const getSubject = (subjectId) => {
    return subjects.find(
      (subject) =>
        Number(subject.id) ===
        Number(subjectId)
    );
  };

  const selectedAssignment = assignments.find(
    (assignment) =>
      Number(assignment.id) ===
      Number(selectedAssignmentId)
  );

  // =====================================================
  // SUBMISSIONS FOR SELECTED ASSIGNMENT
  // =====================================================

  const assignmentSubmissions =
    submissions.filter(
      (submission) =>
        Number(submission.assignmentId) ===
        Number(selectedAssignmentId)
    );

  // =====================================================
  // FILTERED SUBMISSIONS
  // =====================================================

  const filteredSubmissions =
    assignmentSubmissions.filter(
      (submission) => {
        const student = getStudent(
          submission.studentId
        );

        const search =
          searchTerm
            .toLowerCase()
            .trim();

        const matchesSearch =
          student?.name
            ?.toLowerCase()
            .includes(search) ||
          student?.enrollmentNo
            ?.toLowerCase()
            .includes(search) ||
          submission.fileName
            ?.toLowerCase()
            .includes(search);

        const matchesStatus =
          statusFilter === "All" ||
          submission.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  // =====================================================
  // COUNTS
  // =====================================================

  const submittedCount =
    assignmentSubmissions.filter(
      (submission) =>
        submission.status ===
        "Submitted"
    ).length;

  const reviewedCount =
    assignmentSubmissions.filter(
      (submission) =>
        submission.status ===
        "Reviewed"
    ).length;

  // =====================================================
  // OPEN REVIEW
  // =====================================================

  const openReview = (submission) => {
    setSelectedSubmission(
      submission
    );

    setMarks(
      submission.marks !== null &&
        submission.marks !== undefined
        ? String(submission.marks)
        : ""
    );

    setFeedback(
      submission.feedback || ""
    );

    setReviewMessage("");
  };

  // =====================================================
  // CLOSE REVIEW
  // =====================================================

  const closeReview = () => {
    setSelectedSubmission(null);
    setMarks("");
    setFeedback("");
    setReviewMessage("");
  };

  // =====================================================
  // SAVE REVIEW
  // =====================================================

  const saveReview = () => {
    if (!selectedSubmission) {
      return;
    }

    if (
      marks === "" ||
      Number(marks) < 0 ||
      Number(marks) > 100
    ) {
      setReviewMessage(
        "Please enter marks between 0 and 100."
      );

      return;
    }

    updateItem(
      "submissions",
      selectedSubmission.id,
      {
        marks: Number(marks),
        feedback: feedback.trim(),
        status: "Reviewed",
      }
    );

    setReviewMessage(
      "Submission reviewed successfully."
    );
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDateTime = (
    dateString
  ) => {
    if (!dateString) {
      return "Not available";
    }

    return new Date(
      dateString
    ).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="teacher-submissions-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="teacher-submissions-header">

        <div>

          <span className="teacher-submissions-eyebrow">
            ASSIGNMENT REVIEW
          </span>

          <h1>Submissions</h1>

          <p>
            Review student submissions,
            assign marks and provide feedback.
          </p>

        </div>

        <div className="submissions-header-icon">
          <Upload size={20} />
        </div>

      </div>

      {/* =================================================
          ASSIGNMENT SELECTOR
      ================================================= */}

      <div className="submissions-assignment-selector">

        <div>

          <label>
            Select Assignment
          </label>

          <select
            value={selectedAssignmentId}
            onChange={(event) => {
              setSelectedAssignmentId(
                event.target.value
              );

              setSelectedSubmission(null);
              setSearchTerm("");
              setStatusFilter("All");
            }}
          >

            {assignments.map(
              (assignment) => {

                const subject =
                  getSubject(
                    assignment.subjectId
                  );

                return (
                  <option
                    key={assignment.id}
                    value={assignment.id}
                  >
                    {subject?.code || "N/A"} -{" "}
                    {assignment.title}
                  </option>
                );
              }
            )}

          </select>

        </div>

        <div className="submission-assignment-info">

          <div>
            <span>Subject</span>

            <strong>
              {getSubject(
                selectedAssignment?.subjectId
              )?.name ||
                "No subject"}
            </strong>
          </div>

          <div>
            <span>Due Date</span>

            <strong>
              {selectedAssignment?.dueDate ||
                "Not set"}
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="teacher-submission-summary">

        <div>
          <span>Total Submissions</span>

          <strong>
            {assignmentSubmissions.length}
          </strong>
        </div>

        <div>
          <span>Submitted</span>

          <strong className="submission-summary-blue">
            {submittedCount}
          </strong>
        </div>

        <div>
          <span>Reviewed</span>

          <strong className="submission-summary-green">
            {reviewedCount}
          </strong>
        </div>

      </div>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="teacher-submissions-toolbar">

        <div className="teacher-submissions-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search student or file..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>

        <div className="teacher-submission-filters">

          {[
            "All",
            "Submitted",
            "Reviewed",
          ].map((status) => (

            <button
              key={status}
              className={
                statusFilter === status
                  ? "teacher-submission-filter-active"
                  : ""
              }
              onClick={() =>
                setStatusFilter(status)
              }
            >
              {status}
            </button>

          ))}

        </div>

      </div>

      {/* =================================================
          SUBMISSION TABLE
      ================================================= */}

      <div className="teacher-submissions-table-card">

        {filteredSubmissions.length ===
        0 ? (

          <div className="teacher-submissions-empty">

            <FileText size={32} />

            <h3>
              No submissions found
            </h3>

            <p>
              Students have not submitted
              this assignment yet.
            </p>

          </div>

        ) : (

          <div className="teacher-submissions-table-wrapper">

            <table className="teacher-submissions-table">

              <thead>

                <tr>
                  <th>Student</th>
                  <th>File</th>
                  <th>Submitted</th>
                  <th>Marks</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredSubmissions.map(
                  (submission) => {

                    const student =
                      getStudent(
                        submission.studentId
                      );

                    return (
                      <tr
                        key={
                          submission.id
                        }
                      >

                        <td>

                          <div className="submission-student">

                            <div className="submission-student-avatar">
                              {student?.name
                                ?.charAt(0)
                                .toUpperCase() ||
                                "S"}
                            </div>

                            <div>

                              <strong>
                                {student?.name ||
                                  "Unknown Student"}
                              </strong>

                              <span>
                                {student?.enrollmentNo ||
                                  "N/A"}
                              </span>

                            </div>

                          </div>

                        </td>

                        <td>

                          <div className="submission-file">

                            <FileText
                              size={16}
                            />

                            <div>

                              <strong>
                                {submission.fileName ||
                                  "No file"}
                              </strong>

                              <span>
                                Assignment file
                              </span>

                            </div>

                          </div>

                        </td>

                        <td>
                          {formatDateTime(
                            submission.submittedAt
                          )}
                        </td>

                        <td>

                          {submission.marks !==
                          null &&
                          submission.marks !==
                          undefined
                            ? `${submission.marks}/100`
                            : "Not graded"}

                        </td>

                        <td>

                          <span
                            className={`submission-table-status ${submission.status.toLowerCase()}`}
                          >
                            {submission.status}
                          </span>

                        </td>

                        <td>

                          <button
                            className="review-submission-button"
                            onClick={() =>
                              openReview(
                                submission
                              )
                            }
                          >
                            {submission.status ===
                            "Reviewed"
                              ? "View Review"
                              : "Review"}
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =================================================
          REVIEW MODAL
      ================================================= */}

      {selectedSubmission && (

        <div
          className="teacher-submission-modal-backdrop"
          onClick={closeReview}
        >

          <div
            className="teacher-submission-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="teacher-submission-modal-header">

              <div>

                <span>
                  SUBMISSION REVIEW
                </span>

                <h2>
                  {getStudent(
                    selectedSubmission.studentId
                  )?.name ||
                    "Student"}
                </h2>

                <p>
                  {selectedSubmission.fileName}
                </p>

              </div>

              <button
                onClick={closeReview}
              >
                <X size={18} />
              </button>

            </div>

            <div className="teacher-submission-modal-body">

              {/* STUDENT */}

              <div className="review-student-card">

                <div className="review-student-avatar">

                  {getStudent(
                    selectedSubmission.studentId
                  )?.name
                    ?.charAt(0)
                    .toUpperCase() || "S"}

                </div>

                <div>

                  <strong>
                    {getStudent(
                      selectedSubmission.studentId
                    )?.name ||
                      "Unknown Student"}
                  </strong>

                  <span>
                    {getStudent(
                      selectedSubmission.studentId
                    )?.enrollmentNo ||
                      ""}
                  </span>

                </div>

              </div>

              {/* FILE */}

              <div className="review-file-card">

                <FileText size={19} />

                <div>

                  <strong>
                    {selectedSubmission.fileName ||
                      "Submitted File"}
                  </strong>

                  <span>
                    Submitted{" "}
                    {formatDateTime(
                      selectedSubmission.submittedAt
                    )}
                  </span>

                </div>

              </div>

              <div className="review-file-note">
                <MessageSquare size={14} />
                <span>
                  File storage is frontend-only in
                  this version. The submission record
                  and filename are stored locally.
                </span>
              </div>

              {/* MARKS */}

              <div className="review-form-group">

                <label>
                  Marks *
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={marks}
                  onChange={(event) =>
                    setMarks(
                      event.target.value
                    )
                  }
                  placeholder="Enter marks out of 100"
                />

              </div>

              {/* FEEDBACK */}

              <div className="review-form-group">

                <label>
                  Feedback
                </label>

                <textarea
                  rows="4"
                  value={feedback}
                  onChange={(event) =>
                    setFeedback(
                      event.target.value
                    )
                  }
                  placeholder="Write feedback for the student..."
                />

              </div>

              {reviewMessage && (

                <div
                  className={
                    reviewMessage.includes(
                      "successfully"
                    )
                      ? "review-success-message"
                      : "review-error-message"
                  }
                >
                  {reviewMessage}
                </div>

              )}

            </div>

            <div className="teacher-submission-modal-footer">

              <button
                className="review-cancel-button"
                onClick={closeReview}
              >
                Close
              </button>

              <button
                className="review-save-button"
                onClick={saveReview}
              >
                <CheckCircle2 size={15} />
                Save Review
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default TeacherSubmissions;