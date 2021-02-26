import 'react-native-gesture-handler';
import React, { PureComponent } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchUser from '../components/search';
import getUser from '../components/getUserDetails';
import Update from '../components/updateUser';
import Home from '../components/home';


const Tab = createBottomTabNavigator();
class bottomTabNav extends PureComponent {
  render() {
//My Tab Navigator called in home page, has 4 main pages
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === ('Home')) {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === ('Show my details')) {
              iconName = focused ? 'person' : 'person-outline';
            }
            else if (route.name === ('Update Account')) {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            else if (route.name === ('Search')) {
              iconName = focused ? 'search' : 'search-outline';
            }
            return <Ionicons name={iconName} size={35} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#CC8D17',
          inactiveTintColor: 'gray',
          style: { position: 'absolute', fontWeight: 5, backgroundColor: 'white' }
        }}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Search" component={SearchUser} />
        <Tab.Screen name="Show my details" component={getUser} />
        <Tab.Screen name="Update Account" component={Update} />
      </Tab.Navigator>

    );
  }
}

export default bottomTabNav;