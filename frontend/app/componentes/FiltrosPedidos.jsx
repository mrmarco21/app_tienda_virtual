import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FiltroChip = ({ label, valor, activo, onPress, icono, color }) => (
    <TouchableOpacity
        style={[
            styles.filtroChip,
            activo && styles.filtroActivo,
            activo && { backgroundColor: color }
        ]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <Ionicons
            name={icono}
            size={16}
            color={activo ? '#FFF' : '#6B7280'}
        />
        <Text style={[styles.filtroTexto, activo && styles.filtroTextoActivo]}>
            {label}
        </Text>
        <View style={[styles.contadorBadge, activo && styles.contadorBadgeActivo]}>
            <Text style={[styles.contadorTexto, activo && styles.contadorTextoActivo]}>
                {valor}
            </Text>
        </View>
    </TouchableOpacity>
);

const FiltrosPedidos = ({ filtro, setFiltro, contadores }) => {
    return (
        <View style={styles.filtrosSection}>
            <View style={styles.filtrosTitleContainer}>
                <Ionicons name="funnel-outline" size={16} color="#6B7280" />
                <Text style={styles.filtrosTitle}>Filtrar por estado</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtrosContent}
            >
                <FiltroChip
                    label="Todos"
                    valor={contadores.todos}
                    activo={filtro === 'todos'}
                    onPress={() => setFiltro('todos')}
                    icono="grid-outline"
                    color="#3B82F6"
                />
                <FiltroChip
                    label="Pendientes"
                    valor={contadores.pendiente}
                    activo={filtro === 'pendiente'}
                    onPress={() => setFiltro('pendiente')}
                    icono="time-outline"
                    color="#F59E0B"
                />
                <FiltroChip
                    label="Completados"
                    valor={contadores.completado}
                    activo={filtro === 'completado'}
                    onPress={() => setFiltro('completado')}
                    icono="checkmark-circle-outline"
                    color="#10B981"
                />
                <FiltroChip
                    label="Cancelados"
                    valor={contadores.cancelado}
                    activo={filtro === 'cancelado'}
                    onPress={() => setFiltro('cancelado')}
                    icono="close-circle-outline"
                    color="#EF4444"
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    filtrosSection: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    filtrosTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
        gap: 8,
    },
    filtrosTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    filtrosContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filtroChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 8,
    },
    filtroActivo: {
        borderColor: 'transparent',
    },
    filtroTexto: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
    },
    filtroTextoActivo: {
        color: '#FFFFFF',
    },
    contadorBadge: {
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 24,
        alignItems: 'center',
    },
    contadorBadgeActivo: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    contadorTexto: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
    },
    contadorTextoActivo: {
        color: '#FFFFFF',
    },
});

export default FiltrosPedidos;
