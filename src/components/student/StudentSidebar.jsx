import {
  BookOpen,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Megaphone,
  UserRound,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./StudentSidebar.css";

const menuItems = [
  {
    label: "Dashboard",
    path: "/student",
    icon: LayoutDashboard,
  },
  {
    label: "Subjects",
    path: "/student/subjects",
    icon: BookOpen,
  },
  {
    label: "Schedule",
    path: "/student/schedule",
    icon: CalendarDays,
  },
  {
    label: "Attendance",
    path: "/student/attendance",
    icon: ClipboardCheck,
  },
  {
    label: "Assignments",
    path: "/student/assignments",
    icon: FileText,
  },
  {
    label: "Results",
    path: "/student/results",
    icon: GraduationCap,
  },
  {
    label: "Notices",
    path: "/student/notices",
    icon: Megaphone,
  },
  {
    label: "Tasks",
    path: "/student/tasks",
    icon: CheckSquare,
  },
  {
    label: "Profile",
    path: "/student/profile",
    icon: UserRound,
  },
];

function StudentSidebar({ isOpen, onClose }) {
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
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`student-sidebar ${
          isOpen ? "student-sidebar-open" : ""
        }`}
      >
        {/* BRAND */}

        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            SD
          </div>

          <div>
            <h2>StudentDesk</h2>
            <span>Student Portal</span>
          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-navigation">

          <div className="sidebar-section-title">
            MAIN MENU
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/student"}
                className={({ isActive }) =>
                  `sidebar-nav-item ${
                    isActive ? "sidebar-nav-item-active" : ""
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

        <div className="sidebar-user-section">

          <div className="sidebar-user">

            <div className="sidebar-user-avatar">
              {currentUser?.name?.charAt(0).toUpperCase() || "S"}
            </div>

            <div className="sidebar-user-info">

              <strong>
                {currentUser?.name || "Student"}
              </strong>

              <span>
                {currentUser?.email || ""}
              </span>

            </div>

          </div>

          <button
            className="sidebar-logout"
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

export default StudentSidebar;