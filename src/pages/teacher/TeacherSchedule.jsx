import { useState } from "react";
import {
  CalendarDays,
  Edit3,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useAppData } from "../../context/AppDataContext";

import "./TeacherSchedule.css";

const emptyForm = {
  subjectId: "",
  day: "Monday",
  time: "",
  faculty: "",
  room: "",
  type: "Lecture",
  semester: 7,
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

function TeacherSchedule() {
  const {
    schedules,
    subjects,
    addItem,
    updateItem,
    deleteItem,
  } = useAppData();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedDay, setSelectedDay] =
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
  // GET SUBJECT
  // =====================================================

  const getSubject = (subjectId) => {
    return subjects.find(
      (subject) =>
        Number(subject.id) ===
        Number(subjectId)
    );
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredSchedules =
    schedules.filter((item) => {
      const subject = getSubject(
        item.subjectId
      );

      const search = searchTerm
        .toLowerCase()
        .trim();

      const subjectName =
        subject?.name?.toLowerCase() || "";

      const subjectCode =
        subject?.code?.toLowerCase() || "";

      const faculty =
        item.faculty?.toLowerCase() || "";

      const room =
        item.room?.toLowerCase() || "";

      const matchesSearch =
        subjectName.includes(search) ||
        subjectCode.includes(search) ||
        faculty.includes(search) ||
        room.includes(search);

      const matchesDay =
        selectedDay === "All" ||
        item.day === selectedDay;

      return matchesSearch && matchesDay;
    });

  // =====================================================
  // OPEN ADD
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
  // OPEN EDIT
  // =====================================================

  const openEditModal = (schedule) => {
    setEditingId(schedule.id);

    setFormData({
      subjectId: schedule.subjectId || "",
      day: schedule.day || "Monday",
      time: schedule.time || "",
      faculty: schedule.faculty || "",
      room: schedule.room || "",
      type: schedule.type || "Lecture",
      semester: schedule.semester || 7,
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
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    if (name === "subjectId") {
      const selectedSubject =
        getSubject(value);

      setFormData((current) => ({
        ...current,
        subjectId: value,
        faculty:
          selectedSubject?.faculty ||
          current.faculty,
      }));

      return;
    }

    setFormData((current) => ({
      ...current,
      [name]:
        name === "semester"
          ? Number(value)
          : value,
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    setFormError("");

    if (
      !formData.subjectId ||
      !formData.time.trim() ||
      !formData.faculty.trim() ||
      !formData.room.trim()
    ) {
      setFormError(
        "Please fill in all required fields."
      );

      return;
    }

    const scheduleData = {
      subjectId: Number(
        formData.subjectId
      ),
      day: formData.day,
      time: formData.time.trim(),
      faculty: formData.faculty.trim(),
      room: formData.room.trim(),
      type: formData.type,
      semester: Number(
        formData.semester
      ),
    };

    if (editingId !== null) {
      updateItem(
        "schedules",
        editingId,
        scheduleData
      );
    } else {
      addItem(
        "schedules",
        scheduleData
      );
    }

    closeModal();
  };

  // =====================================================
  // DELETE
  // =====================================================

  const confirmDelete = () => {
    if (!deleteTarget) return;

    deleteItem(
      "schedules",
      deleteTarget.id
    );

    setDeleteTarget(null);
  };

  return (
    <div className="teacher-schedule-page">

      {/* HEADER */}

      <div className="teacher-schedule-header">

        <div>
          <span className="teacher-schedule-eyebrow">
            ACADEMIC MANAGEMENT
          </span>

          <h1>Class Schedule</h1>

          <p>
            Create and manage the weekly class
            schedule for students.
          </p>
        </div>

        <button
          className="teacher-add-schedule-button"
          onClick={openAddModal}
        >
          <Plus size={17} />
          Add Class
        </button>

      </div>

      {/* SUMMARY */}

      <div className="teacher-schedule-summary">

        <div>
          <span>Total Classes</span>
          <strong>
            {schedules.length}
          </strong>
        </div>

        <div>
          <span>Monday</span>
          <strong>
            {
              schedules.filter(
                (item) =>
                  item.day === "Monday"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Tuesday</span>
          <strong>
            {
              schedules.filter(
                (item) =>
                  item.day === "Tuesday"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Practical</span>
          <strong>
            {
              schedules.filter(
                (item) =>
                  item.type === "Practical"
              ).length
            }
          </strong>
        </div>

      </div>

      {/* TOOLBAR */}

      <div className="teacher-schedule-toolbar">

        <div className="teacher-schedule-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search subject, faculty or room..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>

        <div className="teacher-schedule-filters">

          <button
            className={
              selectedDay === "All"
                ? "teacher-schedule-filter-active"
                : ""
            }
            onClick={() =>
              setSelectedDay("All")
            }
          >
            All
          </button>

          {days.map((day) => (
            <button
              key={day}
              className={
                selectedDay === day
                  ? "teacher-schedule-filter-active"
                  : ""
              }
              onClick={() =>
                setSelectedDay(day)
              }
            >
              {day}
            </button>
          ))}

        </div>

      </div>

      {/* TABLE */}

      <div className="teacher-schedule-table-card">

        <div className="teacher-schedule-table-header">

          <div>
            <h2>Weekly Schedule</h2>

            <p>
              {filteredSchedules.length}{" "}
              {filteredSchedules.length === 1
                ? "class"
                : "classes"}{" "}
              found
            </p>
          </div>

        </div>

        {filteredSchedules.length === 0 ? (

          <div className="teacher-schedule-empty">

            <CalendarDays size={32} />

            <h3>
              No classes found
            </h3>

            <p>
              Add a class or change your filter.
            </p>

          </div>

        ) : (

          <div className="teacher-schedule-table-wrapper">

            <table className="teacher-schedule-table">

              <thead>

                <tr>
                  <th>Day</th>
                  <th>Subject</th>
                  <th>Time</th>
                  <th>Faculty</th>
                  <th>Room</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredSchedules.map(
                  (schedule) => {

                    const subject =
                      getSubject(
                        schedule.subjectId
                      );

                    return (
                      <tr
                        key={schedule.id}
                      >

                        <td>
                          <strong>
                            {schedule.day}
                          </strong>
                        </td>

                        <td>
                          <div className="teacher-schedule-subject">

                            <span>
                              {subject?.code ||
                                "N/A"}
                            </span>

                            <strong>
                              {subject?.name ||
                                "Unknown Subject"}
                            </strong>

                          </div>
                        </td>

                        <td>
                          {schedule.time}
                        </td>

                        <td>
                          {schedule.faculty}
                        </td>

                        <td>
                          {schedule.room}
                        </td>

                        <td>

                          <span
                            className={`teacher-schedule-type ${
                              (
                                schedule.type ||
                                "Lecture"
                              ).toLowerCase()
                            }`}
                          >
                            {schedule.type ||
                              "Lecture"}
                          </span>

                        </td>

                        <td>

                          <div className="teacher-schedule-actions">

                            <button
                              className="teacher-edit-schedule"
                              onClick={() =>
                                openEditModal(
                                  schedule
                                )
                              }
                            >
                              <Edit3 size={15} />
                            </button>

                            <button
                              className="teacher-delete-schedule"
                              onClick={() =>
                                setDeleteTarget(
                                  schedule
                                )
                              }
                            >
                              <Trash2 size={15} />
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
          className="teacher-schedule-modal-backdrop"
          onClick={closeModal}
        >

          <div
            className="teacher-schedule-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="teacher-schedule-modal-header">

              <div>

                <span>
                  {editingId !== null
                    ? "EDIT CLASS"
                    : "NEW CLASS"}
                </span>

                <h2>
                  {editingId !== null
                    ? "Edit Schedule"
                    : "Add Class"}
                </h2>

              </div>

              <button
                className="teacher-schedule-close"
                onClick={closeModal}
              >
                <X size={18} />
              </button>

            </div>

            <form
              className="teacher-schedule-form"
              onSubmit={handleSubmit}
            >

              <div className="teacher-schedule-form-grid">

                <div className="teacher-schedule-form-group">

                  <label>
                    Subject *
                  </label>

                  <select
                    name="subjectId"
                    value={formData.subjectId}
                    onChange={handleChange}
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

                <div className="teacher-schedule-form-group">

                  <label>
                    Day *
                  </label>

                  <select
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                  >
                    {days.map((day) => (
                      <option
                        key={day}
                        value={day}
                      >
                        {day}
                      </option>
                    ))}
                  </select>

                </div>

                <div className="teacher-schedule-form-group">

                  <label>
                    Time *
                  </label>

                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    placeholder="09:00 AM - 10:00 AM"
                  />

                </div>

                <div className="teacher-schedule-form-group">

                  <label>
                    Faculty *
                  </label>

                  <input
                    type="text"
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    placeholder="Prof. Name"
                  />

                </div>

                <div className="teacher-schedule-form-group">

                  <label>
                    Room *
                  </label>

                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    placeholder="Room 204"
                  />

                </div>

                <div className="teacher-schedule-form-group">

                  <label>
                    Class Type
                  </label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="Lecture">
                      Lecture
                    </option>

                    <option value="Practical">
                      Practical
                    </option>
                  </select>

                </div>

                <div className="teacher-schedule-form-group">

                  <label>
                    Semester
                  </label>

                  <input
                    type="number"
                    name="semester"
                    min="1"
                    max="10"
                    value={formData.semester}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {formError && (
                <div className="teacher-schedule-form-error">
                  {formError}
                </div>
              )}

              <div className="teacher-schedule-form-footer">

                <button
                  type="button"
                  className="teacher-schedule-cancel"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="teacher-schedule-save"
                >
                  {editingId !== null
                    ? "Save Changes"
                    : "Add Class"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* DELETE */}

      {deleteTarget && (

        <div
          className="teacher-schedule-modal-backdrop"
          onClick={() =>
            setDeleteTarget(null)
          }
        >

          <div
            className="teacher-schedule-delete-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="schedule-delete-icon">
              <Trash2 size={20} />
            </div>

            <h2>
              Delete Class?
            </h2>

            <p>
              Are you sure you want to delete the{" "}
              <strong>
                {getSubject(
                  deleteTarget.subjectId
                )?.name || "selected"}
              </strong>{" "}
              schedule?
            </p>

            <div className="teacher-schedule-delete-actions">

              <button
                className="teacher-schedule-cancel"
                onClick={() =>
                  setDeleteTarget(null)
                }
              >
                Cancel
              </button>

              <button
                className="teacher-schedule-confirm-delete"
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

export default TeacherSchedule;