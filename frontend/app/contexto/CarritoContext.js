import React, { createContext, useState, useContext } from 'react';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item => 
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(prev => prev.filter(item => item.id !== productoId));
  };

  const actualizarCantidad = (productoId, cantidad) => {
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
    setCarrito([]);
  };

  const obtenerTotal = () => {
    return carrito.reduce((total, item) => {
      const precio = parseFloat(item.precio) || 0;
      return total + (precio * item.cantidad);
    }, 0);
  };

  const obtenerCantidadTotal = () => {
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
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }
  return context;
};