import React, { useState, useEffect } from 'react';
import Reel from './Reel';
import ReelsController from './ReelsController';
import initControls from './initControls';
import './SlotGame.scss';

interface SlotGameProps {
  // Add any props specific to the slot game
}

const SlotGame: React.FC<SlotGameProps> = () => {
  const [reels, setReels] = useState<any[]>([]);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    // Initialize reels and controls
    const initializedReels = initControls();
    setReels(initializedReels);
  }, []);

  const handleSpin = () => {
    if (!spinning) {
      setSpinning(true);
      // Add logic for spinning reels
      setTimeout(() => setSpinning(false), 3000); // Example: stop after 3 seconds
    }
  };

  return (
    <div className="slot-game">
      <h2>Slot Machine</h2>
      <div className="reels-container">
        {reels.map((reel, index) => (
          <Reel key={index} symbols={reel.symbols} spinning={spinning} />
        ))}
      </div>
      <ReelsController onSpin={handleSpin} spinning={spinning} />
    </div>
  );
};

export default SlotGame;
