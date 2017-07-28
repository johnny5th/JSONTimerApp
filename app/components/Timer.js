import { config } from '../config';
import React from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, FlatList, Modal } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { find, findIndex } from 'lodash';
import update from 'immutability-helper';

import LogEntry from './LogEntry';
import EditLog from './EditLog';

import moment from 'moment';
import 'moment-duration-format';

const NULL_DURATION = '0d 00:00:00.00';


class Timer extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
  });

  constructor(props) {
    super(props);

    this.interval == null;
    this._duration = NULL_DURATION;
    this.timer = find(props.timers, ['apiKey', this.props.navigation.state.params.apiKey]);

    this.state = {
      logs: [],
      totalPages: 0,
      shortTimer: false,
      isSwiping: false,
      currentlyOpenItem: null,
      editModalVisible: false,
      modalData: {},
    };
  }

  componentWillMount() {
    if(this.timer.running) {
      this.startInterval();
    }
    this.getLogs();
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

    this.getLogs();

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
    return moment.duration(moment.utc().diff(time)).format('d[d] hh:mm:ss', { forceLength: true, precision: 2, trim: false });
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

  getLogs() {
    fetch(config.api + '/api/timer/' + this.timer.apiKey + '/log?sortBy=DESC&limit=20', {
      method: 'GET',
      headers: {
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
      this.setState({
        logs: response.logs,
        totalPages: response.totalPages,
      });
    })
    .catch((error)=>{ console.log(error.message); });
  }

  timerLayoutChange(event) {
    let {height} = event.nativeEvent.layout;
    let shortTimer = height < 200;

    if(this.state.shortTimer != shortTimer) {
      this.setState({
        shortTimer: shortTimer,
      });
    }
  }

  deleteLog(id) {
    fetch(config.api + '/api/timer/' + this.timer.apiKey + '/log/' + id, {
      method: 'DELETE',
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

    let index = findIndex(this.state.logs, ['id', id]);

    let logs = update(this.state.logs, {
      $splice: [[index,1]],
    });

    this.setState({
      logs: logs,
    });
  }

  editLog(id) {
    let data = find(this.state.logs, ['id', id]);

    this.setState({
      editModalVisible: true,
      modalData: data,
    });
  }

  editLogCallback(id, description, stopTime) {
    let index = findIndex(this.state.logs, ['id', id]);

    let logs = update(this.state.logs, {
      [index]: {$merge: {
        description: description,
        stopTime: stopTime,
      }},
    });

    this.setState({
      logs: logs,
      editModalVisible: false,
    });
  }

  closeOpenItem() {
    if (this.state.currentlyOpenItem) {
      this.state.currentlyOpenItem.recenter();
    }
  }

  setEditModalVisible(visible) {
    this.setState({editModalVisible: visible});
  }

  render() {
    let logs = this.state.logs.map((log) => {
      log.key = log.id;
      log.logTime = moment.utc(log.startTime).local().calendar();
      log.duration = moment.duration(moment.utc(log.stopTime).diff(moment.utc(log.startTime))).format('d[d,] h[hrs,] m[m,] s[s]', { precision: 2 });
      return log;
    });

    return (
      <View style={styles.container}>
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.editModalVisible}
          onRequestClose={() => {alert('Modal has been closed.');}}
        >
          <EditLog log={this.state.modalData} apiKey={this.timer.apiKey} closeModal={()=>this.setEditModalVisible(false)} editLogCallback={this.editLogCallback.bind(this)} />
        </Modal>

        <View style={(this.state.shortTimer ? styles.timerWrapperShort : styles.timerWrapper)} onLayout={(event) => {this.timerLayoutChange(event)}}>
          <Text style={StyleSheet.flatten([styles.status, {color: (this.timer.running) ? 'green' : 'red'}])}>{this.timer.running ? 'Running' : 'Stopped'}</Text>

          <TextInput style={styles.duration} ref={component => this._duration = component} editable={false} defaultValue={NULL_DURATION} />

          <Button style={styles.button} title={this.timer.running ? 'Stop' : 'Start'} onPress={this.toggleTimer.bind(this)} />
        </View>
        <View style={styles.logList}>
          <Text style={styles.logListTitle}>Recent Entries</Text>
          <FlatList
            data={logs}
            scrollEnabled={!this.state.isSwiping}
            onScroll={this.closeOpenItem.bind(this)}
            renderItem={({item, index}) =>
              <LogEntry
                style={{ backgroundColor: (index % 2 == 0 ? '#f1f1f1' : 'transparent') }}
                logTime={item.logTime}
                duration={item.duration}
                description={item.description}
                deleteLog={()=>this.deleteLog(item.id)}
                editLog={()=>this.editLog(item.id)}
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
  },
  timerWrapper: {
    flex: 4,
    display: 'flex',
    justifyContent: 'space-around',
  },
  timerWrapperShort: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  status: {
    fontSize: 22,
    paddingTop: 5,
    textAlign: 'center',
  },
  duration: {
    fontSize: 38,
    width: 280,
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: (Platform.OS === 'ios') ? 'HelveticaNeue-Light' : 'monospace',
  },
  button: {
    fontSize: 22,
  },
  logList: {
    flex: 5,
  },
  logListTitle: {
    fontSize: 16,
    marginLeft: 30,
    marginBottom: 10,
    color: '#79787f',
  },
});
