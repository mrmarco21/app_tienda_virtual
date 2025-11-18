import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PedidoCardAdmin = ({ 
    pedido, 
    esDestacado, 
    esUltimo, 
    getEstadoConfig, 
    abrirModalEstado,
    pedidoRef 
}) => {
    const estadoConfig = getEstadoConfig(pedido.estado);

    return (
        <View
            ref={pedidoRef}
            style={[
                styles.pedidoCard,
                esUltimo && styles.lastPedidoCard,
                esDestacado && styles.pedidoCardDestacado
            ]}
        >
            {/* Header del pedido */}
            <View style={styles.pedidoHeader}>
                <View style={styles.pedidoHeaderLeft}>
                    <View style={styles.pedidoIdContainer}>
                        <Ionicons name="receipt" size={18} color="#6B7280" />
                        <Text style={styles.pedidoId}>#{pedido.id}</Text>
                        {esDestacado && (
                            <View style={styles.nuevoBadge}>
                                <Ionicons name="arrow-down" size={10} color="#FFF" />
                            </View>
                        )}
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.estadoBadge, { backgroundColor: estadoConfig.bg }]}
                    onPress={() => abrirModalEstado(pedido)}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={estadoConfig.icon}
                        size={14}
                        color={estadoConfig.color}
                    />
                    <Text style={[styles.estadoTexto, { color: estadoConfig.color }]}>
                        {estadoConfig.label}
                    </Text>
                    <Ionicons
                        name="chevron-down"
                        size={14}
                        color={estadoConfig.color}
                    />
                </TouchableOpacity>
            </View>

            {/* Sección: Información del Cliente */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="person" size={16} color="#3B82F6" />
                    <Text style={styles.sectionTitle}>Información del Cliente</Text>
                </View>

                <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                        <View style={styles.infoIconContainer}>
                            <Ionicons name="person-outline" size={16} color="#6B7280" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Nombre</Text>
                            <Text style={styles.infoTexto}>
                                {pedido.nombre_cliente || pedido.nombre || 'Sin nombre'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <View style={styles.infoIconContainer}>
                            <Ionicons name="mail-outline" size={16} color="#6B7280" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoTexto} numberOfLines={1}>
                                {pedido.email || pedido.email_cliente || 'Sin email'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <View style={styles.infoIconContainer}>
                            <Ionicons name="call-outline" size={16} color="#6B7280" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Teléfono</Text>
                            <Text style={styles.infoTexto}>
                                {pedido.telefono || 'Sin teléfono'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Sección: Entrega */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="location" size={16} color="#8B5CF6" />
                    <Text style={styles.sectionTitle}>Dirección de Entrega</Text>
                </View>
                <View style={styles.direccionContainer}>
                    <Ionicons name="navigate-outline" size={16} color="#9CA3AF" />
                    <Text style={styles.direccionTexto}>
                        {pedido.direccion || 'Sin dirección'}
                    </Text>
                </View>
            </View>

            {/* Footer del pedido */}
            <View style={styles.pedidoFooter}>
                <View style={styles.footerInfo}>
                    <View style={styles.footerItem}>
                        <Ionicons name="card-outline" size={16} color="#9CA3AF" />
                        <Text style={styles.footerLabel}>Pago</Text>
                        <Text style={styles.footerValue}>
                            {pedido.metodo_pago || 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.footerDivider} />
                    <View style={styles.footerItem}>
                        <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
                        <Text style={styles.footerLabel}>Fecha</Text>
                        <Text style={styles.footerValue}>
                            {new Date(pedido.fecha).toLocaleDateString('es-PE', {
                                day: '2-digit',
                                month: 'short'
                            })}
                        </Text>
                    </View>
                </View>
                <View style={styles.totalCard}>
                    <Text style={styles.totalLabel}>Total del Pedido</Text>
                    <Text style={styles.totalValor}>
                        S/ {parseFloat(pedido.total).toFixed(2)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    pedidoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    lastPedidoCard: {
        marginBottom: 0,
    },
    pedidoCardDestacado: {
        borderWidth: 2,
        borderColor: '#3B82F6',
        backgroundColor: '#EFF6FF',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    pedidoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    pedidoHeaderLeft: {
        flex: 1,
    },
    pedidoIdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    pedidoId: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    nuevoBadge: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    estadoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        gap: 6,
    },
    estadoTexto: {
        fontSize: 13,
        fontWeight: '700',
    },
    section: {
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    infoGrid: {
        gap: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    infoIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
        marginBottom: 2,
    },
    infoTexto: {
        fontSize: 14,
        color: '#1A1A1A',
        fontWeight: '600',
    },
    direccionContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 12,
        gap: 8,
    },
    direccionTexto: {
        flex: 1,
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    pedidoFooter: {
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    footerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 12,
    },
    footerItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    footerDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 12,
    },
    footerLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    footerValue: {
        fontSize: 13,
        color: '#1A1A1A',
        fontWeight: '600',
    },
    totalCard: {
        backgroundColor: '#ECFDF5',
        padding: 12,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 13,
        color: '#059669',
        fontWeight: '600',
    },
    totalValor: {
        fontSize: 24,
        fontWeight: '700',
        color: '#10B981',
    },
});

export default PedidoCardAdmin;