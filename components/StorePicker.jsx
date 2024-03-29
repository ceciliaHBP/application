import {View, Image, Text, Platform, StyleSheet } from 'react-native'
import  Picker  from 'react-native-picker-select';
import SelectDropdown from 'react-native-select-dropdown'
import React, {useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateSelectedStore, updateUser} from '../reducers/authSlice';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { fonts, colors} from '../styles/styles'
import { styles } from '../styles/home'; 

//import { pickerSelectStyles } from '../styles/home';

// import {  API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS } from '@env';
import { API_BASE_URL } from '../config'; 
import Location from '../SVG/Location';

const StorePicker = () => {

    const [stores, setStores] = useState([]);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    //console.log(user.role)
    const [selectedStoreDetails, setSelectedStoreDetails] = useState({});

    //console.log('select', selectedStore)


  useEffect(() => {
    fetchSelectedStoreDetails();

    if (user && user.role) {
        allStores();
    }
}, [user.role, user.storeId]);

   
    const allStores = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/getStoresByRole`, { role: user.role });
            if (response.data && Array.isArray(response.data)) {
              //console.log('stores', response.data)
                setStores(response.data);
            } else {
                console.error("Réponse inattendue de l'API.");
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des magasins :", error);
        }
      };
      
    
    // function formatLabel(label) {
    //     const splitLabel = label.split(' '); // Divisez le label par les espaces
    //     if (splitLabel.length <= 1) return label; // Si c'est un seul mot, retournez-le tel quel
    
    //     const midPoint = Math.ceil(splitLabel.length / 2); 
    //     const firstHalf = splitLabel.slice(0, midPoint).join(' ');
    //     const secondHalf = splitLabel.slice(midPoint).join(' ');
    
    //     return `${firstHalf}\n${secondHalf}`; // Retournez les deux moitiés avec un saut de ligne entre elles
    // }
    
    const fetchSelectedStoreDetails = async () => {
        // if(user.storeId) {
            try {
                const response = await axios.get(`${API_BASE_URL}/getOneStore/${user.storeId}`);
                if(response.data) {
                    setSelectedStoreDetails(response.data);
                    // console.log(response.data.nom_magasin)
                }
            } catch (error) {
                console.log("Erreur lors de la récupération des détails du magasin :", error);
            }
        //}
    };

    
    
    return (
        <View style={{ width:160, height:80, backgroundColor:'white', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
            {/* <View style={{ flexDirection:'row', gap:5, alignItems:'center', }}> */}
                {/* <Image
                    source={require('../assets/store.png')} 
                    style={{ width: 24, height: 25, resizeMode:'contain' }}
                /> */}
             
                <View style={{flexDirection:'column'}}>   
                    {
                        user.role == 'SUNcollaborateur' && 
                        <View style={{flexDirection:'row', gap:5, alignItems:'center', justifyContent:'center', paddingBottom: Platform.OS === 'ios' ? 8 : 0,}}>
                            <Location />
                            <Text style={{...styles.textPickerDate,   textAlign:'center'}}>Livraison</Text>
                        </View>
                    }
                    {
                        Platform.OS === 'android' ? (
                           <SelectDropdown
                           key={selectedStoreDetails.nom_magasin}
                           	data={stores.map(store => store.nom_magasin)}  
                            onSelect={(selectedItem, index) => {
                                const selected = stores.find(store => store.nom_magasin === selectedItem);
                                     if (selected) {
                                             dispatch(updateUser({ ...user, storeId: selected.storeId }));
                                            // dispatch(updateSelectedStore(selected));
                                            setSelectedStoreDetails(selected);
                                             axios.put(`${API_BASE_URL}/updateOneUser/${user.userId}`, {storeId: selected.storeId})
                                                .then(response => {
                                                 // console.log('Le choix du magasin a été mis à jour avec succès dans la base de données');
                                                 })
                                                  .catch(error => {
                                                   console.error('Erreur lors de la mise à jour du choix du magasin dans la base de données - erreur ici:', error);
                                                    });
                                     } else {
                                      console.log('pas de magasin sélectionné encore')
                                       }
                                   }}
                           	buttonTextAfterSelection={(selectedItem, index) => {
                           		// text represented after item is selected
                           		// if data array is an array of objects then return selectedItem.property to render after item is selected
                           		return selectedItem
                           	}}
                           	rowTextForSelection={(item, index) => {
                           		// text represented for each item in dropdown
                           		// if data array is an array of objects then return item.property to represent item in dropdown
                           		return item
                           	}}
                           	buttonStyle={{backgroundColor:'transparent', width:160, height:30,padding:0,  }}
                           	buttonTextStyle={{fontSize:10, fontWeight:700, color:colors.color2, padding:0}}
                            // defaultButtonText={selectedStore.nom_magasin}
                            defaultButtonText={selectedStoreDetails ? selectedStoreDetails.nom_magasin : "faites votre choix"}

                            rowTextStyle={{fontSize:10}}
                            // rowStyle={{width:20}}
                           />

                        )
                        :
                        (
                            <Picker
                            placeholder={{
                                label: "Choisissez un magasin"
                            }}
                            value={selectedStoreDetails.nom_magasin}

                            // value={selectedStore.nom_magasin}
                            onValueChange={(value) => {
                                const selected = stores.find((store) => store.nom_magasin === value);
    
                                if (selected) {
                                    // dispatch(updateSelectedStore(selected));
                                    dispatch(updateUser({ ...user, storeId: selected.storeId }));
                                    setSelectedStoreDetails(selected);
                                    axios.put(`${API_BASE_URL}/updateOneUser/${user.userId}`, {storeId: selected.storeId})
                                    .then(response => {
                                        // console.log('Le choix du magasin a été mis à jour avec succès dans la base de données');
                                    })
                                    .catch(error => {
                                        console.error('Erreur lors de la mise à jour du choix du magasin dans la base de données (ici) - erreur ici:', error);
                                    });
                                }
                                else {
                                    // console.log('pas de magasin selectionné encore')
                                }}
                            }
                            items={stores.map((store) => ({
                                label: store.nom_magasin,
                                value: store.nom_magasin,
                            }))}
                             style={pickerSelectStyles}
                             doneText='OK'
                        /> 
                        )
                    
                    }

                     {user.role == 'client' || user.role == 'invite' &&
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <View >
                            <Text style={{fontSize:10, color:colors.color1, width:130}}>
                                {selectedStoreDetails.adresse_magasin}   
                            </Text>
                            <Text  style={{fontSize:10, color:colors.color1}}>{selectedStoreDetails.cp_magasin} {selectedStoreDetails.ville_magasin}</Text>
                        </View>
                    </View> 
                    } 
                </View>
            {/* </View> */}
        </View>
   
    )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 12,
    color: colors.color2,
    textAlign:'center',
    marginVertical:2
  },
  inputAndroid: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    color: colors.color1,
  },
});

const pickerStyles = Platform.select({
    ios:  pickerSelectStyles.inputIOS ,  // Styles pour iOS
    android: pickerSelectStyles.inputAndroid   // Styles pour Android
});


export default StorePicker;