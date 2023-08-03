import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { fonts, colors} from '../styles/styles'
import { Button } from 'react-native-paper';


const Catalogue = () => {
  return (
    <View style={styles.container}>
      <View style={styles.container_image}>
            <Image
                  source={require('../assets/catalogue1.jpeg')} 
                  style={{...styles.images, borderTopLeftRadius:10, borderTopRightRadius:10}}
                />
            <Image
                  source={require('../assets/catalogue2.jpeg')} 
                  style={{...styles.images, borderBottomLeftRadius:10, borderBottomRightRadius:10}}
                />
      </View>
      <View style={styles.catalogueTitle}>
        <Text style={styles.catalogueTitleStyle}>Réservez vos plaisirs</Text>
        <Text style={styles.catalogueTitleStyle}>sucrés ou salés</Text>
        <Text style={styles.catalogueText}> Vous pouvez ici trouver le catalogue de nos produits disponibles pour des commandes de type traiteur
             ou en grandes quantités. N’hésitez pas à contacter votre établissement si avez plus de questions.</Text>
      </View>

      <Button style={styles.button}>
        <View style={{flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
            <Text style={styles.textButton}>Télécharger notre</Text>
            <Text style={styles.textButton}>catalogue</Text>
        </View>
        <Image
                  source={require('../assets/upload.png')} 
                  style={styles.icon}
                />    
        </Button>
      
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        margin:30
      },
      container_image:{
        height:300
      },
      images:{
        width: 312, 
        height: 150, 
        resizeMode:'cover'
      },
      catalogueTitle:{
        margin:15, 
        flexDirection:'column',
        alignItems:'center',
      },
      catalogueTitleStyle:{
        fontSize:24,
        fontFamily:fonts.font3,
        fontWeight:'700',
        color:colors.color1
      },
      catalogueText:{
        textAlign:'center',
        margin:10,
        fontSize:12,
        fontFamily:fonts.font3,
        fontWeight:'700',
        color:colors.color1
      },
      button:{
        backgroundColor:colors.color2,
        borderRadius:5,
        padding:5,
      },
      textButton:{
        color:'white',
        fontSize:16,
        fontFamily:fonts.font3,
        fontWeight:'600',
      },
      icon:{
        width:30,
        height:30,
       
      }
  });


export default Catalogue