export default function PlanCard() {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl p-6 text-white mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm font-medium mb-1">CURRENT PLAN</p>
          <h2 className="text-2xl font-bold">Researcher</h2>
        </div>
        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
          Manage Plan
        </button>
      </div>
      <div>
        <p className="text-sm font-medium mb-1">API Limit</p>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div className="bg-white rounded-full h-2" style={{ width: "24%" }} />
        </div>
        <p className="text-sm mt-1">24/1,000 Requests</p>
      </div>
    </div>
  );
}
