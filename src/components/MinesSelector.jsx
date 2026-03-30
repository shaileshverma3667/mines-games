const MinesSelector = ({ minesCount, setMinesCount, gameStatus }) => {
  const isDisabled = gameStatus === 'playing';
  const sliderPercent = ((minesCount - 1) / 23) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="w-5 text-left text-lg font-semibold text-white">4</span>
        <input
          type="range"
          min="1"
          max="24"
          value={minesCount}
          onChange={(e) => !isDisabled && setMinesCount(Number(e.target.value))}
          disabled={isDisabled}
          className="mines-slider h-2.5 w-full cursor-pointer appearance-none rounded-full bg-[#3d4447] disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: `linear-gradient(90deg, #37df80 0%, #37df80 ${sliderPercent}%, #3d4447 ${sliderPercent}%, #3d4447 100%)`,
          }}
        />
        <span className="w-5 text-right text-lg font-semibold text-[#a4adaf]">24</span>
      </div>
    </div>
  );
};

export default MinesSelector;
