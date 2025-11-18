import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EmptyStatePedidos = ({ filtro }) => {
    return (
        <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
                <Ionicons
                    name={filtro === 'todos' ? "receipt-outline" : "filter-outline"}
                    size={64}
                    color="#D1D5DB"
                />
            </View>
            <Text style={styles.emptyText}>
                {filtro === 'todos' ? 'No hay pedidos' : `No hay pedidos ${filtro}s`}
            </Text>
            <Text style={styles.emptySubtext}>
                {filtro === 'todos'
                    ? 'Los pedidos de tus clientes aparecerán aquí'
                    : 'Intenta con otro filtro'
                }
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyState: {
        alignItems: 'center',
        paddingVertical: 80,
        paddingHorizontal: 20,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
    },
});

export default EmptyStatePedidos;
