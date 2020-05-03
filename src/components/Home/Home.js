import React, { useCallback } from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import styles from './styles';

import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import getUser from 'selectors/UserSelectors';

const Home = () => {
  const user = useSelector(state => getUser(state));
  const navigation = useNavigation();
  const getMessage = useCallback(() => `${strings.homeMessage} ${user && user.name}`, [user]);
  const handleOnPress = () => {
    console.log('button pressed');
    navigation.navigate('Map');
  };

  return (
    <View style={styles.container}>
      <Text style={TextStyles.lightTitle}>
        {strings.home}
      </Text>
      <Text>
        {getMessage()}
      </Text>
      <Button onPress={handleOnPress} title={'Open Map'}>Open Map</Button>
    </View>
  );
};


export default Home;
