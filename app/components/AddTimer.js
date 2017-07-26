import { config } from '../config';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

class AddTimer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: null,
    };
  }

  addTimer() {
    fetch(config.api + '/api/timer', {
      method: 'POST',
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
    .then((response)=>{
      this.props.dispatch({
        type: 'TIMER_ADD',
        timer: response,
      });
      this.props.dispatch(NavigationActions.navigate({ routeName: 'Timers' }));
    })
    .catch((error)=>{ console.log(error.message); });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Add a Timer</Text>
        <Text style={styles.label}>Name</Text>
        <TextInput onSubmitEditing={this.addTimer.bind(this)} returnKeyType='go' style={styles.input} onChangeText={(text) => this.setState({name: text})} />
        <View style={{marginTop: 20}}><Button onPress={this.addTimer.bind(this)} title='Add Timer' /></View>
      </View>
    );
  }
}

AddTimer.propTypes = {
  dispatch: PropTypes.func,
  token: PropTypes.string,
};

const mapStateToProps = state => ({
  token: state.token,
});

export default connect(mapStateToProps)(AddTimer);

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