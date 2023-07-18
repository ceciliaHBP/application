import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

//check des stocks par produits
export const checkStock = async (productId) => {
  try {
    const stockResponse = await axios.get(`${API_BASE_URL}/getStockByProduct/${productId}`);
    const stockByProduct = stockResponse.data;
    return stockByProduct; 
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération du stock :", error);
  }
}
//modifier un user
export const modifyUser = async (userId, userUpdate) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/modifyUser/${userId}`, userUpdate);
    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la mise à jour de l'utilisateur :", error);
    throw error; // Lancer une erreur pour pouvoir la gérer dans votre composant
  }
};

//lister les produits par catégories pour les formules
export const getProductsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getProductsofOneCategory/${category}`);
    return response.data;
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des produits par catégorie:', error);
    throw error;
  }
};

export const fetchOneProduct = async  (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getOneProduct/${id}`);
      return response.data;
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la récupération des produits par catégorie:', error);
      throw error;
    }
};
