import React, { createContext, useState, useContext } from 'react';

/* 
  📌 Se importan las funciones necesarias de React:
    - createContext: para crear un contexto global
    - useState: para manejar el estado del carrito
    - useContext: para acceder al contexto desde otros componentes
*/

const CarritoContext = createContext();
/* 
  📌 Se crea un contexto llamado CarritoContext.
  Este contexto permitirá compartir datos del carrito en toda la app sin pasar props manualmente.
*/

export const CarritoProvider = ({ children }) => {
  /* 
    📌 El proveedor del contexto envuelve toda la app y permite que sus hijos accedan al carrito.
  */

  const [carrito, setCarrito] = useState([]);
  /* 
     📌 Estado principal del carrito:
        - carrito: array de productos añadidos.
        - setCarrito: función para actualizar el carrito.
  */

  const agregarAlCarrito = (producto) => {
    /* 
      📌 Función para agregar productos al carrito.
      Si el producto ya existe, aumenta su cantidad.
      Si no, lo agrega por primera vez.
    */

    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      // 🔍 Busca si el producto ya está en el carrito

      if (existe) {
        // 🔄 Si ya existe, aumenta la cantidad en 1
        return prev.map(item => 
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      // 🆕 Si no existe, lo agrega con cantidad = 1
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (productoId) => {
    /* 
      🗑️ Elimina un producto del carrito según su ID 
    */
    setCarrito(prev => prev.filter(item => item.id !== productoId));
  };

  const actualizarCantidad = (productoId, cantidad) => {
    /* 
      🔧 Actualiza la cantidad de un producto en el carrito.
      Si la cantidad es 0 o menor, elimina el producto.
    */

    if (cantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }

    setCarrito(prev => 
      prev.map(item => 
        item.id === productoId 
          ? { ...item, cantidad }
          : item
      )
    );
  };

  const vaciarCarrito = () => {
    /* 
      🧹 Vacía completamente el carrito 
    */
    setCarrito([]);
  };

  const obtenerTotal = () => {
    /* 
      💰 Calcula el total a pagar:
      - Convierte el precio a número por seguridad
      - Multiplica precio * cantidad de cada item
      - Suma todos los totales
    */
    return carrito.reduce((total, item) => {
      const precio = parseFloat(item.precio) || 0;
      return total + (precio * item.cantidad);
    }, 0);
  };

  const obtenerCantidadTotal = () => {
    /* 
      🔢 Obtiene la suma total de unidades en el carrito.
      Ej: 2 celulares + 1 mouse = 3
    */
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  };

  return (
    <CarritoContext.Provider value={{ 
      carrito, 
      agregarAlCarrito, 
      eliminarDelCarrito,
      actualizarCantidad,
      vaciarCarrito,
      obtenerTotal,
      obtenerCantidadTotal
    }}>
      {/* 
        📌 Aquí se renderizan los componentes hijos.
        Gracias al Provider, todos ellos podrán usar el carrito.
      */}
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  /* 
    📌 Hook personalizado para acceder fácilmente al contexto del carrito.
    En vez de usar useContext(CarritoContext) en cada archivo,
    solo llamas a useCarrito().
  */
  const context = useContext(CarritoContext);

  if (!context) {
    // ⚠️ Por seguridad, se obliga a usar el hook dentro del Provider
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }

  return context;
};
