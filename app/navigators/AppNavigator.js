import { StackNavigator } from 'react-navigation';

import Login from '../components/Login';
import Timers from '../components/Timers';
import Timer from '../components/Timer';

export const AppNavigator = StackNavigator({
  Login: {
    screen: Login,
    navigationOptions: ({navigation}) => ({
      title: 'Login',
    }),
  },
  Timers: {
    screen: Timers,
    navigationOptions: ({navigation}) => ({
      title: 'Timers',
      headerLeft: null,
    }),
  },
  Timer: {
    screen: Timer,
  },
});