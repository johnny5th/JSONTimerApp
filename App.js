import { config } from './app/config';
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
          this.props.dispatch(NavigationActions.navigate({ routeName: 'Timers' }));
          return;
        }
      }

      return this.props.dispatch(NavigationActions.navigate({ routeName: 'Login' }));
    } catch (error) {
      console.log(error);
    }
  }

  login(email, password, cb) {
    fetch(config.api + '/api/auth', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
    .then((response)=>{
      if (response.status >= 400 && response.status < 600) {
        return response.text().then(err => {throw new Error(err);});
      }
      return response.json();
    })
    .then((response)=>{
      AsyncStorage.setItem('@JSONTimer:token', response.token);
      this.props.dispatch({
        type: 'LOGIN',
        token: response.token,
      });
      this.props.dispatch(NavigationActions.navigate({ routeName: 'Timers' }));

      return cb();
    })
    .catch((error)=>{ cb(error.message); });
  }

  logout() {
    AsyncStorage.removeItem('@JSONTimer:token');
    this.props.dispatch({
      type: 'LOGOUT',
    });

    this.props.dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login'}),
      ],
    }));
  }

  render() {
    return (
      <AppNavigator navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.nav,
      })} screenProps={{login: this.login.bind(this), logout: this.logout.bind(this)}} />
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