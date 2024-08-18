import React from 'react';

// Section component to organize components in a new row
const Section = ({ title, children }) => {
  const sectionStyle = {
    margin: '20px 0',
  };

  const titleStyle = {
    fontSize: '20px',
    marginBottom: '10px',
    fontWeight: 'bold',
  };

  const contentStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  };

  return (
    <div style={sectionStyle}>
      {title && <div style={titleStyle}>{title}</div>}
      <div style={contentStyle}>{children}</div>
    </div>
  );
};

export default Section;