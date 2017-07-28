import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Alert } from 'react-native';
import PropTypes from 'prop-types';
import Swipeable from 'react-native-swipeable';
import { MaterialIcons } from '@expo/vector-icons';

export default class TimerListing extends React.Component {
  constructor(props) {
    super(props);
    this.swipeable = null;
  }

  deleteTimer() {
    Alert.alert(
      'Delete Timer',
      'Are you sure you want to delete this timer?',
      [
        {text: 'No', onPress: () => this.recenter(), style: 'cancel'},
        {text: 'Yes', onPress: this.props.deleteTimer, style: 'destructive'},
      ],
      { cancelable: false }
    );
  }

  editTimer() {
    this.recenter();
    this.props.editTimer();
  }

  recenter() {
    if (this.swipeable) {
      this.swipeable.recenter();
    }
  }

  render() {
    return (
      <Swipeable
      onRef={ref => this.swipeable = ref}
      rightButtons={rightButtons(this.deleteTimer.bind(this), this.editTimer.bind(this))}
      onSwipeStart={this.props.onSwipeStart}
      onSwipeRelease={this.props.onSwipeRelease}
      onRightButtonsOpenRelease={() => this.props.onOpen(this)}
      onRightButtonsCloseRelease={() => this.props.onClose(this)}>
        <TouchableOpacity onPress={this.props.onPress}>
          <View style={styles.container}>
            <Text style={styles.name}>{this.props.name}</Text>
            <Text style={StyleSheet.flatten([styles.status, {color: (this.props.running) ? 'green' : 'red'}])}>{this.props.running ? 'Running' : 'Stopped'}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  }
}

TimerListing.propTypes = {
  name: PropTypes.string,
  running: PropTypes.bool,
  onPress: PropTypes.func,
  deleteTimer: PropTypes.func,
  editTimer: PropTypes.func,
  onSwipeStart: PropTypes.func,
  onSwipeRelease: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 55,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 18,
  },
  status: {
    fontSize: 18,
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

const rightButtons = (deleteTimer, editTimer) => [
  <TouchableHighlight onPress={deleteTimer} style={styles.swipeButtonDelete} key={2}><MaterialIcons name="delete" size={28} color="white" /></TouchableHighlight>,
  <TouchableHighlight onPress={editTimer} style={styles.swipeButtonEdit} key={1}><MaterialIcons name="edit" size={28} color="white" /></TouchableHighlight>,
];