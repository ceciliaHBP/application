import {View, Text, Pressable, ScrollView , TouchableOpacity, Image } from 'react-native'
import  Picker  from 'react-native-picker-select';
import { fonts, colors} from '../styles/styles'
import React, {useState, useEffect,  createRef,useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  updateUser} from '../reducers/authSlice';
import ProductCard from '../components/ProductCard'
import axios from 'axios'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FooterProfile from '../components/FooterProfile';
import { styles } from '../styles/home'; 
import { SearchBar } from 'react-native-elements';

import FormulesSalees from '../components/FormulesSalees';
import FormulesPetitDejeuner from '../components/FormulesPetitDejeuner';
import LinkOffres from '../components/LinkOffres';
import EnvieSalee from '../components/EnvieSalee';
import Catalogue from '../components/Catalogue';
import StorePicker from '../components/StorePicker';
import CustomDatePicker from '../components/CustomDatePicker';
import ArrowDown from '../SVG/ArrowDown';
import LoaderHome from './LoaderHome';
import SearchModal from '../components/SearchModal';
import ArrowLeft from '../SVG/ArrowLeft';

import {API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS} from '@env';
import Search from '../SVG/Search';

const Home =  ({navigation}) => {
  
 //pour les test
 if (__DEV__) {
  if (Platform.OS === 'android') {
      API_BASE_URL = API_BASE_URL_ANDROID;
  } else if (Platform.OS === 'ios') {
      API_BASE_URL = API_BASE_URL_IOS;  
  }
}

  const [stores, setStores] = useState([]);
  const [role, setRole] = useState('');
  // const [ selectedCategory, setSelectedCategory] = useState(null)
  const [ selectedOnglet, setSelectedOnglet] = useState(null)
  const [ products, setProducts] = useState([])
  const [ categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products); 
  const [ visible, setVisible] = useState(false)
  const [positionsY, setPositionsY] = useState({});
  const [isLoading, setIsLoading] = useState(true); 
  const [isModalVisible, setIsModalVisible] = useState(false);

  
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.cart);

  const totalPrice = Number((cart.reduce((total, item) => {
    const prix = item.prix || item.prix_unitaire; 
    return total + item.qty * prix;
  }, 0)).toFixed(2));

  const dispatch = useDispatch();
  const scrollViewRef = createRef();
  
  const allStores = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllStores`);
      //const response = await axios.get('http://10.0.2.2:8080/getAllStores');
      setStores(response.data);
    } catch (error) {
      console.error("Une erreur s'est produite, erreur stores :", error);
    }
  };

  useEffect(() => {
    allStores();
    setFilteredProducts(products)
  }, [products]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/getOne/${user.userId}`)
    //axios.get(`http://10.0.2.2:8080/getOne/${user.userId}`)
      .then(response => {
        const role  = response.data.role;
         setRole(role); 
         dispatch(updateUser(response.data))
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du rôle de l\'utilisateur:', error);
      });
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
      const response = await axios.get(`${API_BASE_URL}/getAllProducts`);
      //const response = await axios.get('http://10.0.2.2:8080/getAllProducts');
    
      const updatedProducts = response.data.map((product) => ({
        ...product,
        qty: 0, 
      }));
      //console.log('all products', updatedProducts)
      setProducts(updatedProducts);
      setCategories([...new Set(updatedProducts.map((product) => product.categorie)), 'Tous']);
      //setCategories(updatedProducts.map((product) => product.categorie));

      setTimeout(() => {
        setIsLoading(false); // Fin du chargement après la pause
      }, 5000);

      } catch (error) {
        console.error('Une erreur s\'est produite, error products :', error);
        setIsLoading(false)
      } 
    };
    fetchData(); // Appel de la fonction fetchData lors du montage du composant
  }, []);


//filtrage par catégorie
  // const categoryButtonHandler = (categorie) => {
  //   if (categorie === 'Tous') {
  //     setFilteredProducts(products);
  //     setSelectedCategory(null)
  //   } else {
  //     const filtered = products.filter((product) => product.categorie === categorie);
  //     setFilteredProducts(filtered);
  //     setSelectedCategory(categorie)
  //   }
  // }

//direction vers la page de détails
const handleProductPress = (product) => {
  navigation.navigate('details', { product });
};

//search
const handleSearch = (query) => {
  setSearchQuery(query);

  
  const filtered = products.filter((product) =>
    product.libelle ? product.libelle.toLowerCase().includes(query.toLowerCase()) : false
  );

  setFilteredProducts(filtered);
  // if (query.length >= 2) {
  //   setIsModalVisible(true);
  // } else if (query.length === 0) {
  //   setIsModalVisible(false);
  // }
  
  
};

