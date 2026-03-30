const AmountControls = ({ gameStatus, handleAmountButton }) => {
  const buttons = [
    { label: "0", value: "0" },
    { label: "½", value: "1/2" },
    { label: "2×", value: "2x" },
  ];

  const baseClasses =
    "flex-1 h-10 bg-[#2a2d3e] hover:bg-[#3a3d4e] border border-gray-700 hover:border-[#F5B042] rounded-lg text-sm font-medium text-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex gap-2 mb-3">
      {buttons.map((btn) => (
        <button
          key={btn.value}
          onClick={() => handleAmountButton(btn.value)}
          disabled={gameStatus === "playing"}
          className={baseClasses}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};

export default AmountControls;