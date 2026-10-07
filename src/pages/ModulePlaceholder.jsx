import { useLocation } from "react-router-dom";

import "./ModulePlaceholder.css";

function ModulePlaceholder() {
  const location = useLocation();

  const pageName = location.pathname
    .split("/")
    .filter(Boolean)
    .pop();

  const formattedName = pageName
    ? pageName
        .replace(/-/g, " ")
        .replace(/\b\w/g, (letter) =>
          letter.toUpperCase()
        )
    : "Dashboard";

  return (
    <div className="module-placeholder">

      <div className="module-placeholder-card">

        <span>STUDENTDESK</span>

        <h1>
          {formattedName}
        </h1>

        <p>
          This module will be built in the next
          development stage.
        </p>

      </div>

    </div>
  );
}

export default ModulePlaceholder;