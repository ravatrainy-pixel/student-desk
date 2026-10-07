import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Edit3,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import "./TeacherNotices.css";

const emptyForm = {
  title: "",
  content: "",
  type: "Academic",
  date: "",
  status: "Draft",
};

function TeacherNotices() {
  const {
    notices,
    addItem,
    updateItem,
    deleteItem,
  } = useAppData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredNotices = notices
    .filter((notice) => {
      const text = `${notice.title} ${
        notice.content || notice.message || ""
      }`.toLowerCase();

      return text.includes(search.toLowerCase());
    })
    .filter((notice) => {
      return (
        statusFilter === "All" ||
        notice.status === statusFilter
      );
    })
    .sort(
      (a, b) =>
        new Date(b.date || 0) - new Date(a.date || 0)
    );

  const openAddForm = () => {
    setEditingNotice(null);
    setForm({
      ...emptyForm,
      date: new Date().toISOString().split("T")[0],
    });
    setIsFormOpen(true);
  };

  const openEditForm = (notice) => {
    setEditingNotice(notice);

    setForm({
      title: notice.title || "",
      content:
        notice.content || notice.message || "",
      type: notice.type || "Academic",
      date:
        notice.date ||
        new Date().toISOString().split("T")[0],
      status: notice.status || "Draft",
    });

    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingNotice(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      alert("Please enter notice title and content.");
      return;
    }

    if (!form.date) {
      alert("Please select a notice date.");
      return;
    }

    if (editingNotice) {
      updateItem("notices", editingNotice.id, {
        title: form.title.trim(),
        content: form.content.trim(),
        type: form.type,
        date: form.date,
        status: form.status,
      });
    } else {
      addItem("notices", {
        title: form.title.trim(),
        content: form.content.trim(),
        type: form.type,
        date: form.date,
        status: form.status,
        createdBy: 6,
      });
    }

    closeForm();
  };

  const togglePublish = (notice) => {
    updateItem("notices", notice.id, {
      status:
        notice.status === "Published"
          ? "Closed"
          : "Published",
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    deleteItem("notices", deleteTarget.id);
    setDeleteTarget(null);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="teacher-notices-page">
      <div className="teacher-notices-header">
        <div>
          <p className="teacher-notices-eyebrow">
            Communication Management
          </p>

          <h1>Notices</h1>

          <p>
            Create and manage announcements for students.
          </p>
        </div>

        <button
          type="button"
          className="add-notice-btn"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Add Notice
        </button>
      </div>

      <div className="teacher-notice-toolbar">
        <div className="teacher-notice-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="teacher-status-filters">
          {["All", "Published", "Draft", "Closed"].map(
            (status) => (
              <button
                key={status}
                type="button"
                className={
                  statusFilter === status ? "active" : ""
                }
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      <div className="teacher-notices-card">
        {filteredNotices.length === 0 ? (
          <div className="teacher-empty-notices">
            <Bell size={42} />
            <h3>No notices found</h3>
            <p>
              Create a new notice or change the filter.
            </p>
          </div>
        ) : (
          <div className="teacher-notice-table-wrapper">
            <table className="teacher-notice-table">
              <thead>
                <tr>
                  <th>Notice</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredNotices.map((notice) => (
                  <tr key={notice.id}>
                    <td>
                      <div className="teacher-notice-title">
                        <strong>{notice.title}</strong>

                        <span>
                          {(
                            notice.content ||
                            notice.message ||
                            ""
                          ).slice(0, 90)}
                          {(
                            notice.content ||
                            notice.message ||
                            ""
                          ).length > 90
                            ? "..."
                            : ""}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="teacher-notice-type">
                        {notice.type || "General"}
                      </span>
                    </td>

                    <td>{formatDate(notice.date)}</td>

                    <td>
                      <span
                        className={`notice-status status-${String(
                          notice.status
                        ).toLowerCase()}`}
                      >
                        {notice.status}
                      </span>
                    </td>

                    <td>
                      <div className="notice-actions">
                        <button
                          type="button"
                          title="Edit"
                          onClick={() =>
                            openEditForm(notice)
                          }
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          type="button"
                          title={
                            notice.status === "Published"
                              ? "Close"
                              : "Publish"
                          }
                          onClick={() =>
                            togglePublish(notice)
                          }
                        >
                          <CheckCircle2 size={16} />
                        </button>

                        <button
                          type="button"
                          title="Delete"
                          className="delete-action"
                          onClick={() =>
                            setDeleteTarget(notice)
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormOpen && (
        <div
          className="teacher-notice-modal-overlay"
          onClick={closeForm}
        >
          <div
            className="teacher-notice-form-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="teacher-notice-modal-header">
              <div>
                <h2>
                  {editingNotice
                    ? "Edit Notice"
                    : "Add Notice"}
                </h2>

                <p>
                  Enter the announcement details below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="teacher-close-btn"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="teacher-form-field">
                <label>Notice Title</label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter notice title"
                />
              </div>

              <div className="teacher-form-row">
                <div className="teacher-form-field">
                  <label>Type</label>

                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="Academic">
                      Academic
                    </option>
                    <option value="Exam">Exam</option>
                    <option value="Event">Event</option>
                    <option value="General">General</option>
                    <option value="Important">
                      Important
                    </option>
                  </select>
                </div>

                <div className="teacher-form-field">
                  <label>Date</label>

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="teacher-form-field">
                <label>Notice Content</label>

                <textarea
                  name="content"
                  rows="7"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Write the complete announcement..."
                />
              </div>

              <div className="teacher-form-field">
                <label>Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">
                    Published
                  </option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="teacher-form-actions">
                <button
                  type="button"
                  className="cancel-notice-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-notice-btn"
                >
                  {editingNotice
                    ? "Update Notice"
                    : "Create Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="teacher-notice-modal-overlay"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="delete-notice-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-icon">
              <Trash2 size={22} />
            </div>

            <h2>Delete Notice?</h2>

            <p>
              Are you sure you want to delete "
              {deleteTarget.title}"?
            </p>

            <div className="delete-notice-actions">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-delete"
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

export default TeacherNotices;