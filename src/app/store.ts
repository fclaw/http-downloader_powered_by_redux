import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import httpdownloaderReducer from '../features/httpdownloader/httpdownloaderSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        httpdownloader: httpdownloaderReducer
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
