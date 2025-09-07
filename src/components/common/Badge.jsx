import React from "react";
import "../../styles/Badge.css";

const Badge = ({ children, type = "default" }) => {
  const className = `badge badge-${type.toLowerCase()}`;
  return <span className={className}>{children}</span>;
};

export default Badge;
