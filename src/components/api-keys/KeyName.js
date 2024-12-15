export function KeyName({
  apiKey,
  isEditing,
  editingName,
  onSaveEdit,
  onCancelEdit,
  onEditingNameChange,
}) {
  if (!isEditing) return apiKey.name;

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={editingName}
        onChange={(e) => onEditingNameChange(e.target.value)}
        className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={() => onSaveEdit(apiKey.id)}
        className="text-green-600 hover:text-green-700"
      >
        Save
      </button>
      <button
        onClick={onCancelEdit}
        className="text-gray-600 hover:text-gray-700"
      >
        Cancel
      </button>
    </div>
  );
}
