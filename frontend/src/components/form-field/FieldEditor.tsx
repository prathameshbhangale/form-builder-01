import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { updateField, setEditingField } from '../../slices/field';
import type { RootState } from '../../store';

export const FieldEditor = () => {
  const dispatch = useDispatch();
  const field = useSelector((state: RootState) => state.form.editingField);

  if (!field) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (field) {
      dispatch(updateField(field));
    }
  };

  const handleClose = () => {
    dispatch(setEditingField(null));
  };

  const handleFieldChange = (changes: Partial<typeof field>) => {
    dispatch(setEditingField({ ...field, ...changes }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Edit {field.type} Field</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => handleFieldChange({ label: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {(field.type !== 'checkbox' && field.type !== 'title' && field.type !== 'description') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placeholder
              </label>
              <input
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => handleFieldChange({ placeholder: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          )}

          {(field.type === 'select' || field.type === "radio") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Options (one per line)
              </label>
              <textarea
                value={field.options?.join('\n')}
                onChange={(e) => handleFieldChange({ options: e.target.value.split('\n').filter(Boolean) })}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="required"
              checked={field.required}
              onChange={(e) => handleFieldChange({ required: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="required" className="ml-2 text-sm text-gray-700">
              Required field
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};