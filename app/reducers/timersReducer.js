import update from 'immutability-helper';

export const timersReducer = (state = [], action) => {
  switch(action.type) {
    case 'TIMERS_REPLACE': return action.timers;
    case 'TIMER_UPDATE': return update(state, {
      [action.index]: {$merge: {
        running: action.timer.running,
        startTime: action.timer.startTime,
      }},
    });
    case 'TIMER_EDIT': return update(state, {
      [action.index]: {$merge: {
        name: action.name,
      }},
    });
    case 'TIMER_DELETE': return update(state, {
      $splice: [[action.index,1]],
    });
  }

  return state;
};