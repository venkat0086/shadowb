import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import InstaStory from 'react-native-insta-story';
import {AvenirBold, AvenirMediumBold, AvenirRegular} from '../config';
import tvImage from '../assets/images/tv_image.jpg';

const ProfileScreen = () => {
  const channels = [
    {
      id: '0',
      name: 'Netflix',
      image: 'https://cdn-icons-png.flaticon.com/128/2504/2504929.png',
      text: 'Your in the right place',
      date: '2:45 AM',
    },
    {
      id: '2',
      name: 'Marc Zuckerberg',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHtsQvDUZ3Q90XuFjYvcZ-KVaDhUJcA39u-g&s',
      text: 'Anyone else watching this weekend?',
      date: '2:45 AM',
    },
    {
      id: '0',
      name: 'Indian Cricket Team',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAtic4zkoYA0BmKDTREcuxL0VWVMlP3UqBUg&s',
      text: 'Any guesses who won the Fielding medal for the series',
      date: '1:45 PM',
    },
    {
      id: '3',
      name: 'Cravings',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPcBoRdfwpZXICr6FFLcUDT4c22xCzTVwQj6e9lwQHTo-KZw12rZD_z4u-_595SK_EpU8&usqp=CAU',
      text: 'Fruit Platters are the best',
      date: '2:45 AM',
    },
    {
      id: '5',
      name: 'Royal Challengers Bangalore',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDlVuzjh0-kKm1BbO5qBjeIwelK8r4DvYZ5A&s',
      text: 'We only want it to rain boundaries and wickets for RCB',
      date: '2:45 AM',
    },
  ];
  const data = [
    {
      user_id: 1,
      user_image:
        'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
      user_name: 'Lava',
      stories: [
        {
          story_id: 1,
          story_image:
            'https://image.freepik.com/free-vector/universe-mobile-wallpaper-with-planets_79603-600.jpg',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 1 swiped'),
        },
        {
          story_id: 2,
          story_image:
            'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
        },
      ],
    },
    {
      user_id: 2,
      user_image:
        'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
      user_name: 'Beta',
      stories: [
        {
          story_id: 1,
          story_image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 1 swiped'),
        },
        {
          story_id: 2,
          story_image:
            'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 2 swiped'),
        },
      ],
    },
  ];

  const imageSource = item => {
    const source = item?.image ? {uri: item?.image} : tvImage;
    return source;
  };

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{padding: 10}}>
          <Text style={styles.updatesText}>Updates</Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 10,
            }}>
            <View style={{marginTop: 10}}>
              <Pressable>
                <Image
                  style={{width: 58, height: 58, borderRadius: 29}}
                  source={tvImage}
                />
                <Text style={styles.userName}>Anonym</Text>
              </Pressable>
            </View>
            <InstaStory data={data} duration={10} />
          </View>
        </View>

        <View style={{padding: 10}}>
          <Text style={styles.channelsText}>Channels</Text>
          {channels?.map((item, index) => (
            <View style={styles.channelsList}>
              <View>
                <Image
                  style={{width: 50, height: 50, borderRadius: 25}}
                  source={imageSource(item)}
                />
              </View>

              <View style={{flex: 1}}>
                <Text style={styles.channelName}>{item?.name}</Text>
                <Text
                  style={{
                    marginTop: 4,
                    color: 'gray',
                    fontFamily: AvenirRegular,
                  }}>
                  {item?.text}
                </Text>
              </View>

              <Text>{item?.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  updatesText: {fontSize: 17, fontFamily: AvenirBold},
  userName: {
    textAlign: 'center',
    marginTop: 5,
    fontFamily: AvenirBold,
  },
  channelsList: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  channelsText: {fontSize: 15, fontFamily: AvenirBold},
  channelName: {fontSize: 15, fontFamily: AvenirBold},
});
