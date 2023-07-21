import { View, Text, TouchableOpacity,ScrollView, TextInput } from 'react-native'
import React, { useState} from 'react'
import { defaultStyle} from '../styles/styles'
import { Button } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios'
import { updateCart, addToCart, decrementOrRemoveFromCart } from '../reducers/cartSlice';
import { logoutUser} from '../reducers/authSlice';
import CartItem from '../components/CardItems';
import CardItemFormule from '../components/CardItemsFormule';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import { checkStockFormule, checkStockForSingleProduct } from '../CallApi/api';
import FooterProfile from '../components/FooterProfile';

//fonctions
import { incrementhandler, decrementhandler } from '../Fonctions/fonctions'

const Panier = ({navigation}) => {

  const dispatch = useDispatch()
  const [promoCode, setPromoCode] = useState('');
  //const [currentStock, setCurrentStock] = useState(product.stock);

  const cart = useSelector((state) => state.cart.cart);
  console.log('cart panier', cart )
  const user = useSelector((state) => state.auth.user)
  const store = useSelector((state) => state.auth.selectedStore)
  //console.log('cart', cart)

  // const totalPrice = cart.reduce((total, item) => total + item.qty * item.prix, 0);
  //const totalPrice = (cart.reduce((total, item) => total + item.qty * item.prix_unitaire, 0)).toFixed(2);
  const totalPrice = Number((cart.reduce((total, item) => {
    const prix = item.prix || item.prix_unitaire; // Utilisez la propriété "prix" si elle existe, sinon utilisez "prix_unitaire"
    return total + item.qty * prix;
  }, 0)).toFixed(2));
  console.log('pricetotal', totalPrice)

  const handleBack = () => {
    navigation.navigate('home');
  };

  const incrementhandler = async (index) => {
    const product = cart[index];
    if(product.type === 'formule'){
      console.log('ok')
      const stocks = await checkStockFormule(product.productIds); // Assuming product.productIds is an array of product ids
    
      for (let stock of stocks) {
        if (stock[0].quantite <= product.qty) {
          return Toast.show({
            type: 'error',
            text1: `Victime de son succès`,
            text2: 'Plus de stock disponible' 
          });
        }
      }

    product.qty = 1; 
    dispatch(addToCart(product));
    }
    //si pas formule
    else {
      const stock = await checkStockForSingleProduct(product.productId);

    if (stock[0].quantite <= product.qty) {
      return Toast.show({
        type: 'error',
        text1: `Victime de son succès`,
        text2: 'Plus de stock disponible' 
      });
    }
    product.qty += 1; 
    dispatch(addToCart(product));
  }
    
  }

  const totalQuantity = cart.reduce((total, item) => total + item.qty, 0)

  const handleLogout = () => {
    dispatch(logoutUser()); 
    navigation.navigate('app')
  }

  const handleConfirm = async () => {
    console.log(cart)

    const token = await AsyncStorage.getItem('userToken');

    axios.get('http://localhost:8080/verifyToken', {
      headers: {
          'x-access-token': token
      }
    })
    .then(response => {
      if (response.data.auth) {
          navigation.navigate('choixpaiement');
      } else {
          // Token is not valid, show error...
          handleLogout()
      }
    })
    .catch(error => {
      handleLogout()
      return Toast.show({
        type: 'error',
        text1: 'Session expirée',
        text2: 'Veuillez vous reconnecter'
      });
      // console.log('token invalide catch')
        // console.error('Une erreur s\'est produite lors de la vérification du token :', error);
    });
  }

 //Promotion
  const handleApplyDiscount = async () => {

    axios.get(`http://localhost:8080/promocodes/${promoCode}`)
    .then(response => {
      const data = response.data;
      //console.log('data', data)
      if (data && data.active) {
        const percentage = data.percentage;

        // const updatedCart = cart.map(item => ({
        //   ...item,
        //   originalPrice: item.prix,
        //   prix: item.prix - (item.prix * percentage / 100)
        // }));
        const updatedCart = cart.map(item => ({
          ...item,
          originalPrice: item.prix_unitaire,
          prix_unitaire: item.prix_unitaire - (item.prix_unitaire * percentage / 100)
        }));
        //console.log('upd', updatedCart)

        dispatch(updateCart(updatedCart));
        setPromoCode('');
      } else {
        console.log('Code promo invalide ou non actif.');
      }
    })
    .catch(error => {
      console.error('Une erreur s\'est produite lors de l\'appel API :', error);
    });
  };
  
  // Restaurer le prix d'origine
  const handleRemoveDiscount = () => {
    const updatedCart = cart.map(item => ({
      ...item,
      prix_unitaire: item.originalPrice 
    }));
  
    dispatch(updateCart(updatedCart));
    setPromoCode('');
  };
  
  
  return (
    <>
    <View style={{ ...defaultStyle, alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 5,paddingVertical:15,  marginBottom:70 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
         <TouchableOpacity onPress={handleBack}>
           <Icon name="arrow-back" size={30} color="#900" />
         </TouchableOpacity>
         <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>Mon Panier</Text>
       </View>
       <ScrollView  style={{
        marginVertical:10,
          // paddingVertical: 40,
          flex: 1,
        }}>
          {cart.map((item, index) => {
            if (item.type === 'formule'){
              
              const formule = item
              const { option1, option2,option3, prix, libelle, formuleImage, productIds, image, qty } = formule
              return (
                
                  <CardItemFormule
                    option1={option1}
                    option2={option2}
                    option3={option3}
                    prix_unitaire={prix}
                    incrementhandler={() => incrementhandler(index)}
                    decrementhandler={() => decrementhandler(item.productId, dispatch)}
                    image={formuleImage}
                    qty={qty}
                    key={index}
                  />
               
              );
            }
                return (
                  <CartItem 
                    libelle = {item.libelle}
                    prix_unitaire={item.prix || item.prix_unitaire}
                    incrementhandler={() => incrementhandler(index)}
                    decrementhandler={() => decrementhandler(item.productId, dispatch)}
                    image={item.image}
                    index={index}
                    qty={item.qty}
                    key={index}
                  />
                  );
              })}
              
       </ScrollView>
      
        <View  style={{ marginTop:10, alignItems:'center' }} >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Total des quantités : {totalQuantity}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Total de la commande : { totalPrice} euros
          </Text>

          <View style={{ flexDirection:'row', alignItems:'center', gap: 10, marginVertical:10 }}>
          <TextInput
            value={promoCode}
            onChangeText={(value) => setPromoCode(value)}
            placeholder="Code promo"
            style={{ width: 150, marginVertical: 10, borderWidth: 1, borderColor: 'lightgray', paddingHorizontal: 20, paddingVertical: 10 }}
          />
          <Icon name="done" size={30} color="#900" onPress={handleApplyDiscount} />
          <Icon name="clear" size={30} color="#900" onPress={handleRemoveDiscount} />
        </View>
            
          <Button 
              buttonColor='lightgray' 
              onPress={handleConfirm}
          >Confirmer ma commande</Button>
            
          
        </View>
        
    </View>
          <FooterProfile />
    </>

  )
  
}



export default Panier