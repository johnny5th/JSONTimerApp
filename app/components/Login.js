import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import PropTypes from 'prop-types';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      password: null,
      error: null,
    };
  }

  login() {
    this.props.screenProps.login(this.state.email, this.state.password, (err) => {
      if(err) this.setState({error: err});
    });
  }

  render() {

    let error = this.state.error ? <Text style={styles.error}>{this.state.error}</Text> : null;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login to JSONTimer</Text>
        {error}

        <Text style={styles.label}>Email</Text>
        <TextInput keyboardType='email-address' onSubmitEditing={()=>{this.password.focus();}} returnKeyType='next' style={styles.input} onChangeText={(text) => this.setState({email: text})} autoCapitalize='none' />

        <Text style={styles.label}>Password</Text>
        <TextInput ref={(c)=>{this.password = c;}} secureTextEntry={true} onSubmitEditing={this.login.bind(this)} returnKeyType='go' style={styles.input} onChangeText={(text) => this.setState({password: text})} />

        <View style={{marginTop: 20}}><Button onPress={this.login.bind(this)} title='Login' /></View>
      </View>
    );
  }
}

Login.propTypes = {
  navigation: PropTypes.object,
  screenProps: PropTypes.object,
};

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
});