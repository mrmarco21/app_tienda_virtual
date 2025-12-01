import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configuración de la API
const API_CONFIG = {
  // IP de tu computadora en la red local
  LOCAL_IP: '10.149.99.182',
  PORT: 3000,
};

/**
 * Obtiene la URL base de la API según el entorno
 */
export const getApiBaseUrl = () => {
  // 1. Intentar obtener desde app.json (extra.apiUrl)
  const configUrl = Constants?.expoConfig?.extra?.apiUrl;
  if (configUrl) {
    console.log('📡 Usando URL desde app.json:', configUrl);
    return configUrl;
  }

  // 2. Configuración por defecto según plataforma
  const { LOCAL_IP, PORT } = API_CONFIG;
  
  if (Platform.OS === 'android') {
    // Para emulador Android usa 10.0.2.2
    // Para dispositivo físico usa la IP local
    const url = `http://${LOCAL_IP}:${PORT}/api`;
    console.log('📡 Usando URL para Android:', url);
    return url;
  }
  
  if (Platform.OS === 'ios') {
    // Para iOS usa la IP local
    const url = `http://${LOCAL_IP}:${PORT}/api`;
    console.log('📡 Usando URL para iOS:', url);
    return url;
  }
  
  // Para web usa localhost
  const url = `http://localhost:${PORT}/api`;
  console.log('📡 Usando URL para Web:', url);
  return url;
};

export const API_BASE_URL = getApiBaseUrl();

// Configuración de timeouts
export const TIMEOUTS = {
  DEFAULT: 10000,      // 10 segundos
  UPLOAD: 60000,       // 60 segundos para subida de imágenes
  DOWNLOAD: 30000,     // 30 segundos para descargas
};

export default {
  API_BASE_URL,
  TIMEOUTS,
  getApiBaseUrl,
};