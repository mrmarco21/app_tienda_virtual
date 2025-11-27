import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PedidosRecientes = ({ pedidos, navigation, getEstadoColor, getEstadoIcono }) => {
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <View>
                    <Text style={styles.sectionTitle}>Pedidos Recientes</Text>
                    <Text style={styles.sectionSubtitle}>Últimos 5 pedidos</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('GestionPedidos')}
                    style={styles.viewAllButton}
                    activeOpacity={0.7}
                >
                    <Text style={styles.viewAllText}>Ver todos</Text>
                    <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
                </TouchableOpacity>
            </View>

            {pedidos.length === 0 ? (
                <View style={styles.emptyState}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="file-tray-outline" size={48} color="#D1D5DB" />
                    </View>
                    <Text style={styles.emptyText}>No hay pedidos recientes</Text>
                    <Text style={styles.emptySubtext}>Los nuevos pedidos aparecerán aquí</Text>
                </View>
            ) : (
                pedidos.map((pedido, index) => (
                    <TouchableOpacity
                        key={pedido.id}
                        style={[
                            styles.orderCard,
                            index === pedidos.length - 1 && styles.lastOrderCard
                        ]}
                        onPress={() => {
                            console.log('🔥 Click en pedido ID:', pedido.id);
                            navigation.navigate('GestionPedidos', { pedidoId: pedido.id });
                        }}
                        activeOpacity={0.7}
                    >
                        <View style={styles.orderHeader}>
                            <View style={styles.orderHeaderLeft}>
                                <View style={styles.orderIconContainer}>
                                    <Ionicons name="receipt-outline" size={14} color="#6B7280" />
                                </View>
                                <Text style={styles.orderId}>#{pedido.id}</Text>
                            </View>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: getEstadoColor(pedido.estado) + '15' }
                            ]}>
                                <Ionicons
                                    name={getEstadoIcono(pedido.estado)}
                                    size={12}
                                    color={getEstadoColor(pedido.estado)}
                                />
                                <Text style={[
                                    styles.statusText,
                                    { color: getEstadoColor(pedido.estado) }
                                ]}>
                                    {pedido.estado}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.orderBody}>
                            <View style={styles.orderInfo}>
                                <Ionicons name="person-outline" size={14} color="#9CA3AF" />
                                <Text style={styles.orderInfoText} numberOfLines={1}>
                                    {pedido.nombre_cliente}
                                </Text>
                            </View>
                            <View style={styles.orderInfo}>
                                <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                                <Text style={styles.orderInfoText}>
                                    {new Date(pedido.fecha).toLocaleDateString('es-PE', {
                                        day: '2-digit',
                                        month: 'short'
                                    })}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.orderFooter}>
                            <View style={styles.orderTotalContainer}>
                                <Text style={styles.orderTotalLabel}>Total</Text>
                                <Text style={styles.orderTotal}>
                                    S/ {parseFloat(pedido.total).toFixed(2)}
                                </Text>
                            </View>
                            <View style={styles.orderArrow}>
                                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                            </View>
                        </View>
                    </TouchableOpacity>
                ))
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 16,
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
        letterSpacing:0.8,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    viewAllText: {
        fontSize: 12,
        color: '#3B82F6',
        fontWeight: '700',
        letterSpacing: 1,

    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    lastOrderCard: {
        marginBottom: 0,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    orderHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
    },
    orderIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderId: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        gap: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'capitalize',
    },
    orderBody: {
        marginBottom: 10,
        gap: 6,
    },
    orderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    orderInfoText: {
        fontSize: 13,
        color: '#4B5563',
        flex: 1,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    orderTotalContainer: {
        flex: 1,
    },
    orderTotalLabel: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '600',
        marginBottom: 2,
    },
    orderTotal: {
        fontSize: 18,
        fontWeight: '700',
        color: '#10B981',
    },
    orderArrow: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#F3F4F6',
        borderStyle: 'dashed',
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 6,
    },
    emptySubtext: {
        fontSize: 13,
        color: '#9CA3AF',
        textAlign: 'center',
    },
});

export default PedidosRecientes;