export default function Protected() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Protected Route</h1>
      <p className="text-gray-600">
        This page can only be accessed with a valid API key.
      </p>
    </div>
  );
}
