"use client";

import Notification from "@/components/Notification";
import { useState } from "react";

export default function Playground() {
  const [apiKey, setApiKey] = useState("");
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({
          message: "Valid API Key, /protected can be accessed",
          type: "success",
        });
        // Optionally redirect to protected route
        // window.location.href = "/protected";
      } else {
        setNotification({
          message: data.error || "Invalid API key",
          type: "error",
        });
      }
    } catch (error) {
      setNotification({
        message: "Error validating API key",
        type: "error",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h1 className="text-2xl font-bold mb-8">API Playground</h1>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Validate API Key</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="apiKey"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              API Key
            </label>
            <input
              id="apiKey"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Validate Key
          </button>
        </form>
      </div>
    </div>
  );
}
