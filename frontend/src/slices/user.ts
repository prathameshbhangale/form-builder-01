import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  userId: number | null;
  name: string;
  email: string;
  token: string;
}

const getFromLocalStorage = (key: string, defaultValue: any) => {
  const value = localStorage.getItem(key);
  if (value !== null) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return defaultValue;
};

const initialState: UserState = {
  userId: getFromLocalStorage('userId', null),
  name: getFromLocalStorage('name', ''),
  email: getFromLocalStorage('email', ''),
  token: getFromLocalStorage('token', ''),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<UserState>) {
      state.userId = action.payload.userId;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
      localStorage.setItem('userId', action.payload.userId?.toString() || '');
      localStorage.setItem('name', action.payload.name);
      localStorage.setItem('email', action.payload.email);
      localStorage.setItem('token', action.payload.token);
    },
    clearUserData(state) {
      state.userId = null;
      state.name = '';
      state.email = '';
      state.token = '';
      localStorage.removeItem('userId');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('token');
    },
    updateUserData(state, action: PayloadAction<Partial<UserState>>) {
      state.name = action.payload.name ?? state.name;
      state.email = action.payload.email ?? state.email;
      if (action.payload.name) {
        localStorage.setItem('name', state.name);
      }
      if (action.payload.email) {
        localStorage.setItem('email', state.email);
      }
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
  },
});

export const { setUserData, clearUserData, updateUserData, setToken } = userSlice.actions;
export default userSlice.reducer;
