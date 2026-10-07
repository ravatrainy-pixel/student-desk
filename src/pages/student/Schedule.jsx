import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Search,
  UserRound,
} from "lucide-react";

import { useAppData } from "../../context/AppDataContext";

import "./Schedule.css";

function Schedule() {
  const { schedules, subjects } = useAppData();

  const [selectedDay, setSelectedDay] =
    useState("All");

  const [searchTerm, setSearchTerm] =
    useState("");

  const days = [
    "All",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const getSubject = (subjectId) => {
    return subjects.find(
      (subject) =>
        Number(subject.id) ===
        Number(subjectId)
    );
  };

    const filteredSchedules = schedules.filter((item) => {
  const subject = getSubject(item.subjectId);

  const search = searchTerm
    .toLowerCase()
    .trim();

  const subjectName =
    subject?.name?.toLowerCase() || "";

  const subjectCode =
    subject?.code?.toLowerCase() || "";

  const faculty =
    item.faculty?.toLowerCase() || "";

  const room =
    item.room?.toLowerCase() || "";

  const matchesDay =
    selectedDay === "All" ||
    item.day === selectedDay;

  const matchesSearch =
    subjectName.includes(search) ||
    subjectCode.includes(search) ||
    faculty.includes(search) ||
    room.includes(search);

  return matchesDay && matchesSearch;
});

  const getDayCount = (day) => {
    if (day === "All") {
      return schedules.length;
    }

    return schedules.filter(
      (item) => item.day === day
    ).length;
  };

  return (
    <div className="student-schedule-page">

      {/* HEADER */}

      <div className="student-schedule-header">

        <div>
          <span className="schedule-eyebrow">
            ACADEMIC SCHEDULE
          </span>

          <h1>Class Schedule</h1>

          <p>
            View your weekly classes, faculty,
            rooms and timings.
          </p>
        </div>

        <div className="schedule-info-card">
          <CalendarDays size={19} />

          <div>
            <span>Weekly Classes</span>
            <strong>{schedules.length}</strong>
          </div>
        </div>

      </div>

      {/* TOOLBAR */}

      <div className="student-schedule-toolbar">

        <div className="schedule-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search subject, faculty or room..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />
        </div>

        <div className="schedule-day-filters">

          {days.map((day) => (
            <button
              key={day}
              className={
                selectedDay === day
                  ? "schedule-day-active"
                  : ""
              }
              onClick={() =>
                setSelectedDay(day)
              }
            >
              {day}

              <span>
                {getDayCount(day)}
              </span>
            </button>
          ))}

        </div>

      </div>

      {/* RESULT */}

      <div className="schedule-result-info">
        Showing {filteredSchedules.length}{" "}
        {filteredSchedules.length === 1
          ? "class"
          : "classes"}
      </div>

      {/* SCHEDULE LIST */}

      {filteredSchedules.length === 0 ? (

        <div className="schedule-empty">
          <CalendarDays size={34} />

          <h3>
            No classes found
          </h3>

          <p>
            Try changing your day, search or filter.
          </p>
        </div>

      ) : (

        <div className="schedule-list">

          {filteredSchedules.map(
            (item) => {

              const subject =
                getSubject(item.subjectId);

              return (
                <div
                  className="schedule-card"
                  key={item.id}
                >

                  {/* DAY */}

                  <div className="schedule-day-box">
                    <span>
                      {item.day.slice(0, 3)}
                    </span>
                  </div>

                  {/* MAIN */}

                  <div className="schedule-card-main">

                    <div className="schedule-subject-top">

                      <div>
                        <span className="schedule-subject-code">
                          {subject?.code || "N/A"}
                        </span>

                        <h2>
                          {subject?.name ||
                            "Unknown Subject"}
                        </h2>
                      </div>

                      <span
                        className={`schedule-type ${(
                          item.type || "Lecture"
                        ).toLowerCase()}`}
                      >
                        {item.type ||
                          "Lecture"}
                      </span>

                    </div>

                    <div className="schedule-details">

                      <div>
                        <Clock3 size={15} />

                        <div>
                          <span>Time</span>
                          <strong>
                            {item.time}
                          </strong>
                        </div>
                      </div>

                      <div>
                        <UserRound size={15} />

                        <div>
                          <span>Faculty</span>
                          <strong>
                            {item.faculty}
                          </strong>
                        </div>
                      </div>

                      <div>
                        <MapPin size={15} />

                        <div>
                          <span>Room</span>
                          <strong>
                            {item.room}
                          </strong>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

      {/* STUDENT NOTICE */}

      <div className="student-schedule-notice">
        <CalendarDays size={16} />

        <span>
          Schedule information is managed by
          faculty. Students have view-only access.
        </span>
      </div>

    </div>
  );
}

export default Schedule;