const handleSelectProduct = (product) => {
  // Ici, mettez en place ce que vous voulez faire une fois qu'un produit est sélectionné.
  // Par exemple, ajoutez-le à un panier ou affichez des détails.
  setIsModalVisible(false);
  navigation.navigate('details', { product });
};

//classement par catégories
// const groupedAndSortedProducts = filteredProducts.reduce((acc, cur) => {

const groupedAndSortedProducts = products.reduce((acc, cur) => {
  (acc[cur.categorie] = acc[cur.categorie] || []).push(cur);
  return acc;
}, {});

const sortedCategories = Object.keys(groupedAndSortedProducts).sort();

//scrolltop
const scrollToTop = () => {
  if (scrollViewRef.current) {
    scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  }
};

//contenu visible
const toggleVisibility = () => {
  setVisible(!visible)
}

//scroll ref pour les differents onglets
const refs = {
  'Promos': useRef(null),
  'Baguettes': useRef(null),
  'Viennoiseries': useRef(null),
  'Formules': useRef(null),
  'Produits Salés': useRef(null),
  'Pâtisseries': useRef(null),
  'Pains Spéciaux': useRef(null),
  'Petits déjeuners': useRef(null),
  'Boissons': useRef(null),
  'Tarterie': useRef(null),
};

const onglets = Object.keys(refs);

