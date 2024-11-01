import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../card';

// Types
interface GridConfig {
  rows: number;
  reels: number;
  minMatch: number;  // Minimum symbols for a win
}

interface Symbol {
  id: number;
  name: string;
  multipliers: Record<number, number>;
  isWild?: boolean;
  isScatter?: boolean;
}

interface PaylinePattern {
  id: number;
  name: string;
  pattern: number[][];
}

interface WinLine {
  paylineId: number;
  symbols: number[];
  count: number;
  symbolId: number;
  multiplier: number;
  winAmount: number;
  positions: { reel: number; row: number; }[];
}

interface SlotEvaluation {
  totalWin: number;
  winLines: WinLine[];
  scatterWins: WinLine[];
  multiplier: number;
}

// Function to generate payline patterns based on grid size
const generateDefaultPaylines = (rows: number, reels: number): PaylinePattern[] => {
  const patterns: PaylinePattern[] = [];
  
  // Horizontal lines
  for (let row = 0; row < rows; row++) {
    const pattern = Array(reels).fill(0).map(() => 
      Array(rows).fill(0).map((_, index) => index === row ? 1 : 0)
    );
    patterns.push({
      id: patterns.length + 1,
      name: `Horizontal Line ${row + 1}`,
      pattern
    });
  }

  // V-shape if grid is at least 3x3
  if (rows >= 3 && reels >= 3) {
    const vPattern = Array(reels).fill(0).map((_, reel) => 
      Array(rows).fill(0).map((_, row) => 
        row === Math.floor(reel * (rows - 1) / (reels - 1)) ? 1 : 0
      )
    );
    patterns.push({
      id: patterns.length + 1,
      name: "V Shape",
      pattern: vPattern
    });

    // Inverted V
    const invertedVPattern = Array(reels).fill(0).map((_, reel) => 
      Array(rows).fill(0).map((_, row) => 
        row === Math.floor((rows - 1) - (reel * (rows - 1) / (reels - 1))) ? 1 : 0
      )
    );
    patterns.push({
      id: patterns.length + 1,
      name: "Inverted V",
      pattern: invertedVPattern
    });
  }

  return patterns;
};

// Default symbols configuration
const DEFAULT_SYMBOLS: Symbol[] = [
  {
    id: 1,
    name: "Wild",
    multipliers: { 3: 50, 4: 200, 5: 1000, 6: 2000, 7: 5000, 8: 10000, 9: 20000, 10: 50000 },
    isWild: true
  },
  {
    id: 2,
    name: "Scatter",
    multipliers: { 3: 20, 4: 50, 5: 200, 6: 500, 7: 1000, 8: 2000, 9: 5000, 10: 10000 },
    isScatter: true
  },
  {
    id: 3,
    name: "H1",
    multipliers: { 3: 30, 4: 100, 5: 500, 6: 1000, 7: 2000, 8: 5000, 9: 10000, 10: 20000 }
  },
  {
    id: 4,
    name: "H2",
    multipliers: { 3: 25, 4: 75, 5: 400, 6: 800, 7: 1500, 8: 3000, 9: 7000, 10: 15000 }
  }
];

