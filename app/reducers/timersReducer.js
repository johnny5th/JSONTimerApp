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
  }

  return state;
};