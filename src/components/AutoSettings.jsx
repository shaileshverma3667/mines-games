const AutoSettings = ({
    isActive,
    autoStopOnWin,
    setAutoStopOnWin,
    autoStopOnLoss,
    setAutoStopOnLoss,
    autoStopAmount,
    setAutoStopAmount,
}) => {
    if (!isActive) return null;

    return (
        <section className="rounded-xl border border-white/5 bg-[#2f3537] p-4">
            <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#96a1a4]">
                Auto Settings
            </div>

            <div className="space-y-3 text-sm text-[#d0d6d6]">
                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={autoStopOnWin}
                        onChange={(e) => setAutoStopOnWin(e.target.checked)}
                        className="h-4 w-4 rounded accent-[#27d16f]"
                    />
                    <span>Stop on Win</span>
                </label>
                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={autoStopOnLoss}
                        onChange={(e) => setAutoStopOnLoss(e.target.checked)}
                        className="h-4 w-4 rounded accent-[#27d16f]"
                    />
                    <span>Stop on Loss</span>
                </label>
                <div className="flex items-center gap-3 border-t border-white/6 pt-3">
                    <span className="flex-1">Profit</span>
                    <input
                        type="number"
                        value={autoStopAmount}
                        onChange={(e) => setAutoStopAmount(Number(e.target.value))}
                        className="h-10 w-28 rounded-lg border border-white/5 bg-[#262b2d] px-3 text-white outline-none"
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>
        </section>
    );
};

export default AutoSettings;