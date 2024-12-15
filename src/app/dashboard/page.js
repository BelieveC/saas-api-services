"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/keys");
      const data = await response.json();
      setApiKeys(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      setIsLoading(false);
    }
  };

  const createApiKey = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });
      const data = await response.json();
      setApiKeys([...apiKeys, data]);
      setNewKeyName("");
    } catch (error) {
      console.error("Error creating API key:", error);
    }
  };

  const deleteApiKey = async (keyId) => {
    try {
      await fetch(`/api/keys/${keyId}`, { method: "DELETE" });
      setApiKeys(apiKeys.filter((key) => key.id !== keyId));
    } catch (error) {
      console.error("Error deleting API key:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">API Keys Dashboard</h1>

      {/* Create new API key form */}
      <form onSubmit={createApiKey} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Enter API key name"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Key
          </button>
        </div>
      </form>

      {/* API keys list */}
      <div className="space-y-4">
        {apiKeys.map((key) => (
          <div
            key={key.id}
            className="p-4 border rounded-lg flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium">{key.name}</h3>
              <p className="text-sm text-gray-500">{key.key}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => deleteApiKey(key.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
