import { useState } from "react";
import { Award, BookOpen, Calculator, TrendingUp } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import "./Results.css";

const getGrade = (total) => {
  if (total >= 90) return { grade: "A+", point: 10 };
  if (total >= 80) return { grade: "A", point: 9 };
  if (total >= 70) return { grade: "B+", point: 8 };
  if (total >= 60) return { grade: "B", point: 7 };
  if (total >= 50) return { grade: "C", point: 6 };
  if (total >= 40) return { grade: "D", point: 5 };
  return { grade: "F", point: 0 };
};

const calculateSGPA = (semesterResults, subjects) => {
  let totalCredits = 0;
  let weightedPoints = 0;

  semesterResults.forEach((result) => {
    const subject = subjects.find(
      (item) => item.id === result.subjectId
    );

    if (subject) {
      totalCredits += Number(subject.credits);
      weightedPoints +=
        Number(result.gradePoint) * Number(subject.credits);
    }
  });

  return totalCredits
    ? (weightedPoints / totalCredits).toFixed(2)
    : "0.00";
};

const calculateCGPA = (studentResults, subjects) => {
  let totalCredits = 0;
  let weightedPoints = 0;

  studentResults.forEach((result) => {
    const subject = subjects.find(
      (item) => item.id === result.subjectId
    );

    if (subject) {
      totalCredits += Number(subject.credits);
      weightedPoints +=
        Number(result.gradePoint) * Number(subject.credits);
    }
  });

  return totalCredits
    ? (weightedPoints / totalCredits).toFixed(2)
    : "0.00";
};

function StudentResults() {
  const { currentUser } = useAuth();
  const { results, subjects } = useAppData();

  const [selectedSemester, setSelectedSemester] = useState("7");

  const studentResults = results.filter(
    (result) => result.studentId === currentUser?.id
  );

  const semesterResults = studentResults.filter(
    (result) => String(result.semester) === selectedSemester
  );

  const sgpa = calculateSGPA(semesterResults, subjects);
  const cgpa = calculateCGPA(studentResults, subjects);

  const totalMarks = semesterResults.reduce(
    (sum, result) => sum + Number(result.total || 0),
    0
  );

  const average =
    semesterResults.length > 0
      ? (totalMarks / semesterResults.length).toFixed(2)
      : "0.00";

  const getSubject = (subjectId) =>
    subjects.find((subject) => subject.id === subjectId);

  return (
    <div className="results-page">
      <div className="results-header">
        <div>
          <p className="results-eyebrow">Academic Performance</p>
          <h1>Results</h1>
          <p>
            View your semester-wise marks, grades and academic performance.
          </p>
        </div>

        <div className="semester-select-box">
          <label>Semester</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="7">Semester 7</option>
            <option value="6">Semester 6</option>
            <option value="5">Semester 5</option>
            <option value="4">Semester 4</option>
            <option value="3">Semester 3</option>
            <option value="2">Semester 2</option>
            <option value="1">Semester 1</option>
          </select>
        </div>
      </div>

      <div className="result-summary-grid">
        <div className="result-summary-card">
          <div className="summary-icon">
            <TrendingUp size={22} />
          </div>
          <div>
            <span>SGPA</span>
            <strong>{sgpa}</strong>
          </div>
        </div>

        <div className="result-summary-card">
          <div className="summary-icon">
            <Award size={22} />
          </div>
          <div>
            <span>CGPA</span>
            <strong>{cgpa}</strong>
          </div>
        </div>

        <div className="result-summary-card">
          <div className="summary-icon">
            <Calculator size={22} />
          </div>
          <div>
            <span>Average Marks</span>
            <strong>{average}</strong>
          </div>
        </div>

        <div className="result-summary-card">
          <div className="summary-icon">
            <BookOpen size={22} />
          </div>
          <div>
            <span>Subjects</span>
            <strong>{semesterResults.length}</strong>
          </div>
        </div>
      </div>

      <div className="results-card">
        <div className="results-card-header">
          <div>
            <h2>Semester {selectedSemester} Results</h2>
            <p>Your subject-wise academic performance</p>
          </div>
        </div>

        {semesterResults.length === 0 ? (
          <div className="empty-results">
            <Award size={42} />
            <h3>No results available</h3>
            <p>
              Results for this semester have not been added yet.
            </p>
          </div>
        ) : (
          <div className="results-table-wrapper">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Credits</th>
                  <th>Internal</th>
                  <th>External</th>
                  <th>Total</th>
                  <th>Grade</th>
                  <th>Grade Point</th>
                </tr>
              </thead>

              <tbody>
                {semesterResults.map((result) => {
                  const subject = getSubject(result.subjectId);

                  return (
                    <tr key={result.id}>
                      <td>
                        <div className="subject-result-cell">
                          <strong>
                            {subject?.code || "N/A"}
                          </strong>
                          <span>
                            {subject?.name || "Unknown Subject"}
                          </span>
                        </div>
                      </td>

                      <td>{subject?.credits || "-"}</td>

                      <td>
                        {result.internal}/30
                      </td>

                      <td>
                        {result.external}/70
                      </td>

                      <td>
                        <strong>{result.total}/100</strong>
                      </td>

                      <td>
                        <span
                          className={`grade-badge grade-${String(
                            result.grade
                          ).replace("+", "plus")}`}
                        >
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
        )}

        
      </div>
    </div>
  );
}

export default StudentResults;