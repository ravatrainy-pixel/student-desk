import { useState } from "react";
import { Outlet } from "react-router-dom";

import TeacherSidebar from "../components/teacher/TeacherSidebar";
import TeacherNavbar from "../components/teacher/TeacherNavbar";

import "./TeacherLayout.css";

function TeacherLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="teacher-layout">

      <TeacherSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="teacher-layout-main">

        <TeacherNavbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="teacher-layout-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default TeacherLayout;