const handleLayout = (onglet, event) => {
  const { y } = event.nativeEvent.layout;
  setPositionsY(prev => ({ ...prev, [onglet]: y }));
};
const ongletButtonHandler = (onglet) => {
  setSelectedOnglet(onglet);
  
  const positionY = positionsY[onglet];
  if (scrollViewRef.current && positionY !== undefined) {
    scrollViewRef.current.scrollTo({ x: 0, y: positionY, animated: true });
  }
};
//fin scroll onglets
  return (
    <>
    <View style={{flex:1}}>
    {isLoading ? (

        <LoaderHome />
      ) : (
      <View View style={{flex:1}}>

    <ScrollView vertical={true} style={{ flex:1, paddingVertical:20}} ref={scrollViewRef} stickyHeaderIndices={[1]}>
   
    <View >

    <View style={styles.bandeau}>
   
        <View style={{flexDirection:'row'}}>
        {
          user && 
          <View style={{paddingVertical:20, flexDirection:'row', alignItems:'center', justifyContent:'space-around', width:"100%"}}>
            <View >
              <Text style={{fontFamily:fonts.font1, fontSize:32, color:colors.color1}}>Bonjour </Text>
              <Text style={{fontSize:18, fontFamily:fonts.font2, color:colors.color1}}>{user.firstname}</Text>
            </View>
              
               {/* SearchBar */}
              {/* <SearchBar
              placeholder="Une petite faim ?"
              onChangeText={handleSearch}
              value={searchQuery}
              containerStyle={styles.searchBarContainer}
              inputContainerStyle={styles.searchBarInputContainer}
              inputStyle={{fontSize:12, }}
              placeholderTextColor={colors.color2}
              searchIcon={{ size: 20, color: colors.color2, margin:0 }} 
            /> */}
            <TouchableOpacity  onPress={() => setIsModalVisible(true)} activeOpacity={0.8} style={{backgroundColor:colors.color3, borderRadius:50, width:50, height:50, justifyContent: 'center', 
                 alignItems: 'center', }}>                           
                {/* <Image
                  source={require('../assets/search.png')} // Remplacez 'my-image' par le nom de votre image
                  style={{ width: 30, height: 30, resizeMode:'cover' }} // Remplacez ces valeurs par les dimensions souhaitées
                /> */}
                <Search />
                </TouchableOpacity> 
                
                <SearchModal
                  isVisible={isModalVisible}
                  products={filteredProducts}
                  onSelectProduct={handleSelectProduct}
                  onClose={() => setIsModalVisible(false)}
                  handleSearch={handleSearch} // Ajoutez cette ligne
                  searchQuery={searchQuery}   // Et celle-ci
                />
               
                
          </View>
        }
        </View>  
       
    </View>
    
      {/*  bandeau header */}
      <View style={{ width:"100%", height:80, backgroundColor:'white', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:5}}>
          <View style={{ flexDirection:'row', gap:20, alignItems:'center',justifyContent:'center', width:"100%"}}>
              
            <View>
            <StorePicker />
            </View> 

            <View >
              <CustomDatePicker />
            </View>

            <View style={{width: 2, backgroundColor: colors.color2, marginVertical: 5}} /> 


            <View style={{backgroundColor:'white'}}> 
              <TouchableOpacity  onPress={toggleVisibility} activeOpacity={1} >
                <ArrowDown />
              </TouchableOpacity>
          </View>
          </View>
          
        </View>
        {
          visible && (
            <View style={{ width:"100%", height:'auto', backgroundColor:'white', flexDirection:'column', paddingHorizontal:25, borderBottomLeftRadius:10, borderBottomRightRadius:10, paddingVertical:10}}> 
              <Text style={{fontWeight:"bold"}}>Vos articles:</Text>
            {cart.map((item, index) => (
                <View key={index} style={{paddingLeft:20}}>
                    <Text> {item.qty} x {item.libelle}</Text>
                </View>
            ))}
            <Text style={{fontWeight:"bold", paddingVertical:10}}>Votre total: {totalPrice}€</Text>

            </View>
          )
        }
      
      </View>

      {/* categories */}
      {/* <View style={styles.categories} >
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} >
        {
          categories.map((item, index) => (
            <Pressable title="button" 
              style={{...styles.btn_categorie, 
              backgroundColor: item === (selectedCategory || 'Tous') ? colors.color2 : 'white', 
             
            }}
              key={index}
              onPress={() => categoryButtonHandler(item)}
            >
              <Text style={{fontSize:16, fontFamily:fonts.font2,fontWeight:"600",
                color: item === (selectedCategory || 'Tous') ? 'white' : colors.color1
                }}>{item}</Text>
            </Pressable>
          ))
        }
        </ScrollView>
      </View> */}

      {/* onglet ancres */}
  

      <View style={styles.categories} >

        <ScrollView horizontal showsHorizontalScrollIndicator={false} >
        {
          onglets.map((item, index) => (
            <Pressable title="button" 
              style={{...styles.btn_categorie, 
                backgroundColor: item === 'Promos' ? colors.color2 : 'white', 
             
            }}
              key={index}
              onPress={() => ongletButtonHandler(item)}
            >
              <View style={{flexDirection:'row', alignItems:'center', gap:6}}>
                <Text style={{fontSize:16, fontFamily:fonts.font2,fontWeight: "600",
                   color: item === 'Promos' ? 'white' : colors.color1, 
                  }}>{item}</Text>
                  
                 {item === 'Promos' && 
                 
                 <Image
                    source={require('../assets/promos.png')} 
                    style={{ width: 15, height: 15, resizeMode:'cover' }}
                   
                />
                }
                 
              </View>
            </Pressable>
          ))
        }
        </ScrollView>
      </View>

          {/* link - anti gaspi -  */}
          <View onLayout={(event) => handleLayout('Promos', event)} style={styles.paddingProduct}>
           <LinkOffres />
          </View>
          
              
           {/* card products */}
          {/* <View style={style.cardScrollview}> */}
            {sortedCategories
              .filter(category => category === 'Baguettes')
              .map((category) => (
                <View key={category} onLayout={(event) => handleLayout('Baguettes', event)} style={styles.paddingProduct}>

              {/* <React.Fragment key={category}> */}
                <Text style={styles.categoryTitle}>{category}</Text>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollHorizontal} >
                {groupedAndSortedProducts[category]
                //ajouter un ordre de catégorie peut etre ?
                //.sort((a, b) => a.libelle.localeCompare(b.libelle))
                .map((item, index) => (
                  <View key={item.productId} style={styles.productContainer}>
                    <TouchableOpacity
                      key={item.productId}
                      onPress={() => handleProductPress(item)}
                      activeOpacity={1}
                    >
                      <ProductCard
                        libelle={item.libelle}
                        key={item.productId}
                        id={item.productId}
                        index={index}
                        image={item.image}
                        prix={item.prix_unitaire}
                        prixSUN={item.prix_remise_collaborateur}
                        qty={item.qty}
                        stock={item.stock}
                        offre={item.offre}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              
              </ScrollView>
              {/* </React.Fragment> */}
              </View>
            ))}
          {/* </View > */}

            {sortedCategories
              .filter(category => category ===  'Viennoiseries')
              .map((category) => (
                <View key={category} onLayout={(event) => handleLayout('Viennoiseries', event)} style={styles.paddingProduct}>

              {/* <React.Fragment key={category}> */}
                <Text style={styles.categoryTitle}>{category}</Text>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollHorizontal} >
                {groupedAndSortedProducts[category]
                //ajouter un ordre de catégorie peut etre ?
                //.sort((a, b) => a.libelle.localeCompare(b.libelle))
                .map((item, index) => (
                  <View key={item.productId} style={styles.productContainer}>
                    <TouchableOpacity
                      key={item.productId}
                      onPress={() => handleProductPress(item)}
                      activeOpacity={1}
                    >
                      <ProductCard
                        libelle={item.libelle}
                        key={item.productId}
                        id={item.productId}
                        index={index}
                        image={item.image}
                        prix={item.prix_unitaire}
                        prixSUN={item.prix_remise_collaborateur}
                        qty={item.qty}
                        stock={item.stock}
                        offre={item.offre}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              
              </ScrollView>
              {/* </React.Fragment> */}
              </View>
            ))}

          {/* Link page Formule */}
          <View onLayout={(event) => handleLayout('Formules', event)} style={styles.paddingProduct}>
            <FormulesSalees />
          </View>

          {/* envie de salé */}
       
         <View onLayout={(event) => handleLayout('Produits Salés', event)} style={styles.paddingProduct}>
          <EnvieSalee />
        </View>

            {/* patisseries */}
            {sortedCategories
              .filter(category => category ===  'Pâtisseries')
              .map((category) => (
                <View key={category} onLayout={(event) => handleLayout('Pâtisseries', event)} style={styles.paddingProduct}>
              {/* <React.Fragment key={category}> */}
                <Text style={styles.categoryTitle}>{category}</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollHorizontal} >
                {groupedAndSortedProducts[category]
                //ajouter un ordre de catégorie peut etre ?
                //.sort((a, b) => a.libelle.localeCompare(b.libelle))
                .map((item, index) => (
                  <View key={item.productId} style={styles.productContainer}>
                    <TouchableOpacity
                      key={item.productId}
                      onPress={() => handleProductPress(item)}
                      activeOpacity={1}
                    >
                      <ProductCard
                        libelle={item.libelle}
                        key={item.productId}
                        id={item.productId}
                        index={index}
                        image={item.image}
                        prix={item.prix_unitaire}
                        prixSUN={item.prix_remise_collaborateur}
                        qty={item.qty}
                        stock={item.stock}
                        offre={item.offre}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              {/* </React.Fragment> */}
               </View>
            ))}

            {/* pains speciaux */}
            {sortedCategories
              .filter(category => category ===  'Boules et Pains Spéciaux')
              .map((category) => (
                <View key={category} onLayout={(event) => handleLayout('Pains Spéciaux', event)} style={styles.paddingProduct}>

              {/* <React.Fragment key={category}> */}
                <Text style={styles.categoryTitle}>{category}</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollHorizontal} >
                {groupedAndSortedProducts[category]
                //ajouter un ordre de catégorie peut etre ?
                //.sort((a, b) => a.libelle.localeCompare(b.libelle))
                .map((item, index) => (
                  <View key={item.productId} style={styles.productContainer}>
                    <TouchableOpacity
                      key={item.productId}
                      onPress={() => handleProductPress(item)}
                      activeOpacity={1}
                    >
                      <ProductCard
                        libelle={item.libelle}
                        key={item.productId}
                        id={item.productId}
                        index={index}
                        image={item.image}
                        prix={item.prix_unitaire}
                        prixSUN={item.prix_remise_collaborateur}
                        qty={item.qty}
                        stock={item.stock}
                        offre={item.offre}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              {/* </React.Fragment> */}
              </View>
            ))}


            {/* formules petits dejeuners */}
            {user.role == 'client' &&
            <View onLayout={(event) => handleLayout('Petits déjeuners', event)} style={styles.paddingProduct}>
            <FormulesPetitDejeuner />
            </View>
            }
            
            {/* boissons */}
            {sortedCategories
              .filter(category => category ===  'Boissons')
              .map((category) => (
                <View key={category} onLayout={(event) => handleLayout('Boissons', event)} style={styles.paddingProduct}>

              {/* <React.Fragment key={category}> */}
                <Text style={styles.categoryTitle}>{category}</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollHorizontal} >
                {groupedAndSortedProducts[category]
                //ajouter un ordre de catégorie peut etre ?
                //.sort((a, b) => a.libelle.localeCompare(b.libelle))
                .map((item, index) => (
                  <View key={item.productId} style={styles.productContainer}>
                    <TouchableOpacity
                      key={item.productId}
                      onPress={() => handleProductPress(item)}
                      activeOpacity={1}
                    >
                      <ProductCard
                        libelle={item.libelle}
                        key={item.productId}
                        id={item.productId}
                        index={index}
                        image={item.image}
                        prix={item.prix_unitaire}
                        prixSUN={item.prix_remise_collaborateur}
                        qty={item.qty}
                        stock={item.stock}
                        offre={item.offre}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              {/* </React.Fragment> */}
              </View>
            ))}
                

            {/* catalogue */}
            <View onLayout={(event) => handleLayout('Tarterie', event)} style={styles.paddingProduct}>
              <Catalogue />
            </View>

          {/* <TouchableOpacity onPress={scrollToTop} >
             <Icon name="arrow-upward" size={30} style={styles.scrollTop}   />
          </TouchableOpacity> */}
          <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableOpacity style={styles.scrollTop }  onPress={scrollToTop}>
                {/* <Icon name={'keyboard-arrow-up'} size={30} color={colors.color4}  /> */}
                <ArrowDown />
              </TouchableOpacity>
          </View>
          
     </ScrollView>
     <FooterProfile />
     </View>
      )}
    
    </View>
    
  
  
 </>
  )
}
 export default Home


