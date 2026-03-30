const TilesGrid = ({ tiles, gameStatus, handleTileClick }) => {
  return (
    <div className="mx-auto w-fit rounded-[18px] bg-[#2e3436]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.32)] ring-1 ring-white/5 md:p-5">
      <div className="grid grid-cols-5 gap-2.5 md:gap-3">
        {tiles.map((tile, index) => {
          const isHidden = tile === 'hidden';
          const isDisabled = gameStatus !== 'playing' || !isHidden;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleTileClick(index)}
              disabled={isDisabled}
              className={`flex h-[84px] w-[84px] items-center justify-center rounded-[10px] border text-3xl font-bold transition md:h-[88px] md:w-[88px] ${
                isHidden
                  ? 'border-white/[0.03] bg-[#586062] hover:-translate-y-0.5 hover:bg-[#646d70] active:translate-y-0'
                  : tile === 'safe'
                    ? 'border-[#6ef0a2]/40 bg-[#2edb78] text-white shadow-[0_12px_30px_rgba(46,219,120,0.28)]'
                    : 'border-[#ff7e7e]/40 bg-[#d94f4f] text-white shadow-[0_12px_30px_rgba(217,79,79,0.28)]'
              } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {tile === 'safe' && <span className="drop-shadow-[0_2px_6px_rgba(255,255,255,0.25)]">💎</span>}
              {tile === 'mine' && <span className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]">💣</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TilesGrid;
