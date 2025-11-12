import { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    RefreshControl
} from 'react-native';
import { obtenerPedidos, actualizarEstadoPedido } from '../../servicios/api';

const GestionPedidos = ({ navigation }) => {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtro, setFiltro] = useState('todos');

    useEffect(() => {
        cargarPedidos();
    }, [filtro]);

    const cargarPedidos = async () => {
        try {
            const estado = filtro === 'todos' ? null : filtro;
            const datos = await obtenerPedidos(estado);
            setPedidos(datos.pedidos);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar los pedidos');
        } finally {
            setCargando(false);
        }
    };

    const handleCambiarEstado = (id, estadoActual) => {
        const opciones = ['Pendiente', 'Completado', 'Cancelado']
            .filter(e => e !== estadoActual)
            .map(estado => ({
                text: estado,
                onPress: async () => {
                    try {
                        await actualizarEstadoPedido(id, estado);
                        Alert.alert('Éxito', 'Estado actualizado');
                        cargarPedidos();
                    } catch (error) {
                        Alert.alert('Error', error.message);
                    }
                },
            }));

        Alert.alert('Cambiar Estado', 'Selecciona el nuevo estado:', [
            ...opciones,
            { text: 'Cancelar', style: 'cancel' },
        ]);
    };

    const getColorEstado = (estado) => {
        switch (estado) {
            case 'Pendiente': return '#FF9800';
            case 'Completado': return '#4CAF50';
            case 'Cancelado': return '#F44336';
            default: return '#666';
        }
    };

    const renderPedido = ({ item }) => (
        <TouchableOpacity
            style={styles.tarjeta}
            onPress={() => navigation.navigate('DetallePedido', { pedidoId: item.id })}
        >
            <View style={styles.header}>
                <Text style={styles.id}>Pedido #{item.id}</Text>
                <View style={[styles.badge, { backgroundColor: getColorEstado(item.estado) }]}>
                    <Text style={styles.textoBadge}>{item.estado}</Text>
                </View>
            </View>

            <Text style={styles.cliente}>{item.nombre_cliente}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.productos}>{item.productos || 'Sin productos'}</Text>

            <View style={styles.footer}>
                <Text style={styles.total}>S/ {parseFloat(item.total).toFixed(2)}</Text>
                <Text style={styles.fecha}>
                    {new Date(item.fecha).toLocaleDateString('es-PE')}
                </Text>
            </View>

            <TouchableOpacity
                style={styles.botonCambiar}
                onPress={() => handleCambiarEstado(item.id, item.estado)}
            >
                <Text style={styles.textoCambiar}>Cambiar Estado</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.filtros}>
                {['todos', 'Pendiente', 'Completado', 'Cancelado'].map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filtro, filtro === f && styles.filtroActivo]}
                        onPress={() => setFiltro(f)}
                    >
                        <Text style={[styles.textoFiltro, filtro === f && styles.textoFiltroActivo]}>
                            {f === 'todos' ? 'Todos' : f}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={pedidos}
                renderItem={renderPedido}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={cargando} onRefresh={cargarPedidos} />
                }
                ListEmptyComponent={
                    <Text style={styles.vacio}>No hay pedidos</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    filtros: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        gap: 10,
    },
    filtro: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    filtroActivo: {
        backgroundColor: '#2196F3',
    },
    textoFiltro: {
        fontSize: 14,
        color: '#666',
    },
    textoFiltroActivo: {
        color: '#fff',
        fontWeight: 'bold',
    },
    tarjeta: {
        backgroundColor: '#fff',
        margin: 10,
        padding: 15,
        borderRadius: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    id: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    textoBadge: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    cliente: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    productos: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    total: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    fecha: {
        fontSize: 14,
        color: '#666',
    },
    botonCambiar: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    textoCambiar: {
        color: '#fff',
        fontWeight: 'bold',
    },
    vacio: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#666',
    },
});

export default GestionPedidos;
