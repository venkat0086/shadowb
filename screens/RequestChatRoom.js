import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import React, {useContext, useLayoutEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AuthContext} from '../AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {AvenirBold, AvenirRegular, SERVER_HOST} from '../config';

const RequestChatRoom = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const {token, userId, setToken, setUserId} = useContext(AuthContext);
  const route = useRoute();
  useLayoutEffect(() => {
    return navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Ionicons
            onPress={() => {
              navigation.goBack();
            }}
            name="arrow-back"
            size={24}
            color="black"
          />
          <View>
            <Text style={styles.headerName}>{route?.params?.name}</Text>
          </View>
        </View>
      ),
    });
  }, []);
  // console.log('userId', userId);
  // console.log('Rec', route?.params.receiverId);
  const sendMessage = async () => {
    try {
      const userData = {
        senderId: userId,
        receiverId: route?.params?.receiverId,
        message: message,
      };

      const response = await axios.post(`${SERVER_HOST}/sendrequest`, userData);
      if (response.status == 200) {
        setMessage('');
        Alert.alert(
          'Your request has been shared',
          'wait for the user to accept your request',
        );
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#F1EBEB'}}>
      <ScrollView></ScrollView>
      {/* <View style={styles.textInputMainContainer}>
        <Entypo name="emoji-happy" size={24} color="gray" />

        <TextInput
          placeholder="type your message..."
          value={message}
          onChangeText={setMessage}
          style={styles.textInput}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginHorizontal: 8,
          }}>
          <Entypo name="camera" size={24} color="gray" />
        </View>

        <Pressable
          onPress={sendMessage}
          style={{
            backgroundColor: '#0066b2',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
          }}>
          <Text style={{textAlign: 'center', color: 'white'}}>Send</Text>
        </Pressable>
      </View> */}

      <View style={styles.mainChatBox}>
        <View style={styles.chatBarMain}>
          <Entypo name="emoji-happy" size={22} color="gray" />
          <TextInput
            placeholder="Message"
            value={message}
            onChangeText={setMessage}
            style={styles.textInput}
          />
          <View style={styles.textInputEmojiMain}>
            <Entypo name="camera" size={22} color="gray" />
          </View>
        </View>
        <View style={styles.sendBtn}>
          <Pressable onPress={sendMessage} disabled={message?.length === 0}>
            <MaterialIcon name="send" size={20} color="white" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RequestChatRoom;

const styles = StyleSheet.create({
  chatBarMain: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 50,
    flexGrow: 1,
    marginBottom: 10,
    height: 46,
    maxWidth: '89%',
  },

  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    color: 'black',
    fontFamily: AvenirRegular,
  },
  textInputEmojiMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 8,
  },
  sendBtn: {
    backgroundColor: '#24C50E',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
    position: 'absolute',
    right: 0,
    top: 3,
  },
  mainChatBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    marginHorizontal: 4,
  },
  headerName: {color: 'black', fontSize: 15, fontFamily: AvenirBold},
});
