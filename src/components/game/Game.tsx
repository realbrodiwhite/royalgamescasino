import React from 'react';
import './Game.scss';

interface GameProps {
  id: string;
  name: string;
  description: string;
  // Add any other props specific to the game
}

const Game: React.FC<GameProps> = ({ id, name, description }) => {
  return (
    <div className="game">
      <h2>{name}</h2>
      <p>{description}</p>
      {/* Add game-specific content here */}
    </div>
  );
};

export default Game;
