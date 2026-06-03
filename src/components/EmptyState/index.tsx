export default function EmptyState({
  onSuggestion,
}: {
  onSuggestion: (s: string) => void;
}) {
  const suggestions = [
    { text: "Yellow leaves in tomatoes?", icon: "🍅" },
    { text: "Wheat irrigation schedule?", icon: "🌾" },
    { text: "Urea for 2 acres?", icon: "🧪" },
    { text: "Powdery mildew cure?", icon: "🍂" },
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 max-w-xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-4xl mb-2 animate-bounce-slow">
          🌿
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Ask Plantie AI
        </h2>
        <p className="text-sm text-zinc-400 max-w-xs">
          Your expert agronomy companion. Ask about crop health, treatments, or soil solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4">
        {suggestions.map((s) => (
          <button
            key={s.text}
            onClick={() => onSuggestion(s.text)}
            className="flex items-center gap-3 text-left bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 hover:bg-zinc-850 p-3.5 rounded-xl text-zinc-300 hover:text-zinc-100 text-xs font-medium tracking-wide transition-all duration-200 active:scale-[0.98]"
          >
            <span className="text-lg p-1.5 rounded-lg bg-zinc-800">{s.icon}</span>
            <span>{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}