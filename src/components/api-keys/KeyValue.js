export function KeyValue({ apiKey, isRevealed, onCopy }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500">
        {isRevealed
          ? apiKey.key
          : apiKey.key.slice(0, 4) + "-" + "*".repeat(32)}
      </span>
      <button
        onClick={() => onCopy(apiKey.key)}
        className="text-gray-400 hover:text-gray-600"
        title="Copy to clipboard"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </button>
    </div>
  );
}
