import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Coins, TrendingDown, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// ... previous interfaces and constants ...

const ConfigurableSlotMachine = () => {
  // Grid configuration state
  const [gridConfig, setGridConfig] = useState({
    rows: 5,
    reels: 5,
    minMatch: 3
  });

  // Game state
  const [reels, setReels] = useState<number[][]>([]);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [selectedWin, setSelectedWin] = useState<any>(null);

  // Credit management state
  const [credits, setCredits] = useState<number>(1000.00);
  const [betAmount, setBetAmount] = useState<number>(1.00);
  const [showDeposit, setShowDeposit] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showTransactions, setShowTransactions] = useState<boolean>(false);

  useEffect(() => {
    generateNewSpin(false); // false means don't deduct credits
  }, [gridConfig]);

  const validateBetAmount = (value: string): string => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "1.00";
    if (numValue < 0.01) return "0.01";
    if (numValue > Math.min(99999.99, credits)) return Math.min(99999.99, credits).toFixed(2);
    return numValue.toFixed(2);
  };

  const validateTransaction = (amount: number): boolean => {
    if (isNaN(amount) || amount <= 0) {
      setError('Invalid amount');
      return false;
    }
    if (amount > 99999.99) {
      setError('Amount exceeds maximum limit of $99,999.99');
      return false;
    }
    return true;
  };

  const addTransaction = (type: CreditTransaction['type'], amount: number) => {
    const newTransaction: CreditTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount,
      timestamp: new Date(),
      balance: credits + (type === 'deposit' || type === 'win' ? amount : -amount)
    };
    setTransactions(prev => [newTransaction, ...prev].slice(0, 50));
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!validateTransaction(amount)) return;

    setCredits(prev => prev + amount);
    addTransaction('deposit', amount);
    setDepositAmount('');
    setShowDeposit(false);
    setError(null);
  };

  const handleWithdraw = (amount: number) => {
    if (!validateTransaction(amount)) return;
    if (amount > credits) {
      setError('Insufficient credits');
      return;
    }

    setCredits(prev => prev - amount);
    addTransaction('withdraw', amount);
    setError(null);
  };

  const evaluateReels = (reels: number[][], bet: number) => {
    // Simplified evaluation for example
    const randomWin = Math.random() < 0.3; // 30% win chance
    const winAmount = randomWin ? bet * (Math.floor(Math.random() * 5) + 1) : 0;
    
    return {
      totalWin: winAmount,
      winLines: randomWin ? [{
        paylineId: 0,
        count: 3,
        symbolId: 1,
        winAmount,
        positions: [
          { reel: 0, row: 0 },
          { reel: 1, row: 0 },
          { reel: 2, row: 0 }
        ]
      }] : [],
      scatterWins: [],
      multiplier: 1
    };
  };

  const generateNewSpin = (deductCredits: boolean = true) => {
    if (deductCredits) {
      if (betAmount > credits) {
        setError('Insufficient credits for bet');
        return;
      }

      setCredits(prev => prev - betAmount);
      addTransaction('bet', betAmount);
    }

    const newReels = Array(gridConfig.reels).fill(0).map(() => 
      Array(gridConfig.rows).fill(0).map(() => Math.floor(Math.random() * 4) + 1)
    );
    setReels(newReels);

    const newEvaluation = evaluateReels(newReels, betAmount);
    if (newEvaluation.totalWin > 0) {
      setCredits(prev => prev + newEvaluation.totalWin);
      addTransaction('win', newEvaluation.totalWin);
    }
    
    setEvaluation(newEvaluation);
    setSelectedWin(newEvaluation.winLines[0] || null);
    setError(null);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getSymbolDisplay = (symbolId: number) => {
    const symbols = ['W', 'S', 'H1', 'H2'];
    return symbols[symbolId - 1] || symbolId.toString();
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Slot Machine</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowTransactions(!showTransactions)}
              className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            >
              History
            </button>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-mono">{formatCurrency(credits)}</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Credit Management */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowDeposit(true)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Deposit
            </button>
            <button
              onClick={() => handleWithdraw(credits)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              disabled={credits <= 0}
            >
              Withdraw All
            </button>
          </div>

          {/* Slot Grid */}
          <div className="flex justify-center">
            <div className="grid gap-1" style={{ 
              gridTemplateColumns: `repeat(${gridConfig.reels}, minmax(0, 1fr))` 
            }}>
              {reels.map((reel, reelIndex) => (
                <div key={reelIndex} className="flex flex-col gap-1">
                  {reel.map((symbol, rowIndex) => {
                    const isHighlighted = selectedWin?.positions.some(
                      (pos: any) => pos.reel === reelIndex && pos.row === rowIndex
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

          {/* Bet Controls */}
          <div className="flex gap-4 justify-center">
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
                max={Math.min(99999.99, credits)}
              />
            </div>
            <button
              onClick={() => generateNewSpin(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={betAmount > credits}
            >
              Spin
            </button>
          </div>

          {/* Modals */}
          {showDeposit && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-bold mb-4">Deposit Credits</h3>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded mb-4"
                  step="0.01"
                  min="0.01"
                  max="99999.99"
                  placeholder="Enter amount"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowDeposit(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeposit}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Deposit
                  </button>
                </div>
              </div>
            </div>
          )}

          {showTransactions && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Transaction History</h3>
                  <button
                    onClick={() => setShowTransactions(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2">
                  {transactions.map(transaction => (
                    <div
                      key={transaction.id}
                      className="flex justify-between items-center p-2 border rounded"
                    >
                      <div className="flex items-center gap-2">
                        {transaction.type === 'deposit' && (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        )}
                        {transaction.type === 'withdraw' && (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        {transaction.type === 'bet' && (
                          <Coins className="w-4 h-4 text-yellow-500" />
                        )}
                        {transaction.type === 'win' && (
                          <Coins className="w-4 h-4 text-green-500" />
                        )}
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-mono ${
                          transaction.type === 'deposit' || transaction.type === 'win'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {transaction.type === 'deposit' || transaction.type === 'win' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {transaction.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Win Display */}
          {evaluation && evaluation.totalWin > 0 && (
            <div className="mt-4 p-4 bg-green-100 rounded">
              <h3 className="font-bold mb-2">Win!</h3>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(evaluation.totalWin)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigurableSlotMachine;