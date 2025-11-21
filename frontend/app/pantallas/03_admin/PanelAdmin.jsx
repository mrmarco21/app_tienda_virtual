import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { obtenerPedidos, obtenerProductos } from '../../servicios/api';
import EncabezadoPanelAdmin from '../../componentes/01_basicos/EncabezadoPanelAdmin';
import EstadisticasCompactas from '../../componentes/06_secciones/EstadisticasCompactas';
import AccionesRapidas from '../../componentes/06_secciones/AccionesRapidas';
import PedidosRecientes from '../../componentes/06_secciones/PedidosRecientes';

const PanelAdmin = ({ navigation }) => {
    const [usuario, setUsuario] = useState(null);
    const [estadisticas, setEstadisticas] = useState({
        totalPedidos: 0,
        pedidosPendientes: 0,
        totalProductos: 0,
        ventasHoy: 0
    });
    const [pedidosRecientes, setPedidosRecientes] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        cargarDatosAdmin();
    }, []);

    const cargarDatosAdmin = async () => {
        setCargando(true);
        try {
            const usuarioString = await AsyncStorage.getItem('usuario');
            if (usuarioString) {
                setUsuario(JSON.parse(usuarioString));
            }

            const pedidosData = await obtenerPedidos();
            const pedidos = pedidosData.pedidos || pedidosData.data || [];
            console.log('Pedidos cargados en panel:', pedidos.length);
            setPedidosRecientes(pedidos.slice(0, 5));

            const productosData = await obtenerProductos();
            const datos = productosData.data || productosData || {};
            const productos = datos.activos || datos || [];
            console.log('Productos cargados en panel:', productos.length);

            const pendientes = pedidos.filter(p => p.estado?.toLowerCase() === 'pendiente').length;
            const hoy = new Date().toDateString();
            const ventasHoy = pedidos.filter(p =>
                new Date(p.fecha).toDateString() === hoy
            ).length;

            setEstadisticas({
                totalPedidos: pedidos.length,
                pedidosPendientes: pendientes,
                totalProductos: productos.length,
                ventasHoy: ventasHoy
            });
        } catch (error) {
            console.error('Error al cargar datos:', error);
            Alert.alert('Error', 'No se pudieron cargar las estadísticas');
        } finally {
            setCargando(false);
        }
    };

    const getEstadoColor = (estado) => {
        const estadoLower = estado?.toLowerCase() || '';
        switch (estadoLower) {
            case 'pendiente': return '#F59E0B';
            case 'completado': return '#10B981';
            case 'cancelado': return '#EF4444';
            default: return '#6B7280';
        }
    };

    const getEstadoIcono = (estado) => {
        const estadoLower = estado?.toLowerCase() || '';
        switch (estadoLower) {
            case 'pendiente': return 'time-outline';
            case 'completado': return 'checkmark-done-circle-outline';
            case 'cancelado': return 'close-circle-outline';
            default: return 'document-text-outline';
        }
    };

    return (
        <View style={styles.container}>
            {/* Header con Avatar */}
            <EncabezadoPanelAdmin navigation={navigation} usuario={usuario} />

            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={cargando} onRefresh={cargarDatosAdmin} />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Estadísticas */}
                <EstadisticasCompactas
                    estadisticas={estadisticas}
                    onRefresh={cargarDatosAdmin}
                />

                {/* Acciones Rápidas */}
                <AccionesRapidas navigation={navigation} />

                {/* Pedidos Recientes */}
                <PedidosRecientes
                    pedidos={pedidosRecientes}
                    navigation={navigation}
                    getEstadoColor={getEstadoColor}
                    getEstadoIcono={getEstadoIcono}
                />

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollView: {
        flex: 1,
    },
});

export default PanelAdmin;
