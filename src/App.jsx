import { useState } from 'react';
import ToastMessages from './components/ToastMessages';
import TilesGrid from './components/TilesGrid';
import AmountControls from './components/AmountControls';
import MinesSelector from './components/MinesSelector';

function App() {
  const [activeTab, setActiveTab] = useState('manual');
  const [initialBalance] = useState(100.00); 
  const [balance, setBalance] = useState(100.00);
  const [betAmount, setBetAmount] = useState(0);
  const [minesCount, setMinesCount] = useState(4);
  const [gameStatus, setGameStatus] = useState('idle');
  const [tiles, setTiles] = useState(Array(25).fill('hidden'));
  const [minePositions, setMinePositions] = useState(new Set());
  const [revealedCount, setRevealedCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1.00);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const calculateMultiplier = (reveals, mines) => {
    const totalTiles = 25;
    const safeTiles = totalTiles - mines;
    let mult = 1;

    for (let i = 0; i < reveals; i++) {
      mult *= (safeTiles - i) / (totalTiles - mines - i);
    }

    return mult;
  };

  const handleBetClick = () => {
    if (gameStatus === 'playing') return;
    const isDemoMode = betAmount === 0;
    if (!isDemoMode && betAmount > balance) {
      showToast('Insufficient balance', 'error');
      return;
    }
    if (!isDemoMode) {
      setBalance(prev => prev - betAmount);
    }
    const positions = new Set();
    while (positions.size < minesCount) {
      positions.add(Math.floor(Math.random() * 25));
    }

    setMinePositions(positions);
    setTiles(Array(25).fill('hidden'));
    setGameStatus('playing');
    setRevealedCount(0);
    setMultiplier(1.00);

    if (isDemoMode) {
      showToast('Demo mode activated', 'info');
    }
  };

  const handleTileClick = (index) => {
    if (gameStatus !== 'playing' || tiles[index] !== 'hidden') return;
    const newTiles = [...tiles];
    if (minePositions.has(index)) {
      newTiles[index] = 'mine';
      minePositions.forEach(pos => {
        newTiles[pos] = 'mine';
      });
      setTiles(newTiles);
      setGameStatus('lost');
      showToast('Game Over! Mine hit!', 'error');
    } else {
      newTiles[index] = 'safe';
      const newRevealedCount = revealedCount + 1;
      const newMultiplier = calculateMultiplier(newRevealedCount, minesCount);

      setTiles(newTiles);
      setRevealedCount(newRevealedCount);
      setMultiplier(newMultiplier);

      const safeTiles = 25 - minesCount;
      if (newRevealedCount === safeTiles) {
        const winAmount = betAmount * newMultiplier;
        setBalance(prev => prev + winAmount);
        setGameStatus('won');
        showToast(`All clear! Won ${winAmount.toFixed(2)}`, 'success');
        setTimeout(() => setGameStatus('idle'), 1500);
      }
    }
  };

  const handleCashOut = () => {
    if (gameStatus !== 'playing' || revealedCount === 0) return;
    const winAmount = betAmount * multiplier;
    setBalance(prev => prev + winAmount);
    setGameStatus('won');
    showToast(`Cashed out $${winAmount.toFixed(2)}!`, 'success');
    setTimeout(() => setGameStatus('idle'), 1500);
  };

  const handleAmountButton = (action) => {
    if (gameStatus === 'playing') return;
    switch (action) {
      case '0':
        setBetAmount(0);
        break;
      case '1/2':
        // setBetAmount(Math.floor(balance / 2 * 100) / 100);
          setBetAmount(Math.floor(initialBalance / 2 * 100) / 100);

        break;
      case '2x':
        setBetAmount(prev => Math.min(prev * 2, balance));
        break;
    }
  };

  const currentWin = betAmount * multiplier;

  return (
    <div className="min-h-screen bg-[#0A0C16] flex items-center justify-center p-4">
      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[380px] bg-[#1a1d2e] rounded-[28px] shadow-2xl p-6">
          <div className="flex mb-6 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 pb-3 text-sm font-semibold transition-all ${activeTab === 'manual'
                ? 'text-[#F5B042] border-b-2 border-[#F5B042]'
                : 'text-gray-400'
                }`}
            >
              Manual
            </button>
            <button
              onClick={() => {
                setActiveTab('auto');
                showToast('Auto mode coming soon', 'info');
              }}
              className={`flex-1 pb-3 text-sm font-semibold transition-all ${activeTab === 'auto'
                ? 'text-[#F5B042] border-b-2 border-[#F5B042]'
                : 'text-gray-400'
                }`}
            >
              Auto
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider">Amount</label>
              <span className="text-xs text-gray-500">Balance: {balance.toFixed(2)}</span>
            </div>
            <AmountControls gameStatus={gameStatus} handleAmountButton={handleAmountButton} />
            <div className="bg-[#2a2d3e] border border-gray-700 rounded-lg px-4 py-3">
              <input
                type="number"
                value={betAmount}
                onChange={(e) =>
                  gameStatus !== "playing" &&
                  setBetAmount(
                    e.target.value === ""
                      ? ""
                      : Math.max(0, parseFloat(e.target.value))
                  )
                }
                disabled={gameStatus === 'playing'}
                className="w-full bg-transparent text-white text-lg font-semibold outline-none disabled:opacity-50"
                step="0.01"
                min="0"
              />
            </div>
          </div>
          <MinesSelector
            minesCount={minesCount}
            setMinesCount={setMinesCount}
            gameStatus={gameStatus}
          />
          {gameStatus !== 'playing' ? (
            <button
              onClick={handleBetClick}
              className="w-full h-14 bg-gradient-to-r from-[#00C74D] to-[#00E054] hover:from-[#00D955] hover:to-[#00F05F] rounded-lg text-white font-bold text-lg shadow-lg transition-all transform active:scale-[0.98]"
            >
              Bet
            </button>
          ) : (
            <button
              onClick={handleCashOut}
              disabled={revealedCount === 0}
              className="w-full h-14 bg-gradient-to-r from-[#F5B042] to-[#FFD700] hover:from-[#FFB952] hover:to-[#FFE710] disabled:from-gray-600 disabled:to-gray-700 rounded-lg text-black font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cash Out {currentWin.toFixed(2)}
            </button>
          )}

          {gameStatus === 'playing' && (
            <div className="mb-4 bg-[#2a2d3e] border border-[#F5B042] rounded-xl p-4 my-3">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Current Win</div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-white">
                  ${currentWin.toFixed(2)}
                </div>
                <div className="text-2xl font-bold text-[#00E5FF]">
                  x{multiplier.toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {betAmount === 0 && gameStatus !== 'playing' && (
            <p className="text-xs text-gray-500 text-center mt-2">
              Betting with 0 will enter demo mode
            </p>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[600px]">
            {gameStatus === 'idle' && (
              <div className="text-center text-gray-400 mb-6">
                <p className="text-lg">Place your bet to start playing</p>
              </div>
            )}

            <div className="w-full">
              <TilesGrid
                tiles={tiles}
                gameStatus={gameStatus}
                handleTileClick={handleTileClick}
              />
            </div>
          </div>
        </div>
      </div>
      <ToastMessages toasts={toasts} />
    </div>
  )
}

export default App;
