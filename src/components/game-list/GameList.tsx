import React from 'react';
import Link from 'next/link';
import './GameList.scss';

interface Game {
  id: string;
  name: string;
  description: string;
}

interface GameListProps {
  games: Game[];
}

const GameList: React.FC<GameListProps> = ({ games }) => {
  return (
    <div className="game-list">
      <h2>Available Games</h2>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <Link href={`/games/${game.id}`}>
              <h3>{game.name}</h3>
              <p>{game.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameList;
