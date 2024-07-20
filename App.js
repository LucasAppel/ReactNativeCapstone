import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Image, Text, View, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './screens/SplashScreen';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import { useEffect, useState } from 'react';
import UserAvatar from 'react-native-user-avatar';
import HomeScreen from './screens/Home';
import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';

const Stack = createNativeStackNavigator();
const headerOptions = {
  headerTitle: NaviHeader,
  headerTitleAlign: 'center'
  //presentation: 'formSheet'
};


export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [fName, setfName] = useState('');
  const [lName, setlName] = useState('');

  const avtrData = {
    avatar,
    fName,
    lName
  };

  const getAvtrData = async () => {
    try {
      let firstName = await AsyncStorage.getItem('firstName');
      setfName(firstName);
      let lastName = await AsyncStorage.getItem('lastName');
      setlName(lastName);
      let avtr = JSON.parse(await AsyncStorage.getItem('avatar'));
      setAvatar(avtr);
      
    }
    catch (e) {
      alert ('Error: Could not load avatar data.');
    }
  }

  const getState = async () => {
    try {
      let loginStatus = await AsyncStorage.getItem('isLoggedIn');
      if (loginStatus === undefined) {
        setState({isLoggedIn: 'false'})
        setIsLoggedIn(false)
      }
      else setIsLoggedIn(Boolean(loginStatus));
    }
    catch (e) {
      alert ('Error: Could not check login status.');
    }
    finally {
      setIsLoading(false);
    }
  }

  const setState = async (stateObj) => {
    try {
      await AsyncStorage.multiSet(Object.entries(stateObj).map(([key, val])=>([key, String(val)])));
    }
    catch (e) {
      alert("Error, Could not set AppState: " + e);
    }
  }

  useEffect(()=>{
    getState();
    getAvtrData();
  }, [])

  if (isLoading) return <SplashScreen/>
  return (
    <PaperProvider>
      <NavigationContainer style={styles.container}>
        <StatusBar style='auto'></StatusBar>
        <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Onboarding'}>
          {isLoggedIn ? (
            // Logged In
            <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={({ navigation }) => ({
                ...headerOptions,
                headerRight: ()=>(<Pressable onPress={() => navigation.navigate('Profile')}><AvatarImg {...avtrData} /></Pressable>)
              })}
            />
            <Stack.Screen name="Profile" options={{...headerOptions, headerRight: ()=>(<AvatarImg {...avtrData} />) }}>{(props)=><Profile {...props} changeAvatar={setAvatar} changefName={setfName} changelName={setlName} logout={()=>setIsLoggedIn(false)} />}</Stack.Screen> 
            </>) : (
            // Logged Out
            <Stack.Screen name="Welcome" options={headerOptions}>{(props)=><Onboarding {...props} login={()=>setIsLoggedIn(true)} />}</Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
AppRegistry.registerComponent(appName, () => App);

function NaviHeader(){
  return (
  <View style={{}}>
    <Image source={require('./assets/Logo.png')}  resizeMode='contain'/>
  </View>
  )
}

function BackButton(){
  return (
    <UserAvatar size ={32} name="❮" style={{width: 32, margin: 0}} bgColors={['#495E57']} />
  )
}

function AvatarImg({avatar, fName, lName}){
  return (
    <UserAvatar size ={32} name={fName + (lName ? " " + lName : "")} src={avatar} style={{width: 32, margin: 0}} bgColors={['#495E57']} />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
});
