import { useEffect, useState } from 'react';
import Button from '../components/Button';
import { StyleSheet, Text, View, Image, TextInput, KeyboardAvoidingView, Pressable, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

export default function Onboarding({navigation, login}) {
    let [nextDisabled, setNextDisabled] = useState(true);
    let  [fName, setfName] = useState('');
    let [email, setEmail] = useState('');
    
    // Valid Inputs
    let mailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let validName = fName!=='' && /^[a-zA-z]+$/g.test(fName);
    let validMail = mailRegEx.test(email);

    // Check Button State
    useEffect(()=>{
        setNextDisabled(!validName || !validMail);
    }, [fName, email]);

    // Submit Data
    const setState = async (stateObj) => {
        try {
          await AsyncStorage.multiSet(Object.entries(stateObj));
          return true;
        }
        catch (e) {
          alert("Error, Could not set AppState: " + e);
          return false;
        }
      }
    function submitData(){
        if (setState({email: email, firstName: fName, isLoggedIn: 'true'}))  login();
          /* navigation.reset({
          index: 0,
          routes: [{ name: 'Profile' }]
        })//navigation.navigate("Profile"); */
    }

    // Component Return
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
       {/*  <View style={[styles.section, {flex: 0.1}]}>
            <Image source={require('../assets/Logo.png')} />
        </View> */}
        <View style={[styles.section, {flex: 0.8, paddingTop: 50, gap: 50}]}>
            <Text style={[styles.text]}>Let us get you to know</Text>
            <View style={[styles.section, {flex:1, justifyContent: 'flex-end', paddingBottom: '15%', gap: 20}]}>
                <View style={styles.section}>
                    <Text style={[styles.text, (fName!=='' && !validName) && {color: 'red'}]}>
                        {fName==='' || validName ? "First Name" : "First name can only contain letters!"}
                    </Text>
                    <TextInput value={fName} clearButtonMode='always' onChangeText={setfName} style={styles.input} />
                </View>
                <View style={styles.section}>
                    <Text style={[styles.text, (email!=='' && !validMail) && {color: 'red'}]}>
                        {email==='' || validMail ? "Email" : "Email must be valid!"}
                    </Text>
                    <TextInput inputMode='email' clearButtonMode='always' value={email} onChangeText={setEmail} style={styles.input} />
                </View>
            </View>
        </View >
        <View style={[styles.section, {flex: 0.2, alignItems: 'stretch', justifyContent: 'flex-end', paddingLeft: '50%', paddingRight: 40, paddingBottom: 40}]}>
            <Button title='Next' disabled={nextDisabled} onPress={submitData}/>
        </View>
      </KeyboardAvoidingView>
    );
  }




const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    section: {
        alignItems: 'center',
        width: '100%',
    },
    text: {
        fontSize: 20,
        fontWeight: '300',
    },
    input: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 18,
        padding: 7,
        width: '80%'
    }
  });


  function buttonStyle(pressed, disabled){
    return {
        backgroundColor: disabled ? 'lightgrey' : pressed ? 'rgb(64,156,255)' : '#007AFF',
        alignItems: 'center',
        borderRadius: 5,
        padding: 14
    }
  }

  function buttonTextStyle(pressed, disabled){
    return {
        color: disabled ? 'black' : pressed ? 'lightgrey' : 'white',
        fontSize: 16,
        fontWeight: 500
    }
  }