const ConfigurableWinVisualizer = () => {
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    rows: 5,
    reels: 5,
    minMatch: 3
  });
  const [paylines, setPaylines] = useState<PaylinePattern[]>([]);
  const [reels, setReels] = useState<number[][]>([]);
  const [evaluation, setEvaluation] = useState<SlotEvaluation | null>(null);
  const [selectedWin, setSelectedWin] = useState<WinLine | null>(null);
  const [betAmount, setBetAmount] = useState(1.00);

  useEffect(() => {
    const newPaylines = generateDefaultPaylines(gridConfig.rows, gridConfig.reels);
    setPaylines(newPaylines);
    generateNewSpin();
  }, [gridConfig]);

  const validateBetAmount = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "1.00";
    if (numValue < 0.01) return "0.01";
    if (numValue > 99999.99) return "99999.99";
    return numValue.toFixed(2);
  };

  // Evaluation logic (same as before but with configurable grid size)
  const evaluatePayline = (
    reels: number[][],
    payline: number[][],
    paylineId: number,
    bet: number
  ): WinLine | null => {
    const symbolsInLine: number[] = [];
    const positions: { reel: number; row: number; }[] = [];
    const wildSymbolId = 1;

    for (let reel = 0; reel < payline.length; reel++) {
      for (let row = 0; row < payline[reel].length; row++) {
        if (payline[reel][row] === 1) {
          symbolsInLine.push(reels[reel][row]);
          positions.push({ reel, row });
        }
      }
    }

    let identicalCount = 1;
    const firstSymbol = symbolsInLine[0];
    const isFirstWild = firstSymbol === wildSymbolId;
    let evaluatedSymbol = firstSymbol;

    if (isFirstWild) {
      for (let i = 1; i < symbolsInLine.length; i++) {
        if (symbolsInLine[i] !== wildSymbolId) {
          evaluatedSymbol = symbolsInLine[i];
          break;
        }
      }
    }

    for (let i = 1; i < symbolsInLine.length; i++) {
      const currentSymbol = symbolsInLine[i];
      if (currentSymbol === evaluatedSymbol || currentSymbol === wildSymbolId) {
        identicalCount++;
      } else {
        break;
      }
    }

    if (identicalCount >= gridConfig.minMatch) {
      const symbol = DEFAULT_SYMBOLS.find(s => s.id === evaluatedSymbol);
      if (!symbol) return null;

      const multiplier = symbol.multipliers[identicalCount] || 0;
      const winAmount = bet * multiplier;

      return {
        paylineId,
        symbols: symbolsInLine,
        count: identicalCount,
        symbolId: evaluatedSymbol,
        multiplier,
        winAmount,
        positions: positions.slice(0, identicalCount)
      };
    }

    return null;
  };

  const evaluateReels = (reels: number[][], bet: number): SlotEvaluation => {
    const winLines: WinLine[] = [];
    const scatterWins: WinLine[] = [];
    let totalWin = 0;

    paylines.forEach((payline, index) => {
      const lineWin = evaluatePayline(reels, payline.pattern, index, bet);
      if (lineWin) {
        winLines.push(lineWin);
        totalWin += lineWin.winAmount;
      }
    });

    return {
      totalWin,
      winLines,
      scatterWins,
      multiplier: 1
    };
  };

  const generateNewSpin = () => {
    const newReels = Array(gridConfig.reels).fill(0).map(() => 
      Array(gridConfig.rows).fill(0).map(() => Math.floor(Math.random() * 4) + 1)
    );
    setReels(newReels);

    const newEvaluation = evaluateReels(newReels, betAmount);
    setEvaluation(newEvaluation);
    setSelectedWin(newEvaluation.winLines[0] || null);
  };

  const getSymbolDisplay = (symbolId: number) => {
    const symbol = DEFAULT_SYMBOLS.find(s => s.id === symbolId);
    return symbol?.name?.slice(0, 2) || symbolId.toString();
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle>Configurable Slot Win Evaluator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex gap-4 justify-center">
            <div className="flex items-center gap-2">
              <label>Rows:</label>
              <input
                type="number"
                value={gridConfig.rows}
                onChange={(e) => setGridConfig(prev => ({
                  ...prev,
                  rows: Math.min(Math.max(1, parseInt(e.target.value) || 1), 10)
                }))}
                className="w-20 px-2 py-1 border rounded"
                min="1"
                max="10"
              />
            </div>
            <div className="flex items-center gap-2">
              <label>Reels:</label>
              <input
                type="number"
                value={gridConfig.reels}
                onChange={(e) => setGridConfig(prev => ({
                  ...prev,
                  reels: Math.min(Math.max(1, parseInt(e.target.value) || 1), 10)
                }))}
                className="w-20 px-2 py-1 border rounded"
                min="1"
                max="10"
              />
            </div>
            <div className="flex items-center gap-2">
              <label>Min Match:</label>
              <input
                type="number"
                value={gridConfig.minMatch}
                onChange={(e) => setGridConfig(prev => ({
                  ...prev,
                  minMatch: Math.min(Math.max(2, parseInt(e.target.value) || 2), gridConfig.reels)
                }))}
                className="w-20 px-2 py-1 border rounded"
                min="2"
                max={gridConfig.reels}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="grid gap-1" style={{ 
              gridTemplateColumns: `repeat(${gridConfig.reels}, minmax(0, 1fr))` 
            }}>
              {reels.map((reel, reelIndex) => (
                <div key={reelIndex} className="flex flex-col gap-1">
                  {reel.map((symbol, rowIndex) => {
                    const isHighlighted = selectedWin?.positions.some(
                      pos => pos.reel === reelIndex && pos.row === rowIndex
                    );
                    return (
                      <div 
                        key={`${reelIndex}-${rowIndex}`}
                        className={`w-12 h-12 flex items-center justify-center border font-bold
                          ${isHighlighted ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
                      >
                        {getSymbolDisplay(symbol)}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={generateNewSpin}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              New Spin
            </button>
            <div className="flex items-center gap-2">
              <label>Bet:</label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(parseFloat(validateBetAmount(e.target.value)))}
                onBlur={(e) => setBetAmount(parseFloat(validateBetAmount(e.target.value)))}
                className="w-24 px-2 py-1 border rounded"
                step="0.01"
                min="0.01"
                max="99999.99"
              />
            </div>
          </div>

          {evaluation && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="font-bold mb-2">Win Evaluation:</h3>
              <p>Total Win: ${evaluation.totalWin.toFixed(2)}</p>
              
              <div className="mt-2">
                <h4 className="font-semibold">Win Lines:</h4>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {evaluation.winLines.map((win, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedWin(win)}
                      className={`p-2 rounded text-sm
                        ${selectedWin === win 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                      Line {win.paylineId + 1}: ${win.winAmount.toFixed(2)}
                      ({win.count} x {getSymbolDisplay(win.symbolId)})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigurableWinVisualizer;