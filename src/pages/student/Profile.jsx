import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Edit3,
  GraduationCap,
  Mail,
  MapPin,
  Save,
  User,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";

import "./Profile.css";

const getFormData = (user) => ({
  name: user?.name || "",
  email: user?.email || "",
  phone: user?.phone || "",
  enrollmentNo: user?.enrollmentNo || "",
  address: user?.address || "",
  city: user?.city || "",
  department: user?.department || "",
  program: user?.program || "",
  semester: user?.semester || "",
});

function StudentProfile() {
  const { currentUser, updateCurrentUser } = useAuth();

  const { users, updateUser } = useAppData();

  const userData =
    users.find((user) => user.id === currentUser?.id) ||
    currentUser;

  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState(() =>
    getFormData(userData)
  );

  if (!userData) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          Unable to load student profile.
        </div>
      </div>
    );
  }

  const initials =
    userData.name
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "ST";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleEdit = () => {
    setForm(getFormData(userData));
    setSaved(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm(getFormData(userData));
    setIsEditing(false);
    setSaved(false);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    const updatedFields = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      enrollmentNo: form.enrollmentNo.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      department: form.department.trim(),
      program: form.program.trim(),
      semester: Number(form.semester) || "",
    };

    updateUser(currentUser.id, updatedFields);
    updateCurrentUser(updatedFields);

    setIsEditing(false);
    setSaved(true);
  };

  return (
    <div className="profile-page">

      {/* HEADER */}
      <div className="profile-page-header">
        <div>
          <p className="profile-eyebrow">
            Account Settings
          </p>

          <h1>My Profile</h1>

          <p>
            View and manage your personal and academic
            information.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            className="edit-profile-btn"
            onClick={handleEdit}
          >
            <Edit3 size={17} />
            Edit Profile
          </button>
        )}
      </div>

      {/* SUCCESS MESSAGE */}
      {saved && (
        <div className="profile-success">
          <CheckCircle2 size={18} />
          Profile updated successfully.
        </div>
      )}

      <div className="profile-grid">

        {/* LEFT PROFILE CARD */}
        <div className="profile-sidebar-card">

          <div className="profile-avatar">
            {userData.profileImage ? (
              <img
                src={userData.profileImage}
                alt={userData.name}
              />
            ) : (
              initials
            )}
          </div>

          <h2>{userData.name}</h2>

          <p className="profile-role">
            Student
          </p>

          <div className="profile-sidebar-info">

            <div>
              <Mail size={15} />
              <span>
                {userData.email || "No email"}
              </span>
            </div>

            <div>
              <BookOpen size={15} />
              <span>
                {userData.program || "No program"}
              </span>
            </div>

            <div>
              <GraduationCap size={15} />
              <span>
                Semester {userData.semester || "-"}
              </span>
            </div>

          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="profile-details-card">

          {/* PERSONAL INFORMATION */}
          <div className="profile-section-heading">
            <div>
              <h2>Personal Information</h2>

              <p>
                Your personal and contact information.
              </p>
            </div>

            <User size={20} />
          </div>

          <div className="profile-form-grid">

            {/* NAME */}
            <div className="profile-field">
              <label>Full Name</label>

              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              ) : (
                <div className="profile-value">
                  {userData.name || "-"}
                </div>
              )}
            </div>

            {/* EMAIL */}
            <div className="profile-field">
              <label>Email Address</label>

              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              ) : (
                <div className="profile-value">
                  {userData.email || "-"}
                </div>
              )}
            </div>

            {/* PHONE */}
            <div className="profile-field">
              <label>Phone Number</label>

              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              ) : (
                <div className="profile-value">
                  {userData.phone || "Not added"}
                </div>
              )}
            </div>

            {/* ENROLLMENT */}
            <div className="profile-field">
              <label>Enrollment Number</label>

              {isEditing ? (
                <input
                  type="text"
                  name="enrollmentNo"
                  value={form.enrollmentNo}
                  onChange={handleChange}
                  placeholder="Enter enrollment number"
                />
              ) : (
                <div className="profile-value">
                  {userData.enrollmentNo || "Not added"}
                </div>
              )}
            </div>

            {/* CITY */}
            <div className="profile-field">
              <label>City</label>

              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              ) : (
                <div className="profile-value">
                  {userData.city || "Not added"}
                </div>
              )}
            </div>

            {/* ADDRESS */}
            <div className="profile-field">
              <label>Address</label>

              {isEditing ? (
                <textarea
                  name="address"
                  rows="3"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              ) : (
                <div className="profile-value">
                  {userData.address || "Not added"}
                </div>
              )}
            </div>

          </div>

          {/* ACADEMIC INFORMATION */}
          <div className="profile-section-heading academic-heading">
            <div>
              <h2>Academic Information</h2>

              <p>
                Your current academic details.
              </p>
            </div>

            <GraduationCap size={20} />
          </div>

          <div className="profile-form-grid">

            {/* DEPARTMENT */}
            <div className="profile-field">
              <label>Department</label>

              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Enter department"
                />
              ) : (
                <div className="profile-value">
                  {userData.department || "-"}
                </div>
              )}
            </div>

            {/* PROGRAM */}
            <div className="profile-field">
              <label>Program</label>

              {isEditing ? (
                <input
                  type="text"
                  name="program"
                  value={form.program}
                  onChange={handleChange}
                  placeholder="Enter program"
                />
              ) : (
                <div className="profile-value">
                  {userData.program || "-"}
                </div>
              )}
            </div>

            {/* SEMESTER */}
            <div className="profile-field">
              <label>Semester</label>

              {isEditing ? (
                <select
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Semester
                  </option>

                  <option value="1">
                    Semester 1
                  </option>

                  <option value="2">
                    Semester 2
                  </option>

                  <option value="3">
                    Semester 3
                  </option>

                  <option value="4">
                    Semester 4
                  </option>

                  <option value="5">
                    Semester 5
                  </option>

                  <option value="6">
                    Semester 6
                  </option>

                  <option value="7">
                    Semester 7
                  </option>

                  <option value="8">
                    Semester 8
                  </option>
                </select>
              ) : (
                <div className="profile-value">
                  {userData.semester
                    ? `Semester ${userData.semester}`
                    : "-"}
                </div>
              )}
            </div>

            {/* CGPA */}
            <div className="profile-field">
              <label>CGPA</label>

              <div className="profile-value cgpa-value">
                {userData.cgpa ?? "0.00"}
              </div>
            </div>

          </div>

          {/* LOCATION & CONTACT */}
          <div className="profile-section-heading academic-heading">
            <div>
              <h2>Location & Contact</h2>

              <p>
                Your current location and contact information.
              </p>
            </div>

            <MapPin size={20} />
          </div>

          <div className="profile-form-grid">

            <div className="profile-field">
              <label>City</label>

              <div className="profile-value">
                {userData.city || "Not added"}
              </div>
            </div>

            <div className="profile-field">
              <label>Phone</label>

              <div className="profile-value">
                {userData.phone || "Not added"}
              </div>
            </div>

          </div>

          {/* ACTION BUTTONS */}
          {isEditing && (
            <div className="profile-actions">

              <button
                type="button"
                className="cancel-profile-btn"
                onClick={handleCancel}
              >
                <X size={17} />
                Cancel
              </button>

              <button
                type="button"
                className="save-profile-btn"
                onClick={handleSave}
              >
                <Save size={17} />
                Save Changes
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default StudentProfile;