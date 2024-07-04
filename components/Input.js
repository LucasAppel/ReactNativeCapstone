import { useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

export default function Input({label, errorMsg=label, isValid=true, value, onChange, inputMode='auto'}){

    return (
        <View style={{}}>
            <Text style={[{}, !isValid && {color: 'red'}]}>
                {isValid ? label : errorMsg}
            </Text>
            <TextInput value={value} clearButtonMode='always' onChangeText={(txt)=>{onChange(txt); console.log(label + " changed: " + txt)}} style={styles.input} inputMode={inputMode} />
        </View>
    );
}


const styles = StyleSheet.create({
    input: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 18,
        padding: 7,
        width: '100%'
    }
})