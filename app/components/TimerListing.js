import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';

export default class TimerListing extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>{this.props.name}</Text>
        <Text style={StyleSheet.flatten([styles.status, {color: (this.props.running) ? 'green' : 'red'}])}>{this.props.running ? 'Running' : 'Stopped'}</Text>
      </View>
    );
  }
}

TimerListing.propTypes = {
  name: PropTypes.string,
  running: PropTypes.bool,
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
});