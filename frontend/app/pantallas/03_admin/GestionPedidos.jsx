import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { obtenerPedidos, actualizarEstadoPedido } from '../../servicios/api';
import EncabezadoAdmin from '../../componentes/01_basicos/EncabezadoAdmin';
import FiltrosPedidos from '../../componentes/06_secciones/FiltrosPedidos';
import TarjetaPedidoAdmin from '../../componentes/02_tarjetas/TarjetaPedidoAdmin';
import ModalCambiarEstado from '../../componentes/05_modales/ModalCambiarEstado';
import EstadoVacioPedidos from '../../componentes/03_listas/EstadoVacioPedidos';

const GestionPedidos = ({ navigation, route = {} }) => {
    const [pedidos, setPedidos] = useState([]);
    const [filtro, setFiltro] = useState('todos');
    const [cargando, setCargando] = useState(false);

    // Estados para el modal de cambio de estado
    const [modalEstadoVisible, setModalEstadoVisible] = useState(false);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

    // Estados y refs para scroll automático
    const scrollViewRef = useRef(null);
    const pedidoRefs = useRef({});
    const [pedidoDestacado, setPedidoDestacado] = useState(null);
    const scrollRealizadoRef = useRef(false); // Para controlar que solo se haga scroll una vez

    useEffect(() => {
        cargarPedidos();
    }, []);

    // Efecto para scroll automático (solo la primera vez)
    useEffect(() => {
        console.log('🔍 Route.params:', route?.params);

        const pedidoId = route?.params?.pedidoId;

        // Solo hacer scroll si no se ha realizado antes y hay un pedidoId
        if (pedidoId && pedidos.length > 0 && !scrollRealizadoRef.current) {
            console.log('🎯 Pedido ID recibido:', pedidoId);
            setPedidoDestacado(pedidoId);
            scrollRealizadoRef.current = true; // Marcar que ya se hizo el scroll

            setTimeout(() => {
                const pedidoIndex = pedidosFiltrados.findIndex(p => p.id === pedidoId);

                if (pedidoIndex !== -1 && pedidoRefs.current[pedidoId]) {
                    pedidoRefs.current[pedidoId].measureLayout(
                        scrollViewRef.current,
                        (x, y) => {
                            scrollViewRef.current?.scrollTo({
                                y: Math.max(0, y - 20),
                                animated: true
                            });
                        },
                        (error) => console.log('⚠️ Error scroll:', error)
                    );
                }

                setTimeout(() => {
                    setPedidoDestacado(null);
                    // Limpiar el parámetro después del scroll
                    if (navigation?.setParams) {
                        navigation.setParams({ pedidoId: undefined });
                    }
                }, 3000);
            }, 500);
        }
    }, [route?.params?.pedidoId, pedidos]);

    const cargarPedidos = async () => {
        setCargando(true);
        try {
            const response = await obtenerPedidos();
            const pedidosData = response.pedidos || response.data || response || [];
            console.log('Pedidos cargados:', pedidosData.length);

            if (pedidosData.length > 0) {
                console.log('📧 Campos disponibles:', Object.keys(pedidosData[0]));
            }

            setPedidos(Array.isArray(pedidosData) ? pedidosData : []);

            // Limpiar el parámetro de pedidoId si existe al recargar manualmente
            if (navigation?.setParams && route?.params?.pedidoId) {
                navigation.setParams({ pedidoId: undefined });
            }
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
            Alert.alert('Error', 'No se pudieron cargar los pedidos');
            setPedidos([]);
        } finally {
            setCargando(false);
        }
    };

    const abrirModalEstado = (pedido) => {
        setPedidoSeleccionado(pedido);
        setModalEstadoVisible(true);
    };

    const cerrarModalEstado = () => {
        setModalEstadoVisible(false);
        setPedidoSeleccionado(null);
    };

    const confirmarCambioEstado = (nuevoEstado) => {
        Alert.alert(
            'Confirmar cambio',
            `¿Cambiar el pedido #${pedidoSeleccionado.id} a "${nuevoEstado}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    style: nuevoEstado === 'Cancelado' ? 'destructive' : 'default',
                    onPress: () => cambiarEstadoPedido(pedidoSeleccionado.id, nuevoEstado)
                }
            ]
        );
    };

    const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
        try {
            await actualizarEstadoPedido(pedidoId, nuevoEstado);
            Alert.alert('✓ Éxito', `El pedido #${pedidoId} ahora está "${nuevoEstado}"`);
            cerrarModalEstado();
            cargarPedidos();
        } catch (error) {
            Alert.alert('✕ Error', error.message || 'No se pudo actualizar el estado');
        }
    };

    const getEstadoConfig = (estado) => {
        const estadoLower = estado?.toLowerCase() || '';
        switch (estadoLower) {
            case 'pendiente':
                return { color: '#F59E0B', bg: '#FEF3C7', icon: 'time-outline', label: 'Pendiente' };
            case 'completado':
                return { color: '#10B981', bg: '#D1FAE5', icon: 'checkmark-circle-outline', label: 'Completado' };
            case 'cancelado':
                return { color: '#EF4444', bg: '#FEE2E2', icon: 'close-circle-outline', label: 'Cancelado' };
            default:
                return { color: '#6B7280', bg: '#F3F4F6', icon: 'ellipse-outline', label: estado };
        }
    };

    const pedidosArray = Array.isArray(pedidos) ? pedidos : [];
    const pedidosFiltrados = filtro === 'todos'
        ? pedidosArray
        : pedidosArray.filter(p => p.estado?.toLowerCase() === filtro);

    const contadores = {
        todos: pedidosArray.length,
        pendiente: pedidosArray.filter(p => p.estado?.toLowerCase() === 'pendiente').length,
        completado: pedidosArray.filter(p => p.estado?.toLowerCase() === 'completado').length,
        cancelado: pedidosArray.filter(p => p.estado?.toLowerCase() === 'cancelado').length,
    };

    return (
        <View style={styles.container}>
            {/* Header Genérico */}
            <EncabezadoAdmin
                navigation={navigation}
                titulo="Gestión de Pedidos"
                subtitulo={`${pedidosFiltrados.length} ${pedidosFiltrados.length === 1 ? 'pedido' : 'pedidos'}`}
                mostrarBack={true}
                mostrarRefresh={true}
                onRefresh={cargarPedidos}
            />

            {/* Filtros */}
            <FiltrosPedidos
                filtro={filtro}
                setFiltro={setFiltro}
                contadores={contadores}
            />

            {/* Lista de Pedidos */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={cargando} onRefresh={cargarPedidos} />
                }
                showsVerticalScrollIndicator={false}
            >
                {pedidosFiltrados.length === 0 ? (
                    <EstadoVacioPedidos filtro={filtro} />
                ) : (
                    pedidosFiltrados.map((pedido, index) => (
                        <TarjetaPedidoAdmin
                            key={pedido.id}
                            pedido={pedido}
                            esDestacado={pedidoDestacado === pedido.id}
                            esUltimo={index === pedidosFiltrados.length - 1}
                            getEstadoConfig={getEstadoConfig}
                            abrirModalEstado={abrirModalEstado}
                            pedidoRef={(ref) => (pedidoRefs.current[pedido.id] = ref)}
                        />
                    ))
                )}
                <View style={{ height: 20 }} />
            </ScrollView>

            {/* Modal */}
            <ModalCambiarEstado
                visible={modalEstadoVisible}
                pedidoSeleccionado={pedidoSeleccionado}
                getEstadoConfig={getEstadoConfig}
                onClose={cerrarModalEstado}
                onConfirmar={confirmarCambioEstado}
            />
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
    scrollContent: {
        padding: 16,
    },
});

export default GestionPedidos;
