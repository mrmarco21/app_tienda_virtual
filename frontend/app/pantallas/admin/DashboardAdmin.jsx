import { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { obtenerEstadisticas } from '../../servicios/api';

const DashboardAdmin = ({ navigation }) => {
    const [estadisticas, setEstadisticas] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const usuarioData = await AsyncStorage.getItem('usuario');
            if (usuarioData) {
                setUsuario(JSON.parse(usuarioData));
            }

            const datos = await obtenerEstadisticas();
            setEstadisticas(datos);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar las estadísticas');
        } finally {
            setCargando(false);
        }
    };

    const handleCerrarSesion = async () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro que deseas salir?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Salir',
                    onPress: async () => {
                        await AsyncStorage.removeItem('token');
                        await AsyncStorage.removeItem('usuario');
                        navigation.replace('Inicio');
                    },
                },
            ]
        );
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={cargando} onRefresh={cargarDatos} />
            }
        >
            <View style={styles.header}>
                <View>
                    <Text style={styles.saludo}>Hola, {usuario?.nombre || 'Admin'} 👋</Text>
                    <Text style={styles.subtitulo}>Panel de Control</Text>
                </View>
                <TouchableOpacity onPress={handleCerrarSesion} style={styles.botonSalir}>
                    <Text style={styles.textoSalir}>Salir</Text>
                </TouchableOpacity>
            </View>

            {estadisticas && (
                <>
                    <View style={styles.seccion}>
                        <Text style={styles.tituloSeccion}>📊 Resumen de Hoy</Text>
                        <View style={styles.fila}>
                            <View style={[styles.tarjeta, { backgroundColor: '#4CAF50' }]}>
                                <Text style={styles.numeroTarjeta}>{estadisticas.ventasHoy.total}</Text>
                                <Text style={styles.textoTarjeta}>Ventas</Text>
                                <Text style={styles.montoTarjeta}>S/ {estadisticas.ventasHoy.monto.toFixed(2)}</Text>
                            </View>
                            <View style={[styles.tarjeta, { backgroundColor: '#FF9800' }]}>
                                <Text style={styles.numeroTarjeta}>{estadisticas.pedidosPendientes}</Text>
                                <Text style={styles.textoTarjeta}>Pendientes</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.seccion}>
                        <Text style={styles.tituloSeccion}>📈 Este Mes</Text>
                        <View style={styles.tarjetaGrande}>
                            <Text style={styles.numeroGrande}>{estadisticas.ventasMes.total}</Text>
                            <Text style={styles.textoGrande}>Pedidos Totales</Text>
                            <Text style={styles.montoGrande}>S/ {estadisticas.ventasMes.monto.toFixed(2)}</Text>
                        </View>
                    </View>

                    {estadisticas.productosAgotados > 0 && (
                        <View style={styles.alerta}>
                            <Text style={styles.textoAlerta}>
                                ⚠️ {estadisticas.productosAgotados} productos con stock bajo
                            </Text>
                        </View>
                    )}

                    <View style={styles.seccion}>
                        <Text style={styles.tituloSeccion}>🏆 Productos Más Vendidos</Text>
                        {estadisticas.topProductos.map((producto, index) => (
                            <View key={index} style={styles.itemTop}>
                                <Text style={styles.numeroTop}>{index + 1}</Text>
                                <View style={styles.infoTop}>
                                    <Text style={styles.nombreTop}>{producto.nombre}</Text>
                                    <Text style={styles.detalleTop}>
                                        {producto.vendidos} vendidos • S/ {producto.ingresos.toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </>
            )}

            <View style={styles.seccionBotones}>
                <TouchableOpacity
                    style={[styles.botonAccion, { backgroundColor: '#2196F3' }]}
                    onPress={() => navigation.navigate('GestionProductos')}
                >
                    <Text style={styles.iconoBoton}>📦</Text>
                    <Text style={styles.textoBotonAccion}>Productos</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.botonAccion, { backgroundColor: '#9C27B0' }]}
                    onPress={() => navigation.navigate('GestionPedidos')}
                >
                    <Text style={styles.iconoBoton}>📋</Text>
                    <Text style={styles.textoBotonAccion}>Pedidos</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#2196F3',
        padding: 20,
        paddingTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    saludo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitulo: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    botonSalir: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 8,
    },
    textoSalir: {
        color: '#fff',
        fontWeight: 'bold',
    },
    seccion: {
        padding: 20,
    },
    tituloSeccion: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    fila: {
        flexDirection: 'row',
        gap: 15,
    },
    tarjeta: {
        flex: 1,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
    },
    numeroTarjeta: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
    textoTarjeta: {
        fontSize: 14,
        color: '#fff',
        marginTop: 5,
    },
    montoTarjeta: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 5,
    },
    tarjetaGrande: {
        backgroundColor: '#2196F3',
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
    },
    numeroGrande: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
    },
    textoGrande: {
        fontSize: 16,
        color: '#fff',
        marginTop: 10,
    },
    montoGrande: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
    },
    alerta: {
        backgroundColor: '#FFF3CD',
        padding: 15,
        marginHorizontal: 20,
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800',
    },
    textoAlerta: {
        color: '#856404',
        fontSize: 14,
        fontWeight: '600',
    },
    itemTop: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    numeroTop: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2196F3',
        marginRight: 15,
        width: 30,
    },
    infoTop: {
        flex: 1,
    },
    nombreTop: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    detalleTop: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    seccionBotones: {
        flexDirection: 'row',
        padding: 20,
        gap: 15,
    },
    botonAccion: {
        flex: 1,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
    },
    iconoBoton: {
        fontSize: 40,
        marginBottom: 10,
    },
    textoBotonAccion: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DashboardAdmin;
