import React from 'react';
import './Tag.css';

function Tag({ children, className = '' }) {
  return <span className={`tag ${className}`.trim()}>{children}</span>;
}

export default Tag;
