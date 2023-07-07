import { View, StyleSheet } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native'

const FooterProfile = () => {
  //on utilise ici useNavigation et non pas navigation car le footer n'est pas dans la pile de screens
  const navigation = useNavigation()

  const openProfile = () => {
    navigation.navigate('profile')
  }
  return (
    <View style={style.profile}>
      <Icon name="person" size={30} color="#000" style={style.icon} onPress={openProfile}/>
    </View>
  )
}

const style = StyleSheet.create({
    profile: {
        height:'10%',
        width:'100%', 
        position:'absolute', 
        bottom:0, 
        backgroundColor:'gray',
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    icon:{
        borderWidth: 1,
        borderStyle:'solid',
        borderColor:'white',
        padding:10, 
        borderRadius:25,
        // backgroundColor:'white'
    }
  });

export default FooterProfile