import { config } from '../config';
import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, AsyncStorage, Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Prompt from 'react-native-prompt';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      password: null,
      error: null,
      forgotPromptVisible: false,
    };
  }

  login() {
    this.setState({
      error: null,
    });

    fetch(config.api + '/api/auth', {
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

  forgot(email) {
    this.setState({
      forgotPromptVisible: false,
      error: null,
    });

    fetch(config.api + '/api/user/forgotpassword', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    })
    .then((response)=>{
      if (response.status >= 400 && response.status < 600) {
        return response.text().then(err => {throw new Error(err);});
      }
    })
    .then(()=>{
      Alert.alert(
        'Forgot Password',
        'Please check your email and follow instructions to reset your password.',
      );
    })
    .catch((error)=>{ this.setState({error: error.message}); });
  }

  render() {

    let error = this.state.error ? <Text style={styles.error}>{this.state.error}</Text> : null;

    return (
      <View style={styles.container}>
        <Prompt
          title='Forgot Password'
          placeholder='Email Address'
          visible={ this.state.forgotPromptVisible }
          onCancel={ () => this.setState({
            forgotPromptVisible: false,
          }) }
          onSubmit={ (value) => this.forgot(value)}
        />
        <Text style={styles.title}>Login to JSONTimer</Text>
        {error}

        <Text style={styles.label}>Email</Text>
        <TextInput keyboardType='email-address' onSubmitEditing={()=>{this.password.focus();}} returnKeyType='next' style={styles.input} onChangeText={(text) => this.setState({email: text})} autoCapitalize='none' />

        <Text style={styles.label}>Password</Text>
        <TextInput ref={(c)=>{this.password = c;}} secureTextEntry={true} onSubmitEditing={this.login.bind(this)} returnKeyType='go' style={styles.input} onChangeText={(text) => this.setState({password: text})} />

        <View style={styles.buttonWrapper}>
          <Button onPress={this.login.bind(this)} title='Login' />
          <Button onPress={this.create.bind(this)} title='Create Account' />
          <Button onPress={()=>this.setState({
            forgotPromptVisible: true,
          })} title='Forgot Password' />
        </View>
      </View>
    );
  }
}

Login.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect()(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: '10%',
    marginRight: '10%',
    maxHeight: '90%',
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