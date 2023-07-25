import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, TouchableHighlight } from 'react-native'
import React, { useState, useEffect} from 'react'
import { Button } from 'react-native-paper'
import { addToCart,addFreeProductToCart, decrementOrRemoveFromCart } from '../reducers/cartSlice';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import { defaultStyle, fonts, colors} from '../styles/styles'
import ModaleOffre31 from '../components/ModaleOffre31';


//call API
import { checkStockForSingleProduct } from '../CallApi/api.js';

//fonctions
import {decrementhandler } from '../Fonctions/fonctions'

import Icon from 'react-native-vector-icons/MaterialIcons';


const ProductCard = ({libelle, id, image, prix, qty, stock, offre, prixSUN  }) => {

  // Déclaration de l'état du stock
  const [currentStock, setCurrentStock] = useState(stock);
  const [modalVisible, setModalVisible] = useState(false);

  // Effet de bord pour mettre à jour le stock
  useEffect(() => {
    const fetchStock = async () => {
      const stock = await checkStockForSingleProduct(id);
      setCurrentStock(stock[0].quantite);
    };

    fetchStock();
    
  }, [id,]);

    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart.cart);
    const product = cart.find((item) => item.productId === id);
    const productQuantity = cart.reduce((total, item) => {
      if (item.productId === id) {
        return total + item.qty;
      }
      return total;
  }, 0);
    //console.log(productQuantity)

    const baseUrl = 'http://127.0.0.1:8080';


    const handleAcceptOffer = () => {
      dispatch(addFreeProductToCart(product));
    };
   
