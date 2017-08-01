import React from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

import { AppNavigator } from './app/navigators/AppNavigator';
import { appReducer } from './app/reducers/appReducer';

// Redux Store
const store = createStore(appReducer);

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    // Get token from asyncstorage, check expiration
    try {
      const token = await AsyncStorage.getItem('@JSONTimer:token');
      if (token !== null) {

        let tokenExpired = moment.unix(jwtDecode(token).exp).isBefore(moment.utc());

        if(!tokenExpired) {
          this.props.dispatch({
            type: 'LOGIN',
            token: token,
          });

          // Reset navigation to timers
          const actionToDispatch = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Timers' })],
          });
          return this.props.dispatch(actionToDispatch);
        }
      }

      // Reset navigation to login
      const actionToDispatch = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })],
      });
      return this.props.dispatch(actionToDispatch);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <AppNavigator navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.nav,
      })}/>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func,
  nav: PropTypes.object,
  token: PropTypes.string,
};

const mapStateToProps = (state) => ({
  nav: state.nav,
  token: state.token,
});
const AppWithNavigationState = connect(mapStateToProps)(App);

export default class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}