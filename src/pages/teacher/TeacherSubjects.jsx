import { useState } from "react";
import {
  BookOpen,
  Edit3,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useAppData } from "../../context/AppDataContext";

import {
  createSubject,
  updateSubject,
  deleteSubject,
} from "../../services/api";

import "./TeacherSubjects.css";

const initialForm = {
  code: "",
  name: "",
  faculty: "",
  credits: "",
  type: "Theory",
  day: "Monday",
  time: "",
  room: "",
  semester: "7",
};

function TeacherSubjects() {
  const {
    subjects,
    setSection,
  } = useAppData();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [editingSubject, setEditingSubject] =
    useState(null);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [form, setForm] =
    useState(initialForm);

  const [saving, setSaving] =
    useState(false);

  const subjectList = subjects || [];

  // ---------------------------------------------------------
  // FILTER SUBJECTS
  // ---------------------------------------------------------

  const filteredSubjects = subjectList
    .filter((subject) => {
      const searchText = search
        .toLowerCase()
        .trim();

      if (!searchText) {
        return true;
      }

      return (
        subject.code
          ?.toLowerCase()
          .includes(searchText) ||
        subject.name
          ?.toLowerCase()
          .includes(searchText) ||
        subject.faculty
          ?.toLowerCase()
          .includes(searchText)
      );
    })
    .filter((subject) => {
      if (typeFilter === "All") {
        return true;
      }

      return subject.type === typeFilter;
    });

  // ---------------------------------------------------------
  // OPEN ADD FORM
  // ---------------------------------------------------------

  const openAddForm = () => {
    setEditingSubject(null);
    setForm(initialForm);
    setIsFormOpen(true);
  };

  // ---------------------------------------------------------
  // OPEN EDIT FORM
  // ---------------------------------------------------------

  const openEditForm = (subject) => {
    setEditingSubject(subject);

    setForm({
      code: subject.code || "",
      name: subject.name || "",
      faculty: subject.faculty || "",
      credits: subject.credits ?? "",
      type: subject.type || "Theory",
      day: subject.day || "Monday",
      time: subject.time || "",
      room: subject.room || "",
      semester: subject.semester ?? "7",
    });

    setIsFormOpen(true);
  };

  // ---------------------------------------------------------
  // CLOSE FORM
  // ---------------------------------------------------------

  const closeForm = () => {
    if (saving) {
      return;
    }

    setIsFormOpen(false);
    setEditingSubject(null);
    setForm(initialForm);
  };

  // ---------------------------------------------------------
  // HANDLE INPUT
  // ---------------------------------------------------------

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ---------------------------------------------------------
  // VALIDATION
  // ---------------------------------------------------------

  const validateForm = () => {
    const code =
      form.code.trim().toUpperCase();

    const name =
      form.name.trim();

    const faculty =
      form.faculty.trim();

    const credits =
      Number(form.credits);

    const semester =
      Number(form.semester);

    if (!code) {
      alert("Please enter subject code.");
      return false;
    }

    if (!name) {
      alert("Please enter subject name.");
      return false;
    }

    if (!faculty) {
      alert("Please enter faculty name.");
      return false;
    }

    if (
      form.credits === "" ||
      Number.isNaN(credits) ||
      credits <= 0
    ) {
      alert(
        "Please enter valid credits."
      );
      return false;
    }

    if (
      form.semester === "" ||
      Number.isNaN(semester) ||
      semester < 1 ||
      semester > 8
    ) {
      alert(
        "Semester must be between 1 and 8."
      );
      return false;
    }

    // Prevent duplicate subject code
    const duplicateCode =
      subjectList.some((subject) => {
        const sameCode =
          subject.code
            ?.toLowerCase() ===
          code.toLowerCase();

        const sameSubject =
          editingSubject &&
          Number(subject.id) ===
            Number(editingSubject.id);

        return sameCode && !sameSubject;
      });

    if (duplicateCode) {
      alert(
        "A subject with this code already exists."
      );
      return false;
    }

    return true;
  };

  // ---------------------------------------------------------
  // ADD / UPDATE SUBJECT
  // ---------------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const subjectData = {
        code: form.code
          .trim()
          .toUpperCase(),

        name: form.name.trim(),

        faculty: form.faculty.trim(),

        credits: Number(
          form.credits
        ),

        type: form.type,

        day: form.day,

        time: form.time.trim(),

        room: form.room.trim(),

        semester: Number(
          form.semester
        ),
      };

      // -----------------------------------------------------
      // UPDATE
      // -----------------------------------------------------

      if (editingSubject) {
        const updatedSubject =
          await updateSubject(
            editingSubject.id,
            {
              ...editingSubject,
              ...subjectData,
              id: editingSubject.id,
            }
          );

        const updatedSubjects =
          subjectList.map(
            (subject) =>
              Number(subject.id) ===
              Number(
                editingSubject.id
              )
                ? updatedSubject
                : subject
          );

        setSection(
          "subjects",
          updatedSubjects
        );

        alert(
          "Subject updated successfully."
        );
      }

      // -----------------------------------------------------
      // ADD
      // -----------------------------------------------------

      else {
        const newSubject =
          await createSubject(
            subjectData
          );

        setSection(
          "subjects",
          [
            ...subjectList,
            newSubject,
          ]
        );

        alert(
          "Subject added successfully."
        );
      }

      closeForm();
    } catch (error) {
      console.error(
        "Subject API error:",
        error
      );

      alert(
        "Unable to save subject. Please make sure the API server is running."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------
  // DELETE SUBJECT
  // ---------------------------------------------------------

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setSaving(true);

      await deleteSubject(
        deleteTarget.id
      );

      const updatedSubjects =
        subjectList.filter(
          (subject) =>
            Number(subject.id) !==
            Number(deleteTarget.id)
        );

      setSection(
        "subjects",
        updatedSubjects
      );

      setDeleteTarget(null);

      alert(
        "Subject deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete subject API error:",
        error
      );

      alert(
        "Unable to delete subject. Please make sure the API server is running."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------
  // RESET FILTERS
  // ---------------------------------------------------------

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("All");
  };

  return (
    <div className="teacher-subjects-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="teacher-subjects-header">

        <div>
          <p className="teacher-subjects-eyebrow">
            Academic Management
          </p>

          <h1>Subjects</h1>

          <p>
            Add, edit and manage subjects for students.
          </p>
        </div>

        <button
          type="button"
          className="add-subject-btn"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Add Subject
        </button>

      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="teacher-subject-summary">

        <div className="teacher-subject-summary-card">

          <div className="teacher-subject-summary-icon">
            <BookOpen size={20} />
          </div>

          <div>
            <span>Total Subjects</span>

            <strong>
              {subjectList.length}
            </strong>
          </div>

        </div>

        <div className="teacher-subject-summary-card">

          <div className="teacher-subject-summary-icon">
            <BookOpen size={20} />
          </div>

          <div>
            <span>Theory</span>

            <strong>
              {
                subjectList.filter(
                  (subject) =>
                    subject.type === "Theory"
                ).length
              }
            </strong>
          </div>

        </div>

        <div className="teacher-subject-summary-card">

          <div className="teacher-subject-summary-icon">
            <BookOpen size={20} />
          </div>

          <div>
            <span>Practical</span>

            <strong>
              {
                subjectList.filter(
                  (subject) =>
                    subject.type ===
                    "Practical"
                ).length
              }
            </strong>
          </div>

        </div>

        <div className="teacher-subject-summary-card">

          <div className="teacher-subject-summary-icon">
            <BookOpen size={20} />
          </div>

          <div>
            <span>Showing</span>

            <strong>
              {filteredSubjects.length}
            </strong>
          </div>

        </div>

      </div>

      {/* =====================================================
          SEARCH & FILTER
      ===================================================== */}

      <div className="teacher-subject-toolbar">

        <div className="teacher-subject-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search by code, subject or faculty..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>

        <div className="teacher-subject-filters">

          {[
            "All",
            "Theory",
            "Practical",
          ].map((type) => (
            <button
              type="button"
              key={type}
              className={
                typeFilter === type
                  ? "active"
                  : ""
              }
              onClick={() =>
                setTypeFilter(type)
              }
            >
              {type}
            </button>
          ))}

        </div>

        {(search ||
          typeFilter !== "All") && (
          <button
            type="button"
            className="clear-subject-filter"
            onClick={clearFilters}
          >
            Clear
          </button>
        )}

      </div>

      {/* =====================================================
          SUBJECT TABLE
      ===================================================== */}

      <div className="teacher-subjects-card">

        {filteredSubjects.length === 0 ? (
          <div className="teacher-subjects-empty">

            <BookOpen size={42} />

            <h3>
              No subjects found
            </h3>

            <p>
              Try changing your search or filter.
            </p>

            <button
              type="button"
              onClick={openAddForm}
            >
              <Plus size={16} />
              Add Subject
            </button>

          </div>
        ) : (
          <div className="teacher-subject-table-wrapper">

            <table className="teacher-subject-table">

              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Faculty</th>
                  <th>Credits</th>
                  <th>Type</th>
                  <th>Schedule</th>
                  <th>Room</th>
                  <th>Semester</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredSubjects.map(
                  (subject) => (
                    <tr
                      key={subject.id}
                    >

                      <td>
                        <div className="teacher-subject-name">

                          <strong>
                            {subject.code}
                          </strong>

                          <span>
                            {subject.name}
                          </span>

                        </div>
                      </td>

                      <td>
                        {subject.faculty ||
                          "-"}
                      </td>

                      <td>
                        {subject.credits ||
                          "-"}
                      </td>

                      <td>
                        <span className="teacher-subject-type">
                          {subject.type ||
                            "Theory"}
                        </span>
                      </td>

                      <td>
                        <div className="teacher-subject-schedule">

                          <strong>
                            {subject.day ||
                              "-"}
                          </strong>

                          <span>
                            {subject.time ||
                              "-"}
                          </span>

                        </div>
                      </td>

                      <td>
                        {subject.room ||
                          "-"}
                      </td>

                      <td>
                        {subject.semester
                          ? `Semester ${subject.semester}`
                          : "-"}
                      </td>

                      <td>

                        <div className="teacher-subject-actions">

                          <button
                            type="button"
                            title="Edit subject"
                            onClick={() =>
                              openEditForm(
                                subject
                              )
                            }
                          >
                            <Edit3
                              size={16}
                            />
                          </button>

                          <button
                            type="button"
                            title="Delete subject"
                            className="delete-subject-action"
                            onClick={() =>
                              setDeleteTarget(
                                subject
                              )
                            }
                          >
                            <Trash2
                              size={16}
                            />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {isFormOpen && (
        <div
          className="teacher-subject-modal-overlay"
          onClick={closeForm}
        >

          <div
            className="teacher-subject-form-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="teacher-subject-modal-header">

              <div>
                <h2>
                  {editingSubject
                    ? "Edit Subject"
                    : "Add Subject"}
                </h2>

                <p>
                  Enter the subject information below.
                </p>
              </div>

              <button
                type="button"
                className="teacher-subject-close-btn"
                onClick={closeForm}
                disabled={saving}
              >
                <X size={19} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
            >

              {/* CODE + NAME */}

              <div className="teacher-subject-form-row">

                <div className="teacher-subject-form-field">

                  <label>
                    Subject Code
                  </label>

                  <input
                    type="text"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="e.g. CE407"
                    disabled={saving}
                  />

                </div>

                <div className="teacher-subject-form-field">

                  <label>
                    Subject Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Cloud Computing"
                    disabled={saving}
                  />

                </div>

              </div>

              {/* FACULTY + CREDITS */}

              <div className="teacher-subject-form-row">

                <div className="teacher-subject-form-field">

                  <label>
                    Faculty
                  </label>

                  <input
                    type="text"
                    name="faculty"
                    value={form.faculty}
                    onChange={handleChange}
                    placeholder="e.g. Prof. Mehta"
                    disabled={saving}
                  />

                </div>

                <div className="teacher-subject-form-field">

                  <label>
                    Credits
                  </label>

                  <input
                    type="number"
                    name="credits"
                    value={form.credits}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    placeholder="e.g. 3"
                    disabled={saving}
                  />

                </div>

              </div>

              {/* TYPE + DAY */}

              <div className="teacher-subject-form-row">

                <div className="teacher-subject-form-field">

                  <label>
                    Type
                  </label>

                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    disabled={saving}
                  >
                    <option value="Theory">
                      Theory
                    </option>

                    <option value="Practical">
                      Practical
                    </option>
                  </select>

                </div>

                <div className="teacher-subject-form-field">

                  <label>
                    Day
                  </label>

                  <select
                    name="day"
                    value={form.day}
                    onChange={handleChange}
                    disabled={saving}
                  >
                    <option value="Monday">
                      Monday
                    </option>

                    <option value="Tuesday">
                      Tuesday
                    </option>

                    <option value="Wednesday">
                      Wednesday
                    </option>

                    <option value="Thursday">
                      Thursday
                    </option>

                    <option value="Friday">
                      Friday
                    </option>

                    <option value="Saturday">
                      Saturday
                    </option>
                  </select>

                </div>

              </div>

              {/* TIME + ROOM */}

              <div className="teacher-subject-form-row">

                <div className="teacher-subject-form-field">

                  <label>
                    Time
                  </label>

                  <input
                    type="text"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    placeholder="e.g. 10:00 - 11:00"
                    disabled={saving}
                  />

                </div>

                <div className="teacher-subject-form-field">

                  <label>
                    Room
                  </label>

                  <input
                    type="text"
                    name="room"
                    value={form.room}
                    onChange={handleChange}
                    placeholder="e.g. Room 107"
                    disabled={saving}
                  />

                </div>

              </div>

              {/* SEMESTER */}

              <div className="teacher-subject-form-field">

                <label>
                  Semester
                </label>

                <select
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="1">
                    Semester 1
                  </option>

                  <option value="2">
                    Semester 2
                  </option>

                  <option value="3">
                    Semester 3
                  </option>

                  <option value="4">
                    Semester 4
                  </option>

                  <option value="5">
                    Semester 5
                  </option>

                  <option value="6">
                    Semester 6
                  </option>

                  <option value="7">
                    Semester 7
                  </option>

                  <option value="8">
                    Semester 8
                  </option>
                </select>

              </div>

              {/* ACTIONS */}

              <div className="teacher-subject-form-actions">

                <button
                  type="button"
                  className="cancel-subject-btn"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-subject-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingSubject
                    ? "Update Subject"
                    : "Add Subject"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =====================================================
          DELETE CONFIRMATION
      ===================================================== */}

      {deleteTarget && (
        <div
          className="teacher-subject-modal-overlay"
          onClick={() =>
            !saving &&
            setDeleteTarget(null)
          }
        >

          <div
            className="delete-subject-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="delete-subject-icon">
              <Trash2 size={22} />
            </div>

            <h2>
              Delete Subject?
            </h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {deleteTarget.name}
              </strong>
              ?
            </p>

            <div className="delete-subject-actions">

              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-delete-subject-btn"
                onClick={handleDelete}
                disabled={saving}
              >
                {saving
                  ? "Deleting..."
                  : "Delete"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default TeacherSubjects;