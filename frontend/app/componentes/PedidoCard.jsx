import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PedidoCard = ({ pedido, getEstadoColor, getEstadoIcono, onVerDetalle }) => {
    return (
        <View style={styles.pedidoCardModerno}>
            {/* Header del pedido */}
            <View style={styles.pedidoHeaderModerno}>
                <View style={styles.pedidoIdContainer}>
                    <Ionicons name="receipt" size={16} color="#6B7280" />
                    <Text style={styles.pedidoId}>Pedido #{pedido.id}</Text>
                </View>
                <View style={[
                    styles.estadoBadgeModerno,
                    { backgroundColor: getEstadoColor(pedido.estado) }
                ]}>
                    <Ionicons
                        name={getEstadoIcono(pedido.estado)}
                        size={12}
                        color="#FFF"
                    />
                    <Text style={styles.estadoTextoModerno}>{pedido.estado}</Text>
                </View>
            </View>

            {/* Fecha */}
            <View style={styles.pedidoFecha}>
                <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                <Text style={styles.pedidoFechaTexto}>
                    {new Date(pedido.fecha).toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}
                </Text>
            </View>

            {/* Footer con total y botón */}
            <View style={styles.pedidoFooterModerno}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <View style={styles.totalPrecioContainer}>
                        <Text style={styles.totalMoneda}>S/</Text>
                        <Text style={styles.totalPrecio}>
                            {parseFloat(pedido.total).toFixed(2)}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity 
                    style={styles.botonVerDetalle}
                    activeOpacity={0.7}
                    onPress={() => onVerDetalle(pedido)}
                >
                    <Text style={styles.botonVerDetalleTexto}>Ver detalles</Text>
                    <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    pedidoCardModerno: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    pedidoHeaderModerno: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    pedidoIdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    pedidoId: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    estadoBadgeModerno: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    estadoTextoModerno: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    pedidoFecha: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    pedidoFechaTexto: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    pedidoFooterModerno: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    totalContainer: {
        flex: 1,
    },
    totalLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
        marginBottom: 4,
    },
    totalPrecioContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    totalMoneda: {
        fontSize: 14,
        color: '#1A1A1A',
        fontWeight: '600',
        marginRight: 2,
    },
    totalPrecio: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    botonVerDetalle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 4,
    },
    botonVerDetalleTexto: {
        fontSize: 13,
        fontWeight: '700',
        color: '#3B82F6',
    },
});

export default PedidoCard;