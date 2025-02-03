import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, X, Pencil, Asterisk } from 'lucide-react';
import { removeField, setEditingField } from '../../slices/field';
import { FormField, DragItem } from '../../types';

interface FormFieldItemProps {
  field: FormField;
  index: number;
  moveField: (dragIndex: number, hoverIndex: number) => void;
}

export const FormFieldItem = ({ field, index, moveField }: FormFieldItemProps) => {
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'FORM_FIELD',
    item: { id: field.id, index, type: field.type } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'FORM_FIELD',
    hover: (item: DragItem, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveField(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeField(field.id));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setEditingField(field));
  };

  const getFieldPreview = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder={field.placeholder || 'Text input'}
            disabled
          />
        );
      case 'select':
        return (
          <select className="form-select mt-1 block w-full rounded-md border-gray-300 shadow-sm" disabled>
            {field.options?.map((option, index) => (
              <option key={index}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="mt-1">
            <input type="checkbox" className="form-checkbox rounded border-gray-300" disabled />
          </div>
        );
      case 'date':
        return (
          <input
            type="date"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            disabled
          />
        );
      case 'email':
        return (
          <input
            type="email"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder={field.placeholder || 'email@example.com'}
            disabled
          />
        );
      case 'phone':
        return (
          <input
            type="tel"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder={field.placeholder || '+1 (555) 000-0000'}
            disabled
          />
        );
      case 'title':
        return <h3 className="text-lg font-semibold text-gray-700">{field.label}</h3>;
      case 'description':
        return <p className="text-gray-600">{field.placeholder || 'Description text here...'}</p>;
      case 'large-text':
        return (
          <textarea
            className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder={field.placeholder || 'Enter text here...'}
            rows={3}
            disabled
          />
        );
      case 'number':
        return (
          <input
            type="number"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder={field.placeholder || 'Enter number'}
            disabled
          />
        );
      case 'radio':
        return (
          <div className="mt-1 flex flex-col">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input type="radio" name={`radio-${field.id}`} disabled className="form-radio text-indigo-600" />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      className={`bg-gray-50 rounded-lg p-4 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <GripVertical className="text-gray-400 cursor-move" size={20} />
          <div className="flex items-center gap-1">
            <span className="font-medium text-gray-700">{field.label}</span>
            {field.required && (
              <Asterisk className="text-red-500" size={8} />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleEdit}
            className="text-gray-400 hover:text-indigo-500 transition-colors"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      {getFieldPreview()}
    </div>
  );
};