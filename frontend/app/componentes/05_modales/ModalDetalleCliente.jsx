import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ModalDetalleCliente = ({ visible, cliente, pedidos, onClose, navigation }) => {
    if (!cliente) return null;

    const rolLower = cliente.rol?.toLowerCase() || 'cliente';

    const getRolConfig = () => {
        if (rolLower === 'admin') {
            return {
                label: 'Administrador',
                icon: 'shield-checkmark',
                color: '#DC2626',
                bgColor: '#FEE2E2',
                lightBg: '#FEF2F2'
            };
        }
        if (rolLower === 'vendedor') {
            return {
                label: 'Vendedor',
                icon: 'briefcase',
                color: '#7C3AED',
                bgColor: '#EDE9FE',
                lightBg: '#F5F3FF'
            };
        }
        return {
            label: 'Cliente',
            icon: 'person',
            color: '#059669',
            bgColor: '#D1FAE5',
            lightBg: '#ECFDF5'
        };
    };

    const rolConfig = getRolConfig();

    const totalGastado = pedidos.reduce((sum, pedido) => {
        const estado = pedido.estado?.toLowerCase();
        if (estado === 'completado' || estado === 'pendiente') {
            return sum + parseFloat(pedido.total || 0);
        }
        return sum;
    }, 0);

    const pedidosCompletados = pedidos.filter(p => p.estado?.toLowerCase() === 'completado').length;

    const handleVerPedido = (pedidoId) => {
        onClose();
        navigation.navigate('GestionPedidos', { pedidoId });
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header con gradiente */}
                    <View style={styles.headerWrapper}>
                        <View style={[styles.headerGradient, { backgroundColor: rolConfig.bgColor }]}>
                            <View style={styles.header}>
                                <View style={styles.headerLeft}>
                                    <View style={[styles.avatarContainer, { backgroundColor: 'rgba(255, 255, 255, 0.95)' }]}>
                                        <View style={[styles.avatar, { backgroundColor: rolConfig.bgColor }]}>
                                            <Ionicons name={rolConfig.icon} size={28} color={rolConfig.color} />
                                        </View>
                                    </View>
                                    <View style={styles.headerInfo}>
                                        <Text style={styles.nombre}>{cliente.nombre}</Text>
                                        <View style={styles.rolBadge}>
                                            <View style={[styles.rolDot, { backgroundColor: rolConfig.color }]} />
                                            <Text style={[styles.rolTexto, { color: rolConfig.color }]}>
                                                {rolConfig.label}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={onClose}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="close" size={22} color="#4B5563" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* Decorative wave */}
                        <View style={styles.waveContainer}>
                            <View style={styles.wave} />
                        </View>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Estadísticas destacadas - Ahora primero */}
                        <View style={styles.section}>
                            <View style={styles.statsContainer}>
                                <View style={styles.statCardPrimary}>
                                    <View style={styles.statPrimaryContent}>
                                        <View style={styles.statPrimaryLeft}>
                                            <View style={[styles.statIconLarge, { backgroundColor: '#FEF3C7' }]}>
                                                <Ionicons name="trending-up" size={28} color="#F59E0B" />
                                            </View>
                                            <View>
                                                <Text style={styles.statPrimaryLabel}>Total invertido</Text>
                                                <Text style={styles.statPrimaryValue}>S/ {totalGastado.toFixed(2)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.statsRow}>
                                    <View style={[styles.statCardSecondary, { backgroundColor: '#EFF6FF' }]}>
                                        <View style={styles.statSecondaryIcon}>
                                            <Ionicons name="receipt" size={20} color="#3B82F6" />
                                        </View>
                                        <Text style={styles.statSecondaryValue}>{pedidos.length}</Text>
                                        <Text style={styles.statSecondaryLabel}>Pedidos</Text>
                                    </View>

                                    <View style={[styles.statCardSecondary, { backgroundColor: '#ECFDF5' }]}>
                                        <View style={styles.statSecondaryIcon}>
                                            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                                        </View>
                                        <Text style={styles.statSecondaryValue}>{pedidosCompletados}</Text>
                                        <Text style={styles.statSecondaryLabel}>Completados</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Información de contacto mejorada */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionIconContainer}>
                                    <Ionicons name="information-circle" size={18} color="#3B82F6" />
                                </View>
                                <Text style={styles.sectionTitle}>Información de Contacto</Text>
                            </View>
                            <View style={styles.infoCard}>
                                <View style={styles.infoRow}>
                                    <View style={[styles.infoIconContainer, { backgroundColor: '#EFF6FF' }]}>
                                        <Ionicons name="mail" size={18} color="#3B82F6" />
                                    </View>
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>Email</Text>
                                        <Text style={styles.infoValue}>{cliente.email}</Text>
                                    </View>
                                </View>

                                {cliente.telefono && (
                                    <>
                                        <View style={styles.divider} />
                                        <View style={styles.infoRow}>
                                            <View style={[styles.infoIconContainer, { backgroundColor: '#ECFDF5' }]}>
                                                <Ionicons name="call" size={18} color="#10B981" />
                                            </View>
                                            <View style={styles.infoContent}>
                                                <Text style={styles.infoLabel}>Teléfono</Text>
                                                <Text style={styles.infoValue}>{cliente.telefono}</Text>
                                            </View>
                                        </View>
                                    </>
                                )}

                                <View style={styles.divider} />
                                <View style={styles.infoRow}>
                                    <View style={[styles.infoIconContainer, { backgroundColor: '#F5F3FF' }]}>
                                        <Ionicons name="calendar" size={18} color="#8B5CF6" />
                                    </View>
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>Miembro desde</Text>
                                        <Text style={styles.infoValue}>
                                            {new Date(cliente.created_at || cliente.createdAt).toLocaleDateString('es-PE', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Historial de pedidos mejorado */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionIconContainer}>
                                    <Ionicons name="time" size={18} color="#8B5CF6" />
                                </View>
                                <Text style={styles.sectionTitle}>Actividad Reciente</Text>
                            </View>
                            {pedidos.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <View style={styles.emptyIconContainer}>
                                        <Ionicons name="receipt-outline" size={40} color="#D1D5DB" />
                                    </View>
                                    <Text style={styles.emptyText}>Sin actividad aún</Text>
                                    <Text style={styles.emptySubtext}>
                                        Los pedidos aparecerán aquí
                                    </Text>
                                </View>
                            ) : (
                                <View style={styles.pedidosList}>
                                    {pedidos.slice(0, 5).map((pedido, index) => {
                                        const estadoLower = pedido.estado?.toLowerCase();
                                        let estadoConfig = {
                                            color: '#6B7280',
                                            bg: '#F3F4F6',
                                            icon: 'ellipse'
                                        };

                                        if (estadoLower === 'pendiente') {
                                            estadoConfig = { color: '#F59E0B', bg: '#FEF3C7', icon: 'time' };
                                        } else if (estadoLower === 'completado') {
                                            estadoConfig = { color: '#10B981', bg: '#D1FAE5', icon: 'checkmark-circle' };
                                        } else if (estadoLower === 'cancelado') {
                                            estadoConfig = { color: '#EF4444', bg: '#FEE2E2', icon: 'close-circle' };
                                        }

                                        return (
                                            <TouchableOpacity
                                                key={pedido.id}
                                                style={[
                                                    styles.pedidoItem,
                                                    index === 0 && styles.pedidoItemFirst
                                                ]}
                                                onPress={() => handleVerPedido(pedido.id)}
                                                activeOpacity={0.6}
                                            >
                                                <View style={styles.pedidoContent}>
                                                    <View style={styles.pedidoLeft}>
                                                        <View style={[styles.pedidoIconContainer, { backgroundColor: estadoConfig.bg }]}>
                                                            <Ionicons name="receipt" size={16} color={estadoConfig.color} />
                                                        </View>
                                                        <View style={styles.pedidoInfo}>
                                                            <Text style={styles.pedidoId}>Pedido #{pedido.id}</Text>
                                                            <View style={styles.pedidoMeta}>
                                                                <Ionicons name="calendar-outline" size={11} color="#9CA3AF" />
                                                                <Text style={styles.pedidoFecha}>
                                                                    {new Date(pedido.fecha).toLocaleDateString('es-PE', {
                                                                        day: '2-digit',
                                                                        month: 'short'
                                                                    })}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={styles.pedidoRight}>
                                                        <Text style={styles.pedidoTotal}>
                                                            S/ {parseFloat(pedido.total).toFixed(2)}
                                                        </Text>
                                                        <View style={[styles.estadoBadge, { backgroundColor: estadoConfig.bg }]}>
                                                            <Ionicons name={estadoConfig.icon} size={10} color={estadoConfig.color} />
                                                            <Text style={[styles.estadoTexto, { color: estadoConfig.color }]}>
                                                                {pedido.estado}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.pedidoArrow}>
                                                    <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                    {pedidos.length > 5 && (
                                        <View style={styles.masPedidosContainer}>
                                            <View style={styles.masPedidosDivider} />
                                            <Text style={styles.masTexto}>
                                                +{pedidos.length - 5} pedidos adicionales
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>

                        <View style={{ height: 24 }} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        height: '92%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 12,
        overflow: 'hidden',
    },
    headerWrapper: {
        position: 'relative',
    },
    headerGradient: {
        paddingTop: 20,
        paddingBottom: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        flex: 1,
    },
    nombre: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    rolBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    rolDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    rolTexto: {
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    waveContainer: {
        height: 20,
        overflow: 'hidden',
    },
    wave: {
        height: 40,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        marginTop: -20,
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContent: {
        paddingTop: 4,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
    },
    sectionIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        letterSpacing: -0.2,
    },
    statsContainer: {
        gap: 12,
    },
    statCardPrimary: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    statPrimaryContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statPrimaryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    statIconLarge: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statPrimaryLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 4,
        letterSpacing: 0.3,
    },
    statPrimaryValue: {
        fontSize: 26,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.5,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    statCardSecondary: {
        flex: 1,
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    statSecondaryIcon: {
        marginBottom: 8,
    },
    statSecondaryValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 2,
        letterSpacing: -0.3,
    },
    statSecondaryLabel: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '600',
        textAlign: 'center',
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 12,
    },
    infoIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '600',
        marginBottom: 3,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderStyle: 'dashed',
    },
    emptyIconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
    },
    pedidosList: {
        gap: 10,
    },
    pedidoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 14,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    pedidoItemFirst: {
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    pedidoContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pedidoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    pedidoIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pedidoInfo: {
        flex: 1,
    },
    pedidoId: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 3,
    },
    pedidoMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    pedidoFecha: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    pedidoRight: {
        alignItems: 'flex-end',
        gap: 5,
    },
    pedidoTotal: {
        fontSize: 15,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.2,
    },
    estadoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    estadoTexto: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'capitalize',
    },
    pedidoArrow: {
        marginLeft: 8,
    },
    masPedidosContainer: {
        alignItems: 'center',
        paddingTop: 12,
    },
    masPedidosDivider: {
        width: '30%',
        height: 2,
        backgroundColor: '#E5E7EB',
        borderRadius: 1,
        marginBottom: 10,
    },
    masTexto: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '600',
        letterSpacing: 0.2,
    },
});

export default ModalDetalleCliente;
