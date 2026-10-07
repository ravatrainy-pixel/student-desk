import {
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Login from "../pages/auth/Login";
import StudentLayout from "../layouts/StudentLayout";
import TeacherLayout from "../layouts/TeacherLayout";
import StudentDashboard from "../pages/student/StudentDashboard";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import StudentSubjects from "../pages/student/Subjects";
import TeacherSubjects from "../pages/teacher/TeacherSubjects";
import StudentSchedule from "../pages/student/Schedule";
import TeacherSchedule from "../pages/teacher/TeacherSchedule";
import StudentAttendance from "../pages/student/Attendance";
import TeacherAttendance from "../pages/teacher/TeacherAttendance";
import StudentAssignments from "../pages/student/Assignments";
import TeacherAssignments from "../pages/teacher/TeacherAssignments";
import TeacherSubmissions from "../pages/teacher/TeacherSubmissions";
import StudentResults from "../pages/student/Results";
import TeacherResults from "../pages/teacher/TeacherResults";
import StudentNotices from "../pages/student/Notices";
import TeacherNotices from "../pages/teacher/TeacherNotices";
import StudentTasks from "../pages/student/Tasks";
import StudentProfile from "../pages/student/Profile";
function ProtectedRoute({ role }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (currentUser.role !== role) {
    return (
      <Navigate
        to={
          currentUser.role === "student"
            ? "/student"
            : "/teacher"
        }
        replace
      />
    );
  }

  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>

      {/* =========================================
          LOGIN
      ========================================= */}

      <Route
        path="/"
        element={<Login />}
      />

      {/* =========================================
          STUDENT PORTAL
      ========================================= */}

      <Route
        element={
          <ProtectedRoute role="student" />
        }
      >

        <Route
          path="/student"
          element={<StudentLayout />}
        >

          <Route
            index
            element={
              <StudentDashboard />
            }
          />

          <Route
            path="subjects"
            element={<StudentSubjects  />}
          />

          <Route
            path="schedule"
            element={<StudentSchedule />}
          />

          <Route
            path="attendance"
            element={<StudentAttendance />}
          />

          <Route
            path="assignments"
            element={<StudentAssignments />}
          />

          <Route
            path="results"
            element={<StudentResults />}
          />

          <Route
            path="notices"
            element={<StudentNotices />}
          />

          <Route
            path="tasks"
            element={<StudentTasks />}
          />

          <Route
            path="profile"
            element={<StudentProfile />}
          />
          
        </Route>

      </Route>

      {/* =========================================
          TEACHER PORTAL
      ========================================= */}

      <Route
        element={
          <ProtectedRoute role="teacher" />
        }
      >

        <Route
          path="/teacher"
          element={<TeacherLayout />}
        >

          <Route
            index
            element={
              <TeacherDashboard  />
            }
          />

          <Route
            path="subjects"
            element={<TeacherSubjects />}
          />

          <Route
            path="schedule"
            element={<TeacherSchedule />}
          />

          <Route
            path="attendance"
            element={<TeacherAttendance />}
          />

          <Route
            path="assignments"
            element={<TeacherAssignments />}
          />

          <Route
            path="submissions"
            element={<TeacherSubmissions />}
          />

          <Route
            path="results"
            element={<TeacherResults />}
          />

          <Route
            path="notices"
            element={<TeacherNotices />}
          />

        </Route>

      </Route>

      {/* =========================================
          UNKNOWN URL
      ========================================= */}

      <Route
        path="*"
        element={
          <Navigate to="/" replace />
        }
      />

    </Routes>
  );
}

export default AppRoutes;