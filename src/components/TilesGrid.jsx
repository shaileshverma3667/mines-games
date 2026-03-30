import React from "react";

const TilesGrid = ({ tiles, gameStatus, handleTileClick }) => {
    console.log(tiles,"shailesh")
  return (
    <div className="grid grid-cols-5 gap-2.5 sm:gap-3 p-4 bg-[#1a1d2e]/50 rounded-3xl">
      {tiles.map((tile, index) => (
        <button
          key={index}
          onClick={() => handleTileClick(index)}
          disabled={gameStatus !== "playing" || tile !== "hidden"}
          className={`aspect-square rounded-xl flex items-center justify-center text-4xl font-bold transition-all duration-100 ${
            tile === "hidden"
              ? "bg-[#2a2d3e] hover:bg-[#3a3d4e] hover:scale-105 hover:shadow-lg hover:shadow-[#F5B042]/20 active:scale-95 cursor-pointer"
              : tile === "safe"
              ? "bg-gradient-to-br from-[#00C74D] to-[#00E054] shadow-lg shadow-green-500/30"
              : "bg-gradient-to-br from-[#FF3B3B] to-[#FF6B6B] shadow-lg shadow-red-500/30"
          } ${
            gameStatus !== "playing" || tile !== "hidden"
              ? "cursor-not-allowed"
              : ""
          }`}
        >
          {tile === "hidden" && gameStatus === "playing" && "?"}
          {tile === "safe" && "💎"}
          {tile === "mine" && "💣"}
        </button>
      ))}
    </div>
  );
};

export default TilesGrid;