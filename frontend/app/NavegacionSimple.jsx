import { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Inicio from './pantallas/Inicio';
import Carrito from './pantallas/Carrito';
import Perfil from './pantallas/Perfil';
import DetalleProducto from './pantallas/DetalleProducto';
import ConfirmacionCompra from './pantallas/ConfirmacionCompra';

const NavegacionSimple = () => {
    const [pantallaActual, setPantallaActual] = useState('Inicio');
    const [parametros, setParametros] = useState({});
    // Nuevo: historial de navegación
    const [historial, setHistorial] = useState([{ pantalla: 'Inicio', params: {} }]);

    const navigation = {
        navigate: (pantalla, params = {}) => {
            // Agregar la pantalla actual al historial
            setHistorial(prev => [...prev, { pantalla, params }]);
            setPantallaActual(pantalla);
            setParametros(params);
        },
        // Nuevo: implementar goBack
        goBack: () => {
            if (historial.length > 1) {
                // Crear una copia del historial sin el último elemento
                const nuevoHistorial = [...historial];
                nuevoHistorial.pop(); // Eliminar la pantalla actual
                
                const pantallaAnterior = nuevoHistorial[nuevoHistorial.length - 1];
                
                setHistorial(nuevoHistorial);
                setPantallaActual(pantallaAnterior.pantalla);
                setParametros(pantallaAnterior.params);
            }
        }
    };

    const route = {
        params: parametros
    };

    const renderPantalla = () => {
        switch (pantallaActual) {
            case 'Inicio':
                return <Inicio navigation={navigation} />;
            case 'DetalleProducto':
                return <DetalleProducto navigation={navigation} route={route} />;
            case 'Carrito':
                return <Carrito navigation={navigation} />;
            case 'ConfirmacionCompra':
                return <ConfirmacionCompra navigation={navigation} />;
            case 'Perfil':
                return <Perfil navigation={navigation} />;
            default:
                return <Inicio navigation={navigation} />;
        }
    };

    // Modificar las pestañas para reiniciar el historial cuando se navega desde el tab bar
    const navegarDesdeTab = (pantalla) => {
        setHistorial([{ pantalla, params: {} }]);
        setPantallaActual(pantalla);
        setParametros({});
    };

    return (
        <View style={styles.container}>
            <View style={styles.contenido}>
                {renderPantalla()}
            </View>

            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => navegarDesdeTab('Inicio')}
                >
                    <Text style={styles.tabIcon}>🏠</Text>
                    <Text style={[styles.tabText, pantallaActual === 'Inicio' && styles.tabTextActive]}>
                        Inicio
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => navegarDesdeTab('Carrito')}
                >
                    <Text style={styles.tabIcon}>🛒</Text>
                    <Text style={[styles.tabText, pantallaActual === 'Carrito' && styles.tabTextActive]}>
                        Carrito
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => navegarDesdeTab('Perfil')}
                >
                    <Text style={styles.tabIcon}>👤</Text>
                    <Text style={[styles.tabText, pantallaActual === 'Perfil' && styles.tabTextActive]}>
                        Perfil
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contenido: {
        flex: 1,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingBottom: 5,
        paddingTop: 5,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    tabIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    tabText: {
        fontSize: 12,
        color: '#666',
    },
    tabTextActive: {
        color: '#2196F3',
        fontWeight: 'bold',
    },
});

export default NavegacionSimple;