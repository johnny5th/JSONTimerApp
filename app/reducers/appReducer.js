import { combineReducers } from 'redux';
import { navReducer } from './navReducer';
import { loginReducer } from './loginReducer';
import { timersReducer } from './timersReducer';

export const appReducer = combineReducers({
  nav: navReducer,
  token: loginReducer,
  timers: timersReducer,
});