import { combineReducers } from 'redux';
import { navReducer } from './navReducer';
import { authTokenReducer } from './authTokenReducer';
import { timersReducer } from './timersReducer';

export const appReducer = combineReducers({
  nav: navReducer,
  token: authTokenReducer,
  timers: timersReducer,
});