import { KeyActions } from "./KeyActions";
import { KeyName } from "./KeyName";
import { KeyValue } from "./KeyValue";

export default function KeyRow({
  apiKey,
  isRevealed,
  isEditing,
  editingName,
  onEdit,
  onDelete,
  onToggleReveal,
  onCopy,
  onSaveEdit,
  onCancelEdit,
  onEditingNameChange,
}) {
  return (
    <tr className="text-gray-700">
      <td className="py-3 px-4">
        <KeyName
          apiKey={apiKey}
          isEditing={isEditing}
          editingName={editingName}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onEditingNameChange={onEditingNameChange}
        />
      </td>
      <td className="py-3 px-4 text-gray-500">{apiKey.usage}</td>
      <td className="py-3 px-4 font-mono text-sm">
        <KeyValue apiKey={apiKey} isRevealed={isRevealed} onCopy={onCopy} />
      </td>
      <td className="py-3 px-4">
        <KeyActions
          apiKey={apiKey}
          isRevealed={isRevealed}
          isEditing={isEditing}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleReveal={onToggleReveal}
        />
      </td>
    </tr>
  );
}
