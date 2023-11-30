import axios from 'axios';

/**
 * Récupèration du JWT dans le local storage
 */
const getToken = () => localStorage.getItem('token') || null;

/**
 * Création de l'instance axios.
 * Cette instance est utilisée pour toutes les requêtes vers l'API
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Ajout du token dans le header de chaque requête
 * Si le token n'est pas présent, on envoie un token vide.
 * Le backend renverra une erreur 401 si le token est invalide
 */
api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});

export default api;
