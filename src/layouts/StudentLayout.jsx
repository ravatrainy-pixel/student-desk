import { useState } from "react";
import { Outlet } from "react-router-dom";

import StudentSidebar from "../components/student/StudentSidebar";
import StudentNavbar from "../components/student/StudentNavbar";

import "./StudentLayout.css";

function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="student-layout">

      <StudentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="student-layout-main">

        <StudentNavbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="student-layout-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default StudentLayout;