import React from 'react';

interface TransactionStatusItemProps {
  statusText: string;
  description: string;
  timestamp: string;
  isCompleted: boolean;
  onClick?: () => void;
}

const TransactionStatusItem: React.FC<TransactionStatusItemProps> = ({
  statusText,
  description,
  timestamp,
  isCompleted,
  onClick,
}) => {
  const isActive = statusText === 'Waiting for your crypto transfer';
  
  const keyframesStyle = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
    },
    iconContainer: {
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isCompleted ? '#16A34A' : '#FFFFFF',
      border: isCompleted || isActive ? 'none' : 'none',
      borderRadius: '50%',
      cursor: isCompleted ? 'pointer' : 'default',
      position: 'relative' as const,
    },
    spinnerContainer: {
      animation: 'spin 1s linear infinite',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute' as const,
      top: '0',
      left: '0',
      background: '#FFFFFF',
      borderRadius: '50%',
    },
    content: {
      flex: 1,
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: description ? '4px' : '0',
    },
    statusText: {
      color: '#1E1E1E',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      fontWeight: isActive ? 600 : 500,
      lineHeight: '20px',
    },
    timestamp: {
      color: '#6B7280',
      fontFamily: 'Inter, sans-serif',
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '16px',
    },
    description: {
      color: '#6B7280',
      fontFamily: 'Inter, sans-serif',
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '16px',
      marginBottom: '4px',
    },
    button: {
      display: 'flex',
      padding: '8px 12px',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '4px',
      alignSelf: 'stretch',
      borderRadius: '8px',
      borderBottom: '0.5px solid #1F2937',
      background: '#1F2937',
      boxShadow: '0px 2px 4px 0px rgba(30, 30, 30, 0.16)',
      color: '#FFFFFF',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      border: 'none',
      marginTop: '12px',
      marginBottom: '4px',
    },
  };

  const renderIcon = () => {
    if (isCompleted) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" fill="white"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM16.0554 9.39446L14.8945 8.4446L10.4443 13.8837L8.5 11.9393L7.43934 13L10.5557 16.1163L16.0554 9.39446Z" fill="#16A34A"/>
        </svg>
      );
    } else if (isActive) {
      return (
        <>
          <style>{keyframesStyle}</style>
          <div style={styles.spinnerContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 25.6C9.404 27.6 4 22.196 4 16S9.404 4.4 16 4.4 28 9.804 28 16s-5.404 11.6-12 11.6z" fill="#E5E7EB"/>
              <path d="M16 2v2.4c6.596 0 12 5.404 12 11.6h2C30 8.268 23.732 2 16 2z" fill="#4B5563"/>
            </svg>
          </div>
        </>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#E5E7EB" strokeWidth="1.5"/>
        </svg>
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.iconContainer}>
        {renderIcon()}
      </div>
      <div style={styles.content}>
        <div style={styles.headerRow}>
          <div style={styles.statusText}>{statusText}</div>
          <div style={styles.timestamp}>{timestamp}</div>
        </div>
        {description && !['Verification', 'Final checks', 'Payout'].includes(statusText) && (
          <div style={styles.description}>{description}</div>
        )}
        {isActive && (
          <button style={styles.button} onClick={onClick}>
            Send crypto to complete
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionStatusItem; 