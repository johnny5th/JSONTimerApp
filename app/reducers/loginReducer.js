export const loginReducer = (state = null, action) => {
  switch(action.type) {
    case 'LOGIN': return action.token;
  }

  return state;
};