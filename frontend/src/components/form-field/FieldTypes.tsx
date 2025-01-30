import React from 'react';
import { useDispatch } from 'react-redux';
import { useDrag } from 'react-dnd';
import { 
  Type, 
  ListChecks, 
  ToggleLeft, 
  Calendar, 
  Mail,
  Phone
} from 'lucide-react';
import { addField } from '../../slices/field';

interface FieldTypeProps {
  type: string;
  icon: React.ReactNode;
  label: string;
}

const FieldTypeItem = ({ type, icon, label }: FieldTypeProps) => {
  const dispatch = useDispatch();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'NEW_FIELD',
    item: { type },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        dispatch(addField({ type }));
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm cursor-move mb-3 transition-all
        ${isDragging ? 'opacity-50' : 'opacity-100 hover:shadow-md hover:scale-102'}`}
    >
      <div className="text-indigo-600">{icon}</div>
      <span className="font-medium text-gray-700">{label}</span>
    </div>
  );
};

export const FieldTypes = () => {
  const fieldTypes = [
    { type: 'text', icon: <Type size={20} />, label: 'Text Input' },
    { type: 'select', icon: <ListChecks size={20} />, label: 'Dropdown' },
    { type: 'checkbox', icon: <ToggleLeft size={20} />, label: 'Checkbox' },
    { type: 'date', icon: <Calendar size={20} />, label: 'Date Picker' },
    { type: 'email', icon: <Mail size={20} />, label: 'Email Input' },
    { type: 'phone', icon: <Phone size={20} />, label: 'Phone Input' },
  ];

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Field Types</h2>
      <p className="text-sm text-gray-600 mb-4">Drag and drop to add fields to your form</p>
      {fieldTypes.map((field) => (
        <FieldTypeItem
          key={field.type}
          type={field.type}
          icon={field.icon}
          label={field.label}
        />
      ))}
    </div>
  );
};