import { View, TouchableOpacity, Image, Text, StyleSheet, ScrollView} from 'react-native'
import React, { useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  addToCart, addFreeProductToCart} from '../reducers/cartSlice';
import { checkStockForSingleProduct } from '../CallApi/api.js';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import FooterProfile from '../components/FooterProfile';
import ModaleOffre31 from '../components/ModaleOffre31';
import ArrowLeft from '../SVG/ArrowLeft';
import { colors, fonts} from '../styles/styles'
import Svg, { Path } from 'react-native-svg';
import { style } from '../styles/formules'; 
import { Button} from 'react-native-paper'
import {  API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS } from '@env';
import FastImage from 'react-native-fast-image';


//fonctions
import { decrementhandler } from '../Fonctions/fonctions'
import InfoProduct from '../SVG/InfoProduct';
import ModaleIngredients from '../components/ModaleIngredients';

const ProductDetails = ({navigation, route}) => {

    const { product } = route.params;
    const [currentStock, setCurrentStock] = useState(product.stock);
    const [modalVisible, setModalVisible] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [modalVisibleIngredients, setModalVisibleIngredients] = useState(false);


    // Effet de bord pour mettre à jour le stock
    useEffect(() => {
    const fetchStock = async () => {
      const stock = await checkStockForSingleProduct(product.productId);
      //console.log('stock details', stock)
      setCurrentStock(stock[0].quantite);
    };

    fetchStock();
  }, [product.productId]);

    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart.cart);

    const productQuantity = cart.reduce((total, item) => {
      if (item.productId === product.productId) {
        return total + item.qty;
      }
      return total;
    }, 0);

  
    useEffect(() => {
      const totalPrice = cart.reduce((acc, product) => acc + (product.qty * product.prix_unitaire), 0);
      setTotalPrice(totalPrice);
    }, [cart]);

    const handleBack = () => {
        navigation.navigate('home');
      };
     
    const handleAcceptOffer = () => { 
      dispatch(addFreeProductToCart(product));
    }; 
    
    const incrementhandler = async () => {
      setProductCount(productCount + 1);

      if (currentStock === 0){
        return Toast.show({
          type: 'error',
          text1: `Victime de son succès`,
          text2: 'Plus de stock disponible' 
        });
      }
      try {
        const stockAvailable = await checkStockForSingleProduct(product.productId);
  
        const remainingStock = stockAvailable[0].quantite - productQuantity;
  
        if (stockAvailable.length > 0 && remainingStock > 0) {
          dispatch(addToCart({ productId: product.productId, libelle: product.libelle, image: product.image, prix_unitaire: product.prix_unitaire, qty: 1 , offre: product.offre}));
  
          if (product.offre && product.offre.startsWith('offre31')) {
            const updatedCart = [...cart, { productId: product.productId, libelle: product.libelle, image: product.image, prix_unitaire: product.prix, qty: 1 , offre: product.offre}];
            const sameOfferProducts = updatedCart.filter((item) => item.offre === product.offre);
            const totalQuantity = sameOfferProducts.reduce((total, product) => total + product.qty, 0);
            
            if (totalQuantity === 3 || (totalQuantity - 3) % 4 === 0) {
              setModalVisible(true);

            }
          }
        } else {
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
  
    const handleCart = () => {
      navigation.navigate('panier')
    }
    const openIngredients = () => {
      setModalVisibleIngredients(true)
    }
  return (
    <>
    <View style={{flex:1}} >
      <View style={{paddingTop:50}}></View>
    <ScrollView style={{marginBottom:20}}>
      
            <View>
                {/* <Image source={{ uri: `${API_BASE_URL}/${product.image}` }} style={{width: "100%", height:300, resizeMode:'cover'}} /> */}
                 <FastImage
                            style={{width: "100%", height:300, resizeMode:'cover'}}
                            source={{ uri: `${API_BASE_URL}/${product.image}`,
                                priority: FastImage.priority.high,
                            }}
                    resizeMode={FastImage.resizeMode.cover}
                />
                <TouchableOpacity style={{position:'absolute',bottom:10, right:10}} onPress={openIngredients}>
                <InfoProduct />
                </TouchableOpacity>
                <View style={{flexDirection:'row',justifyContent:'space-between', width:"100%" , alignItems:'center', position:'absolute', top:30, paddingHorizontal:30}}>
                  <Text style={styles.titleProduct}>{product.libelle}</Text>
                  <TouchableOpacity  onPress={handleBack} activeOpacity={1} style={{ backgroundColor:colors.color1, borderRadius:25}}>
                      <ArrowLeft fill="white"/>
                  </TouchableOpacity>
                </View>   
              </View>
            <View style={styles.details}>
                
                <Text>{product.descriptionProduit}</Text>
            </View>

            <View style={{backgroundColor:colors.color6, marginHorizontal:30, borderRadius:10, padding: 10, flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{flexDirection:'column'}}>
                <Text style={{fontWeight:"bold"}}>{product.libelle}</Text>
                <Text style={{fontWeight:'200'}}>{product.prix_unitaire} €</Text>
              </View>
              <View style={{width: 1, backgroundColor: colors.color3, marginVertical: 5}} /> 
              <View style={{flexDirection:'column', justifyContent:'flex-end'}}>
                <Svg width="34" height="20" viewBox="0 0 34 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <Path d="M6.72 5.43809C6.4 5.17809 6.08 4.98809 5.76 4.86809C5.44 4.73809 5.13 4.67309 4.83 4.67309C4.45 4.67309 4.14 4.76309 3.9 4.94309C3.66 5.12309 3.54 5.35809 3.54 5.64809C3.54 5.84809 3.6 6.01309 3.72 6.14309C3.84 6.27309 3.995 6.38809 4.185 6.48809C4.385 6.57809 4.605 6.65809 4.845 6.72809C5.095 6.79809 5.34 6.87309 5.58 6.95309C6.54 7.27309 7.24 7.70309 7.68 8.24309C8.13 8.77309 8.355 9.46809 8.355 10.3281C8.355 10.9081 8.255 11.4331 8.055 11.9031C7.865 12.3731 7.58 12.7781 7.2 13.1181C6.83 13.4481 6.37 13.7031 5.82 13.8831C5.28 14.0731 4.665 14.1681 3.975 14.1681C2.545 14.1681 1.22 13.7431 0 12.8931L1.26 10.5231C1.7 10.9131 2.135 11.2031 2.565 11.3931C2.995 11.5831 3.42 11.6781 3.84 11.6781C4.32 11.6781 4.675 11.5681 4.905 11.3481C5.145 11.1281 5.265 10.8781 5.265 10.5981C5.265 10.4281 5.235 10.2831 5.175 10.1631C5.115 10.0331 5.015 9.91809 4.875 9.81809C4.735 9.70809 4.55 9.60809 4.32 9.51809C4.1 9.42809 3.83 9.32809 3.51 9.21809C3.13 9.09809 2.755 8.96809 2.385 8.82809C2.025 8.67809 1.7 8.48309 1.41 8.24309C1.13 8.00309 0.9 7.70309 0.72 7.34309C0.55 6.97309 0.465 6.50809 0.465 5.94809C0.465 5.38809 0.555 4.88309 0.735 4.43309C0.925 3.97309 1.185 3.58309 1.515 3.26309C1.855 2.93309 2.265 2.67809 2.745 2.49809C3.235 2.31809 3.78 2.22809 4.38 2.22809C4.94 2.22809 5.525 2.30809 6.135 2.46809C6.745 2.61809 7.33 2.84309 7.89 3.14309L6.72 5.43809Z" fill="#E9520E"/>
                                <Path d="M13.1473 2.54309V8.69309C13.1473 9.02309 13.1573 9.36309 13.1773 9.71309C13.2073 10.0531 13.2823 10.3631 13.4023 10.6431C13.5323 10.9231 13.7323 11.1531 14.0023 11.3331C14.2723 11.5031 14.6523 11.5881 15.1423 11.5881C15.6323 11.5881 16.0073 11.5031 16.2673 11.3331C16.5373 11.1531 16.7373 10.9231 16.8673 10.6431C16.9973 10.3631 17.0723 10.0531 17.0923 9.71309C17.1223 9.36309 17.1373 9.02309 17.1373 8.69309V2.54309H20.0623V9.09809C20.0623 10.8581 19.6573 12.1431 18.8473 12.9531C18.0473 13.7631 16.8123 14.1681 15.1423 14.1681C13.4723 14.1681 12.2323 13.7631 11.4223 12.9531C10.6123 12.1431 10.2073 10.8581 10.2073 9.09809V2.54309H13.1473Z" fill="#E9520E"/>
                                <Path d="M22.4387 13.8531V2.54309H25.3787L30.8087 9.45809V2.54309H33.7337V13.8531H30.8087L25.3787 6.93809V13.8531H22.4387Z" fill="#E9520E"/>
                                <Path d="M2.00885 17.4003H2.43174C2.90019 17.4003 3.13441 17.1982 3.13441 16.7939C3.13441 16.3896 2.90019 16.1874 2.43174 16.1874H2.00885V17.4003ZM2.00885 20.0326H0.733643V15.1681H2.76356C3.31441 15.1681 3.73514 15.31 4.02575 15.5939C4.32069 15.8778 4.46817 16.2778 4.46817 16.7939C4.46817 17.31 4.32069 17.71 4.02575 17.9939C3.73514 18.2778 3.31441 18.4197 2.76356 18.4197H2.00885V20.0326Z" fill="black"/>
                                <Path d="M6.41828 17.3423H6.65901C6.91058 17.3423 7.10359 17.2907 7.23805 17.1874C7.37251 17.0842 7.43974 16.9358 7.43974 16.7423C7.43974 16.5487 7.37251 16.4003 7.23805 16.2971C7.10359 16.1939 6.91058 16.1423 6.65901 16.1423H6.41828V17.3423ZM9.22242 20.0326H7.63493L6.41828 18.1616V20.0326H5.14308V15.1681H7.12745C7.40071 15.1681 7.63926 15.209 7.84312 15.2907C8.04698 15.3681 8.21397 15.4756 8.3441 15.6133C8.47856 15.7509 8.57832 15.91 8.64338 16.0907C8.71278 16.2713 8.74748 16.4649 8.74748 16.6713C8.74748 17.0412 8.65639 17.3423 8.47422 17.5745C8.29638 17.8025 8.0318 17.9573 7.68047 18.0391L9.22242 20.0326Z" fill="black"/>
                                <Path d="M12.547 16.2391H11.031V17.052H12.4624V18.1229H11.031V18.9616H12.547V20.0326H9.75583V15.1681H12.547V16.2391Z" fill="black"/>
                                <Path d="M13.2451 20.0326L14.0779 15.1681H15.3401L16.3226 17.7616L17.2985 15.1681H18.5607L19.3934 20.0326H18.1248L17.7019 17.2326L16.5438 20.0326H16.0363L14.9367 17.2326L14.5138 20.0326H13.2451Z" fill="black"/>
                                <Path d="M21.4764 15.1681V20.0326H20.2012V15.1681H21.4764Z" fill="black"/>
                                <Path d="M23.7765 15.1681V17.8133C23.7765 17.9552 23.7808 18.1014 23.7895 18.252C23.8025 18.3982 23.835 18.5315 23.8871 18.652C23.9434 18.7724 24.0302 18.8713 24.1473 18.9487C24.2644 19.0219 24.4292 19.0584 24.6418 19.0584C24.8543 19.0584 25.017 19.0219 25.1297 18.9487C25.2468 18.8713 25.3336 18.7724 25.39 18.652C25.4464 18.5315 25.4789 18.3982 25.4876 18.252C25.5006 18.1014 25.5071 17.9552 25.5071 17.8133V15.1681H26.7758V17.9874C26.7758 18.7444 26.6001 19.2971 26.2488 19.6455C25.9018 19.9939 25.3661 20.1681 24.6418 20.1681C23.9174 20.1681 23.3796 19.9939 23.0282 19.6455C22.6769 19.2971 22.5012 18.7444 22.5012 17.9874V15.1681H23.7765Z" fill="black"/>
                                <Path d="M27.5853 20.0326L28.4181 15.1681H29.6803L30.6627 17.7616L31.6387 15.1681H32.9009L33.7336 20.0326H32.4649L32.042 17.2326L30.884 20.0326H30.3765L29.2769 17.2326L28.854 20.0326H27.5853Z" fill="black"/>
                              </Svg>
                <Text style={styles.prixSun} >{(product.prix_unitaire*0.80).toFixed(2)}€</Text>
              </View>
            </View>

            {/* <View style={{ marginVertical:20, marginHorizontal:30}}>
                <Text style={{fontFamily:fonts.font2, fontWeight:"700"}}>Ingrédients</Text>
              </View>

              <View style={{backgroundColor:colors.color6, marginHorizontal:30, borderRadius:10, padding: 10, flexDirection:'row', justifyContent:'space-between'}}>
              <Text>{product.ingredients}</Text>
              </View> */}

      </ScrollView>
        <ModaleOffre31 modalVisible={modalVisible} setModalVisible={setModalVisible} handleAcceptOffer={handleAcceptOffer} />

    </View>

   
        <View style={{...style.menu, height:120,justifyContent:'center' }}>
          
                <View style={{flexDirection:'column', gap:20, }}>
                  <View style={{ flexDirection:'row'}}>
                      <Text style={{fontWeight:"bold"}}>Ajouter le produit au panier: </Text>
                    <View style={styles.qtyContainer}>
                                <TouchableOpacity
                                  onPress={() => decrementhandler(product.productId, dispatch)}
                                  style={styles.container_gray} >
                                    <Svg width={7} height={4} viewBox="0 0 7 4">
                                      <Path
                                    d="M0.666748 3.8V0.733337H6.80008V3.8H0.666748Z"
                                    fill="#273545"
                                  />
                                </Svg>
                            </TouchableOpacity>
                            
                            <View style={styles.container_gray}> 
                              <Text style={styles.qtyText}>{productQuantity}</Text>
                            </View>
                            <TouchableOpacity
                                 onPress={() => incrementhandler(product.productId, product.offre)}
                                 style={{...styles.container_gray, backgroundColor:colors.color2}}
                            >
                                <Svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <Path d="M10 4.05197V6.48141H6.63702V9.86669H4.14375V6.48141H0.800049V4.05197H4.14375V0.666687H6.63702V4.05197H10Z" fill="#ECECEC"/>
                                </Svg>
                            </TouchableOpacity>

                      </View>
                    </View>  

                      <View  style={{flexDirection:'row', gap:10}}>
                            <View>
                                <View style={style.bandeauFormule}>
                                <Text style={{ fontWeight:"bold"}}>{productCount < 2 ? 'Prix du produit' : 'Prix des produits'}</Text>
                                <Text>{totalPrice.toFixed(2)} €</Text>
                              </View>
                              <View style={style.bandeauFormule}>
                                  <View style={{flexDirection:'row'}}>
                                  <Text>Avec</Text><Image source={require('../assets/sun.jpg')} style={{ width: 50, height: 20, resizeMode:'contain' }}/>
                                  </View>
                                  <Text style={{color:colors.color2, fontWeight:"bold"}}>{(totalPrice*0.8).toFixed(2)}€</Text>
                              </View>
                            </View>

                            <Button
                              style={style.btn}
                              textColor={'white'} 
                              // disabled={!selectedProduct}
                              onPress={handleCart}
                              >Allez au panier</Button>
                      </View>
                      
                </View>
                
            </View>
            <ModaleIngredients modalVisibleIngredients={modalVisibleIngredients} setModalVisibleIngredients={setModalVisibleIngredients} product={product.ingredients}/>

            
    <FooterProfile/>
    </>
  )
}

const styles = StyleSheet.create({
    container:{
        marginVertical:20
    },
    icons:{
        flexDirection:'row',
        justifyContent:'flex-end',
        marginVertical:10
    },
    badge_container:{
        position: 'relative',
        marginRight: 10,
    },
    badge: {
        position: 'absolute',
        top: -8,
        right: 0,
    },
    // image_container:{
    //     width:'100%',
    //     height:'50%'
    // },
    details:{
        margin:30,
        flexDirection:'column',
        gap:10,
        alignItems:'flex-start'
    },
    qtyContainer:{
        flexDirection:'row',
        alignItems: "center",
        width: "40%",
        justifyContent: "center",
        alignSelf: "center",
        gap:10
        // marginVertical:10,
    },
    qtyText:{
      fontSize: 16,
      paddingHorizontal: 10,
      color:colors.color1,
      textAlign:'center'  
    },
    container_gray:{
      backgroundColor:'lightgray',
      width:30, height:25,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
    },
    titleProduct:{ 
      color: "white",
      fontFamily:fonts.font1,
      fontSize:24,
      width:"80%"
    },
    prixSun:{
      color:colors.color2,
      fontWeight:"bold"
    }
})
export default ProductDetails