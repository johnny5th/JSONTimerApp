import React from 'react';
import PropTypes from 'prop-types';
import { Button, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { StackNavigator, NavigationActions } from 'react-navigation';

import SplashScreen from '../components/SplashScreen';
import Login from '../components/Login';
import Timers from '../components/Timers';
import Timer from '../components/Timer';
import AddTimer from '../components/AddTimer';
import EditTimer from '../components/EditTimer';

export const AppNavigator = StackNavigator({
  SplashScreen: {
    screen: SplashScreen,
    navigationOptions: () => ({
      header: null,
    }),
  },
  Login: {
    screen: Login,
    navigationOptions: () => ({
      header: null,
    }),
  },
  Timers: {
    screen: Timers,
    navigationOptions: ({navigation}) => ({
      title: 'Timers',
      headerLeft: <Button title='Logout' onPress={()=>logout(navigation)} />,
      headerRight: <AddButton />,
      headerTitleStyle: {
        alignSelf:'center',
      },
    }),
  },
  Timer: {
    screen: Timer,
  },
  AddTimer: {
    screen: AddTimer,
    navigationOptions: () => ({
      title: 'Add Timer',
      headerTitleStyle: {
        alignSelf:'center',
      },
    }),
  },
  EditTimer: {
    screen: EditTimer,
    navigationOptions: () => ({
      title: 'Edit Timer',
      headerTitleStyle: {
        alignSelf:'center',
      },
    }),
  },
});

const logout = (navigation) => {
  AsyncStorage.removeItem('@JSONTimer:token');
  navigation.dispatch({
    type: 'LOGOUT',
  });

  navigation.dispatch(NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'Login'}),
    ],
  }));
};

// Add Button
class Add extends React.Component {
  render() {
    return <Button title='Add' onPress={this.props.addTimer} />;
  }
}
Add.propTypes = {
  addTimer: PropTypes.func,
};
const mapDispatch = dispatch => ({
  addTimer: () => {
    dispatch(NavigationActions.navigate({
      routeName: 'AddTimer',
    }));
  },
});
const AddButton = connect(null, mapDispatch)(Add);