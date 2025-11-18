import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PedidoCard from './PedidoCard';

const ListaPedidos = ({ 
    pedidos, 
    expandido, 
    onToggleExpandir, 
    getEstadoColor, 
    getEstadoIcono, 
    onVerDetalle,
    navigation 
}) => {
    if (pedidos.length === 0) {
        return (
            <View style={styles.sinPedidos}>
                <View style={styles.sinPedidosIconContainer}>
                    <Ionicons name="bag-outline" size={60} color="#D1D5DB" />
                </View>
                <Text style={styles.sinPedidosTexto}>No tienes pedidos aún</Text>
                <Text style={styles.sinPedidosSubtexto}>
                    Explora nuestros productos y realiza tu primera compra
                </Text>
                <TouchableOpacity
                    style={styles.botonSecundario}
                    onPress={() => navigation.navigate('Inicio')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="storefront-outline" size={18} color="#3B82F6" />
                    <Text style={styles.textoBotonSecundario}>Empezar a comprar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.seccion}>
            <View style={styles.seccionHeader}>
                <Ionicons name="receipt-outline" size={24} color="#3B82F6" />
                <View style={styles.seccionHeaderTexto}>
                    <Text style={styles.seccionTitulo}>Mis Pedidos</Text>
                    <Text style={styles.seccionSubtitulo}>
                        {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.botonExpandir}
                    onPress={onToggleExpandir}
                    activeOpacity={0.7}
                >
                    <Ionicons 
                        name={expandido ? "chevron-up" : "chevron-down"} 
                        size={24} 
                        color="#3B82F6" 
                    />
                </TouchableOpacity>
            </View>

            {expandido ? (
                <View style={styles.pedidosContainer}>
                    {pedidos.map((pedido) => (
                        <PedidoCard
                            key={pedido.id}
                            pedido={pedido}
                            getEstadoColor={getEstadoColor}
                            getEstadoIcono={getEstadoIcono}
                            onVerDetalle={onVerDetalle}
                        />
                    ))}
                </View>
            ) : (
                <View style={styles.pedidosColapsadoContainer}>
                    <View style={styles.resumenPedidos}>
                        <Ionicons name="cube-outline" size={40} color="#3B82F6" />
                        <Text style={styles.resumenPedidosTexto}>
                            Tienes {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.botonVerTodos}
                        onPress={onToggleExpandir}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.botonVerTodosTexto}>Ver todos mis pedidos</Text>
                        <Ionicons name="arrow-forward" size={18} color="#3B82F6" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    seccion: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    seccionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        gap: 12,
    },
    seccionHeaderTexto: {
        flex: 1,
    },
    seccionTitulo: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    seccionSubtitulo: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    botonExpandir: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sinPedidos: {
        alignItems: 'center',
        padding: 40,
    },
    sinPedidosIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    sinPedidosTexto: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    sinPedidosSubtexto: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    botonSecundario: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#3B82F6',
        gap: 8,
    },
    textoBotonSecundario: {
        color: '#3B82F6',
        fontSize: 16,
        fontWeight: '700',
    },
    pedidosColapsadoContainer: {
        padding: 20,
        alignItems: 'center',
    },
    resumenPedidos: {
        alignItems: 'center',
        marginBottom: 20,
    },
    resumenPedidosTexto: {
        fontSize: 15,
        color: '#6B7280',
        fontWeight: '500',
        marginTop: 12,
    },
    botonVerTodos: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        gap: 8,
    },
    botonVerTodosTexto: {
        fontSize: 14,
        fontWeight: '700',
        color: '#3B82F6',
    },
    pedidosContainer: {
        padding: 16,
        gap: 16,
    },
});

export default ListaPedidos;