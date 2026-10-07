import { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  FileText,
  Search,
  Upload,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";

import "./Assignments.css";

function Assignments() {
  const { currentUser } = useAuth();

  const {
    assignments,
    submissions,
    subjects,
    addItem,
    updateItem,
  } = useAppData();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [submissionMessage, setSubmissionMessage] =
    useState("");

  // =====================================================
  // SUBJECT
  // =====================================================

  const getSubject = (subjectId) => {
    return subjects.find(
      (subject) =>
        Number(subject.id) ===
        Number(subjectId)
    );
  };

  // =====================================================
  // STUDENT SUBMISSION
  // =====================================================

  const getStudentSubmission = (assignmentId) => {
    return submissions.find(
      (submission) =>
        Number(submission.assignmentId) ===
          Number(assignmentId) &&
        Number(submission.studentId) ===
          Number(currentUser?.id)
    );
  };

  // =====================================================
  // STATUS
  // =====================================================

  const getAssignmentStatus = (assignment) => {
    const submission =
      getStudentSubmission(assignment.id);

    if (submission) {
      return submission.status;
    }

    if (assignment.status !== "Published") {
      return "Closed";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate =
      new Date(assignment.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      return "Overdue";
    }

    return "Pending";
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredAssignments =
    assignments.filter((assignment) => {
      const subject = getSubject(
        assignment.subjectId
      );

      const search =
        searchTerm.toLowerCase().trim();

      const matchesSearch =
        assignment.title
          .toLowerCase()
          .includes(search) ||
        subject?.name
          ?.toLowerCase()
          .includes(search) ||
        subject?.code
          ?.toLowerCase()
          .includes(search);

      const assignmentStatus =
        getAssignmentStatus(
          assignment
        );

      const matchesStatus =
        statusFilter === "All" ||
        assignmentStatus === statusFilter;

      return (
        assignment.status === "Published" &&
        matchesSearch &&
        matchesStatus
      );
    });

  // =====================================================
  // COUNTS
  // =====================================================

  const pendingCount =
    assignments.filter(
      (assignment) =>
        getAssignmentStatus(
          assignment
        ) === "Pending"
    ).length;

  const submittedCount =
    assignments.filter(
      (assignment) =>
        getAssignmentStatus(
          assignment
        ) === "Submitted" ||
        getAssignmentStatus(
          assignment
        ) === "Reviewed"
    ).length;

  const overdueCount =
    assignments.filter(
      (assignment) =>
        getAssignmentStatus(
          assignment
        ) === "Overdue"
    ).length;

  // =====================================================
  // OPEN DETAILS
  // =====================================================

  const openAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setSelectedFile(null);
    setSubmissionMessage("");
  };

  const closeAssignment = () => {
    setSelectedAssignment(null);
    setSelectedFile(null);
    setSubmissionMessage("");
  };

  // =====================================================
  // FILE SELECT
  // =====================================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const maxSize =
      10 * 1024 * 1024;

    const allowedExtensions = [
      ".pdf",
      ".doc",
      ".docx",
      ".zip",
    ];

    const fileName =
      file.name.toLowerCase();

    const allowed =
      allowedExtensions.some(
        (extension) =>
          fileName.endsWith(extension)
      );

    if (!allowed) {
      setSubmissionMessage(
        "Please select a PDF, DOC, DOCX or ZIP file."
      );
      setSelectedFile(null);
      return;
    }

    if (file.size > maxSize) {
      setSubmissionMessage(
        "File size must be 10 MB or less."
      );
      setSelectedFile(null);
      return;
    }

    setSubmissionMessage("");
    setSelectedFile(file);
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmitAssignment = () => {
    if (!selectedAssignment) {
      return;
    }

    if (!selectedFile) {
      setSubmissionMessage(
        "Please select a file before submitting."
      );
      return;
    }

    const existingSubmission =
      getStudentSubmission(
        selectedAssignment.id
      );

    const submissionData = {
      assignmentId:
        Number(selectedAssignment.id),
      studentId:
        Number(currentUser?.id),
      fileName:
        selectedFile.name,
      submittedAt:
        new Date().toISOString(),
      status: "Submitted",
      marks: existingSubmission?.marks ?? null,
      feedback:
        existingSubmission?.feedback || "",
    };

    if (existingSubmission) {
      updateItem(
        "submissions",
        existingSubmission.id,
        submissionData
      );
    } else {
      addItem(
        "submissions",
        submissionData
      );
    }

    setSubmissionMessage(
      "Assignment submitted successfully."
    );

    setSelectedFile(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Date(
      dateString
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="student-assignments-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="student-assignments-header">

        <div>
          <span className="assignments-eyebrow">
            ACADEMIC WORK
          </span>

          <h1>Assignments</h1>

          <p>
            View assignments, deadlines and
            submit your work.
          </p>
        </div>

        <div className="assignment-total-card">

          <FileText size={18} />

          <div>
            <span>Total Assignments</span>
            <strong>
              {
                assignments.filter(
                  (item) =>
                    item.status ===
                    "Published"
                ).length
              }
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="student-assignment-summary">

        <div>
          <span>Pending</span>
          <strong>{pendingCount}</strong>
          <small>Need submission</small>
        </div>

        <div>
          <span>Submitted</span>
          <strong className="summary-green">
            {submittedCount}
          </strong>
          <small>Work submitted</small>
        </div>

        <div>
          <span>Overdue</span>
          <strong className="summary-red">
            {overdueCount}
          </strong>
          <small>Deadline passed</small>
        </div>

      </div>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="student-assignment-toolbar">

        <div className="assignment-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>

        <div className="assignment-status-filters">

          {[
            "All",
            "Pending",
            "Submitted",
            "Reviewed",
            "Overdue",
          ].map((status) => (

            <button
              key={status}
              className={
                statusFilter === status
                  ? "assignment-filter-active"
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
          LIST
      ================================================= */}

      {filteredAssignments.length ===
      0 ? (

        <div className="student-assignment-empty">

          <FileText size={34} />

          <h3>
            No assignments found
          </h3>

          <p>
            Try changing your search or filter.
          </p>

        </div>

      ) : (

        <div className="student-assignment-list">

          {filteredAssignments.map(
            (assignment) => {

              const subject =
                getSubject(
                  assignment.subjectId
                );

              const status =
                getAssignmentStatus(
                  assignment
                );

              const submission =
                getStudentSubmission(
                  assignment.id
                );

              return (

                <div
                  className="student-assignment-card"
                  key={assignment.id}
                >

                  <div className="assignment-card-icon">
                    <FileText size={20} />
                  </div>

                  <div className="assignment-card-content">

                    <div className="assignment-card-top">

                      <div>

                        <span>
                          {subject?.code ||
                            "N/A"}
                        </span>

                        <h2>
                          {assignment.title}
                        </h2>

                        <p>
                          {subject?.name ||
                            "Unknown Subject"}
                        </p>

                      </div>

                      <span
                        className={`assignment-status-badge ${status.toLowerCase()}`}
                      >
                        {status}
                      </span>

                    </div>

                    <p className="assignment-description">
                      {assignment.description}
                    </p>

                    <div className="assignment-card-footer">

                      <div className="assignment-meta">

                        <div>
                          <Clock3
                            size={14}
                          />

                          <span>
                            Due{" "}
                            {formatDate(
                              assignment.dueDate
                            )}
                          </span>
                        </div>

                        <span
                          className={`assignment-priority ${assignment.priority.toLowerCase()}`}
                        >
                          {assignment.priority}
                        </span>

                        {submission && (
                          <div>
                            <CheckCircle2
                              size={14}
                            />

                            <span>
                              {submission.fileName}
                            </span>
                          </div>
                        )}

                      </div>

                      <button
                        className="assignment-view-button"
                        onClick={() =>
                          openAssignment(
                            assignment
                          )
                        }
                      >
                        View & Submit →
                      </button>

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

      {/* =================================================
          DETAILS / SUBMISSION MODAL
      ================================================= */}

      {selectedAssignment && (

        <div
          className="student-assignment-modal-backdrop"
          onClick={closeAssignment}
        >

          <div
            className="student-assignment-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="assignment-modal-header">

              <div>
                <span>
                  {getSubject(
                    selectedAssignment.subjectId
                  )?.code || ""}
                </span>

                <h2>
                  {selectedAssignment.title}
                </h2>

                <p>
                  {getSubject(
                    selectedAssignment.subjectId
                  )?.name || ""}
                </p>
              </div>

              <button
                onClick={closeAssignment}
              >
                <X size={18} />
              </button>

            </div>

            <div className="assignment-modal-body">

              <div className="assignment-modal-description">

                <span>Description</span>

                <p>
                  {selectedAssignment.description}
                </p>

              </div>

              <div className="assignment-modal-details">

                <div>
                  <span>Due Date</span>
                  <strong>
                    {formatDate(
                      selectedAssignment.dueDate
                    )}
                  </strong>
                </div>

                <div>
                  <span>Priority</span>
                  <strong>
                    {selectedAssignment.priority}
                  </strong>
                </div>

                <div>
                  <span>Faculty</span>
                  <strong>
                    {getSubject(
                      selectedAssignment.subjectId
                    )?.faculty || ""}
                  </strong>
                </div>

              </div>

              <div className="assignment-upload-section">

                <div>
                  <Upload size={19} />

                  <div>
                    <strong>
                      Submit Assignment
                    </strong>

                    <span>
                      PDF, DOC, DOCX or ZIP • Max 10 MB
                    </span>
                  </div>
                </div>

                <label className="assignment-file-label">

                  Choose File

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.zip"
                    onChange={
                      handleFileChange
                    }
                  />

                </label>

                {selectedFile && (

                  <div className="selected-file">
                    <FileText size={15} />

                    <span>
                      {selectedFile.name}
                    </span>
                  </div>

                )}

                {submissionMessage && (
                  <div
                    className={
                      submissionMessage.includes(
                        "successfully"
                      )
                        ? "assignment-success-message"
                        : "assignment-error-message"
                    }
                  >
                    {submissionMessage}
                  </div>
                )}

                <button
                  className="assignment-submit-button"
                  onClick={
                    handleSubmitAssignment
                  }
                >
                  <Upload size={15} />
                  Submit Assignment
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Assignments;