import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const FavoritosContext = createContext();

export const useFavoritos = () => {
    const context = useContext(FavoritosContext);
    if (!context) {
        throw new Error('useFavoritos debe usarse dentro de FavoritosProvider');
    }
    return context;
};

export const FavoritosProvider = ({ children }) => {
    const [favoritos, setFavoritos] = useState([]);

    // Cargar favoritos al iniciar
    useEffect(() => {
        cargarFavoritos();
    }, []);

    const cargarFavoritos = async () => {
        try {
            const favoritosGuardados = await AsyncStorage.getItem('favoritos');
            if (favoritosGuardados) {
                setFavoritos(JSON.parse(favoritosGuardados));
            }
        } catch (error) {
            console.error('Error al cargar favoritos:', error);
        }
    };

    const guardarFavoritos = async (nuevosFavoritos) => {
        try {
            await AsyncStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
            setFavoritos(nuevosFavoritos);
        } catch (error) {
            console.error('Error al guardar favoritos:', error);
        }
    };

    const agregarAFavoritos = (producto) => {
        const yaExiste = favoritos.some(item => item.id === producto.id);
        
        if (yaExiste) {
            Alert.alert(
                'Ya en favoritos',
                'Este producto ya está en tus favoritos',
                [{ text: 'Entendido', style: 'cancel' }]
            );
            return false;
        }

        const nuevosFavoritos = [...favoritos, producto];
        guardarFavoritos(nuevosFavoritos);
        return true;
    };

    const eliminarDeFavoritos = (productoId) => {
        const nuevosFavoritos = favoritos.filter(item => item.id !== productoId);
        guardarFavoritos(nuevosFavoritos);
    };

    const esFavorito = (productoId) => {
        return favoritos.some(item => item.id === productoId);
    };

    const limpiarFavoritos = () => {
        guardarFavoritos([]);
    };

    return (
        <FavoritosContext.Provider
            value={{
                favoritos,
                agregarAFavoritos,
                eliminarDeFavoritos,
                esFavorito,
                limpiarFavoritos,
            }}
        >
            {children}
        </FavoritosContext.Provider>
    );
};
