const BetSlip = ({ isOpen, selectedGame, onClose }) => {
  if (!isOpen || !selectedGame) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-gray-700 bg-[#1c202f] shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-600 px-4 py-3">
          <h3 className="text-lg font-bold text-white">Bet Slip</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none text-gray-300 hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="space-y-3 px-4 py-4">
          <p className="text-sm text-gray-400">Profit</p>
          <p className="text-3xl font-black text-[#F5B042]">
            ₹{(selectedGame.profit || 0).toFixed(2)} INR
          </p>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-[#23283e] p-3">
              <div className="text-xs text-gray-400">Bet Amount</div>
              <div className="font-semibold text-white">
                ₹{(selectedGame.bet || 0).toFixed(2)}
              </div>
            </div>

            <div className="rounded-lg bg-[#23283e] p-3">
              <div className="text-xs text-gray-400">Payout</div>
              <div className="font-semibold text-white">
                {(selectedGame.multiplier || 0).toFixed(2)}x
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-[#23283e] p-3">
            <div className="text-xs text-gray-400">Game ID</div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-white">
              {selectedGame.id}
            </div>
          </div>

          <div className="rounded-lg bg-[#23283e] p-3">
            <div className="text-xs text-gray-400">Mines</div>
            <div className="text-sm font-semibold text-white">
              {selectedGame.mines}
            </div>
          </div>

          <div className="text-right text-xs text-gray-400">
            {new Date(selectedGame.id).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetSlip;