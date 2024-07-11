import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {AvenirBold, AvenirRegular, SERVER_HOST} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../AuthContext';
import axios from 'axios';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const {token, setToken} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (token) {
      navigation.replace('MainStack', {screen: 'Main'});
    }
  }, [token, navigation]);
  const handleLogin = () => {
    setLoading(true);
    const user = {
      email: email,
      password: password,
    };
    axios
      .post(`${SERVER_HOST}/login`, user)
      .then(response => {
        const token = response?.data?.token;
        // console.log('token', token);
        AsyncStorage.setItem('authToken', token);
        setToken(token);
      })
      .catch(error => {
        Alert.alert('Login error', 'Login Failed.!');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{padding: 10, alignItems: 'center'}}>
        <KeyboardAvoidingView>
          <View style={styles.loginHeader}>
            <Text style={{fontSize: 20, fontFamily: AvenirBold}}>
              Login to your account
            </Text>
          </View>

          <View style={{marginTop: 50}}>
            <View>
              <Text
                style={{fontSize: 18, fontFamily: AvenirBold, color: 'gray'}}>
                Email
              </Text>
              <View>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#BEBEBE"
                  style={styles.inputText}
                  placeholder="Enter your email"
                />
              </View>

              <Text style={styles.labelText}>Password</Text>
              <View>
                <TextInput
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#BEBEBE"
                  style={styles.inputText}
                  placeholder="Enter your password"
                />
              </View>
            </View>

            <Pressable onPress={handleLogin} style={styles.loginBtn}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginBtnText}>Login</Text>
              )}
            </Pressable>

            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signUpAcc}>
                Don't have an account? Sign Up
              </Text>
            </Pressable>
          </View>

          <View style={styles.imageView}>
            <Image
              style={{width: 140, height: 170}}
              source={{
                uri: 'https://signal.org/assets/images/features/Media.png',
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  loginHeader: {
    marginTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputText: {
    width: 340,
    marginTop: 5,
    borderBottomColor: '#BEBEBE',
    borderBottomWidth: 1,
    paddingBottom: 10,
    fontFamily: AvenirRegular,
    fontSize: 15,
    color: 'black',
  },
  labelText: {
    fontSize: 18,
    color: 'gray',
    marginTop: 25,
    fontFamily: AvenirBold,
  },
  loginBtn: {
    width: 200,
    backgroundColor: '#4A55A2',
    padding: 15,
    marginTop: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 6,
  },
  loginBtnText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: AvenirBold,
  },
  signUpAcc: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
    margin: 12,
    fontFamily: AvenirBold,
  },
  imageView: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
