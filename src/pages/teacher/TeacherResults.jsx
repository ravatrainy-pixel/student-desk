import { useState } from "react";
import {
  CheckCircle2,
  Edit3,
  GraduationCap,
  Search,
} from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import "./TeacherResults.css";

const getGrade = (total) => {
  if (total >= 90) return { grade: "A+", point: 10 };
  if (total >= 80) return { grade: "A", point: 9 };
  if (total >= 70) return { grade: "B+", point: 8 };
  if (total >= 60) return { grade: "B", point: 7 };
  if (total >= 50) return { grade: "C", point: 6 };
  if (total >= 40) return { grade: "D", point: 5 };
  return { grade: "F", point: 0 };
};

function TeacherResults() {
  const {
    results,
    subjects,
    users,
    addItem,
    updateItem,
  } = useAppData();

  const students = users.filter(
    (user) => user.role === "student"
  );

  const [selectedSubject, setSelectedSubject] = useState(
    subjects[0]?.id || ""
  );

  const [selectedStudent, setSelectedStudent] = useState(
    students[0]?.id || ""
  );

  const [search, setSearch] = useState("");

  const selectedResult = results.find(
    (result) =>
      result.subjectId === Number(selectedSubject) &&
      result.studentId === Number(selectedStudent)
  );

  const [internal, setInternal] = useState(
    selectedResult?.internal ?? ""
  );

  const [external, setExternal] = useState(
    selectedResult?.external ?? ""
  );

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedSubjectData = subjects.find(
    (subject) => subject.id === Number(selectedSubject)
  );

  const total =
    Number(internal || 0) + Number(external || 0);

  const calculatedGrade = getGrade(total);

  const handleStudentChange = (studentId) => {
    setSelectedStudent(studentId);

    const existing = results.find(
      (result) =>
        result.subjectId === Number(selectedSubject) &&
        result.studentId === Number(studentId)
    );

    setInternal(existing?.internal ?? "");
    setExternal(existing?.external ?? "");
  };

  const handleSubjectChange = (subjectId) => {
    setSelectedSubject(subjectId);

    const existing = results.find(
      (result) =>
        result.subjectId === Number(subjectId) &&
        result.studentId === Number(selectedStudent)
    );

    setInternal(existing?.internal ?? "");
    setExternal(existing?.external ?? "");
  };

  const handleSave = () => {
    const internalMarks = Number(internal);
    const externalMarks = Number(external);

    if (
      internal === "" ||
      external === "" ||
      internalMarks < 0 ||
      internalMarks > 30 ||
      externalMarks < 0 ||
      externalMarks > 70
    ) {
      alert("Enter valid marks. Internal: 0-30, External: 0-70.");
      return;
    }

    const finalTotal = internalMarks + externalMarks;
    const gradeData = getGrade(finalTotal);

    if (selectedResult) {
      updateItem("results", selectedResult.id, {
        internal: internalMarks,
        external: externalMarks,
        total: finalTotal,
        grade: gradeData.grade,
        gradePoint: gradeData.point,
      });
    } else {
      addItem("results", {
        studentId: Number(selectedStudent),
        subjectId: Number(selectedSubject),
        semester: Number(selectedSubjectData?.semester || 7),
        internal: internalMarks,
        external: externalMarks,
        total: finalTotal,
        grade: gradeData.grade,
        gradePoint: gradeData.point,
      });
    }

    alert("Result saved successfully.");
  };

  return (
    <div className="teacher-results-page">
      <div className="teacher-results-header">
        <div>
          <p className="teacher-results-eyebrow">
            Academic Management
          </p>
          <h1>Results</h1>
          <p>
            Enter and update student marks and grades.
          </p>
        </div>
      </div>

      <div className="results-management-grid">
        <div className="student-selection-card">
          <div className="card-heading">
            <div>
              <h2>Select Student</h2>
              <p>Choose a student to manage results.</p>
            </div>
            <GraduationCap size={21} />
          </div>

          <div className="teacher-search-box">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="student-list">
            {filteredStudents.map((student) => {
              const active =
                Number(selectedStudent) === Number(student.id);

              return (
                <button
                  key={student.id}
                  type="button"
                  className={`student-option ${
                    active ? "active" : ""
                  }`}
                  onClick={() =>
                    handleStudentChange(student.id)
                  }
                >
                  <div className="student-avatar">
                    {student.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <strong>{student.name}</strong>
                    <span>{student.email}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="marks-entry-card">
          <div className="card-heading">
            <div>
              <h2>Enter Result</h2>
              <p>
                Marks will be converted into grade automatically.
              </p>
            </div>
            <Edit3 size={21} />
          </div>

          <div className="marks-form">
            <div className="form-field">
              <label>Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) =>
                  handleSubjectChange(e.target.value)
                }
              >
                {subjects.map((subject) => (
                  <option
                    key={subject.id}
                    value={subject.id}
                  >
                    {subject.code} - {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="marks-row">
              <div className="form-field">
                <label>Internal Marks / 30</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={internal}
                  onChange={(e) =>
                    setInternal(e.target.value)
                  }
                  placeholder="0 - 30"
                />
              </div>

              <div className="form-field">
                <label>External Marks / 70</label>
                <input
                  type="number"
                  min="0"
                  max="70"
                  value={external}
                  onChange={(e) =>
                    setExternal(e.target.value)
                  }
                  placeholder="0 - 70"
                />
              </div>
            </div>

            <div className="result-preview">
              <div>
                <span>Total</span>
                <strong>{total}/100</strong>
              </div>

              <div>
                <span>Grade</span>
                <strong>{calculatedGrade.grade}</strong>
              </div>

              <div>
                <span>Grade Point</span>
                <strong>{calculatedGrade.point}</strong>
              </div>
            </div>

            <button
              type="button"
              className="save-result-btn"
              onClick={handleSave}
            >
              <CheckCircle2 size={18} />
              Save Result
            </button>
          </div>
        </div>
      </div>

      <div className="all-results-card">
        <div className="card-heading">
          <div>
            <h2>Current Result Records</h2>
            <p>
              Results already stored in the shared StudentDesk data.
            </p>
          </div>
        </div>

        <div className="results-management-table-wrapper">
          <table className="results-management-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Subject</th>
                <th>Internal</th>
                <th>External</th>
                <th>Total</th>
                <th>Grade</th>
                <th>Point</th>
              </tr>
            </thead>

            <tbody>
              {results.map((result) => {
                const student = students.find(
                  (item) => item.id === result.studentId
                );

                const subject = subjects.find(
                  (item) => item.id === result.subjectId
                );

                return (
                  <tr key={result.id}>
                    <td>
                      {student?.name || "Unknown Student"}
                    </td>
                    <td>
                      {subject?.code || "Unknown"}
                    </td>
                    <td>{result.internal}</td>
                    <td>{result.external}</td>
                    <td>
                      <strong>{result.total}</strong>
                    </td>
                    <td>
                      <span className="teacher-grade">
                        {result.grade}
                      </span>
                    </td>
                    <td>{result.gradePoint}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TeacherResults;