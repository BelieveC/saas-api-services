export default function Notification({ message, type = "success", onClose }) {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-slide-in`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:text-gray-200 transition-colors"
      >
        ×
      </button>
    </div>
  );
}
