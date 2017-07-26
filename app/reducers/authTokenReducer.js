export const authTokenReducer = (state = null, action) => {
  switch(action.type) {
    case 'LOGIN': return action.token;
    case 'LOGOUT': return null;
  }

  return state;
};