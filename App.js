import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import WelcomeScreen from './Screens/WelcomeScreen';
import Signup from './Screens/Signup2';
import Dashboard from './Screens/Dashboard';
import Signin from './Screens/Signin';
import Bottombar from './Screens/Bottombar';
import Xray from './Screens/XrayAnalysis';
import Appointment from './Screens/Appointment';
import VideoCallMenu from './Screens/VideoCallMenu';
import Conference from './Screens/Conference';

const Stack = createStackNavigator();

export default function App() {
 // console.log("App Executed"); // DELETE win prodution mode
  //console.log(require('./App/assets/Doc.png')); //prints the # of the icon
  return ( 
    // <WelcomeScreen />
    //<Signup/>
    <NavigationContainer>
        <Stack.Navigator initialRouteName="WelcomeScreen"> 
            <Stack.Screen name="Signup" component={Signup} options={{headerShown: false}}/>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{headerShown: false}} />
            <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown: false}} />
            <Stack.Screen name="Signin" component={Signin} options={{headerShown: false}} />
            <Stack.Screen name="Bottombar" component={Bottombar} options={{headerShown: false}} />
            <Stack.Screen name="Xray" component={Xray} options={{headerShown: false}} />
            <Stack.Screen name="Appointment" component={Appointment} options={{title: 'Back'}} />
            <Stack.Screen name="VideoCallMenu" component={VideoCallMenu} options={{headerShown:false}} />
            <Stack.Screen name="Conference" component={Conference} options={{headerShown:false}} />

            
            
        </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

  container: {
    
  },
});
