import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {AuthContext} from '../AuthContext';
import axios from 'axios';
import {AvenirBold, AvenirRegular, SERVER_HOST} from '../config';
import tvImage from '../assets/images/tv_image.jpg';

const Chat = ({item}) => {
  const navigation = useNavigation();
  const {userId} = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const fetchMessages = async () => {
    try {
      const senderId = userId;
      const receiverId = item?._id;
      const response = await axios.get(`${SERVER_HOST}/messages`, {
        params: {senderId, receiverId},
      });
      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMessages();
    }, []),
  );

  const getLastMessage = () => {
    const n = messages.length;
    return messages[n - 1];
  };
  const lastMessage = getLastMessage();
  const imageSource = item?.image ? {uri: item?.image} : tvImage;

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('ChatRoom', {
          name: item?.name,
          receiverId: item?._id,
          image: item?.image,
        })
      }
      style={{marginVertical: 15}}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <Pressable>
          <Image
            source={imageSource}
            style={{width: 40, height: 40, borderRadius: 20}}
          />
        </Pressable>
        <View>
          <Text style={styles.headUserName}>{item?.name}</Text>
          <Text style={styles.headerMsg}>
            {lastMessage
              ? lastMessage.message
              : `Start chat with ${item?.name}`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default Chat;

const styles = StyleSheet.create({
  headUserName: {fontSize: 15, fontFamily: AvenirBold, color: 'black'},
  headerMsg: {marginTop: 4, fontFamily: AvenirRegular, color: '#706C6C'},
});
