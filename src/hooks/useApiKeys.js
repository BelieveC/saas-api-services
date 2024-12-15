import { apiKeyService } from "@/services/apiKeys";
import { useCallback, useState } from "react";

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApiKeys = useCallback(async () => {
    try {
      const data = await apiKeyService.fetchAll();
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
    try {
      const newKey = await apiKeyService.create(name);
      setApiKeys((current) => [...current, newKey]);
      return newKey;
    } catch (error) {
      console.error("Error creating API key:", error);
      throw error;
    }
  };

  const updateApiKey = async (id, name) => {
    try {
      const updatedKey = await apiKeyService.update(id, name);
      setApiKeys((current) =>
        current.map((key) => (key.id === id ? updatedKey : key))
      );
      return updatedKey;
    } catch (error) {
      console.error("Error updating API key:", error);
      throw error;
    }
  };

  const deleteApiKey = async (id) => {
    try {
      await apiKeyService.delete(id);
      setApiKeys((current) => current.filter((key) => key.id !== id));
    } catch (error) {
      console.error("Error deleting API key:", error);
      throw error;
    }
  };

  return {
    apiKeys,
    isLoading,
    error,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    setApiKeys,
  };
}
