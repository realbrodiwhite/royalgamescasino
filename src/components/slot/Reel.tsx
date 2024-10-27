import React from 'react';

interface ReelProps {
  symbols: string[];
  spinning: boolean;
}

const Reel: React.FC<ReelProps> = ({ symbols, spinning }) => {
  return (
    <div className={`reel ${spinning ? 'spinning' : ''}`}>
      {symbols.map((symbol, index) => (
        <div key={index} className="symbol">
          {symbol}
        </div>
      ))}
    </div>
  );
};

export default Reel;
