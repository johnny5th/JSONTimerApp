import { config } from '../config';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {findIndex, find} from 'lodash';
import { NavigationActions } from 'react-navigation';

class EditTimer extends React.Component {

  constructor(props) {
    super(props);

    this.timer = find(props.timers, ['apiKey', this.props.navigation.state.params.apiKey]);

    this.state = {
      name: null,
    };
  }

  editTimer() {
    fetch(config.api + '/api/timer/' + this.timer.apiKey, {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + this.props.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.name,
      }),
    })
    .then((response)=>{
      if (response.status >= 400 && response.status < 600) {
        return response.text().then(err => {throw new Error(err);});
      }
      return response.json();
    })
    .then(()=>{
      let index = findIndex(this.props.timers, ['apiKey', this.timer.apiKey]);

      this.props.dispatch({
        type: 'TIMER_EDIT',
        index: index,
        name: this.state.name,
      });
      this.props.dispatch(NavigationActions.navigate({ routeName: 'Timers' }));
    })
    .catch((error)=>{ console.log(error.message); });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Edit Timer</Text>
        <Text style={styles.label}>Name</Text>
        <TextInput onSubmitEditing={this.editTimer.bind(this)} returnKeyType='go' style={styles.input} onChangeText={(text) => this.setState({name: text})} defaultValue={this.timer.name} />
        <View style={{marginTop: 20}}><Button onPress={this.editTimer.bind(this)} title='Edit Timer' /></View>
      </View>
    );
  }
}

EditTimer.propTypes = {
  dispatch: PropTypes.func,
  token: PropTypes.string,
  navigation: PropTypes.object,
  timers: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = state => ({
  token: state.token,
  timers: state.timers,
});

export default connect(mapStateToProps)(EditTimer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: '10%',
    marginRight: '10%',
    maxHeight: '80%',
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
  },
  input: {
    borderWidth: 1,
    height: 40,
    padding: 5,
  },
});