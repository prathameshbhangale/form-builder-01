export interface FormField {
  id: number;
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  height?: number;
}

export interface DragItem {
  id: number;
  type: string;
  index: number;
}