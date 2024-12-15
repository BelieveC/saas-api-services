export const apiKeyService = {
  async fetchAll() {
    const response = await fetch("/api/keys");
    if (!response.ok) throw new Error("Failed to fetch API keys");
    return response.json();
  },

  async create(name) {
    const response = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error("Failed to create API key");
    return response.json();
  },

  async update(id, name) {
    const response = await fetch(`/api/keys/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error("Failed to update API key");
    return response.json();
  },

  async delete(id) {
    const response = await fetch(`/api/keys/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete API key");
    return response.json();
  },
};
