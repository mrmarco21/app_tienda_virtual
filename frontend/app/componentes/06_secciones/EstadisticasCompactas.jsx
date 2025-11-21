import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const EstadisticasCompactas = ({ estadisticas, onRefresh }) => {
    return (
        <View style={styles.statsSection}>
            <View style={styles.statsSectionHeader}>
                <Text style={styles.sectionMainTitle}>Resumen</Text>
                <TouchableOpacity style={styles.refreshMiniButton} onPress={onRefresh}>
                    <Ionicons name="refresh" size={16} color="#3B82F6" />
                </TouchableOpacity>
            </View>

            {/* Grid 2x2 Compacto */}
            <View style={styles.statsGrid}>
                {/* Total Pedidos */}
                <View style={[styles.statCardCompact, styles.statCard1]}>
                    <View style={styles.statHeader}>
                        <View style={styles.statIconCompact}>
                            <Ionicons name="cube-outline" size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.statValueCompact}>{estadisticas.totalPedidos}</Text>
                    </View>
                    <Text style={styles.statLabelCompact}>Total Pedidos</Text>
                </View>

                {/* Pendientes */}
                <View style={[styles.statCardCompact, styles.statCard2]}>
                    <View style={styles.statHeader}>
                        <View style={styles.statIconCompact}>
                            <Ionicons name="time-outline" size={20} color="#F59E0B" />
                        </View>
                        <Text style={styles.statValueCompact}>{estadisticas.pedidosPendientes}</Text>
                    </View>
                    <Text style={styles.statLabelCompact}>Pendientes</Text>
                    {estadisticas.pedidosPendientes > 0 && (
                        <View style={styles.urgentDot} />
                    )}
                </View>

                {/* Productos */}
                <View style={[styles.statCardCompact, styles.statCard3]}>
                    <View style={styles.statHeader}>
                        <View style={styles.statIconCompact}>
                            <Ionicons name="pricetags-outline" size={20} color="#8B5CF6" />
                        </View>
                        <Text style={styles.statValueCompact}>{estadisticas.totalProductos}</Text>
                    </View>
                    <Text style={styles.statLabelCompact}>Productos</Text>
                </View>

                {/* Ventas Hoy */}
                <View style={[styles.statCardCompact, styles.statCard4]}>
                    <View style={styles.statHeader}>
                        <View style={styles.statIconCompact}>
                            <Ionicons name="cash-outline" size={20} color="#10B981" />
                        </View>
                        <Text style={styles.statValueCompact}>{estadisticas.ventasHoy}</Text>
                    </View>
                    <Text style={styles.statLabelCompact}>Ventas Hoy</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statsSection: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 12,
    },
    statsSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionMainTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    refreshMiniButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statCardCompact: {
        width: (width - 44) / 2,
        backgroundColor: '#eeeeeeda',
        borderRadius: 12,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        position: 'relative',
    },
    statCard1: {
        borderLeftWidth: 3,
        borderLeftColor: '#3B82F6',
    },
    statCard2: {
        borderLeftWidth: 3,
        borderLeftColor: '#F59E0B',
    },
    statCard3: {
        borderLeftWidth: 3,
        borderLeftColor: '#8B5CF6',
    },
    statCard4: {
        borderLeftWidth: 3,
        borderLeftColor: '#10B981',
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    statIconCompact: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValueCompact: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    statLabelCompact: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    urgentDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
    },
});

export default EstadisticasCompactas;