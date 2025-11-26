import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Inicio from './pantallas/01_publicas/Inicio';
import Carrito from './pantallas/01_publicas/Carrito';
import Favoritos from './pantallas/01_publicas/Favoritos';
import Perfil from './pantallas/02_usuario/Perfil';
import DetalleProducto from './pantallas/01_publicas/DetalleProducto';
import ConfirmacionCompra from './pantallas/01_publicas/ConfirmacionCompra';
import GestionProductos from './pantallas/03_admin/GestionProductos';
import FormularioProducto from './pantallas/03_admin/FormularioProducto';
import PanelAdmin from './pantallas/03_admin/PanelAdmin';
import GestionPedidos from './pantallas/03_admin/GestionPedidos';
import Reportes from './pantallas/03_admin/Reportes';
import { Ionicons } from '@expo/vector-icons';
import { useCarrito } from './contexto/CarritoContext';
import { useFavoritos } from './contexto/FavoritosContext';

const NavegacionInterior = () => {
    const { carrito } = useCarrito();
    const { favoritos } = useFavoritos();
    const cantidadCarrito = carrito.length;
    const cantidadFavoritos = favoritos.length;
    const [pantallaActual, setPantallaActual] = useState('Inicio');
    const [parametros, setParametros] = useState({});
    const [historial, setHistorial] = useState([{ pantalla: 'Inicio', params: {} }]);
    const [cargandoInicial, setCargandoInicial] = useState(true);
    const insets = useSafeAreaInsets();

    // Verificar usuario al cargar la app
    useEffect(() => {
        verificarUsuarioInicial();
    }, []);


    // Manejar el botón de retroceso físico
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            // Si estamos en el panel Admin, salir de la app
            if (pantallaActual === 'Admin') {
                return false; // Permite que cierre la app
            }

            // Si hay historial, retroceder
            if (historial.length > 1) {
                navigation.goBack();
                return true; // Previene que cierre la app
            }

            // Si estamos en las pantallas principales (tabs), salir de la app
            const pantallasPrincipales = ['Inicio', 'Carrito', 'Perfil'];
            if (pantallasPrincipales.includes(pantallaActual)) {
                return false; // Permite que cierre la app
            }

            // Si estamos en Favoritos, volver a Inicio
            if (pantallaActual === 'Favoritos') {
                navigation.goBack();
                return true;
            }

            // Para cualquier otra pantalla, retroceder
            navigation.goBack();
            return true;
        });


        return () => backHandler.remove();
    }, [historial, pantallaActual]);


    const verificarUsuarioInicial = async () => {
        try {
            const usuarioString = await AsyncStorage.getItem('usuario');
            if (usuarioString) {
                const usuario = JSON.parse(usuarioString);
                const rolLower = usuario.rol?.toLowerCase() || '';

                console.log('🔍 Verificando usuario al iniciar app:', usuario.email, 'Rol:', usuario.rol);

                // Si es admin o vendedor, redirigir al panel de admin
                if (rolLower === 'admin' || rolLower === 'vendedor') {
                    console.log('✅ Usuario admin detectado, redirigiendo al panel');
                    setPantallaActual('Admin');
                    setHistorial([{ pantalla: 'Admin', params: {} }]);
                }
            }
        } catch (error) {
            console.error('Error al verificar usuario inicial:', error);
        } finally {
            setCargandoInicial(false);
        }
    };

    const navigation = {
        navigate: (pantalla, params = {}) => {
            console.log('📍 Navegando a:', pantalla, params);
            setHistorial(prev => [...prev, { pantalla, params }]);
            setPantallaActual(pantalla);
            setParametros(params);
        },
        goBack: () => {
            if (historial.length > 1) {
                console.log('⬅️ Retrocediendo desde:', pantallaActual);
                const nuevoHistorial = [...historial];
                nuevoHistorial.pop();


                const pantallaAnterior = nuevoHistorial[nuevoHistorial.length - 1];


                setHistorial(nuevoHistorial);
                setPantallaActual(pantallaAnterior.pantalla);
                setParametros(pantallaAnterior.params);
            }
        },
        // Método para resetear a una pantalla específica (útil después de cerrar sesión)
        reset: (pantalla, params = {}) => {
            console.log('🔄 Reseteando navegación a:', pantalla);
            setHistorial([{ pantalla, params }]);
            setPantallaActual(pantalla);
            setParametros(params);
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
            case 'Favoritos':
                return <Favoritos navigation={navigation} />;
            case 'ConfirmacionCompra':
                return <ConfirmacionCompra navigation={navigation} />;
            case 'Perfil':
                return <Perfil navigation={navigation} />;
            case 'Admin':
                return <PanelAdmin navigation={navigation} />;
            case 'GestionProductos':
                return <GestionProductos navigation={navigation} />;
            case 'GestionPedidos':
                return <GestionPedidos navigation={navigation} route={route} />;
            case 'AgregarProducto':
                return <FormularioProducto navigation={navigation} route={route} />;
            case 'EditarProducto':
                return <FormularioProducto navigation={navigation} route={route} />;
            case 'Reportes':
                return <Reportes navigation={navigation} />;
            default:
                return <Inicio navigation={navigation} />;
        }
    };

    const navegarDesdeTab = (pantalla) => {
        console.log('📱 Tab presionado:', pantalla);
        setHistorial([{ pantalla, params: {} }]);
        setPantallaActual(pantalla);
        setParametros({});
    };


    // Determinar si estamos en una pantalla de admin
    const isAdminScreen = ['Admin', 'GestionProductos', 'GestionPedidos', 'AgregarProducto', 'EditarProducto', 'Reportes'].includes(pantallaActual);


    // Mostrar pantalla de carga mientras se verifica el usuario
    if (cargandoInicial) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.contenido}>
                {renderPantalla()}
            </View>


            {/* Barra de navegación inferior - Solo visible en pantallas de usuario */}
            {!isAdminScreen && (
                <View style={[
                    styles.tabBar,
                    { paddingBottom: Math.max(insets.bottom, 8) }
                ]}>
                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => navegarDesdeTab('Inicio')}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={pantallaActual === 'Inicio' ? 'home' : 'home-outline'}
                            size={24}
                            color={pantallaActual === 'Inicio' ? '#3B82F6' : '#6B7280'}
                        />
                        <Text style={[styles.tabText, pantallaActual === 'Inicio' && styles.tabTextActive]}>
                            Inicio
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.tabCarrito}
                        onPress={() => navegarDesdeTab('Carrito')}
                        activeOpacity={0.7}
                    >
                        <View style={[
                            styles.carritoFloating,
                            pantallaActual === 'Carrito' && styles.carritoFloatingActive
                        ]}>
                            <Ionicons
                                name={pantallaActual === 'Carrito' ? 'cart' : 'cart-outline'}
                                size={28}
                                color="#FFFFFF"
                            />
                            {cantidadCarrito > 0 && (
                                <View style={styles.carritoFloatingBadge}>
                                    <Text style={styles.carritoFloatingBadgeText}>
                                        {cantidadCarrito > 99 ? '99+' : cantidadCarrito}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text style={[styles.tabText, pantallaActual === 'Carrito' && styles.tabTextActive]}>
                            Carrito
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => navegarDesdeTab('Perfil')}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={pantallaActual === 'Perfil' ? 'person' : 'person-outline'}
                            size={24}
                            color={pantallaActual === 'Perfil' ? '#3B82F6' : '#6B7280'}
                        />
                        <Text style={[styles.tabText, pantallaActual === 'Perfil' && styles.tabTextActive]}>
                            Perfil
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contenido: {
        flex: 1,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 8,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    tabText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#3B82F6',
        fontWeight: '700',
    },
    tabCarrito: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        marginTop: -28,
    },
    carritoFloating: {
        width: 46,
        height: 46,
        borderRadius: 25,
        backgroundColor: '#60a5fabf',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#60A5FA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
        position: 'relative',
    },
    carritoFloatingActive: {
        backgroundColor: '#3B82F6',
        transform: [{ scale: 1.05 }],
    },
    carritoFloatingBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#EF4444',
        minWidth: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    carritoFloatingBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    loadingText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '600',
    },
});


// Envolver el componente con SafeAreaProvider
const NavegacionSimple = () => {
    return (
        <SafeAreaProvider>
            <NavegacionInterior />
        </SafeAreaProvider>
    );
};


export default NavegacionSimple;