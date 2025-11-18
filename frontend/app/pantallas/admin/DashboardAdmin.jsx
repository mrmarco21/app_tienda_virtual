import { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    Alert,
    Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { obtenerEstadisticas } from '../../servicios/api';

const { width } = Dimensions.get('window');

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
            showsVerticalScrollIndicator={false}
        >
            {/* Header con gradiente */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.saludo}>¡Hola, {usuario?.nombre || 'Admin'}! 👋</Text>
                        <Text style={styles.subtitulo}>Panel de Control Administrativo</Text>
                    </View>
                    <TouchableOpacity onPress={handleCerrarSesion} style={styles.botonSalir}>
                        <Text style={styles.textoSalir}>Salir</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {estadisticas && (
                <>
                    {/* Resumen de Hoy */}
                    <View style={styles.seccion}>
                        <View style={styles.seccionHeader}>
                            <Text style={styles.tituloSeccion}>Resumen de Hoy</Text>
                            <Text style={styles.fechaActual}>
                                {new Date().toLocaleDateString('es-PE', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </Text>
                        </View>

                        <View style={styles.statsGrid}>
                            <View style={[styles.statCard, styles.statVentas]}>
                                <View style={styles.statIconContainer}>
                                    <Text style={styles.statIcon}>💰</Text>
                                </View>
                                <View style={styles.statInfo}>
                                    <Text style={styles.statLabel}>Ventas de Hoy</Text>
                                    <Text style={styles.statNumber}>{estadisticas.ventasHoy.total}</Text>
                                    <Text style={styles.statMonto}>
                                        S/ {estadisticas.ventasHoy.monto.toFixed(2)}
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.statCard, styles.statPendientes]}>
                                <View style={styles.statIconContainer}>
                                    <Text style={styles.statIcon}>⏳</Text>
                                </View>
                                <View style={styles.statInfo}>
                                    <Text style={styles.statLabel}>Pendientes</Text>
                                    <Text style={styles.statNumber}>{estadisticas.pedidosPendientes}</Text>
                                    {estadisticas.pedidosPendientes > 0 && (
                                        <View style={styles.urgenteBadge}>
                                            <Text style={styles.urgenteText}>¡Atención!</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Resumen del Mes */}
                    <View style={styles.seccion}>
                        <View style={styles.seccionHeader}>
                            <Text style={styles.tituloSeccion}>Resumen del Mes</Text>
                            <Text style={styles.mesActual}>
                                {new Date().toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
                            </Text>
                        </View>

                        <View style={styles.mesCard}>
                            <View style={styles.mesIcono}>
                                <Text style={styles.mesIconoText}>📈</Text>
                            </View>
                            <View style={styles.mesInfo}>
                                <View style={styles.mesRow}>
                                    <Text style={styles.mesLabel}>Total de Pedidos</Text>
                                    <Text style={styles.mesValor}>{estadisticas.ventasMes.total}</Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.mesRow}>
                                    <Text style={styles.mesLabel}>Ingresos Totales</Text>
                                    <Text style={styles.mesMonto}>
                                        S/ {estadisticas.ventasMes.monto.toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Alerta de Stock Bajo */}
                    {estadisticas.productosAgotados > 0 && (
                        <View style={styles.alertaContainer}>
                            <View style={styles.alertaIcono}>
                                <Text style={styles.alertaIconoText}>⚠️</Text>
                            </View>
                            <View style={styles.alertaContent}>
                                <Text style={styles.alertaTitulo}>Stock Bajo</Text>
                                <Text style={styles.alertaTexto}>
                                    {estadisticas.productosAgotados} {estadisticas.productosAgotados === 1 ? 'producto' : 'productos'} con inventario bajo
                                </Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.alertaBoton}
                                onPress={() => navigation.navigate('GestionProductos')}
                            >
                                <Text style={styles.alertaBotonTexto}>Ver</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Top Productos */}
                    <View style={styles.seccion}>
                        <View style={styles.seccionHeader}>
                            <Text style={styles.tituloSeccion}>Top Productos</Text>
                            <Text style={styles.subtituloSeccion}>Más vendidos</Text>
                        </View>

                        {estadisticas.topProductos.map((producto, index) => (
                            <View key={index} style={styles.topItem}>
                                <View style={styles.topRank}>
                                    <Text style={[
                                        styles.topRankText,
                                        index === 0 && styles.topRank1,
                                        index === 1 && styles.topRank2,
                                        index === 2 && styles.topRank3,
                                    ]}>
                                        {index + 1}
                                    </Text>
                                </View>
                                <View style={styles.topInfo}>
                                    <Text style={styles.topNombre}>{producto.nombre}</Text>
                                    <View style={styles.topStats}>
                                        <View style={styles.topStat}>
                                            <Text style={styles.topStatIcono}>📦</Text>
                                            <Text style={styles.topStatTexto}>
                                                {producto.vendidos} vendidos
                                            </Text>
                                        </View>
                                        <View style={styles.topStat}>
                                            <Text style={styles.topStatIcono}>💰</Text>
                                            <Text style={styles.topStatTexto}>
                                                S/ {producto.ingresos.toFixed(2)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                {index < 3 && (
                                    <View style={styles.topBadge}>
                                        <Text style={styles.topBadgeText}>
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>

                    {/* Acciones Rápidas */}
                    <View style={styles.seccion}>
                        <Text style={styles.tituloSeccion}>Acciones Rápidas</Text>
                        
                        <View style={styles.accionesGrid}>
                            <TouchableOpacity
                                style={[styles.accionCard, styles.accionProductos]}
                                onPress={() => navigation.navigate('GestionProductos')}
                                activeOpacity={0.7}
                            >
                                <View style={styles.accionIconCircle}>
                                    <Text style={styles.accionIcon}>📦</Text>
                                </View>
                                <Text style={styles.accionTitulo}>Productos</Text>
                                <Text style={styles.accionSubtitulo}>Gestionar inventario</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.accionCard, styles.accionPedidos]}
                                onPress={() => navigation.navigate('GestionPedidos')}
                                activeOpacity={0.7}
                            >
                                <View style={styles.accionIconCircle}>
                                    <Text style={styles.accionIcon}>📋</Text>
                                </View>
                                <Text style={styles.accionTitulo}>Pedidos</Text>
                                <Text style={styles.accionSubtitulo}>Ver y gestionar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            )}

            <View style={{ height: 30 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        backgroundColor: '#3B82F6',
        paddingTop: 50,
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    saludo: {
        fontSize: 26,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    subtitulo: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
        marginTop: 4,
    },
    botonSalir: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    textoSalir: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    seccion: {
        marginHorizontal: 20,
        marginTop: 24,
    },
    seccionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    tituloSeccion: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    subtituloSeccion: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    fechaActual: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    mesActual: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    statCard: {
        flex: 1,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    statVentas: {
        backgroundColor: '#D1FAE5',
    },
    statPendientes: {
        backgroundColor: '#FEF3C7',
    },
    statIconContainer: {
        marginBottom: 12,
    },
    statIcon: {
        fontSize: 32,
    },
    statInfo: {
        gap: 4,
    },
    statLabel: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '600',
    },
    statNumber: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    statMonto: {
        fontSize: 16,
        fontWeight: '600',
        color: '#10B981',
        marginTop: 4,
    },
    urgenteBadge: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    urgenteText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
    },
    mesCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    mesIcono: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    mesIconoText: {
        fontSize: 28,
    },
    mesInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    mesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mesLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    mesValor: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    mesMonto: {
        fontSize: 26,
        fontWeight: '700',
        color: '#3B82F6',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 12,
    },
    alertaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginTop: 24,
        padding: 16,
        borderRadius: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    alertaIcono: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    alertaIconoText: {
        fontSize: 20,
    },
    alertaContent: {
        flex: 1,
    },
    alertaTitulo: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    alertaTexto: {
        fontSize: 13,
        color: '#6B7280',
    },
    alertaBoton: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    alertaBotonTexto: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
    topItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    topRank: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    topRankText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#6B7280',
    },
    topRank1: {
        color: '#F59E0B',
    },
    topRank2: {
        color: '#9CA3AF',
    },
    topRank3: {
        color: '#CD7F32',
    },
    topInfo: {
        flex: 1,
    },
    topNombre: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 6,
    },
    topStats: {
        flexDirection: 'row',
        gap: 16,
    },
    topStat: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    topStatIcono: {
        fontSize: 14,
        marginRight: 4,
    },
    topStatTexto: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    topBadge: {
        marginLeft: 8,
    },
    topBadgeText: {
        fontSize: 24,
    },
    accionesGrid: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 16,
    },
    accionCard: {
        flex: 1,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    accionProductos: {
        backgroundColor: '#DBEAFE',
    },
    accionPedidos: {
        backgroundColor: '#E9D5FF',
    },
    accionIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    accionIcon: {
        fontSize: 28,
    },
    accionTitulo: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    accionSubtitulo: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
});

export default DashboardAdmin;