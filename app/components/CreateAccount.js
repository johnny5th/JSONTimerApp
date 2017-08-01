import { config } from '../config';
import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class CreateAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      password: null,
      error: null,
      forgotPromptVisible: false,
    };
  }

  create() {
    this.setState({
      error: null,
    });

    fetch(config.api + '/api/user/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
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
    })
    .catch((error)=>{ this.setState({error: error.message}); });
  }

  render() {

    let error = this.state.error ? <Text style={styles.error}>{this.state.error}</Text> : null;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Create JSONTimer Account</Text>
        {error}

        <Text style={styles.label}>Email</Text>
        <TextInput keyboardType='email-address' onSubmitEditing={()=>{this.password.focus();}} returnKeyType='next' style={styles.input} onChangeText={(text) => this.setState({email: text})} autoCapitalize='none' />

        <Text style={styles.label}>Password</Text>
        <TextInput ref={(c)=>{this.password = c;}} secureTextEntry={true} onSubmitEditing={this.create.bind(this)} returnKeyType='go' style={styles.input} onChangeText={(text) => this.setState({password: text})} />

        <View style={styles.buttonWrapper}>
          <Button onPress={this.create.bind(this)} title='Create Account' />
        </View>
      </View>
    );
  }
}

CreateAccount.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect()(CreateAccount);

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
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
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
  buttonWrapper: {
    marginTop: 20,
  },
});