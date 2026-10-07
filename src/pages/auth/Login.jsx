import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const {
    login,
  } = useAuth();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    const result = login(
      cleanEmail,
      password,
      role
    );

    setLoading(false);

    if (!result?.success) {
      setError(
        result?.message ||
          "Invalid email or password."
      );
      return;
    }

    // Successful login
    if (role === "student") {
      navigate("/student", {
        replace: true,
      });
    } else if (role === "teacher") {
      navigate("/teacher", {
        replace: true,
      });
    }
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError("");
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* LEFT SIDE */}
        <div className="login-info-section">

          <div className="login-brand">
            <div className="login-brand-icon">
              <ShieldCheck size={26} />
            </div>

            <div>
              <h2>StudentDesk</h2>
              <span>Academic Management System</span>
            </div>
          </div>

          <div className="login-info-content">
            <p className="login-small-title">
              STUDENT MANAGEMENT
            </p>

            <h1>
              Manage your academic journey
              <span> in one place.</span>
            </h1>

            <p>
              Access subjects, schedules, attendance,
              assignments, results, notices and more
              from a single dashboard.
            </p>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="login-form-section">

          <div className="login-form-container">

            <div className="login-heading">
              <div className="login-user-icon">
                <UserRound size={24} />
              </div>

              <h1>Welcome Back</h1>

              <p>
                Sign in to continue to StudentDesk.
              </p>
            </div>

            {/* ROLE SELECTOR */}
            <div className="login-role-section">

              <label>Login As</label>

              <div className="login-role-buttons">

                <button
                  type="button"
                  className={
                    role === "student"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    handleRoleChange("student")
                  }
                >
                  Student
                </button>

                <button
                  type="button"
                  className={
                    role === "teacher"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    handleRoleChange("teacher")
                  }
                >
                  Teacher
                </button>

              </div>

            </div>

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}
              <div className="login-field">

                <label>Email Address</label>

                <div className="login-input-wrapper">

                  <Mail size={17} />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter your email"
                  />

                </div>

              </div>

              {/* PASSWORD */}
              <div className="login-field">

                <label>Password</label>

                <div className="login-input-wrapper">

                  <Lock size={17} />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) => {
                      setPassword(
                        event.target.value
                      );
                      setError("");
                    }}
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>

              {/* ERROR */}
              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
              >
                {loading
                  ? "Signing in..."
                  : `Login as ${
                      role === "student"
                        ? "Student"
                        : "Teacher"
                    }`}
              </button>

            </form>

            

          </div>
        </div>

      </div>

    </div>
  );
}

export default Login;