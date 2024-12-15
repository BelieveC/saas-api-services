"use client";

import KeysTable from "@/components/api-keys/KeysTable";
import Header from "@/components/dashboard/Header";
import PlanCard from "@/components/dashboard/PlanCard";
import Dialog from "@/components/Dialog";
import Notification from "@/components/Notification";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const {
    apiKeys,
    isLoading,
    error: apiError,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  } = useApiKeys();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [editingKey, setEditingKey] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [revealedKeys, setRevealedKeys] = useState(new Set());
  const [notification, setNotification] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    keyId: null,
    keyName: null,
  });

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();
    try {
      await createApiKey(newKeyName);
      setNewKeyName("");
      setIsModalOpen(false);
      showNotification("API key created successfully");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const handleUpdateKey = async (keyId) => {
    try {
      await updateApiKey(keyId, editingName);
      setEditingKey(null);
      setEditingName("");
      showNotification("API key updated successfully");
    } catch (error) {
      showNotification(error.message, "error");
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
    try {
      await deleteApiKey(deleteDialog.keyId);
      showNotification("API key deleted successfully", "delete");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setDeleteDialog({ isOpen: false, keyId: null, keyName: null });
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification("API key copied to clipboard", "success");
    } catch (error) {
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

      <Header />
      <PlanCard />

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

        <KeysTable
          apiKeys={apiKeys}
          revealedKeys={revealedKeys}
          editingKey={editingKey}
          editingName={editingName}
          onEdit={(key) => {
            setEditingKey(key.id);
            setEditingName(key.name);
          }}
          onDelete={handleDeleteClick}
          onToggleReveal={(keyId) =>
            setRevealedKeys((prev) => {
              const newSet = new Set(prev);
              if (newSet.has(keyId)) newSet.delete(keyId);
              else newSet.add(keyId);
              return newSet;
            })
          }
          onCopy={copyToClipboard}
          onSaveEdit={handleUpdateKey}
          onCancelEdit={() => {
            setEditingKey(null);
            setEditingName("");
          }}
          onEditingNameChange={setEditingName}
        />
      </div>

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

            <form onSubmit={handleCreateKey}>
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
                {apiError && (
                  <p className="mt-2 text-sm text-red-600">{apiError}</p>
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
    </>
  );
}