const incrementhandler = async () => {
  if (currentStock === 0){
    return Toast.show({
      type: 'error',
      text1: `Victime de son succès`,
      text2: 'Plus de stock disponible' 
    });
  }
  try {
    const stockAvailable = await checkStockForSingleProduct(id);
    
    // Get the product from the cart
    const productInCart = cart.find((item) => item.productId === id);
   
    // Calculate the remaining stock after accounting for the items in the cart
  const remainingStock = stockAvailable[0].quantite - (productInCart ? productInCart.qty : 0);


    if (stockAvailable.length > 0 && remainingStock > 0) {
      // The stock is sufficient, add the product to the cart
      dispatch(addToCart({ productId: id, libelle, image, prix_unitaire: prix, qty: 1 , offre: offre}));

      if (offre && offre.startsWith('offre31')) {
        // Get a version of the cart that includes the new product
        const updatedCart = [...cart, { productId: id, libelle, image, prix_unitaire: prix, qty: 1 , offre: offre }];
    
        // Filter products that have the same offer as the currently added product
        const sameOfferProducts = updatedCart.filter((item) => item.offre === offre);
    
        // Calculate the total quantity for this specific offer
        const totalQuantity = sameOfferProducts.reduce((total, product) => total + product.qty, 0);
      
        // if (totalQuantity > 0 && totalQuantity % 3 === 0)
        if (totalQuantity === 3 || (totalQuantity - 3) % 4 === 0) {
         
          //MODALE 4E produit
          setModalVisible(true);  
        
        }
    }
    
    } else {
      // The stock is insufficient
      //console.log(`Le stock est insuffisant pour ajouter la quantité spécifiée.,Quantités max: ${stockAvailable[0].quantite}`);
      return Toast.show({
        type: 'error',
        text1: `Victime de son succès`,
        text2: `Quantité maximale: ${stockAvailable[0].quantite}` 
      });
    }
  } catch (error) {
    console.error("Une erreur s'est produite lors de l'incrémentation du stock :", error);
  }
};
   
  return (
    
    <View style={style.card_container}>
         <View style={style.image_container}>
         
          <Image 
              // source={image.uri}
              source={{ uri: `${baseUrl}/${image}` }}
              style={{
                      width: "100%",
                      height: 140,
                      resizeMode: "cover",
                      // borderTopLeftRadius:10,
                      // borderTopRightRadius:10,
                      }}
              
          />
          {currentStock === 0 && (
            <View style={style.overlay} />
            )}
           {
            offre && offre.startsWith('offre31') && (
              <Image
                source={require('../assets/offre31.png')}
                style={{ width: 40, resizeMode:'contain', position:'absolute',top:-5, right:5}}
              />
            )
          }

          <View style={style.qtyContainer}>
              <TouchableOpacity
                  onPress={() => decrementhandler(id, dispatch)}
                  style={style.decrement}
              >
                  <Icon name="remove" size={16} color="#000" />
             </TouchableOpacity>
            {/* <Text style={style.qtyText}>{cart[index].qty}</Text> */}
             <TouchableOpacity
                  style={style.qtyText}
              >
                <Text>{productQuantity}</Text>
                 {/* <Text >{product ? product.qty : 0}</Text> */}
              </TouchableOpacity>
                           
              <TouchableOpacity
                  // onPress={() => incrementhandler(id, dispatch, cart, currentStock, offre)}

                  onPress={incrementhandler}
                  style={style.increment}
              >
                  <Icon name="add" size={16}  color="white" />
              </TouchableOpacity>

          </View>
   
        </View>

            <View style={{
                flexDirection:'row',
                justifyContent:'space-between',
                paddingLeft:10,
                paddingRight:10,
                }}>
            
                <View
                    style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    height:40,
                    backgroundColor:'white',
                    paddingVertical:5,
                    width:"50%"
                    }}
                >
                    <Text
                        numberOfLines={1}
                        style={{
                        fontSize: 14,
                        fontWeight: "300",
                        width: "100%",
                        }}
                    >
                        {libelle}
                    </Text>
                    <Text
                            numberOfLines={1}
                            style={{
                            fontSize: 14,
                            fontWeight: "300",
                            width: "100%",
                            }}
                        >
                            {prix}€
                      </Text>
                      {/* <Text>
                        {
                          stock===0 ?  'stock indispo':'stock ok'             
                        }
                      </Text> */}
                      
                </View>
                <View style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems:'flex-end',
                    height:40,
                    backgroundColor:'white',
                    paddingVertical:5
                    }}>
                {/* <Text
                        numberOfLines={1}
                        style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        width: "100%",
                        textAlign:'center',
                        color:colors.color2
                        }}
                    > */}
                        <Image
                          source={require('../assets/SUN.png')} 
                          style={{ width: 30, height: 20, resizeMode:'center' }}
                          />
                    {/* </Text> */}
                    <Text
                            numberOfLines={1}
                            style={{
                            fontSize: 14,
                            fontWeight: "300",
                            width: "100%",
                            textAlign:'center'
                            }}
                        >
                            {prixSUN}€
                      </Text>
                </View>
                       
            </View>

  
            <ModaleOffre31 modalVisible={modalVisible} setModalVisible={setModalVisible} handleAcceptOffer={handleAcceptOffer} />

    </View>   
  )
}
const style = StyleSheet.create({
    
    card_container:{
        flexDirection:'column', 
        width:"100%", 
        //justifyContent:'center', 
        //alignItems:'center', 
        height:180,
        backgroundColor:'white', 
        marginVertical: 10, 
        marginHorizontal:5,
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
        },
        image_container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width:"100%"
        },
        qtyContainer: {
          position: 'absolute',
          bottom: 10,
          right: 10,
            flexDirection:'row',
            width: "50%",
            justifyContent: "space-between",
            alignSelf: "center",
          },
        overlay: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'gray',
            opacity: 0.5,
            borderRadius:5
          },
        increment:{
          backgroundColor:colors.color2,
          color:"white",
          width:25,
          height:25,
          justifyContent:'center',
          alignItems:'center', 
          borderRadius:5
        },
        decrement:{
          backgroundColor:colors.color3,
          color:colors.color1,
          width:25,
          height:25,
          justifyContent:'center',
          alignItems:'center', 
          borderRadius:5
        },
        qtyText:{
            backgroundColor:colors.color3,
            color:colors.color1,
            width:25,
            height:25,
            justifyContent:'center',
            alignItems:'center', 
            borderRadius:5
        },
        
})

export default ProductCard