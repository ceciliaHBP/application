import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createNavigationContainerRef} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser, updateSelectedStore} from './reducers/authSlice';
import {configureAxiosHeaders} from './Fonctions/fonctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import App from './Screens/App';
import Login from './Screens/Login';
import Signup from './Screens/Signup';
import Home from './Screens/Home';
import Panier from './Screens/Panier';
import SuccessPage from './Screens/SuccessPage';
import ChoixPaiement from './Screens/ChoixPaiement';
import OrderConfirmation from './Screens/OrderConfirmation';
import Stores from './Screens/Stores';
import Profile from './Screens/Profile';
import ProductDetails from './Screens/ProductDetails';
import Orders from './Screens/Orders';
import Cookies from './Screens/Cookies';
import Donnees from './Screens/Donnees';
import Mentions from './Screens/Mentions';
import FormuleSandwich from './Screens/Formules/FormuleSandwich';
import FormulePoke from './Screens/Formules/FormulePoke';
import FormuleSalade from './Screens/Formules/FormuleSalades';
import FormulePizzas from './Screens/Formules/FormulePizzas';
import FormuleWraps from './Screens/Formules/FormuleWraps';
import FormulePainBagnat from './Screens/Formules/FormulePainBagnat';
import FormuleBurger from './Screens/Formules/FormuleBurger';
import FormuleCroques from './Screens/Formules/FormuleCroque';
import FormulePanini from './Screens/Formules/FormulePanini';
import FormuleQuiche from './Screens/Formules/FormuleQuiche';
import PageSandwich from './Screens/PagesSalees/PageSandwich';
import FormuleArtisan from './Screens/Formules/FormuleArtisan';
import FormulePetitDejeuner from './Screens/Formules/FormulePetitDejeuner';
import FormulePetitDejeunerGourmand from './Screens/Formules/FormulePetitDejeunerGourmand';
import FormulePlatsChauds from './Screens/Formules/FormulePlatsChauds';
import Offre31 from './Screens/Offre31';
import Solanid from './Screens/Solanid';
import PageWrap from './Screens/PagesSalees/PageWrap';
import PageSalade from './Screens/PagesSalees/PageSalade';
import PageBurger from './Screens/PagesSalees/PageBurger';
import PagePanini from './Screens/PagesSalees/PagePanini';
import PagePainBagnat from './Screens/PagesSalees/PagePainBagnat';
import PageQuiche from './Screens/PagesSalees/PageQuiche';
import PageCroque from './Screens/PagesSalees/PageCroque';
import Pwd from './Screens/Pwd';
import LoaderHome from './Screens/LoaderHome';
import PagePizza from './Screens/PagesSalees/PagePizza';
import Antigaspi from './Screens/Antigaspi';
import PagePlatChaud from './Screens/PagesSalees/PagePlatChaud';
export const navigationRef = createNavigationContainerRef();
import axios from 'axios';
import OffreNoel from './Screens/OffreNoel';
import AppUpdateChecker from './components/AppUpdateChecker';
import DeviceInfo from 'react-native-device-info';
import Maintenance from './Screens/Maintenance';
import CancelPage from './Screens/CancelPage';
// import PageHome from './Screens/PageHome';
// import {API_BASE_URL} from '@env';
import { API_BASE_URL } from './config';

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isUpdateRequired) {
      if (navigationRef.current && navigationRef.current.navigate) {
        navigationRef.current.navigate('update');
      }
    }
  }, [isUpdateRequired]);

  useEffect(() => {
    configureAxiosHeaders();
    checkForUpdates();
    axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.response && error.response.status === 401) {
          // Vérifier si l'utilisateur est déjà connecté
          const token = await AsyncStorage.getItem('userToken');
          if (token) {
            // L'utilisateur est connecté mais le token est expiré
            await AsyncStorage.removeItem('userToken');
            if (navigationRef.current && navigationRef.current.navigate) {
              navigationRef.current.navigate('login');
              setTimeout(() => {
                Toast.show({
                  type: 'error',
                  text1: `Votre session a expiré`,
                  text2: `Veuillez vous reconnecter`,
                });
              }, 500);
            }
          } else if (error.response && error.response.status === 403) {
            // Pas de token présent, gérer différemment
            // Par exemple, ne rien faire ou afficher un message différent
            console.log('pas de header');
          }
        }
        return Promise.reject(error);
      },
    );
  });

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');

        const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));

        const storedSelectedStore = JSON.parse(
          await AsyncStorage.getItem('selectedStore'),
        );
        //console.log('store Main 1', storedSelectedStore)

        if (token && userInfo) {
          //console.log('token trouvé')
          setIsLoggedin(true);
          dispatch(loginUser(userInfo));

          if (storedSelectedStore) {
            dispatch(updateSelectedStore(storedSelectedStore));
            //console.log('store Main 2', storedSelectedStore)
          }
        }
      } catch (error) {
        // console.error("Erreur lors de la vérification du token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  const Stack = createNativeStackNavigator();

  const linking = {
    prefixes: ['clickandcollect://'],
    config: {
      screens: {
        success: 'success',
        cancel: 'cancel',
        pwd: 'pwd',
        login: 'login',
      },
    },
  };

  const checkForUpdates = async () => {
    try {
      //version actuelle de l'application
      const currentVersion = DeviceInfo.getVersion();
      const response = await axios.get(`${API_BASE_URL}/versionApp`);
      const latestVersion = response.data.version;
      // console.log('response', response.data.version)
      // console.log('version mobile', currentVersion);
      // console.log('version store', latestVersion);
      if (currentVersion < latestVersion) {
        setIsUpdateRequired(true);
        //console.log('mise à jour dispo');

        //console.log(isUpdateRequired);

      }
    } catch (error) {
      //console.error('Erreur lors de la vérification des mises à jour:', error);
      setIsUpdateRequired(false);
    }
  };

  if (isLoading) {
    return <LoaderHome />;
  }
  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={
          isUpdateRequired === true ? 'update' : isLoggedin ? 'home' : 'login'
        }
        screenOptions={{headerShown: false}}>
        {/* <Stack.Screen name='app' component={App}/> */}
        {isUpdateRequired && (
          <Stack.Screen name="update" component={AppUpdateChecker} />
        )}
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="signup" component={Signup} />
        <Stack.Screen name="stores" component={Stores} />
        <Stack.Screen name="home" component={Home} />
        <Stack.Screen name="maintenance" component={Maintenance} />

        {/*  Formules  */}
        <Stack.Screen name="formulesandwich" component={FormuleSandwich} />
        <Stack.Screen name="formulepoke" component={FormulePoke} />
        <Stack.Screen name="formulesalade" component={FormuleSalade} />
        <Stack.Screen name="formulepizza" component={FormulePizzas} />
        <Stack.Screen name="formulewrap" component={FormuleWraps} />
        <Stack.Screen name="formulepainbagnat" component={FormulePainBagnat} />
        <Stack.Screen name="formuleburger" component={FormuleBurger} />
        <Stack.Screen name="formulecroque" component={FormuleCroques} />
        <Stack.Screen name="formulepanini" component={FormulePanini} />
        <Stack.Screen name="formulequiche" component={FormuleQuiche} />
        <Stack.Screen
          name="formuleplatschauds"
          component={FormulePlatsChauds}
        />

        {/* Pages salées */}
        <Stack.Screen name="sandwich" component={PageSandwich} />
        <Stack.Screen name="pizza" component={PagePizza} />
        <Stack.Screen name="wrap" component={PageWrap} />
        <Stack.Screen name="salade" component={PageSalade} />
        <Stack.Screen name="burger" component={PageBurger} />
        <Stack.Screen name="panini" component={PagePanini} />
        <Stack.Screen name="painbagnat" component={PagePainBagnat} />
        <Stack.Screen name="quiche" component={PageQuiche} />
        <Stack.Screen name="croque" component={PageCroque} />
        <Stack.Screen name="platchaud" component={PagePlatChaud} />
        {/* Formules petit dejeuner */}
        <Stack.Screen name="artisan" component={FormuleArtisan} />
        <Stack.Screen name="petitdej" component={FormulePetitDejeuner} />
        <Stack.Screen
          name="petitdejgourmand"
          component={FormulePetitDejeunerGourmand}
        />
        {/* Link Offres */}
        <Stack.Screen name="antigaspi" component={Antigaspi} />
        <Stack.Screen name="offre31" component={Offre31} />
        <Stack.Screen name="solanid" component={Solanid} />
        <Stack.Screen name="noel" component={OffreNoel} />
        <Stack.Screen name="details" component={ProductDetails} />
        <Stack.Screen name="profile" component={Profile} />
        <Stack.Screen name="orders" component={Orders} />
        <Stack.Screen name="panier" component={Panier} />
        {/* <Stack.Screen name='choixpaiement' component={ChoixPaiement}/> */}
        {/* <Stack.Screen name='orderconfirm' component={OrderConfirmation}/> */}
        <Stack.Screen name="success" component={SuccessPage} />
        <Stack.Screen name="cancel" component={CancelPage} />
        <Stack.Screen name="pwd" component={Pwd} />
        <Stack.Screen name="cookies" component={Cookies} />
        <Stack.Screen name="donnees" component={Donnees} />
        <Stack.Screen name="mentions" component={Mentions} />
      </Stack.Navigator>

      <Toast position="bottom" />
    </NavigationContainer>
  );
};
export default Main;
