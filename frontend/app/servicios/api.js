import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { API_BASE_URL, TIMEOUTS } from '../config/api.config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUTS.DEFAULT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const mensaje = error.response?.data?.error || error.message || 'Error de conexión';
    return Promise.reject(new Error(mensaje));
  }
);

// Autenticación
export const login = async (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const registro = async (nombre, email, password) => {
  return api.post('/auth/registro', { nombre, email, password });
};

export const verificarToken = async () => {
  return api.get('/auth/verificar');
};

// Productos
export const obtenerProductos = async () => {
  return api.get('/productos');
};

export const obtenerProducto = async (id) => {
  return api.get(`/productos/${id}`);
};

export const buscarProductos = async (query, categoria) => {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (categoria) params.append('categoria', categoria);
  return api.get(`/productos/buscar?${params.toString()}`);
};

export const obtenerCategorias = async () => {
  return api.get('/productos/categorias');
};

export const crearProducto = async (data) => {
  return api.post('/productos', data);
};

export const actualizarProducto = async (id, data) => {
  return api.put(`/productos/${id}`, data);
};

export const eliminarProducto = async (id) => {
  return api.delete(`/productos/${id}`);
};

export const reactivarProducto = async (id) => {
  return api.patch(`/productos/${id}/reactivar`);
};

// Pedidos
export const crearPedido = async (data) => {
  return api.post('/pedidos', data);
};

export const obtenerPedidos = async (estado = null) => {
  const params = estado ? `?estado=${estado}` : '';
  return api.get(`/pedidos${params}`);
};

export const obtenerPedido = async (id) => {
  return api.get(`/pedidos/${id}`);
};

export const actualizarEstadoPedido = async (id, estado) => {
  return api.put(`/pedidos/${id}/estado`, { estado });
};

export const obtenerEstadisticas = async () => {
  return api.get('/pedidos/estadisticas');
};

export const obtenerPedidosPorEmail = async (email) => {
  return api.get(`/usuarios/pedidos/${email}`);
};

// Direcciones
export const obtenerDirecciones = async (usuarioId) => {
  return api.get(`/direcciones/usuario/${usuarioId}`);
};

export const crearDireccion = async (data) => {
  return api.post('/direcciones', data);
};

export const actualizarDireccion = async (id, data) => {
  return api.put(`/direcciones/${id}`, data);
};

export const eliminarDireccion = async (id) => {
  return api.delete(`/direcciones/${id}`);
};

export const establecerDireccionPrincipal = async (id) => {
  return api.patch(`/direcciones/${id}/principal`);
};

// Usuarios
export const registrarUsuario = async (data) => {
  return api.post('/usuarios/registro', data);
};

export const loginUsuario = async (data) => {
  return api.post('/usuarios/login', data);
};

export const obtenerUsuarios = async () => {
  return api.get('/usuarios');
};

// Subir imagen
export const subirImagen = async (imageUri) => {
  try {
    console.log('📤 Iniciando subida de imagen...');
    console.log('URI:', imageUri);
    
    const formData = new FormData();
    
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('imagen', {
      uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
      name: filename,
      type: type,
    });

    // Obtener el token manualmente
    const token = await AsyncStorage.getItem('token');
    console.log('Token presente:', !!token);

    // Usar axios directamente con configuración completa
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/upload-imagen`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : '',
        'Accept': 'application/json',
      },
      timeout: TIMEOUTS.UPLOAD,
      transformRequest: (data, headers) => {
        // No transformar FormData
        return data;
      },
    });

    console.log('✅ Imagen subida exitosamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error al subir imagen:', error.message);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
      throw new Error(error.response.data.message || 'Error al subir la imagen');
    }
    throw error;
  }
};

export default api;
