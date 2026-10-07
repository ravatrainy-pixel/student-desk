import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import "./TeacherNavbar.css";

function TeacherNavbar({ onMenuClick }) {
  const { currentUser } = useAuth();

  return (
    <header className="teacher-navbar">

      <div className="teacher-navbar-left">

        <button
          className="teacher-mobile-menu-button"
          onClick={onMenuClick}
        >
          <Menu size={21} />
        </button>

        <div className="teacher-navbar-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search..."
          />

        </div>

      </div>

      <div className="teacher-navbar-right">

        <button className="teacher-navbar-icon-button">

          <Bell size={19} />

          <span className="teacher-notification-dot"></span>

        </button>

        <div className="teacher-navbar-profile">

          <div className="teacher-navbar-profile-avatar">
            {currentUser?.name
              ?.charAt(0)
              .toUpperCase() || "T"}
          </div>

          <div className="teacher-navbar-profile-info">

            <strong>
              {currentUser?.name || "Teacher"}
            </strong>

            <span>Teacher</span>

          </div>

        </div>

      </div>

    </header>
  );
}

export default TeacherNavbar;