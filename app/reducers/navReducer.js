import { AppNavigator } from '../navigators/AppNavigator';

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('SplashScreen'));

export const navReducer = (state = initialState, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};