import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  TouchableHighlight,
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
    navigation.navigate('Map');
  };

  useEffect(() => {
    navigation.navigate('Shipments');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={TextStyles.lightTitle}>
        {strings.home}
      </Text>
      <Text>
        {getMessage()}
      </Text>
      <TouchableHighlight
        style ={{
          height: 40,
          width:160,
          borderRadius:10,
          backgroundColor : 'white',
          marginTop: 10,
        }}>
        <Button onPress={handleOnPress} title={'Open Map'} />
      </TouchableHighlight>
    </View>
  );
};


export default Home;
