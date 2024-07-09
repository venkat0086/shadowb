import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {AvenirBold, AvenirRegular} from '../config';
import tvImage from '../assets/images/tv_image.jpg';

const User = ({item}) => {
  const navigation = useNavigation();
  const imageSource = item?.image ? {uri: item?.image} : tvImage;

  return (
    <View style={{padding: 10, marginTop: 10}}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <Pressable>
          <Image
            source={imageSource}
            style={{width: 40, height: 40, borderRadius: 20}}
          />
        </Pressable>

        <View style={{flex: 1}}>
          <Text style={styles.nameText}>{item?.name}</Text>
          <Text style={styles.nameText}>{item?.email}</Text>
        </View>

        <Pressable
          onPress={() =>
            navigation.navigate('Request', {
              name: item?.name,
              receiverId: item?._id,
            })
          }
          style={styles.chatBtn}>
          <Text style={styles.btnText}>Chat</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  chatBtn: {
    padding: 10,
    width: 80,
    backgroundColor: '#005187',
    borderRadius: 4,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontFamily: AvenirBold,
  },
  nameText: {fontFamily: AvenirRegular, color: 'black'},
});
