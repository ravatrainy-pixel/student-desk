import { useState } from "react";
import {
  Edit3,
  FileText,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useAppData } from "../../context/AppDataContext";

import "./TeacherAssignments.css";

const emptyForm = {
  subjectId: "",
  title: "",
  description: "",
  dueDate: "",
  priority: "Medium",
  status: "Published",
};

function TeacherAssignments() {
  const {
    assignments,
    subjects,
    submissions,
    addItem,
    updateItem,
    deleteItem,
  } = useAppData();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [formData, setFormData] =
    useState(emptyForm);

  const [formError, setFormError] =
    useState("");

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredAssignments =
    assignments.filter((assignment) => {
      const subject =
        subjects.find(
          (item) =>
            Number(item.id) ===
            Number(
              assignment.subjectId
            )
        );

      const search =
        searchTerm
          .toLowerCase()
          .trim();

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

      const matchesStatus =
        statusFilter === "All" ||
        assignment.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // =====================================================
  // SUBMISSION COUNT
  // =====================================================

  const getSubmissionCount = (
    assignmentId
  ) => {
    return submissions.filter(
      (submission) =>
        Number(
          submission.assignmentId
        ) === Number(assignmentId)
    ).length;
  };

  // =====================================================
  // ADD
  // =====================================================

  const openAddModal = () => {
    setEditingId(null);

    setFormData({
      ...emptyForm,
      subjectId:
        subjects.length > 0
          ? subjects[0].id
          : "",
    });

    setFormError("");
    setIsModalOpen(true);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const openEditModal = (
    assignment
  ) => {
    setEditingId(
      assignment.id
    );

    setFormData({
      subjectId:
        assignment.subjectId || "",
      title:
        assignment.title || "",
      description:
        assignment.description || "",
      dueDate:
        assignment.dueDate || "",
      priority:
        assignment.priority ||
        "Medium",
      status:
        assignment.status ||
        "Published",
    });

    setFormError("");
    setIsModalOpen(true);
  };

  // =====================================================
  // CLOSE
  // =====================================================

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
    setFormError("");
  };

  // =====================================================
  // FORM
  // =====================================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (current) => ({
        ...current,
        [name]:
          name === "subjectId"
            ? Number(value)
            : value,
      })
    );
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    setFormError("");

    if (
      !formData.subjectId ||
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.dueDate
    ) {
      setFormError(
        "Please fill in all required fields."
      );

      return;
    }

    const assignmentData = {
      subjectId:
        Number(formData.subjectId),

      title:
        formData.title.trim(),

      description:
        formData.description.trim(),

      dueDate:
        formData.dueDate,

      priority:
        formData.priority,

      status:
        formData.status,

      createdBy: 6,
    };

    if (
      editingId !== null
    ) {
      updateItem(
        "assignments",
        editingId,
        assignmentData
      );
    } else {
      addItem(
        "assignments",
        assignmentData
      );
    }

    closeModal();
  };

  // =====================================================
  // DELETE
  // =====================================================

  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    deleteItem(
      "assignments",
      deleteTarget.id
    );

    setDeleteTarget(null);
  };

  // =====================================================
  // PUBLISH / CLOSE
  // =====================================================

  const toggleStatus = (
    assignment
  ) => {
    updateItem(
      "assignments",
      assignment.id,
      {
        status:
          assignment.status ===
          "Published"
            ? "Closed"
            : "Published",
      }
    );
  };

  return (
    <div className="teacher-assignments-page">

      {/* HEADER */}

      <div className="teacher-assignments-header">

        <div>

          <span className="teacher-assignments-eyebrow">
            ACADEMIC MANAGEMENT
          </span>

          <h1>
            Assignments
          </h1>

          <p>
            Create and manage student
            assignments and deadlines.
          </p>

        </div>

        <button
          className="teacher-add-assignment-button"
          onClick={openAddModal}
        >
          <Plus size={17} />
          Create Assignment
        </button>

      </div>

      {/* SUMMARY */}

      <div className="teacher-assignment-summary">

        <div>
          <span>Total</span>
          <strong>
            {assignments.length}
          </strong>
        </div>

        <div>
          <span>Published</span>
          <strong className="published-count">
            {
              assignments.filter(
                (item) =>
                  item.status ===
                  "Published"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Closed</span>
          <strong className="closed-count">
            {
              assignments.filter(
                (item) =>
                  item.status ===
                  "Closed"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Submissions</span>
          <strong>
            {submissions.length}
          </strong>
        </div>

      </div>

      {/* TOOLBAR */}

      <div className="teacher-assignment-toolbar">

        <div className="teacher-assignment-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search assignment or subject..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>

        <div className="teacher-assignment-filters">

          {[
            "All",
            "Published",
            "Closed",
          ].map((status) => (

            <button
              key={status}
              className={
                statusFilter ===
                status
                  ? "teacher-assignment-filter-active"
                  : ""
              }
              onClick={() =>
                setStatusFilter(
                  status
                )
              }
            >
              {status}
            </button>

          ))}

        </div>

      </div>

      {/* TABLE */}

      <div className="teacher-assignment-table-card">

        {filteredAssignments.length ===
        0 ? (

          <div className="teacher-assignment-empty">

            <FileText size={32} />

            <h3>
              No assignments found
            </h3>

            <p>
              Create an assignment or
              change your filter.
            </p>

          </div>

        ) : (

          <div className="teacher-assignment-table-wrapper">

            <table className="teacher-assignment-table">

              <thead>

                <tr>
                  <th>Assignment</th>
                  <th>Subject</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Submissions</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredAssignments.map(
                  (assignment) => {

                    const subject =
                      subjects.find(
                        (item) =>
                          Number(item.id) ===
                          Number(
                            assignment.subjectId
                          )
                      );

                    return (
                      <tr
                        key={
                          assignment.id
                        }
                      >

                        <td>
                          <div className="teacher-assignment-name">

                            <strong>
                              {assignment.title}
                            </strong>

                            <span>
                              {assignment.description}
                            </span>

                          </div>
                        </td>

                        <td>
                          {subject?.code ||
                            "N/A"}
                        </td>

                        <td>
                          {assignment.dueDate}
                        </td>

                        <td>

                          <span
                            className={`teacher-assignment-priority ${assignment.priority.toLowerCase()}`}
                          >
                            {assignment.priority}
                          </span>

                        </td>

                        <td>
                          {
                            getSubmissionCount(
                              assignment.id
                            )
                          }
                        </td>

                        <td>

                          <span
                            className={`teacher-assignment-status ${assignment.status.toLowerCase()}`}
                          >
                            {assignment.status}
                          </span>

                        </td>

                        <td>

                          <div className="teacher-assignment-actions">

                            <button
                              className="teacher-assignment-edit"
                              onClick={() =>
                                openEditModal(
                                  assignment
                                )
                              }
                            >
                              <Edit3
                                size={15}
                              />
                            </button>

                            <button
                              className="teacher-assignment-toggle"
                              onClick={() =>
                                toggleStatus(
                                  assignment
                                )
                              }
                            >
                              {assignment.status ===
                              "Published"
                                ? "Close"
                                : "Publish"}
                            </button>

                            <button
                              className="teacher-assignment-delete"
                              onClick={() =>
                                setDeleteTarget(
                                  assignment
                                )
                              }
                            >
                              <Trash2
                                size={15}
                              />
                            </button>

                          </div>

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

      {/* ADD / EDIT MODAL */}

      {isModalOpen && (

        <div
          className="teacher-assignment-modal-backdrop"
          onClick={closeModal}
        >

          <div
            className="teacher-assignment-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="teacher-assignment-modal-header">

              <div>
                <span>
                  {editingId !== null
                    ? "EDIT ASSIGNMENT"
                    : "NEW ASSIGNMENT"}
                </span>

                <h2>
                  {editingId !== null
                    ? "Edit Assignment"
                    : "Create Assignment"}
                </h2>
              </div>

              <button
                onClick={closeModal}
              >
                <X size={18} />
              </button>

            </div>

            <form
              className="teacher-assignment-form"
              onSubmit={handleSubmit}
            >

              <div className="teacher-assignment-form-grid">

                <div className="teacher-assignment-form-group">

                  <label>
                    Subject *
                  </label>

                  <select
                    name="subjectId"
                    value={
                      formData.subjectId
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="">
                      Select subject
                    </option>

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

                <div className="teacher-assignment-form-group">

                  <label>
                    Due Date *
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={
                      formData.dueDate
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                <div className="teacher-assignment-form-group teacher-assignment-full">

                  <label>
                    Assignment Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={
                      formData.title
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter assignment title"
                  />

                </div>

                <div className="teacher-assignment-form-group teacher-assignment-full">

                  <label>
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Describe the assignment requirements..."
                    rows="4"
                  />

                </div>

                <div className="teacher-assignment-form-group">

                  <label>
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={
                      formData.priority
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="High">
                      High
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="Low">
                      Low
                    </option>
                  </select>

                </div>

                <div className="teacher-assignment-form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="Published">
                      Published
                    </option>

                    <option value="Closed">
                      Closed
                    </option>
                  </select>

                </div>

              </div>

              {formError && (
                <div className="teacher-assignment-form-error">
                  {formError}
                </div>
              )}

              <div className="teacher-assignment-form-footer">

                <button
                  type="button"
                  className="teacher-assignment-cancel"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="teacher-assignment-save"
                >
                  {editingId !== null
                    ? "Save Changes"
                    : "Create Assignment"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* DELETE CONFIRMATION */}

      {deleteTarget && (

        <div
          className="teacher-assignment-modal-backdrop"
          onClick={() =>
            setDeleteTarget(null)
          }
        >

          <div
            className="teacher-assignment-delete-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="assignment-delete-icon">
              <Trash2 size={20} />
            </div>

            <h2>
              Delete Assignment?
            </h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {deleteTarget.title}
              </strong>
              ?
            </p>

            <div className="teacher-assignment-delete-actions">

              <button
                className="teacher-assignment-cancel"
                onClick={() =>
                  setDeleteTarget(null)
                }
              >
                Cancel
              </button>

              <button
                className="teacher-assignment-confirm-delete"
                onClick={confirmDelete}
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default TeacherAssignments;