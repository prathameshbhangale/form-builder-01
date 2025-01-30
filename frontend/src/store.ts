import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./slices/user.ts"
import formReducer from "./slices/field.ts"

export const store = configureStore({
    reducer: {
      user: userReducer,
      form: formReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch