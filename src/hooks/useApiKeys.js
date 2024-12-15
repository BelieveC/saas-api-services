import { useCallback, useState } from "react";

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApiKeys = useCallback(async () => {
    try {
      const response = await fetch("/api/keys");
      const data = await response.json();
      setApiKeys(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      setError("Failed to fetch API keys");
      setApiKeys([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createApiKey = async (name) => {
    // ... create key logic
  };

  const updateApiKey = async (id, name) => {
    // ... update key logic
  };

  const deleteApiKey = async (id) => {
    // ... delete key logic
  };

  return {
    apiKeys,
    isLoading,
    error,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  };
}
