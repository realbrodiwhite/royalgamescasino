import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const SlotEvaluator = () => {
  const [selectedLine, setSelectedLine] = useState(0);
  
  // Sample 5x3 reel layout
  const reelLayout = [
    [1, 2, 3],
    [2, 1, 2],
    [3, 2, 1],
    [1, 3, 2],
    [2, 1, 3]
  ];
  
  // Sample payline patterns (simplified)
  const paylines = [
    [[1,0,0,0,0], [1,0,0,0,0], [1,0,0,0,0], [1,0,0,0,0], [1,0,0,0,0]], // Top line
    [[0,1,0,0,0], [0,1,0,0,0], [0,1,0,0,0], [0,1,0,0,0], [0,1,0,0,0]], // Top-middle line
    [[0,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0]], // Middle line
    [[0,0,0,1,0], [0,0,0,1,0], [0,0,0,1,0], [0,0,0,1,0], [0,0,0,1,0]], // Bottom-middle line
    [[0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1]], // Bottom line
    [[1,0,0,0,0], [0,1,0,0,0], [0,0,1,0,0], [0,0,0,1,0], [0,0,0,0,1]], // V shape
    [[0,0,0,0,1], [0,0,0,1,0], [0,0,1,0,0], [0,1,0,0,0], [1,0,0,0,0]], // Inverted V
    [[1,0,0,0,0], [0,1,0,0,0], [1,0,0,0,0], [0,1,0,0,0], [1,0,0,0,0]], // W shape
    [[1,0,0,0,0], [0,1,0,0,0], [1,0,0,0,0], [0,1,0,0,0], [1,0,0,0,0]], // Inverted W
    [[1,0,0,0,0], [0,1,0,0,0], [0,0,1,0,0], [0,0,0,1,0], [0,0,0,0,1]], // Top left to bottom right
    [[0,0,0,0,1], [0,0,0,1,0], [0,0,1,0,0], [0,1,0,0,0], [1,0,0,0,0]], // Bottom left to top right
    [[1,0,0,0,0], [1,0,0,0,0], [1,0,0,0,0], [1,0,0,0,0], [1,0,0,0,0]], // Top line
    [[0,1,0,0,0], [0,1,0,0,0], [0,1,0,0,0], [0,1,0,0,0], [0,1,0,0,0]], // Top-middle line
    [[0,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0]], // Middle line
    [[0,0,0,1,0], [0,0,0,1,0], [0,0,0,1,0], [0,0,0,1,0], [0,0,0,1,0]], // Bottom-middle line
    [[0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1]], // Bottom line
    [[1,0,0,0,0], [0,1,0,0,0], [0,0,1,0,0], [0,0,0,1,0], [0,0,0,0,1]], // V shape
    [[0,0,0,0,1], [0,0,0,1,0], [0,0,1,0,0], [0,1,0,0,0], [1,0,0,0,0]], // Inverted V
    [[1,0,0,0,0], [0,1,0,0,0], [1,0,0,0,0], [0,1,0,0,0], [1,0,0,0,0]], // W shape
    [[1,0,0,0,0], [0,1,0,0,0], [1,0,0,0,0], [0,1,0,0,0], [1,0,0,0,0]], // Inverted W
    [[1,0,0,0,0], [0,1,0,0,0], [0,0,1,0,0], [0,0,0,1,0], [0,0,0,0,1]], // Top left to bottom right
    [[0,0,0,0,1], [0,0,0,1,0], [0,0,1,0,0], [0,1,0,0,0], [1,0,0,0,0]], // Bottom left to top right
  ];

  const renderCell = (value, isHighlighted) => (
    <div className={`w-12 h-12 flex items-center justify-center border ${
      isHighlighted ? 'bg-blue-500 text-white' : 'bg-gray-100'
    }`}>
      {value}
    </div>
  );

  const renderReel = (reelIndex) => {
    return (
      <div className="flex flex-col gap-1">
        {reelLayout[reelIndex].map((symbol, posIndex) => {
          const isHighlighted = paylines[selectedLine][reelIndex][posIndex] === 1;
          return (
            <div key={`${reelIndex}-${posIndex}`}>
              {renderCell(symbol, isHighlighted)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Slot Machine Line Evaluator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-1 justify-center">
            {[0, 1, 2, 3, 4].map(reelIndex => (
              <div key={reelIndex}>
                {renderReel(reelIndex)}
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 justify-center mt-4">
            {paylines.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedLine(index)}
                className={`px-4 py-2 rounded ${
                  selectedLine === index 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Line {index + 1}
              </button>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-bold mb-2">How Win Evaluation Works:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Each payline defines a pattern across the reels</li>
              <li>Symbols are checked from left to right</li>
              <li>3 or more matching symbols on a payline constitute a win</li>
              <li>Win amount = bet × symbol multiplier × matched count multiplier</li>
              <li>Multiple paylines can win in a single spin</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlotEvaluator;