import React from 'react';
import TransactionStatusItem from './TransactionStatusItem';

interface Status {
  id: string;
  statusText: string;
  description: string;
  timestamp: string;
  isCompleted: boolean;
}

interface TransactionTimelineProps {
  statuses: Status[];
  onCheckClick: () => void;
}

const timelineStyles = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '16px',
  background: '#FFFFFF',
  borderRadius: '12px',
};

export const TransactionTimeline: React.FC<TransactionTimelineProps> = ({ statuses, onCheckClick }) => {
  return (
    <div style={timelineStyles}>
      {statuses.map((status, index) => (
        <div key={status.id} style={{ position: 'relative' }}>
          {index < statuses.length - 1 && (
            <div style={{
              position: 'absolute',
              left: '9px',
              top: '20px',
              bottom: '-20px',
              width: '3px',
              borderLeft: '3px dotted #E5E7EB',
              backgroundColor: 'transparent',
            }} />
          )}
          <TransactionStatusItem
            statusText={status.statusText}
            description={status.description}
            timestamp={status.timestamp}
            isCompleted={status.isCompleted}
            onClick={onCheckClick}
          />
        </div>
      ))}
    </div>
  );
};

export default TransactionTimeline; 