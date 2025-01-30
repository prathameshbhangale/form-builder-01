import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';
import { FormFieldItem } from './FormFieldItem';
import { moveField } from '../../slices/field';
import type { RootState } from '../../store';

export const FormLayout = () => {
  const dispatch = useDispatch();
  const fields = useSelector((state: RootState) => state.form.fields);

  const [, drop] = useDrop(() => ({
    accept: ['FORM_FIELD', 'NEW_FIELD'],
    drop: () => ({ name: 'FormLayout' }),
  }));

  const handleMoveField = (dragIndex: number, hoverIndex: number) => {
    dispatch(moveField({ dragIndex, hoverIndex }));
  };
  console.log(fields)

  return (
    <div 
      ref={drop}
      className="bg-white p-6 rounded-xl min-h-[400px] shadow-sm"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Form Layout</h2>
      <p className="text-sm text-gray-600 mb-6">
        {fields.length === 0 
          ? 'Drag field types here to start building your form'
          : 'Drag fields to reorder them'}
      </p>
      
      <div className="space-y-3">
        {fields.map((field, index) => (
          <FormFieldItem
            key={field.id}
            index={index}
            field={field}
            moveField={handleMoveField}
          />
        ))}
      </div>

      
      {fields.length === 0 && (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-400">Drop fields here</p>
        </div>
      )}
    </div>
  );
};