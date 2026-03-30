const BetAmountInput = ({
  betAmount,
  setBetAmount,
  gameStatus,
  handleAmountButton,
}) => {
  const isDisabled = gameStatus === "playing";

  const handleChange = (e) => {
    if (isDisabled) return;

    const value = e.target.value;
    setBetAmount(value === "" ? "" : Math.max(0, parseFloat(value)));
  };

  const increment = () => {
    if (isDisabled) return;
    setBetAmount((prev) => (prev === "" ? 1 : Number(prev || 0) + 1));
  };

  const decrement = () => {
    if (isDisabled) return;
    setBetAmount((prev) =>
      prev === "" ? 0 : Math.max(0, Number(prev || 0) - 1)
    );
  };

  return (
    <div className="flex items-center gap-1.5">
            <div className="flex h-10 flex-1 items-center rounded-lg bg-[#262b2d] px-3">
        <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#e86b19] text-sm font-black text-white">
          ₹
        </span>

        <input
          type="number"
          value={betAmount}
          onChange={handleChange}
          disabled={isDisabled}
          className="w-full border-0 bg-transparent text-lg font-semibold text-white outline-none disabled:cursor-not-allowed"
          step="0.01"
          min="0"
        />
      </div>

      {/* Half Button */}
      <button
        type="button"
        onClick={() => handleAmountButton("1/2")}
        disabled={isDisabled}
        className="h-10 rounded-lg bg-[#485055] px-4 text-base font-semibold text-white transition hover:bg-[#566065] disabled:cursor-not-allowed disabled:opacity-50"
      >
        1/2
      </button>

      {/* Double Button */}
      <button
        type="button"
        onClick={() => handleAmountButton("2x")}
        disabled={isDisabled}
        className="h-10 rounded-lg bg-[#485055] px-4 text-base font-semibold text-white transition hover:bg-[#566065] disabled:cursor-not-allowed disabled:opacity-50"
      >
        2×
      </button>

      {/* Increment / Decrement */}
      <div className="flex w-12 flex-col overflow-hidden rounded-lg bg-[#3c4347]">
        <button
          type="button"
          onClick={increment}
          disabled={isDisabled}
          className="flex h-5 items-center justify-center text-white transition hover:bg-[#4c555a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-base leading-none">⌃</span>
        </button>

        <button
          type="button"
          onClick={decrement}
          disabled={isDisabled}
          className="flex h-5 items-center justify-center border-t border-white/5 text-white transition hover:bg-[#4c555a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="rotate-180 text-base leading-none">⌃</span>
        </button>
      </div>
    </div>
  );
};

export default BetAmountInput;