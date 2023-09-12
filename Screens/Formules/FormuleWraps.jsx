import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Switch, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fonts, colors} from '../../styles/styles'
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import { addToCart} from '../../reducers/cartSlice';
import { useSelector, useDispatch } from 'react-redux'
import { getProductsByCategory, fetchOneProduct, fetchDessertIds, fetchBoissonIds } from '../../CallApi/api.js'
import { style } from '../../styles/formules'; 
import FooterProfile from '../../components/FooterProfile';
import ArrowLeft from '../../SVG/ArrowLeft';
import ProductCard from '../../components/ProductCard';
import {  API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS } from '@env';
import FastImage from 'react-native-fast-image'
import { getStyle } from '../../Fonctions/stylesFormule';
import Check from '../../SVG/Check';


const FormuleWraps = ({navigation}) => {

    const [ products, setProducts] = useState([]);
    const [ desserts, setDesserts] = useState([]);
    const [ boissons, setBoissons] = useState([]);
    const [dessertSwitch, setDessertSwitch] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedDessert, setSelectedDessert] = useState(null);
    const [selectedBoisson, setSelectedBoisson] = useState(null);
    const [prix, setTotalPrice] = useState(0);
    const [productIds, setProductIds] = useState([]);

    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart.cart);

    const handleBack = () => {
        navigation.navigate('home')
      }

      useEffect(() => {
        //les sandwichs - categorie
        const fetchProducts = async () => {
          try {
            const category = 'Wraps'; 
            const products = await getProductsByCategory(category);
            const updatedProducts = products.filter(product => product.clickandcollect ===  true);
              setProducts(updatedProducts)
          } catch (error) {
            console.error('Une erreur s\'est produite lors de la récupération des produits:', error);
          }
        };
    
        fetchProducts();

        //les desserts - par id
        const getDessertDetails = async () => {
          try {
            // Récupération des IDs
            const response = await fetchDessertIds();
            //console.log('response', response);
          
            // // Récupération des détails pour chaque ID
             const productPromises = response.map((productId) => fetchOneProduct(productId));
             const desserts = await Promise.all(productPromises);
             const updtatedDesserts = desserts.filter(product => product.clickandcollect ===  true);
            setDesserts(updtatedDesserts);
          } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération du produit:", error);
          }
        };
        getDessertDetails();

         //les boisssons - par catégories
      //    const fetchBoissons = async () => {
      //     try {
      //       const category = 'Boissons'; 
      //       const boissons = await getProductsByCategory(category);
      //       boissons.forEach((boisson) => {
      //           console.log(boisson.libelle, boisson.prix_formule);
      //         });
      //         setBoissons(boissons)
      //     } catch (error) {
      //       console.error('Une erreur s\'est produite lors de la récupération des produits:', error);
      //     }
      //   };
      //  fetchBoissons()

       //les boissons - par id
       const getBoissonDetails = async () => {
        try {
          // Récupération des IDs
          const response = await fetchBoissonIds();
          //console.log('response', response);
        
          // // Récupération des détails pour chaque ID
           const productPromises = response.map((productId) => fetchOneProduct(productId));
           const boissons = await Promise.all(productPromises);
           const updatedBoissons = boissons.filter(product => product.clickandcollect ===  true);

          setBoissons(updatedBoissons);
        } catch (error) {
          console.error("Une erreur s'est produite lors de la récupération du produit:", error);
        }
      };
      getBoissonDetails();
        
      }, []);

    const handleSandwich = (product) => {
      if (selectedProduct?.productId === product.productId) {
          setSelectedProduct(null); 
          setProductIds(productIds.filter(productId => productId !== product.productId));
      } else {
          setSelectedProduct(product); 
          setProductIds([...productIds, product.productId]);
      }
  }
  const handleDessert = (product) => {
    if(!selectedProduct ) {
      Toast.show({
          type: 'error',
          text1: 'Attention',
          text2: 'Veuillez sélectionner un wrap',
      });
      return;
    }
    if (selectedDessert?.productId === product.productId) {
        setSelectedDessert(null); 
        setProductIds(productIds.filter(productId => productId !== product.productId));
    } else {
        setSelectedDessert(product); 
        setProductIds([...productIds, product.productId]);
    }
  }
  const handleBoisson = (product) => {
    if(!selectedProduct ) {
      Toast.show({
          type: 'error',
          text1: 'Attention',
          text2: 'Veuillez sélectionner un wrap',
      });
      return;
    }
    if (selectedBoisson?.productId === product.productId) {
        setSelectedBoisson(null); 
        setProductIds(productIds.filter(productId => productId !== product.productId));
    } else {
        setSelectedBoisson(product); 
        setProductIds([...productIds, product.productId]);
    }
  }

      useEffect(() => {
        calculateTotalPrice();
      }, [selectedProduct, selectedDessert,selectedBoisson, dessertSwitch]);
      
      const calculateTotalPrice = () => {
        let prix = 0;
        
        if (selectedProduct) {
          prix += parseFloat(selectedProduct.prix_unitaire) || 0;
        }
      
        if (selectedDessert) {
          prix += parseFloat(selectedDessert.prix_formule) || 0;
        }

        if (selectedBoisson) {
          prix += parseFloat(selectedBoisson.prix_formule) || 0;
        }
      
        setTotalPrice(prix);
    };

    const handleFormuleSelection = () => {
      const formule = {
        id: `formule-${Date.now()}`,
        type: 'formule',
        option1: selectedProduct,
        option2: selectedDessert ? selectedDessert : null,
        option3:selectedBoisson ? selectedBoisson : null,
        prix: prix,
        libelle:"Formule Wrap",
        formuleImage: require('../../assets/Formule32.jpg'),
        productIds: productIds,
        qty: 1,
      }
      dispatch(addToCart(formule));
      navigation.navigate('panier')
    }
      
  return (
    <View style={{flex:1}}>
      <View style={{paddingTop:50}}></View>
      <ScrollView>
        <View>
            {/* <Image
                    source={require('../../assets/Formule32.jpg')} 
                    style={{ width: "100%", height: 330, resizeMode:'cover' }}
                /> */}
            <FastImage
              source={require('../../assets/Formule32.jpg')}
              style={{ width: "100%", height: 330 }}
              resizeMode={FastImage.resizeMode.cover}
            />

                  <View style={{flexDirection:'row',justifyContent:'space-between', width:"100%" , alignItems:'center', position:'absolute', top:30, paddingHorizontal:30}}>
                    <Text style={style.titleProduct}>Wraps</Text>
                    <TouchableOpacity  onPress={handleBack} activeOpacity={1} style={{ backgroundColor:'black', borderRadius:25}}>
                      <ArrowLeft fill="white"/>
                    </TouchableOpacity>
                  </View>
        </View>
        <View style={{padding:30}}>
            <Text style={style.title}>Wraps</Text>
            <Text>"Notre Wrap est pratique et savoureux. Des ingrédients bien choisis pour un repas rapide."</Text>
        </View>
        {/* choix sandwich */}
        <View>
            <Text style={style.choixTitle}>Votre choix de wrap</Text>
            <ScrollView horizontal={true} style={style.scrollProduct}>
                {products.map((product, index) => (
                  <View key={product.productId} style={{flexDirection:'column', justifyContent:'center'}}>
                    <TouchableOpacity  style={{gap:10,flexDirection:'column',  justifyContent:'center', alignItems:'center', margin:10}}
                    onPress={() => handleSandwich(product)}>
                       
                       <View style={getStyle(selectedProduct, product)} key={index}>
                      <ProductCard
                        libelle={product.libelle}
                        key={product.productId}
                        id={product.productId}
                        index={index}
                        image={product.image}
                        prix={product.prix_unitaire}
                        prixSUN={product.prix_remise_collaborateur}
                        qty={product.qty}
                        stock={product.stock}
                        offre={product.offre}
                        showButtons={false} 
                        showPromo={false}
                      />
                      {selectedProduct?.productId === product.productId && <Check color={colors.color9}/>}

                      </View>
                       
                    </TouchableOpacity>
                  </View>    
                ))}
            </ScrollView>
        </View>
        {/* choix desserts */}
        <View>
          <View style={{...style.choixTitle,flexDirection:'row', gap:10, justifyContent:'center', alignItems:'center'}}>
              <Text style={style.choixTitle}>Les desserts  </Text>
              <Text style={{fontSize:12}}>(pour 2€ en +)</Text>
              
          </View>
            <ScrollView horizontal={true} style={style.scrollProduct}>
                {desserts.map((product, index) => (
                  <View key={product.productId} style={{flexDirection:'column', justifyContent:'center'}}>
                    <TouchableOpacity  style={{gap:10,flexDirection:'column',  justifyContent:'center', alignItems:'center', margin:10}}
                    onPress={() => handleDessert(product)} >
                       
                       <View style={getStyle(selectedDessert, product)} key={index}>
                      <ProductCard
                        libelle={product.libelle}
                        key={product.productId}
                        id={product.productId}
                        index={index}
                        image={product.image}
                        prix={product.prix_unitaire}
                        prixSUN={product.prix_remise_collaborateur}
                        qty={product.qty}
                        stock={product.stock}
                        offre={product.offre}
                        showButtons={false} 
                        showPromo={false}
                      />
                      {selectedDessert?.productId === product.productId && <Check color={colors.color9}/>}

                      </View>
                         
                    </TouchableOpacity>
                  </View>     
                ))}
            </ScrollView>
        </View>

        {/* choix boissons */}
        <View>
          <View style={{...style.choixTitle,flexDirection:'row', gap:10, justifyContent:'center', alignItems:'center'}}>
              <Text style={style.choixTitle}>Les boissons  </Text>
              <Text style={{fontSize:12}}>(pour 2€ en +)</Text>
          </View>
            <ScrollView horizontal={true} style={style.scrollProduct}>
                {boissons.map((product, index) => (
                  <View key={product.productId} style={{flexDirection:'column', justifyContent:'center'}}>
                    <TouchableOpacity  style={{gap:10,flexDirection:'column',  justifyContent:'center', alignItems:'center', margin:10}}
                     onPress={() => handleBoisson(product)} >
                       
                       <View style={getStyle(selectedBoisson, product)} key={index}>
                      <ProductCard
                        libelle={product.libelle}
                        key={product.productId}
                        id={product.productId}
                        index={index}
                        image={product.image}
                        prix={product.prix_unitaire}
                        prixSUN={product.prix_remise_collaborateur}
                        qty={product.qty}
                        stock={product.stock}
                        offre={product.offre}
                        showButtons={false} 
                        showPromo={false}
                      />
                      {selectedBoisson?.productId === product.productId && <Check color={colors.color9}/>}

                      </View>
                      
                    </TouchableOpacity>
                  </View>     
                ))}
            </ScrollView>
        </View>

    </ScrollView>

    <View style={style.menu}>
        <View>
          <View style={style.bandeauFormule}>
          <Text style={{ fontWeight:"bold"}}>Prix de la formule</Text>
          {selectedProduct && typeof prix === 'number' && <Text>{prix.toFixed(2)} €</Text>}
          </View>
          <View style={style.bandeauFormule}>
            <View style={{flexDirection:'row'}}>
            <Text>Avec</Text><Image source={require('../../assets/sun.jpg')} style={{ width: 50, height: 20, resizeMode:'contain' }}/>
            </View>
          {selectedProduct && typeof prix === 'number' && <Text style={{color:colors.color2, fontWeight:"bold"}}>{(prix*0.8).toFixed(2)} €</Text>}
          </View>
        </View>
        <TouchableOpacity style={[
        style.btn, 
        !selectedProduct ? style.disabledBtn : {}]}  
        onPress={handleFormuleSelection} 
        disabled={!selectedProduct}
        activeOpacity={selectedProduct ? 0.2 : 0.8}>
            <Text style={{color:colors.color6}}>Choisir cette formule</Text>
      </TouchableOpacity>
    </View>
    <FooterProfile />
    </View> 
  )
}
export default FormuleWraps