import React from 'react';
import './Button.css';

function Button({
  variant = 'primary',
  fullWidth = false,
  children,
  onClick,
  type = 'button',
  className = '',
}) {
  const baseClass = `btn btn--${variant}`;
  const fullWidthClass = fullWidth ? 'btn--full-width' : '';
  const finalClass = `${baseClass} ${fullWidthClass} ${className}`.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      className={finalClass}
    >
      {children}
    </button>
  );
}

export default Button;
