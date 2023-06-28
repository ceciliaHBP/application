import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack' 
import  Toast  from 'react-native-toast-message'
import App from './Screens/App'
import Login from './Screens/Login'
import Signup from './Screens/Signup'
import Home from './Screens/Home'
import Panier from './Screens/Panier'
import SuccessPage from './Screens/SuccessPage'
import ChoixPaiement from './Screens/ChoixPaiement'
import OrderConfirmation from './Screens/OrderConfirmation'

const Main = () => {

    const Stack = createNativeStackNavigator();

    const linking = {
      prefixes: ['clickandcollect://'],
      config: {
        screens: {
          success: 'success',
          // echec: 'echec',
        },
      },
    };

      return (
        <NavigationContainer linking={linking}>
            <Stack.Navigator initialRouteName='app' screenOptions={{headerShown:false}}>
                <Stack.Screen name='app' component={App}/>
                <Stack.Screen name='login' component={Login}/>
                <Stack.Screen name='signup' component={Signup}/>
                <Stack.Screen name='home' component={Home}/>
                <Stack.Screen name='panier' component={Panier}/>
                <Stack.Screen name='choixpaiement' component={ChoixPaiement}/>
                <Stack.Screen name='orderconfirm' component={OrderConfirmation}/>
                <Stack.Screen name='success' component={SuccessPage}/>
            </Stack.Navigator>

            <Toast  position="bottom"/>
        </NavigationContainer>
        
      )
    }
export default Main
