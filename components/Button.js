import { Pressable, Text } from "react-native"

export default function Button({title, disabled, onPress, style={}}){
    return (
        <Pressable style={({pressed}) => buttonStyle(pressed, disabled, style)} disabled={disabled} onPress={onPress}>
                {({pressed, disabled}) => (
                <Text style={buttonTextStyle(pressed, disabled, style)}>{title}</Text> )}
            </Pressable>
    )
}



function buttonStyle(pressed, disabled, style){
    return [{
        backgroundColor: disabled ? 'lightgrey' : pressed ? 'rgb(64,156,255)' : '#007AFF',
        alignItems: 'center',
        borderRadius: 8,
        padding: 14,
        paddingHorizontal: 20
    }, style]
  }

  function buttonTextStyle(pressed, disabled, style){
    return [{
        color: disabled ? 'black' : pressed ? 'lightgrey' : 'white',
        fontSize: 16,
        fontWeight: 500
    }]
  }