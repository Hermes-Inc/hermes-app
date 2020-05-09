import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

export default function Spinner() {
  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size='large' color='#0000ff'/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    marginTop: 350
  }
});
