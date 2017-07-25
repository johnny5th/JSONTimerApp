import { config } from '../config';
import React from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {find} from 'lodash';

import moment from 'moment';
import 'moment-duration-format';

const NULL_DURATION = '00:00:00';


class Timer extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
  });

  constructor(props) {
    super(props);

    this.interval == null;
    this._duration = NULL_DURATION;
    this.timer = find(props.timers, ['apiKey', this.props.navigation.state.params.apiKey]);
  }

  componentWillMount() {
    if(this.timer.running) {
      this.startInterval();
    }
  }

  componentWillUnmount() {
    this.stopInterval();
  }

  componentWillReceiveProps(nextProps) {
    let prevTimer = Object.assign({}, find(this.props.timers, ['apiKey', this.props.navigation.state.params.apiKey]));
    let nextTimer = find(nextProps.timers, ['apiKey', this.props.navigation.state.params.apiKey]);

    if(nextTimer != prevTimer) {
      this.timer = nextTimer;
    }

    // Stop current interval
    if(!this.timer.running) {
      this.stopInterval();
      this._duration.setNativeProps({
        text: NULL_DURATION,
      });
    } else {
      this.startInterval();
    }
  }

  startInterval() {
    console.log('start interval');
    if(this.interval != null) {
      this.stopInterval();
    }

    this.interval = setInterval( () => {
      this._duration.setNativeProps({
        text: this.getDuration(this.timer.startTime),
      });
    }, 50);
  }

  stopInterval() {
    console.log('stop interval');
    clearInterval(this.interval);
  }

  getDuration(time) {
    return moment.duration(moment.utc().diff(time)).format('d[d] hh:mm:ss', { forceLength: true, precision: 2 });
  }

  toggleTimer() {
    let action = this.timer.running ? 'stop' : 'start';

    fetch(config.api + '/api/timer/' + this.timer.apiKey + '/' + action, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then((response)=>{
      if (response.status >= 400 && response.status < 600) {
        return response.text().then(err => {throw new Error(err);});
      }
    })
    .catch((error)=>{ console.log(error.message); });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={StyleSheet.flatten([styles.status, {color: (this.timer.running) ? 'green' : 'red'}])}>{this.timer.running ? 'Running' : 'Stopped'}</Text>

        <TextInput style={styles.duration} ref={component => this._duration = component} editable={false} defaultValue={NULL_DURATION} />

        <View style={{marginTop: 60}}>
          <Button style={styles.button} title={this.timer.running ? 'Stop' : 'Start'} onPress={this.toggleTimer.bind(this)} />
        </View>
      </View>
    );
  }
}

Timer.propTypes = {
  navigation: PropTypes.object,
  timers: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = state => ({
  timers: state.timers,
});

export default connect(mapStateToProps)(Timer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
    fontSize: 22,
    height: 60,
    textAlign: 'center',
    marginTop: 20,
  },
  duration: {
    fontSize: 32,
    height: 60,
    textAlign: 'center',
    fontFamily: (Platform.OS === 'ios') ? 'HelveticaNeue-Light' : 'monospace',
  },
  button: {
    fontSize: 22,
  },
});