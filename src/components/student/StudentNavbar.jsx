import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import "./StudentNavbar.css";

function StudentNavbar({ onMenuClick }) {
  const { currentUser } = useAuth();

  return (
    <header className="student-navbar">

      <div className="student-navbar-left">

        <button
          className="mobile-menu-button"
          onClick={onMenuClick}
        >
          <Menu size={21} />
        </button>

        <div className="navbar-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search..."
          />

        </div>

      </div>

      <div className="student-navbar-right">

        <button className="navbar-icon-button">
          <Bell size={19} />
          <span className="notification-dot"></span>
        </button>

        <div className="navbar-profile">

          <div className="navbar-profile-avatar">
            {currentUser?.name
              ?.charAt(0)
              .toUpperCase() || "S"}
          </div>

          <div className="navbar-profile-info">

            <strong>
              {currentUser?.name || "Student"}
            </strong>

            <span>Student</span>

          </div>

        </div>

      </div>

    </header>
  );
}

export default StudentNavbar;