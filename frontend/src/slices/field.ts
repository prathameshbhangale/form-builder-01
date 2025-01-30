import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormField } from '../types';

interface FormState {
  fields: FormField[];
  formid?:number;
  editingField: FormField | null;
}

const initialState: FormState = {
  fields: [],
  editingField: null,
};

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<{ type: string }>) => {
      const newField: FormField = {
        id: Date.now(),
        type: action.payload.type,
        label: `New ${action.payload.type} field`,
        required: false,
        placeholder: '',
        options: action.payload.type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
      };
      state.fields.push(newField);
    },
    moveField: (state, action: PayloadAction<{ dragIndex: number; hoverIndex: number }>) => {
      const { dragIndex, hoverIndex } = action.payload;
      const dragField = state.fields[dragIndex];
      state.fields.splice(dragIndex, 1);
      state.fields.splice(hoverIndex, 0, dragField);
    },
    removeField: (state, action: PayloadAction<number>) => {
      state.fields = state.fields.filter(field => field.id !== action.payload);
    },
    setEditingField: (state, action: PayloadAction<FormField | null>) => {
      state.editingField = action.payload;
    },
    updateField: (state, action: PayloadAction<FormField>) => {
      const index = state.fields.findIndex(field => field.id === action.payload.id);
      if (index !== -1) {
        state.fields[index] = action.payload;
      }
      state.editingField = null;
    },
    setformId(state, action:PayloadAction<number>){
      state.formid=action.payload
    }
  },
});

export const { addField,setformId, moveField, removeField, setEditingField, updateField } = formSlice.actions;
export default formSlice.reducer;