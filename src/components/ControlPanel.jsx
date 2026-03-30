import MinesSelector from './MinesSelector';

const ControlPanel = ({
  activeTab,
  setActiveTab,
  betAmount,
  setBetAmount,
  balance,
  gameStatus,
  handleAmountButton,
  minesCount,
  setMinesCount,
  startAutoPlay,
  handleBetClick,
  handleCashOut,
  autoPlaying,
  currentWin,
  revealedCount,
  gamesPlayed,
  wins,
  losses,
}) => {
  const quickBets = [10, 100, 1000, 10000];

  return (
    <div className="w-full lg:w-[320px] bg-[#1b1f29] border-r border-gray-700/40 flex flex-col p-4 sm:p-6 overflow-y-auto min-h-[calc(100vh-80px)]">
      <div className="flex gap-3 mb-5">
        {['manual', 'auto'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
              activeTab === tab
                ? 'bg-[#0f1921] text-[#37f59d] border border-[#2b3c4e]'
                : 'bg-[#131820] text-gray-400 hover:text-white hover:bg-[#16212e]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-gray-700/40 bg-[#111720] p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase text-gray-400">Amount</span>
          <span className="text-xs text-gray-500">Balance {balance.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-md text-[#F5B042]">₹</span>
          <input
            type="number"
            value={betAmount}
            min="0"
            step="0.01"
            disabled={gameStatus === 'playing'}
            onChange={(e) =>
              gameStatus !== 'playing' &&
              setBetAmount(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))
            }
            className="flex-1 bg-[#121a24] text-white rounded-lg px-2 py-1 text-sm outline-none border border-gray-600"
          />
          <button
            className="px-2 rounded-lg bg-[#0b1c23] text-gray-300 border border-gray-600"
            onClick={() => setBetAmount((prev) => Math.max(0, (prev || 0) + 1))}
            disabled={gameStatus === 'playing'}
          >
            ▲
          </button>
          <button
            className="px-2 rounded-lg bg-[#0b1c23] text-gray-300 border border-gray-600"
            onClick={() => setBetAmount((prev) => Math.max(0, (prev || 0) - 1))}
            disabled={gameStatus === 'playing'}
          >
            ▼
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-2">
          {quickBets.map((val) => (
            <button
              key={val}
              onClick={() => setBetAmount(val)}
              disabled={gameStatus === 'playing'}
              className="rounded-md bg-[#151e2a] hover:bg-[#1d2a38] text-xs text-gray-300 py-1"
            >
              {val >= 1000 ? `${val / 1000}k` : val}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleAmountButton('1/2')}
            disabled={gameStatus === 'playing'}
            className="flex-1 rounded-lg bg-[#0f2e3f] text-xs text-gray-200 py-2"
          >
            1/2
          </button>
          <button
            onClick={() => handleAmountButton('2x')}
            disabled={gameStatus === 'playing'}
            className="flex-1 rounded-lg bg-[#0f2e3f] text-xs text-gray-200 py-2"
          >
            2x
          </button>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Mines</p>
        <MinesSelector minesCount={minesCount} setMinesCount={setMinesCount} gameStatus={gameStatus} />
      </div>

      <div className="mb-5">
        {gameStatus !== 'playing' ? (
          activeTab === 'auto' ? (
            <button
              onClick={startAutoPlay}
              disabled={betAmount === 0}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#1fd48e] to-[#0cca8f] text-black font-bold"
            >
              {autoPlaying ? 'Stop Auto' : 'Start Auto'}
            </button>
          ) : (
            <button
              onClick={handleBetClick}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#1fd48e] to-[#0cca8f] text-black font-bold"
            >
              Bet
            </button>
          )
        ) : (
          <button
            onClick={handleCashOut}
            disabled={revealedCount === 0}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#f5bd43] to-[#ffd76d] text-black font-bold disabled:opacity-50"
          >
            Cash Out ₹{currentWin.toFixed(2)}
          </button>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-700/30 text-xs text-gray-400">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="font-bold text-white">{gamesPlayed}</div>
            Games
          </div>
          <div className="text-center">
            <div className="font-bold text-green-400">{wins}</div>
            Wins
          </div>
          <div className="text-center">
            <div className="font-bold text-red-400">{losses}</div>
            Losses
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
