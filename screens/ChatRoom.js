import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {AuthContext} from '../AuthContext';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import {useSocketContext} from '../SocketContext';
import {AvenirBold, AvenirRegular, SERVER_HOST} from '../config';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const ChatRoom = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const {token, userId, setToken, setUserId} = useContext(AuthContext);
  const {socket} = useSocketContext();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);
  const scrollViewRef = useRef();
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
            size={22}
            color="black"
          />
          <View>
            <Text style={styles.headerName}>{route?.params?.name}</Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <Pressable
          style={{padding: 8}}
          onPress={async () => {
            await fetchMessages(true);
          }}>
          <Ionicons
            onPress={async () => {
              await fetchMessages(true);
            }}
            size={22}
            color="black"
            name="refresh-circle-outline"
          />
        </Pressable>
      ),
    });
  }, []);
  const listeMessages = () => {
    const {socket} = useSocketContext();

    useEffect(() => {
      socket?.on('newMessage', newMessage => {
        newMessage.shouldShake = true;
        setMessages([...messages, newMessage]);
      });

      return () => socket?.off('newMessage');
    }, [socket, messages, setMessages]);
  };

  listeMessages();
  const sendMessage = async (senderId, receiverId) => {
    setLoading(true);
    try {
      await axios.post(`${SERVER_HOST}/sendMessage`, {
        senderId,
        receiverId,
        message,
      });
      socket.emit('sendMessage', {senderId, receiverId, message});
      setMessage('');
      setTimeout(() => {
        fetchMessages();
      }, 100);
    } catch (error) {
      console.log('Error', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchMessages = async (initial = false) => {
    try {
      if (initial) {
        setMainLoading(true);
      }
      const senderId = userId;
      const receiverId = route?.params?.receiverId;
      const response = await axios.get(`${SERVER_HOST}/messages`, {
        params: {senderId, receiverId},
      });

      setMessages(response.data);
    } catch (error) {
      console.log('Error', error);
    } finally {
      if (initial) {
        setMainLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchMessages(true);
  }, []);
  // console.log('messages', messages);
  const formatTime = time => {
    const options = {hour: 'numeric', minute: 'numeric'};
    return new Date(time).toLocaleString('en-US', options);
  };
  return (
    <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#F1EBEB'}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd()}>
        {mainLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator color="black" />
          </View>
        ) : (
          messages?.map((item, index) => {
            return (
              <Pressable
                style={[
                  item?.senderId?._id === userId
                    ? styles.senderStyle
                    : styles.receiverStyle,
                ]}>
                <View
                  style={
                    item?.senderId?._id === userId
                      ? styles.senderTriangle
                      : styles.receiverTriangle
                  }
                />
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                  <Text style={styles.messageText}>{item?.message}</Text>
                  <Text style={styles.timeText}>
                    {formatTime(item?.timeStamp)}
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>

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
        <Pressable
          style={styles.sendBtn}
          onPress={() => sendMessage(userId, route?.params?.receiverId)}
          disabled={message?.length === 0}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <MaterialIcon name="send" size={20} color="white" />
          )}
        </Pressable>
        {/* </View> */}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  senderStyle: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 8,
    maxWidth: '60%',
    borderRadius: 7,
    margin: 10,
    position: 'relative',
    borderTopRightRadius: 0,
  },
  receiverStyle: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    padding: 8,
    margin: 10,
    borderRadius: 7,
    maxWidth: '60%',
    position: 'relative',
    borderTopLeftRadius: 0,
  },
  headerName: {color: 'black', fontSize: 15, fontFamily: AvenirBold},
  messageText: {
    fontSize: 14,
    textAlign: 'left',
    fontFamily: AvenirRegular,
    color: 'black',
    marginRight: 4,
    flexShrink: 1,
  },
  timeText: {
    textAlign: 'right',
    fontSize: 9,
    color: 'gray',
    marginTop: 4,
  },
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
  senderTriangle: {
    position: 'absolute',
    right: -10,
    top: 0,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderBottomWidth: 0,
    borderTopColor: '#DCF8C6',
  },
  receiverTriangle: {
    position: 'absolute',
    left: -10,
    top: 0,
    width: 0,
    height: 0,
    borderRightWidth: 10,
    borderLeftColor: 'transparent',
    borderLeftWidth: 0,
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    borderRightColor: 'white',
  },
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
