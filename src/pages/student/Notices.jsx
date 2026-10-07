import { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import "./Notices.css";

function StudentNotices() {
  const { notices } = useAppData();

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedNotice, setSelectedNotice] = useState(null);

  const publishedNotices = notices.filter(
    (notice) => notice.status === "Published"
  );

  const noticeTypes = [
    "All",
    ...new Set(
      publishedNotices
        .map((notice) => notice.type)
        .filter(Boolean)
    ),
  ];

  const filteredNotices = useMemo(() => {
    return publishedNotices
      .filter((notice) => {
        const text = `${notice.title} ${
          notice.content || notice.message || ""
        }`.toLowerCase();

        return text.includes(search.toLowerCase());
      })
      .filter((notice) => {
        return (
          selectedType === "All" ||
          notice.type === selectedType
        );
      })
      .sort(
        (a, b) =>
          new Date(b.date) - new Date(a.date)
      );
  }, [publishedNotices, search, selectedType]);

  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getNoticeContent = (notice) =>
    notice.content || notice.message || "";

  return (
    <div className="student-notices-page">
      <div className="student-notices-header">
        <div>
          <p className="notices-eyebrow">Campus Communication</p>
          <h1>Notices</h1>
          <p>
            Stay updated with the latest announcements and
            important information.
          </p>
        </div>

        <div className="notice-count">
          <Bell size={19} />
          <span>{publishedNotices.length} Notices</span>
        </div>
      </div>

      <div className="notice-controls">
        <div className="notice-search">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="notice-filters">
          {noticeTypes.map((type) => (
            <button
              key={type}
              type="button"
              className={
                selectedType === type ? "active" : ""
              }
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {filteredNotices.length === 0 ? (
        <div className="notices-empty-state">
          <Bell size={42} />
          <h3>No notices found</h3>
          <p>
            There are no notices matching your search or filter.
          </p>
        </div>
      ) : (
        <div className="notices-list">
          {filteredNotices.map((notice) => (
            <div className="notice-item" key={notice.id}>
              <div
                className={`notice-type-icon notice-${String(
                  notice.type || "General"
                ).toLowerCase()}`}
              >
                <Bell size={20} />
              </div>

              <div className="notice-main">
                <div className="notice-top-row">
                  <span className="notice-type-badge">
                    {notice.type || "General"}
                  </span>

                  <span className="notice-date">
                    <CalendarDays size={14} />
                    {formatDate(notice.date)}
                  </span>
                </div>

                <h2>{notice.title}</h2>

                <p>
                  {getNoticeContent(notice).length > 150
                    ? `${getNoticeContent(notice).slice(
                        0,
                        150
                      )}...`
                    : getNoticeContent(notice)}
                </p>

                <button
                  type="button"
                  className="read-notice-btn"
                  onClick={() =>
                    setSelectedNotice(notice)
                  }
                >
                  Read Notice
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedNotice && (
        <div
          className="notice-modal-overlay"
          onClick={() => setSelectedNotice(null)}
        >
          <div
            className="notice-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="notice-modal-header">
              <div>
                <span className="notice-type-badge">
                  {selectedNotice.type || "General"}
                </span>
                <h2>{selectedNotice.title}</h2>
              </div>

              <button
                type="button"
                className="close-notice-btn"
                onClick={() =>
                  setSelectedNotice(null)
                }
              >
                <X size={19} />
              </button>
            </div>

            <div className="modal-date">
              <CalendarDays size={15} />
              {formatDate(selectedNotice.date)}
            </div>

            <div className="notice-modal-content">
              {getNoticeContent(selectedNotice)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentNotices;