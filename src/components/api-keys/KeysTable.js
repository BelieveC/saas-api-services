import KeyRow from "./KeyRow";

export default function KeysTable({
  apiKeys,
  onEdit,
  onDelete,
  onToggleReveal,
  onCopy,
  revealedKeys,
  editingKey,
  editingName,
  onSaveEdit,
  onCancelEdit,
  onEditingNameChange,
}) {
  return (
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
            <KeyRow
              key={key.id}
              apiKey={key}
              isRevealed={revealedKeys.has(key.id)}
              isEditing={editingKey === key.id}
              editingName={editingName}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleReveal={onToggleReveal}
              onCopy={onCopy}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onEditingNameChange={onEditingNameChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
