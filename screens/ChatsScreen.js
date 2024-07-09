import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../AuthContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
// import 'core-js/stable/atob';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import Chat from '../components/Chat';
import {AvenirBold, AvenirRegular, SERVER_HOST} from '../config';
import tvImage from '../assets/images/tv_image.jpg';

const ChatsScreen = () => {
  const [options, setOptions] = useState(['Chats']);
  const [chats, setChats] = useState([]);
  const [requests, setRequests] = useState([]);
  const {token, setToken, setUserId, userId} = useContext(AuthContext);
  const chooseOption = option => {
    if (options.includes(option)) {
      console.log(options);
      setOptions(options.filter(c => c !== option));
    } else {
      setOptions([...options, option]);
    }
  };
  const navigation = useNavigation();
  const logout = () => {
    clearAuthToken();
  };
  const filterNonDuplicatedById = items => {
    const idCounts = {};
    const uniqueDuplicatedItems = [];
    items.forEach(item => {
      idCounts[item?._id] = (idCounts[item?._id] || 0) + 1;
    });
    const seenIds = new Set();
    items.forEach(item => {
      if (idCounts[item?._id] > 1 && !seenIds.has(item?._id)) {
        uniqueDuplicatedItems.push(item);
        seenIds.add(item?._id);
      }
    });
    return uniqueDuplicatedItems;
  };
  const clearAuthToken = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setToken('');
      navigation.replace('Login');
    } catch (error) {
      console.log('Error', error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken = jwtDecode(token);
      setToken(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);
  useEffect(() => {
    if (userId) {
      getrequests();
    }
  }, [userId]);
  useEffect(() => {
    if (userId) {
      getUser();
    }
  }, [userId]);
  const getrequests = async () => {
    try {
      const response = await axios.get(`${SERVER_HOST}/getrequests/${userId}`);
      setRequests(response.data);
    } catch (error) {
      console.log('error', error);
    }
  };
  // console.log(requests);
  const acceptRequest = async requestId => {
    try {
      const response = await axios.post(`${SERVER_HOST}/acceptrequest`, {
        userId: userId,
        requestId: requestId,
      });

      if (response.status == 200) {
        await getrequests();
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const getUser = async () => {
    try {
      const response = await axios.get(`${SERVER_HOST}/user/${userId}`);
      if (response?.data?.length > 0) {
        const filteredData = filterNonDuplicatedById(response?.data);
        setChats(filteredData);
      }
    } catch (error) {
      console.log('Error fetching user', error);
      throw error;
    }
  };

  const imageSource = item => {
    const source = item?.image ? {uri: item?.image} : tvImage;
    return source;
  };

  // console.log('users', chats);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.mainHeader}>
        <Pressable onPress={logout}>
          <Image
            style={{width: 35, height: 35, borderRadius: 15}}
            source={tvImage}
          />
        </Pressable>
        <Text style={styles.chatsText}>Chats</Text>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <AntDesign name="camerao" size={26} color="black" />
            <MaterialIcons
              onPress={() => navigation.navigate('People')}
              name="person-outline"
              size={26}
              color="black"
            />
          </View>
        </View>
      </View>

      <View style={{padding: 10}}>
        <Pressable
          onPress={() => chooseOption('Chats')}
          style={styles.chatSection}>
          <View>
            <Text style={styles.subHeaderText}>Chats</Text>
          </View>
          <Entypo name="chevron-small-down" size={26} color="black" />
        </Pressable>

        <View>
          {options?.includes('Chats') &&
            (chats?.length > 0 ? (
              <View>
                {chats?.map((item, index) => (
                  <Chat item={item} key={item?._id} />
                ))}
              </View>
            ) : (
              <View style={styles.noChatsContent}>
                <View>
                  <Text style={styles.noChatText}>No Chats yet</Text>
                  <Text style={styles.getStarted}>
                    Get started by nessaging a friend
                  </Text>
                </View>
              </View>
            ))}
        </View>

        <Pressable
          onPress={() => chooseOption('Requests')}
          style={styles.requestMain}>
          <View>
            <Text style={styles.subHeaderText}>Requests</Text>
          </View>
          <Entypo name="chevron-small-down" size={26} color="black" />
        </Pressable>

        <View style={{marginVertical: 12}}>
          {options?.includes('Requests') && (
            <View>
              <Text style={styles.checkoutText}>Checkout all the requests</Text>
              {requests?.map((item, index) => (
                <Pressable key={index} style={{marginVertical: 12}}>
                  <View style={styles.requestList}>
                    <Pressable>
                      <Image
                        source={imageSource(item?.from)}
                        style={{width: 40, height: 40, borderRadius: 20}}
                      />
                    </Pressable>
                    <View style={{flex: 1}}>
                      <Text style={styles.requestListName}>
                        {item?.from?.name}
                      </Text>
                      <Text style={styles.requestListMsg}>{item?.message}</Text>
                    </View>
                    <Pressable
                      onPress={() => acceptRequest(item?.from?._id)}
                      style={styles.requestBtn}>
                      <Text style={styles.acceptBtn}>Accept</Text>
                    </Pressable>
                    <AntDesign name="delete" size={26} color="red" />
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  mainHeader: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
  },
  chatsText: {fontSize: 15, fontFamily: AvenirBold},
  chatSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noChatsContent: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChatText: {
    textAlign: 'center',
    color: 'gray',
    fontFamily: AvenirRegular,
  },
  getStarted: {marginTop: 4, color: 'gray', fontFamily: AvenirRegular},
  requestMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkoutText: {fontSize: 15, fontFamily: AvenirBold},
  subHeaderText: {fontFamily: AvenirBold, color: 'black'},
  requestList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  requestListName: {fontSize: 15, fontFamily: AvenirBold, color: 'black'},
  requestListMsg: {marginTop: 4, color: 'gray', fontFamily: AvenirRegular},
  requestBtn: {
    padding: 8,
    backgroundColor: '#005187',
    width: 75,
    borderRadius: 5,
  },
  acceptBtn: {
    fontSize: 13,
    textAlign: 'center',
    color: 'white',
    fontFamily: AvenirBold,
  },
});
