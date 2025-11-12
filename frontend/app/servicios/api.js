import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cambia esta IP por la IP de tu computadora en la red local
// Para encontrarla: ipconfig (Windows) o ifconfig (Mac/Linux)
const API_BASE_URL = 'http://192.168.18.31:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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

// Usuarios
export const registrarUsuario = async (data) => {
  return api.post('/usuarios/registro', data);
};

export const loginUsuario = async (data) => {
  return api.post('/usuarios/login', data);
};

export default api;
