import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerUsuarios, obtenerPedidosPorEmail } from '../../servicios/api';
import EncabezadoAdmin from '../../componentes/01_basicos/EncabezadoAdmin';
import TarjetaCliente from '../../componentes/02_tarjetas/TarjetaCliente';
import ModalDetalleCliente from '../../componentes/05_modales/ModalDetalleCliente';

const GestionClientes = ({ navigation }) => {
    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [pedidosCliente, setPedidosCliente] = useState([]);

    useEffect(() => {
        cargarClientes();
    }, []);

    const cargarClientes = async () => {
        setCargando(true);
        try {
            const response = await obtenerUsuarios();
            const usuarios = response.data || response || [];
            // Filtrar solo clientes (excluir admins y vendedores)
            const soloClientes = usuarios.filter(usuario => {
                const rolLower = usuario.rol?.toLowerCase() || '';
                return rolLower === 'cliente' || !rolLower;
            });
            setClientes(soloClientes);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
            setClientes([]);
        } finally {
            setCargando(false);
        }
    };

    const handleVerDetalle = async (cliente) => {
        setClienteSeleccionado(cliente);
        setModalVisible(true);

        // Cargar pedidos del cliente
        try {
            const response = await obtenerPedidosPorEmail(cliente.email);
            setPedidosCliente(response.data || []);
        } catch (error) {
            console.error('Error al cargar pedidos del cliente:', error);
            setPedidosCliente([]);
        }
    };

    // Ya no necesitamos filtrar porque solo cargamos clientes
    const clientesFiltrados = clientes;

    return (
        <View style={styles.container}>
            <EncabezadoAdmin
                navigation={navigation}
                titulo="Gestión de Clientes"
                subtitulo={`${clientesFiltrados.length} ${clientesFiltrados.length === 1 ? 'cliente' : 'clientes'}`}
                mostrarBack={true}
                mostrarRefresh={true}
                onRefresh={cargarClientes}
            />

            {/* Lista de clientes */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={cargando} onRefresh={cargarClientes} />
                }
                showsVerticalScrollIndicator={false}
            >
                {clientesFiltrados.length === 0 ? (
                    <View style={styles.estadoVacio}>
                        <Ionicons name="people-outline" size={64} color="#D1D5DB" />
                        <Text style={styles.estadoVacioTexto}>No hay clientes registrados</Text>
                        <Text style={styles.estadoVacioSubtexto}>
                            Aún no hay clientes que hayan creado una cuenta en la tienda
                        </Text>
                    </View>
                ) : (
                    clientesFiltrados.map((cliente, index) => (
                        <TarjetaCliente
                            key={cliente.id}
                            cliente={cliente}
                            esUltimo={index === clientesFiltrados.length - 1}
                            onVerDetalle={handleVerDetalle}
                        />
                    ))
                )}
                <View style={{ height: 20 }} />
            </ScrollView>

            <ModalDetalleCliente
                visible={modalVisible}
                cliente={clienteSeleccionado}
                pedidos={pedidosCliente}
                onClose={() => {
                    setModalVisible(false);
                    setClienteSeleccionado(null);
                    setPedidosCliente([]);
                }}
                navigation={navigation}
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
    estadoVacio: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
    },
    estadoVacioTexto: {
        fontSize: 18,
        fontWeight: '700',
        color: '#6B7280',
        marginTop: 16,
        marginBottom: 8,
    },
    estadoVacioSubtexto: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default GestionClientes;
