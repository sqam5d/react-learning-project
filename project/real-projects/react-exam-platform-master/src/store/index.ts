import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import subjectSlice from './slice/subject'
import userReducer from './slice/user'

// 类型定义 react官方给的，能读懂就行
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

export const store = configureStore({
  reducer: {
    user: userReducer,
    subject: subjectSlice
  }
})

// 官网提供
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
