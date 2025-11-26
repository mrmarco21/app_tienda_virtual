import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const EstadisticasCompactas = ({ estadisticas, onRefresh }) => {
    return (
        <View style={styles.statsSection}>
            <View style={styles.statsSectionHeader}>
                <Text style={styles.sectionMainTitle}>Resumen</Text>
                <TouchableOpacity style={styles.refreshMiniButton} onPress={onRefresh}>
                    <Ionicons name="refresh" size={14} color="#6B7280" />
                </TouchableOpacity>
            </View>

            {/* Grid 2x2 Compacto */}
            <View style={styles.statsGrid}>
                {/* Total Pedidos */}
                <View style={styles.statCardCompact}>
                    <View style={styles.statIconCompact}>
                        <Ionicons name="cube-outline" size={16} color="#3B82F6" />
                    </View>
                    <View style={styles.statContent}>
                        <Text style={styles.statValueCompact}>{estadisticas.totalPedidos}</Text>
                        <Text style={styles.statLabelCompact}>Total Pedidos</Text>
                    </View>
                </View>

                {/* Pendientes */}
                <View style={styles.statCardCompact}>
                    <View style={styles.statIconCompact}>
                        <Ionicons name="time-outline" size={16} color="#F59E0B" />
                    </View>
                    <View style={styles.statContent}>
                        <Text style={styles.statValueCompact}>{estadisticas.pedidosPendientes}</Text>
                        <Text style={styles.statLabelCompact}>Pendientes</Text>
                    </View>
                    {estadisticas.pedidosPendientes > 0 && (
                        <View style={styles.urgentDot} />
                    )}
                </View>

                {/* Productos */}
                <View style={styles.statCardCompact}>
                    <View style={styles.statIconCompact}>
                        <Ionicons name="pricetags-outline" size={16} color="#8B5CF6" />
                    </View>
                    <View style={styles.statContent}>
                        <Text style={styles.statValueCompact}>{estadisticas.totalProductos}</Text>
                        <Text style={styles.statLabelCompact}>Productos</Text>
                    </View>
                </View>

                {/* Ventas Hoy */}
                <View style={styles.statCardCompact}>
                    <View style={styles.statIconCompact}>
                        <Ionicons name="cash-outline" size={16} color="#10B981" />
                    </View>
                    <View style={styles.statContent}>
                        <Text style={styles.statValueCompact}>{estadisticas.ventasHoy}</Text>
                        <Text style={styles.statLabelCompact}>Ventas Hoy</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statsSection: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 6,
        // borderWidth:2, 
        // borderColor: "black"
    },
    statsSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionMainTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111827',
    },
    refreshMiniButton: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    statCardCompact: {
        width: (width - 40) / 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statIconCompact: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    statContent: {
        flex: 1,
        justifyContent: 'center',
    },
    statValueCompact: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        lineHeight: 20,
    },
    statLabelCompact: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '500',
        lineHeight: 12,
    },
    urgentDot: {
        position: 'absolute',
        top: 7,
        right: 7,
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#EF4444',
    },
});

export default EstadisticasCompactas;