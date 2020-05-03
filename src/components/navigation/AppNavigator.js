import React from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Home from 'components/Home';
import NavigationConstants from 'components/navigation/NavigationConstants';
import Profile from 'components/Profile';
import Map from 'components/Map';
import Colors from 'helpers/Colors';
import iconForTab from 'helpers/TabNavigator';
import { BottomTabBar } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const skippedTabs = [NavigationConstants.map];

const buildTabBar = (props) => {
  const getTabsToShow = routes => routes.filter(route => !skippedTabs.includes(route.name));
  return (
    <BottomTabBar {...props} state={{...props.state, routes: getTabsToShow(props.state.routes)}} />
  );
};

const TabIcon = ({ name, color }) => (
  <Image
    source={iconForTab(name)}
    style={{ tintColor: color }}
  />
);

const HomeNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={NavigationConstants.home}
      component={Home}
    />
  </Stack.Navigator>
);

const ProfileNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={NavigationConstants.profile}
      component={Profile}
    />
  </Stack.Navigator>
);

const MapNavigator = () => (
  <Stack.Navigator navigationOptions={{tabBarVisible: false}}>
    <Stack.Screen
      name={NavigationConstants.map}
      component={Map}
    />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <Tab.Navigator
    tabBar={props => buildTabBar(props)}
    screenOptions={({ route: { name } }) => ({
      tabBarIcon: props => TabIcon({ ...props, name }),
    })}
    tabBarOptions={{
      activeTintColor: Colors.primary,
      inactiveTintColor: Colors.dark,
    }}
  >
    <Tab.Screen name={NavigationConstants.home} component={HomeNavigator} />
    <Tab.Screen name={NavigationConstants.profile} component={ProfileNavigator} />
    <Tab.Screen name={NavigationConstants.map} component={MapNavigator} />
  </Tab.Navigator>
);

TabIcon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default AppNavigator;
