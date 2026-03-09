import React from "react";

export default function StatusBadge({ status }) {
  const map = {
    NORMAL:      "badge-green",
    NEAR_LIMIT:  "badge-yellow",
    OVERLOADED:  "badge-red",
    PENDING:     "badge-yellow",
    APPROVED:    "badge-green",
    REJECTED:    "badge-red",
    TEACHING:    "badge-blue",
    LAB:         "badge-blue",
    NON_TEACHING:"badge-gray",
    ADMINISTRATIVE:"badge-gray",
    RESEARCH:    "badge-blue",
  };
  const label = {
    NEAR_LIMIT:   "Near Limit",
    NON_TEACHING: "Non-Teaching",
    ADMINISTRATIVE:"Admin",
  };
  return (
    <span className={map[status] || "badge-gray"}>
      {label[status] || status}
    </span>
  );
}