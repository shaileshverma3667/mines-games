import { useState } from 'react';
import heroImage from './assets/hero.png';
import AutoSettings from './components/AutoSettings';
import BetAmountInput from './components/BetAmountInput';
import BetSlip from './components/BetSlip';
import MinesSelector from './components/MinesSelector';
import ResultsBanner from './components/ResultsBanner';
import TilesGrid from './components/TilesGrid';
import ToastMessages from './components/ToastMessages';

function App() {
  const [activeTab, setActiveTab] = useState('manual');
  const [initialBalance] = useState(100.0);
  const [balance, setBalance] = useState(100.0);
  const [betAmount, setBetAmount] = useState(0);
  const [minesCount, setMinesCount] = useState(4);
  const [gameStatus, setGameStatus] = useState('idle');
  const [tiles, setTiles] = useState(Array(25).fill('hidden'));
  const [minePositions, setMinePositions] = useState(new Set());
  const [revealedCount, setRevealedCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);
  const [toasts, setToasts] = useState([]);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [autoStopOnWin, setAutoStopOnWin] = useState(false);
  const [autoStopOnLoss, setAutoStopOnLoss] = useState(false);
  const [autoStopAmount, setAutoStopAmount] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isBetSlipOpen, setIsBetSlipOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const quickAmountButtons = ['10', '100', '1.0k', '10.0k'];
  const currentWin = betAmount * multiplier;

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const startAutoPlay = () => {
    if (autoPlaying) {
      setAutoPlaying(false);
      showToast('Auto play stopped', 'info');
      return;
    }

    if (betAmount === 0) {
      showToast('Cannot auto play in demo mode', 'error');
      return;
    }

    if (betAmount > balance) {
      openDepositModal();
      return;
    }

    setAutoPlaying(true);
    showToast('Auto play started', 'success');
    setTimeout(() => handleBetClick(), 500);
  };

  const openBetSlip = (game) => {
    setSelectedGame(game);
    setIsBetSlipOpen(true);
  };

  const closeBetSlip = () => {
    setSelectedGame(null);
    setIsBetSlipOpen(false);
  };

  const openDepositModal = () => {
    setIsDepositModalOpen(true);
  };

  const closeDepositModal = () => {
    setIsDepositModalOpen(false);
  };

  const handleDeposit = () => {
    const depositAmount = 100;
    setBalance((prev) => prev + depositAmount);
    showToast(`Deposited ₹${depositAmount}.00`, 'success');
    closeDepositModal();
  };

  const getRandomHiddenTile = (currentTiles) => {
    const hiddenIndices = currentTiles
      .map((tile, i) => (tile === 'hidden' ? i : null))
      .filter((i) => i !== null);

    if (hiddenIndices.length === 0) return null;

    return hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
  };

  const checkAutoStopConditions = () => {
    if (autoStopOnWin && gameStatus === 'won') {
      setAutoPlaying(false);
      showToast('Auto play stopped: Win condition met', 'success');
      return true;
    }

    if (autoStopOnLoss && gameStatus === 'lost') {
      setAutoPlaying(false);
      showToast('Auto play stopped: Loss condition met', 'error');
      return true;
    }

    if (autoStopAmount > 0 && balance >= initialBalance + autoStopAmount) {
      setAutoPlaying(false);
      showToast('Auto play stopped: Target amount reached', 'success');
      return true;
    }

    return false;
  };

  const calculateMultiplier = (reveals, mines) => {
    const totalTiles = 25;
    const safeTiles = totalTiles - mines;
    let mult = 1;

    for (let i = 0; i < reveals; i += 1) {
      mult *= (safeTiles - i) / (totalTiles - mines - i);
    }

    return mult;
  };

  const handleBetClick = () => {
    if (gameStatus === 'playing') return;

    const isDemoMode = betAmount === 0;

    if (!isDemoMode && betAmount > balance) {
      openDepositModal();
      return;
    }

    if (!isDemoMode) {
      setBalance((prev) => prev - betAmount);
    }

    const positions = new Set();
    while (positions.size < minesCount) {
      positions.add(Math.floor(Math.random() * 25));
    }

    setMinePositions(positions);
    setTiles(Array(25).fill('hidden'));
    setGameStatus('playing');
    setRevealedCount(0);
    setMultiplier(1.0);

    if (isDemoMode) {
      showToast('Demo mode activated', 'info');
    }
  };

  const handleTileClick = (index) => {
    if (gameStatus !== 'playing' || tiles[index] !== 'hidden') return;

    const newTiles = [...tiles];

    if (minePositions.has(index)) {
      newTiles[index] = 'mine';
      minePositions.forEach((pos) => {
        newTiles[pos] = 'mine';
      });

      setTiles(newTiles);
      setGameStatus('lost');
      setLosses((prev) => prev + 1);
      setGamesPlayed((prev) => prev + 1);

      const lossAmount = betAmount;
      setGameHistory((prev) => [
        {
          id: Date.now(),
          result: 'loss',
          amount: -lossAmount,
          multiplier: 0,
          mines: minesCount,
          bet: betAmount,
          profit: -lossAmount,
        },
        ...prev.slice(0, 9),
      ]);

      showToast('Game Over! Mine hit!', 'error');

      if (activeTab === 'auto' && autoPlaying && !checkAutoStopConditions()) {
        setTimeout(() => handleBetClick(), 2000);
      }

      return;
    }

    newTiles[index] = 'safe';
    const newRevealedCount = revealedCount + 1;
    const newMultiplier = calculateMultiplier(newRevealedCount, minesCount);

    setTiles(newTiles);
    setRevealedCount(newRevealedCount);
    setMultiplier(newMultiplier);

    const safeTiles = 25 - minesCount;

    if (newRevealedCount === safeTiles) {
      const winAmount = betAmount * newMultiplier;
      setBalance((prev) => prev + winAmount);
      setGameStatus('won');
      setWins((prev) => prev + 1);
      setGamesPlayed((prev) => prev + 1);
      setGameHistory((prev) => [
        {
          id: Date.now(),
          result: 'win',
          amount: winAmount,
          multiplier: newMultiplier,
          mines: minesCount,
          bet: betAmount,
          profit: winAmount - betAmount,
        },
        ...prev.slice(0, 9),
      ]);
      showToast(`All clear! Won ${winAmount.toFixed(2)}`, 'success');

      if (activeTab === 'auto' && autoPlaying && !checkAutoStopConditions()) {
        setTimeout(() => handleBetClick(), 2000);
      } else {
        setTimeout(() => setGameStatus('idle'), 1500);
      }

      return;
    }

    if (activeTab === 'auto' && autoPlaying) {
      setTimeout(() => {
        const randomIndex = getRandomHiddenTile(newTiles);
        if (randomIndex !== null) {
          handleTileClick(randomIndex);
        }
      }, 500);
    }
  };

  const handleCashOut = () => {
    if (gameStatus !== 'playing' || revealedCount === 0) return;

    const winAmount = betAmount * multiplier;
    setBalance((prev) => prev + winAmount);
    setGameStatus('won');
    setWins((prev) => prev + 1);
    setGamesPlayed((prev) => prev + 1);
    setGameHistory((prev) => [
      {
        id: Date.now(),
        result: 'cashout',
        amount: winAmount,
        multiplier,
        mines: minesCount,
        bet: betAmount,
        profit: winAmount - betAmount,
      },
      ...prev.slice(0, 9),
    ]);
    showToast(`Cashed out ₹${winAmount.toFixed(2)}!`, 'success');

    if (activeTab === 'auto' && autoPlaying && !checkAutoStopConditions()) {
      setTimeout(() => handleBetClick(), 2000);
    } else {
      setTimeout(() => setGameStatus('idle'), 1500);
    }
  };

  const handleAmountButton = (action) => {
    if (gameStatus === 'playing') return;

    switch (action) {
      case '0':
        setBetAmount(0);
        break;
      case '1/2':
        setBetAmount(Math.floor((initialBalance / 2) * 100) / 100);
        break;
      case '2x':
        setBetAmount((prev) => Math.min(prev * 2, balance));
        break;
      default:
        break;
    }
  };

  const handleQuickAmount = (label) => {
    if (gameStatus === 'playing') return;

    const normalized = label.toLowerCase();
    const multiplierValue = normalized.endsWith('k') ? 1000 : 1;
    const numeric = parseFloat(normalized.replace('k', ''));

    if (Number.isNaN(numeric)) return;

    setBetAmount(numeric * multiplierValue);
  };

  return (
    <div className="min-h-screen bg-[#1f2322] px-2 py-1 text-white md:px-4 md:py-4">
      <div className="mx-auto flex min-h-[calc(100vh-0.5rem)] max-w-[1280px] flex-col overflow-hidden rounded-[22px] border border-white/5 bg-[#262b2d] shadow-[0_22px_60px_rgba(0,0,0,0.45)] md:min-h-[calc(100vh-2rem)]">
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full flex-col lg:flex-row">
            <aside className={`flex w-full shrink-0 flex-col border-b border-white/6 bg-[#34393b] transition-all duration-300 lg:border-b-0 lg:border-r ${
              isSidebarOpen ? 'lg:w-[300px]' : 'lg:w-0 lg:overflow-hidden'
            }`}>
              <div className="grid grid-cols-2 border-b border-white/6 bg-[#34393b]">
                {['manual', 'auto'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-6 py-5 text-center text-lg font-semibold capitalize transition ${activeTab === tab ? 'text-white' : 'text-[#b5bcbc] hover:text-white'
                      }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#9fe861]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex flex-1 flex-col gap-5 p-4">
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-[15px] font-semibold text-[#d0d6d6]">
                    <span>Amount</span>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#1fc565] text-[10px] font-bold text-[#1fc565]">
                      i
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-[#2f3537] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                    <BetAmountInput
                      betAmount={betAmount}
                      setBetAmount={setBetAmount}
                      gameStatus={gameStatus}
                      handleAmountButton={handleAmountButton}
                    />

                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {quickAmountButtons.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handleQuickAmount(amount)}
                          disabled={gameStatus === 'playing'}
                          className="h-9 rounded-lg bg-[#383f43] text-base font-semibold text-[#8f999d] transition hover:bg-[#465055] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {amount}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <div className="text-[15px] font-semibold text-[#d0d6d6]">Mines</div>
                  <div className="rounded-xl border border-white/5 bg-[#2f3537] p-3">
                    <MinesSelector
                      minesCount={minesCount}
                      setMinesCount={setMinesCount}
                      gameStatus={gameStatus}
                    />
                  </div>
                </section>

                <AutoSettings
                  isActive={activeTab === "auto"}
                  autoStopOnWin={autoStopOnWin}
                  setAutoStopOnWin={setAutoStopOnWin}
                  autoStopOnLoss={autoStopOnLoss}
                  setAutoStopOnLoss={setAutoStopOnLoss}
                  autoStopAmount={autoStopAmount}
                  setAutoStopAmount={setAutoStopAmount}
                />

                {gameStatus !== 'playing' ? (
                  activeTab === 'auto' ? (
                    <button
                      type="button"
                      onClick={startAutoPlay}
                      disabled={betAmount === 0}
                      className={`mt-1 h-12 rounded-xl text-lg font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${autoPlaying ? 'bg-[#dc4747] text-white hover:bg-[#e35757]' : 'bg-[#2ee07c] text-black hover:bg-[#40e88a]'
                        }`}
                    >
                      {autoPlaying ? 'Stop Auto' : 'Bet'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleBetClick}
                      className="mt-1 h-12 rounded-xl bg-[#2ee07c] text-lg font-bold text-black transition hover:bg-[#40e88a]"
                    >
                      Bet
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={handleCashOut}
                    disabled={revealedCount === 0}
                    className="mt-1 h-12 rounded-xl bg-[#e6c44f] text-lg font-bold text-black transition hover:bg-[#f0cf5c] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cash Out ₹{currentWin.toFixed(2)}
                  </button>
                )}

                <div className="mt-auto">
                  {gamesPlayed > 0 && (
                    <div className="grid grid-cols-3 gap-3 rounded-xl border border-white/5 bg-[#2f3537] p-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-white">{gamesPlayed}</div>
                        <div className="text-xs uppercase tracking-[0.14em] text-[#8f999d]">Games</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-[#33d47a]">{wins}</div>
                        <div className="text-xs uppercase tracking-[0.14em] text-[#8f999d]">Wins</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-[#e06a6a]">{losses}</div>
                        <div className="text-xs uppercase tracking-[0.14em] text-[#8f999d]">Losses</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            <main className="relative flex min-h-[520px] flex-1 flex-col overflow-hidden bg-[#272d2f]">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-[0.24]"
                style={{ backgroundImage: `url(${heroImage})` }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_40%),linear-gradient(180deg,rgba(20,24,25,0.2),rgba(20,24,25,0.5))]" />

              <div className="relative z-10 flex flex-col">
                <ResultsBanner gameHistory={gameHistory} onItemClick={openBetSlip} />
              </div>

              <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 md:px-8">
                <div className="w-full max-w-[720px]">
                  <div className="mb-4 flex items-center justify-center gap-4 text-center">
                    <div className="rounded-xl bg-[#2b3133]/85 px-4 py-2 text-sm font-semibold text-[#b9c2c5] shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
                      Win ₹{currentWin.toFixed(2)}
                    </div>
                    <div className="rounded-xl bg-[#2b3133]/85 px-4 py-2 text-sm font-semibold text-[#2ee07c] shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
                      {multiplier.toFixed(2)}x
                    </div>
                  </div>

                  <TilesGrid
                    tiles={tiles}
                    gameStatus={gameStatus}
                    handleTileClick={handleTileClick}
                  />
                </div>
              </div>
            </main>
          </div>
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-white/6 bg-[#2b2f31] px-6 py-4 text-[#bec6c8]">
          <div className="flex items-center gap-5 text-sm font-semibold">
            <span className="text-lg leading-none">⬢</span>
            <div className="flex items-center gap-2">
              <span className="text-lg leading-none">★</span>
              <span className="text-base">3952</span>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-lg leading-none cursor-pointer transition hover:text-white active:scale-95"
              title="Toggle Movie Mode"
            >
              ▭
            </button>
            <span className="text-lg leading-none">∿</span>
          </div>
          <div className="text-sm font-medium text-[#95a0a3]">Balance ₹{balance.toFixed(2)}</div>
        </footer>
      </div>
      <BetSlip
        isOpen={isBetSlipOpen}
        selectedGame={selectedGame}
        onClose={closeBetSlip}
      />
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-xl border border-gray-700 bg-[#1c202f] shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-600 px-4 py-3">
              <h3 className="text-lg font-bold text-white">Insufficient balance</h3>
              <button type="button" onClick={closeDepositModal} className="text-xl leading-none text-gray-300 hover:text-white">
                ×
              </button>
            </div>
            <div className="space-y-3 px-4 py-4">
              <p className="text-sm text-gray-300">
                Insufficient INRFIAT Balance. Please switch to another asset to continue playing.
              </p>
              <div className="rounded-xl bg-[#192030] py-3 text-center font-bold text-[#F5B042]">
                Deposit Bonus +180%
              </div>
              <button
                type="button"
                onClick={handleDeposit}
                className="w-full rounded-lg bg-[#00ff88] py-2 font-bold text-black hover:bg-[#00e37a]"
              >
                Deposit
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastMessages toasts={toasts} />
    </div>
  );
}

export default App;
