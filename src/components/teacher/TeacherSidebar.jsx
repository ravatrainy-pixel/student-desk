import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Upload,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./TeacherSidebar.css";

const menuItems = [
  {
    label: "Dashboard",
    path: "/teacher",
    icon: LayoutDashboard,
  },
  {
    label: "Subjects",
    path: "/teacher/subjects",
    icon: BookOpen,
  },
  {
    label: "Class Schedule",
    path: "/teacher/schedule",
    icon: CalendarDays,
  },
  {
    label: "Attendance",
    path: "/teacher/attendance",
    icon: ClipboardCheck,
  },
  {
    label: "Assignments",
    path: "/teacher/assignments",
    icon: FileText,
  },
  {
    label: "Submissions",
    path: "/teacher/submissions",
    icon: Upload,
  },
  {
    label: "Results",
    path: "/teacher/results",
    icon: GraduationCap,
  },
  {
    label: "Notices",
    path: "/teacher/notices",
    icon: Megaphone,
  },
];

function TeacherSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {isOpen && (
        <div
          className="teacher-sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`teacher-sidebar ${
          isOpen ? "teacher-sidebar-open" : ""
        }`}
      >
        {/* BRAND */}

        <div className="teacher-sidebar-brand">

          <div className="teacher-sidebar-brand-icon">
            SD
          </div>

          <div>
            <h2>StudentDesk</h2>
            <span>Teacher Portal</span>
          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="teacher-sidebar-navigation">

          <div className="teacher-sidebar-section-title">
            MANAGEMENT
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/teacher"}
                className={({ isActive }) =>
                  `teacher-sidebar-nav-item ${
                    isActive
                      ? "teacher-sidebar-nav-item-active"
                      : ""
                  }`
                }
                onClick={onClose}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

        </nav>

        {/* USER */}

        <div className="teacher-sidebar-user-section">

          <div className="teacher-sidebar-user">

            <div className="teacher-sidebar-user-avatar">
              {currentUser?.name
                ?.charAt(0)
                .toUpperCase() || "T"}
            </div>

            <div className="teacher-sidebar-user-info">

              <strong>
                {currentUser?.name || "Teacher"}
              </strong>

              <span>
                {currentUser?.designation ||
                  "Faculty"}
              </span>

            </div>

          </div>

          <button
            className="teacher-sidebar-logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>

      </aside>
    </>
  );
}

export default TeacherSidebar;