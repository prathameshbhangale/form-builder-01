import React from 'react';
import { useDispatch } from 'react-redux';
import { useDrag } from 'react-dnd';
import { 
  Type, 
  ListChecks, 
  ToggleLeft, 
  Calendar, 
  Mail, 
  Phone, 
  Heading, 
  FileText, 
  Hash, 
  CircleDot 
} from "lucide-react";
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
      className={`flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm cursor-move transition-all
        ${isDragging ? 'opacity-50' : 'opacity-100 hover:shadow-md hover:scale-105'}
      `}
    >
      <div className="text-indigo-600 flex justify-center items-center w-10 h-10">
        {icon}
      </div>
      <span className="font-medium text-gray-700">{label}</span>
    </div>
  );
};

export const FieldTypes = () => {
  const fieldTypes = [
    { type: "text", icon: <Type size={24} />, label: "Text Input" },
    { type: "select", icon: <ListChecks size={24} />, label: "Dropdown" },
    { type: "checkbox", icon: <ToggleLeft size={24} />, label: "Checkbox" },
    { type: "date", icon: <Calendar size={24} />, label: "Date Picker" },
    { type: "email", icon: <Mail size={24} />, label: "Email Input" },
    { type: "phone", icon: <Phone size={24} />, label: "Phone Input" },
    { type: "title", icon: <Heading size={24} />, label: "Title" },
    { type: "description", icon: <FileText size={24} />, label: "Description" },
    { type: "large-text", icon: <FileText size={24} />, label: "Large Text" },
    { type: "number", icon: <Hash size={24} />, label: "Number Input" },
    { type: "radio", icon: <CircleDot size={24} />, label: "Radio Input" },
  ];

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Field Types</h2>
      <p className="text-sm text-gray-600 mb-4">Drag and drop to add fields to your form</p>
      <div className="grid grid-cols-2 gap-4">
        {fieldTypes.map((field) => (
          <FieldTypeItem
            key={field.type}
            type={field.type}
            icon={field.icon}
            label={field.label}
          />
        ))}
      </div>
    </div>
  );
};
