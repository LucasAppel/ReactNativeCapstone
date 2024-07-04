import { StyleSheet, KeyboardAvoidingView, View, Text, TextInput, ScrollView  } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserAvatar from 'react-native-user-avatar';
import Button from "../components/Button";
import SelectMultiple from "react-native-select-multiple";
import { useState, useEffect } from "react";
import Input from "../components/Input";
import * as ImagePicker from 'expo-image-picker';




export default function Profile({navigation, changeAvatar, changefName, changelName, logout}){
    // Logout function
    /* const logOut = ()=>{
        AsyncStorage.clear()
        navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }]
          })
    }
 */
    // Email Options
    const emailOptions = ["Order statuses", "Password changes", "Special Offers", "Newsletter"];
    const [selectedEmailOptions, setSelectedEmailOptions] = useState([]);
    const selChange = (_, item)=>{
        if (selectedEmailOptions.includes(item.value)){
            setSelectedEmailOptions(selectedEmailOptions.filter((ele)=>(ele!==item.value)));
        }
        else {
            setSelectedEmailOptions([...selectedEmailOptions, item.value]);
        }
    }
    
    // Personal Information
    const [fName, setfName] = useState("");
    const [lName, setlName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const fNameHandler = (newfName)=>{setfName(newfName); changefName(newfName);}
    const lNameHandler = (newlName)=>{setlName(newlName); changelName(newlName);}

    // Avatar
    const [image, setImage] = useState(null);
    const [imgLoading, setImgLoading] = useState(false);
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        setImgLoading(true);
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
            let img = result.assets[0].uri;
            setImage(img);
            changeAvatar(img);
        }
        setImgLoading(false);
      };
    const delImage = ()=>{setImage(null); changeAvatar(null)};


    // Fetch Data
    let [initialized, setInitialized] = useState(false);
    let [dataChanged, setDataChanged] = useState(false);
    // Fetch from async
    let fetchData = async ()=>{
        fNameHandler(await AsyncStorage.getItem('firstName'));
        lNameHandler(await AsyncStorage.getItem('lastName'));
        setEmail(await AsyncStorage.getItem('email'));
        setPhone(await AsyncStorage.getItem('phone'));
        let avtr = await AsyncStorage.getItem('avatar');
        setImage(avtr ? JSON.parse(avtr) : null);
        changeAvatar(avtr ? JSON.parse(avtr) : null);
        let emailOpt = await AsyncStorage.getItem('emailOpt')
        setSelectedEmailOptions(emailOpt ? JSON.parse(emailOpt) : []);        
        setInitialized(true); // Set initialization to true after data is fetched
        setDataChanged(false);
        console.log('Data fetched and initialized set to true');
        return;
    }
    useEffect(() => {
        if (!initialized) {
        console.log('First init');
        fetchData();
        }
    }, [initialized]);
    
    useEffect(() => {
        if (initialized) {
        console.log('Data has changed');
        setDataChanged(true);
        }
    }, [fName, lName, email, phone, image, selectedEmailOptions]);

    // Save Data
    const saveData = async ()=>{
        let dataObj = {
            firstName: fName ?? "",
            lastName: lName ?? "",
            email: email?? "",
            phone: phone ?? "",
            emailOpt: JSON.stringify(selectedEmailOptions),
            avatar: JSON.stringify(image)
        };
        try {
            await AsyncStorage.multiSet(Object.entries(dataObj).map(([key, val])=>([key, val])));
            setDataChanged(false);
        }
        catch (e) {
            alert("Error, Could not set AppState: " + e);
        }
    }
    
    // Valid Inputs
    let mailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let phoneRegEx = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    let validfName = fName!=='' && /^[a-zA-z]+$/g.test(fName);
    let validlName = lName=='' || phone==undefined || /^[a-zA-z]+$/g.test(lName);
    let validMail = mailRegEx.test(email);
    let validPhone = phone=='' || phone==undefined || phoneRegEx.test(phone);
    

    return (
        <KeyboardAvoidingView style={{flex: 1}}>
            <View style={[styles.container]}>
                <ScrollView style={{flex: 0.8, paddingHorizontal: 20}} scrollEnabled={false}>
                    <View style={{gap:20}}>
                        <View>
                            <Text style={styles.h1}>Personal Information</Text>
                            <View>
                                <Text>Avatar</Text>
                                <View style={{flexDirection: 'row', gap: 20, alignItems: 'center' }}>
                                    <UserAvatar size={64} name={fName + (lName ? " " + lName : "")} style={{width: 64, margin: 0}} bgColors={['#495E57']} src={image} />
                                    <Button title="Change" onPress={pickImage} style={styles.btn}/>
                                    <Button title="Remove" onPress={delImage} disabled={!Boolean(image)} style={styles.btn} />
                                </View>
                                <View style={{gap:5}}>
                                    <Input label={"First Name"} errorMsg={"First name can only contain letters an must not be empty!"} value={fName} onChange={fNameHandler} isValid={validfName} />
                                    <Input label={"Last Name"} errorMsg={"Last name can only contain letters!"} value={lName} onChange={lNameHandler} isValid={validlName} />
                                    <Input label={"Email"} errorMsg={"Please enter a valid email address!"} value={email} onChange={setEmail} isValid={validMail} inputMode="email" />
                                    <Input label={"Phone number"} errorMsg={"Please enter a valid phone number starting with '+'"} value={phone} onChange={setPhone} isValid={validPhone} inputMode="tel" />
                                </View>
                            </View>
                        </View>
                        
                        <View>
                            <Text style={styles.h1}>Email Notifications</Text>
                            <SelectMultiple items={emailOptions} selectedItems={selectedEmailOptions} onSelectionsChange={selChange} rowStyle={{backgroundColor: 'transparent', borderBottomWidth: 0, paddingBottom: 0}} flatListProps={{scrollEnabled: false}} />
                        </View>
                    </View>
                </ScrollView>
                <View style={{flex: 0.2, gap: 15, paddingBottom: 20, paddingHorizontal: 20}}>
                    <Button title='Log Out' onPress={logout}/>
                    <View style={{flexDirection: 'row', gap: 10, justifyContent: 'space-evenly'}}>
                        <Button title='Discard Changes' onPress={fetchData} disabled={!dataChanged} />
                        <Button title='Save Changes' onPress={saveData} disabled={!dataChanged || !validfName || !validlName || !validMail || !validPhone} />
                    </View>
                </View>

            </View>


        </KeyboardAvoidingView>
    )
}




const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      gap: 10,
      width: '100%',
    },
    h1: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 10
    },
    btn : {
        justifyContent: 'center',
        height: 50
    },
    input: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 18,
        padding: 7,
        width: '100%'
    },absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },

});