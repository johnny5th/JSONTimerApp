import { config } from '../config';
import React from 'react';
import { Platform, StyleSheet, Text, TextInput, View, Button, Picker } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import update from 'immutability-helper';
import { range } from 'lodash';

export default class EditLog extends React.Component {
  constructor(props) {
    super(props);

    let duration = moment.duration(moment(props.log.stopTime).diff(moment(props.log.startTime)));

    this.state = {
      description: props.log.description,
      showPicker: false,
      pickerType: null,
      pickerValue: null,
      duration: {
        days: duration.days(),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    let duration = moment.duration(moment(nextProps.log.stopTime).diff(moment(nextProps.log.startTime)));

    this.setState({
      description: nextProps.log.description,
      duration: {
        days: duration.days(),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      },
    });
  }

  onPickerUpdate(type, value) {
    this.setState({
      duration: update(this.state.duration, {[type]: {$set: value}}),
      pickerValue: value,
    });
  }

  editLog() {
    let stopTime = moment.utc(this.props.log.startTime).add(moment.duration(this.state.duration)).format('YYYY-MM-DD HH:mm:ss.SSS');
console.log(this.props.log.startTime, stopTime, this.state.duration, moment.duration(this.state.duration));
    fetch(config.api + '/api/timer/' + this.props.apiKey + '/log/' + this.props.log.id, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: this.state.description,
        stopTime: stopTime,
      }),
    })
    .then((response)=>{
      if (response.status >= 400 && response.status < 600) {
        return response.text().then(err => {throw new Error(err);});
      }
    })
    .then(()=>{
      this.props.editLogCallback(this.props.log.id, this.state.description, stopTime);
    })
    .catch((error)=>{ console.log(error.message); });
  }

  render() {
    let pickerItems = {
      days: range(30).map((item) => <Picker.Item key={item} label={`${item}`} value={item} />),
      hours: range(24).map((item) => <Picker.Item key={item} label={`${item}`} value={item} />),
      minutes: range(60).map((item) => <Picker.Item key={item} label={`${item}`} value={item} />),
      seconds: range(60).map((item) => <Picker.Item key={item} label={`${item}`} value={item} />),
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Edit Time Log</Text>
        <Text style={styles.label}>Description</Text>
        <TextInput returnKeyType='done' style={styles.input} onChangeText={(text) => this.setState({description: text})} value={this.state.description} />
        <Text style={styles.label}>Duration</Text>

        <View style={styles.durationWrapper}>
          <View style={styles.durationValueWrapper}>
            <Text style={styles.durationValueLabel}>Days</Text>
              <Picker
                style={styles.picker}
                selectedValue={this.state.duration.days}
                onValueChange={(itemValue) => this.onPickerUpdate('days', itemValue)}
                itemStyle={styles.pickerItem} >
                {pickerItems.days}
              </Picker>
          </View>

          <View style={styles.durationValueWrapper}>
            <Text style={styles.durationValueLabel}>Hrs</Text>
              <Picker
                style={styles.picker}
                selectedValue={this.state.duration.hours}
                onValueChange={(itemValue) => this.onPickerUpdate('hours', itemValue)}
                itemStyle={styles.pickerItem} >
                {pickerItems.hours}
              </Picker>
          </View>

          <View style={styles.durationValueWrapper}>
            <Text style={styles.durationValueLabel}>Mins</Text>
              <Picker
                style={styles.picker}
                selectedValue={this.state.duration.minutes}
                onValueChange={(itemValue) => this.onPickerUpdate('minutes', itemValue)}
                itemStyle={styles.pickerItem} >
                {pickerItems.minutes}
              </Picker>
          </View>

          <View style={styles.durationValueWrapper}>
            <Text style={styles.durationValueLabel}>Secs</Text>
              <Picker
                style={styles.picker}
                selectedValue={this.state.duration.seconds}
                onValueChange={(itemValue) => this.onPickerUpdate('seconds', itemValue)}
                itemStyle={styles.pickerItem} >
                {pickerItems.seconds}
              </Picker>
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <Button onPress={this.props.closeModal} title='Cancel' />
          <Button onPress={this.editLog.bind(this)} title='Edit Log' />
        </View>
      </View>
    );
  }

}

EditLog.propTypes = {
  log: PropTypes.object,
  apiKey: PropTypes.string,
  closeModal: PropTypes.func,
  editLogCallback: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: '10%',
    marginRight: '10%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    textAlign: 'left',
    marginTop: 20,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    height: 40,
    padding: 5,
  },
  durationWrapper: {
    flexDirection: 'row',
    marginTop: 20,
  },
  durationValueWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  picker: {
    width: (Platform.OS === 'ios') ? '100%' : 85,
    height: (Platform.OS === 'ios') ? 200 : 50,
    marginHorizontal: (Platform.OS === 'ios') ? 0 : 5,
  },
  pickerItem: {
  },
  buttonWrapper: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});