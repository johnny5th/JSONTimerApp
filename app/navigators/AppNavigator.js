import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';
import { connect } from 'react-redux';
import { StackNavigator, NavigationActions } from 'react-navigation';

import Login from '../components/Login';
import Timers from '../components/Timers';
import Timer from '../components/Timer';
import AddTimer from '../components/AddTimer';
import EditTimer from '../components/EditTimer';

export const AppNavigator = StackNavigator({
  Login: {
    screen: Login,
    navigationOptions: () => ({
      title: 'Login',
    }),
  },
  Timers: {
    screen: Timers,
    navigationOptions: ({screenProps}) => ({
      title: 'Timers',
      headerLeft: <Button title='Logout' onPress={screenProps.logout} />,
      headerRight: <AddButton />,
    }),
  },
  Timer: {
    screen: Timer,
  },
  AddTimer: {
    screen: AddTimer,
    navigationOptions: () => ({
      title: 'Add Timer',
    }),
  },
  EditTimer: {
    screen: EditTimer,
    navigationOptions: () => ({
      title: 'Edit Timer',
    }),
  },
});

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