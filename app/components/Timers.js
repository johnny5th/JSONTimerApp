import { config } from '../config';
import React from 'react';
import { StyleSheet, Text, View, FlatList, RefreshControl } from 'react-native';
import PropTypes from 'prop-types';
import {findIndex} from 'lodash';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import TimerListing from './TimerListing';

if (!window.location) {
  // App is running in simulator
  window.navigator.userAgent = 'ReactNative';
}
const io = require('socket.io-client');

class Timers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      socket: null,
      isSwiping: false,
      currentlyOpenItem: null,
    };
  }

  async componentWillMount() {
    await this.getTimers();
    this.setState({socket: this.getSocket(), isLoading: false});
  }

  getSocket() {
    const socket = io.connect(config.api, {
      path: '/api/socket',
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      for(let timer of this.props.timers) {
        socket.emit('authenticate', timer.apiKey);
      }
      console.log('connected');
    });

    socket.on('timer', (timer) => {
      let index = findIndex(this.props.timers, ['apiKey', timer.apiKey]);

      this.props.dispatch({
        type: 'TIMER_UPDATE',
        index: index,
        timer: {
          running: timer.running,
          startTime: timer.startTime,
        },
      });
    });

    socket.on('message', (message) => console.log(message));
    socket.on('error', (message) => console.log(message));
    socket.on('disconnect', (message) => console.log(message));

    return socket;
  }

  getTimers() {
    fetch(config.api + '/api/timer', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.props.token,
        'Accept': 'application/json',
      },
    })
    .then((response)=>{
      if (response.status >= 400 && response.status < 600) {
        return response.text().then(err => {throw new Error(err);});
      }
      return response.json();
    })
    .then((response)=>{
      this.props.dispatch({
        type: 'TIMERS_REPLACE',
        timers: response,
      });
    })
    .catch((error)=>{ console.log(error.message); });
  }

  navigateToTimer(apiKey, name) {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Timer', params: {apiKey: apiKey, title: name}}));
  }

  deleteTimer(apiKey) {
    fetch(config.api + '/api/timer/' + apiKey, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + this.props.token,
        'Accept': 'application/json',
      },
    })
    .then((response)=>{
      if (response.status >= 400 && response.status < 600) {
        return response.text().then(err => {throw new Error(err);});
      }
    })
    .then(()=>{
      let index = findIndex(this.props.timers, ['apiKey', apiKey]);

      this.props.dispatch({
        type: 'TIMER_DELETE',
        index: index,
      });
    })
    .catch((error)=>{ console.log(error.message); });
  }

  editTimer(apiKey) {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'EditTimer', params: {apiKey: apiKey}}));
  }

  _onRefresh() {
    this.setState({isLoading: true});
    this.componentWillMount().then(() => {
      this.setState({isLoading: false});
    });
  }

  closeOpenItem() {
    if (this.state.currentlyOpenItem) {
      this.state.currentlyOpenItem.recenter();
    }
  }

  render() {
    let timers = this.props.timers.map((timer) => {timer.key = timer.apiKey; return timer;});

    return (
      <View style={styles.container}>
        <FlatList
          ItemSeparatorComponent={({highlighted}) => (
            <View style={[styles.separator, highlighted]} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          scrollEnabled={!this.state.isSwiping}
          contentContainerStyle={styles.timerList}
          data={timers}
          onScroll={this.closeOpenItem.bind(this)}
          renderItem={({item}) =>
            <TimerListing
              name={item.name}
              running={item.running}
              onPress={()=>this.navigateToTimer(item.apiKey, item.name)}
              deleteTimer={()=>this.deleteTimer(item.apiKey)}
              editTimer={()=>this.editTimer(item.apiKey)}
              onSwipeStart={() => this.setState({isSwiping: true})}
              onSwipeRelease={() => this.setState({isSwiping: false})}
              onOpen={listItem => {
                if (this.state.currentlyOpenItem && this.state.currentlyOpenItem !== listItem) {
                  this.state.currentlyOpenItem.recenter();
                }

                this.setState({currentlyOpenItem: listItem});
              }}
              onClose={() => this.setState({currentlyOpenItem: null})}
            />
          }
        />
      </View>
    );
  }
}

Timers.propTypes = {
  dispatch: PropTypes.func,
  token: PropTypes.string,
  timers: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = state => ({
  token: state.token,
  timers: state.timers,
});

export default connect(mapStateToProps)(Timers);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timerList: {
    flex: 1,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#c8c7cc',
  },
});