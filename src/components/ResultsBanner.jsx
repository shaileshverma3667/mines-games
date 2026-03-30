const ResultsBanner = ({ gameHistory, onItemClick }) => {
  const recentResults = gameHistory.slice(0, 10);
  const placeholderResults = [1.06, 1.02, 1.02, 1.02, 1.63, 0, 1.02, 1.02, 3.31];
  const visibleResults =
    recentResults.length === 0
      ? placeholderResults.map((value, index) => ({
          id: `placeholder-${index}`,
          multiplier: value,
          result: value === 0 ? 'loss' : 'win',
          placeholder: true,
        }))
      : recentResults;

  return (
    <div className="overflow-x-auto border-b border-white/6 px-5 py-4 md:px-7">
      <div className="flex min-w-max gap-3">
        {visibleResults.map((game) =>
          game.placeholder ? (
            <div
              key={game.id}
              className={`rounded-[10px] px-6 py-3 text-base font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] ${
                game.result === 'loss' ? 'bg-[#535b5e] text-[#a9b1b3]' : 'bg-[#22bf69] text-white'
              }`}
            >
              {game.multiplier > 0 ? `${game.multiplier.toFixed(2)}x` : '0.00x'}
            </div>
          ) : (
            <button
              key={game.id}
              type="button"
              onClick={() => onItemClick(game)}
              className={`rounded-[10px] px-6 py-3 text-base font-bold transition hover:-translate-y-0.5 ${
                game.result === 'loss' ? 'bg-[#535b5e] text-[#a9b1b3]' : 'bg-[#22bf69] text-white'
              }`}
            >
              {game.multiplier > 0 ? `${game.multiplier.toFixed(2)}x` : '0.00x'}
            </button>
          ),
        )}
      </div>
    </div>
  );
};

export default ResultsBanner;
