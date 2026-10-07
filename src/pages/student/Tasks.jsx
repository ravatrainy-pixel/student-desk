import { useState } from "react";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  Edit3,
  ListTodo,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import "./Tasks.css";

const emptyForm = {
  title: "",
  description: "",
  dueDate: "",
  priority: "Medium",
};

function StudentTasks() {
  const { currentUser } = useAuth();

  const {
    tasks,
    addItem,
    updateItem,
    deleteItem,
  } = useAppData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const studentTasks = tasks.filter(
    (task) => task.studentId === currentUser?.id
  );

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const getTaskStatus = (task) => {
    return task.status === "Completed"
      ? "Completed"
      : "Pending";
  };

  const isOverdue = (task) => {
    return (
      getTaskStatus(task) !== "Completed" &&
      task.dueDate &&
      task.dueDate < todayKey
    );
  };

  const filteredTasks = studentTasks
    .filter((task) => {
      const text = `${task.title || ""} ${
        task.description || task.details || ""
      }`.toLowerCase();

      return text.includes(search.toLowerCase());
    })
    .filter((task) => {
      if (statusFilter === "All") return true;

      return getTaskStatus(task) === statusFilter;
    })
    .filter((task) => {
      if (priorityFilter === "All") return true;

      return task.priority === priorityFilter;
    })
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return a.dueDate.localeCompare(b.dueDate);
    });

  const totalTasks = studentTasks.length;

  const pendingTasks = studentTasks.filter(
    (task) => getTaskStatus(task) === "Pending"
  ).length;

  const completedTasks = studentTasks.filter(
    (task) => getTaskStatus(task) === "Completed"
  ).length;

  const overdueTasks = studentTasks.filter((task) =>
    isOverdue(task)
  ).length;

  const formatDate = (date) => {
    if (!date) return "No due date";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const openAddForm = () => {
    setEditingTask(null);

    setForm({
      ...emptyForm,
      dueDate: todayKey,
    });

    setIsFormOpen(true);
  };

  const openEditForm = (task) => {
    setEditingTask(task);

    setForm({
      title: task.title || "",
      description:
        task.description || task.details || "",
      dueDate: task.dueDate || "",
      priority: task.priority || "Medium",
    });

    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    if (!form.dueDate) {
      alert("Please select a due date.");
      return;
    }

    if (editingTask) {
      updateItem("tasks", editingTask.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate,
        priority: form.priority,
      });
    } else {
      addItem("tasks", {
        studentId: currentUser.id,
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate,
        priority: form.priority,
        status: "Pending",
        createdAt: new Date().toISOString(),
      });
    }

    closeForm();
  };

  const toggleTask = (task) => {
    updateItem("tasks", task.id, {
      status:
        getTaskStatus(task) === "Completed"
          ? "Pending"
          : "Completed",
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    deleteItem("tasks", deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="student-tasks-page">
      <div className="tasks-page-header">
        <div>
          <p className="tasks-eyebrow">Personal Productivity</p>

          <h1>Tasks</h1>

          <p>
            Organize your study work, deadlines and personal
            academic tasks.
          </p>
        </div>

        <button
          type="button"
          className="add-task-btn"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      <div className="task-stat-grid">
        <div className="task-stat-card">
          <div className="task-stat-icon">
            <ListTodo size={21} />
          </div>

          <div>
            <span>Total Tasks</span>
            <strong>{totalTasks}</strong>
          </div>
        </div>

        <div className="task-stat-card">
          <div className="task-stat-icon pending">
            <Circle size={20} />
          </div>

          <div>
            <span>Pending</span>
            <strong>{pendingTasks}</strong>
          </div>
        </div>

        <div className="task-stat-card">
          <div className="task-stat-icon completed">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedTasks}</strong>
          </div>
        </div>

        <div className="task-stat-card">
          <div className="task-stat-icon overdue">
            <CalendarDays size={21} />
          </div>

          <div>
            <span>Overdue</span>
            <strong>{overdueTasks}</strong>
          </div>
        </div>
      </div>

      <div className="task-toolbar">
        <div className="task-search-box">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="task-filters">
          {["All", "Pending", "Completed"].map(
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

        <select
          className="priority-filter"
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value)
          }
        >
          <option value="All">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="tasks-empty-state">
          <ListTodo size={44} />

          <h3>No tasks found</h3>

          <p>
            Add a new task or change your search and filters.
          </p>

          <button
            type="button"
            onClick={openAddForm}
          >
            <Plus size={16} />
            Add Your First Task
          </button>
        </div>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map((task) => {
            const completed =
              getTaskStatus(task) === "Completed";

            const overdue = isOverdue(task);

            return (
              <div
                className={`task-card ${
                  completed ? "task-completed" : ""
                }`}
                key={task.id}
              >
                <button
                  type="button"
                  className="task-check-btn"
                  onClick={() => toggleTask(task)}
                  title={
                    completed
                      ? "Mark as pending"
                      : "Mark as completed"
                  }
                >
                  {completed ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <Circle size={24} />
                  )}
                </button>

                <div className="task-content">
                  <div className="task-title-row">
                    <h2>{task.title}</h2>

                    <span
                      className={`priority-badge priority-${String(
                        task.priority || "Medium"
                      ).toLowerCase()}`}
                    >
                      {task.priority || "Medium"}
                    </span>
                  </div>

                  <p>
                    {task.description ||
                      task.details ||
                      "No description added."}
                  </p>

                  <div className="task-meta">
                    <span
                      className={
                        overdue ? "task-overdue" : ""
                      }
                    >
                      <CalendarDays size={14} />
                      {overdue
                        ? `Overdue · ${formatDate(
                            task.dueDate
                          )}`
                        : `Due · ${formatDate(
                            task.dueDate
                          )}`}
                    </span>

                    <span
                      className={`task-status ${
                        completed
                          ? "completed-status"
                          : "pending-status"
                      }`}
                    >
                      {completed
                        ? "Completed"
                        : "Pending"}
                    </span>
                  </div>
                </div>

                <div className="task-actions">
                  <button
                    type="button"
                    title="Edit task"
                    onClick={() => openEditForm(task)}
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    type="button"
                    title="Delete task"
                    className="task-delete-btn"
                    onClick={() => setDeleteTarget(task)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isFormOpen && (
        <div
          className="task-modal-overlay"
          onClick={closeForm}
        >
          <div
            className="task-form-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="task-modal-header">
              <div>
                <h2>
                  {editingTask
                    ? "Edit Task"
                    : "Add Task"}
                </h2>

                <p>
                  Add your task details and deadline.
                </p>
              </div>

              <button
                type="button"
                className="task-close-btn"
                onClick={closeForm}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="task-form-field">
                <label>Task Title</label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Complete DBMS assignment"
                />
              </div>

              <div className="task-form-field">
                <label>Description</label>

                <textarea
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter task details..."
                />
              </div>

              <div className="task-form-row">
                <div className="task-form-field">
                  <label>Due Date</label>

                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="task-form-field">
                  <label>Priority</label>

                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                  >
                    <option value="High">High</option>
                    <option value="Medium">
                      Medium
                    </option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="task-form-actions">
                <button
                  type="button"
                  className="cancel-task-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-task-btn"
                >
                  {editingTask
                    ? "Update Task"
                    : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="task-modal-overlay"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="delete-task-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-task-icon">
              <Trash2 size={22} />
            </div>

            <h2>Delete Task?</h2>

            <p>
              Are you sure you want to delete "
              {deleteTarget.title}"?
            </p>

            <div className="delete-task-actions">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-task-delete"
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

export default StudentTasks;