import React from 'react';
import { Platform, StyleSheet, Text, View, TouchableHighlight, Alert } from 'react-native';
import PropTypes from 'prop-types';
import Swipeable from 'react-native-swipeable';
import { MaterialIcons } from '@expo/vector-icons';

export default class LogEntry extends React.Component {
  constructor(props) {
    super(props);
    this.swipeable = null;
  }

  recenter() {
    if (this.swipeable) {
      this.swipeable.recenter();
    }
  }

  deleteLog() {
    Alert.alert(
      'Delete Log Entry',
      'Are you sure you want to delete this log entry?',
      [
        {text: 'No', onPress: () => this.recenter(), style: 'cancel'},
        {text: 'Yes', onPress: this.props.deleteLog, style: 'destructive'},
      ],
      { cancelable: false }
    );
  }

  editLog() {
    this.recenter();
    this.props.editLog();
  }

  render() {
    return (
      <Swipeable
      onRef={ref => this.swipeable = ref}
      rightButtons={rightButtons(this.deleteLog.bind(this), this.editLog.bind(this))}
      onSwipeStart={this.props.onSwipeStart}
      onSwipeRelease={this.props.onSwipeRelease}
      onRightButtonsOpenRelease={() => this.props.onOpen(this)}
      onRightButtonsCloseRelease={() => this.props.onClose(this)}>
        <View style={StyleSheet.flatten([styles.logEntry, this.props.style])}>
          <Text style={styles.logDuration}>{this.props.duration}</Text>
          <Text style={styles.logTime}>{this.props.logTime}</Text>
          { this.props.description != '' && <Text style={styles.logDescription}>{this.props.description}</Text>}
        </View>
      </Swipeable>
    );
  }
}

LogEntry.propTypes ={
  logTime: PropTypes.string,
  duration: PropTypes.string,
  description: PropTypes.string,
  style: PropTypes.object,
  deleteLog: PropTypes.func,
  editLog: PropTypes.func,
  onSwipeStart: PropTypes.func,
  onSwipeRelease: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};

const styles = StyleSheet.create({
  logEntry: {
    paddingHorizontal: 30,
    paddingVertical: 8,
  },
  logDuration: {
    flex: 1,
    fontSize: 22,
    marginBottom: 4,
    fontFamily: (Platform.OS === 'ios') ? 'HelveticaNeue-Light' : 'monospace',
  },
  logTime: {
    flex: 1,
    color: '#79787f',
  },
  logDescription: {
    flex: 1,
    marginTop: 5,
    fontStyle: 'italic',
    color: '#79787f',
  },
  swipeButtonEdit: {
    backgroundColor: 'green',
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 23,
  },
  swipeButtonDelete: {
    backgroundColor: 'red',
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 23,
  },
});

const rightButtons = (deleteLog, editLog) => [
  <TouchableHighlight onPress={deleteLog} style={styles.swipeButtonDelete} key={2}><MaterialIcons name="delete" size={28} color="white" /></TouchableHighlight>,
  <TouchableHighlight onPress={editLog} style={styles.swipeButtonEdit} key={1}><MaterialIcons name="edit" size={28} color="white" /></TouchableHighlight>,
];