import React from "react";

const MinesSelector = ({ minesCount, setMinesCount, gameStatus }) => {
  const mineOptions = [4, 24];
  const isDisabled = gameStatus === "playing";

  const baseBtnClasses =
    "flex-1 h-10 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const getBtnClasses = (value) =>
    `${baseBtnClasses} ${
      minesCount === value
        ? "bg-[#F5B042] text-black"
        : "bg-[#2a2d3e] text-gray-300 hover:bg-[#3a3d4e] border border-gray-700"
    }`;

  return (
    <div className="mb-6">
      <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">
        Mines
      </label>

      {/* Buttons */}
      <div className="flex gap-2 mb-3">
        {mineOptions.map((value) => (
          <button
            key={value}
            onClick={() => setMinesCount(value)}
            disabled={isDisabled}
            className={getBtnClasses(value)}
          >
            {value}
          </button>
        ))}
      </div>

      {/* Range Slider */}
      <div className="flex items-center gap-3">
        <input
          type="range"
          min="1"
          max="24"
          value={minesCount}
          onChange={(e) =>
            !isDisabled && setMinesCount(Number(e.target.value))
          }
          disabled={isDisabled}
          className="flex-1 h-2 bg-[#2a2d3e] rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed 
          [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:w-4 
          [&::-webkit-slider-thumb]:h-4 
          [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:bg-[#F5B042] 
          [&::-webkit-slider-thumb]:cursor-pointer"
        />

        <span className="text-white font-semibold w-8 text-center">
          {minesCount}
        </span>
      </div>
    </div>
  );
};

export default MinesSelector;