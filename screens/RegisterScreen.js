import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {AvenirBold, AvenirRegular, SERVER_HOST} from '../config';
import axios from 'axios';

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const handleRegister = () => {
    setLoading(true);
    const user = {
      name: name,
      email: email,
      password: password,
      image: image,
    };
    axios
      .post(`${SERVER_HOST}/register`, user)
      .then(response => {
        // console.log(response);
        Alert.alert(
          'Registration succesfull',
          'You have been registered succesfully!',
        );
        setName('');
        setEmail('');
        setPassword('');
        setImage('');
        navigation.navigate('Login');
      })
      .catch(error => {
        Alert.alert(
          'Registration error',
          'An error ocurred while registering!',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{padding: 10, alignItems: 'center'}}>
          <KeyboardAvoidingView>
            <View style={styles.headerTxt}>
              <Text style={{fontSize: 20, fontFamily: AvenirBold}}>
                Set up your profile
              </Text>
              <Text style={styles.subHeading}>
                Profiles are visible to your friends and connections and groups
              </Text>

              <Pressable style={{marginTop: 20}}>
                <Image
                  source={{
                    uri: image
                      ? image
                      : 'https://cdn-icons-png.flaticon.com/128/149/149071.png',
                  }}
                  style={{width: 50, height: 50, borderRadius: 25}}
                />
                <Text style={styles.addText}>Add</Text>
              </Pressable>
            </View>

            <View style={{marginTop: 30}}>
              <View>
                <Text style={{fontSize: 18, fontWeight: '600', color: 'gray'}}>
                  Name
                </Text>
                <View>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#BEBEBE"
                    style={styles.inputText}
                    placeholder="Enter your name"
                  />
                </View>

                <Text style={styles.labelText}>Email</Text>
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

                <Text style={styles.labelText}>Image</Text>
                <View>
                  <TextInput
                    value={image}
                    onChangeText={setImage}
                    placeholderTextColor="#BEBEBE"
                    style={styles.inputText}
                    placeholder="Enter your image url"
                  />
                </View>
              </View>

              <Pressable onPress={handleRegister} style={styles.regBtn}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.btnText}>Register</Text>
                )}
              </Pressable>

              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>
                  Already have an account? Sign In
                </Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  headerTxt: {
    marginTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeading: {
    marginTop: 10,
    color: 'gray',
    textAlign: 'center',
    marginHorizontal: 12,
    fontFamily: AvenirRegular,
  },
  addText: {
    textAlign: 'center',
    marginTop: 4,
    color: 'gray',
    fontSize: 12,
    fontFamily: AvenirRegular,
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
    fontFamily: AvenirBold,
    color: 'gray',
    marginTop: 25,
  },
  regBtn: {
    width: 200,
    backgroundColor: '#4A55A2',
    padding: 15,
    marginTop: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 6,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontFamily: AvenirBold,
    textAlign: 'center',
  },
  loginText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
    margin: 12,
    fontFamily: AvenirBold,
  },
});
