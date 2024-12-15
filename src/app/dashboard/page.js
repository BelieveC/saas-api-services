"use client";

import Dialog from "@/components/Dialog";
import Notification from "@/components/Notification";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingKey, setEditingKey] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState(new Set());
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    keyId: null,
    keyName: null,
  });

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/keys");
      const data = await response.json();

      // Ensure we always have an array
      setApiKeys(Array.isArray(data) ? data : []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      setApiKeys([]);
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const createApiKey = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      setApiKeys((current) => [
        ...(Array.isArray(current) ? current : []),
        data,
      ]);
      setNewKeyName("");
      setIsModalOpen(false);
      showNotification("API key created successfully");
    } catch (error) {
      console.error("Error creating API key:", error);
      setError("Failed to create API key");
    }
  };

  const handleDeleteClick = (key) => {
    setDeleteDialog({
      isOpen: true,
      keyId: key.id,
      keyName: key.name,
    });
  };

  const handleDeleteConfirm = async () => {
    const keyId = deleteDialog.keyId;
    try {
      const response = await fetch(`/api/keys/${keyId}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete API key");
      }
      setApiKeys((current) =>
        Array.isArray(current) ? current.filter((key) => key.id !== keyId) : []
      );
      showNotification("API key deleted successfully", "delete");
    } catch (error) {
      console.error("Error deleting API key:", error);
      showNotification("Failed to delete API key", "error");
    } finally {
      setDeleteDialog({ isOpen: false, keyId: null, keyName: null });
    }
  };

  const updateApiKey = async (keyId) => {
    setError("");
    try {
      const response = await fetch(`/api/keys/${keyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      setApiKeys((current) =>
        Array.isArray(current)
          ? current.map((key) => (key.id === keyId ? data : key))
          : [data]
      );
      setEditingKey(null);
      setEditingName("");
      showNotification("API key updated successfully");
    } catch (error) {
      console.error("Error updating API key:", error);
      setError("Failed to update API key");
      showNotification("Failed to update API key", "error");
    }
  };

  const startEditing = (key) => {
    setEditingKey(key.id);
    setEditingName(key.name);
  };

  const toggleKeyReveal = (keyId) => {
    setRevealedKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification("API key copied to clipboard", "success");
    } catch (error) {
      console.error("Failed to copy text:", error);
      showNotification("Failed to copy API key", "error");
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
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Overview</h1>
          <p className="text-gray-600">
            Manage your API keys and monitor usage
          </p>
        </div>

        {/* Current Plan Section */}
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
              <div
                className="bg-white rounded-full h-2"
                style={{ width: "24%" }}
              />
            </div>
            <p className="text-sm mt-1">24/1,000 Requests</p>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">API Keys</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              + Add Key
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="text-left py-3 px-4 font-medium">NAME</th>
                  <th className="text-left py-3 px-4 font-medium">USAGE</th>
                  <th className="text-left py-3 px-4 font-medium">KEY</th>
                  <th className="text-left py-3 px-4 font-medium">OPTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {apiKeys.map((key) => (
                  <tr key={key.id} className="text-gray-700">
                    <td className="py-3 px-4">
                      {editingKey === key.id ? (
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => updateApiKey(key.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingKey(null);
                              setEditingName("");
                            }}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        key.name
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-500">0</td>
                    <td className="py-3 px-4 font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">
                          {revealedKeys.has(key.id)
                            ? key.key
                            : key.key.slice(0, 4) + "-" + "*".repeat(32)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(key.key)}
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
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleKeyReveal(key.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title={
                            revealedKeys.has(key.id) ? "Hide key" : "Reveal key"
                          }
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
                              d={
                                revealedKeys.has(key.id)
                                  ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                  : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              }
                            />
                          </svg>
                        </button>
                        {editingKey !== key.id && (
                          <button
                            onClick={() => startEditing(key)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Edit key name"
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
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(key)}
                          className="text-gray-400 hover:text-red-600"
                          title="Delete key"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Key Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Create New API Key</h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewKeyName("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={createApiKey}>
                <div className="mb-4">
                  <label
                    htmlFor="keyName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Key Name
                  </label>
                  <input
                    id="keyName"
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="Enter API key name"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setNewKeyName("");
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Key
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Dialog
          isOpen={deleteDialog.isOpen}
          onClose={() =>
            setDeleteDialog({ isOpen: false, keyId: null, keyName: null })
          }
          onConfirm={handleDeleteConfirm}
          title="Delete API Key"
          message={`Are you sure you want to delete the API key "${deleteDialog.keyName}"? This action cannot be undone.`}
        />
      </div>
    </>
  );
}
