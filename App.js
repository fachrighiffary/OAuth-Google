import React,{useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { GoogleSignin, statusCodes,GoogleSigninButton } from '@react-native-google-signin/google-signin';

import auth from '@react-native-firebase/auth';

const App = () => {
  const [loggedIn, setloggedIn] = useState(false);
  const user = auth().currentUser;

  const signIn = async () => {
    try {
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log(error);
    }
  };

  const onAuth = user => {
    if (user) {
      setloggedIn(true);
    } else {
      setloggedIn(false);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '846302184185-1p6n9pmgd7hk6smb4skmkavqrd450vu7.apps.googleusercontent.com',
    });

    const subscriber = auth().onAuthStateChanged(onAuth);
    return subscriber;
  }, []);

  const signOut = async () => {
    try {
      await auth().signOut()
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      // this.setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  console.log(user);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{alignItems: 'center'}}>
          <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={signIn}
                disabled={loggedIn} 
            />
            <Image source={{uri : `${user?.photoURL}`}} style={{height: 150, width: 150}} />
            <Text style={styles.text}>{user?.displayName}</Text>
            <Text style={styles.text}>{user?.email}</Text>
            
          {
            loggedIn && (
              <TouchableOpacity 
              style={{
                backgroundColor: 'grey',
                height: 40,
                width: 100,
                marginTop: 70,
                justifyContent: 'center',
                alignItems: 'center',
              
              }}
              onPress={signOut}
            >
              <Text style={{color: 'white'}}>Logout</Text>
            </TouchableOpacity>
            )
          }
        </View>
      </View>

  )
}

export default App

const styles = StyleSheet.create({
  container : {
    justifyContent: 'center'
  }
})