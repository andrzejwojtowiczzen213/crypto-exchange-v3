import React from 'react';

type InputSize = 'small' | 'medium' | 'large';
type InputVariant = 'outlined' | 'filled';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: InputSize;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  size = 'medium',
  variant = 'outlined',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    width: fullWidth ? '100%' : 'auto',
  };

  const labelStyles = {
    fontSize: '14px',
    fontWeight: 500,
    color: error ? '#dc2626' : '#374151',
  };

  const inputContainerStyles = {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  };

  const inputStyles = {
    width: '100%',
    padding: size === 'small' 
      ? '6px 12px' 
      : size === 'medium'
      ? '8px 16px'
      : '12px 20px',
    fontSize: size === 'small' 
      ? '14px' 
      : size === 'medium'
      ? '16px'
      : '18px',
    borderRadius: '6px',
    border: variant === 'outlined'
      ? `1px solid ${error ? '#dc2626' : '#d1d5db'}`
      : 'none',
    backgroundColor: variant === 'filled' 
      ? '#f3f4f6' 
      : 'white',
    transition: 'all 0.2s ease',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'text',
    opacity: disabled ? 0.7 : 1,
    '&:focus': {
      borderColor: error ? '#dc2626' : '#2563eb',
      boxShadow: error ? 'none' : '0 0 0 2px rgba(37, 99, 235, 0.1)',
    },
    '&:hover': {
      borderColor: error ? '#dc2626' : '#9ca3af',
    },
  };

  const iconStyles = {
    position: 'absolute' as const,
    display: 'flex',
    alignItems: 'center',
    color: '#6b7280',
  };

  const leftIconContainerStyles = {
    ...iconStyles,
    left: size === 'small' ? '8px' : size === 'medium' ? '12px' : '16px',
  };

  const rightIconContainerStyles = {
    ...iconStyles,
    right: size === 'small' ? '8px' : size === 'medium' ? '12px' : '16px',
  };

  const helperTextStyles = {
    fontSize: '12px',
    color: error ? '#dc2626' : '#6b7280',
    marginTop: '4px',
  };

  return (
    <div style={baseStyles} className={className}>
      {label && <label style={labelStyles}>{label}</label>}
      <div style={inputContainerStyles}>
        {leftIcon && (
          <div style={leftIconContainerStyles}>
            {leftIcon}
          </div>
        )}
        <input
          style={{
            ...inputStyles,
            paddingLeft: leftIcon 
              ? size === 'small' 
                ? '32px' 
                : size === 'medium'
                ? '40px'
                : '48px'
              : undefined,
            paddingRight: rightIcon
              ? size === 'small'
                ? '32px'
                : size === 'medium'
                ? '40px'
                : '48px'
              : undefined,
          }}
          disabled={disabled}
          {...props}
        />
        {rightIcon && (
          <div style={rightIconContainerStyles}>
            {rightIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <span style={helperTextStyles}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};

export default Input; 