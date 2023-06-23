import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import userReducer from './userSlice';
import basketReducer from './basketSlice';
// @ts-ignore
import { DEVELOPMENT } from '@env';

const logger = createLogger();

const rootReducer = combineReducers({
  user: userReducer,
  basket: basketReducer,
});

const initialState = {};

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => {
    const middleware = getDefaultMiddleware();
    if (DEVELOPMENT === 'true') middleware.concat(logger);
    return middleware;
  },
  devTools: DEVELOPMENT === 'true',
  preloadedState: initialState,
  enhancers: defaultEnhancers => [...defaultEnhancers],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
