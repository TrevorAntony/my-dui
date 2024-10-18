import React from "react";

interface SectionProps {
  title?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  const sectionStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  };

  const titleStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  };

  const contentStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  };

  return (
    <div style={sectionStyle as React.CSSProperties}>
      {title && <div style={titleStyle as React.CSSProperties}>{title}</div>}
      <div style={contentStyle as React.CSSProperties}>{children}</div>
    </div>
  );
};

export default Section;
