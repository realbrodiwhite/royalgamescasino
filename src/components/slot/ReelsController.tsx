import React from 'react';

interface ReelsControllerProps {
  onSpin: () => void;
  spinning: boolean;
}

const ReelsController: React.FC<ReelsControllerProps> = ({ onSpin, spinning }) => {
  return (
    <div className="reels-controller">
      <button onClick={onSpin} disabled={spinning}>
        {spinning ? 'Spinning...' : 'Spin'}
      </button>
    </div>
  );
};

export default ReelsController;
